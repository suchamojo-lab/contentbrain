# Public Content Brain Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public landing page that makes the Content Universe → Content Brain wedge understandable through real product-style scenes.

**Architecture:** Replace the active four-scene landing with one long narrative component made from focused sections. Keep existing start/login routing, smooth scrolling, reduced-motion support, and public-only scope. Use a dedicated stylesheet so logged-in workspace CSS is untouched.

**Tech Stack:** React, TypeScript, CSS, Vitest

**Spec:** User-provided public landing brief in the 2026-08-31 conversation; `BUILD_WEEK_MASTER_PROJECT_CONTEXT.md` was requested but is absent.

## Global Constraints

- Do not modify logged-in workspace components or product architecture.
- Sell existing Content Universe and Content Brain functionality first.
- Mark research, publishing, creator intelligence, and community as coming next where they are not live.
- Never invent testimonials, users, companies, metrics, or product claims.
- Keep navigation to Product, How it works, Examples, Sign in, and one primary CTA.

---

### Task 1: Hero and positioning

**Files:** `src/components/homepage/LandingExperience.tsx`, `src/styles/public-landing.css`, `src/main.tsx`, `src/App.test.tsx`

**Interfaces:** Consumes `onStart`; produces compact navigation, hero copy, and product-first Universe mockup.

- [ ] Replace the chapter hero with the primary outcome and two real actions.
- [ ] Build the three-pane Universe mockup from grounded example data.
- [ ] Add responsive navigation and hero tests.

### Task 2: Universe and Content Brain story

**Files:** `src/components/homepage/LandingExperience.tsx`, `src/styles/public-landing.css`

**Interfaces:** Produces the problem manifesto, four-input transformation, and grounded Brain response scene.

- [ ] Add the text-led problem section.
- [ ] Show four questions becoming the complete Universe output.
- [ ] Show a thought becoming angle, hooks, story, format, and draft.

### Task 3: Research, Library, and Create scenes

**Files:** `src/components/homepage/LandingExperience.tsx`, `src/styles/public-landing.css`

**Interfaces:** Produces honest workflow scenes aligned with current and future product states.

- [ ] Mark internet research as Coming next.
- [ ] Show the live Library concept with searchable saved context.
- [ ] Show rough thought → angle → hook → structure → draft → repurpose.

### Task 4: Training and connected system

**Files:** `src/components/homepage/LandingExperience.tsx`, `src/styles/public-landing.css`

**Interfaces:** Produces optional training modules, progressive profiling example, and current/future capability map.

- [ ] Render eight optional context modules with status.
- [ ] Add the “brain noticed something” confirmation prompt.
- [ ] Map Universe → Brain → working and coming-next tools.

### Task 5: Proof, manifesto, CTA, and responsive polish

**Files:** `src/components/homepage/LandingExperience.tsx`, `src/styles/public-landing.css`, `src/App.test.tsx`

**Interfaces:** Produces honest audience proof, manifesto, final conversion, and mobile-ready page.

- [ ] Use audience chips instead of fabricated testimonials.
- [ ] Add the mission statement and final four-question CTA.
- [ ] Verify keyboard focus, reduced motion, mobile layout, tests, and production build.
