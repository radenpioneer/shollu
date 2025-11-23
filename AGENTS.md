# AGENTS.md

## Identity
You are an expert full-stack engineer specializing in Tauri, React 19, TypeScript, and Rust. You are working on Shollu v4.0, a complete rewrite of an Islamic prayer time reminder from Delphi to modern cross-platform stack.

**Current Phase:** Phase 2 (Prayer Time Calculations)  
**Status:** Phase 1 Complete ✅  
**Repository:** https://github.com/radenpioneer/shollu (branch: dev-20250609)

- **Frontend:** React 19.1.0, TypeScript 5.8.3 (strict), Luxon 3.7.2, Nanostores 1.1.0, Tailwind CSS 4.1.17
- **Backend:** Tauri 2.x (Rust), SQLite (tauri-plugin-sql)
- **Build:** Vite 7.x, ESLint 9 (flat config), Prettier

## Code Style

### TypeScript
- Use strict mode. NO `any` type (use `unknown` if needed).
- Use path aliases: `@/components`, `@/lib`, `@/stores`, `@/types`, `@/hooks`.
- **Arrow functions ONLY.** NO function declarations.
- Explicit return types for arrow functions.
- Functional components only (no class components).

### State Management
- Use **Nanostores** for ALL global state. DO NOT use Redux or Context API.
- Store naming: `$storeName` (e.g., `$prayerTimes`, `$settings`).
- Access: `useStore($storeName)` in components, `.get()` in functions.
- Update: `.set()` method or action functions.

### Styling
- Use **Tailwind CSS** exclusively. NO custom CSS files or styled-components.
- Use `cn()` helper from `@/lib/utils` for conditional classes.
- Mobile-first responsive design.
- Dark mode support with `dark:` prefix.

### Date/Time
- Use **Luxon** exclusively. DO NOT use moment.js or date-fns.
- Always specify timezone explicitly.
- Format: `DateTime.fromFormat()`, `toFormat()`.

### Error Handling
- Wrap ALL async operations in try-catch.
- Log errors to console.
- Show user-friendly messages (no technical jargon).

- `src/components/`: UI components (Layout, MainPage, Schedule, Tasks, Settings, Converter, About)
- `src/lib/`: Core logic (prayer-times, hijri, db, audio, scheduler)
- `src/stores/`: Nanostores (settings.ts, prayer-times.ts, tasks.ts, ui.ts)
- `src/types/`: TypeScript type definitions
- `src/hooks/`: Custom React hooks
- `src-tauri/`: Rust backend
- `logs/`: Project documentation (PROJECT_PLAN.md, PHASE1_COMPLETE.md)
- `shollu-old/`: Original Delphi code (reference only)

### Component Pattern (Arrow Functions Only)
```typescript
import { useStore } from '@nanostores/react';
import { $prayerTimes } from '@/stores/prayer-times';
import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';

interface PrayerCardProps {
  className?: string;
}

// ✅ Arrow function component
const PrayerCard = ({ className }: PrayerCardProps): JSX.Element => {
  const times = useStore($prayerTimes);
  
  return (
    <div className={cn('rounded-lg bg-white p-4', className)}>
      <h3 className="text-lg font-semibold">{times.fajr}</h3>
    </div>
  );
};

export default PrayerCard;
```

### Nanostores Pattern (Arrow Functions)
```typescript
// stores/prayer-times.ts
import { map } from 'nanostores';

export const $prayerTimes = map<PrayerTimes>({
  date: '',
  fajr: '',
  dhuhr: '',
  // ...
});

// ✅ Arrow function for actions
export const updatePrayerTimes = (times: Partial<PrayerTimes>): void => {
  $prayerTimes.set({ ...$prayerTimes.get(), ...times });
};
```

### Luxon Pattern (Arrow Functions)
```typescript
import { DateTime } from 'luxon';

// ✅ Arrow functions for utilities
const formatPrayerTime = (time: string): string => {
  return DateTime.fromFormat(time, 'HH:mm:ss').toFormat('HH:mm');
};

const getJakartaTime = (): DateTime => {
  return DateTime.now().setZone('Asia/Jakarta');
};
```

## Workflow Rules

1. **Before Coding:** Understand the feature must have 100% parity with original Shollu v3 (check `shollu-old/` for reference).
2. **Write Tests:** ALWAYS write unit tests and integration tests for new features. NO exceptions.
3. **End of Session:** You MUST run these commands in order:
   ```bash
   npm run format    # Format code
   npm run lint      # Check for errors
   npm run test      # Run all tests (when implemented)
   npm run build     # Verify build succeeds
   ```
