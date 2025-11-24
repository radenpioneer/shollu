# Session Update Template

Use this template when updating documentation at the end of each session.

## Session Report Naming Convention

**Format:** `reports/YYYY-MM-DD-HHMM.md`

**Examples:**
- `reports/2025-11-24-0542.md` (November 24, 2025 at 05:42)
- `reports/2025-12-01-1430.md` (December 1, 2025 at 14:30)

**Command to get current timestamp:**
```bash
date +"%Y-%m-%d-%H%M"
```

**CRITICAL RULE:**
- ✅ **ALWAYS CREATE A NEW FILE** for each session
- ❌ **NEVER EDIT PREVIOUS REPORTS** - They are read-only historical records
- 📋 Previous reports serve as audit trail for humans and AI agents
- 🔒 Once a session report is created, it is immutable

## 1. Update AGENTS.md

### Code Coverage Status Section
```markdown
**Last Updated:** YYYY-MM-DD
**Overall Coverage:** X% Statements, Y% Branches, Z% Functions, W% Lines

| Category | Coverage | Files Tested | Tests | Status |
|----------|----------|--------------|-------|--------|
| **Utilities** | X% | N/M | ## | ✅/🔴/⚪ |
| **Stores** | X% | N/M | ## | ✅/🔴/⚪ |
| **Components** | X% | N/M | ## | ✅/🔴/⚪ |
| **Integration Tests** | X% | N/M | ## | ✅/🔴/⚪ |
| **Lib (Prayer Calc)** | X% | N/M | ## | ✅/🔴/⚪ |

**Total Tests:** ### passing ✅
```

### Phase Status Section
Update checkboxes in current phase:
```markdown
- [x] Completed task
- [ ] Pending task
```

## 2. Update README.md

### Top Section
```markdown
**Last Updated:** YYYY-MM-DD
**Progress:** ~XX% complete (Phase N status)
```

### Badges
```markdown
[![Tests](https://img.shields.io/badge/tests-###%20passing-brightgreen)](reports/YYYY-MM-DD-HHMM.md)
[![Coverage](https://img.shields.io/badge/coverage-XX%25-brightgreen)](reports/YYYY-MM-DD-HHMM.md)
```

**Important:** Update badge links to point to the latest session report!

### Quality Metrics Table
```markdown
| Metric | Status | Details |
|--------|--------|---------|
| **Test Coverage** | ![Coverage](https://img.shields.io/badge/coverage-XX%25-brightgreen) | XX% statements, YY% branches, ZZ% functions, WW% lines |
| **Tests Passing** | ![Tests](https://img.shields.io/badge/tests-###%2F###-brightgreen) | All unit and integration tests passing |
```

### Coverage Breakdown
```markdown
Category          Coverage    Files    Tests    Status
────────────────────────────────────────────────────────
Utilities         XX%         N/M      ##       ✅/🔴/⚪
Stores            XX%         N/M      ##       ✅/🔴/⚪
Components        XX%         N/M      ##       ✅/🔴/⚪
Integration       XX%         N/M      ##       ✅/🔴/⚪
Prayer Calc       XX%         N/M      ##       ✅/🔴/⚪
────────────────────────────────────────────────────────
TOTAL             XX%         N/M      ###      ✅/🔴/⚪
```

## 3. Create reports/YYYY-MM-DD-HHMM.md (New Session Report)

### Filename
```bash
# Get current timestamp
date +"%Y-%m-%d-%H%M"

# Create file
reports/2025-11-24-0542.md  # Example
```

### Header
```markdown
# Session Report: YYYY-MM-DD-HHMM

**Session:** [Session Name/Description]
**Date:** YYYY-MM-DD
**Time:** HH:MM
**Duration:** ~X hours
**Status:** Complete ✅ / In Progress 🔄 / Blocked 🔴
```

### Required Sections
```markdown
## Overview
Brief description of session goals and outcomes

## Test Statistics
- **Total Tests:** ### passing ✅
- **Test Files:** ##
- **Test Duration:** ~X-Y seconds
- **Coverage:** XX% statements, YY% branches, ZZ% functions, WW% lines

## Session Objectives
1. ✅/🔄/🔴 Objective 1
2. ✅/🔄/🔴 Objective 2

## Accomplishments
- ✅ Task 1
- ✅ Task 2

## Files Created/Modified
**New Files (##):**
- List of new files

**Modified Files (##):**
- List of modified files

## Next Session Goals
- ⏳ Goal 1
- ⏳ Goal 2
```

## 4. Verification Checklist

Before committing documentation updates:

- [ ] **Created NEW session report:** `reports/YYYY-MM-DD-HHMM.md` (not edited old one)
- [ ] **Verified previous reports are untouched** (read-only audit trail)
- [ ] Updated AGENTS.md (coverage table, phase checkboxes)
- [ ] Updated README.md (badges, metrics, links to NEW report)
- [ ] Dates are current (YYYY-MM-DD format)
- [ ] Test counts match across all documents
- [ ] Coverage percentages match across all documents
- [ ] **Badges in README.md link to NEW session report**
- [ ] Phase checkboxes updated in AGENTS.md
- [ ] Session report includes all required sections
- [ ] "Next Session Goals" updated in NEW session report
- [ ] All links working (especially to NEW report)
- [ ] Ran: `npm run format && npm run lint && npm run test && npm run build`

**CRITICAL:** Never edit previous session reports. They are immutable historical records.

## 5. Badge Color Guide

Use these colors for badges:

- **Green (brightgreen):** 90-100%, passing, no errors
- **Yellow (yellow):** 70-89%, warnings
- **Orange (orange):** 50-69%, needs attention
- **Red (red):** <50%, failing, errors

## 6. Status Emoji Guide

- ✅ Complete / Passing
- 🔄 In Progress
- 🔴 Blocked / Failing
- ⚪ Not Started / N/A
- 🚀 Ready to Start
- ⏳ Pending
- 🎯 Target / Goal

---

**Note:** This template should be updated if documentation structure changes.
