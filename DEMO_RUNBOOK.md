# Cohortly Demo Runbook

## Pre-Demo Checks

Run from the repo root:

```bash
npm install
npm audit --audit-level=high
npx tsc -p tsconfig.app.json --noEmit
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

## Demo Path

1. Landing: show verified SUTD positioning and the Microsoft SSO/manual demo path.
2. Today: show next-best action, belonging pulse, and student workspace.
3. People: show freshmen and returning students grouped by year/module, then open a profile modal.
4. Events: show first-week plans and approval-safe event creation.
5. Classes: show module rooms and returning-student Q&A.
6. Campus Life: show broad home base, first-week jios, move-in guidance, and the privacy card.
7. Notifications: show Telegram and WhatsApp setup states; only dispatch real messages when provider status is configured.
8. Admin: show readiness, support signals, and operational view.

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
