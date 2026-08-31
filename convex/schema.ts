import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const compassAnswers = v.object({
  character: v.optional(v.string()),
  gifts: v.optional(v.string()),
  expertise: v.optional(v.string()),
  obsessions: v.optional(v.string()),
  opinions: v.optional(v.string()),
  audience: v.optional(v.string()),
  expression: v.optional(v.string()),
  positioning: v.optional(v.string()),
  radiance: v.optional(v.string()),
});

const contentUniverse = v.object({
  thesis: v.optional(v.string()),
  positioning: v.string(),
  audience: v.string(),
  pillars: v.array(v.string()),
  themes: v.array(v.string()),
  stories: v.array(v.string()),
  expertise: v.optional(v.array(v.string())),
  obsessions: v.optional(v.array(v.string())),
  formats: v.array(v.string()),
  voice: v.optional(v.array(v.string())),
  ideas: v.optional(v.array(v.string())),
});
const activationUniverse = v.object({
  characterSummary: v.string(),
  naturalStrengths: v.array(v.string()),
  obsessions: v.array(v.string()),
  contentTerritories: v.array(
    v.object({ title: v.string(), description: v.string() }),
  ),
  expressionProfile: v.string(),
  positioning: v.string(),
  contentPillars: v.array(
    v.object({
      title: v.string(),
      description: v.string(),
      exampleTopics: v.array(v.string()),
    }),
  ),
  starterIdeas: v.array(v.object({ title: v.string(), angle: v.string() })),
});
const activationUniverseV1 = v.object({
  character: v.object({
    summary: v.string(),
    identitySignals: v.array(v.string()),
    characterTraits: v.array(v.string()),
    coreMotive: v.string(),
  }),
  gifts: v.object({
    naturalStrengths: v.array(v.string()),
    superpower: v.string(),
  }),
  radiance: v.object({
    topics: v.array(v.string()),
    interestingIntersections: v.array(
      v.object({ title: v.string(), insight: v.string() }),
    ),
  }),
  expression: v.object({
    profile: v.string(),
    bestFormats: v.array(v.string()),
    lessNaturalFormats: v.array(v.string()),
  }),
  territory: v.object({
    archetype: v.string(),
    positioning: v.string(),
    territories: v.array(
      v.object({ title: v.string(), description: v.string() }),
    ),
  }),
  contentPillars: v.array(
    v.object({
      title: v.string(),
      why: v.string(),
      topics: v.array(v.string()),
    }),
  ),
  storyBank: v.array(
    v.object({
      title: v.string(),
      source: v.string(),
      lesson: v.string(),
      potentialHook: v.string(),
    }),
  ),
  ideaUniverse: v.array(
    v.object({ pillar: v.string(), ideas: v.array(v.string()) }),
  ),
});

