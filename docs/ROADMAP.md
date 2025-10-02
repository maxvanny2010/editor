### 📌 Roadmap: Graphic Editor (with branches and commit style)

#### ⚡ Initial Setup

- [x] Create `ROADMAP.md` file in the repo
      🔀 Branch: `chore/init-setup`
      📝 Commit: `chore(roadmap): add initial ROADMAP.md`

- [x] Add GitHub Issue templates (`feature.md`, `bug.md`, `fix.md`, `chore.md`)
      🔀 Branch: `chore/init-setup`
      📝 Commit: `chore(templates): add issue templates`

- [x] Add Pull Request template (`pull_request_template.md`)
      🔀 Branch: `chore/init-setup`
      📝 Commit: `chore(pr-template): add pull request template`

- [x] Create GitHub Project / Kanban board with columns: Backlog, In Progress, In Review, Done
      🔀 Branch: `chore/init-setup`
      📝 Commit: `chore(project): create GitHub Kanban board`

- [x] Add manual CHANGELOG.md template
      🔀 Branch: `chore/init-setup`
      📝 Commit: `chore(docs): add manual CHANGELOG.md template`

---

#### ✅ MVP (Minimum Viable Product)

#### M1 — Project Initialization

- [ ] Set up Vite + React + TypeScript
      🔀 Branch: `feature/init-vite-ts`
      📝 Commit: `feat(init): add vite + react + typescript`

- [ ] Set up ESLint, Prettier, Husky
      🔀 Branch: `chore/setup-linting`
      📝 Commit: `chore(lint): add eslint + prettier + husky`

- [ ] Set up GitHub Actions (lint, test, build)
      🔀 Branch: `ci/github-actions`
      📝 Commit: `ci(actions): add lint + type-check + build`

- [ ] Set up Redux Toolkit
      🔀 Branch: `feature/state-manager`
      📝 Commit: `feat(state): add redux toolkit setup`

- [ ] Set up Tailwind CSS for styling
      🔀 Branch: `chore/setup-tailwind`
      📝 Commit: `chore(styles): add tailwind css setup`

---

#### M2 — Home Page

- [ ] Display project list
      🔀 Branch: `feature/projects-list`
      📝 Commit: `feat(projects): show projects list`

- [ ] “Create Project” modal
      🔀 Branch: `feature/new-project-modal`
      📝 Commit: `feat(projects): add new project modal`

- [ ] “Delete Project” button
      🔀 Branch: `feature/delete-project`
      📝 Commit: `feat(projects): delete project`

- [ ] “Open Project” button → navigate to editor
      🔀 Branch: `feature/open-project`
      📝 Commit: `feat(projects): open project editor`

---

#### M3 — Editor (Basic Functionality)

- [ ] Display canvas (`<canvas>`)
      🔀 Branch: `feature/editor-canvas`
      📝 Commit: `feat(editor): add base canvas`

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
