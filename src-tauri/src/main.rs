// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::thread;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn open_stream(input: &str) {
    let input_clone = input.to_string();

    thread::spawn(move || {
        if cfg!(target_os = "windows") {
            Command::new("cmd")
                .args(&["/C", &format!("streamlink twitch.tv/{} best", input_clone)])
                .output()
                .expect("failed to execute command")
        } else {
            Command::new("sh")
                .arg("-c")
                .arg(&format!("streamlink twitch.tv/{} best", input_clone))
                .output()
                .expect("failed to execute command")
        };
    });
}

#[tauri::command]
fn close_all_streams() {
    // Spawn a new thread to run the process termination
    thread::spawn(move || {
        if cfg!(target_os = "windows") {
            // Terminate all Streamlink processes on Windows using Taskkill
            Command::new("cmd")
                .args(&["/C", "taskkill /F /IM vlc.exe"])
                .output()
                .expect("failed to execute command");
        } else {
            // Terminate all Streamlink processes on Unix-like systems using pkill
            Command::new("sh")
                .arg("-c")
                .arg("pkill -f vlc")
                .output()
                .expect("failed to execute command");
        }
    });
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
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
            SystemTrayEvent::MenuItemClick { id, .. } => {
                // let item_handle = app.tray_handle().get_item(&id);
                match id.as_str() {
                    // "hide" => {
                    //     let window = app.get_window("main").unwrap();
                    //     window.hide().unwrap();
                    //     // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
                    //     item_handle.set_title("Show").unwrap();
                    // }
                    "quit" => {
                        app.exit(0);
                    }
                    // "show" => {
                    //     let window = app.get_window("main").unwrap();
                    //     window.show().unwrap();
                    //     item_handle.set_title("Hide").unwrap();
                    // }
                    _ => {
                        println!("Clicked on menu item {}", id);
                    }
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
