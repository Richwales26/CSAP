// CSAP SMS sender (trial). Twilio + Textbelt. Keys stay in local .env only.
// Never log full keys. Never commit .env.
export type SmsResult = { ok: boolean; via: string; state: string; id?: string };

const mask = (s: string) => (s.length <= 4 ? "****" : s.slice(0, 2) + "***" + s.slice(-2));

export async function sendSms(to: string, message: string): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  // Auth: either API Key pair (SK sid + secret) or classic SID + token.
  // Put SK... in TWILIO_API_KEY_SID and its secret in TWILIO_AUTH_TOKEN.
  const apiKeySid = process.env.TWILIO_API_KEY_SID || "";
  const token = process.env.TWILIO_AUTH_TOKEN || "";
  const authUser = apiKeySid || accountSid;
  const from = process.env.TWILIO_FROM || "";
  const tbKey = process.env.TEXTBELT_KEY || "";

  if (accountSid && authUser && token && from) {
    try {
      const creds = Buffer.from(`${authUser}:${token}`).toString("base64");
      const form = new URLSearchParams({ To: to, From: from, Body: message });
      const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${creds}`, "content-type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      const j = (await r.json()) as any;
      if (r.ok && j.sid) return { ok: true, via: "twilio", state: "sent", id: j.sid };
      console.log(`[sms] twilio fail acct=${mask(accountSid)} status=${r.status} err=${j.message || j.code || "unknown"}`);
      // fall through to Textbelt if set
    } catch (e: any) {
      console.log(`[sms] twilio error acct=${mask(accountSid)} err=${e?.message || "net"}`);
    }
  }

  if (tbKey) {
    try {
      const r = await fetch("https://textbelt.com/text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone: to, message, key: tbKey }),
      });
      const j = (await r.json()) as any;
      if (j.success) return { ok: true, via: "textbelt", state: "sent", id: String(j.textId || "ok") };
      console.log(`[sms] textbelt fail key=${mask(tbKey)} err=${j.error || "unknown"}`);
      return { ok: false, via: "textbelt", state: `failed: ${j.error || "unknown"}` };
    } catch (e: any) {
      return { ok: false, via: "textbelt", state: `failed: ${e?.message || "net"}` };
    }
  }

  return { ok: false, via: "none", state: "unsent-no-key" };
}
