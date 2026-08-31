# Content Universe Social Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn one generated Content Universe into six personalized, swipeable, exportable social cards in Story, Post, and Landscape formats, all pointing to one safe public Universe URL.

**Architecture:** Extend the existing `StoryShareStudio` rather than adding another result-page section. A pure data module will enforce word limits and build templates/captions; one responsive `ShareCardRenderer` will render both the preview and the export target; a small export module will wait for fonts and create correctly sized PNG files with `html-to-image`. The existing `onCreateShare` callback remains the only way to create `/u/:shareId`, so no backend or Content Universe generation changes are needed.

**Tech Stack:** React, TypeScript, CSS scroll snap, existing `html-to-image`, Vitest, existing PostHog wrapper.

**Spec:** User-provided task in the 2026-09-01 conversation. `BUILD_WEEK_MASTER_PROJECT_CONTEXT.md` was requested but is absent from the workspace.

## Global Constraints

- Change only the share artifact on `/universe/result`; do not modify landing, onboarding, generation, or workspace layout.
- Provide exactly six templates: Identity, Brain, Yap, Territory, Superpower, Insight.
- Provide Story `1080×1920`, Post `1080×1350`, and Landscape `1600×900` compositions; Story is the default.
- Use warm cream, black, acid lime, editorial serif, sans utility text, thin lines, circles, orbit graphics, and small Content Brain branding.
- Do not add gradients, a carousel dependency, generic templates, giant logos, autoplay, or fake direct publishing.
- Every card shares the same `/u/:shareId` public URL.
- Wait for fonts before export, export exact platform dimensions, and keep generated copy within specified word limits.
- Track all requested events with `template`, `format`, `platform`, and `shareId` where available.

---

### Task 1: Share pack data model and concise copy

**Files:**
- Replace: `src/components/share/storyCardData.ts`
- Create: `src/components/share/storyCardData.test.ts`

**Interfaces:**
- Consumes: `ContentUniverse` from `src/lib/recommendation.ts`.
- Produces: `ShareTemplate`, `ShareFormat`, `SharePlatform`, `ShareCardData`, `SharePack`, `buildSharePack(universe, yapTopics)`, and `captionFor(pack, template, platform, url)`.

- [ ] **Step 1: Write failing tests for exact template count and word limits**

```ts
const pack = buildSharePack(fixtureUniverse, []);
expect(pack.templates).toEqual(["identity","brain","yaps","territory","superpower","insight"]);
expect(words(pack.archetype)).toBeLessThanOrEqual(5);
expect(words(pack.superpower)).toBeLessThanOrEqual(14);
expect(words(pack.positioning)).toBeLessThanOrEqual(22);
expect(words(pack.insight)).toBeLessThanOrEqual(35);
expect(pack.yapTopics).toHaveLength(5);
expect(pack.yapTopics.every((topic) => words(topic) <= 12)).toBe(true);
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- --run src/components/share/storyCardData.test.ts`

Expected: FAIL because `buildSharePack` and the six-template model do not exist.

- [ ] **Step 3: Implement word-aware truncation and grounded fallback selection**

```ts
export const shareTemplates = ["identity","brain","yaps","territory","superpower","insight"] as const;
export const shareFormats = {
  story:{label:"Story 9:16",width:1080,height:1920},
  post:{label:"Post 4:5",width:1080,height:1350},
  landscape:{label:"Landscape 16:9",width:1600,height:900},
} as const;

export function clampWords(value:string,max:number){
  const words=value.trim().replace(/\s+/g," ").split(" ");
  return words.length<=max?words.join(" "):`${words.slice(0,max).join(" ").replace(/[.,;:]$/,"")}…`;
}
```

Build themes from `radiance.topics`, territory from `territory.territories`, yaps from supplied topics then `ideaUniverse`, and superpower actions from `naturalStrengths`, pillar topics, and existing generated text. Do not invent achievements or personal facts.

- [ ] **Step 4: Add editable platform captions derived only from the pack**

```ts
export function captionFor(pack:SharePack,template:ShareTemplate,platform:SharePlatform,url:string){
  if(platform==="instagram") return `Apparently I’m ${pack.archetype} 👀\nWhat’s in your Content Universe?\n${url}`;
  if(platform==="x") return `Apparently my Content Brain thinks I’m “${pack.archetype}.”\n\nHonestly… pretty accurate.\n\nWhat’s yours? ${url}`;
  return `Apparently my Content Universe says I’m “${pack.archetype}.”\n\nMy strongest territory sits around ${pack.themes.join(", ")}.\n\nThe interesting part: I answered only four questions.\n\nCurious what yours looks like → ${url}`;
}
```

- [ ] **Step 5: Run the focused test**

Run: `npm test -- --run src/components/share/storyCardData.test.ts`

Expected: PASS.

---

### Task 2: Six responsive card templates

**Files:**
- Replace: `src/components/share/StoryCard.tsx`
- Modify: `src/styles/suchamojo-product.css`
- Create: `src/components/share/StoryCard.test.tsx`

