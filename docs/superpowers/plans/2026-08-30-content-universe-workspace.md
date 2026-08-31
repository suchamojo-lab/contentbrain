# Content Universe Workspace Implementation Plan

> **For agentic workers:** Implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the existing cinematic SuchaMojo website to a private workspace where a user can build a Content Universe, capture knowledge, find it, create sourced drafts, save them and export them.

**Architecture:** Keep React, Vite, Convex and `@convex-dev/auth`. Introduce a small route layer and protected workspace shell without changing the stack. Convex owns authenticated state and source relationships; browser storage is only a recoverable guest/onboarding cache. AI actions retrieve only the signed-in user’s selected sources and persist citations with every result.

**Tech Stack:** React, TypeScript, Vite, Convex, `@convex-dev/auth`, Gemini provider, Vitest, Testing Library, CSS.

**Spec:** `docs/product/content-workspace-spec.md`

## Global Constraints

- Preserve the public retro-computer landscape and editorial identity.
- Do not deploy to Vercel during local development.
- Do not add Discover, direct publishing or social analytics to the first usable release.
- Every private query and mutation derives the user from Convex authentication and checks ownership.
- AI output must retain exact user-owned source references and must not invent personal facts.
- All forms, navigation and creation tools work without WebGL and with reduced motion.
- Run `npm test -- --run` and `npm run build` after every phase.
- The current directory has no readable `.git` repository; do not claim commit history or use destructive cleanup commands.

---

### Task 1: Route contract and access-state tests

