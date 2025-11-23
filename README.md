# Shollu v4.0 - Islamic Prayer Time Reminder

A modern, cross-platform rewrite of Shollu from Delphi to Tauri + React + TypeScript.

**Original:** Shollu v3.10 (Delphi 7, Windows-only, 271KB)  
**Rewrite:** Shollu v4.0 (Tauri + React 19, Cross-platform, ~5-10MB)  
**Status:** Phase 1 Complete ✅, Phase 2 In Progress 🔜

## Features

- 🕌 **Prayer Time Calculations** - 5 calculation methods (MWL, ISNA, Egypt, Makkah, Karachi)
- 🧭 **Qibla Direction** - Accurate Qibla compass
- 📅 **Hijri Calendar** - Gregorian ↔ Hijri date conversion
- 🔔 **Notifications** - System notifications and adhan playback
- ⏰ **Task Scheduler** - Custom reminders and automated tasks
- 🌍 **Multi-language** - 8+ languages supported
- 🎨 **Themes** - Light/dark mode with customization
- 💾 **Offline First** - All data stored locally

## Tech Stack

- **Frontend:** React 19, TypeScript 5.8 (strict), Luxon, Nanostores, Tailwind CSS 4
- **Backend:** Tauri 2.x (Rust), SQLite
- **Build:** Vite 7, ESLint 9, Prettier

## Quick Start

### Prerequisites

- Node.js 20+ LTS
- Rust (latest stable)
- Platform-specific dependencies (see [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

### Development

```bash
# Install dependencies
npm install

# Start development server (opens in GUI)
npm run tauri:dev

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run tauri:build
```

### DevContainer (Recommended)

This project includes a DevContainer with GUI support:

1. Open in VS Code with Dev Containers extension
2. Rebuild container (first time: 5-10 minutes)
3. Access GUI: http://localhost:6080/vnc.html
4. Run: `npm run tauri:dev`

See [.devcontainer/README.md](.devcontainer/README.md) for details.

## Project Structure

```
src/
├── components/     # React components
├── lib/            # Core logic (prayer times, hijri, db)
├── stores/         # Nanostores (global state)
├── types/          # TypeScript type definitions
├── hooks/          # Custom React hooks
└── assets/         # Static assets

src-tauri/          # Rust backend
shollu-old/         # Original Delphi code (reference)
```

## Development Guidelines

See [AGENTS.md](AGENTS.md) for complete development guidelines including:
- Code style (arrow functions, JSDoc, colocation)
- Testing requirements (90%+ coverage)
- Project phases and roadmap
- Success criteria

## Progress

**Phase 1:** ✅ Foundation (Complete)  
**Phase 2:** 🔜 Prayer Time Calculations (Current)  
**Phase 3-8:** ⏳ Pending

**Overall:** ~10% complete, 8-9 weeks remaining

## Contributing

1. Read [AGENTS.md](AGENTS.md) for guidelines
2. Follow code style (arrow functions, JSDoc, tests)
3. Ensure 100% feature parity with Shollu v3
4. Run tests before committing: `npm run format && npm run lint && npm run build`

## License

Original Shollu © 2005-2012 Ebta Setiawan (ebsoft)  
Rewrite © 2024

## Links

- **Original Shollu:** http://ebsoft.web.id
- **Repository:** https://github.com/radenpioneer/shollu
- **Tauri:** https://tauri.app
- **React:** https://react.dev
