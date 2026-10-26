//! Throwaway SP-ST1 probe: the notch drawn natively as a per-pixel-alpha layered window (no webview), to compare idle
//! cost with the WebView2 notch. Fully transparent pixels are not hit, so the window is click-through outside the
//! pill by construction. Draws only when the cursor moves or on a blink. Writes its own probe to
//! %TEMP%\eucas-spikes\st1\native.json and exits after NN_SECS (default 120).
use std::io::Write;
use windows::core::w;
use windows::Win32::Foundation::*;
use windows::Win32::Graphics::Gdi::*;
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::System::SystemInformation::{GetTickCount, GetTickCount64};
use windows::Win32::UI::HiDpi::*;
use windows::Win32::UI::WindowsAndMessaging::*;

const W: f64 = 260.0;
const H: f64 = 44.0;
const PILL_W: f64 = 220.0;
const PILL_H: f64 = 34.0;

struct State {
    hwnd: HWND,
    scale: f64,
    w: i32,
    h: i32,
    dc: HDC,
    bits: *mut u32,
    bmp: HBITMAP,
    last: POINT,
    tick: f64,
    frames: u64,
    blink_until: u32,
    fake: bool,
}
static mut ST: Option<State> = None;

fn draw(st: &mut State, cursor: POINT, blink: bool) {
    let (w, h, s) = (st.w, st.h, st.scale);
    let px = unsafe { std::slice::from_raw_parts_mut(st.bits, (w * h) as usize) };
    px.fill(0);
    let pw = PILL_W * s;
    let ph = PILL_H * s;
    let left = (w as f64 - pw) / 2.0;
    let r = 16.0 * s;
    let put = |px: &mut [u32], x: i32, y: i32, rgb: u32, a: f64| {
        if x < 0 || y < 0 || x >= w || y >= h || a <= 0.0 {
            return;
        }
        let a8 = (a.min(1.0) * 255.0) as u32;
        let pre = |c: u32| (c * a8 / 255) & 0xff;
        px[(y * w + x) as usize] = (a8 << 24) | (pre((rgb >> 16) & 0xff) << 16) | (pre((rgb >> 8) & 0xff) << 8) | pre(rgb & 0xff);
    };
    // Pill: flat top, rounded bottom corners, 1 px of anti-aliasing on the corners.
    for y in 0..(ph.ceil() as i32) {
        for x in (left.floor() as i32)..((left + pw).ceil() as i32) {
            let (fx, fy) = (x as f64 + 0.5, y as f64 + 0.5);
            let cx = fx.clamp(left + r, left + pw - r);
            let cy = fy.min(ph - r);
            let d = if fy > ph - r { ((fx - cx).powi(2) + (fy - cy).powi(2)).sqrt() } else { (fx - cx).abs().max(0.0) };
            let a = if fy > ph - r || fx < left + r || fx > left + pw - r { (r - d + 0.5).clamp(0.0, 1.0) } else { 1.0 };
            put(px, x, y, 0x0b0c0f, a);
        }
    }
    // Eyes and pupils following the cursor (at most 3 px).
    let eye_r = 7.0 * s;
    let centre_y = ph / 2.0;
    let mut sx = 0.0;
    let mut sy = 0.0;
    let mut rect = RECT::default();
    unsafe {
        let _ = GetWindowRect(st.hwnd, &mut rect);
    }
    let dx = cursor.x as f64 - (rect.left as f64 + w as f64 / 2.0);
    let dy = cursor.y as f64 - (rect.top as f64 + centre_y);
    let d = (dx * dx + dy * dy).sqrt().max(1.0);
    let k = (d / 60.0).min(3.0) * s;
    sx += dx / d * k;
    sy += dy / d * k;
    for ex in [w as f64 / 2.0 - 14.0 * s, w as f64 / 2.0 + 14.0 * s] {
        let ry = if blink { eye_r * 0.12 } else { eye_r };
        for y in ((centre_y - eye_r) as i32)..((centre_y + eye_r) as i32 + 1) {
            for x in ((ex - eye_r) as i32)..((ex + eye_r) as i32 + 1) {
                let (fx, fy) = (x as f64 + 0.5 - ex, (y as f64 + 0.5 - centre_y) * eye_r / ry);
                let e = (eye_r - (fx * fx + fy * fy).sqrt() + 0.5).clamp(0.0, 1.0);
                if e > 0.0 {
                    let (qx, qy) = (fx - sx, y as f64 + 0.5 - centre_y - sy);
                    let pupil = !blink && (qx * qx + qy * qy).sqrt() < 3.0 * s;
                    put(px, x, y, if pupil { 0x0b0c0f } else { 0xe8e8e8 }, e);
                }
            }
        }
    }
    unsafe {
        let screen = GetDC(None);
        let mut pos = POINT { x: rect.left, y: rect.top };
        let mut size = SIZE { cx: w, cy: h };
        let mut src = POINT::default();
        let blend = BLENDFUNCTION { BlendOp: AC_SRC_OVER as u8, BlendFlags: 0, SourceConstantAlpha: 255, AlphaFormat: AC_SRC_ALPHA as u8 };
        let _ = UpdateLayeredWindow(st.hwnd, Some(screen), Some(&mut pos), Some(&mut size), Some(st.dc), Some(&mut src), COLORREF(0), Some(&blend), ULW_ALPHA);
        ReleaseDC(None, screen);
    }
    st.frames += 1;
}

