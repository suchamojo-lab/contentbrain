# SuchaMojo Sitewide Visual System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Carry the approved SuchaMojo homepage style through every existing product screen without changing routes, saved data, or Convex behavior.

**Architecture:** Keep the current React component tree and add one final sitewide theme layer after existing styles. Use the homepage tokens as the shared source of truth, then target each existing screen family with scoped selectors so behavior remains untouched.

**Tech Stack:** React, TypeScript, Vite, CSS, Vitest, Convex

**Spec:** User-provided approved homepage brief and `outputs/suchamojo-homepage-concept-v1.png`

## Global Constraints

- Use Inter, Instrument Serif, and DM Mono.
- Use `#F7F7F7`, `#FFFFFF`, `#0A0A0A`, `#656565`, `#101416`, `#2864E8`, and the approved folder colors.
- Preserve routes, onboarding answers, autosave, authentication, Convex calls, and workspace behavior.
- Keep visible focus, AA contrast, reduced motion, and mobile layouts.
- Avoid gradients that imply generic AI styling, excessive pills, and decorative overlap with forms.

---

### Task 1: Shared product theme

**Files:**
- Create: `src/styles/suchamojo-product.css`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: Existing component class names and homepage CSS variables.
- Produces: One final CSS layer loaded after all existing styles.

- [ ] **Step 1:** Add root typography, color, focus, button, header, and retro-window rules scoped to product screens.
- [ ] **Step 2:** Import the stylesheet last in `src/main.tsx`.
- [ ] **Step 3:** Run `npm run build` and confirm TypeScript and Vite pass.

### Task 2: Onboarding and Universe flow

**Files:**
- Modify: `src/styles/suchamojo-product.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `.profile-sources`, `.universe-hub`, `.module-world`, `.stage-insight`, `.universe-building`, `.universe-preview`, and result classes.
- Produces: Blue/cream folder screens, quiet form windows, high-contrast progress, and a consistent reveal.

- [ ] **Step 1:** Restyle profile sources, folder hub, and one-question module screens.
- [ ] **Step 2:** Restyle insight, building, preview, and result pages.
- [ ] **Step 3:** Run `npm test -- --run` and confirm folder routing and saving still pass.

### Task 3: Workspace and authentication

**Files:**
- Modify: `src/styles/suchamojo-product.css`
- Test: `src/components/workspace/WorkspaceShell.test.tsx`

**Interfaces:**
- Consumes: `.workspace`, `.workspace-sidebar`, `.workspace-canvas`, `.auth-page`, and dialog classes.
- Produces: A neutral desktop with blue structure, paper work surfaces, square controls, and retro dialogs.

- [ ] **Step 1:** Restyle workspace navigation, top bar, cards, editors, and capture dialogs.
- [ ] **Step 2:** Restyle authentication with the approved type and colors.
- [ ] **Step 3:** Run the workspace and full test suites.

### Task 4: Responsive and browser verification

**Files:**
- Modify: `src/styles/suchamojo-product.css`

**Interfaces:**
- Consumes: Completed theme rules from Tasks 1–3.
- Produces: Stable desktop/mobile layout with reduced-motion support.

- [ ] **Step 1:** Add tablet and mobile overrides for product screens.
- [ ] **Step 2:** Add reduced-motion overrides.
- [ ] **Step 3:** Run `npm test -- --run` and `npm run build`.
- [ ] **Step 4:** Check onboarding, workspace, auth, keyboard focus, and overflow in the browser.
