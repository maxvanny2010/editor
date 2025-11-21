# 🧭 CHANGELOG

Full release story **React Editor**
(IndexedDB + Redux Toolkit + Vite + React 19 + Tailwind + Vitest)

---

# 1.x — Editor Era (Canvas, Tools, Layers, History, Menu, Performance)

---

## [1.5.0-beta.2] — 2025-11-12

### 📦 Epic: M7 — Performance Improvements (Drawing + FPS)

#### Added

- Implemented `requestAnimationFrame` drawing loop for ultra-smooth brush, line, and eraser rendering.
- Added built-in FPS meter for real-time performance monitoring.
- Optimized canvas batching to reduce layout thrashing and CPU spikes.

#### Changed

- Unified drawing pipeline for tools (brush, line, eraser) to reduce redundant computations.
- Reduced unnecessary React renders with memoized viewport and tools panel state.

#### Fixed

- Eliminated micro-lag when switching tool thickness.
- Fixed jittering during fast diagonal strokes.

---

## [1.5.0-beta.1] — 2025-11-11

### 📦 Epic: M7 — Performance Baseline

#### Added

- Global performance sweep across core editor modules.
- Reduced Dexie read/write overhead when opening large projects.
- Added lightweight developer profiling tools.

#### Changed

- Improved React render cycle in editor shell.
- Reorganized internal project state for faster history snapshotting.

---

## [1.4.0] — 2025-11-05

### 📦 Epic: M6 — Top Menu / App Shell

#### Added

- Full top menu bar (`File`, `Edit`, `Projects`, `View`, `About`).
- File menu: Open project, Close project, Save as PNG, Load recent.
- Edit menu: Undo / Redo.
- Projects menu: quick navigation to home.
- View menu: toggle UI panels (Tools, Layers, History).
- About: modal with project metadata.

#### Changed

- Unified header styling with Tailwind + design tokens.
- Improved keyboard navigation and accessibility.

---

## [1.3.0] — 2025-10-30

### 📦 Epic: M5 — Full Editor History (Snapshots)

#### Added

- Full snapshot-based action history (Undo/Redo).
- Snapshot format covers layers, canvas pixels, tool mode, viewport, metadata.
- History panel with timestamps.
- Dexie persistence for history stack.

#### Fixed

- Fixed mismatch between Redux and canvas state.
- Fixed incorrect jump on undo during fast drawing.

---

## [1.3.0-beta.1] — 2025-10-28

### 📦 Part of Epic: M5 — Reload Protection

#### Added

- Persistent “active project lock” to prevent accidental reload losses.
- Safe workflow guard component.

---

## [1.2.0] — 2025-10-25

### 📦 Epic: M4 — Layers System (Full Implementation)

#### Added

- Layer creation, deletion, rename.
- Drag & drop reorder.
- Visibility toggle.
- Opacity control.
- Full Dexie persistence for layers.

#### Changed

- Refactored layers to Z-stack model.
- Improved multi-layer merging pipeline.

#### Fixed

- Fixed flicker on visibility toggle.
- Fixed incorrect index updates when reordering.

---

## [1.1.0] — 2025-10-23

### 📦 Epic: M3 — Editor Core (Canvas + Tools)

#### Added

- Base editor canvas.
- Viewport with pan/zoom.
- Tools palette.
- Brush, line, eraser, shapes (rect/circle).
- Grid canvas with toggle.
- Multi-canvas rendering.
- Cursor mode control.

#### Changed

- Refactor viewport into model/UI modules.
- Split rendering pipeline.
- Modularized tools architecture.

#### Fixed

- Palette animation race.
- Shared brush/line state issues.
- Shape stroke width mismatch.

---

## Pre-release chain for M3 (Editor Core)

**[1.0.0-beta.11] → [1.0.0-beta.0]**

Included:

- Base canvas
- Viewport
- Viewport refactor
- Grid toggle
- Tools palette
- Brush tool
- Line tool
- Canvas refactor
- Tools fixes
- Shapes tool
- Eraser tool

---

# 1.0.x — Foundations Complete

---

## [1.0.0] — 2025-10-20

### 📦 Epic: M2 — CRUD Projects Page (Stable)

#### Added

- CRUD Home page.
- Create/Update/Delete/Open project modals.
- Project list with empty state.
- Navigation to `/editor/:id`.
- Dexie + Redux integration.

#### Changed

- Store structure reorganized.
- Test utilities updated.
- Modal architecture split.

#### Fixed

- Input validation.
- Canvas size fields.
- ProjectCard extracted.

---

# 0.x — Setup, DB, Testing

---

## [0.7.0] — 2025-10-18

### 📦 Epic: M1.6 — Tests & Local DB Integration Coverage

#### Added

- Repo tests.
- Service tests.
- Thunk tests.
- Slice tests.
- Integration tests.
- Dexie+Redux tests.
- Vitest coverage in CI.

---

## [0.5.5] — 2025-10-14

### 📦 Epic: M1.5 — Local Database Infrastructure

#### Added

- Dexie setup.
- Projects table.
- Repository → service → thunks.
- Validation logic.
- StoreProvider + typed hooks.

---

## [0.3.6] — 2025-10-08

### 📦 Epic: M1 — Project Initialization

#### Added

- Vite + React + TS.
- ESLint, Prettier, Husky.
- Redux Toolkit.
- Tailwind CSS.
- GitHub Actions CI.
- Branch rules.

#### Changed

- Prettier formatting.
- CI improvements.
- Roadmap updated.

---

## [0.1.0] — 2025-09-25

### 📦 Epic: M0 — Initial Setup

#### Added

- Roadmap.
- Issue templates.
- PR template.
- GitHub Project Kanban.
- Manual CHANGELOG.

#### Changed

- README checklist updated.

---

# 🧩 Version Summary (Extended)

| Epic | Description         | Version    | Stage       |
|------|---------------------|------------|-------------|
| M0   | Initial setup       | 0.1.0      | Alpha       |
| M1   | Initialization & CI | 0.3.6      | Pre-Release |
| M1.5 | Dexie + Redux DB    | 0.5.5      | Pre-Release |
| M1.6 | Test Coverage       | 0.7.0      | Pre-Release |
| M2   | CRUD Projects       | 1.0.0      | Stable      |
| M3   | Editor Core         | 1.1.0      | Stable      |
| M4   | Layers              | 1.2.0      | Stable      |
| M5   | History             | 1.3.0      | Stable      |
| M6   | App Menu            | 1.4.0      | Stable      |
| M7   | Performance         | 1.5.0-beta | Beta        |
