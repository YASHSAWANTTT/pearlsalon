import "server-only";

import { SALON_CONTACT, SALON_NAME, SALON_TAGLINE } from "@/lib/constants";

const CRIMSON = "#8E1B2E";
const CREAM = "#FCFBFA";
const WARM_WHITE = "#FFFFFF";
const BLUSH = "#F6F1EF";
const INK = "#17120F";
const MUTED = "#6E6662";
const BORDER = "#EBE4E1";

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "https://pearlsalon.vercel.app"
  );
}

export function emailLogoUrl() {
  return `${appUrl()}/pearl-logo.png`;
}

type DetailRow = { label: string; value: string };

type ClientEmailOptions = {
  title: string;
  greeting: string;
  message: string;
  details?: DetailRow[];
  signOff?: string;
  cta?: { href: string; label: string };
};

type BusinessEmailOptions = {
  title: string;
  subtitle?: string;
  details: DetailRow[];
};

function detailRows(rows: DetailRow[]) {
  return rows
    .map(
      (row) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:13px;color:${MUTED};width:110px;vertical-align:top">${row.label}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER};font-size:15px;color:${INK};font-weight:500;vertical-align:top">${row.value}</td>
    </tr>`
    )
    .join("");
}

function emailShell(content: string) {
  const logo = emailLogoUrl();
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${SALON_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:${BLUSH};font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BLUSH};padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${WARM_WHITE};border-radius:16px;overflow:hidden;border:1px solid ${BORDER};box-shadow:0 4px 24px rgba(23,18,15,0.06)">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(180deg,${CREAM} 0%,${WARM_WHITE} 100%);padding:32px 32px 24px;text-align:center;border-bottom:3px solid ${CRIMSON}">
              <img src="${logo}" alt="${SALON_NAME}" width="200" height="86" style="display:block;margin:0 auto 12px;max-width:200px;height:auto;border:0" />
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${CRIMSON};font-family:Georgia,serif">${SALON_TAGLINE}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 28px">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${CREAM};padding:24px 32px;border-top:1px solid ${BORDER};text-align:center">
              <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:${INK}">${SALON_NAME}</p>
              <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:${MUTED}">${SALON_CONTACT.address}</p>
              <p style="margin:0;font-size:13px;color:${MUTED}">
                <a href="tel:${SALON_CONTACT.phone}" style="color:${CRIMSON};text-decoration:none">${SALON_CONTACT.phoneDisplay}</a>
                &nbsp;&middot;&nbsp;
                <a href="${SALON_CONTACT.whatsappUrl}" style="color:${CRIMSON};text-decoration:none">WhatsApp us</a>
              </p>
              <p style="margin:16px 0 0;font-size:11px;color:#9A928E">&copy; ${year} ${SALON_NAME}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderClientEmail({
  title,
  greeting,
  message,
  details,
  signOff = "With warmth,<br>Pearl",
  cta,
}: ClientEmailOptions) {
  const detailsBlock = details?.length
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background-color:${CREAM};border-radius:12px;border:1px solid ${BORDER}">
        <tr>
          <td style="padding:4px 20px 8px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${detailRows(details)}
            </table>
          </td>
        </tr>
      </table>`
    : "";

  const ctaBlock = cta
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px">
        <tr>
          <td style="border-radius:999px;background-color:${CRIMSON}">
            <a href="${cta.href}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;font-family:Georgia,serif;letter-spacing:0.02em">${cta.label}</a>
          </td>
        </tr>
      </table>`
    : "";

  const html = emailShell(`
    <h1 style="margin:0 0 20px;font-size:26px;font-weight:400;line-height:1.3;color:${INK};font-family:Georgia,serif">${title}</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:${INK}">${greeting}</p>
    <p style="margin:0;font-size:16px;line-height:1.7;color:${MUTED}">${message}</p>
    ${detailsBlock}
    ${ctaBlock}
    <p style="margin:28px 0 0;font-size:15px;line-height:1.7;color:${INK};font-style:italic">${signOff}</p>
  `);

  return html;
}

export function renderBusinessEmail({ title, subtitle, details }: BusinessEmailOptions) {
  const html = emailShell(`
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${CRIMSON};font-weight:600">Team alert</p>
    <h1 style="margin:0 0 ${subtitle ? "8px" : "20px"};font-size:24px;font-weight:400;line-height:1.3;color:${INK};font-family:Georgia,serif">${title}</h1>
    ${subtitle ? `<p style="margin:0 0 20px;font-size:15px;color:${MUTED}">${subtitle}</p>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CREAM};border-radius:12px;border:1px solid ${BORDER}">
      <tr>
        <td style="padding:4px 20px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${detailRows(details)}
          </table>
        </td>
      </tr>
    </table>
  `);

  return html;
}

export function plainFooter() {
  return `\n\n— ${SALON_NAME}\n${SALON_CONTACT.address}\n${SALON_CONTACT.phoneDisplay}`;
}
