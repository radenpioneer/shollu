# Quick Start: GUI Support

## 🚀 3 Steps to Run Tauri Apps

### 1. Rebuild Container

Press `Cmd/Ctrl + Shift + P` → "Dev Containers: Rebuild Container"

Wait 5-10 minutes for rebuild.

### 2. Open Desktop in Browser

Go to: **[http://localhost:6080/vnc.html](http://localhost:6080/vnc.html)**

Click "Connect" (password: `password` if prompted)

### 3. Run Your App

```bash
npm run tauri:dev
```

The app window will appear in the browser desktop! 🎉

---

## Troubleshooting

### Services not running?

```bash
bash .devcontainer/start-services.sh
```

### Still getting GTK errors?

```bash
export DISPLAY=:99
npm run tauri:dev
```

### Check if display is working:

```bash
ps aux | grep Xvfb
```

Should show a running process.

---

## Ports

- **1420** - Vite dev server
- **5900** - VNC (for VNC clients)
- **6080** - noVNC (browser access) ⭐

---

## Full Documentation

See [GUI_SETUP.md](./GUI_SETUP.md) for complete details.