4. **Commits:** Use conventional commits (`feat:`, `fix:`, `docs:`, `test:`, etc.) and ALWAYS add `Co-authored-by: Ona <no-reply@ona.com>`.
5. **Feature Parity:** Every feature from Shollu v3 MUST be implemented. Check original code for exact behavior.

## Boundaries

- DO NOT modify `shollu-old/` directory (reference only).
- DO NOT use `any` type in TypeScript.
- DO NOT use function declarations. Arrow functions ONLY.
- DO NOT use custom CSS files or styled-components.
- DO NOT use moment.js, date-fns, Redux, or Context API for global state.
- DO NOT skip tests. Every feature MUST have tests.
- DO NOT skip end-of-session checks (format, lint, test, build).
- DO NOT implement features that differ from original Shollu v3 behavior.

## Project Plan & Status

**Overall Progress:** ~10% complete  
**Timeline:** 8-9 weeks remaining  
**Feature Parity:** 100% required with Shollu v3

### ✅ Phase 1: Foundation (COMPLETE - Week 1-2)
**Duration:** ~1 hour  
**Status:** ✅ Done

**Completed:**
- [x] Tauri + React 19 + TypeScript project initialized
- [x] TypeScript strict mode with path aliases configured
- [x] Core dependencies installed (Luxon, Nanostores, Tailwind)
- [x] Project directory structure created
- [x] Tauri plugins installed (SQL, notification, autostart, shell, dialog, fs)
- [x] Type definitions created (Prayer, Task, Settings, Common)
- [x] Nanostores created (settings, prayer-times, tasks, ui)
- [x] Basic layout components (AppLayout, Sidebar, Header)
- [x] Placeholder components for all 6 views
- [x] ESLint 9 + Prettier configured
- [x] DevContainer with GUI support (Xvfb + VNC + noVNC)
- [x] Production build working (~95KB gzipped)

