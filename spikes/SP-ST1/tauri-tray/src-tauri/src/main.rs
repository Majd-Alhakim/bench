//! Throwaway SP-ST1 shell: tray icon states + tooltip, a pre-warmed flyout placed at the tray, WinRT toasts with
//! buttons, and the updater round trip. Every measurement goes to %TEMP%\eucas-spikes\st1\log.jsonl. Not product code.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod notch;

use std::fs::OpenOptions;
use std::io::Write;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{Instant, SystemTime, UNIX_EPOCH};
use tauri::image::Image;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Emitter, Manager, PhysicalPosition, Rect, WebviewUrl, WebviewWindowBuilder, WindowEvent};
use tauri_plugin_updater::UpdaterExt;

static LAST_CLICK_MS: AtomicU64 = AtomicU64::new(0);
const FLYOUT_W: f64 = 360.0;
const FLYOUT_H: f64 = 480.0;

pub(crate) fn now_ms() -> u64 {
    SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0)
}

pub(crate) fn log(v: serde_json::Value) {
    let dir = std::env::temp_dir().join("eucas-spikes").join("st1");
    let _ = std::fs::create_dir_all(&dir);
    if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(dir.join("log.jsonl")) {
        let _ = writeln!(f, "{v}");
    }
}

const ICONS: [(&str, &[u8], &str); 3] = [
    ("guarded", include_bytes!("../icons/guarded.png"), "Eucas: guarded, 3 sessions"),
    ("needs_you", include_bytes!("../icons/needs-you.png"), "Eucas: 1 session needs you"),
    ("not_guarded", include_bytes!("../icons/not-guarded.png"), "Eucas: NOT guarded"),
];

fn set_state(app: &AppHandle, i: usize) {
    let (name, bytes, tip) = ICONS[i % 3];
    let t = Instant::now();
    if let Some(tray) = app.tray_by_id("main") {
        let _ = tray.set_icon(Image::from_bytes(bytes).ok());
        let _ = tray.set_tooltip(Some(tip));
    }
    log(serde_json::json!({ "kind": "tray_swap", "state": name, "us": t.elapsed().as_micros() as u64, "t": now_ms() }));
}

/// Bottom-right taskbar (the Windows 11 default): centre the flyout on the icon, sit it 12 px above the work area's
/// bottom edge, and clamp it inside the work area. Everything in physical pixels.
fn place_flyout(app: &AppHandle, icon: Rect) {
    let Some(win) = app.get_webview_window("flyout") else { return };
    let monitor = win.current_monitor().ok().flatten().or_else(|| win.primary_monitor().ok().flatten());
    let Some(m) = monitor else { return };
    let scale = m.scale_factor();
    let pos = icon.position.to_physical::<f64>(scale);
    let size = icon.size.to_physical::<f64>(scale);
    let work = m.work_area();
    let (w, h) = (FLYOUT_W * scale, FLYOUT_H * scale);
    let (wx, wy) = (work.position.x as f64, work.position.y as f64);
    let (ww, wh) = (work.size.width as f64, work.size.height as f64);
    let x = (pos.x + size.width / 2.0 - w / 2.0).clamp(wx + 8.0 * scale, wx + ww - w - 8.0 * scale);
    let y = if pos.y > wy + wh / 2.0 { wy + wh - h - 12.0 * scale } else { wy + 12.0 * scale };
    let _ = win.set_position(PhysicalPosition::new(x.round() as i32, y.round() as i32));
    log(serde_json::json!({
        "kind": "flyout_place", "scale": scale, "icon": [pos.x, pos.y, size.width, size.height],
        "work": [wx, wy, ww, wh], "flyout": [x.round(), y.round(), w.round(), h.round()]
    }));
}

/// Shows the pre-warmed flyout and pings it; the page answers after its next painted frame. WebView2 keeps a hidden
/// window's document "visible", so visibilitychange can't be the signal.
fn show_flyout(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("flyout") {
        let _ = w.show();
        let _ = w.set_focus();
        let _ = app.emit_to("flyout", "shown", ());
    }
}

#[tauri::command]
fn hide_flyout(app: AppHandle) {
    if let Some(w) = app.get_webview_window("flyout") {
        let _ = w.hide();
    }
}

#[tauri::command]
fn first_frame(t_js: u64) {
    let click = LAST_CLICK_MS.load(Ordering::SeqCst);
    log(serde_json::json!({ "kind": "flyout_first_frame", "ms_from_click": t_js.saturating_sub(click), "t": t_js }));
}

#[tauri::command]
fn show_flyout_at(app: AppHandle, x: f64, y: f64) {
    // For automation: the same path as a tray click, with a synthetic icon rect.
    LAST_CLICK_MS.store(now_ms(), Ordering::SeqCst);
    place_flyout(&app, Rect { position: PhysicalPosition::new(x, y).into(), size: tauri::PhysicalSize::new(24.0, 24.0).into() });
    show_flyout(&app);
}

