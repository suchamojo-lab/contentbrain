import { describe, expect, it } from "vitest";
import { universeCompleteEmail } from "./universeCompleteEmailContent";

describe("universeCompleteEmail", () => {
  it("includes the approved links and one primary button", () => {
    const email = universeCompleteEmail({
      firstName: "Shubham",
      unsubscribeUrl: "https://example.com/unsubscribe?token=test",
    });

    expect(email.subject).toBe(
      "Shubham, what’s actually stopping you from creating?",
    );
    expect(email.html).toContain("WHAT SHOULD I YAP ABOUT? →");
    expect(email.html).toContain("https://suchamojo.com/topics");
    expect(email.html).toContain("https://topmate.io/");
    expect(email.html).toContain("Unsubscribe from product emails");
    expect(email.html.match(/display:inline-block/g)).toHaveLength(1);
  });

  it("escapes names before adding them to HTML", () => {
    const email = universeCompleteEmail({
      firstName: "<Shubham>",
      unsubscribeUrl: "https://example.com/unsubscribe",
    });
    expect(email.html).toContain("Hi &lt;Shubham&gt;,");
    expect(email.html).not.toContain("Hi <Shubham>,");
  });
});
