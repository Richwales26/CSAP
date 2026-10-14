# CSAP Compatibility Matrix (starter — fill with pilot VINs)

**Rule:** No feature shows ACTIVE unless verified for that VIN. States: `supported / unsupported / unverified`.

| Vehicle / connection | Locks | Tracking live | Last-known | Theft signal | Accident signal | Notes |
|---|---|---|---|---|---|---|
| OEM cloud API (e.g. BMW/Tesla-type) | supported | supported | supported | supported | if OEM provides | Remote works; needs owner OAuth |
| Bluetooth / RF nearby only | supported (nearby) | unsupported | unsupported | unsupported | unsupported | Label "nearby only — not remote" |
| Phone-as-sensor (GPS in app) | unsupported | limited (phone, not car) | supported | limited | unsupported | Fallback; label clearly |
| No link / disconnected | unsupported | unavailable | stale+timestamp | unknown | unknown | Show gaps + what still works |

**Pilot:** add 10 real VINs here before Phase 4 build. Columns: VIN prefix, make/model/year, link type, verified capabilities, date.
