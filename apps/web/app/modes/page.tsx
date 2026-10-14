"use client";
import { useState } from "react";
const API = "http://localhost:8001";
export default function Modes() {
  const [out, setOut] = useState("");
  const send = async (mode: string) => {
    const r = await fetch(`${API}/vehicles/mode`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode }),
    });
    setOut(JSON.stringify(await r.json()));
  };
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Modes</h1>
      <button onClick={() => send("everyday")}>Everyday</button>{" "}
      <button onClick={() => send("enhanced")}>Enhanced</button>{" "}
      <button onClick={() => send("theft")}>Suspected theft</button>
      <pre>{out}</pre>
      <p><a href="/">Back</a></p>
    </main>
  );
}
