# Cohortly V4 Product Redesign Decisions

## Product Thesis

Cohortly V4 is a verified campus community product for the period before Day 1 and the first weeks of term. The student experience must reduce uncertainty, create human connection, and make one next action obvious. Mentor and admin experiences share the same brand but use different density and decision language.

## Final IA

### Student

- Primary mobile destinations: Today, People, Events, Classes, More.
- More sheet destinations: Messages, Launchpad, Fifth Row, Hostel, Resources.
- Desktop rail keeps direct access to all student destinations for demo efficiency.

### Mentor

- Primary mobile destinations: Home, Help, Students, Chats, More.
- More sheet destinations: Events, Classes.
- Desktop rail is mentor-specific: Dashboard, Help Requests, Students, Events, Messages.

### Admin

- Staff-only preview with operational navigation: Overview, Outcomes, Students, Class Rooms, Events, Alerts, Invite Manager, Roster Import, Isolation Risk.
- Admin keeps higher density, tables, filters, and direct actions because staff workflows are repeated and operational.

## Feature Decisions

| Feature | User job | Current problem | Decision | Reason |
|---|---|---|---|---|
| Today | Know what matters next and take one useful action | Too close to a dashboard when equal cards compete | Improve | Keep as flagship student screen but preserve a single next-best action and human context before metrics |
| Launchpad | Understand arrival milestones without anxiety | Felt like a project-management board with too many tasks at once | Improve | Keep phased journey, emphasize current milestone, support requests, and expandable details |
| Events | Discover plans, peers, time, place, and RSVP | Calendar-first structure made discovery secondary | Improve | Keep calendar as support layer while event cards and plans remain primary |
| People | Find classmates, seniors, and useful relationships | CRM-like cards and compatibility percentages overpowered personality | Improve | Keep matching, but copy and card hierarchy now emphasize why to connect and direct messaging |
| Fifth Row | Discover clubs and cultural entry points | Uniform cards lacked editorial personality | Improve | Keep, with stronger cluster language, trial dates, beginner signals, and interest actions |
| Classes | Get trusted module help from seniors | Previous dark-mode and cramped composer issues hurt trust | Improve | Keep module rooms and Q&A, strengthen readable light surfaces, senior answer states, and enrollment controls |
| Hostel | Settle into living arrangements and meet nearby people | Pseudo-3D directory made the view feel game-like and not practical | Replace | Default is now home-base, nearby jios, practical move-in info, privacy, and support; directory is secondary |
| Knowledge Base / Resources | Find verified answers and support material | Article list felt settings-like and disconnected | Relocate | Label as Resources in mobile More; keep searchable KB as secondary support surface |
| Messages | Continue people connections and mentor help | Thread list and composer needed stronger viewport anchoring | Improve | Keep persistent composer, People-to-message flow, local persistence, and role-aware mentor threads |
| Search | Jump to screens and answers quickly | Useful but secondary | Keep | Global keyboard search remains available and supports task flow |
| Notifications | See important answers, connections, and event changes | Counts can feel noisy if overemphasized | Improve | Keep but route actions to relevant views and keep profile-menu access |
| AI assistant | Ask campus/product questions quickly | Risk of feeling like generic bot if central | Relocate | Keep as secondary helper, not a primary nav item |
| Mentor dashboard | Know who needs help and act fast | Dormant code was not reachable from role selection | Improve | Re-enabled real mentor role, dashboard, help queue, and mentor message mode |
| Mentor help | Reply to student questions requiring attention | Dormant and not productized | Improve | Keep as service queue with urgent requests and module filtering |
| Admin overview | Understand cohort adoption and support risk | Student visual language reused too heavily | Improve | Keep restrained operational dashboard and direct preview access |
| Admin students | Find students who may need outreach | Needed credible hierarchy over decorative metrics | Improve | Keep row-based density, risk tags, and connection/event context |
| Admin classes | See module Q&A health | Needs staff action framing | Improve | Keep table health view with response rates and mentor coverage |
| Admin alerts | Turn signals into action | Alerts needed actions, not just labels | Improve | Keep actionable alert list with notify/recruit/check-in language |
| Admin interventions | Track outreach and support ownership | Needed clearer operational posture | Improve | Keep intervention cases and stage changes |
| Admin invites | Manage onboarding access | Essential for university rollout | Keep | Keep invite manager and roster import flow for deployment credibility |

## Data Decisions

- Replaced landing fake live metrics with verified-access and product-story language.
- Added mentor demo path instead of routing returning students back into student onboarding.
- Kept demo data local and deterministic for offline GitHub Pages reliability.
- Preserved static-hosted auth fallback, Firebase profile/event/Q&A listeners, and localStorage fallbacks.

## Brand Decisions

- Replaced recreated SVG mark in production UI with cleaned PNG derived from the provided original logo.
- Preserved the blue C, inner white student form, support gesture, black cap, and original proportions.
- Added original, transparent, monochrome, reversed, favicon, and app-icon PNG variants.