#[tauri::command]
fn set_tray_state(app: AppHandle, i: usize) {
    set_state(&app, i);
}

#[tauri::command]
fn toast(app: AppHandle) -> Result<(), String> {
    use tauri_winrt_notification::Toast;
    let sent = now_ms();
    let handle = app.clone();
    Toast::new(Toast::POWERSHELL_APP_ID)
        .title("Eucas spike: a session needs you")
        .text1("api-server asks: run the migration?")
        .add_button("Open session", "open")
        .add_button("Dismiss", "dismiss")
        .on_activated(move |action| {
            log(serde_json::json!({ "kind": "toast_activated", "action": action, "ms_after_send": now_ms() - sent }));
            if let Some(w) = handle.get_webview_window("main") {
                let _ = w.show();
                let _ = w.set_focus();
            }
            Ok(())
        })
        .on_dismissed(move |reason| {
            log(serde_json::json!({ "kind": "toast_dismissed", "reason": format!("{reason:?}") }));
            Ok(())
        })
        .show()
        .map_err(|e| e.to_string())?;
    log(serde_json::json!({ "kind": "toast_sent", "t": sent }));
    Ok(())
}

#[tauri::command]
async fn check_update(app: AppHandle) -> Result<String, String> {
    let current = app.package_info().version.to_string();
    let updater = app.updater().map_err(|e| e.to_string())?;
    match updater.check().await.map_err(|e| e.to_string())? {
        Some(update) => {
            log(serde_json::json!({ "kind": "update_found", "from": current, "to": update.version }));
            update.download_and_install(|_, _| {}, || {}).await.map_err(|e| e.to_string())?;
            log(serde_json::json!({ "kind": "update_installed" }));
            app.restart();
        }
        None => Ok(format!("up to date at {current}")),
    }
}

fn main() {
    let started = Instant::now();
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            notch::open_panel, notch::close_panel, notch::panel_first_frame, notch::focus_elsewhere, notch::hide_main, notch::notch_probe,
            first_frame, hide_flyout, show_flyout_at, set_tray_state, toast, check_update])
        .setup(move |app| {
            let handle = app.handle().clone();
            log(serde_json::json!({ "kind": "start", "version": app.package_info().version.to_string(), "pid": std::process::id() }));

            // ST1_NOTCH: the CR-011 notch + panel (the tray stays as the fallback).
            if std::env::var("ST1_NOTCH").is_ok() {
                notch::setup(app)?;
            }

            // Pre-warmed flyout: created hidden at start so a click only has to show it. With the notch, the panel
            // replaces it (ST1_NO_FLYOUT).
            if std::env::var("ST1_NO_FLYOUT").is_err() {
                let flyout = WebviewWindowBuilder::new(app, "flyout", WebviewUrl::App("flyout.html".into()))
                    .title("Eucas")
                    .inner_size(FLYOUT_W, FLYOUT_H)
                    .decorations(false)
                    .resizable(false)
                    .skip_taskbar(true)
                    .always_on_top(true)
                    .visible(false)
                    .build()?;
                let fly = flyout.clone();
                flyout.on_window_event(move |e| {
                    if let WindowEvent::Focused(false) = e {
                        let _ = fly.hide();
                    }
                });
            }
            // ST1_NO_MAIN: only the flyout is pre-warmed (the product creates the main window on demand).
            if std::env::var("ST1_NO_MAIN").is_err() {
                WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
                    .title("Eucas spike")
                    .inner_size(720.0, 480.0)
                    .visible(false)
                    .build()?;
            }

            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let open = MenuItem::with_id(app, "open", "Open Eucas", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&open, &quit])?;
            TrayIconBuilder::with_id("main")
                .icon(Image::from_bytes(ICONS[0].1)?)
                .tooltip(ICONS[0].2)
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, e| match e.id.as_ref() {
                    "quit" => app.exit(0),
                    "open" => {
                        if let Some(w) = app.get_webview_window("main") {
                            let _ = w.show();
                            let _ = w.set_focus();
                        }
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, rect, .. } = event {
                        let app = tray.app_handle();
                        LAST_CLICK_MS.store(now_ms(), Ordering::SeqCst);
                        place_flyout(app, rect);
                        show_flyout(app);
                    }
                })
                .build(app)?;
            log(serde_json::json!({ "kind": "ready", "ms": started.elapsed().as_millis() as u64 }));

            if std::env::var("ST1_CYCLE").is_ok() {
                std::thread::spawn(move || {
                    for i in 1..=9 {
                        std::thread::sleep(std::time::Duration::from_millis(1500));
                        set_state(&handle, i);
                    }
                });
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("tauri build")
        .run(|_, e| {
            // A tray app keeps running with every window closed.
            if let tauri::RunEvent::ExitRequested { api, code: None, .. } = e {
                api.prevent_exit();
            }
        });
}
