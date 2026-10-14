# ADR 0002 — Vehicle Adapter

One plug shape for all cars:

- `checkCompatibility(vin)` → list of what works
- `sendCommand(vin, cmd)` → done / failed / not sure yet
- `getLocation(vin)` → live / last-known + time / no link / unknown

Why: no car shows ACTIVE unless proven. Easy to add new cars later.
