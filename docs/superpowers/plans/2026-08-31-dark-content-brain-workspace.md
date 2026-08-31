# Dark Content Brain Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the logged-in product into a calm, dark, persistent Content Brain workspace matching the decoded design brief.

**Architecture:** Keep the existing routing and real workspace data. Reshape the shell navigation and build focused home, training, library, reading, and Universe views inside it. Use one workspace token system and preserve mobile navigation, keyboard controls, and honest empty states.

**Tech Stack:** React, TypeScript, CSS, Convex-backed workspace data, Vitest

**Spec:** User-provided “Screenshot Design Decode” in the 2026-08-31 conversation.

## Global Constraints

- Landing pages remain expressive; `/app/*` becomes dark, calm, dense, and functional.
- Never show fake data or controls that do not work.
- Use bright colour only for selected, progress, or primary-action states.
- Preserve current captures, library items, drafts, and saved Universe data.
- Responsive layouts must stack cleanly on mobile and respect reduced motion.

---

### Task 1: Workspace shell and navigation

**Files:** `src/routing/routes.ts`, `src/components/workspace/workspaceNav.ts`, `src/components/workspace/WorkspaceSidebar.tsx`, `src/components/workspace/WorkspaceShell.tsx`, `src/styles/workspace.css`

**Interfaces:** Produces routes and grouped navigation for Home, Universe, Brain, Library, Discover, and Train.

- [ ] Add a real `/app/train` route.
- [ ] Group navigation with muted section labels.
- [ ] Restyle shell, top bar, focus states, and mobile navigation with dark tokens.
- [ ] Run workspace shell tests.

### Task 2: Content Brain home

**Files:** `src/components/workspace/WorkspaceHome.tsx`, `src/components/workspace/WorkspaceShell.tsx`, `src/styles/workspace.css`, `src/components/workspace/WorkspaceShell.test.tsx`

**Interfaces:** Consumes real workspace counts and capture/create callbacks; produces thought capture, four-step training rail, quick actions, recents, and Universe status.

- [ ] Add the dominant thinking input and connect it to quick capture.
- [ ] Add the four-step accordion with real completion states.
- [ ] Replace colourful folders with four restrained action cards.
- [ ] Keep recents and honest empty states.
- [ ] Test primary home actions.

### Task 3: Library and reading

**Files:** `src/features/workspace/WorkspacePages.tsx`, `src/styles/workspace.css`, `src/features/workspace/WorkspacePages.test.tsx`

**Interfaces:** Consumes real library data; produces search, filter chips, varied cards, and an honest reading queue.

- [ ] Replace filter dropdown with horizontal chips.
- [ ] Vary card sizes by saved type while retaining card/list accessibility.
- [ ] Build Discover as a reading queue using real Link items only.
- [ ] Test filtering and empty states.

### Task 4: Universe and Brain Training

**Files:** `src/features/workspace/WorkspacePages.tsx`, `src/components/workspace/WorkspaceShell.tsx`, `src/styles/workspace.css`

**Interfaces:** Consumes `ContentUniverse`; produces the complete V1 map and eight status-based training cards inside the shell.

- [ ] Render Character, Gifts, Radiance, Expression, positioning, pillars, stories, and ideas.
- [ ] Make only working positioning controls visible.
- [ ] Add eight training cards linked to existing prompt flows.
- [ ] Test Universe and training empty states.

### Task 5: Verification

**Files:** Existing workspace and route tests.

**Interfaces:** Produces a compilable, responsive local workspace.

- [ ] Run TypeScript.
- [ ] Run all Vitest tests with a writable temporary directory.
- [ ] Run the production build.
- [ ] Verify local routes return from the running development server.
