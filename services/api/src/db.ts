import { Pool } from "pg";

// Simple DB pool. Uses DATABASE_URL from .env
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function health() {
  const r = await pool.query("select 1 as ok");
  return r.rows[0]?.ok === 1;
}

// Vehicle adapter (ADR 0002). Real OEM calls plug in here later.
export type CapState = "supported" | "unsupported" | "unverified";
export type SpotFresh = "live" | "last-known" | "unavailable" | "unknown";

export function checkCompatibility(linkType: string): Record<string, CapState> {
  if (linkType === "oem-cloud")
    return { locks: "supported", live: "supported", theft: "supported", accident: "unverified" };
  if (linkType === "bt-nearby")
    return { locks: "supported", live: "unsupported", theft: "unsupported", accident: "unsupported" };
  if (linkType === "phone-gps")
    return { locks: "unsupported", live: "supported", theft: "unverified", accident: "unsupported" };
  return { locks: "unverified", live: "unverified", theft: "unverified", accident: "unverified" };
}

export function riskWhy(input: { link: string; unacked: number; gaps: number; staleMin: number }) {
  if (input.unacked > 0) return { level: "High", why: ["unread urgent alert"] };
  if (input.link !== "connected" || input.staleMin > 10)
    return { level: "Medium", why: ["link old or lost"] };
  if (input.gaps > 0) return { level: "Medium", why: ["some guard off"] };
  return { level: "Low", why: ["locks on", "link fresh"] };
}

// Demo owner + car so curl tests work without login (Phase 5-8).
export async function getOrCreateDemo() {
  let u = await pool.query("select id from users where email='demo@csap.local'");
  let userId = u.rows[0]?.id as string | undefined;
  if (!userId) {
    const r = await pool.query(
      "insert into users (email, name) values ('demo@csap.local','Demo') returning id"
    );
    userId = r.rows[0].id;
  }
  let v = await pool.query("select id, link_type from vehicles where owner_id=$1 limit 1", [userId]);
  let vehicle = v.rows[0] as { id: string; link_type: string } | undefined;
  if (!vehicle) {
    const r = await pool.query(
      "insert into vehicles (owner_id, vin, name, link_type) values ($1,'DEMO-VIN-001','Golf GTI','oem-cloud') returning id, link_type",
      [userId]
    );
    vehicle = r.rows[0];
    const caps = checkCompatibility("oem-cloud");
    for (const [f, s] of Object.entries(caps))
      await pool.query(
        "insert into vehicle_capabilities (vehicle_id, feature, state) values ($1,$2,$3) on conflict do nothing",
        [vehicle!.id, f, s]
      );
    await pool.query("insert into modes (vehicle_id, mode) values ($1,'everyday') on conflict do nothing", [
      vehicle!.id,
    ]);
  }
  return { userId: userId!, vehicleId: vehicle!.id as string };
}

export async function setMode(vehicleId: string, mode: string) {
  const ok = ["everyday", "enhanced", "theft"].includes(mode);
  if (!ok) throw new Error("bad mode");
  await pool.query(
    "insert into modes (vehicle_id, mode) values ($1,$2) on conflict (vehicle_id) do update set mode=$2",
    [vehicleId, mode]
  );
  await pool.query("insert into events (vehicle_id, kind) values ($1,$2)", [vehicleId, `mode:${mode}`]);
}

export async function logEvent(vehicleId: string, kind: string, fog = "fact") {
  await pool.query("insert into events (vehicle_id, kind, fact_or_guess) values ($1,$2,$3)", [
    vehicleId,
    kind,
    fog,
  ]);
}
