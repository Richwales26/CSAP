"use client";
import { useState } from "react";
const API = "http://localhost:8001";
export default function SOS() {
  const [out, setOut] = useState("");
  const send = async () => {
    const r = await fetch(`${API}/sos`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "help" }),
    });
    setOut(JSON.stringify(await r.json(), null, 2));
  };
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>SOS — Get help</h1>
      <p>CSAP is not an emergency service. We tell your contacts and help you call.</p>
      <button onClick={send} style={{ background: "#EF4444", color: "#fff", padding: 12, borderRadius: 8 }}>
        Hold to send SOS (tap for demo)
      </button>
      <pre>{out}</pre>
      <p><a href="/">Back</a></p>
    </main>
  );
}
