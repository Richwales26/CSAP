# CSAP Components (Phase 1)

Simple list. All use `design/tokens.json`. All show honest status.

- **Button** — big, easy to tap. Red for SOS. Blue for main action. Grey for second choice.
- **Input** — clear label, plain hint text, clear error text.
- **Card** — box that groups related info (like locks, tracking).
- **Badge / Pill** — small label: ACTIVE, UNAVAILABLE, STALE, UNKNOWN.
- **AlertBanner** — top message for urgent news. Calm words, no panic.
- **StatusDot** — green, amber, red, grey dot + words. Never color alone.
- **RiskIndicator** — Low / Medium / High + "why?" list. Or "Unknown" if info is old.
- **Timeline** — list of events with time. Facts first, guesses marked as guesses.
- **MapPin** — map box. Shows LIVE or LAST-KNOWN + time. Last-known is never shown as live.
- **PermissionRow** — who can see what. Owner only by default. Easy revoke.
- **EmptyState** — friendly message when there is nothing to show + next step.
- **WalkthroughCoachmark** — short tip that you can skip and return to later.

## Rules
1. Always use words with color.
2. Always show time for old info.
3. Never say success when not sure. Use: Sent / Failed / Not sure yet.
4. SOS page always says: "CSAP is not an emergency service."
