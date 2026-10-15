// CSAP SMS sender (trial). Twilio + Textbelt. Keys stay in local .env only.
// Never log full keys. Never commit .env.
export type SmsResult = { ok: boolean; via: string; state: string; id?: string };

const mask = (s: string) => (s.length <= 4 ? "****" : s.slice(0, 2) + "***" + s.slice(-2));

export async function sendSms(to: string, message: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID || "";
  const token = process.env.TWILIO_AUTH_TOKEN || "";
  const from = process.env.TWILIO_FROM || "";
  const tbKey = process.env.TEXTBELT_KEY || "";

  if (sid && token && from) {
    try {
      const creds = Buffer.from(`${sid}:${token}`).toString("base64");
      const form = new URLSearchParams({ To: to, From: from, Body: message });
      const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${creds}`, "content-type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      const j = (await r.json()) as any;
      if (r.ok && j.sid) return { ok: true, via: "twilio", state: "sent", id: j.sid };
      console.log(`[sms] twilio fail sid=${mask(sid)} status=${r.status} err=${j.message || j.code || "unknown"}`);
      // fall through to Textbelt if set
    } catch (e: any) {
      console.log(`[sms] twilio error sid=${mask(sid)} err=${e?.message || "net"}`);
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
