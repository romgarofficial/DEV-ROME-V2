function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dev-rome.com").replace(/\/$/, "");
}

export function contactEmailSubject(name: string) {
  const who = name.trim().toUpperCase() || "SOMEONE";
  return `DEVELOPER PORTFOLIO - Message from ${who}`;
}

export function contactEmailText(input: { name: string; email: string; message: string }) {
  return [
    "ROME · Developer portfolio",
    "",
    `From: ${input.name}`,
    `Email: ${input.email}`,
    "",
    input.message,
    "",
    siteUrl(),
  ].join("\n");
}

export function contactEmailHtml(input: { name: string; email: string; message: string }) {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const message = escapeHtml(input.message).replaceAll("\n", "<br />");
  const site = siteUrl();
  const year = new Date().getUTCFullYear();
  const mailto = `mailto:${encodeURIComponent(input.email)}?subject=${encodeURIComponent(`Re: ${contactEmailSubject(input.name)}`)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
  <title>${escapeHtml(contactEmailSubject(input.name))}</title>
</head>
<body style="margin:0;padding:0;background:#0b0b10;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b10;margin:0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#f4f0ea;border-radius:28px;overflow:hidden;">
          <tr>
            <td style="background:#121214;padding:28px 32px 24px;">
              <p style="margin:0;font-family:Syne,Arial Black,sans-serif;font-size:22px;letter-spacing:-0.04em;color:#f3eee6;">ROME</p>
              <p style="margin:8px 0 0;font-family:Manrope,Segoe UI,sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#8d8880;">Developer portfolio</p>
              <div style="margin-top:20px;height:2px;width:48px;background:#e0361a;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0;font-family:Manrope,Segoe UI,sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#6d6a66;">New message</p>
              <h1 style="margin:10px 0 0;font-family:Syne,Arial Black,sans-serif;font-size:32px;line-height:1.05;letter-spacing:-0.045em;color:#121214;">${name}</h1>
              <p style="margin:10px 0 0;font-family:Manrope,Segoe UI,sans-serif;font-size:14px;color:#6d6a66;">
                <a href="mailto:${email}" style="color:#e0361a;text-decoration:none;">${email}</a>
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="background:#fffdf9;border:1px solid rgba(18,18,20,0.1);border-left:3px solid #e0361a;border-radius:20px;padding:22px 24px;font-family:Manrope,Segoe UI,sans-serif;font-size:16px;line-height:1.7;color:#121214;">
                    ${message}
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="background:#121214;border-radius:999px;">
                    <a href="${mailto}" style="display:inline-block;padding:14px 24px;font-family:Manrope,Segoe UI,sans-serif;font-size:13px;font-weight:600;color:#f3eee6;text-decoration:none;">Reply to ${name}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;">
              <p style="margin:0;font-family:Manrope,Segoe UI,sans-serif;font-size:12px;color:#6d6a66;">
                Sent from <a href="${site}" style="color:#121214;text-decoration:none;">${site.replace(/^https?:\/\//, "")}</a>
                · ${year}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
