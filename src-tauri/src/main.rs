// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::thread;

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
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_stream, close_all_streams])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
