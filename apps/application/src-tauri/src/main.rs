#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::os::windows::process::CommandExt;
use std::process::{Command, Stdio};
use std::thread;
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

#[tauri::command]
fn open_stream(input: &str) {
    let input_clone = input.to_string();

    thread::spawn(move || {
        if cfg!(target_os = "windows") {
            Command::new("cmd")
                .args(&["/C", &format!("streamlink twitch.tv/{} best", input_clone)])
                .creation_flags(0x08000000)
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
                .expect("failed to execute command")
        } else {
            Command::new("sh")
                .arg("-c")
                .arg(&format!("streamlink twitch.tv/{} best", input_clone))
                .creation_flags(0x08000000)
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
                .expect("failed to execute command")
        };
    });
}

#[tauri::command]
fn close_all_streams() {
    thread::spawn(move || {
        if cfg!(target_os = "windows") {
            Command::new("cmd")
                .args(&["/C", "taskkill /F /IM vlc.exe"])
                .output()
                .expect("failed to execute command");
        } else {
            Command::new("sh")
                .arg("-c")
                .arg("pkill -f vlc")
                .output()
                .expect("failed to execute command");
        }
    });
}

fn main() {
    let open = CustomMenuItem::new("open".to_string(), "Open");
    let close_all = CustomMenuItem::new("close_all".to_string(), "Close All");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
        .add_item(open)
        .add_item(close_all)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_stream, close_all_streams])
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a left click");
            }
            SystemTrayEvent::RightClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a right click");
            }
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a double click");
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                }
                "close_all" => {
                    close_all_streams();
                }
                "quit" => {
                    app.exit(0);
                }
                _ => {
                    println!("Clicked on menu item {}", id);
                }
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
