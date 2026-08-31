import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const brainTool = v.union(
  v.literal("idea"), v.literal("stronger"), v.literal("hook"),
  v.literal("story"), v.literal("plan"), v.literal("script"), v.literal("ask"),
);

export const save = internalMutation({
  args: { userId: v.id("users"), tool: brainTool, input: v.string(), title: v.string(), resultJson: v.string() },
  returns: v.id("brainGenerations"),
  handler: async (ctx, args) => ctx.db.insert("brainGenerations", { ...args, createdAt: Date.now() }),
});

export const recent = query({
  args: {},
  returns: v.array(v.object({
    id: v.id("brainGenerations"), tool: brainTool, input: v.string(), title: v.string(), resultJson: v.string(), createdAt: v.number(),
  })),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const rows = await ctx.db.query("brainGenerations").withIndex("by_userId_and_createdAt", (q) => q.eq("userId", userId)).order("desc").take(12);
    return rows.map((row) => ({ id: row._id, tool: row.tool, input: row.input, title: row.title, resultJson: row.resultJson, createdAt: row.createdAt }));
  },
});
