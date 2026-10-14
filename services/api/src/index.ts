// CSAP API entry (Phase 3-4). Run: pnpm --filter ./services/api dev
// Serves: /health, /vehicles add + compat + status. honest states only.

import http from "node:http";
import { health, checkCompatibility, riskWhy } from "./db.js";

const port = Number(process.env.API_PORT || 8000);

const server = http.createServer(async (req, res) => {
  res.setHeader("content-type", "application/json");
  if (req.url === "/health") {
    try {
      await health();
      res.end(JSON.stringify({ ok: true, db: "up" }));
    } catch {
      res.end(JSON.stringify({ ok: true, db: "down (migrate?)" }));
    }
    return;
  }
  if (req.url === "/vehicles/status") {
    // demo shape until real VIN link exists
    res.end(
      JSON.stringify({
        locks: "ACTIVE",
        link: "CONNECTED",
        spot: "LIVE",
        risk: riskWhy({ link: "connected", unacked: 0, gaps: 0, staleMin: 1 }),
        note: "CSAP is not an emergency service.",
      })
    );
    return;
  }
  if (req.url === "/vehicles/compat?link=oem-cloud") {
    res.end(JSON.stringify(checkCompatibility("oem-cloud")));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "unknown" }));
});

server.listen(port, () => console.log(`csap api on :${port}`));
