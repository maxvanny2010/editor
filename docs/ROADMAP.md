### 📌 Roadmap: Graphic Editor (with branches and commit style)

#### 📦 M0 — Initial Setup

Goal: Initialize the repository,
set up the foundational project structure,
and create documentation and templates
for further development stages.

📅 Development period: September → October 2025

🔖 Final version: v0.1.0 (Alpha)

📄 Documentation & Project Setup

#### Create and add ROADMAP.md

🔀 Branch: chore/init-setup

📝 Commit: chore(roadmap): add initial ROADMAP.md

🧩 Version: 0.1.0-alpha.1

📄 Create and add a ROADMAP.md file containing the initial roadmap for the project.

#### Add GitHub Issue templates

🔀 Branch: chore/init-setup

📝 Commit: chore(templates): add issue templates

🧩 Version: 0.1.0-alpha.2

📄 Add standardized GitHub Issue templates for feature, bug, fix, and chore, along with a pull_request_template.md.

#### Set up GitHub Project board (Kanban)

🔀 Branch: chore/init-setup

📝 Commit: docs(project): document GitHub Kanban board setup

🧩 Version: 0.1.0-alpha.3

📄 Create a GitHub Project Kanban board with columns: Backlog, In Progress, In Review, Done. Link repository issues to
the board.

#### Mark completed tasks in README.md

🔀 Branch: chore/init-setup

📝 Commit: chore(readme): mark completed tasks

🧩 Version: 0.1.0-alpha.4

📄 Update the checklist in README.md by marking already completed setup items with checkmarks.

#### Add manual CHANGELOG.md template

🔀 Branch: chore/init-setup

📝 Commit: chore(docs): add manual CHANGELOG.md template

🧩 Version: 0.1.0-alpha.5

📄 Add a manual CHANGELOG.md file and describe the
changelog automation process using standard-version.

#### 🏁 Epic Summary

📦 Epic: M0 — Initial Setup

🧩 Version: v0.1.0 (Alpha)

---

#### ✅ MVP (Minimum Viable Product)

#### 📦 M1 — Project Initialization

Goal: establish the technical foundation of
the project — build setup, linting, formatting,
styling, state management, and CI/CD pipelines.

📅 Development period: October 2025

🔖 Final version: v0.3.6 (Pre-Release)

#### ⚙️ Core Setup

#### Set up Vite + React + TypeScript

🔀 Branch: setup/feature/init-vite-ts

📝 Commit: feat(init): add vite + react + typescript

🧩 Version: 0.2.0

📄 Initialize the project using Vite with React and TypeScript configuration.

#### Set up ESLint, Prettier, and Husky

🔀 Branch: setup/chore/linting

📝 Commit: chore(lint): add eslint + prettier + husky

🧩 Version: 0.2.1

📄 Configure code linting, formatting, and pre-commit hooks to maintain consistent code quality.

#### Run Prettier across the codebase

🔀 Branch: setup/chore/format-code

📝 Commit: chore(format): reformat codebase with prettier

🧩 Version: 0.3.2

📄 Apply consistent code formatting across all files using Prettier.

🧱 State & Styling

#### Set up Redux Toolkit

🔀 Branch: feature/state-manager

📝 Commit: feat(state): add redux toolkit setup

🧩 Version: 0.3.0

📄 Integrate Redux Toolkit for state management and create the initial store structure.

#### Set up Tailwind CSS

🔀 Branch: chore/setup-tailwind

📝 Commit: chore(styles): add tailwind css set up

🧩 Version: 0.3.1

📄 Configure Tailwind CSS for styling components with a utility-first approach.

#### ⚙️ Continuous Integration

#### Set up GitHub Actions (lint, type-check, build)

🔀 Branch: setup/ci/github-actions

📝 Commit: ci(actions): add lint + type-check + build

🧩 Version: 0.2.2

📄 Add CI workflow to run linting, type checking, and build verification on every push and pull request.

#### Update CI job all-check-passed

🔀 Branch: setup/ci/github-action

📝 Commit: ci(actions): update ci.yml job all-check-passed

🧩 Version: 0.3.3

📄 Improve CI pipeline to include an aggregate job verifying that all prior jobs have passed.

🧾 Documentation

#### Add BRANCH_RULES.md

🔀 Branch: setup/ci/github-actions

📝 Commit: chore(docs): BRANCH_RULES.md

🧩 Version: 0.3.4

📄 Document branching and naming conventions for features, fixes, and chore branches.

#### Update roadmap and mark completed tasks

