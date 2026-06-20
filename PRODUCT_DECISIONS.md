# Cohortly Product Decisions

## Final Demo Position

Cohortly is a verified SUTD campus platform for incoming Freshmores, exchange students, returning students, senior mentors, and student-life staff. The demo should communicate one promise: the product understands where each student is in their university journey and gives them the right workspace without making private student location data public.

## Persona Architecture

Decision: Cohortly no longer treats `student` as one universal experience.

Schema contract:

```ts
type StudentJourneyStage =
  | 'pre_arrival'
  | 'freshmore'
  | 'returning'
  | 'exchange';

type AppWorkspace =
  | 'student'
  | 'mentor'
  | 'admin';
```

Implementation contract:
- `profileVersion: 2` is written to saved profiles.
- `normalizeProfile()` migrates older localStorage and Firestore profiles into schema v2.
- Freshmore and pre-arrival students see Launchpad-style readiness.
- Returning Year 2/3/4 students see a Year Hub focused on current modules, project groups, opportunities, and optional junior support.
- Exchange students see an Exchange Guide focused on fast campus/admin/local context.
- Senior mentors are returning students using a separate mentor workspace for help requests and module support.
- Admin remains a separate workspace with institutional operational visibility.

## Campus Life Replaces Hostel Directory

Decision: remove the old Hostel building/directory concept and replace it with Campus Life.

Rationale:
- Exact room, floor, resident, and occupancy data is too sensitive for a public demo.
- Publicly accurate room rosters and floor plans are not available in the repo and should not be guessed.
- Students still need move-in help, meal jios, study plans, housing guidance, and settling-in support.

Implementation contract:
- No 3D hostel building, room windows, floor grids, exact room picker, resident roster, online occupancy, room map, or floor directory UI.
- Campus Life uses broad communities only: Freshmore arrival, returning-student guides, commuter groups, and private settling-in support.
- Official Housing remains the source of truth for assignments, policies, maintenance, and access.

## Student Navigation

Primary student destinations stay focused:
- Today
- People
- Events
- Classes
- More

Secondary destinations live behind More:
- Messages
- Launchpad
- Fifth Row
- Campus Life
- Resources

## Returning Students And Mentors

Returning students are not Freshmores and must never be pushed through Freshmore onboarding copy. They are grouped by year, pillar, current modules, project/team needs, activities, and availability.

Senior mentors are a separate workspace, not the default returning-student experience. Use "returning student" for normal Year 2/3/4 browsing and "senior mentor" only for the help-request/module-support workspace.

## Notifications

Telegram and WhatsApp features are preserved as server-backed integrations. The static frontend can collect preferences; provider delivery requires server secrets and webhooks. Demo scripts must verify status and show clear provider setup states rather than pretending a missing provider is live.
