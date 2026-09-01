"use node";

import { Resend } from "resend";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { universeCompleteEmail } from "./universeCompleteEmailContent";

export const sendUniverseComplete = internalAction({
  args: {
    userId: v.id("users"),
    universeId: v.id("contentUniverses"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const claimed = await ctx.runMutation(
      internal.lifecycleEmails.claimUniverseComplete,
      { ...args, unsubscribeToken: crypto.randomUUID() },
    );
    if (!claimed) return null;

    try {
      const siteUrl = process.env.CONVEX_SITE_URL;
      const apiKey = process.env.AUTH_RESEND_KEY;
      if (!siteUrl || !apiKey) throw new Error("Email service is not configured");
      const unsubscribeUrl = `${siteUrl}/email/unsubscribe?token=${encodeURIComponent(claimed.unsubscribeToken)}`;
      const email = universeCompleteEmail({
        firstName: claimed.firstName,
        unsubscribeUrl,
      });
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from:
          process.env.AUTH_EMAIL_FROM ??
          "Everything Content <onboarding@resend.dev>",
        to: claimed.email,
        subject: email.subject,
        html: email.html,
        text: email.text,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      if (error) throw new Error(error.message);
      await ctx.runMutation(internal.lifecycleEmails.finishDelivery, {
        deliveryId: claimed.deliveryId,
        status: "sent",
        providerId: data?.id,
      });
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Unknown email error";
      await ctx.runMutation(internal.lifecycleEmails.finishDelivery, {
        deliveryId: claimed.deliveryId,
        status: "failed",
        error: message.slice(0, 500),
      });
      throw cause;
    }
    return null;
  },
});
