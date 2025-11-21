📌 Roadmap: Graphic Editor (with branches and commit style)
📦 M0 — Initial Setup

Goal: Initialize the repository,
set up the foundational project structure,
and create documentation and templates
for further development stages.

📅 Development period: September → October 2025

🔖 Final version: v0.1.0-alpha.5

📄 Documentation & Project Setup

Create and add ROADMAP.md

🔀 Branch: chore/init-setup
📝 Commit: chore(roadmap): add initial ROADMAP.md
🧩 Version: 0.1.0-alpha.1

📄 Create and add a ROADMAP.md file containing the initial roadmap for the project.

Add GitHub Issue templates

🔀 Branch: chore/init-setup
📝 Commit: chore(templates): add issue templates
🧩 Version: 0.1.0-alpha.2

📄 Add standardized GitHub Issue templates for feature, bug, fix, and chore, along with a pull_request_template.md.

Set up GitHub Project board (Kanban)

🔀 Branch: chore/init-setup
📝 Commit: docs(project): document GitHub Kanban board setup
🧩 Version: 0.1.0-alpha.3

📄 Create a GitHub Project Kanban board with columns: Backlog, In Progress, In Review, Done. Link repository issues to
the board.

Mark completed tasks in README.md

🔀 Branch: chore/init-setup
📝 Commit: chore(readme): mark completed tasks
🧩 Version: 0.1.0-alpha.4

📄 Update the checklist in README.md by marking already completed setup items with checkmarks.

Add manual CHANGELOG.md template

🔀 Branch: chore/init-setup
📝 Commit: chore(docs): add manual CHANGELOG.md template
🧩 Version: 0.1.0-alpha.5

📄 Add a manual CHANGELOG.md file and describe the changelog process.

🏁 Epic Summary

📦 Epic: M0 — Initial Setup
🧩 Version: v0.1.0 (Alpha)

✅ MVP (Minimum Viable Product)
📦 M1 — Project Initialization

Goal: establish the technical foundation of the project —
build setup, linting, formatting, styling, state management,
and CI/CD pipelines.

📅 Development period: October 2025

🔖 Final version: v0.3.6 (Pre-Release)

⚙️ Core Setup
Set up Vite + React + TypeScript

🔀 Branch: setup/feature/init-vite-ts
📝 Commit: feat(init): add vite + react + typescript
🧩 Version: 0.2.0

📄 Initialize the project using Vite with React and TypeScript configuration.

Set up ESLint, Prettier, and Husky

🔀 Branch: setup/chore/linting
📝 Commit: chore(lint): add eslint + prettier + husky
🧩 Version: 0.2.1

📄 Configure code linting, formatting, and pre-commit hooks to maintain consistent code quality.

Run Prettier across the codebase

🔀 Branch: setup/chore/format-code
📝 Commit: chore(format): reformat codebase with prettier
🧩 Version: 0.3.2

📄 Apply consistent code formatting across all files using Prettier.

🧱 State & Styling
Set up Redux Toolkit

🔀 Branch: feature/state-manager
📝 Commit: feat(state): add redux toolkit setup
🧩 Version: 0.3.0

📄 Integrate Redux Toolkit for state management and create the initial store structure.

Set up Tailwind CSS

🔀 Branch: chore/setup-tailwind
📝 Commit: chore(styles): add tailwind css setup
🧩 Version: 0.3.1

📄 Configure Tailwind CSS for styling components with a utility-first approach.

⚙️ Continuous Integration
Set up GitHub Actions (lint, type-check, build)

🔀 Branch: setup/ci/github-actions
📝 Commit: ci(actions): add lint + type-check + build
🧩 Version: 0.2.2

📄 Add CI workflow to run linting, type checking, and build verification on every push and pull request.

Update CI job all-check-passed

🔀 Branch: setup/ci/github-actions
📝 Commit: ci(actions): update ci.yml job all-check-passed
🧩 Version: 0.3.3

📄 Improve CI pipeline to include an aggregate job verifying that all prior jobs have passed.

🧾 Documentation
Add BRANCH_RULES.md

🔀 Branch: setup/ci/github-actions
📝 Commit: chore(actions): BRANCH_RULES.md
🧩 Version: 0.3.4

📄 Document branching and naming conventions for features, fixes, and chore branches.

Update roadmap and mark completed tasks

