# React Editor — Creative Canvas

[![Coverage Report](https://img.shields.io/badge/coverage-report-blue?logo=githubpages&logoColor=white)](https://maxvanny2010.github.io/editor/coverage/)
[![Live Demo](https://img.shields.io/badge/live-demo-green?logo=githubpages&logoColor=white)](https://maxvanny2010.github.io/editor/)
---

# Overview

React Editor is a browser-based drawing application designed to demonstrate:

The editor allows users to create multi-layer drawings, save them locally, reopen them later, and restore previous
states through a snapshot-based history system. All data persists across page reloads and works entirely offline.

---

# Target Audience

- Frontend developers exploring Canvas and React
- Students looking for a structured architecture example
- Users who need a simple offline drawing tool
- UX/UI researchers working with canvas-based editors

---

# Use Cases

- Sketching and rapid ideation
- Prototyping and diagram drafting
- Demonstrating undo/redo mechanics
- Teaching IndexedDB, Redux, and FSD architecture

---

# Features

## Drawing Tools

- Brush
- Line
- Rectangle and Circle shapes
- Eraser

Each tool operates only on the active layer, improving performance.

---

## Canvas Navigation

### Zoom

- Ctrl + mouse wheel
- Smooth matrix-based scaling

### Pan

- Middle mouse button
- Right mouse button

### Reset View

Viewport reset is handled through a dedicated UI button.

---

## Layer System

- Create and delete layers
- Rename layers
- Reorder layers (z-index)
- Toggle visibility
- Each layer is drawn on a separate canvas, allowing high FPS

---

## History System

The application stores complete snapshots of the editor state, including:

- layers
- active tool
- viewport settings
- pixel data

Undo and Redo operations fully restore previous states.
Snapshots are stored in IndexedDB, so history persists after reloads.

---

## Offline Persistence (Dexie + IndexedDB)

Stored locally:

- project metadata
- layers and raster content
- history snapshots
- viewport and tool state

The editor works completely offline and does not use any backend.

---

## Top Menu

### File

- Create Project
- Save Project
- Export PNG

### Projects

- Navigate to the list of existing projects

---

## Validation

Project creation and editing forms use Zod and Framer Motion for animated validation and error messages. Invalid input
is prevented at the UI level.

---

# Architecture

The project is structured according to the Feature-Sliced Design methodology.

### shared

Reusable utilities, constants, types, and UI primitives.

### entities

Business domains such as project, layer, editor, brush, line, shape, eraser, and history.
Each entity includes its state management slice, selectors, and logic.

### features

User actions and business logic modules: tool selection, project operations, layer manipulation.

### widgets

Composite UI components such as toolbars, menus, and side panels.

### pages

High-level application pages: Home and Editor.

---

# Technology Stack

### Frontend

- React 19
- TypeScript
- Redux Toolkit
- Vite
- TailwindCSS
- Dexie (IndexedDB)
- Framer Motion

### Testing

- Vitest
- React Testing Library

### DevOps

- GitHub Actions
- GitHub Pages deployment
- Automatic coverage publishing

---

# Limitations and Known Issues

- Snapshot history stores full project states, which is simple but uses more storage than delta-based history.
- Very large layers may reduce performance on weaker devices.
- Minor flickering may occur when reordering canvas layers.
- Mobile support is limited; the interface is optimized for desktop use.

---

# Roadmap

- Delta-based history system
- Layer grouping
- Additional shape tools (polygons, curves)
- Selection and transformation tools
- Pressure sensitivity for stylus devices
- Improved mobile layout and PWA support
- SVG export for vector shapes
- Drag-and-drop layer reordering

---

# Testing

- Unit tests with Vitest
- Component-level testing with React Testing Library
- Coverage reports available in GitHub Pages

---

# CI/CD

- Automated testing and build pipelines via GitHub Actions
- Deployment to GitHub Pages
- Automatic coverage updates on each commit
