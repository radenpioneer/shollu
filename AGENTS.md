# AGENTS.md

## Identity
You are an expert full-stack engineer specializing in Tauri, React 19, TypeScript, and Rust. You are working on Shollu v4.0, a complete rewrite of an Islamic prayer time reminder from Delphi to modern cross-platform stack.

**Current Phase:** Phase 3 (Main Features)  
**Status:** Phase 1 & 2 Complete ✅  
**Repository:** https://github.com/radenpioneer/shollu (branch: dev-20250609)

- **Frontend:** React 19.1.0, TypeScript 5.8.3 (strict), Luxon 3.7.2, Nanostores 1.1.0, Tailwind CSS 4.1.17
- **Backend:** Tauri 2.x (Rust), SQLite (tauri-plugin-sql)
- **Build:** Vite 7.x, ESLint 9 (flat config), Prettier
- **Testing:** Vitest 3.x, @testing-library/react, @vitest/ui
- **MCP Servers:** SQLite, Git, Fetch (configured in `mcp.json`)

## Code Coverage Status

**Last Updated:** 2025-11-24 06:35  
**Overall Coverage:** 100% Statements, 95% Branches, 100% Functions, 100% Lines ✅

| Category | Coverage | Files Tested | Tests | Status |
|----------|----------|--------------|-------|--------|
| **Utilities** | 100% | 1/1 | 10 | ✅ Complete |
| **Stores** | 100% | 4/4 | 62 | ✅ Complete |
| **Components** | 100% | 9/9 | 79 | ✅ Complete |
| **Integration Tests** | 100% | 2/2 | 16 | ✅ Complete |
| **Lib (Prayer Calc)** | 100% | 4/4 | 117 | ✅ Complete |
| **Validation Tests** | 100% | 1/1 | 14 | ✅ Complete |

**Total Tests:** 288 passing ✅  
**Test Files:** 22  
**Test Duration:** ~10-11 seconds

**Detailed Coverage:**
- **Statements:** 100% (all code paths executed)
- **Branches:** 95% (high-latitude edge cases covered)
- **Functions:** 100% (all functions tested)
- **Lines:** 100% (all lines covered)

**Coverage Goals:**
- ✅ Phase 1 (Foundation): 90%+ coverage ACHIEVED (100%)
- ✅ Phase 2 (Prayer Calc): 95%+ coverage ACHIEVED (100%)
- 🎯 Phase 3+: 85%+ coverage for UI features

**Test Commands:**
```bash
npm run test              # Run all tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Generate coverage report
```

**Test Infrastructure:**
- Vitest 4.0.13 (test runner)
- @testing-library/react (component testing)
- @testing-library/user-event (user interaction testing)
- @vitest/coverage-v8 (coverage reporting)
- jsdom (DOM environment)

## Code Style

### TypeScript
- Use strict mode. NO `any` type (use `unknown` if needed).
- Use path aliases: `@/components`, `@/lib`, `@/stores`, `@/types`, `@/hooks`.
- **Arrow functions ONLY.** NO function declarations.
- Explicit return types for arrow functions.
- Functional components only (no class components).

### File Organization
- **Colocate related files** - Keep components, tests, and related files together in their own folder.
- Structure: `ComponentName/index.tsx`, `ComponentName/ComponentName.test.tsx`
- One component per folder for complex components.
- Simple components can be single files.

### Documentation
- **JSDoc REQUIRED** for all exported functions, components, and types.
- Document parameters, return types, and purpose.
- Explain WHY, not WHAT (code should be self-explanatory).
- Include examples for complex functions.

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

## MCP Servers

The project is configured with the following MCP servers (see `mcp.json`):

- **SQLite:** Allows inspecting the local SQLite database used by the app.
- **Git:** Provides context about the git repository status and history.
- **Fetch:** Enables fetching external resources when needed.

Ensure you have the necessary permissions and dependencies installed (Node.js) to run these servers.

