### 🎨 React Editor — Creative Canvas

[![Coverage Report](https://img.shields.io/badge/coverage-report-blue?logo=githubpages&logoColor=white)](https://maxvanny2010.github.io/editor/coverage/)
[![Live Demo](https://img.shields.io/badge/live-demo-green?logo=githubpages&logoColor=white)](https://maxvanny2010.github.io/editor/)

# 🎨 Features

## 🖍️ Canvas & Drawing Tools

- **Brush** — freehand drawing
- **Line** — straight lines
- **Shapes** — rectangles and circles
- **Eraser** — removing drawn pixels

Each tool renders only to the active layer, improving FPS.

---

## 🗺️ Canvas Navigation

### 🔎 Zoom
- **Mouse Wheel + Ctrl** — zoom in/out
- Smooth scaling with matrix-based viewport

### ✋ Pan (Move Canvas)
- **Middle Mouse Button (MMB)** — hold + move
- **Right Mouse Button (RMB)** — hold + move

### 🎯 Fit / Reset Viewport
Done only via the UI button (no double-click magic)

---

## 📚 Layers System

### ✅ Layer Features
- Add / delete layers
- Rename layers
- Change z-order (move up/down)
- Toggle visibility
- Each layer = separate `<canvas>` element

---

## ⏮️ History System (Snapshots)

Full snapshot of project state:
- Layers
- Active tool
- Viewport

Each action pushes a new snapshot into the history stack.

**Undo / Redo** restores the app to an earlier snapshot.

History panel displays actions with icons.

**Snapshots saved into IndexedDB** → history persists after reload.

---

## 💿 Persistence: Saving Projects

### 🗄️ Dexie (IndexedDB)

Project structure stored locally:
- Project metadata (name, createdAt, updatedAt)
- Layers (pixel data)
- History snapshots
- Viewport info
- Active tool state

**Nothing is stored on a server** — the editor is fully offline-capable.

---

## 📋 Top Menu

### 📁 File
- Create project
- Save project
- Export as PNG

### 📂 Projects
- Open projects list (Home)

---

## ✔️ Validation

All project creation/edit modals use **Zod + framer-motion** for animated validation.

Prevents:
- Invalid names
- Empty fields
- Wrong sizes

---

## 🛠️ Tech Stack

### 💻 Frontend
- React 19
- TypeScript
- Redux Toolkit
- Dexie (IndexedDB)
- Vite
- TailwindCSS
- Framer Motion (modals + animations)

### 🧪 Testing
- Vitest
- React Testing Library

### 🚀 DevOps
- GitHub Actions
- GitHub Pages
- Coverage reports (`/editor/coverage/`)
