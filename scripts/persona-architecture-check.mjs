import { readFileSync } from 'node:fs';

const app = readFileSync('src/App.tsx', 'utf8');
const visualQa = readFileSync('scripts/visual-qa.mjs', 'utf8');

const checks = [
  ['StudentJourneyStage type exists', /type StudentJourneyStage\s*=\s*'pre_arrival'\s*\|\s*'freshmore'\s*\|\s*'returning'\s*\|\s*'exchange'/.test(app)],
  ['AppWorkspace type exists', /type AppWorkspace\s*=\s*'student'\s*\|\s*'mentor'\s*\|\s*'admin'/.test(app)],
  ['Profile schema version exists', /const PROFILE_SCHEMA_VERSION\s*=\s*2/.test(app)],
  ['Profile normalizer exists', /function normalizeProfile\(/.test(app)],
  ['Load path normalizes profiles', /return raw \? normalizeProfile/.test(app) && /return normalizeProfile\(\{ \.\.\.data/.test(app)],
  ['Demo modes include freshman returning exchange mentor', /type DemoMode\s*=\s*'freshman'\s*\|\s*'returning'\s*\|\s*'exchange'\s*\|\s*'mentor'/.test(app)],
  ['Returning demo is stage-aware', /journeyStage:\s*'returning'/.test(app) && /campusCommunity:\s*'returning-guides'/.test(app)],
  ['Exchange demo is stage-aware', /journeyStage:\s*'exchange'/.test(app) && /campusCommunity:\s*'commuter-campus'/.test(app)],
  ['Mentor demo uses mentor workspace', /workspace:\s*'mentor'/.test(app) && /role:\s*'mentor'/.test(app)],
  ['Journey plans exist', /const journeyPlans:\s*Record<StudentJourneyStage,\s*JourneyPlan>/.test(app)],
  ['Student nav is journey-aware', /function studentNavItemsFor\(profile: StudentProfile\)/.test(app)],
  ['Student app respects mentor workspace', /const isMentor = workspace === 'mentor'/.test(app)],
  ['People view receives profile context', /function PeopleView\(\{ userEmail, onMessage, profile \}/.test(app)],
  ['Visual QA captures returning exchange mentor', /for \(const mode of \['returning', 'exchange', 'mentor'\]\)/.test(visualQa)],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
}

if (failed.length > 0) {
  console.error(`\n${failed.length} persona architecture check(s) failed.`);
  process.exit(1);
}

console.log('\nPersona architecture checks passed.');
