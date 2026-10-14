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
