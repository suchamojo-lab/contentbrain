# Creator Type Viral Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Classify a completed Content Universe into one fixed creator type and turn it into a public, downloadable, highly visual social artifact.

**Architecture:** A Convex action sends the saved Universe to Gemini with a strict 10-type enum and validated output schema, with a grounded deterministic fallback for provider failure. The result page renders one reusable creator-type card in three aspect ratios, stores the safe classification on the existing public share record, and reuses `/u/:shareId`. The public page conditionally presents the creator-type card and conversion CTA without exposing classification inputs.

**Tech Stack:** React, TypeScript, Convex, Gemini, existing `html-to-image`, CSS/SVG illustration system, Vitest.

**Spec:** User-provided 2026-09-01 creator-type brief. `BUILD_WEEK_MASTER_PROJECT_CONTEXT.md` is absent from the workspace.

## Global Constraints

- Use exactly the 10 supplied creator types; never generate a new name.
- Classify from the complete saved Universe context, not one answer.
- Do not modify the landing page.
- Do not expose private answers or classification logic publicly.
- Use one fixed visual metaphor and accent color per type.
- Export Story 1080×1920, Post 1080×1350, and Landscape 1600×900 as separate compositions.
- Reuse one `/u/:shareId` for both the Universe and creator-type artifact.
- Track all five requested creator-type events.

---

### Task 1: Fixed taxonomy and grounded fallback

**Files:**
- Create: `src/features/creatorType/creatorTypes.ts`
- Create: `src/features/creatorType/creatorTypes.test.ts`

**Interfaces:**
- Produces `CreatorTypeName`, `CreatorTypeResult`, `creatorTypeDefinitions`, `classifyCreatorTypeFallback(universe)`, and `isCreatorTypeName(value)`.

- [ ] Write tests asserting exactly 10 names, exact accents, and deterministic classification across story, opinion, teaching, systems, operator, connector, and taste signals.
- [ ] Run `npm test -- --run src/features/creatorType/creatorTypes.test.ts` and confirm failure before implementation.
- [ ] Implement weighted evidence scoring across character, gifts, radiance, expression, opinions, stories, expertise, proof-like strengths, and pillars. Return fixed, useful copy for fallback output.
- [ ] Run the focused test and confirm pass.

### Task 2: Gemini classification action

**Files:**
- Create: `convex/creatorType.ts`
- Modify: `convex/ai/gemini.ts`
- Modify: `convex/ai/types.ts`

**Interfaces:**
- Produces public authenticated action `api.creatorType.classify({universeId})` returning the exact output schema.

- [ ] Add a strict JSON schema with `creatorType.enum` containing the 10 names and required short fields.
- [ ] Add an internal query that derives ownership from `getAuthUserId`, reads the requested Universe, and rejects wrong-owner access.
- [ ] Prompt Gemini with every available saved field and explicit anti-invention rules.
- [ ] Validate type membership, four `createMore` items, and non-empty strings; use the grounded fixed-taxonomy fallback if Gemini is unavailable.
- [ ] Run `npx convex dev --once` or the repository’s available Convex code generation command, then `npm run build`.

### Task 3: Safe public-share persistence

**Files:**
- Modify: `convex/schema.ts`
- Modify: `convex/universeShares.ts`
- Modify: `src/App.tsx`
- Modify: `src/ConvexApp.tsx`

**Interfaces:**
- Extends `createOrUpdate` with optional `creatorType` and `getPublic` with the same safe optional object.

- [ ] Add an optional creator-type object to `universeShares`; avoid a migration because existing rows remain valid.
- [ ] Validate and clamp each public string and limit `createMore` to four.
- [ ] Pass the classifier and extended share callback through `ContentPersistence`.
- [ ] Verify old public shares still return normally without a creator type.

### Task 4: Collectible creator card and type grid

**Files:**
- Create: `src/components/creatorType/CreatorTypeVisual.tsx`
- Create: `src/components/creatorType/CreatorTypeCard.tsx`
- Create: `src/components/creatorType/CreatorTypeExperience.tsx`
- Create: `src/styles/creator-type.css`
- Modify: `src/main.tsx`
- Modify: `src/components/UniverseView.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- `CreatorTypeCard({result,format})` is both preview and export root.
- `CreatorTypeExperience` receives `universe`, `classify`, `onCreateShare`, and `onNeedAccount`.

- [ ] Build 10 fixed hand-drawn SVG metaphors with the supplied accent mapping.
- [ ] Build Story, Post, and Landscape compositions without cropping.
- [ ] Render the classification after the share pack and before the long Universe document.
- [ ] Add Share, Download, Copy link, format switcher, editable viral caption, watch-out, and a 10-type comparison grid.
- [ ] Reuse `renderShareCardPng` for exact output dimensions.

### Task 5: Public creator-type page and viral CTA

**Files:**
- Modify: `src/components/public/PublicUniversePage.tsx`
- Modify: `src/styles/viral-loop.css`

**Interfaces:**
- Consumes optional public creator-type object.
- Produces public `NAME IS: TYPE` card plus `WHAT KIND OF CONTENT CREATOR ARE YOU?` CTA.

- [ ] Show the creator card first when public data includes it, followed by the existing safe Universe details.
- [ ] Keep the same referral storage and signup route.
- [ ] Track `creator_type_public_viewed` on load and `creator_type_build_yours_clicked` on CTA.

### Task 6: Analytics and QA

**Files:**
- Modify: `src/lib/analytics.ts`
- Add focused component and taxonomy tests.

**Interfaces:**
- Adds `creator_type_generated`, `creator_type_shared`, `creator_type_downloaded`, `creator_type_public_viewed`, and `creator_type_build_yours_clicked`.

- [ ] Track successful generation, native/fallback share, completed download, public view, and build-yours click with creator type, format, and share ID.
- [ ] Run `npm test -- --run` and `npm run build`.
- [ ] Visually inspect result and public pages at 1440×1100 and 390×844.
- [ ] Download Story, Post, and Landscape cards and inspect exact pixel dimensions and clipping.

## Self-review

- The plan covers fixed classification, complete inputs, strict schema, 10 visuals, three exports, public persistence, type grid, captions, analytics, and the referral loop.
- Existing shares remain compatible through optional fields.
- No landing-page or onboarding changes are included.
- No new dependency, points, leaderboards, percentages, or random taxonomy are included.
