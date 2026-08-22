const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BREVO_LIST_ID = 2;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/subscribe" && request.method === "POST") {
      const form = await request.formData();
      const email = (form.get("email") || "").toString().trim();

      if (!EMAIL_RE.test(email)) {
        return page("That doesn't look like a valid email address.", true, 400);
      }

      const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, listIds: [BREVO_LIST_ID] }),
      });

      if (!brevoResponse.ok) {
        const body = await brevoResponse.json().catch(() => null);
        const alreadySubscribed = brevoResponse.status === 400 && body?.code === "duplicate_parameter";
        if (!alreadySubscribed) {
          return page("Something went wrong — please try again in a moment.", true, 502);
        }
      }

      return page("You're subscribed. See you in your inbox tomorrow morning.", false, 200);
    }

    return env.ASSETS.fetch(request);
  },
};

function page(message, isError, status) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The AI Brew</title>
</head>
<body style="margin:0; padding:0; background:#FAFAF8; color:#1a1a1a; font-family: Georgia, 'Times New Roman', serif; display:flex; align-items:center; justify-content:center; min-height:100vh;">
  <div style="max-width:420px; text-align:center; padding:32px 24px;">
    <div style="font-size:15px; color:${isError ? "#B91C1C" : "#334155"}; line-height:1.6; margin-bottom:20px;">${message}</div>
    <a href="/" style="color:#0F172A; font-size:14px; text-decoration:underline;">Back to The AI Brew</a>
  </div>
</body>
</html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html;charset=UTF-8" } });
}
