/** Normalize to E.164 with leading + (e.g. +919876543210). */
export function normalizePhoneE164(
  raw: string,
  countryCode = "91"
): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  digits = digits.replace(/^0+/, "");
  if (digits.length === 10) {
    digits = `${countryCode}${digits}`;
  }
  return digits ? `+${digits}` : null;
}
