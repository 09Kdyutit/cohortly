# Cohortly

Cohortly is a verified, student-led campus network. Schools promote the invite link to incoming students, while students create the actual value: first-week events, class rooms, returning-student help, interest circles, campus-life jios, and small group messages.

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
VITE_COHORTLY_API_BASE=...
COHORTLY_ALLOWED_ORIGIN=...
COHORTLY_SESSION_SECRET=...
COHORTLY_NOTIFICATIONS_STORE=/var/data/notifications.json
COHORTLY_NOTIFICATION_TOKEN_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_BOT_USERNAME=...
TELEGRAM_WEBHOOK_SECRET=...
WHATSAPP_CLOUD_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_APP_SECRET=...
WHATSAPP_BUSINESS_PHONE=...
WHATSAPP_GRAPH_VERSION=v25.0
WHATSAPP_TEMPLATE_NAME=...
WHATSAPP_TEMPLATE_LANGUAGE=en_US
COHORTLY_NOTIFICATIONS_ADMIN_TOKEN=...
```

Recommended Render deployment:

1. Deploy the repo with `render.yaml`.
2. Fill in all `sync: false` env vars in the Render dashboard.
3. Keep the persistent disk mounted at `/var/data`; bot registrations are stored in `/var/data/notifications.json`.
4. Set the GitHub Pages build env `VITE_COHORTLY_API_BASE` to the Render service URL if the static Pages site remains the public frontend.
5. Run `npm run notifications:check -- --strict` on the server environment or with `.env.local` present to confirm the required values are set without printing secrets.
6. Run `npm run notifications:webhooks -- --base-url https://your-render-service.onrender.com` after the Render service is live. The `--base-url` flag overrides any stale `TELEGRAM_WEBHOOK_URL` value.
7. Run `npm run notifications:smoke -- --base-url https://your-render-service.onrender.com --email you@mymail.sutd.edu.sg` to verify the API and provider setup behavior.

Telegram setup: create `@CohortlyBot` in BotFather, set `TELEGRAM_BOT_TOKEN`, set `TELEGRAM_WEBHOOK_SECRET`, then run the webhook setup script. Cohortly signs the Telegram deep-link token server-side; students must press Start before verifying in the app. A public Telegram username is optional because the signed start token binds the verified Cohortly email to the Telegram chat ID.

WhatsApp setup: create a Meta WhatsApp Cloud API app, connect a verified phone number, set `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, and `WHATSAPP_BUSINESS_PHONE`, then configure the Meta webhook callback to `/api/notifications/whatsapp/webhook` and subscribe the app to the `messages` webhook field. Students must opt in by sending the pre-filled `start <signed-token>` WhatsApp message before Cohortly will send a confirmation. `STOP`, `UNSUBSCRIBE`, or `CANCEL` disconnects the WhatsApp number.

Out-of-window WhatsApp alerts require an approved Meta template. Create a template named by `WHATSAPP_TEMPLATE_NAME` with language `WHATSAPP_TEMPLATE_LANGUAGE` and one body text variable, for example:

```text
{{1}}
```

Cohortly sends the alert text as that first template parameter. If `WHATSAPP_TEMPLATE_NAME` is not set, Cohortly sends free-form text messages, which only work inside Meta's customer-service window.