unsafe extern "system" fn wndproc(h: HWND, msg: u32, wp: WPARAM, lp: LPARAM) -> LRESULT {
    if msg == WM_TIMER {
        #[allow(static_mut_refs)]
        if let Some(st) = ST.as_mut() {
            let mut p = POINT::default();
            let _ = GetCursorPos(&mut p);
            if st.fake {
                st.tick += 0.1;
                let mut r = RECT::default();
                let _ = GetWindowRect(st.hwnd, &mut r);
                p = POINT { x: (r.left + r.right) / 2 + (300.0 * st.tick.cos()) as i32, y: r.bottom + 200 + (150.0 * st.tick.sin()) as i32 };
            }
            let now = GetTickCount();
            let blink_due = now % 4000 < 34;
            if blink_due {
                st.blink_until = now + 160;
            }
            let blinking = now < st.blink_until;
            if p.x != st.last.x || p.y != st.last.y || blink_due || (st.blink_until != 0 && !blinking) {
                if !blinking {
                    st.blink_until = 0;
                }
                st.last = p;
                draw(st, p, blinking);
            }
        }
        return LRESULT(0);
    }
    if msg == WM_MOUSEACTIVATE {
        return LRESULT(MA_NOACTIVATE as isize);
    }
    DefWindowProcW(h, msg, wp, lp)
}

fn main() {
    let secs: u64 = std::env::var("NN_SECS").ok().and_then(|s| s.parse().ok()).unwrap_or(120);
    unsafe {
        let _ = SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
        let inst = GetModuleHandleW(None).unwrap();
        let class = w!("EucasNativeNotch");
        RegisterClassW(&WNDCLASSW { lpfnWndProc: Some(wndproc), hInstance: inst.into(), lpszClassName: class, ..Default::default() });
        let mon = MonitorFromPoint(POINT { x: 0, y: 0 }, MONITOR_DEFAULTTOPRIMARY);
        let mut mi = MONITORINFO { cbSize: std::mem::size_of::<MONITORINFO>() as u32, ..Default::default() };
        let _ = GetMonitorInfoW(mon, &mut mi);
        let (mut dx, mut dy) = (96u32, 96u32);
        let _ = GetDpiForMonitor(mon, MDT_EFFECTIVE_DPI, &mut dx, &mut dy);
        let scale = dx as f64 / 96.0;
        let (w, h) = ((W * scale).round() as i32, (H * scale).round() as i32);
        let x = mi.rcWork.left + ((mi.rcWork.right - mi.rcWork.left) - w) / 2;
        let fg_before = GetForegroundWindow();
        let hwnd = CreateWindowExW(
            WS_EX_LAYERED | WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,
            class,
            w!("Eucas notch (native)"),
            WS_POPUP,
            x,
            mi.rcMonitor.top,
            w,
            h,
            None,
            None,
            Some(inst.into()),
            None,
        )
        .unwrap();
        let screen = GetDC(None);
        let dc = CreateCompatibleDC(Some(screen));
        let bi = BITMAPINFO {
            bmiHeader: BITMAPINFOHEADER { biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32, biWidth: w, biHeight: -h, biPlanes: 1, biBitCount: 32, ..Default::default() },
            ..Default::default()
        };
        let mut bits = std::ptr::null_mut();
        let bmp = CreateDIBSection(Some(dc), &bi, DIB_RGB_COLORS, &mut bits, None, 0).unwrap();
        SelectObject(dc, bmp.into());
        ReleaseDC(None, screen);
        ST = Some(State { hwnd, scale, w, h, dc, bits: bits as *mut u32, bmp, last: POINT { x: -1, y: -1 }, tick: 0.0, frames: 0, blink_until: 0, fake: std::env::var("NN_FAKE_CURSOR").is_ok() });
        #[allow(static_mut_refs)]
        draw(ST.as_mut().unwrap(), POINT::default(), false);
        let _ = ShowWindow(hwnd, SW_SHOWNOACTIVATE);
        SetTimer(Some(hwnd), 1, 33, None);

        // Probe: focus untouched, corner falls through, centre hits.
        let fg_after = GetForegroundWindow();
        let mut r = RECT::default();
        let _ = GetWindowRect(hwnd, &mut r);
        let corner = WindowFromPoint(POINT { x: r.left + 2, y: r.bottom - 2 });
        let centre = WindowFromPoint(POINT { x: (r.left + r.right) / 2, y: r.top + (PILL_H * scale / 2.0) as i32 });
        let probe = format!(
            "{{\"scale\":{scale},\"rect\":[{},{},{},{}],\"foreground_unchanged\":{},\"corner_hits_notch\":{},\"centre_hits_notch\":{}}}",
            r.left, r.top, w, h, fg_before == fg_after, corner == hwnd, centre == hwnd
        );
        let dir = std::env::temp_dir().join("eucas-spikes").join("st1");
        let _ = std::fs::create_dir_all(&dir);
        let _ = std::fs::File::create(dir.join("native.json")).and_then(|mut f| f.write_all(probe.as_bytes()));

        let start = GetTickCount64();
        let mut msg = MSG::default();
        while GetTickCount64() - start < secs * 1000 {
            if PeekMessageW(&mut msg, None, 0, 0, PM_REMOVE).as_bool() {
                let _ = TranslateMessage(&msg);
                DispatchMessageW(&msg);
            } else {
                let _ = MsgWaitForMultipleObjects(None, false, 100, QS_ALLINPUT);
            }
        }
        #[allow(static_mut_refs)]
        let frames = ST.as_ref().map(|s| s.frames).unwrap_or(0);
        let _ = std::fs::OpenOptions::new().append(true).open(dir.join("native.json")).and_then(|mut f| f.write_all(format!("\n{{\"frames\":{frames}}}").as_bytes()));
        let _ = DeleteObject(bmp.into());
    }
}