🔀 Branch: setup/chore/update-roadmap
📝 Commit: chore(docs): update a roadmap
🧩 Version: 0.3.5

📄 Update the project roadmap and mark all setup-related tasks as completed.

🏁 Epic Summary

📦 Epic: M1 — Project Initialization
🧩 Version: v0.3.6 (Pre-Release)

📦 M1.5 — Local Database Infrastructure (Dexie + Redux Integration)

Goal: set up a local IndexedDB storage layer using Dexie
and integrate it with Redux Toolkit to enable offline project management.

📅 Development period: October 2025

🔖 Final version: v0.5.5 (Pre-Release)

🧩 Database Setup
Install Dexie and configure IndexedDB schema

🔀 Branch: db/chore/db-setup
📝 Commit: chore(db): setup dexie with indexeddb schema
🧩 Version: 0.5.0-alpha

📄 Install Dexie and configure the IndexedDB instance for managing local project data.

Define Project table and schema types

🔀 Branch: db/chore/db-schema
📝 Commit: chore(db): define table for projects and resolve alias @ ./src
🧩 Version: 0.5.1

📄 Define and type the projects table with fields: id, name, createdAt, updatedAt.

🔗 Integration with Redux Toolkit
Connect Dexie to Redux via repository, service, and thunks

🔀 Branch: db/feature/db-redux-integration
📝 Commit: feat(db): connect dexie to redux thunks/slice/service/repository
🧩 Version: 0.5.3

📄 Implement layered integration: Repository → Service → Thunks.
Ensure real-time sync between UI and IndexedDB state.

⚙️ Store Provider
Add StoreProvider component and typed hooks

🔀 Branch: db/chore/store-provider
📝 Commit: chore(store): add store provider wrapper
🧩 Version: 0.5.4

📄 Create a global StoreProvider that wraps the entire app with the Redux store.
Export typed hooks useAppDispatch and useAppSelector.

🏁 Epic Summary

📦 Epic: M1.5 — Local DB Infrastructure
🧩 Version: v0.5.5 (Pre-Release)

📦 M1.6 — Tests & Local DB Integration Coverage

Goal: implement full test coverage for Dexie + Redux integration
(repository, service, slice, thunks, UI).

📅 Development period: October 2025

🔖 Final version: v0.7.0 (Pre-Release)

🧩 Repository Layer
Unit tests for project.repository

🔀 Branch: test/project-repository
📝 Commit: test(repo): add unit tests for project.repository
🧩 Version: 0.6.0

📄 Added unit tests for repository methods using fake-indexeddb.

🔗 Thunks & Async Logic
Test async thunks integration

🔀 Branch: test/project-thunks
📝 Commit: test(thunks): verify async thunk calls for project.service
🧩 Version: 0.6.1

📄 Verified that async thunks call service methods with expected parameters.

⚙️ Service Layer
Service validation and CRUD tests

🔀 Branch: test/project-service
📝 Commit: test(service): add validation and update tests for project.service
🧩 Version: 0.6.2

📄 Tests for validation, duplication checks, and timestamps in create/update methods.

🧱 Redux Slice Layer
Reducers and selectors tests

🔀 Branch: test/project-slice
📝 Commit: test(slice): add CRUD and selector tests for project.slices
🧩 Version: 0.6.3

📄 Tested reducers, state transitions, CRUD flows, and selectors.

🧩 Integration & Store Layer
StoreProvider integration test

🔀 Branch: test/store-provider
📝 Commit: test(integration): add StoreProvider integration test for UI updates
🧩 Version: 0.6.4

📄 Integration test verifying UI reactivity through store updates.

Dexie + Redux integration tests

🔀 Branch: test/db-integration
📝 Commit: test(db): verify dexie + redux integration
🧩 Version: 0.6.6

📄 Verified real-world interaction between Dexie repositories and Redux thunks.

🧾 Coverage & CI
Enable coverage reporting in CI

🔀 Branch: ci/test-coverage
📝 Commit: ci(vitest): enable coverage reporting in GitHub Actions
🧩 Version: 0.6.5

📄 Integrated Vitest coverage reports into GitHub Actions.

🏁 Epic Summary

📦 Epic: M1.6 — Tests & DB Coverage
🧩 Version: v0.7.0 (Pre-Release)

📦 M2 — Home Page (CRUD Projects)

