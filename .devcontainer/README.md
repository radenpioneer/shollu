# Shollu DevContainer

DevContainer optimized for Tauri + React + TypeScript development with GUI support for running desktop apps.

## Quick Start

### 1. Rebuild Container (First Time)
Press `Cmd/Ctrl + Shift + P` → "Dev Containers: Rebuild Container" → Wait 5-10 minutes

### 2. Access GUI Desktop
Open browser: **http://localhost:6080/vnc.html** → Click "Connect"

### 3. Run App
```bash
npm run tauri:dev
```

The Tauri window will appear in the browser desktop!

## GUI Support

**Display Server:** Xvfb (virtual X11 on :99)  
**Window Manager:** Openbox  
**VNC Server:** Port 5900 (for VNC clients)  
**Browser Access:** Port 6080 (noVNC)  
**Password:** `password` (if prompted)

**Services auto-start on container start.** If not running:
```bash
bash .devcontainer/start-services.sh
```

## What's Included

### Languages & Runtimes
- **Rust** (latest stable) - For Tauri backend
- **Node.js 20.x LTS** - For React frontend
- **pnpm** - Fast package manager

### System Dependencies
- WebKit2GTK 4.1 - For Tauri webview
- GTK 3 - UI toolkit
- AppIndicator - System tray support
- ALSA - Audio support
- SSL/TLS libraries

### VS Code Extensions
- **Rust**: rust-analyzer, TOML support
- **TypeScript/React**: ESLint, Prettier, Tailwind CSS IntelliSense
- **Tauri**: Official Tauri extension
- **Git**: GitLens
- **Utilities**: Error Lens, Spell Checker, TODO Tree

## Getting Started

### 1. First Time Setup

After the container builds, run:

```bash
# Install Node dependencies
npm install

# Or use pnpm (faster)
pnpm install

# Build Rust dependencies (first time only, takes a while)
cd src-tauri
cargo build
cd ..
```

### 2. Development

```bash
# Start development server
npm run tauri dev

# Or with pnpm
pnpm tauri dev
```

### 3. Building

```bash
# Build for production
npm run tauri build

# Build only frontend
npm run build

# Build only Rust backend
cd src-tauri && cargo build --release
```

## Useful Commands

### Frontend (React + Vite)
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
```

### Backend (Rust + Tauri)
```bash
cargo check          # Check for errors
cargo build          # Build debug
cargo build --release # Build release
cargo test           # Run tests
cargo clippy         # Run linter
cargo fmt            # Format code
```

### Tauri
```bash
npm run tauri dev    # Development mode
npm run tauri build  # Production build
npm run tauri icon   # Generate app icons
```

## Troubleshooting

### GUI Services Not Running
```bash
# Check if running
ps aux | grep -E "(Xvfb|x11vnc|openbox)"

# Restart services
bash .devcontainer/start-services.sh

# Check logs
cat /tmp/xvfb.log
cat /tmp/x11vnc.log
```

### GTK Initialization Error
Ensure services are running and DISPLAY is set:
```bash
export DISPLAY=:99
npm run tauri:dev
```

### Port Already in Use
```bash
lsof -ti:1420 | xargs kill -9  # Vite
lsof -ti:6080 | xargs kill -9  # noVNC
```

### Rust Compilation Slow
First build takes 5-10 minutes. Subsequent builds are much faster (cached).

### VNC Can't Connect
1. Check port 6080 is forwarded in VS Code
2. Verify x11vnc is running: `ps aux | grep x11vnc`
3. Restart services: `bash .devcontainer/start-services.sh`

## Performance Tips

1. **Use pnpm instead of npm** - Faster installs
2. **Enable Rust incremental compilation** - Already configured
3. **Use `cargo check`** - Faster than `cargo build` for checking errors
4. **Keep dependencies minimal** - Faster build times

## Environment Variables

Set in `.env` file (create if needed):
```bash
RUST_BACKTRACE=1           # Better Rust error messages
RUST_LOG=debug             # Enable debug logging
TAURI_DEBUG=true           # Tauri debug mode
```

## VS Code Settings

The devcontainer includes optimized settings:
- Format on save (Prettier)
- ESLint auto-fix on save
- Tailwind CSS IntelliSense
- Rust analyzer with clippy

## Verification

Test the setup:
```bash
# Check services
ps aux | grep -E "(Xvfb|x11vnc|openbox)"

# Test X11
export DISPLAY=:99
xdpyinfo | head -10

# Test GUI app
xeyes &  # Should appear in VNC desktop
```

## Technical Details

**System Packages:**
- Xvfb, x11vnc, openbox, noVNC, websockify
- WebKit2GTK 4.1, GTK 3, AppIndicator
- ALSA (audio), SSL/TLS libraries

**Ports:**
- 1420: Vite dev server
- 5900: VNC server
- 6080: noVNC (browser)

**Environment:**
- `DISPLAY=:99` (set automatically)
- `RUST_BACKTRACE=1`

## Resources

- [Tauri Docs](https://tauri.app/)
- [React 19 Docs](https://react.dev/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Vite Docs](https://vitejs.dev/)
