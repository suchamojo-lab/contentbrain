# Content Brain App Flow Implementation Plan

**Goal:** Turn the post-Universe experience into an immediately useful Content Brain with six grounded creation tools.

## Scope

- Keep the public landing page unchanged.
- Add the two requested actions after `/universe/result`.
- Replace the passive `/app` dashboard with six content tools, a universal prompt, grounded suggestions, and recent generations.
- Send the complete saved Content Universe to Gemini for every request.
- Store compact generation records in Convex; do not add embeddings, RAG, or calendar infrastructure.

## Work

1. Update the result-page actions and routes.
2. Add a `brainGenerations` Convex table with an authenticated recent-results query and internal save mutation.
3. Add one authenticated tool action with strict tool names, tool-specific prompts, JSON responses, grounding rules, and Gemini error handling.
4. Replace `WorkspaceHome` with the six-tool interaction, inline inputs/results, universal prompt, grounded suggestions, and existing/recent activity.
5. Reorder and simplify workspace navigation.
6. Add focused responsive styles without touching landing-page files.
7. Run TypeScript, tests, Convex validation/code generation, production build, and browser checks at desktop and mobile widths.

## Safety and honesty

- Story results may use only supplied story/background facts.
- All prompts preserve the creator's point of view and expression style.
- Empty story context routes to `/app/train` instead of inventing material.
- Failed AI calls show a retryable error and never claim the result was saved.
