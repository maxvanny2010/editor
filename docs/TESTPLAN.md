### ✅ M1.6 — Tests: Local DB Infrastructure (Dexie + Redux)

#### 🔀 Repository
**File:** `src/entities/project/api/__tests__/project.repository.test.ts`

- [x] add creates a record, and getById returns it
- [x] findByName finds a project by name, case-insensitively
- [x] getAll returns records sorted by updatedAt
- [x] update correctly changes the name and updatedAt fields
- [x] remove successfully deletes a record

#### 🔀 Service
**File:** `src/entities/project/model/__tests__/project.service.test.ts`

- [x] createProject throws an error if the name is empty
- [x] createProject throws an error if the name is a duplicate
- [x] successful createProject returns a Project with valid id, createdAt, and updatedAt
- [x] updateProject returns the updated object, and the updatedAt timestamp is changed

#### 🔀 Project Thunks
**File:** `src/entities/project/model/__tests__/project.thunks.test.ts`

- [x] fetchProjects calls `projectService.getProjects` once
- [x] createProjectThunk calls `projectService.createProject` with correct payload
- [x] deleteProjectThunk calls `projectService.deleteProject` with correct ID

#### 🔀 Project Slice
**File:** `src/entities/project/model/__tests__/project.slice.test.ts`

- [x] fetchAllThunk correctly populates Redux state (`ids`, `entities`, `loading='succeeded'`)
- [x] createOneThunk adds a new entity; `selectById` and `selectAll` reflect correct data afterward
- [x] updateOneThunk performs upsert and correctly updates project name and updatedAt
- [x] deleteOneThunk removes entity from Redux state successfully
- [x] makeSelectors(...).selectByName(state, 'foo') filters projects case-insensitively by name

#### 🔀 Provider Integration
**File:** `src/app/__tests__/storeProvider.test.tsx`

- [x] Wrap the test component in `<StoreProvider>`
- [x] Display a list of projects using `projectsSelectors.selectAll`
- [x] Dispatch `createProject({ name: 'Test' })` on a button click
- [x] Verify that the new project element appears in the DOM after the action is dispatched
