# CSAP Decisions (closes PRD §15)

**Date:** 14 Oct 2026 · **Owner:** Richwales26 · **Status:** Proposed for sign-off
Each item: Decision → Rationale → Follow-up if any.

## 1. Initial language & launch markets
- **Decision:** English only for MVP. Launch markets: UK + Nigeria (owner's context) behind feature flags; other markets gated off.
- **Rationale:** Single-language keeps SOS/legal copy safe; two markets exercise both strict (UK GDPR) and variable-connectivity paths.

## 2. Vehicle compatibility
- **Decision:** MVP supports: (a) OEM cloud-connected vehicles with public/partner API, (b) phone-as-sensor (GPS + BT) fallback with limited features. No hardware dongle in MVP.
- See `docs/COMPATIBILITY.md` for make/model/year matrix starter (to fill with 10 pilot VINs).

## 3. Connection requirements
- **Decision:** BT/RF = nearby only (lock/unlock where OEM allows, no remote tracking). Remote tracking/commands require OEM cloud link. App labels each capability source.
- **Rationale:** Kills the #1 false-expectation risk (PRD §13.2).

## 4. Emergency-service integration
- **Decision:** No direct dispatch API in MVP. SOS = notify emergency contacts + deep-link/call button + location share. Direct integration added per-market in Phase 7+ only where verified.
- Copy locked: "CSAP is not an emergency service."

## 5. Subscription details
- **Decision:** Free: 1 vehicle, essential alerts (SMS+email+in-app), dashboard, basic trusted users. Premium: up to 5 vehicles, 30-day location history, automation, expanded reports. Prices TBD pre-launch; billing monthly/annual; no trial-expiry model.
- Refunds: published 14-day case-by-case + statutory rights preserved.

## 6. Retention periods
- **Decision:** Events/alerts 90 days, precise location 30 days (Premium) / 7 days (Free, last-known only), incident reports kept until owner deletes, audit log 1 year. Owner delete honored within 30 days except legal-hold items (listed in privacy page).

## 7. Account recovery
- **Decision:** Password reset via email code + backup code issued at signup. If inbox lost: support-assisted ID check + 48h delay + revoke vehicle commands until re-verified + owner notification to all contacts.

## 8. Manual updates
- **Decision:** In-app banner + release notes for every update; critical security updates get blocking advisory (not forced install). Supported-versions list in help centre, N-2 policy.

## 9. Automation rules (v1)
- **Decision:** Two rules only: (a) parked (reliable OEM event) → suggest Enhanced Protection, (b) suspected theft → mode + tracking boost. No auto-immobilise. All automations require explicit opt-in + failure notification.

## 10. Emergency escalation
- **Decision:** Qualifying: SOS + confirmed accident + suspected theft with movement. Ack timeout 5 min, 1 reminder at 2 min. Escalation message states "owner has not acknowledged" + minimal location + incident type. Routine alerts never escalate.

## 11. Risk indicator
- **Decision:** Low/Medium/High from: connection state + unacked critical alerts + protection gaps + staleness. "Unknown" when data <50% fresh. Every rating shows "why" list. Never guarantees safety.

## 12. Refund policy
- **Decision:** As §5 above; support page + checkout both link policy; Premium paywall shows vehicle limits + renewal/cancel before purchase.

## 13. Support commitments
- **Decision:** Help centre + email, Mon–Fri 9–18 WAT/GMT, 48h first-response target. Banner: "Support is not emergency response."

## 14. Privacy & legal review
- **Decision:** UK GDPR + Nigeria NDPR baseline: data minimisation, owner-only location default, separate vehicle vs location grants, temp-share auto-expiry, DPA for R2/Resend vendors. Legal sign-off required before launch (Phase 11 gate).

## 15. Release plan
- **Decision:** MVP = Phases 4–7 (identity/onboarding/vehicle, dashboard/controls/modes, tracking/privacy, alerts/SOS). Fast-follow Phases 8–10. Broad rollout only after §14 readiness checklist + 10-vehicle pilot.

---
**Sign-off:** reply "Phase 0 approved" to lock; any change after that needs ADR.
