//! Throwaway SP-H1 guard. One process per hook event, like ADR-0009. It decides PreToolUse from the input alone,
//! logs every invocation to a JSONL file, appends a check frame to a spool with one append-only write, and can be
//! told to misbehave (panic, abort, hang, exit 1, garbage) per subcommand through a mode file, for the fail-closed
//! tests. Not product code.
use std::fs::{self, OpenOptions};
use std::io::{Read, Write};
use std::path::PathBuf;
use std::time::{Instant, SystemTime, UNIX_EPOCH};

fn base() -> PathBuf {
    std::env::var_os("EUCAS_SPIKE_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| std::env::temp_dir().join("eucas-spikes"))
}

fn now_ms() -> u128 {
    SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis()).unwrap_or(0)
}

fn mode_for(sub: &str) -> String {
    let text = fs::read_to_string(base().join("guard-mode.txt")).unwrap_or_default();
    for line in text.lines() {
        if let Some((k, v)) = line.trim().split_once('=') {
            if k == sub || k == "*" {
                return v.trim().to_string();
            }
        }
    }
    "normal".into()
}

fn append(path: PathBuf, line: &str) {
    if let Some(dir) = path.parent() {
        let _ = fs::create_dir_all(dir);
    }
    // append(true) opens with FILE_APPEND_DATA only, so one write lands whole without a lock.
    if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(path) {
        let _ = f.write_all(format!("{line}\n").as_bytes());
    }
}

/// The spike's only limits: a push to main/master, and recursive deletes.
fn limit_hit(tool: &str, input: &serde_json::Value) -> Option<&'static str> {
    let cmd = input.get("command").and_then(|c| c.as_str()).unwrap_or("").to_lowercase();
    if (tool == "Bash" || tool == "PowerShell") && cmd.contains("git push") && (cmd.contains("main") || cmd.contains("master")) {
        return Some("Eucas: pushing to the default branch is off limits");
    }
    if (tool == "Bash" && cmd.contains("rm -rf")) || (tool == "PowerShell" && cmd.contains("remove-item") && cmd.contains("-recurse")) {
        return Some("Eucas: recursive delete is off limits");
    }
    if (tool == "Edit" || tool == "Write") && input.get("file_path").and_then(|p| p.as_str()).is_some_and(|p| p.ends_with("settings.json")) {
        return Some("Eucas: editing Claude Code settings is off limits");
    }
    None
}

fn main() {
    let started = Instant::now();
    let t0 = now_ms();
    let sub = std::env::args().nth(1).unwrap_or_else(|| "unknown".into());
    // --spike-only (the admin-lock test): in any session that isn't a spike session, read the input and say nothing,
    // so the founder's real sessions are unaffected while the managed entry exists.
    if std::env::args().any(|a| a == "--spike-only") && std::env::var_os("EUCAS_SPIKE_DIR").is_none() {
        let mut sink = String::new();
        let _ = std::io::stdin().take(1 << 20).read_to_string(&mut sink);
        return;
    }
    let mode = mode_for(&sub);

    match mode.as_str() {
        "panic" => panic!("spike: injected panic in {sub}"),
        "abort" => std::process::abort(),
        "hang" => loop {
            std::thread::sleep(std::time::Duration::from_secs(60));
        },
        "exit1" => std::process::exit(1),
        "exit2" => {
            eprintln!("Eucas spike: injected exit 2 in {sub}");
            std::process::exit(2)
        }
        "garbage" => {
            print!("this is not json {{");
            std::process::exit(0)
        }
        m if m.starts_with("slow:") => {
            let ms: u64 = m[5..].parse().unwrap_or(0);
            std::thread::sleep(std::time::Duration::from_millis(ms));
        }
        _ => {}
    }

    let mut raw = String::new();
    let _ = std::io::stdin().take(1 << 20).read_to_string(&mut raw);
    let input: serde_json::Value = serde_json::from_str(&raw).unwrap_or(serde_json::Value::Null);

    // Keep the first input of each kind as a contract fixture.
    let fixture = base().join("inputs").join(format!("{sub}.json"));
    if !fixture.exists() {
        let _ = fs::create_dir_all(fixture.parent().unwrap());
        let _ = fs::write(&fixture, &raw);
    }

    let event = input.get("hook_event_name").and_then(|v| v.as_str()).unwrap_or("");
    let tool = input.get("tool_name").and_then(|v| v.as_str()).unwrap_or("");
    let tool_input = input.get("tool_input").cloned().unwrap_or(serde_json::Value::Null);
    let mut decision = "none";

    match sub.as_str() {
        "pre-tool-use" => {
            if let Some(reason) = limit_hit(tool, &tool_input) {
                decision = "deny";
                let out = serde_json::json!({
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "permissionDecision": "deny",
                        "permissionDecisionReason": format!("{reason} (receipt eucas-spike-{t0})")
                    }
                });
                println!("{out}");
            }
        }
        "permission-request" => {
            if let Some(reason) = limit_hit(tool, &tool_input) {
                decision = "deny";
                let out = serde_json::json!({
                    "hookSpecificOutput": {
                        "hookEventName": "PermissionRequest",
                        "decision": { "behavior": "deny", "message": reason }
                    }
                });
                println!("{out}");
            }
        }
        "status-line" => {
            append(base().join("status-line.jsonl"), &raw.replace('\n', " "));
            print!("eucas-sl ok");
        }
        _ => {}
    }

    let frame = serde_json::json!({
        "sub": sub, "event": event, "tool": tool, "decision": decision, "mode": mode,
        "session": input.get("session_id"), "pid": std::process::id(), "t": t0,
        "entrypoint": std::env::var("CLAUDE_CODE_ENTRYPOINT").ok(),
        "elapsed_us": started.elapsed().as_micros() as u64,
    });
    append(base().join("spool").join("events.jsonl"), &frame.to_string());
    append(base().join("guard-log.jsonl"), &frame.to_string());
}
