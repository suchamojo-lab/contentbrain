import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const publicUniverse = v.object({
  slug: v.string(),
  displayName: v.union(v.string(), v.null()),
  archetype: v.string(),
  superpower: v.string(),
  territory: v.array(v.string()),
  positioning: v.string(),
  pillars: v.array(v.string()),
  insight: v.string(),
  creatorType:v.optional(v.object({creatorType:v.string(),whyYou:v.string(),whyYouShouldCreate:v.string(),createMore:v.array(v.string()),watchOutFor:v.string(),signatureStrength:v.string()})),
});

const publicFields = {
  archetype: v.string(),
  superpower: v.string(),
  territory: v.array(v.string()),
  positioning: v.string(),
  pillars: v.array(v.string()),
  insight: v.string(),
  creatorType:v.optional(v.object({creatorType:v.string(),whyYou:v.string(),whyYouShouldCreate:v.string(),createMore:v.array(v.string()),watchOutFor:v.string(),signatureStrength:v.string()})),
};

const safe = (value:string, limit:number) => value.trim().replace(/\s+/g," ").slice(0,limit);

export const createOrUpdate = mutation({
  args: {
    universeId: v.id("contentUniverses"),
    includeName: v.boolean(),
    ...publicFields,
  },
  returns: v.object({ slug: v.string() }),
  handler: async (ctx, args) => {
    const ownerId = await getAuthUserId(ctx);
    if (!ownerId) throw new Error("Sign in to share your Content Universe.");
    const universe = await ctx.db.get(args.universeId);
    if (!universe || universe.userId !== ownerId) throw new Error("Content Universe not found.");
    const user = await ctx.db.get(ownerId);
    const displayName = args.includeName && user?.name ? safe(user.name.split(/\s+/)[0],40) : undefined;
    const fields = {
      displayName,
      archetype: safe(args.archetype,70),
      superpower: safe(args.superpower,160),
      territory: args.territory.slice(0,4).map((item)=>safe(item,50)),
      positioning: safe(args.positioning,220),
      pillars: args.pillars.slice(0,3).map((item)=>safe(item,50)),
      insight: safe(args.insight,240),
      creatorType:args.creatorType?{creatorType:safe(args.creatorType.creatorType,60),whyYou:safe(args.creatorType.whyYou,240),whyYouShouldCreate:safe(args.creatorType.whyYouShouldCreate,220),createMore:args.creatorType.createMore.slice(0,4).map(item=>safe(item,50)),watchOutFor:safe(args.creatorType.watchOutFor,160),signatureStrength:safe(args.creatorType.signatureStrength,120)}:undefined,
      confirmed: true,
      updatedAt: Date.now(),
    };
    const existing = await ctx.db.query("universeShares").withIndex("by_ownerId_and_universeId",(q)=>q.eq("ownerId",ownerId).eq("universeId",args.universeId)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { slug: existing.slug };
    }
    const slug = crypto.randomUUID().replaceAll("-","").slice(0,16);
    await ctx.db.insert("universeShares", {ownerId,universeId:args.universeId,slug,...fields,createdAt:Date.now()});
    return { slug };
  },
});

export const getPublic = query({
  args: { slug: v.string() },
  returns: v.union(v.null(), publicUniverse),
  handler: async (ctx,args) => {
    const row = await ctx.db.query("universeShares").withIndex("by_slug",(q)=>q.eq("slug",args.slug)).unique();
    if (!row || !row.confirmed) return null;
    return {slug:row.slug,displayName:row.displayName??null,archetype:row.archetype,superpower:row.superpower,territory:row.territory,positioning:row.positioning,pillars:row.pillars,insight:row.insight,creatorType:row.creatorType};
  },
});
