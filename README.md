# Cohortly

Cohortly is a verified, student-led campus network. Schools promote the invite link to incoming students, while students create the actual value: first-week events, class rooms, mentor questions, interest circles, and small group messages.

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