**Interfaces:**
- Consumes: `SharePack`, `ShareTemplate`, and `ShareFormat` from `storyCardData.ts`.
- Produces: `ShareCardRenderer({data,template,format,interactive,onYap})` and `data-share-card` export root.

- [ ] **Step 1: Write a failing render test for all six templates**

```tsx
for (const template of shareTemplates) {
  const {unmount}=render(<ShareCardRenderer data={pack} template={template} format="story"/>);
  expect(screen.getByTestId(`share-card-${template}`)).toBeInTheDocument();
  unmount();
}
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- --run src/components/share/StoryCard.test.tsx`

Expected: FAIL because `ShareCardRenderer` does not exist.

- [ ] **Step 3: Implement common card chrome and six semantic bodies**

```tsx
<article data-share-card data-testid={`share-card-${template}`} className={`share-card share-card--${template} share-card--${format}`}>
  <header><span>{index} / 06</span><b>MY CONTENT UNIVERSE</b></header>
  <BrainOrbit variant={template}/>
  <CardBody data={data} template={template} interactive={interactive} onYap={onYap}/>
  <footer><span>Built with Content Brain</span><strong>What’s in yours?</strong></footer>
</article>
```

The interactive Yap template renders `Yap on this →` buttons only in preview mode. The export renderer passes `interactive={false}`, so the PNG remains static.

- [ ] **Step 4: Add aspect-specific CSS compositions**

Use CSS custom properties and three root modifier classes. Story stacks vertically, Post shortens vertical gaps and uses two-column fact blocks, Landscape uses a left statement/right diagram composition. Do not use `object-fit`, clipping, or a crop of the Story layout.

- [ ] **Step 5: Run the focused test**

Run: `npm test -- --run src/components/share/StoryCard.test.tsx`

Expected: PASS.

---

### Task 3: Exact-dimension PNG export

**Files:**
- Create: `src/lib/sharePackExport.ts`
- Create: `src/lib/sharePackExport.test.ts`

**Interfaces:**
- Consumes: an export root `HTMLElement`, `ShareFormat`, and filename.
- Produces: `renderShareCardPng(element,format): Promise<{dataUrl:string;blob:Blob;file:File}>`, `downloadRenderedCard(result,filename)`, and `downloadShareSet(cards): Promise<void>`.

- [ ] **Step 1: Write failing tests for exact output options**

```ts
expect(formatDimensions("story")).toEqual({width:1080,height:1920});
expect(formatDimensions("post")).toEqual({width:1080,height:1350});
expect(formatDimensions("landscape")).toEqual({width:1600,height:900});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- --run src/lib/sharePackExport.test.ts`

Expected: FAIL because the module is missing.

- [ ] **Step 3: Implement export after fonts load**

```ts
await document.fonts.ready;
const {toPng}=await import("html-to-image");
const dataUrl=await toPng(element,{width,height,canvasWidth:width,canvasHeight:height,pixelRatio:2,cacheBust:true});
const blob=await (await fetch(dataUrl)).blob();
return {dataUrl,blob,file:new File([blob],filename,{type:"image/png"})};
```

The hidden export root renders at native dimensions. `pixelRatio:2` meets the minimum quality rule while the CSS composition remains based on the requested logical dimensions.

- [ ] **Step 4: Implement single download and complete-set downloads**

For complete-set download, trigger six clearly named PNG downloads sequentially because no archive dependency is present: `content-universe-01-identity-story.png` through `content-universe-06-insight-story.png`.

- [ ] **Step 5: Run the focused test**

Run: `npm test -- --run src/lib/sharePackExport.test.ts`

Expected: PASS.

---

### Task 4: Carousel, format switcher, sharing, captions, and public link

**Files:**
- Replace: `src/components/share/StoryShareStudio.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/suchamojo-product.css`
- Create: `src/components/share/StoryShareStudio.test.tsx`

**Interfaces:**
- Consumes: `universe`, optional `yapTopics`, existing `onCreateShare`, `onNeedAccount`, and `onYap` callbacks.
- Produces: the complete `SHARE YOUR CONTENT UNIVERSE` section and all user actions.

- [ ] **Step 1: Write failing interaction tests**

```tsx
expect(screen.getAllByRole("button",{name:/identity|brain|yap|territory|superpower|insight/i})).toHaveLength(6);
await user.click(screen.getByRole("button",{name:"Post 4:5"}));
expect(screen.getByTestId("active-share-card")).toHaveClass("share-card--post");
await user.click(screen.getByRole("button",{name:"Next"}));
expect(screen.getByText("2 / 6")).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- --run src/components/share/StoryShareStudio.test.tsx`

Expected: FAIL because the current studio exposes at most three templates and one format.

- [ ] **Step 3: Implement scroll-snap carousel and selection controls**

Use a horizontally scrolling `.share-carousel` with `scroll-snap-type:x mandatory`, one slide per template, partial neighboring slides on desktop, full-width slides on mobile, arrow buttons, thumbnail buttons, keyboard ArrowLeft/ArrowRight support, and no autoplay. Update selection from `scroll` using the closest slide center.

- [ ] **Step 4: Implement one public-link creator for every card**

