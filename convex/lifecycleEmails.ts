import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const claimUniverseComplete = internalMutation({
  args: {
    userId: v.id("users"),
    universeId: v.id("contentUniverses"),
    unsubscribeToken: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      deliveryId: v.id("lifecycleEmails"),
      email: v.string(),
      firstName: v.union(v.string(), v.null()),
      unsubscribeToken: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const existingDelivery = await ctx.db
      .query("lifecycleEmails")
      .withIndex("by_userId_and_kind", (q) =>
        q.eq("userId", args.userId).eq("kind", "universe_completed"),
      )
      .unique();
    if (existingDelivery) return null;

    const user = await ctx.db.get(args.userId);
    if (!user?.email) return null;

    const normalizedEmail = user.email.trim().toLowerCase();
    const existingPreference = await ctx.db
      .query("emailPreferences")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existingPreference?.unsubscribedAt) return null;

    let unsubscribeToken = existingPreference?.unsubscribeToken;
    if (existingPreference) {
      await ctx.db.patch(existingPreference._id, {
        email: normalizedEmail,
        updatedAt: Date.now(),
      });
    } else {
      unsubscribeToken = args.unsubscribeToken;
      await ctx.db.insert("emailPreferences", {
        userId: args.userId,
        email: normalizedEmail,
        unsubscribeToken,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    const deliveryId = await ctx.db.insert("lifecycleEmails", {
      userId: args.userId,
      universeId: args.universeId,
      kind: "universe_completed",
      status: "sending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const firstName = user.name?.trim().split(/\s+/)[0] || null;
    return {
      deliveryId,
      email: normalizedEmail,
      firstName,
      unsubscribeToken: unsubscribeToken!,
    };
  },
});

export const finishDelivery = internalMutation({
  args: {
    deliveryId: v.id("lifecycleEmails"),
    status: v.union(v.literal("sent"), v.literal("failed")),
    providerId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const delivery = await ctx.db.get(args.deliveryId);
    if (!delivery) return null;
    await ctx.db.patch(args.deliveryId, {
      status: args.status,
      providerId: args.providerId,
      error: args.error,
      sentAt: args.status === "sent" ? Date.now() : undefined,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const unsubscribeByToken = internalMutation({
  args: { token: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const preference = await ctx.db
      .query("emailPreferences")
      .withIndex("by_unsubscribeToken", (q) =>
        q.eq("unsubscribeToken", args.token),
      )
      .unique();
    if (!preference) return false;
    if (!preference.unsubscribedAt) {
      await ctx.db.patch(preference._id, {
        unsubscribedAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    return true;
  },
});
