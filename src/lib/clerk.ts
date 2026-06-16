/** Origins allowed to use Clerk session cookies (production security). */
export function getClerkAuthorizedParties(): string[] {
  const parties = new Set([
    "https://www.trypearlbeauty.com",
    "https://trypearlbeauty.com",
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (appUrl) parties.add(appUrl);

  if (process.env.NODE_ENV === "development") {
    parties.add("http://localhost:3000");
  }

  return [...parties];
}