🔀 Branch: setup/chore/update-roadmap

📝 Commit: chore(docs): update a roadmap

🧩 Version: 0.3.5

📄 Update the project roadmap and mark all setup-related tasks as completed.

#### 🏁 Epic Summary

📦 Epic: M1 — Project Initialization

🧩 Version: v0.3.6 (Pre-Release)

---

#### M1.5 - DB Setup

#### 📦 M1.5 — Local Database Infrastructure (Dexie + Redux Integration)

Goal: set up a local IndexedDB storage layer
using Dexie and integrate it seamlessly with
Redux Toolkit to enable offline project management.

📅 Development period: October 2025

🔖 Final version: v0.5.5 (Pre-Release)

🧩 Database Setup

#### Install Dexie and configure IndexedDB schema

🔀 Branch: db/chore/db-setup

📝 Commit: chore(db): setup dexie with indexeddb schema

🧩 Version: 0.5.0-alpha

📄 Install Dexie and configure the IndexedDB instance for managing local project data.

#### Define Project table and schema types

🔀 Branch: db/chore/db-schema

📝 Commit: chore(db): define table for projects and resolve alias @ ./src

🧩 Version: 0.5.1

📄 Define and type the projects table with fields: id, name, createdAt, updatedAt.

#### Add migration notes for future schema upgrades.

🔗 Integration with Redux Toolkit

#### Connect Dexie to Redux via repository, service, and thunks

🔀 Branch: db/feature/db-redux-integration

📝 Commit: feat(db): connect dexie to redux thunks/slice/service/repository

🧩 Version: 0.5.3

#### 📄 Implement layered integration:

Repository → direct IndexedDB CRUD

Service → business logic (validation, duplication check, id generation)

Thunks → async logic for CRUD operations

Ensure real-time sync between UI and IndexedDB state.

#### ⚙️ Store Provider

#### Add StoreProvider component and typed hooks

🔀 Branch: db/chore/store-provider

📝 Commit: chore(store): add store provider wrapper

🧩 Version: 0.5.4

📄 Create a global StoreProvider that wraps the entire app with the Redux store.

Export typed hooks useAppDispatch and useAppSelector for consistent store access across all modules.

#### 🏁 Epic Summary

📦 Epic: M1.5 — Local Database Infrastructure (Dexie + Redux Integration)

🧩 Version: v0.5.5 (Pre-Release)

---

#### M1.6 - Tests: Local DB Infrastructure (Dexie + Redux)

#### 📦 M1.6 — Tests & Local DB Integration Coverage

Goal: implement full test coverage for the
local Dexie + Redux integration, ensuring repository,
service, slice, thunk, and UI layers behave correctly and remain in sync.

📅 Development period: October 2025

🔖 Final version: v0.7.0 (Pre-Release)

🧩 Repository Layer

#### Unit tests for project.repository

🔀 Branch: test/project-repository

📝 Commit: test(repo): add unit tests for project.repository

🧩 Version: 0.6.0

📄 Added unit tests for repository methods using fake-indexeddb to simulate Dexie operations. Validated record creation,
retrieval, updates, sorting, and deletion.

🔗 Thunks & Async Logic

#### Test async thunks integration

🔀 Branch: test/project-thunks

📝 Commit: test(thunks): verify async thunk calls for project.service

🧩 Version: 0.6.1

📄 Verified that Redux async thunks correctly call service methods with the expected parameters and payloads using
vi.mock.

⚙️ Service Layer

#### Service validation and CRUD tests

🔀 Branch: test/project-service

📝 Commit: test(service): add validation and update tests for project.service

🧩 Version: 0.6.2

📄 Added tests for validation, duplication checks, and timestamp updates in createProject and updateProject service
methods.

🧱 Redux Slice Layer

#### Reducers and selectors tests

🔀 Branch: test/project-slice

📝 Commit: test(slice): add CRUD and selector tests for projects.slices

🧩 Version: 0.6.3

📄 Tested reducers, state transitions, CRUD flows, and custom selectors to ensure correct Redux state management
behavior.

🧩 Integration & Store Layer

#### StoreProvider integration test

🔀 Branch: test/store-provider

📝 Commit: test(integration): add StoreProvider integration test for UI updates

🧩 Version: 0.6.4

📄 Added an integration test verifying UI reactivity through Redux store updates and DOM synchronization.

#### Dexie + Redux integration tests

🔀 Branch: test/db-integration

📝 Commit: test(db): verify dexie + redux integration

🧩 Version: 0.6.6

