const SITE_URL = "https://everythingcontentbrain.vercel.app";
const COMMUNITY_URL = "https://suchamojo.com/topics";
const WORK_WITH_US_URL =
  "https://topmate.io/shubham_gupta152/page/ESZPIfqqJw";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character]!,
  );
}

export function universeCompleteEmail({
  firstName,
  unsubscribeUrl,
}: {
  firstName: string | null;
  unsubscribeUrl: string;
}) {
  const safeName = firstName ? escapeHtml(firstName) : null;
  const greeting = safeName ? `Hi ${safeName},` : "Hi there,";
  const subject = firstName
    ? `${firstName}, what’s actually stopping you from creating?`
    : "What’s actually stopping you from creating?";
  const yapUrl = `${SITE_URL}/app`;
  const friction = [
    "You don’t know what to talk about",
    "You have ideas, but can’t find the angle",
    "You overthink the hook",
    "You know what to say, but don’t feel like recording",
    "You have too many ideas and no system",
    "You keep starting from zero",
    "You’re not sure what you should become known for",
  ];

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4efe5;color:#101010;font-family:Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">Your Content Brain knows the first layer. Now find what is getting in your way.</div>
    <main style="max-width:620px;margin:0 auto;padding:40px 24px 56px;">
      <p style="font-size:12px;letter-spacing:.14em;font-weight:700;">EVERYTHING CONTENT</p>
      <h1 style="font-size:32px;line-height:1.1;margin:28px 0 24px;">What’s actually stopping you from creating?</h1>
      <p>${greeting}</p>
      <p>Your Content Brain has started learning how you think.</p>
      <p>Now for the more useful question:</p>
      <p><strong>What is actually stopping you from creating consistently?</strong></p>
      <p>Maybe:</p>
      <ul style="padding-left:22px;line-height:1.65;">
        ${friction.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <p>Your Content Universe gives your Brain the first layer. The next step is turning what it knows about you into something worth creating.</p>
      <p style="margin:32px 0;">
        <a href="${yapUrl}" style="display:inline-block;background:#f4cf3f;color:#101010;border:2px solid #101010;padding:16px 20px;font-size:13px;font-weight:700;letter-spacing:.08em;text-decoration:none;">WHAT SHOULD I YAP ABOUT? →</a>
      </p>
      <p>Your Brain will use your stories, interests, expertise, and point of view to find ideas that actually sound like you.</p>
      <p style="margin-top:32px;">If you get stuck and want humans around the process, <a href="${COMMUNITY_URL}" style="color:#101010;">join the community</a>.</p>
      <p>If you want deeper help with positioning, storytelling, or your content system, <a href="${WORK_WITH_US_URL}" style="color:#101010;">work with us</a>.</p>
      <p style="margin-top:32px;">Shubham<br />Everything Content</p>
      <p style="margin-top:32px;font-size:13px;color:#555;">P.S. You don’t need more generic content advice. You need a clearer way through the specific thing getting in your way.</p>
      <p style="margin-top:40px;font-size:11px;color:#777;">You received this because you completed your Content Universe. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#777;">Unsubscribe from product emails</a>.</p>
    </main>
  </body>
</html>`;

  const text = `${firstName ? `Hi ${firstName},` : "Hi there,"}

Your Content Brain has started learning how you think.

Now for the more useful question:

What is actually stopping you from creating consistently?

Maybe:

${friction.map((item) => `• ${item}`).join("\n")}

Your Content Universe gives your Brain the first layer. The next step is turning what it knows about you into something worth creating.

WHAT SHOULD I YAP ABOUT?
${yapUrl}

Your Brain will use your stories, interests, expertise, and point of view to find ideas that actually sound like you.

If you get stuck and want humans around the process, join the community:
${COMMUNITY_URL}

If you want deeper help with positioning, storytelling, or your content system, work with us:
${WORK_WITH_US_URL}

Shubham
Everything Content

P.S. You don’t need more generic content advice. You need a clearer way through the specific thing getting in your way.

Unsubscribe from product emails:
${unsubscribeUrl}`;

  return { subject, html, text };
}
