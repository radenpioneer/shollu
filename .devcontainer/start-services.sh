#!/bin/bash

echo "🖥️  Starting display services..."

# Start Xvfb (virtual display)
export DISPLAY=:99
Xvfb :99 -screen 0 1920x1080x24 -ac +extension GLX +render -noreset > /tmp/xvfb.log 2>&1 &
XVFB_PID=$!
echo "Xvfb started with PID: $XVFB_PID"

# Wait for Xvfb to be ready
sleep 2

# Start openbox window manager
openbox > /tmp/openbox.log 2>&1 &
OPENBOX_PID=$!
echo "Openbox started with PID: $OPENBOX_PID"

# Start x11vnc for VNC access
x11vnc -display :99 -forever -shared -rfbport 5900 -rfbauth /root/.vnc/passwd -nopw > /tmp/x11vnc.log 2>&1 &
X11VNC_PID=$!
echo "x11vnc started with PID: $X11VNC_PID"

# Start noVNC for browser-based access
websockify --web=/usr/share/novnc 6080 localhost:5900 > /tmp/novnc.log 2>&1 &
NOVNC_PID=$!
echo "noVNC started with PID: $NOVNC_PID"

echo "✅ Display services started!"
echo ""
echo "📺 Access the desktop:"
echo "   - VNC: localhost:5900 (password: password)"
echo "   - Browser: http://localhost:6080/vnc.html"
echo ""
echo "🚀 You can now run: npm run tauri:dev"
