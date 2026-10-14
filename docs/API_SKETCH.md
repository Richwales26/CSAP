# CSAP API Sketch (REST, simple)

- GET /health → ok
- POST /auth/signup, POST /auth/signin, POST /auth/code (Better Auth)
- GET /onboarding → steps + what is left
- POST /vehicles → add car (vin)
- GET /vehicles/:id/compat → what works
- GET /vehicles/:id/status → locks, link, risk + why
- POST /vehicles/:id/commands (lock/unlock) → done/failed/not sure
- POST /vehicles/:id/modes → everyday/enhanced/theft
- GET /vehicles/:id/spot → live/last-known + time
- POST /vehicles/:id/share-temp → short share with end time
- GET /vehicles/:id/events, POST /vehicles/:id/reports
- POST /sos → tell contacts + help call
