import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const BASE = process.env.SHOT_BASE || 'http://127.0.0.1:5173';
const OUT = process.env.SHOT_OUT || '.agents/shots/v4-final';

const viewports = {
  desktop1440: { width: 1440, height: 900 },
  desktop1280: { width: 1280, height: 800 },
  desktop1024: { width: 1024, height: 768 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

const studentLabels = new Map([
  ['today', 'Today'],
  ['people', 'People'],
  ['events', 'Events'],
  ['classes', 'Classes'],
  ['messages', 'Messages'],
  ['launchpad', 'Launchpad'],
  ['fifth-row', 'Fifth Row'],
  ['hostel', 'Hostel'],
  ['kb', 'Resources'],
]);

const adminLabels = new Map([
  ['overview', 'Overview'],
  ['students', 'Students'],
  ['classes', 'Class Rooms'],
  ['alerts', 'Alerts'],
  ['invites', 'Invite Manager'],
  ['isolation', 'Isolation Risk'],
]);

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const issues = [];

function issue(label, error) {
  const message = error instanceof Error ? error.message : String(error);
  issues.push({ label, message: message.split('\n')[0] });
  console.log('qa issue', label, message.split('\n')[0]);
}

async function createPage(viewportName) {
  const page = await browser.newPage({ viewport: viewports[viewportName] });
  page.on('console', (msg) => {
    if (msg.type() === 'error') issues.push({ label: 'console', message: msg.text() });
  });
  page.on('pageerror', (error) => issues.push({ label: 'pageerror', message: error.message }));
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#root').waitFor({ state: 'attached', timeout: 20000 });
  await page.locator('#root > *').first().waitFor({ state: 'visible', timeout: 20000 });
  await acceptConsent(page);
  return page;
}

async function acceptConsent(page) {
  const accept = page.locator('.consent-actions .primary-button').first();
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
    await page.waitForTimeout(250);
  }
}

async function capture(page, name) {
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  console.log('captured', name);
}

async function loginDemo(page, mode = 'freshman') {
  const selector = mode === 'returning' ? '.demo-btn.returning-demo' : '.demo-btn.student-demo';
  await page.locator(selector).first().scrollIntoViewIfNeeded();
  await page.locator(selector).first().click();
  await page.locator('.student-shell').first().waitFor({ timeout: 15000 });
}

async function openAdmin(page) {
  await page.locator('.demo-btn.admin-demo').first().scrollIntoViewIfNeeded();
  await page.locator('.demo-btn.admin-demo').first().click();
  await page.locator('.admin-shell').first().waitFor({ timeout: 15000 });
}

async function navigateStudent(page, id, viewportName) {
  const label = id === 'kb' && viewportName !== 'mobile' && viewportName !== 'tablet'
    ? 'Knowledge Base'
    : studentLabels.get(id);
  if (!label) return;
  if (viewportName === 'mobile' || viewportName === 'tablet') {
    const direct = page.locator(`.mobile-nav-btn:has-text("${label}")`).first();
    if (await direct.isVisible().catch(() => false)) {
      await direct.click();
    } else {
      await page.locator('.mobile-nav-btn:has-text("More")').first().click();
      await page.locator(`.mobile-more-item:has-text("${label}")`).first().click();
    }
  } else {
    await page.locator(`.rail-nav button:has-text("${label}")`).first().click();
  }
  await page.waitForTimeout(500);
}

async function navigateAdmin(page, id) {
  const label = adminLabels.get(id);
  if (!label) return;
  const nav = page.locator(`.admin-nav button:has-text("${label}")`).first();
  if (await nav.isVisible().catch(() => false)) {
    await nav.click();
    await page.waitForTimeout(500);
  }
}

async function authScreens(viewportName) {
  const page = await createPage(viewportName);
  await page.locator('.path-card.student-path').first().click();
  await capture(page, `auth-signin-${viewportName}`);
  await page.close();

  const returning = await createPage(viewportName);
  await returning.locator('.path-card.returning-path').first().click();
  await capture(returning, `auth-returning-signin-${viewportName}`);
  await returning.close();
}

async function studentScreens(viewportName) {
  const page = await createPage(viewportName);
  await loginDemo(page, 'student');
  await capture(page, `student-today-${viewportName}`);

  for (const id of ['people', 'events', 'classes', 'messages', 'launchpad', 'fifth-row', 'hostel', 'kb']) {
    await navigateStudent(page, id, viewportName);
    await capture(page, `student-${id}-${viewportName}`);
  }

  await navigateStudent(page, 'people', viewportName);
  const person = page.locator('.person-card').first();
  if (await person.isVisible().catch(() => false)) {
    await person.click();
    await capture(page, `student-profile-detail-${viewportName}`);
    await page.keyboard.press('Escape').catch(() => undefined);
  }

  await navigateStudent(page, 'people', viewportName);
  const messageButton = page.locator('.person-card .secondary-button:has-text("Message")').first();
  if (await messageButton.isVisible().catch(() => false)) {
    await messageButton.click();
    await capture(page, `student-people-to-message-${viewportName}`);
  }

  const profileChip = page.locator('.profile-chip').first();
  if (await profileChip.isVisible().catch(() => false)) {
    await profileChip.click();
    const edit = page.locator('.profile-menu-action:has-text("Edit profile")').first();
    if (await edit.isVisible().catch(() => false)) {
      await edit.click();
      await capture(page, `student-profile-edit-${viewportName}`);
    }
  }

  await page.close();
}

async function adminScreens(viewportName) {
  const page = await createPage(viewportName);
  await openAdmin(page);
  await capture(page, `admin-overview-${viewportName}`);
  for (const id of ['students', 'classes', 'alerts', 'isolation', 'invites']) {
    await navigateAdmin(page, id);
    await capture(page, `admin-${id}-${viewportName}`);
  }
  await page.close();
}

try {
  for (const viewportName of ['desktop1440', 'mobile']) {
    const page = await createPage(viewportName);
    await capture(page, `landing-${viewportName}`);
    await page.close();
    await authScreens(viewportName);
  }

  for (const viewportName of ['desktop1440', 'desktop1280', 'desktop1024', 'tablet', 'mobile']) {
    await studentScreens(viewportName).catch((error) => issue(`student-${viewportName}`, error));
  }

  for (const viewportName of ['tablet', 'mobile']) {
    await adminScreens(viewportName).catch((error) => issue(`admin-${viewportName}`, error));
  }
} finally {
  await browser.close();
  writeFileSync(path.join(OUT, 'qa-report.json'), JSON.stringify({ base: BASE, out: OUT, issues }, null, 2));
}

if (issues.some((entry) => entry.label === 'pageerror')) {
  process.exitCode = 1;
}
