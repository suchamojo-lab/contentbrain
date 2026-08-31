# GrowthX Virality Loop Implementation Plan

> **For agentic workers:** Implement each checked task in order and verify it before continuing.

**Goal:** Turn each personalized Content Universe into a safe public artifact that attracts the next person into the same four-question creation loop.

**Architecture:** Keep private onboarding answers and full Universes in their existing owner-scoped Convex records. Create a separate public-share record containing only an explicit safe projection, addressed by a random public slug. Keep analytics behind one production-only client helper so local QA never enters launch metrics.

**Tech Stack:** React, TypeScript, Vite, Convex Auth/database/actions, PostHog, Canvas API, Web Share API.

**Spec:** User-provided GrowthX Build Week Virality brief dated 2026-09-01.

## Global Constraints

- Optimize only the visitor → signup → Universe → share → new visitor loop.
- Never expose onboarding answers, private stories, email, or owner IDs.
- Never invent personal facts or analytics numbers.
- Exclude localhost and development builds from PostHog.
- Keep the first result reachable in four questions and under three minutes.
- Build one share-card format only.

---

### Task 1: Production analytics funnel

**Files:**
- Create: `src/lib/analytics.ts`
- Modify: `src/main.tsx`, `src/ConvexApp.tsx`, `src/App.tsx`, landing/auth/onboarding/result components
- Test: `src/lib/analytics.test.ts`

- [ ] Add PostHog with `VITE_POSTHOG_KEY` and optional `VITE_POSTHOG_HOST`.
- [ ] Disable capture unless `import.meta.env.PROD`, a key exists, and hostname is not local.
- [ ] Add typed events for landing, signup, four questions, generation, confirmation, sharing, public views, referral CTA, and first Content Brain use.
- [ ] Add funnel events at their actual user-action boundaries.
- [ ] Verify production build and event-helper tests.

### Task 2: Concentrated identity artifact

**Files:**
- Create: `src/lib/shareableUniverse.ts`, `src/components/universe/UniverseIdentityArtifact.tsx`
- Modify: `src/components/UniverseView.tsx`, result styles
- Test: `src/lib/shareableUniverse.test.ts`

- [ ] Derive archetype, superpower, short territory, positioning, exactly three pillars, and a grounded insight from existing generated fields.
- [ ] Place the identity artifact and primary share action at the top of `/universe/result`.
- [ ] Save and show the confirmed “Locked in” state.

### Task 3: Share-card download

**Files:**
- Create: `src/lib/shareCard.ts`
- Modify: `src/components/universe/UniverseIdentityArtifact.tsx`
- Test: `src/lib/shareCard.test.ts`

- [ ] Render one 1080×1350 warm-paper card with serif typography, lime accent, safe text wrapping, and brand CTA.
- [ ] Download the canvas as PNG and track the completed download.

### Task 4: Safe public share backend and page

**Files:**
- Modify: `convex/schema.ts`
- Create: `convex/universeShares.ts`, `src/components/public/PublicUniversePage.tsx`
- Modify: `src/ConvexApp.tsx`
- Test: Convex function tests and public-page component tests

- [ ] Store only the public projection plus random non-sequential slug and internal owner token.
- [ ] Add authenticated create/reuse mutation and unauthenticated slug lookup query.
- [ ] Render `/u/:shareId` with no private fields and a large Build Mine CTA.
- [ ] Set unique client title, description, canonical, and OG tags while documenting the static-host crawler limitation.

### Task 5: Viral CTA and referral attribution

**Files:**
- Create: `src/lib/referral.ts`
- Modify: public share page, auth flow, Universe generation analytics
- Test: `src/lib/referral.test.ts`

- [ ] Store only the public share slug in session storage when a public page opens.
- [ ] Carry `referral_share_id` and source properties through CTA, signup, and generation events.
- [ ] Never expose or persist the private owner token in the browser URL.

### Task 6: Native share and copy fallbacks

**Files:**
- Modify: `src/components/universe/UniverseIdentityArtifact.tsx`
- Test: component tests with and without `navigator.share`

- [ ] Use Web Share when available.
- [ ] Copy the public URL and show `LINK COPIED ✓` otherwise.
- [ ] Add Copy Result and Create With This actions only where they work.

### Task 7: Signup friction and returning-state audit

**Files:**
- Modify: landing CTA, `src/ConvexApp.tsx`, `src/App.tsx`, auth page
- Test: routing/auth flow tests

- [ ] Route new primary CTA through signup, then directly to the four questions.
- [ ] Resume the current saved answer for incomplete onboarding.
- [ ] Keep existing-Universe sign-in routing to `/app`.

### Task 8: Mobile and failure QA

**Files:**
- Modify: result/public-share CSS and error states
- Test: browser QA checklist

- [ ] Verify 390px mobile and desktop result, share preview, public page, and CTAs.
- [ ] Verify empty/long/emoji input, refresh, double submit, Gemini failure, and Convex failure.
- [ ] Verify Chrome and document Safari/Web Share fallback risk.

### Task 9: Evidence and full viral-loop verification

**Files:**
- Create: `BUILD_WEEK_EVIDENCE.md`
- Modify: relevant tests

- [ ] Add the requested empty evidence fields without invented values.
- [ ] Run build, unit tests, and Person A → Person B browser flow.
- [ ] Record exact remaining risks and production environment requirements.
