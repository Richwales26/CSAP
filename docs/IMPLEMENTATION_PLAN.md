# CSAP — Implementation Plan

**Source:** `docs/PRD for CSAP.md` v1.0 (13 Oct 2026)
**Repo:** `Richwales26/CSAP` (public, `main`)
**Status:** Planning — no code yet
**Promise:** Simple Vehicle Security. Greater Confidence, More Control.

This plan turns the PRD into buildable phases, from design system → architecture → MVP → launch.

---

## 0. How to read this plan

- Each phase lists: goal, PRD mapping, deliverables, tasks, exit criteria, dependencies/risks.
- PRD §5.1–5.24 are all covered. Nothing is dropped; non-MVP items are explicitly deferred.
- 15 open PRD decisions (§15) are closed in Phase 0 — no code that depends on them starts before that.

---

## Phase 0 — Discovery & Decision Closure (Week 1–2)

**Goal:** Close the 15 PRD open decisions enough to build MVP.

**PRD mapping:** §15 (1–15), §6, §7.3, §8, §9.

**Tasks:**
1. **Language & markets:** pick launch language (recommend English), shortlist 2–3 launch markets with privacy/consumer-law review.
2. **Vehicle compatibility:** define initial makes/models/years + integration capabilities matrix (supported / unsupported / unverified).
3. **Connections:** map Bluetooth / RF / OEM cloud API / OBD-dongle (if any) → which features each can support. Document: nearby ≠ remote/tracking.
4. **Emergency integration:** per-market matrix: direct API vs. call-yourself fallback vs. unsupported.
5. **Subscriptions:** finalise Free (1 vehicle, essential alerts, basic trusted users, dashboard) vs. Premium (multi-vehicle, history, advanced tracking, automation, expanded reports), prices, billing terms, refund policy.
6. **Retention:** define days for events, locations, reports; owner-delete vs. legal-hold exceptions.
7. **Recovery:** define fallback when verification channel lost (support-assisted + safeguards).
8. **Updates:** urgent-update warning pattern + supported-versions policy.
9. **Automation v1:** allowed triggers/actions/safeguards (e.g., parked → Enhanced Protection only if event reliable).
10. **Escalation:** qualifying incidents, ack timeout, contact rules, message copy.
11. **Risk indicator:** formula for low/medium/high + when to show “unknown”.
12. **Support SLAs:** hours, response targets, help-centre IA.
13. **Legal:** data-protection, vehicle-access consent, emergency-service disclaimers.
14. **Release plan:** MVP scope lock, rollout sequence, feedback loop.

**Deliverables:**
- `docs/DECISIONS.md` (15 decisions: decided / deferred with owner + date)
- `docs/COMPATIBILITY.md` (vehicle × feature matrix)
- `docs/MARKETS.md` (per-market feature availability)

**Exit criteria:** DECISIONS.md signed off; compatibility matrix exists; no MVP task references “TBD”.

---

## Phase 1 — Design System (Week 2–4, parallel with Phase 2)

**Goal:** One consistent, accessible, plain-language UI for mobile + web.

**PRD mapping:** §4, §5.3, §5.17, §8, §10.2.

**Deliverables:**
- `design/tokens.json` (colour, type, spacing, radius) + dark-mode + status palette
- Component library: Button, Input, Card, Badge, AlertBanner, StatusDot, RiskIndicator, Timeline, MapPin, PermissionRow, EmptyState, WalkthroughCoachmark
- **Status language (critical):** `Active / Unavailable / Disconnected / Unknown / Stale (timestamp)` — never show last-known as live; never imply success when unconfirmed
- Patterns: Dashboard card, Tracking map (live vs. last-known), SOS sheet, Incident timeline, Permission review, Mode switcher
- Accessibility: WCAG 2.2 AA targets, min touch 44pt, dynamic type, screen-reader labels for all status/risk
- Copy guide: plain-language alert strings, safety disclaimers (“CSAP is not an emergency service”)

**Tasks:**
1. Audit PRD screens: dashboard, tracking, modes, trusted users, SOS, history/reports, settings, paywall, help.
2. Figma (or Penpot) library + mobile + web reference screens (10–12 screens).
3. Prototype walkthroughs (§5.17): connect vehicle, modes, tracking/privacy, trusted users, SOS, theft alert, report.
4. Usability test with 5 owners: can they tell active vs. unavailable vs. unknown in <10s?

