const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };

const telegramChats = new Map();
const notificationPrefs = new Map();

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch (error) { reject(error); }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', jsonHeaders['Content-Type']);
  res.end(JSON.stringify(payload));
}

function normalizeTelegramUsername(value = '') {
  return String(value).trim().replace(/^@/, '').toLowerCase();
}

function normalizePhone(value = '') {
  return String(value).replace(/[^\d+]/g, '');
}

async function sendTelegram(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, reason: 'TELEGRAM_BOT_TOKEN is not configured.' };

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  const payload = await response.json().catch(() => ({}));
  return { ok: response.ok, payload };
}

async function sendWhatsApp(phone, text) {
  const token = process.env.WHATSAPP_CLOUD_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return { ok: false, reason: 'WHATSAPP_CLOUD_TOKEN and WHATSAPP_PHONE_NUMBER_ID are not configured.' };

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: phone.replace(/^\+/, ''),
      type: 'text',
      text: { preview_url: false, body: text },
    }),
  });
  const payload = await response.json().catch(() => ({}));
  return { ok: response.ok, payload };
}

export function createNotificationsHandler() {
  return async function notificationsHandler(req, res) {
    const url = new URL(req.url || '/', 'http://localhost');
    if (!url.pathname.startsWith('/api/notifications')) return false;

    try {
      if (req.method === 'POST' && url.pathname === '/api/notifications/telegram/webhook') {
        const update = await readJson(req);
        const message = update.message || update.edited_message;
        const username = normalizeTelegramUsername(message?.from?.username);
        const chatId = message?.chat?.id;
        if (username && chatId) telegramChats.set(username, chatId);
        return sendJson(res, 200, { ok: true, registered: Boolean(username && chatId) });
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
        await readJson(req);
        return sendJson(res, 200, { ok: true });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/telegram/connect') {
        const body = await readJson(req);
        const email = String(body.email || '').trim().toLowerCase();
        const username = normalizeTelegramUsername(body.username);
        if (!email || !username) return sendJson(res, 400, { ok: false, message: 'Email and Telegram username are required.' });
        const chatId = telegramChats.get(username);
        if (!process.env.TELEGRAM_BOT_TOKEN) {
          notificationPrefs.set(email, { ...(notificationPrefs.get(email) || {}), telegramUsername: username });
          return sendJson(res, 202, { ok: true, configured: false, message: 'Telegram username saved. Configure TELEGRAM_BOT_TOKEN and webhook delivery to send live alerts.' });
        }
        if (!chatId) return sendJson(res, 409, { ok: false, message: 'Start @CohortlyBot first, then try again.' });
        notificationPrefs.set(email, { ...(notificationPrefs.get(email) || {}), telegramUsername: username, telegramChatId: chatId });
        await sendTelegram(chatId, 'Cohortly Telegram alerts are connected.');
        return sendJson(res, 200, { ok: true, configured: true });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/whatsapp/connect') {
        const body = await readJson(req);
        const email = String(body.email || '').trim().toLowerCase();
        const phone = normalizePhone(body.phone);
        if (!email || !phone) return sendJson(res, 400, { ok: false, message: 'Email and WhatsApp number are required.' });
        notificationPrefs.set(email, { ...(notificationPrefs.get(email) || {}), whatsappNumber: phone });
        const configured = Boolean(process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
        return sendJson(res, configured ? 200 : 202, {
          ok: true,
          configured,
          message: configured ? 'WhatsApp number saved.' : 'WhatsApp number saved. Configure WhatsApp Cloud API credentials to send live alerts.',
        });
      }

      if (req.method === 'POST' && url.pathname === '/api/notifications/test') {
        const body = await readJson(req);
        const email = String(body.email || '').trim().toLowerCase();
        const prefs = notificationPrefs.get(email);
        if (!prefs) return sendJson(res, 404, { ok: false, message: 'No notification preferences found for this email.' });
        const text = body.text || 'Test alert from Cohortly.';
        const results = {};
        if (prefs.telegramChatId) results.telegram = await sendTelegram(prefs.telegramChatId, text);
        if (prefs.whatsappNumber) results.whatsapp = await sendWhatsApp(prefs.whatsappNumber, text);
        return sendJson(res, 200, { ok: true, results });
      }

      sendJson(res, 404, { ok: false, message: 'Unknown notification endpoint.' });
      return true;
    } catch (error) {
      sendJson(res, 500, { ok: false, message: error instanceof Error ? error.message : 'Notification request failed.' });
      return true;
    }
  };
}
