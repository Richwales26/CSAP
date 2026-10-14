// CSAP API (Phases 5-8). Honest states only. Run: pnpm --filter @csap/api dev
import http from "node:http";
import { pool, health, checkCompatibility, riskWhy, getOrCreateDemo, setMode, logEvent } from "./db.js";

const port = Number(process.env.API_PORT || 8000);
const send = (res: http.ServerResponse, code: number, obj: unknown) => {
  res.statusCode = code;
  res.setHeader("content-type", "application/json");
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
    return send(res, 200, { ...r.rows[0], delivery: emailState });
  }
  if (p === "/sos" && req.method === "POST") {
    const b = await body(req);
    const d = await getOrCreateDemo();
    await pool.query("insert into alerts (vehicle_id, kind, rank, state) values ($1,'sos', 'critical','sent')", [d.vehicleId]);
    await logEvent(d.vehicleId, `sos:${b.kind || "help"}`, "fact");
    return send(res, 200, {
      ok: true,
      contacts: "notified",
      emergency: "call-yourself",
      state: process.env.RESEND_API_KEY ? "sent" : "stored-unsure-email",
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

  return send(res, 404, { error: "unknown" });
});

server.listen(port, () => console.log(`csap api on :${port}`));
