# Content Universe V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current four-question, login-first demo with the updated Content Universe funnel: eight conversational stages, a useful preview before login, a detailed saved result, PDF/text export, and next-step actions.

**Architecture:** Keep the existing React/Vite single-page app and Convex backend. The browser owns an anonymous `clientId` while the visitor answers; Convex saves the generated Universe against that ID and later claims it for the authenticated user. UI types and validators share the same structured Universe shape so generation, storage, preview, and full results stay aligned.

**Tech Stack:** React, TypeScript, Vite, Convex, Convex Auth, Gemini, Vitest, Testing Library

**Spec:** User-provided “SUCHAMOJO V1 — UPDATED USER FLOW” and “HRISHIKESH'S CREATOR UNIVERSE” in the 2026-08-30 conversation.

## Global Constraints

- Do not deploy to Vercel.
- Preserve the current visual language until the separate design pass.
- Ask one question at a time and save each response locally.
- Show personalised value before requesting login.
- Never describe active curiosity as earned expertise.
- Do not include Content Brain tools beyond the transition and next-step cards in V1.

---

### Task 1: Structured Universe contract and questions

**Files:**
- Modify: `src/lib/recommendation.ts`
- Modify: `src/data/universeQuestions.ts`
- Modify: `convex/ai/types.ts`
- Modify: `convex/contentBrainData.ts`
- Modify: `convex/schema.ts`

**Interfaces:**
- Produces: `UniverseAnswers`, `GeneratedUniverse`, `UniverseStage`, and matching Convex validators.
- Consumes: the eight stages and detailed result sections in the supplied flow.

- [ ] Define answer fields for story, superpowers, rabbit holes, hot takes, people, personality, proof, and future.
- [ ] Define structured result fields for identity, positioning, worlds, stories, POVs, expertise categories, audience, personality, and 50 opportunities.
- [ ] Add the complete conversational question bank with text, choices, and stage-completion messages.
- [ ] Run `npm test -- --run` and confirm the old four-question tests fail for the expected changed-flow reason.

### Task 2: Eight-stage conversational onboarding

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/universe/ContentUniverse.tsx`
- Modify: `src/components/universe/UniverseQuestion.tsx`
- Create: `src/components/universe/StageInsight.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `universeQuestions` and `UniverseAnswers` from Task 1.
- Produces: a resumable one-question-at-a-time flow and `onComplete(answers)`.

- [ ] Add a dedicated Universe start screen.
- [ ] Render one prompt at a time with accurate percentage progress.
- [ ] Support text questions, multi-select choices, format preferences, and optional skips.
- [ ] Show a short personalised insight after every stage.
- [ ] Save every response and the current prompt to local storage.
- [ ] Add focused tests for start, progress, persistence, and final submission.

### Task 3: Anonymous generation and account claiming

**Files:**
- Modify: `src/ConvexApp.tsx`
- Modify: `convex/contentBrain.ts`
- Modify: `convex/contentBrainData.ts`
- Modify: `convex/content.ts`
- Modify: `convex/schema.ts`

**Interfaces:**
- Produces: `build({ clientId, answers })` and `claimUniverse({ clientId })`.
- Consumes: structured contracts from Task 1.

- [ ] Create a stable random browser `clientId` stored locally.
- [ ] Permit generation before authentication and store ownership by `clientId`.
- [ ] Require a matching `clientId` or authenticated owner for reads and writes.
- [ ] Claim the visitor’s latest Universe immediately after login.
- [ ] Keep existing signed-in Universes readable during schema transition.
- [ ] Typecheck and push only to the configured local/development Convex deployment; never production.

### Task 4: Detailed AI generation

**Files:**
- Modify: `convex/ai/gemini.ts`
- Modify: `convex/ai/types.ts`
- Modify: `convex/contentBrain.ts`
- Modify: `src/lib/recommendation.ts`

**Interfaces:**
- Consumes: all eight answer groups.
- Produces: a validated `GeneratedUniverse` with bounded section sizes and 50 opportunities.

- [ ] Expand the Gemini JSON schema to the complete Universe shape.
- [ ] Instruct Gemini to ground every claim in answers and keep curiosity separate from expertise.
- [ ] Add a deterministic local generator for tests and offline UI work.
- [ ] Validate counts, required text, and category separation before saving.
- [ ] Test malformed output and fallback behavior.

### Task 5: Preview, login squeeze, and full result

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/universe/UniversePreview.tsx`
- Rewrite: `src/components/UniverseView.tsx`
- Modify: `src/components/auth/AuthScreen.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `GeneratedUniverse`.
- Produces: preview counts, one revealed World, locked sections, and full expandable results after login.

- [ ] Add the progressive generation screen and Reveal action.
- [ ] Show real counts and one complete Content World before login.
- [ ] Place the account squeeze after the preview and remove required phone collection.
- [ ] Render identity, positioning, Worlds, stories, POVs, expertise, audience, personality, and opportunities.
- [ ] Add Save and Create actions as honest V1 controls with saved state.
- [ ] Cover preview-to-login and authenticated-result paths with tests.

### Task 6: Export, actions, and next steps

**Files:**
- Create: `src/lib/universeExport.ts`
- Create: `src/components/universe/UniverseActions.tsx`
- Create: `src/components/universe/NextSteps.tsx`
- Modify: `convex/schema.ts`
- Modify: `convex/content.ts`
- Modify: `src/ConvexApp.tsx`

**Interfaces:**
- Produces: `toLlmContext(universe)`, printable PDF view, and `trackAction({ type, universeId })`.
- Consumes: the authenticated Universe and user actions.

- [ ] Generate and copy a clean text context file.
- [ ] Implement browser print-to-PDF rather than showing a placeholder.
- [ ] Record the listed funnel actions in a separate indexed table.
- [ ] Add the Content Brain, community, consultation, and cohort next-step cards.
- [ ] Test context output and action validation.

### Task 7: Local verification

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: the completed local funnel.
- Produces: repeatable local run instructions and a verified build.

- [ ] Update the end-to-end component test for the new journey.
- [ ] Run `npm test -- --run` and fix all failures.
- [ ] Run `npm run build` and fix all type/build failures.
- [ ] Start `npm run dev:web`, open the local URL, and inspect the main flow in the browser if browser control is available.
- [ ] Report the local URL and any features requiring live credentials; do not run a Vercel command.
