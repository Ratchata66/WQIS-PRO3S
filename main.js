'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT_DIR = __dirname;
const PYTHON_EXE = path.join(ROOT_DIR, '.venv-yolo', 'Scripts', 'python.exe');
const PREDICT_SCRIPT = path.join(ROOT_DIR, 'scripts', 'predict-yolo-weld-local.py');
const MODEL_PATH = path.join(ROOT_DIR, 'local-ai', 'yolo-weld-best.pt');

function runYoloPredict(imagePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(PYTHON_EXE)) {
      reject(new Error(`Python runtime not found: ${PYTHON_EXE}`));
      return;
    }
    if (!fs.existsSync(PREDICT_SCRIPT)) {
      reject(new Error(`YOLO predictor not found: ${PREDICT_SCRIPT}`));
      return;
    }
    if (!fs.existsSync(MODEL_PATH)) {
      reject(new Error(`YOLO model not found: ${MODEL_PATH}`));
      return;
    }

    const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
    execFile(
      PYTHON_EXE,
      [PREDICT_SCRIPT, '--model', MODEL_PATH, '--image', imagePath],
      { cwd: ROOT_DIR, env, maxBuffer: 10 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          reject(new Error((stderr || err.message || '').trim()));
          return;
        }
        try {
          resolve(JSON.parse(stdout));
        } catch (parseErr) {
          reject(new Error(`Invalid YOLO output: ${parseErr.message}`));
        }
      }
    );
  });
}

ipcMain.handle('wqis:yolo-analyze', async (_event, payload) => {
  const base64 = String(payload?.base64 || '');
  if (!base64) throw new Error('No image data supplied.');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wqis-yolo-'));
  const imagePath = path.join(tempDir, 'upload.jpg');
  try {
    fs.writeFileSync(imagePath, Buffer.from(base64, 'base64'));
    return await runYoloPredict(imagePath);
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (_) {}
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: 'PRO3S_Logo_001.png',
    webPreferences: {
      preload: path.join(ROOT_DIR, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  win.loadFile('login.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