## Project Structure

```
src/
├── components/
│   ├── PrayerCard/              # Colocated component
│   │   ├── index.tsx            # Component implementation
│   │   ├── PrayerCard.test.tsx  # Component tests
│   │   └── types.ts             # Component-specific types
│   ├── Layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── MainPage/
│       ├── index.tsx
│       ├── PrayerTimesDisplay.tsx
│       └── NextPrayerCard.tsx
├── lib/
│   ├── prayer-times/
│   │   ├── calculator.ts
│   │   ├── calculator.test.ts   # Colocated tests
│   │   ├── methods.ts
│   │   └── qibla.ts
│   └── db/
│       ├── client.ts
│       └── schema.ts
├── stores/
│   ├── settings.ts
│   ├── prayer-times.ts
│   └── tasks.ts
├── types/                       # Global types only
├── hooks/                       # Custom React hooks
└── assets/

Other:
- src-tauri/: Rust backend
- shollu-old/: Original Delphi code (reference only)
```

**Colocation Rules:**
- Complex components: Own folder with `index.tsx` + tests
- Simple components: Single file in parent folder
- Tests: Always colocated with implementation
- Types: Colocate if component-specific, global if shared

### Component Pattern (Arrow Functions + Colocation + JSDoc)
```typescript
// components/PrayerCard/index.tsx
import { useStore } from '@nanostores/react';
import { $prayerTimes } from '@/stores/prayer-times';
import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';
import type { PrayerCardProps } from './types';

/**
 * Displays a single prayer time in a card format.
 * 
 * @param props - Component props
 * @param props.className - Optional CSS classes for styling
 * @returns Prayer card component showing Fajr time
 * 
 * @example
 * ```tsx
 * <PrayerCard className="mb-4" />
 * ```
 */
const PrayerCard = ({ className }: PrayerCardProps): JSX.Element => {
  const times = useStore($prayerTimes);
  
  return (
    <div className={cn('rounded-lg bg-white p-4', className)}>
      <h3 className="text-lg font-semibold">{times.fajr}</h3>
    </div>
  );
};

export default PrayerCard;

// components/PrayerCard/types.ts
export interface PrayerCardProps {
  className?: string;
}

// components/PrayerCard/PrayerCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PrayerCard from './index';

describe('PrayerCard', () => {
  it('should render prayer time', () => {
    const { getByText } = render(<PrayerCard />);
    expect(getByText(/fajr/i)).toBeInTheDocument();
  });
});
```

### Nanostores Pattern (Arrow Functions + JSDoc)
```typescript
// stores/prayer-times.ts
import { map } from 'nanostores';

/**
 * Global store for prayer times.
 * Contains all 6 prayer times for the current date.
 */
export const $prayerTimes = map<PrayerTimes>({
  date: '',
  fajr: '',
  dhuhr: '',
  asr: '',
  maghrib: '',
  isha: '',
});

/**
 * Updates prayer times in the global store.
 * 
 * @param times - Partial prayer times to update
 * 
 * @example
 * ```ts
 * updatePrayerTimes({ fajr: '05:30:00', dhuhr: '12:15:00' });
 * ```
 */
export const updatePrayerTimes = (times: Partial<PrayerTimes>): void => {
  $prayerTimes.set({ ...$prayerTimes.get(), ...times });
};
```

