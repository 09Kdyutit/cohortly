# Cohortly Design System

**Brand thesis:** "Your cohort, coming into focus." A verified campus OS that helps an incoming SUTD cohort feel connected before Day 1 — warm, calm, credible, slightly futuristic. Never a dashboard template, never a Discord/Notion clone.

Visual metaphors (used sparingly): arrival, signal, orientation, verified connection, cohort pulse. No glowing network nodes, no particle fields, no fake holograms.

## Color
- Base: `--bg #111827` (blue-charcoal, not pure black), surfaces are lightly tinted glass (`rgba(255,255,255,0.04–0.07)`).
- Primary accent: sky blue `--accent #38bdf8` / `--accent-dark #0ea5e9` / `--accent-deep #0284c7`. Buttons use `--accent-deep` at rest for AA-safer contrast with white text, lighten on hover — never a 3-stop gradient.
- Status: success `#10b981`, warning `#f59e0b`, danger `#ef4444` (urgent only) — never decorative.
- Text: `--ink #e5e7eb`, `--ink-soft`, `--muted`. No pure white cards, no gradient text.

## Surfaces & elevation
- `.panel` is the base card: subtle glass background + 1px border + soft shadow. Depth comes from **one** shadow layer, not stacked colored glows.
- Featured/priority states use explicit variant classes — `person-card--featured`, `for-you-card--featured`, `landing-value-card--lead/--wide` — never `:first-child`/`:nth-child` for layout or feature meaning. DOM order ≠ visual priority.
- Radius scale: `--radius-sm 6px` (buttons/inputs), `--radius 10px` (cards), `--radius-lg 14px` (hero panels).

## Typography
- Inter, system stack. Headings use `text-wrap: balance` (already global). Tabular figures for stat blocks. Avoid tiny uppercase eyebrows on every section — use them only at true section boundaries.

## Motion
- Transform/opacity only. Standard durations via `--dur-fast/base/slow` (120/180/260ms) and `prefers-reduced-motion` is already respected globally.
- No continuous decorative animation (no drifting background orbs, no pulsing brand mark, no shimmer sweep on buttons) — these were present from earlier "premium pass" CSS layers and have been removed; depth now comes from static corner gradients, not animation.
- Modals/sheets: fade + small scale/translate, Esc + backdrop-click to dismiss (Weekly Pulse modal now supports both).

## Component conventions
- `.primary-button`: single source of truth at the top of `styles.css` (no longer redefined 5× through the cascade). Solid `--accent-deep`, white text, subtle press scale, no glow.
- Avatars: flat tinted circle by `color` prop (teal/coral/blue/violet/green) — consistent across People, Messages, previews.
- Aura/compatibility badge: `compat-badge` with `compat-high/good/ok` tiers, color only ever reinforces text, never the sole signal.

## Layout patterns by register
- **Student** screens (Today, People, Events, Classes, Messages, Launchpad, Fifth Row, Hostel): warm, one clear focal action per screen, secondary content visually subordinate.
- **Mentor**: calmer, less playful, priority-ordered help requests.
- **Admin**: denser, tighter grid, restrained status color, real tables — not student cards repainted.

## Empty / loading / error
- No screen should default to an empty state for a seeded demo account — Classes auto-selects the first enrolled room, Hostel auto-seeds a room assignment for the demo profile. Empty states only appear for genuinely-empty user data (e.g. no search results), with a one-line explanation + next step.

## Responsive
- Breakpoints in active use: 1100px (two-col → stack), 768px (tablet), 640px (card grids → single column), mobile bottom nav below ~900px with a "more" sheet for secondary destinations (Launchpad, Fifth Row, Hostel, Knowledge Base).
- Mobile sheets/modals use safe-area padding and stay within the viewport; primary CTAs remain above the bottom nav.
