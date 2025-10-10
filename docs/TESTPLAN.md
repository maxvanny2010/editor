### ✅ M1.6 — Tests: Local DB Infrastructure (Dexie + Redux)

---

Scope
test(db): verify dexie + redux integration

Description
Write automated tests to confirm the functionality of the local database (Dexie/IndexedDB) and its integration with
Redux Toolkit via a service/repository and a universal slice. The tests should run in CI, use fake-indexeddb for
Node/jsdom, and cover key scenarios: repository, service, thunks/slice, and integration via StoreProvider.

✅ Acceptance Criteria
The repository (project.repository) correctly performs add/getById/getAll/findByName/update/remove on fake-indexeddb.

The service (project.service) validates the name, prevents duplicates, sets id/createdAt/updatedAt, and returns the
updated object on update.

The slice (projectsSlice) correctly updates the state on fetch/create/update/delete; selectors work correctly (including
selectByName).

Integration test via StoreProvider: dispatch → state → UI — create a project and see it rendered in the component.

Tests run in CI (GitHub Actions), and code coverage metrics are generated.

🧰 Tech Stack
Vitest (runner) + jsdom (env)

@testing-library/react for integration tests

fake-indexeddb for IndexedDB in Node

@testing-library/jest-dom (matchers)

TypeScript

🛠 Setup
Install

```cmd
npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom fake-indexeddb @types/node
```

---

#### 🧩 Repository Tests

**Scope:** project.repository

**Description:**
Add unit tests for repository methods (`add`, `getById`, `getAll`, `findByName`, `update`, `remove`) using
fake-indexeddb.
Ensure sorting and case-insensitive lookups work as expected.

**Branch name:** `test/project-repository`
**Commit style:** `test(repo): add unit tests for project.repository`

**Checklist:**

- [x] add creates a record, and getById returns it
- [x] findByName finds a project by name, case-insensitively
- [x] getAll returns records sorted by updatedAt
- [x] update correctly changes the name and updatedAt fields
- [x] remove successfully deletes a record

---

#### 🧩 Service Tests

**Scope:** project.service

**Description:**
Write unit tests for service validation and CRUD logic.
Ensure duplicate names and empty values are handled, and timestamps are updated correctly.

**Branch name:** `test/project-service`
**Commit style:** `test(service): add validation and update tests for projectService`

**Checklist:**

- [x] createProject throws an error if the name is empty
- [x] createProject throws an error if the name is a duplicate
- [x] successful createProject returns a Project with valid id, createdAt, and updatedAt
- [x] updateProject returns the updated object, and the updatedAt timestamp is changed

---

#### 🧩 Project Thunks

**Scope:** project.thunks

**Description:**
Test Redux async thunks for correct service calls.
Use `vi.mock` to stub projectService methods and validate parameters.

**Branch name:** `test/project-thunks`
**Commit style:** `test(thunks): verify async thunk calls for projectService`

**Checklist:**

- [x] fetchProjects calls `projectService.getProjects` once
- [x] createProjectThunk calls `projectService.createProject` with correct payload
- [x] deleteProjectThunk calls `projectService.deleteProject` with correct ID

---

#### 🧩 Project Slice

**Scope:** project.slice

**Description:**
Test Redux slice reducers and selectors (`selectAll`, `selectById`, `selectByName`).
Verify correct state transitions and CRUD operations.

**Branch name:** `test/project-slice`
**Commit style:** `test(slice): add CRUD and selector tests for projectsSlice`

**Checklist:**

- [x] fetchAllThunk correctly populates Redux state (`ids`, `entities`, `loading='succeeded'`)
- [x] createOneThunk adds a new entity; `selectById` and `selectAll` reflect correct data afterward
- [x] updateOneThunk performs upsert and correctly updates project name and updatedAt
- [x] deleteOneThunk removes entity from Redux state successfully
- [x] makeSelectors(...).selectByName(state, 'foo') filters projects case-insensitively by name

---

#### 🧩 Provider Integration

**Scope:** storeProvider

**Description:**
Add an integration test that checks UI reactivity via the Redux store.
Simulate a dispatch from UI, verify DOM updates after state change.

**Branch name:** `test/store-provider`
**Commit style:** `test(integration): add StoreProvider integration test for UI updates`

**Checklist:**

- [x] Wrap the test component in `<StoreProvider>`
- [x] Display a list of projects using `projectsSelectors.selectAll`
- [x] Dispatch `createProject({ name: 'Test' })` on a button click
- [x] Verify that the new project element appears in the DOM after the action is dispatched

---

#### 🧱 CI & Coverage

**Scope:** ci/test-coverage

**Description:**
Integrate code coverage reporting in CI using GitHub Actions and Vitest.
Generate coverage reports for repository, service, slice, and integration tests.

**Branch name:** `ci/test-coverage`
**Commit style:** `ci(vitest): enable coverage reporting in GitHub Actions`

**Checklist:**

- [x] Configure `vitest --coverage` in CI workflow
- [x] Collect and upload coverage reports (`lcov`)
- [x] Ensure thresholds are met for repository, service, and slice tests
- [x] Confirm coverage badge appears in README.md
