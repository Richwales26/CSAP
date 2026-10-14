# CSAP Local Stack (local-first, scale later)

Locked decisions (per owner, Oct 2026):
- **DB:** PostgreSQL 16 in Docker on this Mac. No managed-DB subscription.
- **Proxy/hosting:** Caddy on this Mac (`infra/Caddyfile`). `csap.localhost` → web, `api.csap.localhost` → API.
- **Auth:** Better Auth (password + email/SMS code, optional fingerprint, no facial recognition).
- **Files:** Cloudflare R2 (S3-compatible).
- **Email:** Resend.

## Prereqs
1. Docker Desktop for Mac (Intel): download `https://desktop.docker.com/mac/main/amd64/Docker.dmg`, open, drag to Applications, start it.
2. Caddy: already installed to `~/.local/bin/caddy` (v2.11.7). Add to PATH:
   `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`
3. Copy env: `cp .env.example .env` then fill `R2_*` + `RESEND_API_KEY`.

## Run
```bash
# DB
docker compose -f infra/docker-compose.yml up -d
docker exec csap-postgres pg_isready -U csap -d csap

# Proxy (after apps exist; safe to run now — returns 502 until apps listen)
~/.local/bin/caddy run --config infra/Caddyfile --adapter caddyfile
```

URLs (once apps exist):
- Web: http://csap.localhost
- API: http://api.csap.localhost

## Scale-up later
- Move `infra/docker-compose.yml` postgres → managed Postgres (Neon/RDS) by changing `DATABASE_URL` only.
- Move Caddy file unchanged to a VPS; turn `auto_https` on and add real domain.
- R2 + Resend need no change — already SaaS with S3/API interfaces.
