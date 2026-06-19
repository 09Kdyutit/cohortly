# Cohortly Product Decisions

## Final Demo Position

Cohortly is a verified SUTD student community product for freshmen, returning students, and student-life staff. The demo should communicate one promise: students can find people, plans, module help, and support before Day 1 without making private student location data public.

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

## Returning Students

Cohortly does not present a separate mentor concept in the student experience. Returning students are grouped by year, pillar, module, activity, and availability. Copy should say returning students, not mentors, unless referring to staff/admin legacy labels.

## Notifications

Telegram and WhatsApp features are preserved as server-backed integrations. The static frontend can collect preferences; provider delivery requires server secrets and webhooks. Demo scripts must verify status and show clear provider setup states rather than pretending a missing provider is live.