📄 Verified real-world interaction between Dexie’s repository layer and Redux thunks, ensuring persistence consistency
across UI and state.

🧾 Coverage & CI

#### Enable coverage reporting in CI

🔀 Branch: ci/test-coverage

📝 Commit: ci(vitest): enable coverage reporting in GitHub Actions

🧩 Version: 0.6.5

📄 Integrated Vitest coverage reports into GitHub Actions, including repository, service, slice, and UI test metrics.

#### 🏁 Epic Summary

📦 Epic: M1.6 — Tests & Local DB Integration Coverage

🧩 Version: v0.7.0 (Pre-Release)

---

#### M2 — Home Page

#### ⚙️ Infrastructure & Setup

#### Update store structure

🔀 Branch: home/chore/update-structure

📝 Commit: chore(project): update structure store

🧩 Version: 0.8.0

📄 Move hooks.ts and store.ts into store/, rename store.ts to index.ts.

#### Refactor tests and utilities

🔀 Branch: home/test/update-test

📝 Commit: chore(test): update test structure

🧩 Version: 0.8.1

📄 Refactor test utils, add index.ts barrels and typed test hooks (useTestDispatch, useTestSelector).

🧱 Core Features

#### Display project list

🔀 Branch: home/feature/projects-list

📝 Commit: feat(projects): show projects list

🧩 Version: 0.9.0-beta.0

📄 Render list of saved projects from IndexedDB with empty state “No projects yet”.

#### Create Project modal

🔀 Branch: home/feature/new-project-modal

📝 Commit: feat(projects): add new project modal

🧩 Version: 0.9.0-beta.1

📄 Modal for creating projects with custom name and preset canvas size.

#### Update Project modal

🔀 Branch: home/feature/update-project

📝 Commit: feat(projects): update project

🧩 Version: 0.9.0-beta.2

📄 Add edit button with confirmation dialog and instant update.

#### Add “+” button for creating new project

🔀 Branch: home/feature/button-add

📝 Commit: feat(projects): add + to button add a new project

🧩 Version: 0.9.0-beta.3

📄 Add UI button for quick project creation.

#### Delete Project

🔀 Branch: home/feature/delete-project

📝 Commit: feat(projects): delete project

🧩 Version: 0.9.0-beta.4

📄 Add delete button with confirmation and Dexie removal.

#### Open Project → navigate to editor

🔀 Branch: home/feature/open-project

📝 Commit: feat(projects): open project editor

🧩 Version: 0.9.5-rc.3

📄 Navigate to /editor/:id; if project not found → flip card and show “Project not found”.

🧩 Fixes & Enhancements

#### Add validation (Zod)

🔀 Branch: home/fix/project-modal-input-length

📝 Commit: fix(projects): set length of input create/update modal to 25 symbols / zod

🧩 Version: 0.9.1-beta

📄 Limit input length to 25 symbols and add Zod validation.

#### Add canvas size inputs

🔀 Branch: home/fix/create-project-modal-input-canvas

📝 Commit: fix(projects): add two inputs in a create modal for size of canvas

🧩 Version: 0.9.2-beta

📄 Add width and height fields to create modal.

#### Separate base modal

🔀 Branch: home/fix/modal-base-separate

📝 Commit: fix(projects): separate a base modal to individual components

🧩 Version: 0.9.3-rc.1

📄 Extract Base Modal as independent component.

#### Separate Project Card

🔀 Branch: home/fix/project-card-separate

📝 Commit: fix(project): separate a project card component to individual components

🧩 Version: 0.9.4-rc.2

📄 Split ProjectCard for cleaner architecture and testing.

#### 🏁 Epic Summary

📦 Epic: M2 — CRUD Projects Page Done
🧩 Версия: v1.0.0 (Stable)

---

#### M3 — Editor (Basic Functionality)

- [ ] Display canvas (`<canvas>`)

  🔀 Branch: `feature/editor-canvas`

  📝 Commit: `feat(editor): add base canvas`

- [ ] Display canvas + viewport

  🔀 Branch: `feature/editor-canvas-viewport`

  📝 Commit: `feat(editor): add base canvas viewport`

- [ ] Brush tool (color + 6 thickness options)

  🔀 Branch: `feature/tool-brush`

  📝 Commit: `feat(tools): implement brush tool`

- [ ] Eraser tool (6 thickness options)

  🔀 Branch: `feature/tool-eraser`

  📝 Commit: `feat(tools): implement eraser tool`

