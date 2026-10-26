//! Throwaway SP-TW1 tripwire. `make <dir> <n>` creates n small files. `watch <root> <threshold> <window_ms> <buf_kb>
//! <name=pid,...>` watches <root> with ReadDirectoryChangesW, counts deletions per top-level folder (one folder per
//! session), and when a folder passes <threshold> deletions inside <window_ms> it kills that session's process tree
//! and verifies it is gone. A buffer overflow (0 bytes returned) triggers a recount by enumeration, so a burst can't
//! be missed. Prints one JSON line per event. Not product code.
use std::collections::{HashMap, HashSet, VecDeque};
use std::sync::Mutex;
use std::path::{Path, PathBuf};
use std::time::{Duration, Instant};
use windows::core::PCWSTR;
use windows::Win32::Foundation::*;
use windows::Win32::Storage::FileSystem::*;
use windows::Win32::System::Diagnostics::ToolHelp::*;
use windows::Win32::System::Threading::*;

fn wide(s: &Path) -> Vec<u16> {
    s.as_os_str().to_string_lossy().encode_utf16().chain(std::iter::once(0)).collect()
}

fn emit(v: serde_json::Value) {
    println!("{v}");
}

fn count_files(dir: &Path) -> u64 {
    let mut n = 0;
    let mut stack = vec![dir.to_path_buf()];
    while let Some(d) = stack.pop() {
        if let Ok(rd) = std::fs::read_dir(&d) {
            for e in rd.flatten() {
                match e.file_type() {
                    Ok(t) if t.is_dir() => stack.push(e.path()),
                    Ok(_) => n += 1,
                    Err(_) => {}
                }
            }
        }
    }
    n
}

/// Every parent link ever seen (pid -> parent), so a process whose parent has already exited (an orphan, e.g. from
/// `Start-Process`) still traces back to its session. Filled by a 200 ms poll. The product would key on
/// (pid, creation time) to survive PID reuse.
static LINKS: Mutex<Option<HashMap<u32, u32>>> = Mutex::new(None);

fn snapshot_links() -> HashMap<u32, u32> {
    let mut m = HashMap::new();
    unsafe {
        let Ok(snap) = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) else { return m };
        let mut e = PROCESSENTRY32W { dwSize: std::mem::size_of::<PROCESSENTRY32W>() as u32, ..Default::default() };
        if Process32FirstW(snap, &mut e).is_ok() {
            loop {
                m.insert(e.th32ProcessID, e.th32ParentProcessID);
                if Process32NextW(snap, &mut e).is_err() {
                    break;
                }
            }
        }
        let _ = CloseHandle(snap);
    }
    m
}

fn start_registry() {
    std::thread::spawn(|| loop {
        let now = snapshot_links();
        let mut g = LINKS.lock().unwrap();
        let reg = g.get_or_insert_with(HashMap::new);
        for (pid, parent) in now {
            reg.entry(pid).or_insert(parent);
        }
        drop(g);
        std::thread::sleep(Duration::from_millis(200));
    });
}

/// Every descendant of `root`: the live snapshot plus every remembered link.
fn descendants(root: u32) -> Vec<u32> {
    let mut children: HashMap<u32, Vec<u32>> = HashMap::new();
    if std::env::var("TW_NO_REGISTRY").is_err() {
        if let Some(reg) = LINKS.lock().unwrap().as_ref() {
            for (pid, parent) in reg {
                children.entry(*parent).or_default().push(*pid);
            }
        }
    }
    unsafe {
        let Ok(snap) = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) else { return vec![] };
        let mut e = PROCESSENTRY32W { dwSize: std::mem::size_of::<PROCESSENTRY32W>() as u32, ..Default::default() };
        if Process32FirstW(snap, &mut e).is_ok() {
            loop {
                children.entry(e.th32ParentProcessID).or_default().push(e.th32ProcessID);
                if Process32NextW(snap, &mut e).is_err() {
                    break;
                }
            }
        }
        let _ = CloseHandle(snap);
    }
    let mut out = vec![];
    let mut q = VecDeque::from([root]);
    let mut seen = HashSet::new();
    while let Some(p) = q.pop_front() {
        if !seen.insert(p) {
            continue;
        }
        out.push(p);
        for c in children.get(&p).into_iter().flatten() {
            q.push_back(*c);
        }
    }
    out
}

