import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";

export const yapTopic = v.object({
  topic: v.string(),
  whyYou: v.string(),
  openingLine: v.string(),
  bestFormat: v.string(),
  source: v.string(),
});

const publicYapTopic = v.object({
  id: v.id("yapTopics"),
  ...yapTopic.fields,
  saved: v.boolean(),
  createdAt: v.number(),
});

export const previousTopics = internalQuery({
  args: { userId: v.id("users") },
  returns: v.array(v.string()),
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("yapTopics").withIndex("by_userId_and_createdAt", (q) => q.eq("userId", args.userId)).order("desc").take(100);
    return rows.map((row) => row.topic);
  },
});

export const saveBatch = internalMutation({
  args: { userId: v.id("users"), batchId: v.string(), topics: v.array(yapTopic) },
  returns: v.array(v.id("yapTopics")),
  handler: async (ctx, args) => {
    const now = Date.now();
    return await Promise.all(args.topics.map((topic) => ctx.db.insert("yapTopics", { userId: args.userId, batchId: args.batchId, ...topic, saved: false, createdAt: now })));
  },
});

export const latest = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(publicYapTopic),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const limit = Math.max(1, Math.min(args.limit ?? 10, 20));
    const rows = await ctx.db.query("yapTopics").withIndex("by_userId_and_createdAt", (q) => q.eq("userId", userId)).order("desc").take(limit);
    return rows.map(({ _id, topic, whyYou, openingLine, bestFormat, source, saved, createdAt }) => ({ id: _id, topic, whyYou, openingLine, bestFormat, source, saved, createdAt }));
  },
});

export const setSaved = mutation({
  args: { id: v.id("yapTopics"), saved: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("You need to sign in first");
    const row = await ctx.db.get(args.id);
    if (!row || row.userId !== userId) throw new Error("Yap topic not found");
    await ctx.db.patch(args.id, { saved: args.saved });
    return null;
  },
});
