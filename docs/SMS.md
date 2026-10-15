# CSAP SMS Trial (safe key steps)

Simple rule: keys live ONLY in your local `.env` file. Never in chat. Never in GitHub.

## Step 1 — Make your `.env`
```bash
cp .env.example .env
```
`.env` is ignored by git. Safe.

## Step 2 — Add keys (you type, I never see)
Open `.env` in a text app. Fill:
- `TWILIO_ACCOUNT_SID=` + `TWILIO_AUTH_TOKEN=` + `TWILIO_FROM=` (from twilio.com/console)
- Or `TEXTBELT_KEY=textbelt` for 1 free test per day
- `SMS_TEST_TO=+234...` — your own phone with country code

Save. Done. Do NOT paste keys in chat or email.

## Step 3 — Test (after API runs)
```bash
export DATABASE_URL=postgresql://csap:csap_dev_password_change_me@localhost:5432/csap
export $(cat .env | xargs)  # load keys for this shell only
curl -X POST http://localhost:8001/sms/test -H 'content-type: application/json' -d '{"to":"+234...","message":"CSAP test"}'
```
Good = `{"ok":true,"via":"twilio","state":"sent"}` and your phone beeps.
`unsent-no-key` = `.env` not loaded. Check step 2.

## How it is used
- SOS + urgent alerts auto-text `SMS_TEST_TO` when keys exist.
- Normal flow still works with no keys (state shows `unsent-no-key`, nothing breaks).
- Full key is never logged. Logs show only `AB***12`.
