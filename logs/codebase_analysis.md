# Codebase Analysis Report

## Overview
This project is a desktop application built with **Tauri 2**, using **React 19** for the frontend and **Rust** for the backend system interactions. It appears to be a prayer times application ("shollu-rewrite").

## Tech Stack
- **Core Framework**: [Tauri 2.0](https://v2.tauri.app/) (RC/Beta versions)
- **Frontend**: React 19, TypeScript, Vite 7
- **Styling**: Tailwind CSS 4.0, `clsx`, `tailwind-merge`
- **State Management**: Nanostores
- **Icons**: Lucide React
- **Date/Time**: Luxon
- **Animation**: Framer Motion

## Architecture
The application follows a standard Tauri architecture:
1.  **Frontend (`/src`)**: A Single Page Application (SPA) handling the UI and business logic.
2.  **Backend (`/src-tauri`)**: A Rust-based backend that handles native system capabilities (windowing, file system, database, notifications).

### Key Directories
- **`/src`**: Main frontend source code.
    - **`components/`**: UI components organized by feature (Layout, Schedule, Tasks, Settings, etc.).
    - **`stores/`**: Global state management using Nanostores.
    - **`lib/`**: Utility functions and core business logic.
    - **`types/`**: TypeScript type definitions.
    - **`hooks/`**: Custom React hooks.
- **`/src-tauri`**: Rust backend code and Tauri configuration.
    - **`src/lib.rs`**: Main entry point for the Rust backend, registering plugins.
    - **`tauri.conf.json`**: Tauri configuration file.

## Key Components & Patterns

### 1. Entry Points
- **Frontend**: `src/main.tsx` initializes the React app and renders `App`.
- **Backend**: `src-tauri/src/lib.rs` is the library entry point where Tauri plugins are initialized (SQL, Notifications, Autostart, Shell, Dialog, FS).

### 2. Layout & Routing
- **`AppLayout.tsx`**: The main layout component. It uses a sidebar-based navigation.
- **Routing**: Instead of a traditional router (like `react-router`), it uses a simple state-based view switcher. The current view is stored in a Nanostore atom (`$currentView` in `stores/ui`), and `AppLayout` conditionally renders components based on this state.

### 3. State Management (Nanostores)
The app uses **Nanostores** for state management, which is lightweight and framework-agnostic.
- **`stores/prayer-times.ts`**: Manages time and prayer times.
    - `$currentTime`: Atom updating every second.
    - `$prayerTimes`: Map storing prayer times for the day.
    - `$currentPrayer` / `$nextPrayer`: Computed stores (logic to be implemented).
- **`stores/ui.ts`**: Likely manages UI state like the active view.

### 4. Native Capabilities
The app leverages several Tauri plugins for native functionality, initialized in `lib.rs`:
- `plugin-sql`: Local SQLite database.
- `plugin-notification`: System notifications.
- `plugin-autostart`: Launch on system startup.
- `plugin-fs`: File system access.

## Getting Started Tips
1.  **State Logic**: Look into `src/stores/` to understand how data flows. The logic is decoupled from React components.
2.  **Navigation**: To add a new page, you'd add a new view string to the `$currentView` type and add a conditional render in `AppLayout.tsx`.
3.  **Rust/Frontend Bridge**: Check `src-tauri/src/lib.rs` to see available commands. Currently, there is a simple `greet` command.
