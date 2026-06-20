# Product

## Register

product

## Users

Incoming SUTD Freshmores, exchange students, returning Year 2/3/4 students, and SUTD student-life staff use Cohortly around orientation and the first weeks of term. Freshmores need confidence before Day 1: who to meet, what to attend, where to get help, how to settle into campus life, and how to understand modules without feeling lost. Exchange students need fast campus context, local classmates, admin steps, and useful first-week routes without being treated like first-year students. Returning students need a calm way to find classmates by year, pillar, current modules, project needs, Fifth Row interests, and broad campus-life context. Any verified student can help another student through shared module rooms, events, People profiles, and messages; Cohortly does not create a separate mentor workspace. Staff need credible operational visibility into adoption, readiness, wellbeing signals, events, classes, and support risks.

## Product Purpose

Cohortly is a verified university community product that understands where each student is in their university journey. It brings people, module help, events, Fifth Row culture, campus life, onboarding tasks, messaging, and support signals into one trusted experience. Success means a student can understand what matters next in seconds, take one useful action, and feel that the university community is already working at the right level for them.

## Brand Personality

Composed, warm, credible. Cohortly should feel human and socially inviting without becoming casual or childish; institutional without becoming bureaucratic; technologically confident without looking like an AI or gaming product.

## Anti-references

Cohortly must not look like a student project, hackathon dashboard, generic dark SaaS template, AI-purple/cyan card grid, Discord clone, CRM directory, support-ticket tool, Jira board, game-like hostel simulation, or decorative admin dashboard. Avoid neon glows, gradient text, glass everywhere, equal card soup, default calendars, fake browser chrome, and novelty charts.

## Design Principles

1. Community before controls: every student screen should foreground people, arrival, and the next useful action before navigation chrome or metrics.
2. Institutional trust with consumer warmth: use clear hierarchy, readable typography, restrained color, and credible data while keeping the product welcoming.
3. One focal point per screen: avoid stacks of equal cards; compose each view around the decision or feeling it needs to create.
4. Distinct registers by stage: Freshmore, exchange, returning student, and admin experiences share the brand but use different density, surface, and navigation behavior.
5. Offline demo reliability: the core demo must work without backend availability, broken requests, or surprising blockers.

## Persona Architecture

Profiles are migrated to schema version 2 and carry a `journeyStage` plus `workspace`.

- `pre_arrival` and `freshmore`: readiness, Day 1 setup, first module rooms, events, people, and campus-life support.
- `exchange`: campus/admin context, local classmates, routes, and first-week plans without Freshmore onboarding.
- `returning`: current-term module rooms, project/team discovery, Fifth Row activity, year/pillar peer grouping, and optional peer help inside shared rooms.
- `admin`: operational readiness, support signals, event oversight, and notification provider status.

## Accessibility & Inclusion

Target WCAG AA contrast for text and controls, visible focus states, keyboard-accessible controls, reduced-motion support, minimum 44px touch targets on mobile, no color-only status meaning, no horizontal overflow, and clear error/empty/loading states. The product should be usable in daylight on laptops and phones during orientation, not only in a dark demo environment.
