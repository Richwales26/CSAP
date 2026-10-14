// Better Auth sketch (Phase 4). Full wiring after `pnpm install`.
// Rules: password + email code, fingerprint on device only, NO face.

import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: { enabled: true, requireEmailVerification: true },
  // email code via Resend (R2_* / RESEND_* come from .env)
  // session: owner-only spot by default; temp share ends by itself
});
