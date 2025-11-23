# DevContainer Verification Checklist

Use this checklist to verify your DevContainer is working correctly.

## ✅ System Dependencies

```bash
# Check Rust installation
rustc --version
cargo --version

# Check Node.js installation
node --version
npm --version
pnpm --version

# Check Tauri CLI
cargo tauri --version

# Check system libraries (should not error)
pkg-config --exists webkit2gtk-4.1 && echo "✅ WebKit2GTK installed"
pkg-config --exists gtk+-3.0 && echo "✅ GTK3 installed"
pkg-config --exists libssl && echo "✅ OpenSSL installed"
```

## ✅ VS Code Extensions

Open VS Code and verify these extensions are installed:
- [ ] rust-analyzer
- [ ] ESLint
- [ ] Prettier
- [ ] Tailwind CSS IntelliSense
- [ ] Tauri (tauri-apps.tauri-vscode)

## ✅ Project Setup

```bash
# Should work without errors
npm install

# Should compile successfully
cd src-tauri && cargo check && cd ..

# Should start dev server
npm run tauri dev
```

## ✅ Development Workflow

Test these common tasks:

### Frontend
```bash
# Lint TypeScript
npm run lint

# Format code
npm run format

# Build frontend
npm run build
```

### Backend
```bash
cd src-tauri

# Check Rust code
cargo check

# Run Rust tests
cargo test

# Lint with Clippy
cargo clippy

# Format Rust code
cargo fmt
```

### Tauri
```bash
# Development mode (should open window)
npm run tauri dev

# Build production (creates installer)
npm run tauri build
```

## ✅ VS Code Features

Test these features in VS Code:

1. **TypeScript IntelliSense**
   - Open any `.ts` or `.tsx` file
   - Type `const x = ` and verify autocomplete works

2. **Rust Analyzer**
   - Open any `.rs` file in `src-tauri/src/`
   - Verify syntax highlighting and autocomplete

3. **Format on Save**
   - Edit a `.ts` file, add extra spaces
   - Save (Cmd/Ctrl + S)
   - Verify Prettier formats the file

4. **ESLint**
   - Add `const unused = 123;` to a TypeScript file
   - Verify ESLint shows warning

5. **Tailwind IntelliSense**
   - In a `.tsx` file, type `className="`
   - Verify Tailwind class suggestions appear

## 🐛 Common Issues

### Issue: "cargo: command not found"
**Solution:** Rebuild the container
```bash
# In VS Code: Cmd/Ctrl + Shift + P
# Run: "Dev Containers: Rebuild Container"
```

### Issue: "WebKit2GTK not found"
**Solution:** System dependencies missing, rebuild container

### Issue: Port 1420 already in use
**Solution:** Kill the process
```bash
lsof -ti:1420 | xargs kill -9
```

### Issue: Rust compilation very slow
**Solution:** This is normal on first build (5-10 minutes). Subsequent builds are much faster.

### Issue: VS Code extensions not working
**Solution:** 
1. Reload window: Cmd/Ctrl + Shift + P → "Developer: Reload Window"
2. If still not working, rebuild container

## 📊 Performance Benchmarks

Expected performance on first run:

| Task | Time |
|------|------|
| Container build | 3-5 minutes |
| `npm install` | 1-2 minutes |
| `cargo build` (first time) | 5-10 minutes |
| `cargo build` (subsequent) | 10-30 seconds |
| `npm run tauri dev` (startup) | 5-10 seconds |

## ✅ All Good?

If all checks pass, you're ready to start development! 🎉

Run:
```bash
npm run tauri dev
```

And start building Shollu!