```ts
const ensureShareUrl=async()=>{
  if(shareUrl)return shareUrl;
  if(!onCreateShare){onNeedAccount?.();throw new Error("Create an account to make a public share link.");}
  const {slug}=await onCreateShare({...toShareableUniverse(universe),includeName:false});
  const url=new URL(`/u/${slug}`,location.origin).href;
  setShareUrl(url);
  return url;
};
```

Never copy `/universe/result`.

- [ ] **Step 5: Implement Share, Download, Download set, Copy link, and editable Copy caption**

Render an editable `<textarea>` seeded from `captionFor`. Share a PNG file plus public URL when Web Share files are supported. Otherwise download the PNG, copy the public URL, and state exactly what happened. Copy actions use the edited caption, not the original generated caption.

- [ ] **Step 6: Implement platform helpers honestly**

- Instagram: generate/download the active image, then use native file share if available.
- LinkedIn: native text+URL share when supported; otherwise copy the edited caption and URL.
- X: open `https://twitter.com/intent/tweet?text=...&url=...` in a new tab with `noopener,noreferrer`.

- [ ] **Step 7: Implement post-action utility CTA**

After successful share or download show `Nice. Now make something from it.` and a `WHAT SHOULD I YAP ABOUT? →` button. The button passes the selected topic to `onYap` when Card 03 is active; otherwise it uses the first grounded Yap topic.

- [ ] **Step 8: Wire result-page callbacks without changing workspace layout**

In `App.tsx`, pass the existing `createShare` callback to `StoryShareStudio`. For Yap handoff, store the selected topic in `sessionStorage` under `suchamojo:content-brain-prefill` and route to `/app`; do not modify the workspace in this task. This preserves the idea across the handoff without changing workspace UI.

- [ ] **Step 9: Run the focused test**

Run: `npm test -- --run src/components/share/StoryShareStudio.test.tsx`

Expected: PASS.

---

### Task 5: Analytics coverage

**Files:**
- Modify: `src/lib/analytics.ts`
- Modify: `src/components/share/StoryShareStudio.tsx`
- Modify: `src/lib/analytics.test.ts`

**Interfaces:**
- Consumes: existing `track(event,properties)`.
- Produces: accepted event names and consistent `{template,format,platform,shareId}` properties.

- [ ] **Step 1: Add the requested names to `AnalyticsEvent`**

```ts
| "share_section_viewed"
| "share_template_selected"
| "share_format_selected"
| "share_downloaded"
| "share_native_opened"
| "share_link_copied"
| "share_caption_copied"
| "yap_from_share_clicked"
```

- [ ] **Step 2: Track section visibility once with `IntersectionObserver`**

Fire `share_section_viewed` only the first time at least 40% of the section is visible. Template and format selection fire only for direct user choices, not initial render.

- [ ] **Step 3: Track action completion, not button intent**

`share_downloaded` fires after the download is triggered, `share_native_opened` immediately before `navigator.share`, clipboard events after `writeText` succeeds, and `yap_from_share_clicked` before the route handoff.

- [ ] **Step 4: Run analytics and share tests**

Run: `npm test -- --run src/lib/analytics.test.ts src/components/share/StoryShareStudio.test.tsx`

Expected: PASS.

---

### Task 6: Regression and visual QA

**Files:**
- Modify only files above if QA exposes a share-artifact defect.

**Interfaces:**
- Consumes: completed social pack.
- Produces: verified `/universe/result` share flow on desktop and mobile.

- [ ] **Step 1: Run the full automated suite**

Run: `npm test -- --run`

Expected: all tests pass, including existing onboarding, result, referral, and public-share tests.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: TypeScript and Vite build succeed. The existing large-chunk warning is acceptable; no new heavy dependency is added.

- [ ] **Step 3: Desktop visual audit at 1440×1100**

Verify centered active card, visible neighboring cards, all six thumbnails, arrow and keyboard navigation, Story/Post/Landscape re-composition, editable caption, and no changes above or below the share section.

- [ ] **Step 4: Mobile visual audit at 390×844**

Verify one card per swipe, snap behavior, readable controls, no horizontal page overflow, visible Story preview, and native-share fallback messaging.

- [ ] **Step 5: Export all formats and inspect pixels**

Verify Identity Story is 1080×1920, Yap Post is 1080×1350, Insight Landscape is 1600×900, text is not clipped, fonts are loaded, private answers are absent, and every card uses the same `/u/:shareId`.

- [ ] **Step 6: Verify final viral loop**

Create the public URL, download Card 03 Story, open its `/u/:shareId` in a logged-out browser, click `BUILD MINE`, and confirm the existing signup/onboarding flow starts with referral attribution intact.

---

## Self-review

- Spec coverage: six templates, carousel, three formats, export, complete-set download, native share/fallback, platform helpers, editable captions, one public URL, Yap handoff, analytics, and mobile QA are each assigned to a task.
- Scope: no backend, generation, landing, onboarding, or workspace-layout change is planned.
- Dependency check: existing `html-to-image` and CSS scroll snap are sufficient.
- Privacy check: share data comes from the already-safe `toShareableUniverse` fields plus generated public Universe fields; no answers, email, stories, or internal IDs enter the card.
