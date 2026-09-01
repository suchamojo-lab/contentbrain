import AuthResend from "@auth/core/providers/resend";
import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { Resend } from "resend";

export const ResendOTPPasswordReset = AuthResend({
  id: "resend-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        bytes.set(crypto.getRandomValues(new Uint8Array(bytes.length)));
      },
    };
    return generateRandomString(random, "0123456789", 8);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new Resend(provider.apiKey);
    const { error } = await resend.emails.send({
      from:
        process.env.AUTH_EMAIL_FROM ??
        "Everything Content <onboarding@resend.dev>",
      to: email,
      subject: "Reset your Everything Content password",
      text: [
        "Your password reset code is:",
        "",
        token,
        "",
        "This code expires soon. If you did not request it, you can ignore this email.",
      ].join("\n"),
    });

    if (error) throw new Error("Could not send password reset email");
  },
});