**Deliverables:**
- Working Tauri app with navigation
- Live clock (updates every second)
- Type-safe stores and components
- Browser-based desktop access (http://localhost:6080/vnc.html)

---

### 🔜 Phase 2: Prayer Time Calculations (CURRENT - Week 2-3)
**Duration:** 1-2 weeks  
**Status:** 🔜 Ready to start

**Goal:** Implement prayer time calculation engine with 100% feature parity.

**Tasks:**
- [ ] Port algorithms from `shollu-old/Shollu.pas` (maintain EXACT compatibility)
- [ ] Implement 5 calculation methods:
  - [ ] Muslim World League (MWL)
  - [ ] Islamic Society of North America (ISNA)
  - [ ] Egyptian General Authority of Survey
  - [ ] Umm Al-Qura University, Makkah
  - [ ] University of Islamic Sciences, Karachi
- [ ] Support Standard (Shafi'i) and Hanafi Asr calculations
- [ ] Add Qibla direction calculation
- [ ] Create location/city database (import from `shollu-old/placenames/`)
- [ ] Implement timezone handling with Luxon
- [ ] Support prayer time adjustments (±minutes per prayer)
- [ ] Create prayer time hooks (usePrayerTimes)
- [ ] **Write unit tests for ALL calculation functions**
- [ ] **Write integration tests for prayer time flow**
- [ ] Validate against original Shollu (±1 minute accuracy)

**Testing Requirements:**
- Test each calculation method independently
- Test timezone conversions
- Test edge cases (polar regions, date boundaries)
- Test against known prayer times from original app
- Minimum 90% code coverage for calculation logic

**Deliverables:**
- Prayer time calculation engine
- Location database with search
- Qibla direction calculator
- Unit tests with 100% accuracy
- Working MainPage with real prayer times

---

### ⏳ Phase 3: Main Features (Week 3-5)
**Duration:** 2-3 weeks  
**Status:** ⏳ Pending

**Goal:** Implement all main UI features with 100% parity.

**Tasks:**
- [ ] **MainPage Component:**
  - [ ] Current prayer indicator
  - [ ] Next prayer countdown
  - [ ] All 6 prayer times display
  - [ ] Qibla compass
  - [ ] Current date (Gregorian + Hijri)
- [ ] **Schedule Viewer:**
  - [ ] Yesterday's prayer times
  - [ ] Today's prayer times
  - [ ] Tomorrow's prayer times
  - [ ] Calendar navigation
  - [ ] Print functionality
- [ ] **Settings Panel:**
  - [ ] Location settings with city search
  - [ ] Manual coordinates input
  - [ ] Calculation method selection
  - [ ] Asr calculation method (Standard/Hanafi)
  - [ ] Prayer time adjustments (±minutes)
  - [ ] Appearance settings (theme, language, font size)
  - [ ] Notification settings
  - [ ] Audio settings (adzan file, volume)
  - [ ] Behavior settings (auto-start, minimize to tray)
- [ ] **Date Converter:**
  - [ ] Gregorian to Hijri conversion
  - [ ] Hijri to Gregorian conversion
  - [ ] Hijri adjustment setting
  - [ ] Calendar display
- [ ] **Location Picker:**
  - [ ] City search (from database)
  - [ ] Manual coordinates
  - [ ] Timezone detection
  - [ ] Save favorite locations
- [ ] **Database Integration:**
  - [ ] Settings persistence (SQLite)
  - [ ] Prayer times caching
  - [ ] City database queries
- [ ] **Theme System:**
  - [ ] Light/dark mode
  - [ ] Custom color schemes
  - [ ] Font size adjustment
- [ ] **Write tests for all components**

**Deliverables:**
- Fully functional prayer times display
- Working schedule viewer
- Complete settings panel
- Date converter
- Location picker with search
- Database persistence
- Theme system

---

### ⏳ Phase 4: Notifications & Audio (Week 5-6)
**Duration:** 1-2 weeks  
**Status:** ⏳ Pending

**Goal:** Implement notification system and audio playback.

**Tasks:**
- [ ] **System Tray Integration:**
  - [ ] Tray icon with menu
  - [ ] Show/hide window
  - [ ] Quick prayer times view in tray
  - [ ] Exit option
- [ ] **Background Timer Service:**
  - [ ] Check prayer times every minute
  - [ ] Trigger notifications at prayer time
  - [ ] Update tray icon
  - [ ] Prevent system sleep during adhan
- [ ] **Notification System:**
  - [ ] System notifications (native)
  - [ ] Custom notification dialog
  - [ ] Notification timing settings
  - [ ] Notification style customization
- [ ] **Adhan Audio Playback:**
  - [ ] Load audio files (MP3, WAV)
  - [ ] Play at prayer time
  - [ ] Volume control
  - [ ] Pause/stop controls
  - [ ] Fade in/out effects
- [ ] **Dua After Adhan:**
  - [ ] Optional dua playback
  - [ ] Custom dua files
  - [ ] Separate volume control
- [ ] **Notification Effects:**
  - [ ] Fade in/out animations
  - [ ] Slide animations
  - [ ] Custom positioning
- [ ] **Write tests for notification and audio systems**

**Deliverables:**
- System tray with menu
- Background service
- System notifications
- Adhan playback
- Dua after adhan
- Notification effects

---

### ⏳ Phase 5: Task Scheduler (Week 6-7)
**Duration:** 1-2 weeks  
**Status:** ⏳ Pending

**Goal:** Implement task scheduling system.

**Tasks:**
- [ ] **Task Creation UI:**
  - [ ] Task form with validation
  - [ ] Task type selection (info, warning, command, shutdown, multimedia)
  - [ ] Frequency options (once, daily, weekly, monthly, startup)
  - [ ] Time picker
  - [ ] Day/month selection
  - [ ] Message/command input
- [ ] **Task Types Implementation:**
  - [ ] Info messages (notification)
  - [ ] Warning/error dialogs
  - [ ] Command execution (shell)
  - [ ] System shutdown
  - [ ] System hibernate
  - [ ] Multimedia playback
- [ ] **Task Execution Engine:**
  - [ ] Check tasks every minute
  - [ ] Execute based on frequency
  - [ ] Track last execution
  - [ ] Handle errors gracefully
  - [ ] Log execution history
- [ ] **Task Management:**
  - [ ] List all tasks
  - [ ] Edit tasks
  - [ ] Delete tasks
  - [ ] Enable/disable tasks
  - [ ] Task history viewer
- [ ] **Task Persistence:**
  - [ ] Save to SQLite database
  - [ ] Load on startup
  - [ ] Export tasks to file
  - [ ] Import tasks from file
- [ ] **Write tests for task scheduler**

**Deliverables:**
- Task creation form
- Task list with management
- Task execution engine
- All task types working
- Task history/logs
- Import/export functionality

---

### ⏳ Phase 6: Advanced Features (Week 7-8)
**Duration:** 1-2 weeks  
**Status:** ⏳ Pending

**Goal:** Implement advanced features from original Shollu.

**Tasks:**
- [ ] **Auto-start on System Boot:**
  - [ ] Windows: Registry entry
  - [ ] macOS: Launch Agent
  - [ ] Linux: .desktop file
  - [ ] Settings toggle
- [ ] **Drop Zone (Floating Widget):**
  - [ ] Floating window
  - [ ] Transparent background option
  - [ ] Always on top
  - [ ] Snap to screen edges
  - [ ] Customizable content
  - [ ] Font size adjustment
- [ ] **Keyboard Shortcuts:**
  - [ ] Global shortcuts
  - [ ] In-app shortcuts
  - [ ] Customizable bindings
- [ ] **Backup/Restore Settings:**
  - [ ] Export settings to file
  - [ ] Import settings from file
  - [ ] Backup tasks
  - [ ] Restore from backup
- [ ] **Import Legacy Shollu3 Settings:**
  - [ ] Read Windows Registry (Windows only)
  - [ ] Convert to new format
  - [ ] Import tasks from Task.dat
  - [ ] Import preferences
- [ ] **Multi-language Support:**
  - [ ] English
  - [ ] Indonesian
  - [ ] Arabic
  - [ ] Javanese
  - [ ] Sundanese
  - [ ] Acehnese
  - [ ] Palembang
  - [ ] Banyumasan
  - [ ] Port language packs from `shollu-old/Languages/`
- [ ] **Accessibility:**
  - [ ] Screen reader support
  - [ ] Keyboard navigation
  - [ ] High contrast mode
  - [ ] Font size adjustment
  - [ ] WCAG AA compliance
- [ ] **Write tests for advanced features**

**Deliverables:**
- Auto-start functionality
- Drop zone widget
- Keyboard shortcuts
- Backup/restore
- Legacy import
- Multi-language support (8+ languages)
- Accessibility features

---

### ⏳ Phase 7: Polish & Testing (Week 8-9)
**Duration:** 1-2 weeks  
**Status:** ⏳ Pending

**Goal:** Polish UI/UX and comprehensive testing.

**Tasks:**
- [ ] **Cross-platform Testing:**
  - [ ] Windows 10/11 testing
  - [ ] macOS 12+ testing
  - [ ] Ubuntu 20.04+ testing
  - [ ] Fedora testing
  - [ ] Arch Linux testing
- [ ] **Performance Optimization:**
  - [ ] Bundle size optimization (target: <20MB)
  - [ ] Memory usage optimization (target: <100MB)
  - [ ] Startup time optimization (target: <2s)
  - [ ] Battery usage optimization
  - [ ] Lazy loading implementation
- [ ] **UI/UX Improvements:**
  - [ ] Smooth animations
  - [ ] Loading states
  - [ ] Error states
  - [ ] Empty states
  - [ ] Responsive design refinement
  - [ ] Dark mode polish
- [ ] **Error Handling:**
  - [ ] Graceful error recovery
  - [ ] User-friendly error messages
  - [ ] Error logging system
  - [ ] Crash reporting
- [ ] **Logging System:**
  - [ ] Debug logs
  - [ ] Error logs
  - [ ] User action logs
  - [ ] Log rotation
- [ ] **Documentation:**
  - [ ] User guide
  - [ ] FAQ
  - [ ] Troubleshooting guide
  - [ ] Video tutorials
  - [ ] API documentation
  - [ ] Architecture guide
- [ ] **Final Testing:**
  - [ ] End-to-end tests
  - [ ] Regression tests
  - [ ] Performance tests
  - [ ] Accessibility tests
  - [ ] Security audit

**Deliverables:**
- Tested on all platforms
- Optimized performance
- Polished UI/UX
- Comprehensive error handling
- Complete documentation
- Ready for release

---

### ⏳ Phase 8: Deployment (Week 9-10)
**Duration:** 1-2 weeks  
**Status:** ⏳ Pending

**Goal:** Build installers and deploy to production.

**Tasks:**
- [ ] **Build Installers:**
  - [ ] Windows: .msi, .exe (NSIS)
  - [ ] macOS: .dmg, .app
  - [ ] Linux: .deb, .rpm, .AppImage
- [ ] **Code Signing:**
  - [ ] Windows: Authenticode certificate
  - [ ] macOS: Apple Developer ID
  - [ ] Linux: GPG signature
- [ ] **Auto-updater Setup:**
  - [ ] Update server configuration
  - [ ] Update mechanism implementation
  - [ ] Release channels (stable, beta)
  - [ ] Update notifications
- [ ] **GitHub Releases:**
  - [ ] Release notes
  - [ ] Changelog
  - [ ] Download links
  - [ ] Version tagging
  - [ ] Asset uploads
- [ ] **Website/Landing Page:**
  - [ ] Features showcase
  - [ ] Screenshots
  - [ ] Download links
  - [ ] Documentation links
  - [ ] System requirements
- [ ] **Migration Guide:**
  - [ ] From Shollu v3 to v4
  - [ ] Settings migration steps
  - [ ] Task migration steps
  - [ ] FAQ
  - [ ] Troubleshooting
- [ ] **Community Setup:**
  - [ ] GitHub Discussions
  - [ ] Issue templates
  - [ ] Contributing guidelines
  - [ ] Code of conduct
- [ ] **Marketing:**
  - [ ] Social media announcement
  - [ ] Blog post
  - [ ] Demo video
  - [ ] Press release

**Deliverables:**
- Installers for all platforms
- Auto-updater working
- GitHub releases
- Website/landing page
- Migration guide
- Community setup
- Marketing materials

---

## Success Criteria

### Feature Parity
- ✅ 100% feature parity with Shollu v3 (MANDATORY)
- ✅ All original features implemented
- ✅ Same behavior and accuracy

### Code Quality
- ✅ TypeScript strict mode compliance
- ✅ 0 ESLint errors
- ✅ 0 console warnings
- ✅ Arrow functions only
- ✅ 90%+ test coverage for core logic
- ✅ Proper error handling
- ✅ Accessible UI (WCAG AA)

### Performance
- ✅ Bundle size < 20MB
- ✅ Memory usage < 100MB
- ✅ Startup time < 2 seconds
- ✅ Prayer time accuracy ±1 minute
- ✅ Battery usage < 1% per hour

### Compatibility
- ✅ Windows 10/11
- ✅ macOS 12+
- ✅ Ubuntu 20.04+
- ✅ Other major Linux distros

## DevContainer Setup

**GUI Support:** Xvfb + VNC + noVNC for running Tauri apps in container.

**Access:** http://localhost:6080/vnc.html (browser-based desktop)

**Services:**
- Port 5900: VNC server
- Port 6080: noVNC (browser access)
- Port 1420: Vite dev server

**Start services:** `bash .devcontainer/start-services.sh`

## Testing Requirements

**MANDATORY:** Every feature MUST have tests. NO exceptions.

### Unit Tests
- Test pure functions (calculations, utilities)
- Test edge cases and boundary conditions
- Mock external dependencies
- Use descriptive test names

### Integration Tests
- Test complete user workflows
- Test store interactions
- Test component behavior

### Test Structure
```typescript
// ✅ Good test example
import { describe, it, expect } from 'vitest';
import { calculatePrayerTimes } from '@/lib/prayer-times/calculator';

describe('calculatePrayerTimes', () => {
  it('should calculate correct Fajr time for Jakarta', () => {
    const result = calculatePrayerTimes({
      date: DateTime.fromISO('2024-01-15'),
      latitude: -6.2088,
      longitude: 106.8456,
      method: 'MWL',
    });
    
    expect(result.fajr).toBe('04:30:00');
  });
});
```

### Coverage Requirements
- Minimum 90% coverage for `lib/` directory
- Minimum 80% coverage for components
- 100% coverage for critical calculations

## Quick Reference

```bash
# Development
npm run tauri:dev    # Start app (opens in VNC desktop)
npm run dev          # Vite dev server only

# Testing (REQUIRED)
npm run test         # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Code Quality (End of Session - REQUIRED)
npm run format       # Format code (run first)
npm run lint         # Check errors (run second)
npm run test         # Run tests (run third)
npm run build        # Verify build (run last)

# Rust
cd src-tauri
cargo check          # Check Rust code
cargo clippy         # Lint Rust
cargo fmt            # Format Rust
cargo test           # Run Rust tests
```

## Additional Resources

**Detailed Rules:** `.cursorrules` - Complete coding conventions and patterns  
**Quick Guide:** `.ai/README.md` - Common patterns and examples  
**Original Code:** `shollu-old/` - Reference only (DO NOT MODIFY)
