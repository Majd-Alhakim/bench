//! CR-011 notch: a transparent, frameless, always-on-top window at the top centre that never takes focus, clipped to
//! its pill shape (clicks outside the pill reach the window below), with a panel that opens from it. A 30 Hz cursor
//! poll drives hover and the eye-follow animation; a 1 Hz check hides the notch while a full-screen app is in front.
use crate::{log, now_ms};
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Emitter, Manager, PhysicalPosition, WebviewUrl, WebviewWindow, WebviewWindowBuilder, WindowEvent};
use windows::Win32::Foundation::{HWND, POINT, RECT};
use windows::Win32::Graphics::Gdi::{CreateRoundRectRgn, MonitorFromWindow, GetMonitorInfoW, MONITORINFO, MONITOR_DEFAULTTONEAREST, SetWindowRgn};
use windows::Win32::UI::Shell::{SHQueryUserNotificationState, QUERY_USER_NOTIFICATION_STATE};
use windows::Win32::UI::WindowsAndMessaging::*;

/// Window size (logical px) and the visible pill inside it, centred at the top.
const WIN_W: f64 = 260.0;
const WIN_H: f64 = 44.0;
const PILL_W: f64 = 220.0;
const PILL_H: f64 = 34.0;
const PANEL_W: f64 = 380.0;
const PANEL_H: f64 = 420.0;

static HOVER: AtomicBool = AtomicBool::new(false);
static STEPPED_ASIDE: AtomicBool = AtomicBool::new(false);

fn hwnd(w: &WebviewWindow) -> HWND {
    HWND(w.hwnd().map(|h| h.0 as _).unwrap_or(std::ptr::null_mut()))
}

/// Top-centre of a monitor's work area, in physical pixels: x centred, y flush with the top edge.
pub fn place_for(work_x: i32, work_y: i32, work_w: i32, scale: f64) -> (i32, i32, i32, i32) {
    let w = (WIN_W * scale).round() as i32;
    let h = (WIN_H * scale).round() as i32;
    (work_x + (work_w - w) / 2, work_y, w, h)
}

fn pill_rect_physical(win: RECT, scale: f64) -> RECT {
    let pw = (PILL_W * scale).round() as i32;
    let ph = (PILL_H * scale).round() as i32;
    let left = win.left + ((win.right - win.left) - pw) / 2;
    RECT { left, top: win.top, right: left + pw, bottom: win.top + ph }
}

fn apply_shape_and_styles(w: &WebviewWindow) {
    let h = hwnd(w);
    let scale = w.scale_factor().unwrap_or(1.0);
    unsafe {
        let ex = GetWindowLongPtrW(h, GWL_EXSTYLE);
        SetWindowLongPtrW(h, GWL_EXSTYLE, ex | (WS_EX_NOACTIVATE.0 | WS_EX_TOOLWINDOW.0) as isize);
        let ww = (WIN_W * scale).round() as i32;
        let pw = (PILL_W * scale).round() as i32;
        let ph = (PILL_H * scale).round() as i32;
        let left = (ww - pw) / 2;
        let r = (16.0 * scale).round() as i32;
        // Region in window coordinates: only the pill is part of the window, so clicks elsewhere fall through.
        let rgn = CreateRoundRectRgn(left, -r, left + pw + 1, ph + 1, r * 2, r * 2);
        SetWindowRgn(h, Some(rgn), true);
    }
}

fn position_notch(w: &WebviewWindow) {
    let Some(m) = w.current_monitor().ok().flatten().or_else(|| w.primary_monitor().ok().flatten()) else { return };
    let wa = m.work_area();
    // The notch sits at the very top of the monitor (over the work area's top, which is the screen top unless the
    // taskbar is docked at the top).
    let (x, y, _, _) = place_for(wa.position.x, m.position().y, wa.size.width as i32, m.scale_factor());
    let _ = w.set_position(PhysicalPosition::new(x, y));
    log(serde_json::json!({ "kind": "notch_place", "scale": m.scale_factor(), "monitor": [m.position().x, m.position().y, m.size().width, m.size().height], "at": [x, y] }));
}