**Exit criteria:** Storybook (or equivalent) deployed; status/risk components approved; copy guide merged.

---

## Phase 2 — Architectural Decisions (Week 2–3)

**Goal:** Lock stack + boundaries before code.

**PRD mapping:** §4, §10 (all), §7.

### 2.1 Locked stack (owner decision, Oct 2026 — local-first, scale later)

See `docs/LOCAL_STACK.md` + `infra/` for the runnable setup.

| Layer | Locked choice | Notes |
|---|---|---|
| Monorepo | Turborepo + pnpm + TypeScript | Shared types, tokens, API client |
| Mobile | React Native (Expo) iOS/Android | Mobile-first SOS/tracking |
| Web | Next.js (React) + same design system | Consistent core (§4.2–4.3) |
| API | Node + tRPC or REST (OpenAPI) + **PostgreSQL 16 local in Docker** + PostGIS | No managed-DB subscription; `infra/docker-compose.yml`, `DATABASE_URL` only change to scale |
| Auth | **Better Auth** — password + email/SMS code, optional fingerprint, no face | PRD §5.18 excludes facial recognition |
| Files | **Cloudflare R2** (S3-compatible) | `R2_*` in `.env.example` |
| Email | **Resend** | Verification codes, alerts, `RESEND_*` in `.env.example` |
| Push/SMS | FCM/APNs + SMS provider; in-app inbox fallback | PRD §5.9: SMS+email required |
| Maps | MapLibre / Google Maps SDK (abstracted) | Live vs. last-known rendering |
| Vehicle layer | **Integration adapter interface** (see below) | Core risk: incompatibility (§13.1–13.2) |
| Jobs/Events | Queue (BullMQ local) + event log; idempotent alert pipeline with dedupe/grouping | §5.9 grouping/suppression, §5.14 flap control |
| Proxy/Hosting | **Caddy on local device** (`infra/Caddyfile`); `csap.localhost` → :3000, `api.csap.localhost` → :8000 | Copy file to VPS + enable auto_https to scale |

### 2.2 Key decisions to record as ADRs (`docs/adr/NNNN-*.md`)

1. Mobile framework, web framework, API style
2. Vehicle Integration Adapter: `checkCompatibility(vin) → capabilities[]`, `sendCommand() → confirmed/failed/unconfirmed`, `getLocation() → live/last-known/unavailable/unknown`
3. Source of truth: server owns permissions, modes, alert state; clients are caches (cross-platform consistency §4.3)
4. Location model: never store precise history beyond retention; separate `vehicle_access` from `location_access` tables
5. Alert pipeline: prioritise → group → suppress duplicates → never suppress new/serious threat; delivery-receipt tracking
6. Safety guard: server-side interlock — immobilise-like commands rejected if `vehicle_speed > 0` or state unknown
7. Privacy: encryption at rest/in transit, per-field access logs, owner-only by default, auto-expiry for temp shares

**Core data sketch:**
`users, vehicles, vehicle_capabilities, trusted_grants (vehicle_access vs location_access), modes, automation_rules, locations (retention-tagged), events, alerts, incidents, escalation_policies, reports, subscriptions, audit_log`

**Exit criteria:** 7 ADRs merged; OpenAPI/proto sketch approved; threat-model draft done.

---

## Phase 3 — Platform Foundation (Week 3–5)

**Goal:** Ship-ready pipeline before features. Local-first: everything runnable on this Mac.

**Tasks:**
1. Monorepo scaffold: `apps/mobile`, `apps/web`, `packages/ui`, `packages/api-client`, `packages/config`, `services/api`
2. Local services (done, see `docs/LOCAL_STACK.md`): `infra/docker-compose.yml` (Postgres 16), `infra/Caddyfile` (local reverse proxy), `.env.example` (Better Auth + R2 + Resend)
3. CI: lint, typecheck, unit test, Storybook build, API contract test; branch protection on `main`
4. Envs: local (`csap.localhost`) → staging → prod; secrets in manager locally `.env` (never commit); scale later by changing `DATABASE_URL` + moving Caddy file to VPS
5. Observability: structured logs, error tracking, uptime + feature-availability metrics (§12.3)
6. Feature flags + remote config (for market-specific availability §9)

**Exit criteria:** `docker compose -f infra/docker-compose.yml up -d` healthy + Caddy serves `csap.localhost`; empty mobile + web apps deploy from `main`; CI green.

