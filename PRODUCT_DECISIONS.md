# Cohortly Product Decisions

## Final Demo Position

Cohortly is a verified SUTD campus platform for incoming Freshmores, exchange students, returning students, and student-life staff. The demo should communicate one promise: the product understands where each student is in their university journey and gives them the right experience without making private student location data public. Help is peer-based: any verified student can answer, host, guide, or connect when they know something useful.

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
  | 'admin';
```

Implementation contract:
- `profileVersion: 2` is written to saved profiles.
- `normalizeProfile()` migrates older localStorage and Firestore profiles into schema v2.
- Freshmore and pre-arrival students see Launchpad-style readiness.
- Returning Year 2/3/4 students see a Year Hub focused on current modules, project groups, opportunities, and optional junior support.
- Exchange students see an Exchange Guide focused on fast campus/admin/local context.
- Peer help happens inside shared module rooms, People, Messages, and Events. There is no separate mentor workspace, mentor demo, or mentor-only help queue.
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

## Returning Students And Peer Help

Returning students are not Freshmores and must never be pushed through Freshmore onboarding copy. They are grouped by year, pillar, current modules, project/team needs, activities, and availability.

Returning students can still be helpful, but they are not a separate product role. Use "returning student" for Year 2/3/4 browsing and "peer help" for answers, study sessions, intros, and guidance that happen in shared rooms.

## Notifications

Telegram and WhatsApp features are preserved as server-backed integrations. The static frontend can collect preferences; provider delivery requires server secrets and webhooks. Demo scripts must verify status and show clear provider setup states rather than pretending a missing provider is live.