pub fn setup(app: &tauri::App) -> tauri::Result<()> {
    let notch = WebviewWindowBuilder::new(app, "notch", WebviewUrl::App("notch.html".into()))
        .title("Eucas notch")
        .inner_size(WIN_W, WIN_H)
        .transparent(true)
        .decorations(false)
        .shadow(false)
        .resizable(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .focused(false)
        .visible(false)
        .build()?;
    position_notch(&notch);
    apply_shape_and_styles(&notch);
    unsafe {
        let _ = ShowWindow(hwnd(&notch), SW_SHOWNOACTIVATE);
    }

    let panel = WebviewWindowBuilder::new(app, "panel", WebviewUrl::App("panel.html".into()))
        .title("Eucas")
        .inner_size(PANEL_W, PANEL_H)
        .decorations(false)
        .resizable(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .visible(false)
        .build()?;
    let p = panel.clone();
    panel.on_window_event(move |e| {
        if let WindowEvent::Focused(false) = e {
            if p.is_visible().unwrap_or(false) {
                let _ = p.hide();
                log(serde_json::json!({ "kind": "panel_closed", "by": "click_away", "t": now_ms() }));
            }
        }
    });

    let handle = app.handle().clone();
    std::thread::spawn(move || cursor_loop(handle));
    let handle = app.handle().clone();
    std::thread::spawn(move || fullscreen_loop(handle));
    Ok(())
}

/// 30 Hz: hover enter/leave over the pill, and the cursor offset for the eyes (only sent when it moves).
/// ST1_FAKE_CURSOR: a synthetic cursor circling the notch, so the eye-follow animation runs at its full 30 Hz
/// for the idle measurement without moving the real mouse.
fn cursor_loop(app: AppHandle) {
    let fake = std::env::var("ST1_FAKE_CURSOR").is_ok();
    let mut tick = 0f64;
    let mut last = POINT::default();
    // Window handle and scale are read once (each Tauri getter is a round trip to the main thread); a real build
    // refreshes them on ScaleFactorChanged / Moved.
    let Some(w) = app.get_webview_window("notch") else { return };
    let h = hwnd(&w);
    let scale = w.scale_factor().unwrap_or(1.0);
    loop {
        std::thread::sleep(std::time::Duration::from_millis(33));
        let mut p = POINT::default();
        let mut r = RECT::default();
        unsafe {
            if GetCursorPos(&mut p).is_err() || GetWindowRect(h, &mut r).is_err() {
                continue;
            }
        }
        if fake {
            tick += 0.1;
            p = POINT { x: (r.left + r.right) / 2 + (300.0 * tick.cos()) as i32, y: r.bottom + 200 + (150.0 * tick.sin()) as i32 };
        }
        let pill = pill_rect_physical(r, scale);
        let inside = p.x >= pill.left && p.x < pill.right && p.y >= pill.top && p.y < pill.bottom;
        if inside != HOVER.swap(inside, Ordering::SeqCst) {
            let _ = app.emit_to("notch", "hover", inside);
            log(serde_json::json!({ "kind": "hover", "inside": inside, "t": now_ms() }));
        }
        if p.x != last.x || p.y != last.y {
            last = p;
            let cx = (pill.left + pill.right) / 2;
            let cy = (pill.top + pill.bottom) / 2;
            let _ = app.emit_to("notch", "cursor", (p.x - cx, p.y - cy));
        }
    }
}

/// True when the foreground window covers its whole monitor and isn't the desktop or the shell.
fn foreground_is_fullscreen() -> bool {
    unsafe {
        let fg = GetForegroundWindow();
        if fg.0.is_null() || fg == GetDesktopWindow() || fg == GetShellWindow() {
            return false;
        }
        let mut cls = [0u16; 64];
        let n = GetClassNameW(fg, &mut cls);
        let class = String::from_utf16_lossy(&cls[..n as usize]);
        if class == "WorkerW" || class == "Progman" {
            return false;
        }
        let mut r = RECT::default();
        if GetWindowRect(fg, &mut r).is_err() {
            return false;
        }
        let mon = MonitorFromWindow(fg, MONITOR_DEFAULTTONEAREST);
        let mut mi = MONITORINFO { cbSize: std::mem::size_of::<MONITORINFO>() as u32, ..Default::default() };
        if !GetMonitorInfoW(mon, &mut mi).as_bool() {
            return false;
        }
        let m = mi.rcMonitor;
        r.left <= m.left && r.top <= m.top && r.right >= m.right && r.bottom >= m.bottom
    }
}

pub fn quns() -> i32 {
    unsafe { SHQueryUserNotificationState().map(|s: QUERY_USER_NOTIFICATION_STATE| s.0).unwrap_or(-1) }
}

/// 1 Hz: step aside (hide) while a full-screen app, game or presentation is in front; come back without focus.
fn fullscreen_loop(app: AppHandle) {
    loop {
        std::thread::sleep(std::time::Duration::from_millis(1000));
        let Some(w) = app.get_webview_window("notch") else { continue };
        let q = quns();
        let _ = &w;
        // 3 Direct3D full screen, 4 presentation mode. 2 ("busy") is not enough on its own: it stays set while any
        // full-screen overlay exists (seen during the spike with nothing full screen in front), so it only counts
        // when the foreground window also covers its monitor.
        let fg_full = foreground_is_fullscreen();
        let full = matches!(q, 3 | 4) || fg_full;
        if full != STEPPED_ASIDE.swap(full, Ordering::SeqCst) {
            unsafe {
                let _ = ShowWindow(hwnd(&w), if full { SW_HIDE } else { SW_SHOWNOACTIVATE });
            }
            log(serde_json::json!({ "kind": "notch_step_aside", "aside": full, "quns": q, "fg_full": fg_full, "t": now_ms() }));
        }
    }
}

#[tauri::command]
pub fn open_panel(app: AppHandle) {
    let (Some(n), Some(p)) = (app.get_webview_window("notch"), app.get_webview_window("panel")) else { return };
    let mut r = RECT::default();
    unsafe {
        let _ = GetWindowRect(hwnd(&n), &mut r);
    }
    let scale = n.scale_factor().unwrap_or(1.0);
    let pw = (PANEL_W * scale).round() as i32;
    let x = (r.left + r.right) / 2 - pw / 2;
    let y = r.top + (PILL_H * scale).round() as i32 + (6.0 * scale).round() as i32;
    let _ = p.set_position(PhysicalPosition::new(x, y));
    let _ = p.show();
    let _ = p.set_focus();
    let _ = app.emit_to("panel", "shown", now_ms());
    log(serde_json::json!({ "kind": "panel_opened", "at": [x, y], "t": now_ms() }));
}

#[tauri::command]
pub fn close_panel(app: AppHandle, by: String) {
    if let Some(p) = app.get_webview_window("panel") {
        let _ = p.hide();
    }
    log(serde_json::json!({ "kind": "panel_closed", "by": by, "t": now_ms() }));
}

#[tauri::command]
pub fn panel_first_frame(t_js: u64, opened: u64) {
    log(serde_json::json!({ "kind": "panel_first_frame", "ms": t_js.saturating_sub(opened) }));
}

/// Hands focus to another top-level window of ours (the test's stand-in for "the user clicked somewhere else").
#[tauri::command]
pub fn focus_elsewhere(app: AppHandle) {
    if let Some(m) = app.get_webview_window("main") {
        let _ = m.show();
        let _ = m.set_focus();
    }
}

#[tauri::command]
pub fn hide_main(app: AppHandle) {
    if let Some(m) = app.get_webview_window("main") {
        let _ = m.hide();
    }
}

/// Everything the spike can check about the notch without touching the user's mouse, keyboard or screen.
#[tauri::command]
pub fn notch_probe(app: AppHandle) -> serde_json::Value {
    let Some(n) = app.get_webview_window("notch") else { return serde_json::json!({ "error": "no notch" }) };
    let h = hwnd(&n);
    let scale = n.scale_factor().unwrap_or(1.0);
    let mut r = RECT::default();
    unsafe {
        let _ = GetWindowRect(h, &mut r);
        let ex = GetWindowLongPtrW(h, GWL_EXSTYLE) as u32;
        let pill = pill_rect_physical(r, scale);
        let root = |pt: POINT| GetAncestor(WindowFromPoint(pt), GA_ROOT);
        let corner = POINT { x: r.left + 2, y: r.bottom - 2 };
        let centre = POINT { x: (pill.left + pill.right) / 2, y: (pill.top + pill.bottom) / 2 };
        // Show/hide the notch and see whether the foreground window changed (it must not).
        let fg_before = GetForegroundWindow();
        let _ = ShowWindow(h, SW_HIDE);
        let _ = ShowWindow(h, SW_SHOWNOACTIVATE);
        let _ = SetWindowPos(h, Some(HWND_TOPMOST), 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE);
        let fg_after = GetForegroundWindow();
        let monitors: Vec<serde_json::Value> = n
            .available_monitors()
            .unwrap_or_default()
            .iter()
            .map(|m| {
                let wa = m.work_area();
                serde_json::json!({
                    "name": m.name(), "scale": m.scale_factor(),
                    "rect": [m.position().x, m.position().y, m.size().width, m.size().height],
                    "notch_at": place_for(wa.position.x, m.position().y, wa.size.width as i32, m.scale_factor()),
                })
            })
            .collect();
        serde_json::json!({
            "rect": [r.left, r.top, r.right - r.left, r.bottom - r.top],
            "pill": [pill.left, pill.top, pill.right - pill.left, pill.bottom - pill.top],
            "noactivate": ex & WS_EX_NOACTIVATE.0 != 0,
            "topmost": ex & WS_EX_TOPMOST.0 != 0,
            "toolwindow": ex & WS_EX_TOOLWINDOW.0 != 0,
            "is_foreground": GetForegroundWindow() == h,
            "foreground_unchanged_by_show": fg_before == fg_after,
            "corner_hits_notch": root(corner) == h,
            "centre_hits_notch": root(centre) == h,
            "quns": quns(),
            "fullscreen_now": foreground_is_fullscreen(),
            "monitors": monitors,
        })
    }
}
