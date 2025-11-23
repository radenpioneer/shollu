#!/bin/bash
# DevContainer setup script for Shollu

set -e

echo "🚀 Setting up Shollu development environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "⚠️  Warning: package.json not found. Are you in the project root?"
fi

# Install Node dependencies
echo -e "${BLUE}📦 Installing Node dependencies...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

# Build Rust dependencies (first time)
if [ -d "src-tauri" ]; then
    echo -e "${BLUE}🦀 Building Rust dependencies (this may take a while on first run)...${NC}"
    cd src-tauri
    cargo build
    cd ..
else
    echo -e "${BLUE}ℹ️  src-tauri directory not found yet. Run 'npm create tauri-app' first.${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${BLUE}📝 Creating .env file...${NC}"
    cat > .env << EOF
# Rust environment
RUST_BACKTRACE=1
RUST_LOG=info

# Tauri environment
TAURI_DEBUG=true
EOF
fi

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run: npm run tauri dev"
echo "  2. Start coding!"
echo ""
