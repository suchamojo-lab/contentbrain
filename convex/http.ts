import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

const unsubscribePage = httpAction(async (_ctx, request) => {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const valid = token.length > 20;
  return new Response(
    `<!doctype html><html><head><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width"><title>Email preferences — Everything Content</title></head><body style="margin:0;background:#f4efe5;color:#101010;font-family:Arial,sans-serif"><main style="max-width:620px;margin:12vh auto;padding:32px"><p style="font-size:12px;letter-spacing:.14em;font-weight:700">EVERYTHING CONTENT</p><h1>${valid ? "Stop product follow-up emails?" : "That unsubscribe link isn’t valid."}</h1><p>${valid ? "You’ll still receive essential account and security emails." : "The link may be incomplete or expired."}</p>${valid ? `<form action="/email/unsubscribe?token=${encodeURIComponent(token)}" method="post"><button style="border:2px solid #101010;background:#f4cf3f;padding:14px 18px;font-weight:700;cursor:pointer">UNSUBSCRIBE</button></form>` : ""}<p style="margin-top:28px"><a href="https://everythingcontentbrain.vercel.app" style="color:#101010">Back to Everything Content →</a></p></main></body></html>`,
    {
      status: valid ? 200 : 404,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
});

const unsubscribeSubmit = httpAction(async (ctx, request) => {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const success = token
    ? await ctx.runMutation(internal.lifecycleEmails.unsubscribeByToken, {
        token,
      })
    : false;
  return new Response(
    `<!doctype html><html><head><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width"><title>Email preferences — Everything Content</title></head><body style="margin:0;background:#f4efe5;color:#101010;font-family:Arial,sans-serif"><main style="max-width:620px;margin:12vh auto;padding:32px"><p style="font-size:12px;letter-spacing:.14em;font-weight:700">EVERYTHING CONTENT</p><h1>${success ? "You’re unsubscribed." : "That unsubscribe link isn’t valid."}</h1><p>${success ? "We won’t send you product follow-up emails. Essential account and security emails can still arrive." : "The link may be incomplete or expired."}</p><a href="https://everythingcontentbrain.vercel.app" style="color:#101010">Back to Everything Content →</a></main></body></html>`,
    {
      status: success ? 200 : 404,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
});

http.route({ path: "/email/unsubscribe", method: "GET", handler: unsubscribePage });
http.route({ path: "/email/unsubscribe", method: "POST", handler: unsubscribeSubmit });

export default http;
