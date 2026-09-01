export function authErrorMessage(cause: unknown) {
  const fallback = "We couldn't sign you in. Please try again.";
  if (!(cause instanceof Error)) return fallback;

  const message = cause.message;
  if (
    message.includes("Invalid credentials") ||
    message.includes("InvalidSecret")
  ) {
    return "That email or password doesn’t match.";
  }

  if (
    message.includes("Could not verify code") ||
    message.includes("Invalid code")
  ) {
    return "That reset code is incorrect or has expired.";
  }

  return message || fallback;
}
