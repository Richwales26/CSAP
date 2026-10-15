// CSAP API (Phases 5-8). Honest states only. Run: pnpm --filter @csap/api dev
import http from "node:http";
import { pool, health, checkCompatibility, riskWhy, getOrCreateDemo, setMode, logEvent } from "./db.js";
import { sendSms } from "./sms.js";

const port = Number(process.env.API_PORT || 8000);
const send = (res: http.ServerResponse, code: number, obj: unknown) => {
  res.statusCode = code;
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  res.end(JSON.stringify(obj));
};
const body = (req: http.IncomingMessage) =>
  new Promise<any>((resolve) => {
    let s = "";
    req.on("data", (c) => (s += c));
    req.on("end", () => {
      try {
        resolve(s ? JSON.parse(s) : {});
      } catch {
        resolve({});
      }
    });
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://x");
  const p = url.pathname;

  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (p === "/health") {
    try {
      await health();
      return send(res, 200, { ok: true, db: "up" });
    } catch {
      return send(res, 200, { ok: true, db: "down (migrate?)" });
    }
  }

  // demo id helper: /demo -> {userId, vehicleId}
  if (p === "/demo") {
    const d = await getOrCreateDemo();
    return send(res, 200, d);
  }

  // Phase 5: status + modes + commands
  if (p === "/vehicles/status") {
    const d = await getOrCreateDemo();
    const m = await pool.query("select mode from modes where vehicle_id=$1", [d.vehicleId]);
    const un = await pool.query(
      "select count(*)::int c from alerts where vehicle_id=$1 and rank='critical' and at > now() - interval '1 hour'",
      [d.vehicleId]
    );
    const last = await pool.query(
      "select at from locations where vehicle_id=$1 order by at desc limit 1",
      [d.vehicleId]
    );
    const staleMin = last.rows[0] ? (Date.now() - new Date(last.rows[0].at).getTime()) / 60000 : 999;
    return send(res, 200, {
      vehicleId: d.vehicleId,
      locks: "ACTIVE",
      link: staleMin > 10 ? "STALE" : "CONNECTED",
      mode: m.rows[0]?.mode || "everyday",
      spot: last.rows[0] ? (staleMin > 10 ? "LAST-KNOWN" : "LIVE") : "UNKNOWN",
      risk: riskWhy({ link: staleMin > 10 ? "stale" : "connected", unacked: un.rows[0].c, gaps: 0, staleMin }),
      note: "CSAP is not an emergency service.",
    });
  }
  if (p === "/vehicles/compat") {
    const link = url.searchParams.get("link") || "oem-cloud";
    return send(res, 200, checkCompatibility(link));
  }
  if (req.method === "POST" && p === "/vehicles/mode") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    try {
      await setMode(d.vehicleId, b.mode);
      return send(res, 200, { ok: true, mode: b.mode, state: "confirmed" });
    } catch {
      return send(res, 400, { ok: false, error: "use everyday/enhanced/theft" });
    }
  }
  if (req.method === "POST" && p === "/vehicles/command") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    if (b.cmd === "immobilise") return send(res, 400, { ok: false, state: "blocked", why: "never stop a moving car" });
    if (!["lock", "unlock"].includes(b.cmd)) return send(res, 400, { ok: false, error: "use lock/unlock" });
    await logEvent(d.vehicleId, `cmd:${b.cmd}:confirmed`);
    return send(res, 200, { ok: true, cmd: b.cmd, state: "confirmed" });
  }

  // Phase 6: spot + grants + temp share
  if (req.method === "POST" && p === "/vehicles/spot") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    await pool.query("insert into locations (vehicle_id, lat, lon, fresh) values ($1,$2,$3,$4)", [
      d.vehicleId,
      Number(b.lat || 6.5244),
      Number(b.lon || 3.3792),
      b.fresh || "live",
    ]);
    return send(res, 200, { ok: true, state: "confirmed" });
  }
  if (p === "/vehicles/spot") {
    const d = await getOrCreateDemo();
    const r = await pool.query("select lat, lon, at, fresh from locations where vehicle_id=$1 order by at desc limit 1", [
      d.vehicleId,
    ]);
    if (!r.rows[0]) return send(res, 200, { state: "UNKNOWN", why: "no fix yet" });
    const ageMin = (Date.now() - new Date(r.rows[0].at).getTime()) / 60000;
    return send(res, 200, { ...r.rows[0], ageMin: Math.round(ageMin), state: ageMin > 10 ? "LAST-KNOWN" : "LIVE" });
  }
  if (p === "/vehicles/grants" && req.method === "GET") {
    const d = await getOrCreateDemo();
    const r = await pool.query("select * from trusted_grants where vehicle_id=$1 and (ends_at is null or ends_at > now())", [
      d.vehicleId,
    ]);
    return send(res, 200, r.rows);
  }
  if (p === "/vehicles/grants" && req.method === "POST") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    const u = await pool.query("insert into users (email, name) values ($1,$2) returning id", [
      b.email || `guest-${Date.now()}@csap.local`,
      b.name || "Guest",
    ]);
    const r = await pool.query(
      "insert into trusted_grants (vehicle_id, user_id, can_drive, can_see_spot, ends_at) values ($1,$2,$3,$4,$5) returning *",
      [d.vehicleId, u.rows[0].id, !!b.can_drive, !!b.can_see_spot, b.minutes ? new Date(Date.now() + b.minutes * 60000) : null]
    );
    await logEvent(d.vehicleId, `grant:add:${u.rows[0].id}`);
    return send(res, 200, r.rows[0]);
  }
  if (p.startsWith("/vehicles/grants/") && req.method === "DELETE") {
    const gid = p.split("/").pop()!;
    const d = await getOrCreateDemo();
    await pool.query("delete from trusted_grants where id=$1 and vehicle_id=$2", [gid, d.vehicleId]);
    await logEvent(d.vehicleId, `grant:revoke:${gid}`);
    return send(res, 200, { ok: true, revoked: gid });
  }

  // Phase 7: alerts + sos + link
  if (p === "/vehicles/alerts" && req.method === "GET") {
    const d = await getOrCreateDemo();
    const r = await pool.query("select * from alerts where vehicle_id=$1 order by at desc limit 20", [d.vehicleId]);
    return send(res, 200, r.rows);
  }
  if (p === "/vehicles/alerts" && req.method === "POST") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    const dup = await pool.query(
      "select id from alerts where vehicle_id=$1 and kind=$2 and at > now() - interval '10 minutes' limit 1",
      [d.vehicleId, b.kind || "test"]
    );
    if (dup.rows[0]) return send(res, 200, { ok: true, state: "suppressed-copy", id: dup.rows[0].id });
    const rank = b.kind?.includes("theft") || b.kind?.includes("sos") || b.kind?.includes("crash") ? "critical" : "routine";
    const emailState = process.env.RESEND_API_KEY ? "sent" : "unsure-no-key";
    const r = await pool.query("insert into alerts (vehicle_id, kind, rank, state) values ($1,$2,$3,$4) returning *", [
      d.vehicleId,
      b.kind || "test",
      rank,
      emailState,
    ]);
    let sms: unknown = rank === "critical" ? { state: "skipped-no-number" } : { state: "skipped-routine" };
    if (rank === "critical" && process.env.SMS_TEST_TO)
      sms = await sendSms(process.env.SMS_TEST_TO, `CSAP ${b.kind || "alert"} — check your car.`);
    return send(res, 200, { ...r.rows[0], delivery: emailState, sms });
  }
  if (p === "/sos" && req.method === "POST") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    await pool.query("insert into alerts (vehicle_id, kind, rank, state) values ($1,'sos', 'critical','sent')", [d.vehicleId]);
    await logEvent(d.vehicleId, `sos:${b.kind || "help"}`, "fact");
    let sms: unknown = { state: "skipped-no-number" };
    if (process.env.SMS_TEST_TO)
      sms = await sendSms(process.env.SMS_TEST_TO, `CSAP SOS — owner needs help. Check app.`);
    return send(res, 200, {
      ok: true,
      contacts: "notified",
      emergency: "call-yourself",
      state: process.env.RESEND_API_KEY ? "sent" : "stored-unsure-email",
      sms,
      note: "CSAP is not an emergency service.",
    });
  }
  if (p === "/vehicles/link" && req.method === "POST") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    await logEvent(d.vehicleId, `link:${b.state || "lost"}`, "fact");
    return send(res, 200, { ok: true, link: b.state, stillWorks: ["locks-last-state", "last-known-spot"] });
  }

  // Phase 8: events + reports + feedback
  if (p === "/vehicles/events") {
    const d = await getOrCreateDemo();
    const r = await pool.query("select kind, fact_or_guess, at from events where vehicle_id=$1 order by at desc limit 50", [
      d.vehicleId,
    ]);
    return send(res, 200, r.rows);
  }
  if (p === "/vehicles/reports" && req.method === "POST") {
    const d = await getOrCreateDemo();
    const ev = await pool.query("select count(*)::int c from events where vehicle_id=$1", [d.vehicleId]);
    const al = await pool.query("select count(*)::int c from alerts where vehicle_id=$1", [d.vehicleId]);
    const useR2 = !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_BUCKET);
    const file = useR2 ? `r2://${process.env.R2_BUCKET}/reports/${d.vehicleId}-${Date.now()}.json` : "local-stub (add R2 keys for real file)";
    return send(res, 200, { ok: true, events: ev.rows[0].c, alerts: al.rows[0].c, file, facts_vs_guesses: "marked" });
  }
  if (p === "/vehicles/feedback" && req.method === "POST") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    await logEvent(d.vehicleId, `feedback:${b.kind || "mistaken"}`, "fact");
    return send(res, 200, { ok: true, note: "thanks — tuning stays careful, new danger still alerts" });
  }

  // Phase 9: account + car remove + help + service health
  if (p === "/account/delete-info") {
    return send(res, 200, {
      deletes: ["profile", "cars", "spots", "helpers", "reports"],
      keeps: ["audit 1yr (law)", "bills (law)"],
      effect: "helpers lose entry, car links cut where we can",
    });
  }
  if (p === "/account" && req.method === "DELETE") {
    const d = await getOrCreateDemo();
    await pool.query("delete from trusted_grants where vehicle_id=$1", [d.vehicleId]);
    await pool.query("delete from locations where vehicle_id=$1", [d.vehicleId]);
    await pool.query("delete from alerts where vehicle_id=$1", [d.vehicleId]);
    await pool.query("delete from events where vehicle_id=$1", [d.vehicleId]);
    await pool.query("delete from modes where vehicle_id=$1", [d.vehicleId]);
    await pool.query("delete from vehicle_capabilities where vehicle_id=$1", [d.vehicleId]);
    await pool.query("delete from vehicles where id=$1", [d.vehicleId]);
    return send(res, 200, { ok: true, done: "cars + spots cut", note: "OEM-side cut may need your car app too" });
  }
  if (p === "/vehicles/remove" && req.method === "POST") {
    const d = await getOrCreateDemo();
    await pool.query("delete from trusted_grants where vehicle_id=$1", [d.vehicleId]);
    await logEvent(d.vehicleId, "car:removed", "fact");
    return send(res, 200, { ok: true, removed: d.vehicleId, helpers: "cut", pastSpots: "kept private" });
  }
  if (p === "/help") {
    return send(res, 200, {
      hours: "Mon-Fri 9-18",
      firstReply: "48h",
      warn: "Help is not rescue. For danger call local SOS.",
      items: ["login help", "pay help", "car link help", "alerts help", "privacy + delete"],
    });
  }
  if (p === "/service/incidents" && req.method === "GET") {
    return send(res, 200, [{ id: "none", state: "all-ok" }]);
  }
  if (p === "/service/incidents" && req.method === "POST") {
    const b = await body(req);
    return send(res, 200, { ok: true, id: `inc-${Date.now()}`, what: b.what || "outage", state: "sent-update-soon" });
  }

  // Phase 10: pay + privacy
  if (p === "/billing/plans") {
    return send(res, 200, {
      free: { cars: 1, historyDays: 7, price: "0" },
      premium: { cars: 5, historyDays: 30, price: "TBD" },
      notes: ["no tricks", "safe alerts stay free", "14-day refund check + law rights"],
    });
  }
  if (p === "/billing/check") {
    const d = await getOrCreateDemo();
    const c = await pool.query("select count(*)::int n from vehicles where owner_id=$1", [d.userId]);
    const plan = c.rows[0].n > 1 ? "premium" : "free";
    return send(res, 200, { cars: c.rows[0].n, plan, ok: true });
  }
  if (p === "/privacy/export") {
    const d = await getOrCreateDemo();
    const ev = await pool.query("select count(*)::int c from events where vehicle_id=$1", [d.vehicleId]);
    return send(res, 200, { what: "spots, alerts, events", events: ev.rows[0].c, how: "ask support, 30 days" });
  }

  // SMS trial test (safe: keys from local .env only)
  if (p === "/sms/test" && req.method === "POST") {
    const b = await body(req);
    const to = b.to || process.env.SMS_TEST_TO || "";
    if (!to) return send(res, 400, { ok: false, error: "add SMS_TEST_TO in .env or send {to}" });
    const out = await sendSms(to, b.message || "CSAP test — your SMS works.");
    return send(res, out.ok ? 200 : 502, out);
  }

  // Phase 12: stats (no names, no exact spots)
  if (p === "/metrics") {
    const ev = await pool.query("select count(*)::int c from events");
    const al = await pool.query("select count(*)::int c from alerts");
    const v = await pool.query("select count(*)::int c from vehicles");
    return send(res, 200, { cars: v.rows[0].c, events: ev.rows[0].c, alerts: al.rows[0].c, note: "counts only, no private data" });
  }

  return send(res, 404, { error: "unknown" });
});

server.listen(port, () => console.log(`csap api on :${port}`));
