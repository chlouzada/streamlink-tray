import { readFileSync, writeFileSync } from 'fs';

var packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

// now update src-tauri\tauri.conf.json
var tauriConf = JSON.parse(readFileSync('./src-tauri/tauri.conf.json', 'utf8'));

tauriConf.package.version = packageJson.version;

writeFileSync(
  './src-tauri/tauri.conf.json',
  JSON.stringify(tauriConf, null, 2),
  'utf8'
);
