"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { createGeminiProvider } from "./ai/gemini";

const names = [
  "THE IDEA TRANSLATOR",
  "THE STORY-LED CREATOR",
  "THE POINT-OF-VIEW CREATOR",
  "THE CURIOUS EXPLORER",
  "THE TEACHER",
  "THE CONVERSATION CREATOR",
  "THE SYSTEMS CREATOR",
  "THE OPERATOR",
  "THE CONNECTOR",
  "THE TASTE-MAKER",
] as const;
const resultValidator = v.object({
  creatorType: v.union(...names.map((name) => v.literal(name))),
  whyYou: v.string(),
  whyYouShouldCreate: v.string(),
  createMore: v.array(v.string()),
  watchOutFor: v.string(),
  signatureStrength: v.string(),
});
const safe = (value: string, limit: number) =>
  value.trim().replace(/\s+/g, " ").slice(0, limit);
const defaults: Record<
  (typeof names)[number],
  {
    whyYouShouldCreate: string;
    createMore: [string, string, string, string];
    watchOutFor: string;
    signatureStrength: string;
  }
> = {
  "THE IDEA TRANSLATOR": {
    whyYouShouldCreate: "People need someone who can make information useful.",
    createMore: [
      "Explainers",
      "Frameworks",
      "Breakdowns",
      "Talking-head videos",
    ],
    watchOutFor: "Over-explaining before the point.",
    signatureStrength: "Turning complexity into clarity.",
  },
  "THE STORY-LED CREATOR": {
    whyYouShouldCreate:
      "People remember the lesson when they can feel the moment.",
    createMore: [
      "Personal stories",
      "Scene-led lessons",
      "Origin posts",
      "Narrative videos",
    ],
    watchOutFor: "Burying the lesson inside the story.",
    signatureStrength: "Making useful ideas human.",
  },
  "THE POINT-OF-VIEW CREATOR": {
    whyYouShouldCreate: "People need a view they can react to.",
    createMore: [
      "Hot takes",
      "Belief essays",
      "Commentary",
      "Contrarian posts",
    ],
    watchOutFor: "Provoking without a useful argument.",
    signatureStrength: "Finding the sharper angle.",
  },
  "THE CURIOUS EXPLORER": {
    whyYouShouldCreate:
      "Your curiosity helps others explore ideas before they are obvious.",
    createMore: [
      "Rabbit holes",
      "Field notes",
      "Trend explorations",
      "Learning logs",
    ],
    watchOutFor: "Leaving before the useful finding.",
    signatureStrength: "Finding paths others miss.",
  },
  "THE TEACHER": {
    whyYouShouldCreate:
      "Your explanation may be what helps someone finally act.",
    createMore: [
      "How-to posts",
      "Lessons",
      "Visual guides",
      "Step-by-step videos",
    ],
    watchOutFor: "Teaching the whole syllabus at once.",
    signatureStrength: "Making progress feel possible.",
  },
  "THE CONVERSATION CREATOR": {
    whyYouShouldCreate:
      "Your thinking comes alive when another voice pushes it forward.",
    createMore: ["Interviews", "Q&As", "Reaction posts", "Live discussions"],
    watchOutFor: "Hiding your own view.",
    signatureStrength: "Turning exchange into insight.",
  },
  "THE SYSTEMS CREATOR": {
    whyYouShouldCreate: "People want the process behind the result.",
    createMore: ["Workflows", "Templates", "Process maps", "System breakdowns"],
    watchOutFor: "Perfecting systems instead of using them.",
    signatureStrength: "Making work repeatable.",
  },
  "THE OPERATOR": {
    whyYouShouldCreate:
      "Your proximity to real decisions gives the work weight.",
    createMore: [
      "Build logs",
      "Case studies",
      "Decision notes",
      "Practical playbooks",
    ],
    watchOutFor: "Assuming the lesson is obvious.",
    signatureStrength: "Turning execution into evidence.",
  },
  "THE CONNECTOR": {
    whyYouShouldCreate: "Your value appears in the relationship between ideas.",
    createMore: [
      "Intersection posts",
      "Pattern maps",
      "Introductions",
      "Cross-industry lessons",
    ],
    watchOutFor: "Losing the central point.",
    signatureStrength: "Seeing the link first.",
  },
  "THE TASTE-MAKER": {
    whyYouShouldCreate:
      "Careful selection is useful in a world of endless options.",
    createMore: [
      "Curated lists",
      "Reviews",
      "Reference breakdowns",
      "What-to-ignore posts",
    ],
    watchOutFor: "Letting standards stop you sharing.",
    signatureStrength: "Knowing what is worth keeping.",
  },
};
const signals: Record<(typeof names)[number], string[]> = {
  "THE IDEA TRANSLATOR": ["explain", "clarity", "complex", "simplify"],
  "THE STORY-LED CREATOR": ["story", "journey", "memory", "experience"],
  "THE POINT-OF-VIEW CREATOR": ["opinion", "belief", "contrarian", "disagree"],
  "THE CURIOUS EXPLORER": ["curious", "explore", "rabbit", "research"],
  "THE TEACHER": ["teach", "guide", "lesson", "how to"],
  "THE CONVERSATION CREATOR": [
    "conversation",
    "interview",
    "discussion",
    "podcast",
  ],
  "THE SYSTEMS CREATOR": ["system", "process", "workflow", "template"],
  "THE OPERATOR": ["build", "operate", "execute", "decision"],
  "THE CONNECTOR": ["connect", "intersection", "link", "overlap"],
  "THE TASTE-MAKER": ["taste", "curate", "select", "review"],
};
function fallback(context: string) {
  const lower = context.toLowerCase();
  const creatorType = names
    .map((name, index) => ({
      name,
      index,
      score: signals[name].reduce(
        (score, word) => score + lower.split(word).length - 1,
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0].name;
  return {
    creatorType,
    whyYou: `Your saved Content Universe repeatedly shows that you ${defaults[creatorType].signatureStrength.toLowerCase()}`,
    ...defaults[creatorType],
  };
}
export const classify = action({
  args: {
    universeId: v.id("contentUniverses"),
    recalculate: v.optional(v.boolean()),
  },
  returns: resultValidator,
  handler: async (
    ctx,
    args,
  ): Promise<{
    creatorType: (typeof names)[number];
    whyYou: string;
    whyYouShouldCreate: string;
    createMore: string[];
    watchOutFor: string;
    signatureStrength: string;
  }> => {
    const saved: {
      context: string;
      cached: null | {
        creatorType: string;
        whyYou: string;
        whyYouShouldCreate: string;
        createMore: string[];
        watchOutFor: string;
        signatureStrength: string;
      };
    } | null = await ctx.runQuery(internal.creatorTypeData.readOwnedContext, {
      universeId: args.universeId as Id<"contentUniverses">,
    });
    if (!saved) throw new Error("Content Universe not found.");
    if (
      saved.cached &&
      !args.recalculate &&
      names.includes(saved.cached.creatorType as (typeof names)[number])
    )
      return saved.cached as {
        creatorType: (typeof names)[number];
        whyYou: string;
        whyYouShouldCreate: string;
        createMore: string[];
        watchOutFor: string;
        signatureStrength: string;
      };
    let result;
    try {
      result = await createGeminiProvider().generateCreatorType(saved.context);
    } catch {
      result = fallback(saved.context);
    }
    if (!names.includes(result.creatorType as (typeof names)[number]))
      result = fallback(saved.context);
    const clean = {
      creatorType: result.creatorType as (typeof names)[number],
      whyYou: safe(result.whyYou, 240),
      whyYouShouldCreate: safe(result.whyYouShouldCreate, 220),
      createMore: result.createMore.slice(0, 4).map((item) => safe(item, 50)),
      watchOutFor: safe(result.watchOutFor, 160),
      signatureStrength: safe(result.signatureStrength, 120),
    };
    await ctx.runMutation(internal.creatorTypeData.saveCreatorType, {
      universeId: args.universeId,
      result: clean,
    });
    return clean;
  },
});
