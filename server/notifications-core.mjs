import { createHmac, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };
const root = fileURLToPath(new URL('..', import.meta.url));
const storePath = process.env.COHORTLY_NOTIFICATIONS_STORE || join(root, '.data', 'notifications.json');

const emptyStore = () => ({
  telegramChats: {},
  whatsappOptIns: {},
  notificationPrefs: {},
  updatedAt: null,
});

let store = emptyStore();
let loaded = false;

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 200_000) reject(new Error('Request body too large.'));
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const raw = await readRawBody(req);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON payload.');
  }
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', jsonHeaders['Content-Type']);
  res.end(JSON.stringify(payload));
  return true;
}

function applyCors(req, res) {
  const allowedOrigin = process.env.COHORTLY_ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (allowedOrigin !== '*') res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

async function ensureStoreLoaded() {
  if (loaded) return;
  try {
    const raw = await readFile(storePath, 'utf8');
    const parsed = JSON.parse(raw);
    store = {
      ...emptyStore(),
      ...parsed,
      telegramChats: parsed.telegramChats || {},
      whatsappOptIns: parsed.whatsappOptIns || {},
      notificationPrefs: parsed.notificationPrefs || {},
    };
  } catch {
    store = emptyStore();
  }
  loaded = true;
}

async function saveStore() {
  store.updatedAt = new Date().toISOString();
  await mkdir(dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

function normalizeTelegramUsername(value = '') {
  return String(value).trim().replace(/^@/, '').toLowerCase();
}

function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

function normalizePhone(value = '') {
  const cleaned = String(value).replace(/[^\d+]/g, '');
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

function phoneForWhatsApp(value = '') {
  return normalizePhone(value).replace(/^\+/, '');
}

function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN);
}

function telegramWebhookSecured() {
  return Boolean(process.env.TELEGRAM_WEBHOOK_SECRET);
}

function whatsappConfigured() {
  return Boolean(process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

function whatsappWebhookSecured() {
  return Boolean(process.env.WHATSAPP_APP_SECRET);
}

function whatsappTemplateConfigured() {
  return Boolean(process.env.WHATSAPP_TEMPLATE_NAME);
}

function whatsappTemplateLanguage() {
  return process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en_US';
}

function adminDispatchConfigured() {
  return Boolean(process.env.COHORTLY_NOTIFICATIONS_ADMIN_TOKEN);
}

function graphVersion() {
  return process.env.WHATSAPP_GRAPH_VERSION || 'v25.0';
}

function botUsername() {
  return (process.env.TELEGRAM_BOT_USERNAME || 'CohortlyBot').replace(/^@/, '');
}

function whatsappBusinessPhone() {
  return process.env.WHATSAPP_BUSINESS_PHONE || process.env.WHATSAPP_DISPLAY_PHONE || '';
}

function base64UrlDecode(value = '') {
  try {
    const normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return Buffer.from(padded, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

function notificationTokenSecret() {
  return process.env.COHORTLY_NOTIFICATION_TOKEN_SECRET
    || process.env.COHORTLY_SESSION_SECRET
    || process.env.COHORTLY_NOTIFICATIONS_ADMIN_TOKEN
    || 'cohortly-local-development-secret-change-me';
}

function signTokenBody(body) {
  return createHmac('sha256', notificationTokenSecret()).update(body).digest('base64url');
}

function createStartToken(email) {
  const body = Buffer.from(JSON.stringify({
    email: normalizeEmail(email),
    exp: Date.now() + 24 * 60 * 60 * 1000,
  }), 'utf8').toString('base64url');
  return `${body}.${signTokenBody(body)}`;
}

function emailFromStartToken(token = '') {
  if (!token.includes('.')) {
    if (process.env.COHORTLY_ALLOW_LEGACY_NOTIFICATION_TOKENS === 'true') {
      return normalizeEmail(base64UrlDecode(token));
    }
    return '';
  }

  const [body, signature] = token.split('.');
  if (!body || !signature || !safeEqual(signature, signTokenBody(body))) return '';

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return '';
    return normalizeEmail(payload.email);
  } catch {
    return '';
  }
}

function safeProviderPayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const clone = JSON.parse(JSON.stringify(payload));
  if (clone?.error?.fbtrace_id) delete clone.error.fbtrace_id;
  return clone;
}

function safeEqual(actual = '', expected = '') {
  const actualBuffer = Buffer.from(String(actual));
  const expectedBuffer = Buffer.from(String(expected));
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function escapeTelegramHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function verifyTelegramWebhook(req) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) return true;
  return safeEqual(req.headers['x-telegram-bot-api-secret-token'] || '', secret);
}

function verifyWhatsAppSignature(req, rawBody) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return true;
  const header = String(req.headers['x-hub-signature-256'] || '');
  const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`;
  return safeEqual(header, expected);
}

function requireDispatchToken(req, res) {
  const token = process.env.COHORTLY_NOTIFICATIONS_ADMIN_TOKEN;
  if (!token) {
    sendJson(res, 503, {
      ok: false,
      message: 'Notification dispatch is disabled. Set COHORTLY_NOTIFICATIONS_ADMIN_TOKEN on the server.',
    });
    return false;
  }
  const header = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!safeEqual(header, token)) {
    sendJson(res, 401, { ok: false, message: 'Invalid notification dispatch token.' });
    return false;
  }
  return true;
}

async function sendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, reason: 'TELEGRAM_BOT_TOKEN is not configured.' };

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      chat_id: chatId,
      text: escapeTelegramHtml(text),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, payload: safeProviderPayload(payload) };
}

async function sendWhatsApp(phone, text) {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) {
    return { ok: false, reason: 'WHATSAPP_CLOUD_TOKEN and WHATSAPP_PHONE_NUMBER_ID are not configured.' };
  }

  const useTemplate = Boolean(process.env.WHATSAPP_TEMPLATE_NAME);
  const body = useTemplate
    ? {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneForWhatsApp(phone),
        type: 'template',
        template: {
          name: process.env.WHATSAPP_TEMPLATE_NAME,
          language: { code: whatsappTemplateLanguage() },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: String(text).slice(0, 1024) }],
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneForWhatsApp(phone),
        type: 'text',
        text: { preview_url: false, body: text },
      };

  const response = await fetch(`https://graph.facebook.com/${graphVersion()}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, mode: useTemplate ? 'template' : 'text', payload: safeProviderPayload(payload) };
}

function statusForEmail(email) {
  const prefs = store.notificationPrefs[email] || {};
  return {
    ok: true,
    apiOnline: true,
    storeUpdatedAt: store.updatedAt,
    telegram: {
      configured: telegramConfigured(),
      botUsername: botUsername(),
      webhookUrlConfigured: Boolean(process.env.TELEGRAM_WEBHOOK_URL),
      webhookSecretConfigured: telegramWebhookSecured(),
      connected: Boolean(prefs.telegramChatId && telegramConfigured()),
      username: prefs.telegramUsername ? `@${prefs.telegramUsername}` : '',
      chatRegistered: Boolean(prefs.telegramChatId || (prefs.telegramUsername && store.telegramChats[prefs.telegramUsername])),
    },
    whatsapp: {
      configured: whatsappConfigured(),
      phoneNumberIdConfigured: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID),
      verifyTokenConfigured: Boolean(process.env.WHATSAPP_VERIFY_TOKEN),
      appSecretConfigured: whatsappWebhookSecured(),
      templateConfigured: whatsappTemplateConfigured(),
      templateLanguage: whatsappTemplateLanguage(),
      businessPhone: whatsappBusinessPhone(),
      connected: Boolean(prefs.whatsappNumber && prefs.whatsappVerifiedAt && whatsappConfigured()),
      optedIn: Boolean(prefs.whatsappNumber && store.whatsappOptIns[phoneForWhatsApp(prefs.whatsappNumber)]),
      phone: prefs.whatsappNumber || '',
    },
    dispatch: {
      configured: adminDispatchConfigured(),
    },
    startToken: createStartToken(email),
    preferences: {
      onAnswer: prefs.onAnswer ?? true,
      onEvent: prefs.onEvent ?? true,
      onConnection: prefs.onConnection ?? true,
    },
  };
}

async function handleTelegramWebhook(req, res) {
  const update = await readJson(req);
  const message = update.message || update.edited_message;
  const username = normalizeTelegramUsername(message?.from?.username);
  const chatId = message?.chat?.id;
  const text = String(message?.text || '');
  const startArg = text.match(/^\/start(?:\s+(.+))?/i)?.[1]?.trim();
  const emailFromStart = emailFromStartToken(startArg);

  if (username && chatId) {
    store.telegramChats[username] = chatId;
    if (!emailFromStart) await saveStore();
  }

  if (chatId && emailFromStart && emailFromStart.includes('@')) {
    store.notificationPrefs[emailFromStart] = {
      ...(store.notificationPrefs[emailFromStart] || {}),
      ...(username ? { telegramUsername: username } : {}),
      telegramChatId: chatId,
      telegramConnectedAt: new Date().toISOString(),
    };
    await saveStore();
  }

  if (chatId && telegramConfigured() && /^\/start\b/i.test(text)) {
    await sendTelegram(chatId, 'Cohortly Telegram alerts are ready. Return to Cohortly and press Connect Telegram.');
  }

  return sendJson(res, 200, { ok: true, registered: Boolean(chatId && (username || emailFromStart)), linkedEmail: Boolean(emailFromStart) });
}

async function handleWhatsAppWebhook(update, res) {
  const messages = update?.entry?.flatMap((entry) => entry?.changes || [])
    .flatMap((change) => change?.value?.messages || []) || [];

  let registered = false;
  for (const message of messages) {
    const phone = phoneForWhatsApp(message?.from || '');
    if (!phone) continue;
    const text = String(message?.text?.body || '');
    const startArg = text.match(/^start(?:\s+(.+))?/i)?.[1]?.trim();
    const emailFromStart = emailFromStartToken(startArg);

    if (/^(stop|unsubscribe|cancel)\b/i.test(text)) {
      delete store.whatsappOptIns[phone];
      for (const [email, prefs] of Object.entries(store.notificationPrefs)) {
        if (phoneForWhatsApp(prefs.whatsappNumber || '') === phone) {
          delete prefs.whatsappNumber;
          delete prefs.whatsappOptedInAt;
          delete prefs.whatsappVerifiedAt;
          store.notificationPrefs[email] = prefs;
        }
      }
      registered = true;
      continue;
    }

    if (emailFromStart && emailFromStart.includes('@')) {
      store.whatsappOptIns[phone] = {
        optedInAt: new Date().toISOString(),
        email: emailFromStart,
        lastMessageText: text,
      };
      store.notificationPrefs[emailFromStart] = {
        ...(store.notificationPrefs[emailFromStart] || {}),
        whatsappNumber: normalizePhone(phone),
        whatsappOptedInAt: new Date().toISOString(),
      };
      registered = true;
    }
  }

  if (registered) await saveStore();
  return sendJson(res, 200, { ok: true, registered });
}

export function createNotificationsHandler() {
  return async function notificationsHandler(req, res) {
    const url = new URL(req.url || '/', 'http://localhost');
    if (!url.pathname.startsWith('/api/notifications')) return false;

    try {
      await ensureStoreLoaded();
      if (applyCors(req, res)) return true;

      if (req.method === 'GET' && url.pathname === '/api/notifications/status') {
        const email = normalizeEmail(url.searchParams.get('email'));
        if (!email) return sendJson(res, 400, { ok: false, message: 'Email is required.' });
        return sendJson(res, 200, statusForEmail(email));
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/telegram/webhook') {
        if (!verifyTelegramWebhook(req)) {
          return sendJson(res, 401, { ok: false, message: 'Telegram webhook secret token mismatch.' });
        }
        return await handleTelegramWebhook(req, res);
      }

      if (req.method === 'GET' && url.pathname === '/api/notifications/whatsapp/webhook') {
        const mode = url.searchParams.get('hub.mode');
        const token = url.searchParams.get('hub.verify_token');
        const challenge = url.searchParams.get('hub.challenge');
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(challenge);
          return true;
        }
        return sendJson(res, 403, { ok: false, message: 'WhatsApp webhook verification failed.' });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/whatsapp/webhook') {
        const rawBody = await readRawBody(req);
        if (!verifyWhatsAppSignature(req, rawBody)) {
          return sendJson(res, 401, { ok: false, message: 'WhatsApp webhook signature mismatch.' });
        }
        let update = {};
        try {
          update = rawBody ? JSON.parse(rawBody) : {};
        } catch {
          return sendJson(res, 400, { ok: false, message: 'Invalid WhatsApp webhook JSON.' });
        }
        return await handleWhatsAppWebhook(update, res);
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/telegram/connect') {
        const body = await readJson(req);
        const email = normalizeEmail(body.email);
        const username = normalizeTelegramUsername(body.username);
        if (!email) return sendJson(res, 400, { ok: false, message: 'Email is required.' });
        if (!telegramConfigured()) {
          return sendJson(res, 503, { ok: false, connected: false, message: 'Telegram is not configured on the notification server. Add TELEGRAM_BOT_TOKEN and set the Telegram webhook.' });
        }

        const existingPrefs = store.notificationPrefs[email] || {};
        const chatId = existingPrefs.telegramChatId || store.telegramChats[username];
        if (!chatId) {
          store.notificationPrefs[email] = { ...existingPrefs, ...(username ? { telegramUsername: username } : {}) };
          await saveStore();
          return sendJson(res, 409, { ok: false, connected: false, message: `Start @${botUsername()} first, then press Connect Telegram again.` });
        }

        const result = await sendTelegram(chatId, 'Cohortly Telegram alerts are connected. This is your confirmation message.');
        if (!result.ok) {
          return sendJson(res, 502, { ok: false, connected: false, message: 'Telegram rejected the confirmation message.', result });
        }

        store.notificationPrefs[email] = {
          ...existingPrefs,
          ...(username ? { telegramUsername: username } : {}),
          telegramChatId: chatId,
          telegramConnectedAt: new Date().toISOString(),
        };
        await saveStore();
        return sendJson(res, 200, { ok: true, connected: true, message: 'Telegram connected. Confirmation message sent.', result });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/whatsapp/connect') {
        const body = await readJson(req);
        const email = normalizeEmail(body.email);
        const phone = normalizePhone(body.phone);
        if (!email || !phone || phone.length < 7) return sendJson(res, 400, { ok: false, message: 'A valid email and WhatsApp number are required.' });
        if (!whatsappConfigured()) {
          return sendJson(res, 503, { ok: false, connected: false, message: 'WhatsApp is not configured on the notification server. Add WHATSAPP_CLOUD_TOKEN and WHATSAPP_PHONE_NUMBER_ID.' });
        }

        const phoneKey = phoneForWhatsApp(phone);
        const optIn = store.whatsappOptIns[phoneKey];
        if (!optIn || (optIn.email && optIn.email !== email)) {
          store.notificationPrefs[email] = {
            ...(store.notificationPrefs[email] || {}),
            whatsappNumber: phone,
          };
          await saveStore();
          return sendJson(res, 409, {
            ok: false,
            connected: false,
            message: 'Open the Cohortly WhatsApp link and send the pre-filled start message before connecting.',
          });
        }

        store.notificationPrefs[email] = {
          ...(store.notificationPrefs[email] || {}),
          whatsappNumber: phone,
          whatsappOptedInAt: store.whatsappOptIns[phoneKey]?.optedInAt,
        };

        const result = await sendWhatsApp(phone, 'Cohortly WhatsApp alerts are connected. This is your confirmation message.');
        if (!result.ok) {
          await saveStore();
          return sendJson(res, 409, {
            ok: false,
            connected: false,
            message: 'WhatsApp did not deliver the confirmation. Send "start" to the Cohortly WhatsApp number, then try again.',
            result,
          });
        }

        store.notificationPrefs[email] = {
          ...store.notificationPrefs[email],
          whatsappVerifiedAt: new Date().toISOString(),
        };
        await saveStore();
        return sendJson(res, 200, { ok: true, connected: true, message: 'WhatsApp connected. Confirmation message sent.', result });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/preferences') {
        const body = await readJson(req);
        const email = normalizeEmail(body.email);
        if (!email) return sendJson(res, 400, { ok: false, message: 'Email is required.' });
        store.notificationPrefs[email] = {
          ...(store.notificationPrefs[email] || {}),
          onAnswer: Boolean(body.onAnswer),
          onEvent: Boolean(body.onEvent),
          onConnection: Boolean(body.onConnection),
        };
        await saveStore();
        return sendJson(res, 200, { ok: true, preferences: statusForEmail(email).preferences });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/disconnect') {
        const body = await readJson(req);
        const email = normalizeEmail(body.email);
        const channel = String(body.channel || '').trim().toLowerCase();
        if (!email) return sendJson(res, 400, { ok: false, message: 'Email is required.' });
        const prefs = store.notificationPrefs[email] || {};

        if (channel === 'telegram') {
          delete prefs.telegramUsername;
          delete prefs.telegramChatId;
          delete prefs.telegramConnectedAt;
        } else if (channel === 'whatsapp') {
          delete prefs.whatsappNumber;
          delete prefs.whatsappOptedInAt;
          delete prefs.whatsappVerifiedAt;
        } else {
          return sendJson(res, 400, { ok: false, message: 'Channel must be telegram or whatsapp.' });
        }

        store.notificationPrefs[email] = prefs;
        await saveStore();
        return sendJson(res, 200, { ok: true, status: statusForEmail(email) });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/dispatch') {
        if (!requireDispatchToken(req, res)) return true;
        const body = await readJson(req);
        const email = normalizeEmail(body.email);
        const prefs = store.notificationPrefs[email];
        const type = String(body.type || 'system').trim().toLowerCase();
        const text = String(body.text || body.message || '').trim();
        if (!email || !text) return sendJson(res, 400, { ok: false, message: 'Email and text are required.' });
        if (!prefs) return sendJson(res, 404, { ok: false, message: 'No notification preferences found for this email.' });

        const disabled =
          (type === 'answer' || type === 'qa_answer') && prefs.onAnswer === false
            ? 'Q&A answer alerts are disabled for this user.'
            : type === 'event' && prefs.onEvent === false
              ? 'Event alerts are disabled for this user.'
              : type === 'connection' && prefs.onConnection === false
                ? 'Connection alerts are disabled for this user.'
                : '';

        if (disabled) return sendJson(res, 200, { ok: true, skipped: true, message: disabled });

        const results = {};
        if (prefs.telegramChatId && telegramConfigured()) results.telegram = await sendTelegram(prefs.telegramChatId, text);
        if (prefs.whatsappNumber && prefs.whatsappVerifiedAt && whatsappConfigured()) results.whatsapp = await sendWhatsApp(prefs.whatsappNumber, text);

        const resultValues = Object.values(results);
        if (resultValues.length === 0) {
          return sendJson(res, 409, { ok: false, message: 'No connected channels are ready for dispatch.', results });
        }
        const accepted = resultValues.every((result) => result.ok);
        return sendJson(res, accepted ? 200 : 502, {
          ok: accepted,
          message: accepted ? 'Notification accepted by configured providers.' : 'One or more providers rejected the notification.',
          results,
        });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/test') {
        const body = await readJson(req);
        const email = normalizeEmail(body.email);
        const prefs = store.notificationPrefs[email];
        if (!prefs) return sendJson(res, 404, { ok: false, message: 'No notification preferences found for this email.' });

        const text = body.text || 'Test alert from Cohortly. If you can read this, your channel is working.';
        const results = {};
        if (prefs.telegramChatId) results.telegram = await sendTelegram(prefs.telegramChatId, text);
        if (prefs.whatsappNumber && prefs.whatsappVerifiedAt) results.whatsapp = await sendWhatsApp(prefs.whatsappNumber, text);

        const resultValues = Object.values(results);
        if (resultValues.length === 0) {
          return sendJson(res, 409, { ok: false, message: 'No connected channels are ready for a test message.', results });
        }
        const delivered = resultValues.every((result) => result.ok);
        return sendJson(res, delivered ? 200 : 502, {
          ok: delivered,
          message: delivered ? 'Test alert accepted by configured providers.' : 'One or more providers rejected the test alert.',
          results,
        });
      }

      sendJson(res, 404, { ok: false, message: 'Unknown notification endpoint.' });
      return true;
    } catch (error) {
      sendJson(res, 500, { ok: false, message: error instanceof Error ? error.message : 'Notification request failed.' });
      return true;
    }
  };
}