### Luxon Pattern (Arrow Functions + JSDoc)
```typescript
import { DateTime } from 'luxon';

/**
 * Formats a prayer time string from 24-hour format to HH:mm.
 * 
 * @param time - Time string in HH:mm:ss format
 * @returns Formatted time string in HH:mm format
 * 
 * @example
 * ```ts
 * formatPrayerTime('05:30:00') // Returns '05:30'
 * ```
 */
const formatPrayerTime = (time: string): string => {
  return DateTime.fromFormat(time, 'HH:mm:ss').toFormat('HH:mm');
};

/**
 * Gets current time in Jakarta timezone.
 * 
 * @returns DateTime object in Asia/Jakarta timezone
 */
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
6. **Documentation Updates (REQUIRED at End of Session):**
   
   **AGENTS.md** (Technical - for AI agents and developers):
   - Update code coverage status table
   - Update phase completion checkboxes
   - Add new guidelines or patterns discovered
   - Update tech stack versions if changed
   
   **README.md** (Human-readable - for managers and contributors):
   - Update "Last Updated" date and progress percentage
   - Update badges (tests passing, coverage percentage, build status)
   - **Update badge links to point to the NEW session report**
   - Update "Current Status" section with what's completed
   - Update "Quality Metrics" table and coverage breakdown
   - Add any new features or capabilities to feature list
   - Keep it concise and manager-friendly
   
   **reports/YYYY-MM-DD-HHMM.md** (Session Report - timestamped):
   - **ALWAYS CREATE A NEW FILE** - Never edit previous session reports
   - Get current timestamp: `date +"%Y-%m-%d-%H%M"`
   - Create new file: `reports/YYYY-MM-DD-HHMM.md` (e.g., `reports/2025-11-24-0542.md`)
   - Include session information (date, time, duration, status)
   - Include test statistics and coverage details
   - Include session objectives and what was accomplished
   - Include files created/modified
   - Include next session goals
   - Keep detailed breakdown of all work done
   - **Previous reports are READ-ONLY** - They serve as historical audit trail
   
   **All documents MUST be updated together** to maintain consistency.
   
   **Template:** See [reports/SESSION_TEMPLATE.md](reports/SESSION_TEMPLATE.md) for detailed update instructions and checklist.
   
   **CRITICAL:** Each session creates a NEW timestamped report. Old reports are NEVER modified. This ensures complete audit trail for both humans and AI agents.

## Documentation Structure

This project maintains **three synchronized documentation files**, each serving a different audience:

### 1. AGENTS.md (This File)
**Audience:** AI agents, developers, technical contributors  
**Purpose:** Technical guidelines, code standards, workflow rules  
**Tone:** Technical, prescriptive, detailed

### 2. README.md
**Audience:** Project managers, new contributors, stakeholders  
**Purpose:** Project overview, quick start, progress tracking  
**Tone:** Accessible, manager-friendly, visual (badges, tables)

### 3. reports/YYYY-MM-DD-HHMM.md (Timestamped Session Reports)
**Audience:** QA engineers, auditors, technical reviewers  
**Purpose:** Comprehensive session documentation with test details  
**Tone:** Detailed, audit-ready, chronological  
**Naming:** `reports/YYYY-MM-DD-HHMM.md` (e.g., `reports/2025-11-24-0542.md`)  
**Frequency:** One file per session

### Reports Directory Structure

**Naming Convention:** `reports/YYYY-MM-DD-HHMM.md`  
**Example:** `reports/2025-11-24-0542.md` (November 24, 2025 at 05:42)  
**Purpose:** Chronological audit trail of all sessions

**Files:**
- Timestamped session reports (one per session)
- `SESSION_TEMPLATE.md` (update template and checklist)

**Get Current Timestamp:**
```bash
date +"%Y-%m-%d-%H%M"
```

### Synchronization Rules

**Critical Consistency Points:**
1. **Test Count** - Must match in AGENTS.md, README.md, and latest session report
2. **Coverage Percentages** - Must match exactly across all documents
3. **Last Updated Date** - Must be current (YYYY-MM-DD format)
4. **Phase Status** - Must be consistent across all docs
5. **Badge Links** - README.md badges must link to latest session report

**Badge Update Rules:**
- Green (brightgreen): 90-100%, passing, no errors
- Yellow (yellow): 70-89%, warnings
- Orange (orange): 50-69%, needs attention
- Red (red): <50%, failing, errors

## Boundaries

- DO NOT modify `shollu-old/` directory (reference only).
- DO NOT use `any` type in TypeScript.
- DO NOT use function declarations. Arrow functions ONLY.
- DO NOT use custom CSS files or styled-components.
- DO NOT use moment.js, date-fns, Redux, or Context API for global state.
- DO NOT skip tests. Every feature MUST have tests.
- DO NOT skip end-of-session checks (format, lint, test, build).
- DO NOT implement features that differ from original Shollu v3 behavior.
- DO NOT scatter related files. Colocate components with their tests and types.
- DO NOT skip JSDoc documentation. All exported items MUST be documented.
- DO NOT create new documentation files. Use ONLY: AGENTS.md, README.md, and reports/ folder.
  - Implementation details go in AGENTS.md (under relevant phase)
  - User-facing info goes in README.md
  - Session logs go in reports/YYYY-MM-DD-HHMM.md
  - NO separate docs/ folder or standalone guide files

## Project Plan & Status

**Overall Progress:** ~25% complete (Phase 1 & 2 done)  
**Next:** Phase 3 - API Integration & Caching (3.5 hours)  
**Timeline:** 7-8 weeks remaining  
**Feature Parity:** 100% required with Shollu v3

### ✅ Phase 1: Foundation (COMPLETE - Week 1-2)
**Duration:** ~4 hours  
**Status:** ✅ Done (100% Complete with Tests)

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
- [x] Production build working (~94KB gzipped)
- [x] **Testing infrastructure (Vitest + React Testing Library)**
- [x] **167 unit tests (100% coverage)**
- [x] **22 integration tests (navigation + state management)**
- [x] **All components follow guidelines (arrow functions, JSDoc, colocation)**
- [x] **Code formatted, linted, and building successfully**

**Deliverables:**
- Working Tauri app with navigation
- Live clock (updates every second)
- Type-safe stores and components
- Browser-based desktop access (http://localhost:6080/vnc.html)
- **100% test coverage for all Phase 1 code**
- **Comprehensive test suite (167 tests passing)**

---

### ✅ Phase 2: Prayer Time Calculations (COMPLETE - Week 2)
**Duration:** 24 minutes  
**Status:** ✅ Done (100% Complete with Tests)

**Goal:** Implement prayer time calculation engine with 100% feature parity.

**Completed:**
- [x] Port algorithms from `shollu-old/Shollu.pas` (maintain EXACT compatibility)
- [x] Implement 7 calculation methods:
  - [x] Muslim World League (MWL)
  - [x] Islamic Society of North America (ISNA)
  - [x] Egyptian General Authority of Survey
  - [x] Umm Al-Qura University, Makkah
  - [x] University of Islamic Sciences, Karachi
  - [x] Institute of Geophysics, Tehran
  - [x] Shia Ithna-Ashari, Leva Institute, Qum (Jafari)
- [x] Support Standard (Shafi'i) and Hanafi Asr calculations
- [x] Add Qibla direction calculation (with distance and compass direction)
- [x] Implement timezone handling with Luxon
- [x] Support prayer time adjustments (±minutes per prayer)
- [x] Implement high-latitude adjustments (1/7th of night method)
- [x] **Write 117 unit tests for ALL calculation functions**
- [x] **Write 14 validation tests for real-world accuracy**
- [x] Validate against original Shollu (±1 minute accuracy)
- [x] Integrate with prayer-times store (auto-recalculation)
- [x] Display real prayer times in MainPage component
- [x] Current/next prayer indicators

**Testing Results:**
- 117 prayer calculation tests (100% coverage)
- 14 validation tests (Jakarta, London, New York, Mecca)
- All edge cases covered (high latitudes, date boundaries)
- ±1 minute accuracy achieved
- 100% code coverage for calculation logic

**Deliverables:**
- ✅ Prayer time calculation engine (`src/lib/prayer-times/calculator.ts`)
- ✅ Astronomical formulas (`src/lib/prayer-times/astronomical.ts`)
- ✅ 7 calculation methods (`src/lib/prayer-times/methods.ts`)
- ✅ Qibla direction calculator (`src/lib/prayer-times/qibla.ts`)
- ✅ 117 unit tests with 100% coverage
- ✅ 14 validation tests for real-world accuracy
- ✅ Working MainPage with real prayer times
- ✅ Current/next prayer indicators
- ✅ Auto-recalculation on settings change
- ⏳ Location database with search (Phase 3)

---

### 🔜 Phase 3: API Integration & Caching (CURRENT - Week 3)
**Duration:** 3.5 hours  
**Status:** 🔜 Ready to start (Plan complete)

**Goal:** Implement cache-first, offline-first prayer time system with multi-API support.

**Priority Tasks:**
- [ ] **SQLite Database Setup (30 min)**
  - [ ] Install @tauri-apps/plugin-sql package
  - [ ] Create database client (connection management)
  - [ ] Create schema (prayer_times_cache, cache_metadata)
  - [ ] Add indexes for fast lookups
- [ ] **Cache Operations (45 min)**
  - [ ] Implement cache CRUD functions
  - [ ] Add bulk insert for 30-day caching
  - [ ] Add cache metadata tracking
  - [ ] Implement stale cache detection
  - [ ] Add cache coverage reporting
- [ ] **API Integration (45 min)**
  - [ ] Create Kemenag API client (Indonesia-specific)
  - [ ] Create Aladhan API client (global)
  - [ ] Implement smart API selection (locale-based)
  - [ ] Add timeout and error handling
  - [ ] Write API tests
- [ ] **Background Refresh Service (60 min)**
  - [ ] Create refresh service (fetch 30 days)
  - [ ] Implement refresh scheduler (startup, daily, location change)
  - [ ] Add manual refresh trigger
  - [ ] Integrate with stores
- [ ] **Cache-First Service Layer (30 min)**
  - [ ] Update prayer-times service (cache-first)
  - [ ] Ensure instant startup (never blocks)
  - [ ] Update tests
- [ ] **UI Integration (30 min)**
  - [ ] Add refresh button component
  - [ ] Add cache status indicator
  - [ ] Add data source badge
  - [ ] Update MainPage component

**Deliverables:**
- ✅ SQLite database with caching
- ✅ Multi-API support (Kemenag + Aladhan + Local)
- ✅ Background refresh (startup, daily, location change)
- ✅ 30-day bulk caching (97% API call reduction)
- ✅ Instant startup (0ms, always shows cached times)
- ✅ Manual refresh button
- ✅ Cache status indicators
- ✅ Comprehensive tests

**Implementation Guide:** See Phase 3 Implementation Details section below.

---

## Phase 3 Implementation Details

### Architecture: Cache-First Strategy

```
┌─────────────────────────────────────────────────────────┐
│         Cache-First Prayer Time Service                 │
├─────────────────────────────────────────────────────────┤
│  USER OPENS APP                                         │
│    ↓                                                    │
│  1. Read from Cache (instant, always first)            │
│  2. Display cached times immediately (0ms)             │
│  3. Background refresh (if needed):                    │
│     • On app startup (once per session)                │
│     • Daily at midnight                                │
│     • When location changes                            │
│     • Manual refresh button                            │
│  4. Update cache silently (no UI interruption)         │
└─────────────────────────────────────────────────────────┘
```

### Database: SQLite (Already Integrated)

**Why SQLite:**
- ✅ Already integrated via `tauri-plugin-sql`
- ✅ Perfect for offline-first desktop app
- ✅ Smallest footprint (~600KB)
- ✅ Most mature (24 years, billions of deployments)
- ✅ No custom integration needed

**Rejected Alternatives:**
- ❌ libSQL - No Tauri plugin, overkill for single-user app
- ❌ PGlite - No Tauri plugin, 5x larger, slower, not for desktop

### Multi-API Strategy

**Supported APIs:**
1. **Kemenag (Indonesia)** - Official government data via community scraper
   - Source: https://bimasislam.kemenag.go.id/jadwalshalat
   - API: https://api-jadwal-sholat.vercel.app/api
   - Coverage: Indonesia only (2013-2073)
   
2. **Aladhan (Global)** - Official REST API
   - Source: https://aladhan.com/prayer-times-api
   - API: https://api.aladhan.com/v1
   - Coverage: Worldwide
   
3. **Local Calculation** - Our implementation (Phase 2)
   - Always works fallback
   - No network needed

**Smart Selection:**
```typescript
// Auto-detect Indonesia: use Kemenag
// Others: use Aladhan
// Offline/failure: use Local
```

### Implementation Steps

**Step 1: Database Setup (30 min)**
```bash
npm install @tauri-apps/plugin-sql
```

Create `src/lib/db/client.ts`:
```typescript
import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

