"use client";
import { useEffect, useState } from "react";
const API = "http://localhost:8001";
export default function Pay() {
  const [p, setP] = useState<any>(null);
  useEffect(() => { fetch(`${API}/billing/plans`).then((r) => r.json()).then(setP); }, []);
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Pay — Free vs Premium</h1>
      <pre>{JSON.stringify(p, null, 2)}</pre>
      <p>Safe alerts stay free. No tricks.</p>
      <p><a href="/">Back</a></p>
    </main>
  );
}
