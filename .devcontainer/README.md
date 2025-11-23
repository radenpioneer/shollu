# Shollu DevContainer

This DevContainer is optimized for Tauri + React + TypeScript development with full GUI support.

## 🖥️ GUI Support

**NEW:** This DevContainer now includes a virtual desktop for running Tauri apps!

- **Display Server:** Xvfb (virtual X11)
- **Window Manager:** Openbox
- **VNC Access:** Port 5900 (VNC client) or 6080 (browser)
- **Access URL:** [http://localhost:6080/vnc.html](http://localhost:6080/vnc.html)

See [GUI_SETUP.md](./GUI_SETUP.md) for detailed instructions.

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

### Port Already in Use
If port 1420 is already in use:
```bash
# Kill the process using the port
lsof -ti:1420 | xargs kill -9
```

### Rust Compilation Slow
First compilation takes 5-10 minutes. Subsequent builds are much faster due to caching.

### WebKit Errors
If you see WebKit-related errors, rebuild the container:
```bash
# In VS Code: Cmd/Ctrl + Shift + P
# Run: "Dev Containers: Rebuild Container"
```

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

## Resources

- [Tauri Documentation](https://tauri.app/)
- [React Documentation](https://react.dev/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Vite Documentation](https://vitejs.dev/)
