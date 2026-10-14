"use client";
import { useState } from "react";
const API = "http://localhost:8001";
export default function Spot() {
  const [out, setOut] = useState("");
  const load = async () => setOut(JSON.stringify(await (await fetch(`${API}/vehicles/spot`)).json(), null, 2));
  const pin = async () => {
    await fetch(`${API}/vehicles/spot`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lat: 6.5244, lon: 3.3792, fresh: "live" }),
    });
    load();
  };
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Map — live or last-known + time</h1>
      <button onClick={pin}>Drop test pin (Lagos)</button> <button onClick={load}>Refresh</button>
      <pre>{out}</pre>
      <p><a href="/">Back</a></p>
    </main>
  );
}
