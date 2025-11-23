# GUI Support for Tauri Development

## Overview

The DevContainer now includes full GUI support for running Tauri applications using:
- **Xvfb** - Virtual framebuffer X server (headless display)
- **Openbox** - Lightweight window manager
- **x11vnc** - VNC server for remote desktop access
- **noVNC** - Browser-based VNC client

## What Was Added

### System Packages
- `xvfb` - Virtual display server
- `x11-apps` - X11 utilities
- `x11vnc` - VNC server
- `openbox` - Window manager
- `tigervnc-*` - VNC viewer
- `novnc` - Browser-based VNC client
- `websockify` - WebSocket proxy for noVNC
- `dbus-x11` - D-Bus for X11

### Scripts
- `.devcontainer/start-services.sh` - Starts display services
- `.devcontainer/post-create.sh` - Post-creation setup

### Environment Variables
- `DISPLAY=:99` - Set automatically

### Ports
- **5900** - VNC server (direct VNC client access)
- **6080** - noVNC (browser-based access)

---

## How to Use

### Step 1: Rebuild the DevContainer

**IMPORTANT:** You must rebuild the container to install the new packages.

1. Press `Cmd/Ctrl + Shift + P` in VS Code
2. Type "Dev Containers: Rebuild Container"
3. Press Enter
4. Wait 5-10 minutes for the rebuild

### Step 2: Verify Services Started

After rebuild, the services should start automatically. Check with:

```bash
ps aux | grep -E "(Xvfb|x11vnc|openbox)"
```

You should see 3 processes running.

### Step 3: Access the Desktop

You have two options:

#### Option A: Browser-Based (Recommended)
1. Open your browser
2. Go to: `http://localhost:6080/vnc.html`
3. Click "Connect"
4. Password: `password` (if prompted)

#### Option B: VNC Client
1. Install a VNC client (TigerVNC, RealVNC, etc.)
2. Connect to: `localhost:5900`
3. Password: `password`

### Step 4: Run Tauri App

In the terminal:

```bash
npm run tauri:dev
```

The Tauri window will appear in the VNC desktop!

---

## Troubleshooting

### Services Not Running

If services didn't start automatically:

```bash
bash .devcontainer/start-services.sh
```

### Check Service Logs

```bash
# Xvfb log
cat /tmp/xvfb.log

# x11vnc log
cat /tmp/x11vnc.log

# openbox log
cat /tmp/openbox.log

# noVNC log
cat /tmp/novnc.log
```

### Display Not Working

Verify DISPLAY is set:

```bash
echo $DISPLAY
# Should output: :99
```

Test X11:

```bash
export DISPLAY=:99
xdpyinfo | head -10
```

### Port Already in Use

If ports 5900 or 6080 are in use:

```bash
# Kill existing processes
pkill -f x11vnc
pkill -f websockify

# Restart services
bash .devcontainer/start-services.sh
```

### Tauri Still Fails

If you still get GTK initialization errors:

```bash
# Ensure dbus is running
eval $(dbus-launch --sh-syntax)

# Try running with explicit display
DISPLAY=:99 npm run tauri:dev
```

---

## Manual Service Management

### Start Services

```bash
bash .devcontainer/start-services.sh
```

### Stop Services

```bash
pkill -f Xvfb
pkill -f x11vnc
pkill -f openbox
pkill -f websockify
```

### Restart Services

```bash
# Stop
pkill -f Xvfb
pkill -f x11vnc
pkill -f openbox
pkill -f websockify

# Start
bash .devcontainer/start-services.sh
```

---

## Performance Tips

### 1. Reduce Resolution

Edit `.devcontainer/start-services.sh`:

```bash
# Change from 1920x1080 to 1280x720
Xvfb :99 -screen 0 1280x720x24 -ac +extension GLX +render -noreset &
```

### 2. Disable VNC Compression

For faster local development, disable compression in your VNC client settings.

### 3. Use Browser VNC for Quick Checks

Browser-based VNC (noVNC) is convenient but slightly slower than native VNC clients.

---

## Security Notes

### VNC Password

The default VNC password is `password`. To change it:

```bash
# Create new password
echo "your-new-password" | vncpasswd -f > /root/.vnc/passwd
chmod 600 /root/.vnc/passwd

# Restart x11vnc
pkill -f x11vnc
bash .devcontainer/start-services.sh
```

### Port Exposure

Ports 5900 and 6080 are only accessible from your local machine (localhost). They are not exposed to the internet.

---

## Alternative: X11 Forwarding (Advanced)

If you're on Linux/macOS with X11, you can use X11 forwarding instead:

1. Edit `devcontainer.json`:
   ```json
   "runArgs": [
     "--env", "DISPLAY=${env:DISPLAY}",
     "--volume", "/tmp/.X11-unix:/tmp/.X11-unix"
   ]
   ```

2. On your host, allow X11 connections:
   ```bash
   xhost +local:docker
   ```

3. Run Tauri directly without VNC

**Note:** This doesn't work on Windows or macOS without additional setup.

---

## Testing the Setup

### Test 1: X11 Apps

```bash
export DISPLAY=:99
xeyes &
```

You should see the xeyes app in the VNC desktop.

### Test 2: GTK Apps

```bash
export DISPLAY=:99
gtk3-demo &
```

GTK demo should appear in VNC.

### Test 3: Tauri App

```bash
npm run tauri:dev
```

Your Shollu app should appear!

---

## FAQ

**Q: Why do I need VNC?**
A: Tauri apps require a display server. Since we're in a container without a physical display, we use Xvfb (virtual display) + VNC to view it.

**Q: Can I run headless tests?**
A: Yes! With Xvfb running, you can run automated tests without VNC:
```bash
DISPLAY=:99 npm run test
```

**Q: Is this slower than native?**
A: Slightly. Xvfb adds minimal overhead. VNC adds latency for viewing, but doesn't affect app performance.

**Q: Can I use this in production?**
A: No, this is for development only. Production Tauri apps run natively on user machines.

**Q: What about Wayland?**
A: Tauri currently requires X11. Wayland support is experimental.

---

## Resources

- [Xvfb Documentation](https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml)
- [x11vnc Documentation](https://github.com/LibVNC/x11vnc)
- [noVNC Project](https://novnc.com/)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

---

## Summary

After rebuilding the container:

1. ✅ Display server (Xvfb) runs automatically
2. ✅ VNC server available on port 5900
3. ✅ Browser VNC available on port 6080
4. ✅ `DISPLAY=:99` set automatically
5. ✅ Ready to run `npm run tauri:dev`

**Access desktop:** [http://localhost:6080/vnc.html](http://localhost:6080/vnc.html)

🎉 Happy Tauri development!
