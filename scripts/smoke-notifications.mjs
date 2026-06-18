import { existsSync, readFileSync } from 'node:fs';

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : '';
}

const apiBase = (argValue('--base-url') || process.env.VITE_COHORTLY_API_BASE || process.env.COHORTLY_API_BASE || 'http://127.0.0.1:4173').replace(/\/$/, '');
const email = argValue('--email') || process.env.COHORTLY_SMOKE_EMAIL || `smoke-${Date.now()}@mymail.sutd.edu.sg`;

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  return { status: response.status, ok: response.ok, body };
}

async function main() {
  const results = [];

  results.push({
    name: 'status',
    ...(await request(`/api/notifications/status?email=${encodeURIComponent(email)}`)),
  });

  results.push({
    name: 'preferences',
    ...(await request('/api/notifications/preferences', {
      method: 'POST',
      body: JSON.stringify({ email, onAnswer: true, onEvent: true, onConnection: true }),
    })),
  });

  results.push({
    name: 'telegram-unregistered-connect',
    ...(await request('/api/notifications/telegram/connect', {
      method: 'POST',
      body: JSON.stringify({ email, username: `cohortly_smoke_${Date.now()}` }),
    })),
  });

  results.push({
    name: 'whatsapp-invalid-connect',
    ...(await request('/api/notifications/whatsapp/connect', {
      method: 'POST',
      body: JSON.stringify({ email, phone: '+6500000000' }),
    })),
  });

  if (process.env.COHORTLY_NOTIFICATIONS_ADMIN_TOKEN) {
    results.push({
      name: 'dispatch-without-connected-channel',
      ...(await request('/api/notifications/dispatch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.COHORTLY_NOTIFICATIONS_ADMIN_TOKEN}` },
        body: JSON.stringify({ email, type: 'system', text: 'Cohortly smoke dispatch.' }),
      })),
    });
  } else {
    results.push({
      name: 'dispatch-token',
      status: 0,
      ok: false,
      body: { message: 'Skipped because COHORTLY_NOTIFICATIONS_ADMIN_TOKEN is not set locally.' },
    });
  }

  console.log(JSON.stringify({ apiBase, email, results }, null, 2));

  const statusOk = results.find((item) => item.name === 'status')?.ok;
  const prefsOk = results.find((item) => item.name === 'preferences')?.ok;
  if (!statusOk || !prefsOk) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
