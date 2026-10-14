"use client";
import { useEffect, useState } from "react";

const API = "http://localhost:8001";

export default function Home() {
  const [s, setS] = useState<any>("loading…");
  useEffect(() => {
    fetch(`${API}/vehicles/status`)
      .then((r) => r.json())
      .then(setS)
      .catch(() => setS({ error: "api off" }));
  }, []);
  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 560 }}>
      <h1>CSAP — Dashboard</h1>
      <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(s, null, 2)}
      </pre>
      <p>
        <a href="/spot">Map</a> · <a href="/modes">Modes</a> · <a href="/sos">SOS</a> ·{" "}
        <a href="/settings">Settings</a> · <a href="/help">Help</a> · <a href="/pay">Pay</a>
      </p>
      <p style={{ color: "#666" }}>CSAP is not an emergency service.</p>
    </main>
  );
}
