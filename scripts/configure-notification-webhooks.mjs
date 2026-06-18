import { existsSync, readFileSync } from 'node:fs';

const envFiles = ['.env.local', '.env'];

for (const file of envFiles) {
  if (!existsSync(file)) continue;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  for (const line of lines) {
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

const apiBase = (argValue('--base-url') || process.env.VITE_COHORTLY_API_BASE || process.env.COHORTLY_API_BASE || '').replace(/\/$/, '');
const telegramWebhookUrl = process.env.TELEGRAM_WEBHOOK_URL || (apiBase ? `${apiBase}/api/notifications/telegram/webhook` : '');
const whatsappWebhookUrl = apiBase ? `${apiBase}/api/notifications/whatsapp/webhook` : '';

function required(name) {
  if (!process.env[name]) throw new Error(`${name} is required.`);
  return process.env[name];
}

async function postTelegramWebhook() {
  const token = required('TELEGRAM_BOT_TOKEN');
  if (!telegramWebhookUrl) throw new Error('TELEGRAM_WEBHOOK_URL or --base-url is required.');

  const payload = {
    url: telegramWebhookUrl,
    allowed_updates: ['message', 'edited_message'],
    drop_pending_updates: false,
    ...(process.env.TELEGRAM_WEBHOOK_SECRET ? { secret_token: process.env.TELEGRAM_WEBHOOK_SECRET } : {}),
  };

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.ok === false) {
    throw new Error(`Telegram setWebhook failed: ${body.description || response.status}`);
  }

  const infoResponse = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const info = await infoResponse.json().catch(() => ({}));
  return {
    ok: true,
    webhookUrl: telegramWebhookUrl,
    pendingUpdateCount: info?.result?.pending_update_count ?? null,
    secretTokenConfigured: Boolean(process.env.TELEGRAM_WEBHOOK_SECRET),
  };
}

async function verifyWhatsAppCallback() {
  if (!whatsappWebhookUrl) throw new Error('--base-url or VITE_COHORTLY_API_BASE is required for WhatsApp callback verification.');
  const verifyToken = required('WHATSAPP_VERIFY_TOKEN');
  const challenge = `cohortly_${Date.now()}`;
  const url = new URL(whatsappWebhookUrl);
  url.searchParams.set('hub.mode', 'subscribe');
  url.searchParams.set('hub.verify_token', verifyToken);
  url.searchParams.set('hub.challenge', challenge);

  const response = await fetch(url, { cache: 'no-store' });
  const text = await response.text();
  if (!response.ok || text !== challenge) {
    throw new Error(`WhatsApp callback verification failed: HTTP ${response.status}`);
  }
  return {
    ok: true,
    callbackUrl: whatsappWebhookUrl,
    verifyTokenConfigured: true,
    appSecretConfigured: Boolean(process.env.WHATSAPP_APP_SECRET),
  };
}

async function main() {
  const results = {};
  try {
    results.telegram = await postTelegramWebhook();
  } catch (error) {
    results.telegram = { ok: false, message: error instanceof Error ? error.message : 'Telegram setup failed.' };
  }

  try {
    results.whatsapp = await verifyWhatsAppCallback();
  } catch (error) {
    results.whatsapp = { ok: false, message: error instanceof Error ? error.message : 'WhatsApp callback check failed.' };
  }

  console.log(JSON.stringify(results, null, 2));
  if (!results.telegram.ok || !results.whatsapp.ok) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
