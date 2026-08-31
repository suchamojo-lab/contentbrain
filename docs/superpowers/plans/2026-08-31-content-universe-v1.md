# Content Universe V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn four messy answers into an honest, structured Content Universe with character, gifts, radiance, expression, territory, pillars, stories, and ideas.

**Architecture:** Gemini returns one validated V1 object. Convex stores it beside the existing legacy projection so old records and workspace features remain readable. The React result flow renders the V1 object directly and retains a deterministic local fallback.

**Tech Stack:** React, TypeScript, Convex, Gemini structured output, Vitest, CSS

**Spec:** User-provided Content Universe V1 brief in the 2026-08-31 conversation.

## Global Constraints

- Never invent achievements, numbers, clients, credentials, or experiences.
- Separate user-stated source material from AI-inferred strategic conclusions.
- Keep the first result focused on strategy; do not add visual branding, fonts, or a posting calendar.
- Preserve existing stored Universes through optional schema evolution.
- Keep “Create with my brain” and “Teach my brain more” as the two closing actions.

---

### Task 1: V1 generation contract

**Files:**
- Modify: `convex/ai/types.ts`
- Modify: `convex/ai/gemini.ts`
- Modify: `convex/contentBrainData.ts`
- Modify: `convex/contentBrain.ts`
- Modify: `convex/schema.ts`

**Interfaces:**
- Consumes: four onboarding answers.
- Produces: `BrainGenerationOutput` with `character`, `gifts`, `radiance`, `expression`, `territory`, `contentPillars`, `storyBank`, and `ideaUniverse`.

- [ ] Define the complete TypeScript and Convex validator contract.
- [ ] Update Gemini's JSON schema and grounding prompt.
- [ ] Save V1 as an optional field while retaining the legacy projection.
- [ ] Update cache reads to require the current schema version and model.
- [ ] Run `npx tsc --noEmit` and `npx convex dev --once`.

### Task 2: Client data bridge and local fallback

**Files:**
- Modify: `src/lib/recommendation.ts`
- Modify: `src/ConvexApp.tsx`
- Modify: `convex/content.ts`
- Test: `src/lib/recommendation.test.ts`

**Interfaces:**
- Consumes: AI V1 output or the four local answers.
- Produces: a stable `ContentUniverse` used by result and workspace screens.

- [ ] Replace the client type with the V1 structure plus compatibility helpers.
- [ ] Add a conservative local fallback that labels inferences and does not fabricate facts.
- [ ] Return stored V1 data for signed-in users when present.
- [ ] Map action output directly instead of regenerating it in the browser.
- [ ] Update tests for honesty and required sections.

### Task 3: Results experience

**Files:**
- Modify: `src/components/UniverseView.tsx`
- Modify: `src/components/universe/UniverseBuilding.tsx`
- Modify: `src/components/universe/UniversePreview.tsx`
- Modify: `src/components/universe/UniverseActions.tsx`
- Modify: `src/components/universe/NextSteps.tsx`
- Modify: `src/App.tsx`
- Modify: `src/lib/universeExport.ts`
- Modify: `src/features/workspace/WorkspacePages.tsx`
- Modify: `src/styles/suchamojo-product.css`

**Interfaces:**
- Consumes: the V1 `ContentUniverse`.
- Produces: a responsive result page and both product-loop actions.

- [ ] Render the ten strategic sections from the brief.
- [ ] Use source labels to make stated facts and inferences visible.
- [ ] Build the territory intersection map as the signature visual.
- [ ] Add positioning confirmation controls and the two closing actions.
- [ ] Update export and workspace compatibility.

### Task 4: End-to-end verification

**Files:**
- Test: `src/App.test.tsx`
- Test: `src/lib/recommendation.test.ts`

**Interfaces:**
- Consumes: completed implementation.
- Produces: passing tests, production build, deployed development functions, and one real Gemini response.

- [ ] Run all Vitest tests with a writable temporary directory.
- [ ] Run `npm run build`.
- [ ] Push with `npx convex dev --once`.
- [ ] Call `contentBrain:build` with grounded sample input and confirm the cached repeat.
