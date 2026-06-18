# Cohortly Design System

## Thesis

Cohortly is a verified campus community product: warm enough for new students, credible enough for SUTD staff, and structured enough to feel operational. The design thesis is "your campus, before Day 1" — the product should make the cohort feel present before orientation starts.

## Brand System

- Primary mark: cobalt `C` with a protected inner student/connection gesture, derived from the provided logo reference.
- Assets: `src/assets/cohortly-mark.svg`, `src/assets/cohortly-mark-mono.svg`, `src/assets/cohortly-lockup.svg`, and `public/favicon.svg`.
- Logo reference: `src/assets/cohortly-logo-reference.jpeg`.
- Usage: the compact mark is used in the app rail, landing nav, loading/auth states, and favicon. The mark sits on a white rounded square with a restrained cobalt shadow.

## Color

- Canvas: light institutional blue-gray (`--canvas`, `--canvas-warm`) with subtle campus-grid texture.
- Primary: cobalt (`--cobalt-500/600/700`) for navigation, primary actions, current states, and key student progress.
- Surfaces: white and very pale cobalt surfaces with one border and one shadow layer.
- Status: green for success/online, amber for help-needed, red only for risk/destructive states.
- Avoid: neon glows, purple/cyan AI gradients, gradient text, heavy glass, dark card soup, and color-only meaning.

## Typography

- Font: Manrope variable via `@fontsource-variable/manrope`.
- Headings: large, confident, tightly spaced, but scoped to true page or hero moments.
- Product UI: dense enough for repeated use, with readable body copy and tabular figures where counts matter.

## Layout

- App shell: icon rail on desktop, sticky topbar, mobile bottom nav with a More sheet for secondary destinations.
- Landing: first viewport shows brand, offer, SSO/manual entry, and a real product preview with the next content peeking below.
- Today: one large orientation greeting, one next-best action, then supporting cards.
- People: compatibility directory with explicit featured variants, search, and year/module filters.
- Events: plan-first calendar plus selected-day detail rail.
- Classes: module-room list plus Q&A workspace, styled controls, answer states, anonymous posting, and import flow.
- Hostel: light floor directory and block selector, not a game-like dark simulation.

## Components

- Buttons use `primary`, `secondary`, `text`, and `icon` roles with minimum touch targets and visible focus.
- Cards use 12-16px radius, 1px borders, and one shadow layer.
- Featured states use explicit classes such as `person-card--featured`; layout meaning is not tied to DOM order.
- Mobile controls are sized for thumbs and avoid horizontal overflow.

## Motion & Accessibility

- Motion is limited to transform/opacity transitions on interaction.
- `prefers-reduced-motion` disables transitions and animations.
- Focus states are visible across links, buttons, form controls, and role buttons.
- Text and controls target WCAG AA contrast on the implemented palette.

## Verification

Screenshots were captured for landing, Today, People, Events, Classes, Messages, Launchpad, Fifth Row, and Hostel on desktop and mobile into `.agents/shots/rebuild-final/`. Build and TypeScript checks are part of the delivery contract.