export const initDatabase = async (): Promise<Database> => {
  if (db) return db;
  db = await Database.load('sqlite:shollu.db');
  await createTables(db);
  return db;
};
```

Create `src/lib/db/schema.ts`:
```sql
CREATE TABLE prayer_times_cache (
  date TEXT, latitude REAL, longitude REAL,
  method TEXT, asr_method TEXT,
  fajr TEXT, sunrise TEXT, dhuhr TEXT, 
  asr TEXT, maghrib TEXT, isha TEXT,
  source TEXT, cached_at INTEGER,
  UNIQUE(date, latitude, longitude, method, asr_method)
);

CREATE TABLE cache_metadata (
  latitude REAL, longitude REAL, method TEXT,
  last_refresh INTEGER, next_refresh INTEGER,
  refresh_status TEXT,
  UNIQUE(latitude, longitude, method)
);
```

**Step 2: Cache Operations (45 min)**

Create `src/lib/db/prayer-cache.ts`:
- `getCachedPrayerTimes()` - Get single day
- `getCachedPrayerTimesRange()` - Get date range
- `savePrayerTimesBulk()` - Bulk insert 30 days
- `needsRefresh()` - Check if stale (>24 hours)
- `updateCacheMetadata()` - Track refresh status
- `getCacheCoverage()` - Get cached date range

**Step 3: API Integration (45 min)**

Create `src/lib/api/kemenag.ts`:
```typescript
export const fetchPrayerTimesFromKemenag = async (
  cityCode: string,
  yearMonth: string
): Promise<PrayerTimes[]> => {
  // Fetch from community scraper
  // Returns full month of data
};
```

Create `src/lib/api/aladhan.ts`:
```typescript
export const fetchPrayerTimesFromAPI = async (
  lat: number, lng: number, date: string,
  method: CalculationMethod, asrMethod: AsrCalculation
): Promise<PrayerTimes> => {
  // Fetch from Aladhan API
  // Returns single day
};
```

**Step 4: Background Refresh (60 min)**

Create `src/lib/prayer-times/refresh-service.ts`:
```typescript
export const refreshPrayerTimesCache = async (
  options: RefreshOptions
): Promise<{ success: boolean; source: string; daysRefreshed: number }> => {
  // 1. Check if refresh needed
  // 2. Try primary API (Kemenag/Aladhan based on location)
  // 3. Fallback to secondary API
  // 4. Fallback to local calculation
  // 5. Save 30 days to cache (bulk insert)
};
```

Create `src/lib/prayer-times/refresh-scheduler.ts`:
```typescript
export const initRefreshScheduler = (): void => {
  // Trigger 1: Refresh on app startup (if stale)
  refreshOnStartup();
  
  // Trigger 2: Schedule daily refresh at midnight
  scheduleDailyRefresh();
  
  // Trigger 3: Watch for location changes
  watchLocationChanges();
};
```

**Step 5: Cache-First Service (30 min)**

Update `src/lib/prayer-times/service.ts`:
```typescript
export const getPrayerTimesService = async (
  options: PrayerTimeServiceOptions
): Promise<PrayerTimes & { source: 'cache' | 'local' }> => {
  // STEP 1: Try cache (instant)
  const cached = await getCachedPrayerTimes(...);
  if (cached) return { ...cached, source: 'cache' };
  
  // STEP 2: Calculate locally (instant, always works)
  const local = calculatePrayerTimes(...);
  return { ...local, source: 'local' };
  
  // Note: Background refresh handles API calls separately
};
```

**Step 6: UI Integration (30 min)**

Create `src/components/MainPage/RefreshButton.tsx`:
```typescript
const RefreshButton = (): React.JSX.Element => {
  const handleRefresh = async () => {
    await triggerManualRefresh();
  };
  
  return (
    <button onClick={handleRefresh}>
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </button>
  );
};
```

Create `src/components/MainPage/CacheStatus.tsx`:
```typescript
const CacheStatus = (): React.JSX.Element => {
  const coverage = await getCacheCoverage(...);
  
  return (
    <div>
      Cached: {coverage.count} days 
      ({coverage.startDate} to {coverage.endDate})
    </div>
  );
};
```

### Settings Updates

Add to `src/types/settings.ts`:
```typescript
export interface AppSettings {
  // ... existing ...
  