Goal: deliver a complete Home page with
CRUD for projects, validations, and navigation to editor.

📅 Development period: October → November 2025

🔖 Final version: v1.0.0 (Stable)

⚙️ Infrastructure & Setup
Update store structure

🔀 Branch: home/chore/update-structure
📝 Commit: chore(project): update structure
🧩 Version: 0.8.0

📄 Move store and hooks into store/ and clean up structure.

Refactor tests and utilities

🔀 Branch: home/test/update-test
📝 Commit: chore(test): update test structure
🧩 Version: 0.8.1

📄 Refactor test utilities, add barrels and typed test hooks.

🧱 Core Features
Display project list

🔀 Branch: home/feature/projects-list
📝 Commit: feat(projects): show projects list
🧩 Version: 0.9.0-beta.0

📄 Render list of saved projects from IndexedDB with empty state.

Create Project modal

🔀 Branch: home/feature/new-project-modal
📝 Commit: feat(projects): add new project modal
🧩 Version: 0.9.0-beta.1

📄 Modal for creating projects with name and canvas size.

Update Project modal

🔀 Branch: home/feature/update-project
📝 Commit: feat(projects): update project
🧩 Version: 0.9.0-beta.2

📄 Add edit flow with confirmation and instant update.

Add “+” button for creating new project

🔀 Branch: home/feature/button-add
📝 Commit: feat(projects): add "+" to button add a new project
🧩 Version: 0.9.0-beta.3

📄 Quick-create UI via top-level plus button.

Delete Project

🔀 Branch: home/feature/delete-project
📝 Commit: feat(projects): delete project
🧩 Version: 0.9.0-beta.4

📄 Delete with confirmation and Dexie removal.

Open Project → navigate to editor

🔀 Branch: home/feature/open-project
📝 Commit: feat(projects): open project editor
🧩 Version: 0.9.5-rc.3

📄 Navigate to /editor/:id, show “Project not found” on missing ID.

🧩 Fixes & Enhancements
Add validation (Zod)

🔀 Branch: home/fix/project-modal-input-length
📝 Commit: fix(projects): set length of input create/update modal to 25 symbols / zod
🧩 Version: 0.9.1-beta

📄 Limit input length and validate via Zod schema.

Add canvas size inputs

🔀 Branch: home/fix/create-project-modal-input-canvas
📝 Commit: fix(projects): add two inputs for size of canvas
🧩 Version: 0.9.2-beta

📄 Width/height inputs in create modal.

Separate base modal

🔀 Branch: home/fix/modal-base-separate
📝 Commit: fix(projects): separate a base modal to individual components
🧩 Version: 0.9.3-rc.1

📄 Extract BaseModal as independent component.

Separate Project Card

🔀 Branch: home/fix/project-card-separate
📝 Commit: fix(project): separate a project card component to individual components
🧩 Version: 0.9.4-rc.2

📄 Split ProjectCard for clean architecture/testing.

CI / Release Preparation (inside M2, no separate milestone)
Add semantic-release workflow and changelog v1.0.0

🔀 Branch: ci/release/semantic
📝 Commit: docs(ci): add semantic-release workflow and changelog v1.0.0
🧩 Version: 0.9.6-rc.4

📄 Add semantic-release pipeline and initial generated changelog.

Prevent failure when tag already exists

🔀 Branch: ci/release/semantic
📝 Commit: fix(ci): prevent failure when tag already exists
🧩 Version: 0.9.7-rc.5

📄 Guard semantic-release and CI flows from duplicate tag errors.

🏁 Epic Summary

📦 Epic: M2 — CRUD Projects Page Done
🧩 Version: v1.0.0 (Stable)

📦 M3 — Editor (Basic Functionality)

Goal: build the first working editor canvas
with viewport, tools palette, and core drawing tools.

📅 Development period: November 2025

🔖 Final version: v1.1.0

Display canvas (<canvas>)

🔀 Branch: feature/editor-canvas
📝 Commit: feat(editor): add base canvas
🧩 Version: v1.0.0-beta.0

Display canvas + viewport

🔀 Branch: feature/editor-canvas-viewport
📝 Commit: feat(editor): add base canvas viewport
🧩 Version: v1.0.0-beta.1

Refactor viewport into model/ui

