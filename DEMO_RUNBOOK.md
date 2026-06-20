# Cohortly Demo Runbook

## Pre-Demo Checks

Run from the repo root:

```bash
npm install
npm audit --audit-level=high
npx tsc -p tsconfig.app.json --noEmit
npm run test:personas
npm run build
```

For local visual QA:

```bash
npm run dev -- --host 127.0.0.1
npm run visual:qa
```

For notification provider checks:

```bash
npm run notifications:check -- --strict
npm run notifications:smoke -- --base-url https://your-render-service.onrender.com --email you@mymail.sutd.edu.sg
```

## Persona Demo Path

1. Landing: show the three student journeys: Freshman, Returning, and Exchange. The point is that Cohortly no longer treats all students the same, while keeping help open to every verified student.
2. Freshman demo: open Today, Launchpad, People, Classes, Events, Campus Life, and Notifications. Emphasize Day 1 readiness and verified module/community support.
3. Returning demo: open Today, Year Hub, People, Classes, Fifth Row, and Campus Life. Emphasize current-term groups by year, pillar, module, project needs, interests, and shared peer help.
4. Exchange demo: open Today, Exchange Guide, People, Campus Life, Events, and Resources. Emphasize campus/admin context and local classmates without Freshmore onboarding.
5. Admin demo: show readiness, support signals, event oversight, invite provisioning, and provider status.
6. Notifications: show Telegram and WhatsApp setup states; only dispatch real messages when provider status is configured.

## Campus Life Talking Points

- Cohortly does not publish room numbers, floors, resident rosters, room maps, or live occupancy.
- Official SUTD Housing remains the source of truth for assignments and policies.
- Campus Life is for broad belonging: jios, returning-student guidance, commuter support, and private settling-in help.

## Deploy Checklist

1. Build the production bundle.
2. Push the source branch.
3. Copy `dist/` to the `gh-pages` worktree while preserving `.nojekyll`.
4. Commit and push `gh-pages`.
5. Open the GitHub Pages URL and hard refresh.
6. Re-run visual QA against the live URL when possible.

## Production-Readiness Evidence

- `npm run test:personas` checks the required `StudentJourneyStage`, `AppWorkspace`, profile schema migration, journey-aware nav, persona demos, and visual-QA persona coverage.
- `npm run visual:qa` captures desktop and mobile flows for Freshman, Returning, Exchange, Admin, Campus Life, Notifications, People, Privacy, and the public landing page.
- GitHub Pages is a static demo surface. Telegram and WhatsApp delivery require the Render backend and provider secrets; the frontend must show clear setup and unavailable-provider states when those secrets are absent.