- [ ] Line tool (color + 6 thickness options)

  🔀 Branch: `feature/tool-line`

  📝 Commit: `feat(tools): implement line tool`

- [ ] Shapes tool (square/circle) with fill & stroke colors

  🔀 Branch: `feature/tool-shapes`

  📝 Commit: `feat(tools): implement shapes tool`

- [ ] Change cursor when selecting tool

  🔀 Branch: `feature/tool-cursor`

  📝 Commit: `feat(tools): change cursor by tool`

- [ ] Export canvas as PNG

  🔀 Branch: `feature/export-png`

  📝 Commit: `feat(editor): export canvas as PNG`

- [ ] Save project to IndexedDB

  🔀 Branch: `feature/save-project`

  📝 Commit: `feat(projects): save project to indexeddb`

- [ ] Load project from IndexedDB

  🔀 Branch: `feature/load-project`

  📝 Commit: `feat(projects): load project from indexeddb`

---

#### M4 — Tests for MVP

- [ ] Unit tests for reducers (Jest)

  🔀 Branch: `test/reducers`

  📝 Commit: `test(reducers): add unit tests`

- [ ] Integration tests for components (Testing Library)

  🔀 Branch: `test/components`

  📝 Commit: `test(components): add integration tests`

- [ ] E2E test: create project → draw brush → export PNG

  🔀 Branch: `test/e2e-draw-export`

  📝 Commit: `test(e2e): create project, draw brush, export png`

---

### ✨ Nice-to-have (after MVP)

#### M5 — Layers

- [ ] Add / delete layers

  🔀 Branch: `feature/layers-crud`

  📝 Commit: `feat(layers): add create and delete layers`

- [ ] Reorder layers (drag & drop)

  🔀 Branch: `feature/layers-reorder`

  📝 Commit: `feat(layers): allow reordering layers`

- [ ] Hide / Show layers

  🔀 Branch: `feature/layers-visibility`

  📝 Commit: `feat(layers): add hide/show functionality`

- [ ] Change layer opacity

  🔀 Branch: `feature/layers-opacity`

  📝 Commit: `feat(layers): add opacity control`

- [ ] Rename layer

  🔀 Branch: `feature/layers-rename`

  📝 Commit: `feat(layers): add rename layer functionality`

#### M7 — History

- [ ] Undo / Redo

  🔀 Branch: `feature/history-undo-redo`

  📝 Commit: `feat(history): add undo/redo support`

#### M8 — Performance

- [ ] Use `requestAnimationFrame` for smooth drawing

  🔀 Branch: `perf/draw-raf`

  📝 Commit: `perf(canvas): use requestAnimationFrame for drawing`

#### M10 — Infrastructure

- [ ] Dockerfile / Vercel deployment

  🔀 Branch: `chore/deploy`

  📝 Commit: `chore(deploy): add dockerfile and vercel config`

---

#### 🐞 Bug Fixes

- [ ] Fix critical bugs from QA

  🔀 Branch: `fix/...`

  📝 Commit: `fix(scope): ...`

- [ ] Regression tests for fixed bugs

  🔀 Branch: `test/fix-regression`

  📝 Commit: `test(fix): add regression tests`

---

#### 🚀 CI/CD Roadmap

- [x] Linting, TypeScript check, build in GitHub Actions

  🔀 Branch: `ci/github-actions`

  📝 Commit: `ci(actions): add lint + type-check + build`

- [ ] Add unit tests to CI (Vitest / Jest)

  🔀 Branch: `ci/github-actions`

  📝 Commit: `ci(actions): run unit tests`

- [ ] Add coverage reporting (Codecov / Coveralls)

  🔀 Branch: `ci/github-actions`

  📝 Commit: `ci(actions): add coverage reporting`

- [ ] Deploy preview builds (Vercel / Netlify)

  🔀 Branch: `chore/deploy`

  📝 Commit: `chore(deploy): setup vercel preview`

### 🔑 Branch Naming Rules

- [ ] `feature/...` → new feature
- [ ] `fix/...` → bug fix
- [ ] `chore/...` → maintenance / config / docs
- [ ] `test/...` → tests
- [ ] `perf/...` → performance optimization
- [ ] `ci/...` → CI/CD tasks

### 📝 Commit Style (Conventional Commits)

- [ ] `feat(scope): ...` — new feature
- [ ] `fix(scope): ...` — bug fix
- [ ] `chore(scope): ...` — maintenance
- [ ] `test(scope): ...` — tests
- [ ] `perf(scope): ...` — performance improvement
- [ ] `ci(scope): ...` — CI/CD
