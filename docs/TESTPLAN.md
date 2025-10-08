✅ M1.6 — Tests: Local DB Infrastructure (Dexie + Redux)
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

```bash
npm i -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom fake-indexeddb @types/node
```

### 🧪 Tests Plan (files & cases)

#### 🔀 Repository — src/entities/project/api/__tests__/project.repository.test.ts

- [x] add creates a record, and getById returns it.

- [x]  findByName finds a project by name, case-insensitively.

- [x]  getAll returns records sorted by updatedAt (as defined in the repository).

- [x]  update correctly changes the name and updatedAt fields.

- [x]  remove successfully deletes a record.

#### 🔀 Service — src/entities/project/model/__tests__/project.service.test.ts

- [x]  createProject throws an error if the name is empty.

- [x]  createProject throws an error if the name is a duplicate.

- [x]  A successful createProject call returns a Project with valid id, createdAt, and updatedAt.

- [x]  updateProject returns the updated object, and the updatedAt timestamp is changed.

#### 🔀 Slice/Thunks — src/entities/project/model/__tests__/projectsSlice.test.ts

- [x]  fetchAllThunk correctly populates the state (ids, entities, loading='succeeded').

- [x]  createOneThunk adds a new entity; selectById and selectAll return the correct data afterward.

- [x]  updateOneThunk performs an upsert and correctly changes the name.

- [x]  deleteOneThunk successfully removes an entity from the state.

- [x]  makeSelectors(...).selectByName(state, 'foo') filters correctly.

Test store setup: a local configureStore({ reducer: { projects: projectsReducer }}) will be used.

#### 🔀 Provider Integration — src/app/__tests__/storeProvider.integration.test.tsx

- [x]  Wrap the test component in a <StoreProvider>.

- [x]  The test component will:

Display a list of projects using projectsSelectors.selectAll.
Dispatch createProject({ name: 'Test' }) on a button click.

- [x]  Verify that the new project element appears in the DOM after the action is dispatched.