🔀 Branch: refactor/editor-viewport
📝 Commit: refactor(viewport): split EditorViewport into model/ui structure
🧩 Version: v1.0.0-beta.2

Grid toggle via viewport

🔀 Branch: feature/editor-grid
📝 Commit: feat(editor): viewport implement button hide/show a grid
🧩 Version: v1.0.0-beta.3

Tools palette UI

🔀 Branch: feature/tools-palette
📝 Commit: feat(tools): implement a tools palette
🧩 Version: v1.0.0-beta.4

Brush tool (color + thickness)

🔀 Branch: feature/tool-brush
📝 Commit: feat(tools): implement brush tool
🧩 Version: v1.0.0-beta.5

Line tool (color + thickness)

🔀 Branch: feature/tool-line
📝 Commit: feat(tools): implement line tool
🧩 Version: v1.0.0-beta.6

Canvas refactor: draw/grid canvases

🔀 Branch: refactor/editor-canvas
📝 Commit: fix(editor): refactor canvas - create draw/grid canvases
🧩 Version: v1.0.0-beta.7

Palette open/close fix

🔀 Branch: fix/tools-palette-toggle
📝 Commit: fix(tools): palette open/close
🧩 Version: v1.0.0-beta.8

Brush/line decomposition

🔀 Branch: fix/tools-decomposition
📝 Commit: fix(tools): brush/line decomposition
🧩 Version: v1.0.0-beta.9

Shapes tool (square/circle)

🔀 Branch: feature/tool-shapes
📝 Commit: feat(tools): implement shapes tool
🧩 Version: v1.0.0-beta.10

Eraser tool (thickness options)

🔀 Branch: feature/tool-eraser
📝 Commit: feat(tools): implement eraser tool
🧩 Version: v1.0.0-beta.11

Tools performance / polish

🔀 Branch: fix/tools-perf
📝 Commit: fix(tools): performer tools
🧩 Version: v1.1.0

🏁 Epic Summary

📦 Epic: M3 — Editor (Basic Functionality)
🧩 Version: v1.1.0

📦 M4 — Layers

Goal: implement full layer management system
with persistence in Dexie and visibility/order controls.

📅 Development period: November 2025

🔖 Final version: v1.2.0

Add full layer management (initial)

🔀 Branch: feature/layers-management
📝 Commit: feat(layers): add full layer management
🧩 Version: v1.1.0-beta.1

Add full layer management with Dexie

🔀 Branch: feature/layers-dexie
📝 Commit: feat(layers): add full layer management with Dexie
🧩 Version: v1.2.0

🏁 Epic Summary

📦 Epic: M4 — Layers
🧩 Version: v1.2.0

📦 M5 — History

Goal: deliver full editor history snapshots
with undo/redo base and consistent reload protection.

📅 Development period: November 2025

🔖 Final version: v1.3.0

Implement full action history (snapshots)

🔀 Branch: feature/history-core
📝 Commit: feat(editor): implement full action history
🧩 Version: v1.3.0

Protect active project from reload (settings)

🔀 Branch: feature/history-reload-guard
📝 Commit: feat(editor): implement setting component for defence active project from reload
🧩 Version: v1.3.0-beta.1

🏁 Epic Summary

📦 Epic: M5 — History
🧩 Version: v1.3.0

📦 M6 — Top Menu / App Shell

Goal: add Figma-like top menu and navigation shell.
File / Edit / View / Projects / About.

📅 Development period: November 2025

🔖 Final version: v1.4.0

Implement top menu

🔀 Branch: feature/menu
📝 Commit: feat(editor): menu
🧩 Version: v1.4.0

🏁 Epic Summary

📦 Epic: M6 — Menu / App Shell
🧩 Version: v1.4.0

📦 M7 — Performance

Goal: optimize core editor performance
and introduce smooth drawing with FPS monitoring.

📅 Development period: November 2025

🔖 Final version: v1.5.0-beta.2

Performance optimizations

🔀 Branch: perf/project-optimization
📝 Commit: perf(project): optimization
🧩 Version: v1.5.0-beta.1

requestAnimationFrame drawing + FPS display

🔀 Branch: perf/draw-raf
📝 Commit: feat(project): requestAnimationFrame for smooth drawing / FPS display
🧩 Version: v1.5.0-beta.2

🏁 Epic Summary

📦 Epic: M7 — Performance
🧩 Version: v1.5.0-beta.2
