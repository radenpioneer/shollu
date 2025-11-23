FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies for Tauri + GUI support
RUN apt-get update && apt-get install -y \
    # Build essentials
    build-essential \
    curl \
    wget \
    git \
    # Tauri dependencies
    libwebkit2gtk-4.1-dev \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    # Additional libraries
    libsoup-3.0-dev \
    libjavascriptcoregtk-4.1-dev \
    # Audio support
    libasound2-dev \
    # File dialog support
    libxdo-dev \
    # X11 and display support
    xvfb \
    x11-apps \
    x11-utils \
    x11vnc \
    dbus-x11 \
    # Lightweight window manager
    openbox \
    # Fonts
    fonts-liberation \
    fonts-dejavu \
    # VNC viewer (optional, for testing)
    tigervnc-standalone-server \
    tigervnc-common \
    # noVNC for browser-based access
    novnc \
    websockify \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setup VNC
RUN mkdir -p /root/.vnc \
    && echo "password" | vncpasswd -f > /root/.vnc/passwd \
    && chmod 600 /root/.vnc/passwd

# Create startup script for Xvfb
RUN echo '#!/bin/bash\n\
export DISPLAY=:99\n\
Xvfb :99 -screen 0 1920x1080x24 -ac +extension GLX +render -noreset &\n\
sleep 2\n\
openbox &\n\
' > /usr/local/bin/start-display.sh \
    && chmod +x /usr/local/bin/start-display.sh

# Create VNC startup script
RUN echo '#!/bin/bash\n\
export DISPLAY=:99\n\
x11vnc -display :99 -forever -shared -rfbport 5900 -rfbauth /root/.vnc/passwd &\n\
websockify --web=/usr/share/novnc 6080 localhost:5900 &\n\
' > /usr/local/bin/start-vnc.sh \
    && chmod +x /usr/local/bin/start-vnc.sh

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Node.js 20.x (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm (faster alternative to npm)
RUN npm install -g pnpm

# Install Tauri CLI globally
RUN cargo install tauri-cli --version "^2.0.0"

# Set working directory
WORKDIR /workspace

# Configure git to trust the workspace directory
RUN git config --global --add safe.directory /workspace

# Set display environment variable
ENV DISPLAY=:99

# Expose VNC ports
EXPOSE 5900 6080
