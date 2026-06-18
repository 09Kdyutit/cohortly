# Cohortly

Cohortly is a verified, student-led campus network. Schools promote the invite link to incoming students, while students create the actual value: first-week events, class rooms, returning-student help, interest circles, hostel groups, and small group messages.

The app now includes server-side university access checks instead of client-only validation. A user must pass an institution email domain check, student ID format check, OTP verification, and a signed HTTP-only session cookie before entering the onboarding flow.

## Run Locally

```bash
npm install
npm run dev
```

The local app runs at `http://localhost:5173/`.

In local development, the verification code is displayed in the UI and logged by the auth middleware so the full flow can be tested.

## Production Build

```bash
npm run build
npm start
```

The static build is emitted to `dist/`. `npm start` serves the built app and the auth API from `server/production-server.mjs`.

## Auth Configuration

Set `COHORTLY_SESSION_SECRET` in any real deployment.

For production OTP delivery, set `COHORTLY_OTP_WEBHOOK_URL` to an email/SMS service webhook. Cohortly posts `{ to, code, institution, subject, text }` to that endpoint. Optionally set `COHORTLY_OTP_WEBHOOK_SECRET` to send a bearer token.

Available auth endpoints:

- `GET /api/auth/institutions`
- `POST /api/auth/start`
- `POST /api/auth/verify`
- `GET /api/auth/me`
- `POST /api/auth/logout`

## Telegram and WhatsApp Alerts

The static GitHub Pages app can collect notification preferences, but real Telegram and WhatsApp delivery must run from a server because both providers require private tokens and webhooks.

Server endpoints are implemented in `server/notifications-core.mjs` and mounted by `server/production-server.mjs`:

- `POST /api/notifications/telegram/webhook`
- `GET /api/notifications/whatsapp/webhook`
- `POST /api/notifications/whatsapp/webhook`
- `POST /api/notifications/telegram/connect`
- `POST /api/notifications/whatsapp/connect`
- `POST /api/notifications/test`

Required production secrets:

```bash
TELEGRAM_BOT_TOKEN=...
WHATSAPP_CLOUD_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
```

Telegram setup: create `@CohortlyBot` in BotFather, set its webhook to `/api/notifications/telegram/webhook`, then have each student press Start before verifying their username in the app.

WhatsApp setup: create a Meta WhatsApp Cloud API app, connect a verified phone number, set `WHATSAPP_CLOUD_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`, then require students to opt in by messaging the number before alerts are sent.