---

## Phase 4 — Identity, Onboarding, Vehicle Setup (MVP core)

**Goal:** User can sign up, verify, connect a supported vehicle, see what works.

**PRD mapping:** §5.1, §5.2, §5.18, §5.21.

**Build:**
- Sign-up/sign-in: password + verification code; fingerprint optional; recovery flow with safeguards + owner notification; no face unlock
- Onboarding checklist: verify → compatibility check → connect → security settings → notifications → invite trusted users; optional walkthroughs skippable but essential setup never marked done until verified
- Vehicle add: VIN/manual entry → `checkCompatibility` → per-feature availability UI (supported/unsupported/unverified + “what you need” guidance); multi-vehicle gated by plan
- Manual update banner + release notes surface

**Exit criteria (PRD §14.1–2):** New user completes setup in test; unsupported features never shown as active; failed steps show guidance.

---

## Phase 5 — Dashboard, Controls, Modes (MVP core)

**Goal:** Honest security status + safe controls.

**PRD mapping:** §5.3, §5.4, §5.5.

**Build:**
- Dashboard: status, enabled/disabled features, connection, recent important events, tracking snippet, outstanding actions, gaps, next steps; risk low/medium/high with “why” explanation or “insufficient info”
- Controls: lock/unlock (if supported) with `confirmed / failed / unconfirmed` states; sensitive-action confirm + audit; server-side moving-vehicle interlock
- Modes: Everyday / Enhanced Protection / Suspected Theft; per-mode capability list; automation rules v1 (e.g., parked → Enhanced); failure notifications; no unsafe automation

**Exit criteria (§14.3–4):** Dashboard distinguishes active/unavailable/unknown; commands never claim false success.

---

## Phase 6 — Tracking, Trusted Users, Location Privacy

**Goal:** Location done right.

**PRD mapping:** §5.6, §5.7, §5.8.

**Build:**
- Map: live vs. last-known (timestamped) vs. unavailable vs. unknown; stale banner; history gated by plan + retention
- Trusted users: invite/list/revoke; vehicle-control ≠ location/account access; revocation propagates + shows limits; trusted users need no separate sub (per plan terms)
- Privacy: owner-only default; explicit grant/revoke; temp incident share (recipient + scope + auto-expiry + early revoke); no auto-grant

**Exit criteria (§14.5–6):** Last-known never presented as live; revocation verified across web+mobile.

---

## Phase 7 — Alerts, Theft, Accident, SOS, Connectivity

**Goal:** Useful notifications, safe incident handling.

**PRD mapping:** §5.9–§5.14.

**Build:**
- Alert engine: SMS+email+in-app; priority, grouping, dedupe (material-change only), owner prefs for routine, safety/security warnings always through; suspected vs. confirmed; delivery-status (“sent / failed / unconfirmed”)
- Theft: suspicious-activity → alert + increased monitoring + guidance + owner-approved actions + theft-report helper; suspected ≠ confirmed; no false “recovered/police notified”
- Accident: if integration reliable → owner alert + location freshness + safety check + call-emergency route + emergency-contact notify if criteria met; direct integration only where supported
- SOS: easy to find, explains what happens, shares location if authorised, notifies contacts, shows sent/failed/unconfirmed, offers direct-dial; anti-accidental design; “CSAP is not an emergency service”
- Non-response escalation: qualifying incidents only, ack timer, message states owner hasn’t acknowledged, minimal data
- Connectivity: loss/restore detection, “what still works”, flap suppression, unknown-state labelling

**Exit criteria (§14.7–8):** Critical alerts prioritised without noise in test; SOS honestly reports delivery.

---

## Phase 8 — History, Reports, False Alarms, Walkthroughs

**Goal:** Reviewable, shareable, improvable.

**PRD mapping:** §5.15, §5.16, §5.17.

**Build:**
- Event history: security/access/SOS/accident/connection/action outcomes; facts vs. inferred; gaps labelled; retention enforced; no “legal evidence guaranteed”
- Reports: assemble timestamps+locations+alerts+access into shareable PDF/link; intentional share; redact trusted-user PII
- False alarms: “why this fired”, mark legitimate/mistaken, cautious tuning (never treat dismissal as proof of future safety), changelog for behaviour changes
- Walkthroughs: 7 priority flows (§5.17), resumable, plain language + limits

