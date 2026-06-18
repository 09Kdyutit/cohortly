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

- `GET /api/notifications/status`
- `POST /api/notifications/telegram/webhook`
- `GET /api/notifications/whatsapp/webhook`
- `POST /api/notifications/whatsapp/webhook`
- `POST /api/notifications/telegram/connect`
- `POST /api/notifications/whatsapp/connect`
- `POST /api/notifications/preferences`
- `POST /api/notifications/disconnect`
- `POST /api/notifications/dispatch`
- `POST /api/notifications/test`

Required production secrets:

```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=...
WHATSAPP_CLOUD_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_APP_SECRET=...
COHORTLY_NOTIFICATIONS_ADMIN_TOKEN=...
```

Recommended Render deployment:

1. Deploy the repo with `render.yaml`.
2. Fill in all `sync: false` env vars in the Render dashboard.
3. Keep the persistent disk mounted at `/var/data`; bot registrations are stored in `/var/data/notifications.json`.
4. Set the GitHub Pages build env `VITE_COHORTLY_API_BASE` to the Render service URL if the static Pages site remains the public frontend.
5. Run `npm run notifications:webhooks -- --base-url https://your-render-service.onrender.com` after the Render service is live.
6. Run `npm run notifications:smoke -- --base-url https://your-render-service.onrender.com --email you@mymail.sutd.edu.sg` to verify the API and provider setup behavior.

Telegram setup: create `@CohortlyBot` in BotFather, set `TELEGRAM_BOT_TOKEN`, set `TELEGRAM_WEBHOOK_SECRET`, then run the webhook setup script. Students must press Start before verifying their username in the app.

WhatsApp setup: create a Meta WhatsApp Cloud API app, connect a verified phone number, set `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, and `WHATSAPP_BUSINESS_PHONE`, then configure the Meta webhook callback to `/api/notifications/whatsapp/webhook`. Students must opt in by messaging the number before alerts are sent. Out-of-window WhatsApp alerts require approved Meta message templates; set `WHATSAPP_TEMPLATE_NAME` once the template is approved.