**Files:**
- Create: `src/routing/routes.ts`
- Create: `src/routing/useAppRoute.ts`
- Create: `src/routing/RouteGate.tsx`
- Test: `src/routing/RouteGate.test.tsx`
- Modify: `src/ConvexApp.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces `parseRoute(pathname): AppRoute`, `navigate(route, options?)`, and `resolveAccess({route,isAuthenticated,onboardingStatus})`.
- `resolveAccess` returns `allow`, `redirect_login`, `redirect_onboarding`, or `redirect_app`.

- [ ] Write failing tests covering a guest opening `/app`, a signed-in incomplete user opening `/app`, and a completed user opening onboarding.
- [ ] Run `npm test -- --run src/routing/RouteGate.test.tsx` and confirm the access module is missing.
- [ ] Implement the route union for every public, onboarding and release-one workspace URL.
- [ ] Implement history navigation and back-button handling in one hook, replacing duplicated route parsing in `App.tsx`.
- [ ] Implement `RouteGate` with a visible loading state while auth/onboarding status is unknown.
- [ ] Run the route tests, full test suite and production build.

### Task 2: Convex workspace schema and ownership helpers

**Files:**
- Modify: `convex/schema.ts`
- Create: `convex/lib/auth.ts`
- Create: `convex/lib/ownership.ts`
- Create: `convex/workspaceStatus.ts`
- Test: `convex/workspaceStatus.test.ts`

**Interfaces:**
- Produces `requireUser(ctx)` and `requireOwned(ctx, table, id)` helpers.
- Produces `api.workspaceStatus.get` returning `{ onboardingStatus, hasUniverse }`.

- [ ] Write failing authenticated and unauthenticated status tests.
- [ ] Add the tables and indexes from `docs/product/content-workspace-data-model.md` without removing legacy tables.
- [ ] Implement one server-derived ownership helper; never accept `userId` as an authorization argument.
- [ ] Implement the workspace-status query used by `RouteGate`.
- [ ] Test that user B cannot read or update user A’s record.
- [ ] Run Convex type generation through the existing local development command, then run tests and build.

### Task 3: Authentication pages and protected workspace shell

**Files:**
- Create: `src/components/auth/LoginPage.tsx`
- Create: `src/components/auth/SignupPage.tsx`
- Create: `src/components/workspace/WorkspaceShell.tsx`
- Create: `src/components/workspace/WorkspaceSidebar.tsx`
- Create: `src/components/workspace/CommandMenu.tsx`
- Create: `src/components/workspace/MobileNav.tsx`
- Create: `src/styles/workspace.css`
- Test: `src/components/workspace/WorkspaceShell.test.tsx`

**Interfaces:**
- Shell accepts `{route, children, contextPanel?, onNavigate, onCapture}`.
- Command menu opens on Command/Ctrl+K and exposes search, capture and navigation actions.

- [ ] Write failing tests for sidebar navigation, keyboard command menu and mobile primary navigation.
- [ ] Split the existing combined auth screen into stable `/login` and `/signup` pages using the current password provider.
- [ ] Build the collapsible desktop sidebar and mobile bottom navigation.
- [ ] Add Home, Universe, Inbox, Library, Create, Calendar, AI Partner and Settings; label Discover and Analytics as later features rather than working tools.
- [ ] Add offline, loading and error surfaces to the shell.
- [ ] Run component tests, full tests and build.

### Task 4: Saved eight-module onboarding and reveal

**Files:**
- Create: `convex/onboarding.ts`
- Create: `convex/universeGeneration.ts`
- Modify: `src/components/universe/ModuleExperience.tsx`
- Modify: `src/components/universe/UniverseBuilding.tsx`
- Create: `src/features/onboarding/OnboardingFlow.tsx`
- Test: `src/features/onboarding/OnboardingFlow.test.tsx`
- Test: `convex/onboarding.test.ts`

**Interfaces:**
- `api.onboarding.saveAnswer({module,questionKey,answer,skipped})` upserts one answer.
- `api.onboarding.getSession()` returns saved answers and module progress.
- `api.universeGeneration.build()` returns the generated universe ID and structured items.

- [ ] Write failing save/resume tests, including a second user who cannot see the first user’s answers.
- [ ] Map the existing 32 exact questions to the eight onboarding routes.
- [ ] Keep one question visible at a time with back, skip, example and saved state.
- [ ] Replace browser-only completion with Convex session state while retaining the local cache for failed/offline writes.
- [ ] Generate source-linked universe items from completed answers; use the deterministic local generator when Gemini is unavailable.
- [ ] Build a skippable reveal and redirect completion to `/app/universe`.
- [ ] Run onboarding tests, full tests and build.

### Task 5: Universe visual and searchable views

**Files:**
- Create: `convex/universeItems.ts`
- Create: `src/features/universe/UniversePage.tsx`
- Create: `src/features/universe/UniverseMap.tsx`
- Create: `src/features/universe/UniverseList.tsx`
- Create: `src/features/universe/UniverseItemPanel.tsx`
- Test: `src/features/universe/UniversePage.test.tsx`
- Test: `convex/universeItems.test.ts`

**Interfaces:**
- CRUD supports create, edit, connect, merge and recoverable archive.
- Every returned item includes its source label, excerpt, confidence and connections.

- [ ] Write failing tests for view switching, search, edit, merge and archive recovery.
- [ ] Implement ownership-checked queries and mutations.
- [ ] Build the restrained editorial relationship view using DOM/SVG, plus a complete list view.
- [ ] Add source inspection in the right context panel.
- [ ] Add missing-evidence and underexplored-subject recommendations based only on stored item types and connections.
- [ ] Run tests and build.

### Task 6: Global capture and inbox processing

**Files:**
- Create: `convex/captures.ts`
- Create: `src/features/inbox/CaptureDialog.tsx`
- Create: `src/features/inbox/InboxPage.tsx`
- Create: `src/features/inbox/CaptureReview.tsx`
- Test: `src/features/inbox/InboxPage.test.tsx`
- Test: `convex/captures.test.ts`

**Interfaces:**
- `api.captures.create` stores `originalText` unchanged.
- `api.captures.acceptSuggestions` creates or updates a Library item only after user confirmation.

- [ ] Write failing tests that prove original text is unchanged and suggestions do not reorganise data before acceptance.
- [ ] Build global quick capture for note, story, question, link, observation and customer insight.
- [ ] Implement deterministic title/type/tag suggestions, with optional AI enhancement behind the same interface.
- [ ] Build review, edit, accept, archive and retry states.
- [ ] Verify processed captures enter the Library and unprocessed captures remain in Inbox.
- [ ] Run tests and build.

### Task 7: Searchable Library and boards

**Files:**
- Create: `convex/library.ts`
- Create: `convex/boards.ts`
- Create: `src/features/library/LibraryPage.tsx`
- Create: `src/features/library/LibraryFilters.tsx`
- Create: `src/features/library/LibraryItemPanel.tsx`
- Test: `src/features/library/LibraryPage.test.tsx`
- Test: `convex/library.test.ts`

**Interfaces:**
- Search accepts `{query,type?,archived?,cursor}` and is always scoped to the authenticated user.
- Board membership is stored separately and cannot duplicate an item within one board.

- [ ] Write failing search, filter, favourite, archive and cross-user isolation tests.
- [ ] Implement indexed list queries and full-text search.
- [ ] Build card/list switching, filters, favourites, archives and useful empty states.
- [ ] Build boards and a related-universe-items panel.
- [ ] Add duplicate warnings using normalized source URL and normalized text fingerprints.
- [ ] Run tests and build.

### Task 8: Sourced Creation Studio and draft history

**Files:**
- Create: `convex/drafts.ts`
- Create: `convex/ai/createDraft.ts`
- Create: `src/features/create/CreateStart.tsx`
- Create: `src/features/create/CreationStudio.tsx`
- Create: `src/features/create/SourcePanel.tsx`
- Create: `src/features/create/ExportDraft.tsx`
- Test: `src/features/create/CreationStudio.test.tsx`
- Test: `convex/drafts.test.ts`

**Interfaces:**
- Draft mutation saves each stage and creates a new version only when body content changes.
- AI action receives source IDs, validates ownership, generates angles before drafts and returns source references.

- [ ] Write failing draft resume, version history, invalid-source and cross-user tests.
- [ ] Build the nine-stage creation flow for the seven initial formats.
- [ ] Add autosave, visible saved/error state and safe retry.
- [ ] Generate multiple angles before outline/draft generation.
- [ ] Persist exact source references and show them beside the editor.
- [ ] Add stop, retry and restore-version controls.
- [ ] Export plain text, Markdown and copy-to-clipboard.
- [ ] Run tests and build.

### Task 9: Source-aware AI Partner

**Files:**
- Create: `convex/chats.ts`
- Create: `convex/ai/chat.ts`
- Create: `src/features/chat/ChatPage.tsx`
- Create: `src/features/chat/ChatSources.tsx`
- Test: `src/features/chat/ChatPage.test.tsx`
- Test: `convex/chats.test.ts`

**Interfaces:**
- Chat action scopes retrieval to the authenticated user and selected source types.
- Each assistant message has persisted `sourceReferences` opened through the context panel.

- [ ] Write failing citation and cross-user source tests.
- [ ] Implement starter actions and user-owned retrieval.
- [ ] Stream response text when the provider supports it and preserve a non-streaming fallback.
- [ ] Render source chips under every answer and open the exact item on selection.
- [ ] Add stop, retry, empty and provider-error states.
- [ ] Run tests and build.

### Task 10: Calendar, account controls and release verification

**Files:**
- Create: `convex/calendar.ts`
- Create: `convex/account.ts`
- Create: `src/features/calendar/CalendarPage.tsx`
- Create: `src/features/settings/SettingsPage.tsx`
- Create: `src/features/settings/DeleteAccountDialog.tsx`
- Test: `src/features/calendar/CalendarPage.test.tsx`
- Test: `convex/account.test.ts`

**Interfaces:**
- Calendar entries reference owned drafts and update dates optimistically with rollback on failure.
- Account export returns all user-owned records in a versioned JSON document.
- Account deletion requires a second explicit confirmation value.

- [ ] Write failing calendar movement, export completeness and deletion confirmation tests.
- [ ] Build month/week views and keyboard-accessible date movement; no direct publishing.
- [ ] Build privacy, export and deletion settings.
- [ ] Add optional demo seeding behind an explicit “Use demo workspace” choice and keep it out of real accounts by default.
- [ ] Run the full tests and production build.
- [ ] Check the complete acceptance journey in desktop and mobile browser sizes.
- [ ] Run keyboard and reduced-motion checks, inspect overflow and record remaining provider/integration gaps.

## Phase 1 findings (2026-08-30)

- Framework: React + Vite + TypeScript. There is no routing library; `App.tsx` manually parses `location.pathname`.
- Styling: global CSS plus `landing-v3.css`; no CSS framework or component library.
- Database: Convex with legacy `contentUniverses`, `ideas`, `lockedDirections` and `creatorProfiles` tables.
- Authentication: `@convex-dev/auth` Password provider with name, email and an eight-character minimum password.
- AI: Gemini `2.5-flash` action exists for a legacy four-answer Content Brain, but the current UI uses the deterministic local generator instead of that action.
- Persistence: the current 32 answers and module state are primarily stored under `suchamojo:content-universe:v1` in browser storage. Authenticated Convex persistence only saves the creator profile and reads the older universe shape.
- Reusable UI: cinematic landing, auth form, eight-folder hub, one-question module experience, reveal, preview, full result and export utilities.
- Baseline verification: `npm test -- --run` passes 4 tests; `npm run build` passes.
- Local server: the existing Vite server responds on `http://127.0.0.1:5176/`.
- Version control: no `.git` directory exists in this workspace, so status, diffs and commits are unavailable.
- Eden reference: its useful pattern is a shared loop across Discover, boards/library and source-aware chat. SuchaMojo narrows this to user knowledge and source-backed creation.

## Self-review

- Release-one scope is covered by Tasks 1–10.
- Deferred Discover, publishing and analytics are deliberately not implemented in this plan.
- Ownership checks appear in every private subsystem and have negative two-user tests.
- Source references are a separate table so citations can grow without rewriting drafts or messages.
- Legacy tables are not removed in the first migration, preventing destructive data loss.