**Exit criteria:** Report generates from staged data; feedback loop doesn’t suppress new threats (regression test).

---

## Phase 9 — Lifecycle, Support, Service Health

**Goal:** Account control + honest operations.

**PRD mapping:** §5.19–§5.24.

**Build:**
- Account delete: what’s deleted vs. retained (legal), revoke trusted access, disconnect integrations, schedule + confirm + exceptions
- Vehicle remove/transfer: manual remove, revoke, protect prior-owner history, explain non-auto OEM disconnect, new-owner onboarding
- Help centre (searchable) + email support; response expectations; “not emergency response” banner
- Feedback: optional rating/suggestion/bug/false-alarm; privacy-respecting
- Service incidents: detect → identify affected → notify → progress → verified-restore → post-mortem; no cross-user data leak

**Exit criteria (§14.10,14–15):** Delete/remove flows explain effects/limits; service-incident drill passes.

---

## Phase 10 — Subscriptions, Privacy, Hardening

**Goal:** Monetise without breaking trust.

**PRD mapping:** §6, §7, §10.3.

**Build:**
- Paywall: Free vs. Premium, vehicle limits, renewal/cancel, no trial-expiry dark pattern, essential safety alerts stay free where feasible/legal, published refunds
- Privacy: data-minimisation audit, permission matrix test, retention cron + owner delete, transparency page (what/why/who/how-long/how-to-delete)
- Security: rate-limit, lockout, session revoke on recovery, audit log for sensitive actions, pen-test + dependency scan, backup/restore drill

**Exit criteria (§14.11,13):** Entitlements enforced server-side; privacy review signed off.

---

## Phase 11 — QA, Launch Readiness, Rollout

**Goal:** Prove PRD §14 (1–16) before broad launch.

**Tasks:**
1. Matrix test: devices × markets × vehicle adapters (mock + real where possible)
2. Chaos: connectivity loss, stale GPS, failed commands, provider outage
3. Accessibility + plain-language audit; support dry-run
4. Staged rollout: internal → beta market → broad (feature flags per §9); kill-switch for unsupported capabilities
5. Launch checklist maps each §14 item to evidence (screenshot/log/test ID)

**Exit criteria:** All 16 readiness items evidenced; rollback plan tested.

---

## Phase 12 — Post-Launch Measure & Iterate

**PRD mapping:** §12, §11 (should-have/later).

**Track (privacy-minimal):**
- Satisfaction: ratings, complaints (esp. confusing alerts/setup), support themes
- Usage: active users, setup completion, feature use, retention, plan adoption
- Security outcomes: useful-alert rate, false-alarm rate, action success/fail, availability, response completion, time-to-communicate protection failure

**Next (deferred):** custom automation expansion, advanced personalisation, extra languages/markets, richer roles — only if security/privacy/reliability guardrails hold.

---

## Appendix A — MVP vs. Later (from PRD §11)

**MVP must:** auth/recovery, compatibility+registration, dashboard, controls+modes, notifications, basic trusted users, location permissions, theft/suspicious, SOS/accident where supported, connectivity warnings, history, account/vehicle removal, privacy/retention docs, help+email, mobile+web.

**Should (MVP if cheap, else fast-follow):** automation, prioritisation/false-alarm tuning, reports+temp share, escalation, walkthroughs, flexible plans, feedback, service-incident comms.

**Later:** extra languages, broader integrations, advanced roles, deeper personalisation.

---

## Appendix B — Top risks (PRD §13) → mitigation owner

1. Incompatibility → adapter + matrix (Ph0/Ph2) 2. BT/RF confusion → explicit limits UI (Ph4–5)
3. False alarms → engine + cautious tuning (Ph7–8) 4. Privacy leak → separate permissions + revoke tests (Ph6/10)
5. Emergency confusion → copy + delivery states (Ph7) 6. Stale updates → manual-update warnings (Ph4/9)
7. Unready markets → flags + per-market gates (Ph3/11) 8. Overload → grouping/dedupe (Ph7)

---

## Recommended next actions

1. Approve stack + sign off Phase 0 decisions (2 weeks).
2. Stand up Figma + monorepo + CI (Phase 1–3 in parallel).
3. Build Phases 4–7 as MVP; gate launch on §14 checklist.

*Generated from PRD v1.0 — update this file when any §15 decision closes.*
