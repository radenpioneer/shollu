#!/bin/bash
set -e

echo "🚀 Shollu DevContainer - Post Create Setup"

# Install Node dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing Node dependencies..."
    npm install
fi

# Build Rust dependencies if Cargo.toml exists
if [ -f "src-tauri/Cargo.toml" ]; then
    echo "🦀 Building Rust dependencies (this may take a while on first run)..."
    cd src-tauri
    cargo build
    cd ..
fi

echo "✅ Post-create setup complete!"
