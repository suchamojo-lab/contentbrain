# Everything Content product interface system

## Direction and feel

The post-Universe product should feel like an editorial thinking tool, not a dashboard. It combines a warm magazine page, a working creative notebook, and one strange Content Brain signal.

- The user’s identity or thought is always the focal point.
- Product branding stays quiet and secondary.
- Use plain, playful customer language: “What should I yap about?” instead of formal content-strategy labels.
- Preserve generous negative space around identity results and generated thoughts.
- Avoid generic SaaS cards, decorative gradients, heavy rounded containers, and referral-ad styling.

## Product-world palette

- Paper / cream: `#f1eadc` or nearby warm paper tones.
- Ink: `#11110f`.
- Dark work surface: `#11120f`.
- Acid-lime signal: `#d7ea62` to `#d8f15a`.
- Supporting warm grey: `#999b92`.
- Error surfaces may use restrained dark red, but lime remains the only product accent.

Colors should be expressed through existing semantic variables when available. New feature-specific values should remain inside the feature root.

## Signature

The signature element is the Content Brain orbit: thin black concentric rings, small signal nodes, and one acid-lime center or node. It connects identity, interests, and ideas without looking like a literal brain illustration.

Use it sparingly:

- Story artifacts
- Important Universe-to-creation transitions
- Rare empty or loading states

Do not turn it into a repeated icon on every button or card.

## Depth and spacing

- Base spacing unit: 4px; common product intervals are 8, 12, 16, 24, 32, 40, and 64px.
- Product workspace depth: borders and surface shifts.
- Editorial Story preview: one hard acid-lime offset shadow to frame the artifact.
- Avoid mixing soft card shadows with hard editorial shadows in the same module.
- Story and Yap modules use square or restrained existing radii; exported artifacts have no app-like card radius.

## Typography and hierarchy

- Editorial focal text: the project’s existing display serif, falling back to Georgia only inside exported artifacts.
- Metadata and controls: the project’s existing sans face, uppercase with restrained tracking.
- Product UI scale: approximately 1.25.
- Artifact scale is more expressive: metadata 20–22px at 1080px canvas width, supporting copy 34–48px, focal display 76–120px.
- Weight and contrast separate metadata, supporting context, and actions; avoid many near-identical font sizes.
- Balance large headings and use readable line lengths for explanations.

## Reusable component patterns

### Instagram Story artifact

- Canvas: exactly 1080 × 1920px, 9:16.
- Background: warm cream.
- Padding: approximately 76px horizontal and vertical.
- No browser chrome, dashboard controls, buttons, email, private stories, or onboarding answers.
- Tiny brand footer; the user’s identity or ideas dominate.
- Preview is a scaled rendering of the real artifact, never a separate approximation.
- Export waits for fonts, renders at exact dimensions, and removes preview transforms.

### Story share studio

- Dark editorial section on the light result page.
- Desktop: 420px preview column plus a flexible action column.
- Mobile: one column, centered 280px preview, full-width primary actions.
- Primary order: Share → Download → Try another design → Copy link.
- All buttons need disabled, focus, and status feedback.

### Yap Topic card

- Warm paper surface with a restrained ink border.
- Header: numbered Yap label on the left, source trace on the right.
- The complete, arguable thought is the dominant serif text.
- Supporting grid: Why you / Start with / Best as.
- Primary action: “Yap on this”. Save and Another angle stay quieter.
- Creation choices open inline to preserve context: talking points, hook, draft, help me think.
- Mobile stacks the source, supporting grid, and all actions.

### Yap module

- Lime surface inside the dark workspace; warm paper or dark editorial framing on the Universe result page.
- Heading uses “What should I yap about?”
- Empty state has one obvious generation action.
- Home shows three suggestions immediately; the full state can show ten.
- Regeneration says “Give me 10 more” and must use unexplored Universe evidence.

## Interaction rules

- Button press feedback may scale to `0.97` for 100–160ms.
- Use transform and opacity for motion; never transition every property.
- Respect `prefers-reduced-motion`.
- Minimum interactive hit area: 44×44px where practical.
- Loading, empty, error, success, and disabled states are required for AI and sharing actions.
- Native Web Share is preferred when file sharing is supported; PNG download is the fallback.

## Privacy and grounding

- Share artifacts may use only archetype, superpower, top interests/territories, positioning, and user-approved Yap Topics.
- Never export private stories, raw onboarding answers, email, hidden profile fields, or the full Universe.
- Every Yap Topic must trace to something the user knows, experienced, believes, or cares about.
- Generated personal stories are forbidden unless a real saved story exists.