  // API Settings (NEW)
  useExternalAPI: boolean;        // Default: false (offline-first)
  apiProvider: 'auto' | 'kemenag' | 'aladhan' | 'local';
  cacheExpiration: number;        // Days, default: 30
}
```

### Benefits

**Performance:**
- API calls: 365/year → 12/year (97% reduction)
- Startup: <1ms (instant, cache hit)
- Never blocks UI on network calls

**User Experience:**
- Instant startup (0ms delay)
- Works 100% offline after first use
- Transparent (shows data source)
- Manual refresh button

**Data Quality:**
- Indonesian users: Official Kemenag data
- Global users: Aladhan API
- Always works: Local calculation fallback

---

### ⏳ Phase 4: Main Features (Week 3-5)
**Duration:** 2-3 weeks  
**Status:** ⏳ Pending

**Goal:** Implement all main UI features with 100% parity.

**Tasks:**
- [x] **MainPage Component:**
  - [x] Current prayer indicator
  - [x] Next prayer countdown
  - [x] All 6 prayer times display
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
- [ ] **Database Integration:** (Moved to Phase 3)
  - See Phase 3 for SQLite implementation
  - Cache-first architecture with 30-day bulk caching
  - Background refresh system
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

### Test Structure (with JSDoc)
```typescript
// lib/prayer-times/calculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculatePrayerTimes } from './calculator';

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
  
  it('should handle timezone conversions correctly', () => {
    // Test implementation
  });
});
```

### Function Documentation Example
```typescript
/**
 * Calculates prayer times for a given date and location.
 * Uses astronomical calculations based on the specified method.
 * 
 * @param params - Calculation parameters
 * @param params.date - Date to calculate prayer times for
 * @param params.latitude - Location latitude (-90 to 90)
 * @param params.longitude - Location longitude (-180 to 180)
 * @param params.method - Calculation method (MWL, ISNA, Egypt, etc.)
 * @returns Object containing all 6 prayer times in HH:mm:ss format
 * 
 * @throws {Error} If latitude or longitude is out of range
 * 
 * @example
 * ```ts
 * const times = calculatePrayerTimes({
 *   date: DateTime.now(),
 *   latitude: -6.2088,
 *   longitude: 106.8456,
 *   method: 'MWL'
 * });
 * console.log(times.fajr); // '04:30:00'
 * ```
 */
export const calculatePrayerTimes = (params: CalculationParams): PrayerTimes => {
  // Implementation
};
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