export default defineSchema({
  ...authTables,
  creatorProfiles: defineTable({
    userId: v.id("users"),
    linkedinUrl: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    bio: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  contentBrainProfiles: defineTable({
    userId: v.id("users"),
    universeId: v.id("contentUniverses"),
    creatorType: v.optional(
      v.object({
        creatorType: v.string(),
        whyYou: v.string(),
        whyYouShouldCreate: v.string(),
        createMore: v.array(v.string()),
        watchOutFor: v.string(),
        signatureStrength: v.string(),
      }),
    ),
    creatorTypeGeneratedAt: v.optional(v.number()),
    brainViewFeedback: v.optional(
      v.union(v.literal("confirmed"), v.literal("needs_edit")),
    ),
    brainInsightFeedback: v.optional(
      v.union(v.literal("true"), v.literal("not_really")),
    ),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_universeId", ["userId", "universeId"]),

  onboardingAnswers: defineTable({
    userId: v.optional(v.id("users")),
    guestSessionId: v.optional(v.string()),
    questionKey: v.string(),
    module: v.string(),
    answer: v.string(),
    skipped: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_questionKey", ["userId", "questionKey"])
    .index("by_guestSessionId", ["guestSessionId"])
    .index("by_guestSessionId_and_questionKey", [
      "guestSessionId",
      "questionKey",
    ]),

  contentUniverses: defineTable({
    clientId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    answers: compassAnswers,
    universe: contentUniverse,
    activationUniverse: v.optional(activationUniverse),
    activationUniverseV1: v.optional(activationUniverseV1),
    answersHash: v.optional(v.string()),
    aiModel: v.optional(v.string()),
    aiSchemaVersion: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clientId", ["clientId"])
    .index("by_userId", ["userId"]),

  universeShares: defineTable({
    ownerId: v.id("users"),
    universeId: v.id("contentUniverses"),
    slug: v.string(),
    displayName: v.optional(v.string()),
    archetype: v.string(),
    superpower: v.string(),
    territory: v.array(v.string()),
    positioning: v.string(),
    pillars: v.array(v.string()),
    insight: v.string(),
    creatorType: v.optional(
      v.object({
        creatorType: v.string(),
        whyYou: v.string(),
        whyYouShouldCreate: v.string(),
        createMore: v.array(v.string()),
        watchOutFor: v.string(),
        signatureStrength: v.string(),
      }),
    ),
    confirmed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_ownerId_and_universeId", ["ownerId", "universeId"]),

  ideas: defineTable({
    clientId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    universeId: v.id("contentUniverses"),
    text: v.string(),
    submittedAt: v.number(),
  })
    .index("by_clientId", ["clientId"])
    .index("by_userId", ["userId"]),

  lockedDirections: defineTable({
    clientId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    universeId: v.id("contentUniverses"),
    ideaId: v.id("ideas"),
    topic: v.string(),
    angle: v.string(),
    hook: v.string(),
    format: v.string(),
    direction: v.array(v.string()),
    lockedAt: v.number(),
  })
    .index("by_clientId", ["clientId"])
    .index("by_userId", ["userId"]),

  captures: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("Note"),
      v.literal("Story"),
      v.literal("Question"),
      v.literal("Link"),
      v.literal("Observation"),
      v.literal("Customer insight"),
    ),
    originalText: v.string(),
    status: v.union(
      v.literal("unprocessed"),
      v.literal("processed"),
      v.literal("archived"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId_and_status", ["userId", "status"])
    .index("by_userId_and_createdAt", ["userId", "createdAt"]),

  libraryItems: defineTable({
    userId: v.id("users"),
    captureId: v.optional(v.id("captures")),
    type: v.union(
      v.literal("Note"),
      v.literal("Story"),
      v.literal("Question"),
      v.literal("Link"),
      v.literal("Observation"),
      v.literal("Customer insight"),
    ),
    title: v.string(),
    body: v.string(),
    tags: v.array(v.string()),
    favourite: v.boolean(),
    archived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId_and_archived", ["userId", "archived"])
    .index("by_userId_and_type", ["userId", "type"])
    .searchIndex("search_title_and_body", {
      searchField: "body",
      filterFields: ["userId", "archived"],
    }),

  drafts: defineTable({
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    format: v.string(),
    platform: v.string(),
    status: v.union(
      v.literal("idea"),
      v.literal("outline"),
      v.literal("drafting"),
      v.literal("review"),
      v.literal("ready"),
      v.literal("published"),
    ),
    archived: v.boolean(),
    scheduledFor: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId_and_archived", ["userId", "archived"])
    .index("by_userId_and_status", ["userId", "status"]),

  sourceReferences: defineTable({
    userId: v.id("users"),
    draftId: v.id("drafts"),
    libraryItemId: v.id("libraryItems"),
    reason: v.string(),
    createdAt: v.number(),
  })
    .index("by_draftId", ["draftId"])
    .index("by_libraryItemId", ["libraryItemId"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_userId_and_createdAt", ["userId", "createdAt"]),

  brainGenerations: defineTable({
    userId: v.id("users"),
    tool: v.union(
      v.literal("idea"),
      v.literal("stronger"),
      v.literal("hook"),
      v.literal("story"),
      v.literal("plan"),
      v.literal("script"),
      v.literal("ask"),
    ),
    input: v.string(),
    title: v.string(),
    resultJson: v.string(),
    createdAt: v.number(),
  }).index("by_userId_and_createdAt", ["userId", "createdAt"]),

  yapTopics: defineTable({
    userId: v.id("users"),
    batchId: v.string(),
    topic: v.string(),
    whyYou: v.string(),
    openingLine: v.string(),
    bestFormat: v.string(),
    source: v.string(),
    saved: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId_and_createdAt", ["userId", "createdAt"])
    .index("by_userId_and_saved", ["userId", "saved"]),
});
