export const apiBase =
  process.env.NEXT_PUBLIC_API_BASE || "http://api.csap.localhost";
export async function getStatus() {
  const r = await fetch(`${apiBase}/vehicles/status`);
  return r.json();
}
