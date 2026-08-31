# Everything Content Milestone One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local, complete founder flow from landing page through a saved content direction and next-step request.

**Architecture:** A Vite React single-page app keeps the first milestone narrow. One reducer-like page state controls the flow, a pure recommendation module turns compass answers and an idea into a curated result, and versioned local storage preserves progress without requiring an external account or unconfigured service.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, plain CSS, browser local storage

**Spec:** `/Users/shubham/Downloads/IDEA_SCOPE.md`

## Global Constraints

- The path is IP Compass → Content Universe → idea → curated recommendation → Lock Direction.
- Founder expertise-led content is the only supported content type.
- URL ingestion, login, live research, payment, social integrations, and a marketplace are excluded.
- Customer copy must not claim live internet research or automation that does not exist.
- The app must work at desktop and mobile widths with keyboard-visible controls.

---

### Task 1: App foundation and recommendation engine

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`
- Create: `src/lib/recommendation.ts`
- Test: `src/lib/recommendation.test.ts`

**Interfaces:**
- Produces: `CompassAnswers`, `ContentUniverse`, `Recommendation`, `generateUniverse(answers)`, and `generateRecommendation(answers, universe, idea)`.

- [ ] Write tests proving all six universe sections, three hooks, at most three curated examples, one angle, one format, and one direction are returned.
- [ ] Run `npm test -- --run` and confirm the tests fail before the module exists.
- [ ] Implement deterministic keyword matching over a small curated founder-content library, with useful general fallbacks.
- [ ] Run `npm test -- --run` and confirm the engine tests pass.

### Task 2: Complete product flow

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/CompassMark.tsx`, `src/components/ProgressRail.tsx`, `src/components/UniverseView.tsx`, `src/components/RecommendationView.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: the recommendation module from Task 1.
- Produces: landing, four compass steps, generated universe, idea entry, recommendation, lock confirmation, paid-research request, and execution-help request.

- [ ] Write a browser-like test that starts the flow, fills four compass fields, generates a universe, submits an idea, locks a direction, and verifies the saved state.
- [ ] Implement semantic forms and buttons with validation messages attached to the relevant field.
- [ ] Persist answers, universe, idea, locked direction, and requests under the versioned key `everything-content:v1`.
- [ ] Run the app test and fix all failures.

### Task 3: Visual system, copy, and responsive behavior

**Files:**
- Create: `src/styles.css`
- Modify: `src/App.tsx` and product components

**Interfaces:**
- Consumes: semantic component class names.
- Produces: the “working compass” visual system and responsive layouts.

- [ ] Add the cobalt-paper palette, Newsreader display face, Manrope body face, utility labels, a 4px spacing grid, quiet layered shadows, and visible focus states.
- [ ] Make the compass the signature element on landing, onboarding, and results; use one focal action per screen.
- [ ] Add mobile layouts at 760px and reduced-motion behavior.
- [ ] Review every promise against the scope and remove unsupported claims.

### Task 4: Local verification

**Files:**
- Create: `README.md`

**Interfaces:**
- Produces: exact local run and test instructions.

- [ ] Run `npm test -- --run`, `npm run build`, and the TypeScript compiler through the production build.
- [ ] Start the local app and test the full flow in a real browser at desktop and mobile widths.
- [ ] Check refresh persistence after locking a direction.
- [ ] Record any external-service limitation honestly; local persistence is the milestone-one local storage layer until a Convex deployment is configured.
