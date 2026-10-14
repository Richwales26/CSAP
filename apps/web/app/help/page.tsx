"use client";
import { useEffect, useState } from "react";
const API = "http://localhost:8001";
export default function Help() {
  const [h, setH] = useState<any>(null);
  useEffect(() => { fetch(`${API}/help`).then((r) => r.json()).then(setH); }, []);
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Help</h1>
      <pre>{JSON.stringify(h, null, 2)}</pre>
      <p><a href="/">Back</a></p>
    </main>
  );
}
