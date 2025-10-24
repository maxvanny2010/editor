# 🧭 CHANGELOG

Full release story **React Editor**
(IndexedDB + Redux Toolkit + Vite + React 19 + Tailwind + Vitest)

---

## [1.0.0] — 2025-10-20

### 📦 Epic: M2 — CRUD Projects Page (Stable)

#### Added

- Home page for managing projects (create, update, delete, open).
- Project list display with empty state “No projects yet”.
- Create Project modal with name and canvas size fields.
- Update Project modal with instant inline editing.
- “+” button for new project creation.
- Open Project → navigate to `/editor/:id` with fallback “Project not found”.
- Integrated Dexie + Redux for persistent project data.

#### Changed

- Store structure refactored (moved `hooks.ts` and `store.ts` into `/store`, renamed to `index.ts`).
- Updated and reorganized test utilities with typed hooks and barrel files.
- UI modals separated into reusable base components.

#### Fixed

- Input validation (max 25 symbols, via Zod).
- Added width and height inputs in Create Project modal.
- Separated `BaseModal` and `ProjectCard` into independent components.

---

## [0.7.0] — 2025-10-18

### 📦 Epic: M1.6 — Tests & Local DB Integration Coverage

#### Added

- Unit tests for `project.repository` using fake-indexeddb.
- Async thunk tests verifying calls to `project.service`.
- Validation and timestamp tests for `project.service`.
- Reducer and selector tests for Redux slice (`selectById`, `selectByName`).
- Integration test verifying UI reactivity via `StoreProvider`.
- Dexie + Redux integration test ensuring local persistence consistency.
- Code coverage reporting integrated into GitHub Actions (Vitest + V8).

---

## [0.5.5] — 2025-10-14

### 📦 Epic: M1.5 — Local Database Infrastructure (Dexie + Redux Integration)

#### Added

- Installed and configured Dexie for IndexedDB storage.
- Defined `projects` table schema: `id`, `name`, `createdAt`, `updatedAt`.
- Implemented layered Dexie integration: Repository → Service → Thunks.
- Added business logic layer for validation and duplication prevention.
- Added `StoreProvider` component and typed hooks (`useAppDispatch`, `useAppSelector`).

---

## [0.3.6] — 2025-10-08

### 📦 Epic: M1 — Project Initialization

#### Added

- Project initialized via Vite + React + TypeScript.
- ESLint, Prettier, and Husky configured for linting and formatting.
- Redux Toolkit integrated for global state management.
- Tailwind CSS configured for styling.
- GitHub Actions CI pipeline added (lint, type-check, build).
- Branch rules documented in `BRANCH_RULES.md`.

#### Changed

- Applied Prettier formatting across the codebase.
- Improved CI workflow to include `all-check-passed` job.
- Updated project roadmap and marked setup tasks as completed.

---

## [0.1.0] — 2025-09-25

### 📦 Epic: M0 — Initial Setup

#### Added

- Initial `ROADMAP.md` with project milestones.
- GitHub Issue templates (`feature.yml`, `bug.yml`, `fix.yml`, `chore.yml`, `pull_request_template.md`).
- GitHub Project board (Kanban: Backlog → In Progress → In Review → Done).
- Manual `CHANGELOG.md` template and documentation for release automation.

#### Changed

- Updated README checklist to mark completed setup tasks.

---

## 🧩 Version Summary

| Epic | Description                             | Version | Stage       |
|------|-----------------------------------------|---------|-------------|
| M0   | Initial setup & documentation           | 0.1.0   | Alpha       |
| M1   | Project initialization & CI setup       | 0.3.6   | Pre-Release |
| M1.5 | Local DB infrastructure (Dexie + Redux) | 0.5.5   | Pre-Release |
| M1.6 | Full test coverage & integration        | 0.7.0   | Pre-Release |
| M2   | CRUD Projects Page (Stable)             | 1.0.0   | Stable      |

---
