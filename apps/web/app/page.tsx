"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [s, setS] = useState<any>(null);
  useEffect(() => {
    fetch("http://api.csap.localhost:8000/vehicles/status".replace(":8000", ":8001"))
      .then((r) => r.json())
      .then(setS)
      .catch(() => setS({ error: "api off? run pnpm --filter @csap/api dev" }));
  }, []);
  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 560 }}>
      <h1>CSAP — Dashboard</h1>
      <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(s, null, 2)}
      </pre>
      <p>
        <a href="/spot">Map</a> · <a href="/modes">Modes</a> · <a href="/sos">SOS</a>
      </p>
      <p style={{ color: "#666" }}>CSAP is not an emergency service.</p>
    </main>
  );
}