/// Kill the tree (two passes, so a child spawned during the first pass is caught), then wait for every process.
fn kill_tree(root: u32) -> (usize, Option<u128>) {
    let t = Instant::now();
    let mut handles = vec![];
    let mut killed = HashSet::new();
    for _ in 0..2 {
        for pid in descendants(root) {
            if !killed.insert(pid) {
                continue;
            }
            unsafe {
                if let Ok(h) = OpenProcess(PROCESS_TERMINATE | PROCESS_SYNCHRONIZE, false, pid) {
                    let _ = TerminateProcess(h, 1);
                    handles.push(h);
                }
            }
        }
    }
    let mut all_gone = true;
    for h in &handles {
        unsafe {
            if WaitForSingleObject(*h, 3000) != WAIT_OBJECT_0 {
                all_gone = false;
            }
            let _ = CloseHandle(*h);
        }
    }
    (killed.len(), all_gone.then(|| t.elapsed().as_millis()))
}

fn make(dir: &Path, n: usize) {
    std::fs::create_dir_all(dir).unwrap();
    for i in 0..n {
        let sub = dir.join(format!("d{}", i / 1000));
        if i % 1000 == 0 {
            std::fs::create_dir_all(&sub).unwrap();
        }
        std::fs::write(sub.join(format!("f{i}.txt")), b"x").unwrap();
    }
}

