export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>CSAP — Protected</h1>
      <p>Risk: Low — locks active, link connected.</p>
      <p>
        <a href="/spot">View map</a> · <a href="/sos">SOS</a>
      </p>
      <p style={{ color: "#666" }}>CSAP is not an emergency service.</p>
    </main>
  );
}
