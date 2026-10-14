"use client";
import { useState } from "react";
const API = "http://localhost:8001";
export default function Settings() {
  const [out, setOut] = useState("");
  const info = async () => setOut(JSON.stringify(await (await fetch(`${API}/account/delete-info`)).json(), null, 2));
  const removeCar = async () => {
    const r = await fetch(`${API}/vehicles/remove`, { method: "POST" });
    setOut(JSON.stringify(await r.json(), null, 2));
  };
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Settings — my data</h1>
      <button onClick={info}>What delete does</button> <button onClick={removeCar}>Remove my car</button>
      <pre>{out}</pre>
      <p>Full delete needs care. We cut helpers + spots and list what law keeps.</p>
      <p><a href="/">Back</a></p>
    </main>
  );
}
