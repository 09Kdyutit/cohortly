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

function arg(name) {
  return process.argv.includes(name);
}

function isUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function has(name) {
  return Boolean(String(process.env[name] || '').trim());
}

const checks = [
  ['Cohortly API base', 'VITE_COHORTLY_API_BASE', { required: true, url: true }],
  ['Allowed browser origin', 'COHORTLY_ALLOWED_ORIGIN', { required: true, url: true }],
  ['Signed start-token secret', 'COHORTLY_NOTIFICATION_TOKEN_SECRET', { required: false }],
  ['Session secret fallback', 'COHORTLY_SESSION_SECRET', { required: true }],
  ['Dispatch bearer token', 'COHORTLY_NOTIFICATIONS_ADMIN_TOKEN', { required: true }],
  ['Persistent notification store', 'COHORTLY_NOTIFICATIONS_STORE', { required: true }],
  ['Telegram bot token', 'TELEGRAM_BOT_TOKEN', { required: true }],
  ['Telegram bot username', 'TELEGRAM_BOT_USERNAME', { required: true }],
  ['Telegram webhook URL', 'TELEGRAM_WEBHOOK_URL', { required: true, url: true }],
  ['Telegram webhook secret', 'TELEGRAM_WEBHOOK_SECRET', { required: true }],
  ['WhatsApp Cloud token', 'WHATSAPP_CLOUD_TOKEN', { required: true }],
  ['WhatsApp phone number ID', 'WHATSAPP_PHONE_NUMBER_ID', { required: true }],
  ['WhatsApp verify token', 'WHATSAPP_VERIFY_TOKEN', { required: true }],
  ['WhatsApp app secret', 'WHATSAPP_APP_SECRET', { required: true }],
  ['WhatsApp business phone', 'WHATSAPP_BUSINESS_PHONE', { required: true }],
  ['WhatsApp Graph version', 'WHATSAPP_GRAPH_VERSION', { required: true }],
  ['WhatsApp template name', 'WHATSAPP_TEMPLATE_NAME', { required: true }],
  ['WhatsApp template language', 'WHATSAPP_TEMPLATE_LANGUAGE', { required: true }],
];

const results = checks.map(([label, name, rules]) => {
  const present = has(name);
  const validUrl = !rules.url || (present && isUrl(process.env[name]));
  return {
    label,
    name,
    ok: present && validUrl,
    required: rules.required,
    reason: !present ? 'missing' : (!validUrl ? 'invalid URL' : 'set'),
  };
});

const missing = results.filter((item) => item.required && !item.ok);
const optional = results.filter((item) => !item.required && !item.ok);

console.log(JSON.stringify({
  ok: missing.length === 0,
  strict: arg('--strict'),
  missingRequired: missing.map(({ label, name, reason }) => ({ label, name, reason })),
  missingRecommended: optional.map(({ label, name, reason }) => ({ label, name, reason })),
  setRequired: results.filter((item) => item.required && item.ok).map(({ label, name }) => ({ label, name })),
}, null, 2));

if (arg('--strict') && missing.length > 0) process.exit(1);