fn watch(root: PathBuf, threshold: usize, window: Duration, buf_kb: usize, map: HashMap<String, u32>) {
    start_registry();
    let start = Instant::now();
    let ms = |s: Instant| s.duration_since(start).as_millis() as u64;
    let mut rekilled: HashSet<String> = HashSet::new();
    let mut last_total = Instant::now();
    let mut baseline: HashMap<String, u64> = map.keys().map(|k| (k.clone(), count_files(&root.join(k)))).collect();
    emit(serde_json::json!({ "kind": "baseline", "counts": baseline }));
    let h = unsafe {
        CreateFileW(
            PCWSTR(wide(&root).as_ptr()),
            FILE_LIST_DIRECTORY.0,
            FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
            None,
            OPEN_EXISTING,
            FILE_FLAG_BACKUP_SEMANTICS,
            None,
        )
        .expect("open root")
    };
    let mut buf = vec![0u8; buf_kb * 1024];
    let mut recent: HashMap<String, VecDeque<Instant>> = HashMap::new();
    let mut deletes: HashMap<String, u64> = HashMap::new();
    let mut tripped: HashMap<String, Instant> = HashMap::new();
    let mut overflows = 0u64;
    loop {
        let mut bytes = 0u32;
        let ok = unsafe {
            ReadDirectoryChangesW(h, buf.as_mut_ptr() as _, buf.len() as u32, true, FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_DIR_NAME, Some(&mut bytes), None, None)
        };
        let now = Instant::now();
        let mut hits: Vec<(String, u64)> = vec![];
        if ok.is_err() || bytes == 0 {
            // Overflow: events were dropped. Recount each session folder and charge the difference as deletions.
            overflows += 1;
            for (k, base) in baseline.iter_mut() {
                let c = count_files(&root.join(k));
                if c < *base {
                    hits.push((k.clone(), *base - c));
                }
                *base = c;
            }
            emit(serde_json::json!({ "kind": "overflow", "t": ms(now), "n": overflows }));
        } else {
            let mut off = 0usize;
            loop {
                let info = unsafe { &*(buf.as_ptr().add(off) as *const FILE_NOTIFY_INFORMATION) };
                let name_len = info.FileNameLength as usize / 2;
                let name = unsafe { String::from_utf16_lossy(std::slice::from_raw_parts(info.FileName.as_ptr(), name_len)) };
                let top = name.split('\\').next().unwrap_or("").to_string();
                if info.Action == FILE_ACTION_REMOVED && name.ends_with(".txt") {
                    hits.push((top.clone(), 1));
                    if let Some(b) = baseline.get_mut(&top) {
                        *b = b.saturating_sub(1);
                    }
                } else if info.Action == FILE_ACTION_ADDED && name.ends_with(".txt") {
                    if let Some(b) = baseline.get_mut(&top) {
                        *b += 1;
                    }
                }
                if info.NextEntryOffset == 0 {
                    break;
                }
                off += info.NextEntryOffset as usize;
            }
        }
        for (top, n) in hits {
            *deletes.entry(top.clone()).or_default() += n;
            if let Some(t) = tripped.get(&top).copied() {
                let after = now.duration_since(t).as_millis() as u64;
                emit(serde_json::json!({ "kind": "after_kill_delete", "session": top, "n": n, "ms_after_kill": after }));
                // Deletes still landing 300 ms after the kill: something outside the live tree is deleting. Kill
                // again with the remembered links.
                if after > 300 && rekilled.insert(top.clone()) {
                    if let Some(pid) = map.get(&top).copied() {
                        let (n_killed, gone_ms) = kill_tree(pid);
                        emit(serde_json::json!({ "kind": "rekill", "session": top, "processes_killed": n_killed, "tree_gone_ms": gone_ms, "ms_after_first_kill": after }));
                    }
                }
                continue;
            }
            let q = recent.entry(top.clone()).or_default();
            for _ in 0..n.min(threshold as u64 * 2) {
                q.push_back(now);
            }
            while q.front().is_some_and(|t| now.duration_since(*t) > window) {
                q.pop_front();
            }
            if q.len() >= threshold {
                let Some(pid) = map.get(&top).copied() else { continue };
                emit(serde_json::json!({ "kind": "threshold", "session": top, "pid": pid, "t": ms(now), "deletes_so_far": deletes[&top] }));
                let (n_killed, gone_ms) = kill_tree(pid);
                let after = Instant::now();
                emit(serde_json::json!({
                    "kind": "stopped", "session": top, "processes_killed": n_killed,
                    "kill_ms_after_threshold": after.duration_since(now).as_millis() as u64, "tree_gone_ms": gone_ms,
                }));
                tripped.insert(top.clone(), after);
            }
        }
        // TW_SLOW_MS: stall after each read, as a busy app would, so the kernel buffer overflows for real.
        if let Some(ms) = std::env::var("TW_SLOW_MS").ok().and_then(|v| v.parse::<u64>().ok()) {
            std::thread::sleep(Duration::from_millis(ms));
        }
        if last_total.elapsed() > Duration::from_millis(500) || std::env::var("TW_TOTAL_EVERY").is_ok() {
            last_total = Instant::now();
            emit(serde_json::json!({ "kind": "total", "t": ms(now), "deletes": deletes, "overflows": overflows }));
        }
        if std::env::var("TW_ONESHOT").is_ok() && !tripped.is_empty() && tripped.values().all(|t| t.elapsed() > Duration::from_secs(5)) {
            emit(serde_json::json!({ "kind": "done", "deletes": deletes, "overflows": overflows }));
            return;
        }
    }
}

fn main() {
    let a: Vec<String> = std::env::args().collect();
    match a.get(1).map(String::as_str) {
        Some("make") => make(Path::new(&a[2]), a[3].parse().unwrap()),
        Some("watch") => {
            let map = a[6]
                .split(',')
                .filter_map(|kv| kv.split_once('='))
                .map(|(k, v)| (k.to_string(), v.parse().unwrap()))
                .collect();
            watch(PathBuf::from(&a[2]), a[3].parse().unwrap(), Duration::from_millis(a[4].parse().unwrap()), a[5].parse().unwrap(), map)
        }
        _ => eprintln!("usage: make <dir> <n> | watch <root> <threshold> <window_ms> <buf_kb> <name=pid,...>"),
    }
}
