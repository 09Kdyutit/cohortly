import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';

const sessionCookie = 'cohortly_session';
const otpTtlMs = 10 * 60 * 1000;
const sessionTtlSeconds = 7 * 24 * 60 * 60;
const sessionSecret = process.env.COHORTLY_SESSION_SECRET || 'cohortly-local-development-secret-change-me';

const institutions = {
  sutd: {
    id: 'sutd',
    shortName: 'SUTD',
    name: 'Singapore University of Technology and Design',
    domains: ['sutd.edu.sg', 'mymail.sutd.edu.sg'],
    studentIdPattern: /^[0-9]{7,9}$/i,
    studentIdHint: '1001234',
  },
  nus: {
    id: 'nus',
    shortName: 'NUS',
    name: 'National University of Singapore',
    domains: ['u.nus.edu', 'nus.edu.sg'],
    studentIdPattern: /^[A-Z][0-9]{7}[A-Z]$/i,
    studentIdHint: 'A0251234X',
  },
  ntu: {
    id: 'ntu',
    shortName: 'NTU',
    name: 'Nanyang Technological University',
    domains: ['e.ntu.edu.sg', 'ntu.edu.sg'],
    studentIdPattern: /^[A-Z][0-9]{7}[A-Z]$/i,
    studentIdHint: 'U2321456A',
  },
  smu: {
    id: 'smu',
    shortName: 'SMU',
    name: 'Singapore Management University',
    domains: ['smu.edu.sg'],
    studentIdPattern: /^[0-9]{8}$/i,
    studentIdHint: '01234567',
  },
  mit: {
    id: 'mit',
    shortName: 'MIT',
    name: 'Massachusetts Institute of Technology',
    domains: ['mit.edu'],
    studentIdPattern: /^[0-9]{9}$/i,
    studentIdHint: '912345678',
  },
};

const pendingOtps = new Map();

function json(res, status, payload, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 12_000) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sign(value) {
  return createHmac('sha256', sessionSecret).update(value).digest('base64url');
}

function encodeSession(payload) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${body}.${sign(body)}`;
}

function decodeSession(token) {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  const expected = sign(body);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.expiresAt || Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

function hashOtp(code) {
  return createHmac('sha256', sessionSecret).update(code).digest('hex');
}

function cookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || '')
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf('=');
        return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
      }),
  );
}

function pathFromRequest(req) {
  const url = new URL(req.url || '/', 'http://localhost');
  return url.pathname.replace(/^\/api\/auth/, '') || '/';
}

function validInstitution(institutionId) {
  return institutions[institutionId] || institutions.sutd;
}

function validateAccess({ institutionId, email, studentId }) {
  const institution = validInstitution(institutionId);
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedStudentId = String(studentId || '').trim().toUpperCase();
  const emailValid = institution.domains.some((domain) => normalizedEmail.endsWith(`@${domain}`));
  const idValid = institution.studentIdPattern.test(normalizedStudentId);

  if (!emailValid) {
    return {
      ok: false,
      message: `Use a verified ${institution.shortName} email: ${institution.domains.join(' or ')}`,
    };
  }

  if (!idValid) {
    return {
      ok: false,
      message: `Use the ${institution.shortName} student ID format, for example ${institution.studentIdHint}.`,
    };
  }

  return { ok: true, institution, normalizedEmail, normalizedStudentId };
}

function sessionHeaders(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return {
    'Set-Cookie': `${sessionCookie}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionTtlSeconds}${secure}`,
  };
}

async function deliverOtp({ code, to, institution }) {
  // Resend (preferred) — set RESEND_API_KEY to enable real email delivery
  if (process.env.RESEND_API_KEY) {
    const html = `<!DOCTYPE html><html><body style="font-family:Inter,sans-serif;background:#f8fafc;padding:40px 0;margin:0">
<div style="max-width:480px;margin:0 auto">
  <div style="background:#0f172a;padding:22px 28px;border-radius:12px 12px 0 0;display:flex;align-items:center;gap:12px">
    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#0ea5e9;color:#fff;border-radius:8px;font-weight:800;font-size:1rem;letter-spacing:-0.05em">C</span>
    <span style="color:#fff;font-size:0.95rem;font-weight:700;letter-spacing:-0.02em">Cohortly</span>
    <span style="margin-left:4px;padding:2px 8px;background:rgba(14,165,233,0.2);border:1px solid rgba(14,165,233,0.3);color:#38bdf8;border-radius:4px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">${institution.shortName}</span>
  </div>
  <div style="background:#fff;padding:36px 28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
    <h2 style="font-size:1.25rem;font-weight:800;color:#0f172a;margin:0 0 8px;letter-spacing:-0.02em">Your verification code</h2>
    <p style="color:#64748b;font-size:0.875rem;margin:0 0 28px;line-height:1.6">Use this code to verify your ${institution.shortName} identity on Cohortly. It expires in 10 minutes.</p>
    <div style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:10px;padding:24px;text-align:center;margin-bottom:24px">
      <span style="font-size:2.4rem;font-weight:800;letter-spacing:0.18em;color:#0f172a;font-variant-numeric:tabular-nums">${code}</span>
    </div>
    <p style="color:#94a3b8;font-size:0.78rem;margin:0;line-height:1.6">If you didn't request this, you can safely ignore this email. This code is only valid once.</p>
  </div>
</div></body></html>`;

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Cohortly <onboarding@resend.dev>',
          to: [to],
          subject: `${code} — your Cohortly verification code`,
          html,
        }),
      });
      if (res.ok) return true;
      const err = await res.json().catch(() => ({}));
      console.error('[cohortly-auth] Resend error:', err);
      return false;
    } catch (error) {
      console.error('[cohortly-auth] Resend fetch failed:', error);
      return false;
    }
  }

  // Fallback: webhook delivery
  const webhookUrl = process.env.COHORTLY_OTP_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.COHORTLY_OTP_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.COHORTLY_OTP_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify({
      to,
      code,
      institution: institution.shortName,
      subject: `Your ${institution.shortName} Cohortly verification code`,
      text: `Use ${code} to finish signing in to Cohortly. This code expires in 10 minutes.`,
    }),
  });

  return response.ok;
}

export function publicInstitutions() {
  return Object.values(institutions).map(({ studentIdPattern, ...institution }) => institution);
}

export function createAuthHandler({ devMode = false } = {}) {
  return async function authHandler(req, res) {
    const path = pathFromRequest(req);

    try {
      if (req.method === 'GET' && path === '/institutions') {
        json(res, 200, { institutions: publicInstitutions() });
        return true;
      }

      if (req.method === 'GET' && path === '/me') {
        const session = decodeSession(cookies(req)[sessionCookie]);
        if (!session) {
          json(res, 401, { message: 'No verified university session.' });
          return true;
        }
        json(res, 200, { user: session.user });
        return true;
      }

      if (req.method === 'POST' && path === '/logout') {
        json(res, 200, { ok: true }, { 'Set-Cookie': `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0` });
        return true;
      }

      if (req.method === 'POST' && path === '/demo') {
        if (!devMode) {
          json(res, 403, { message: 'Demo accounts are only available in development mode.' });
          return true;
        }
        const body = await readBody(req);
        const role = body.role === 'mentor' ? 'mentor' : 'student';
        const demoAccounts = {
          student: {
            name: 'Vanika Sharma',
            email: 'demo.student@mymail.sutd.edu.sg',
            studentId: 'DEMO0001',
            institutionId: 'sutd',
            institutionName: 'Singapore University of Technology and Design',
            shortName: 'SUTD',
            verifiedAt: new Date().toISOString(),
          },
          mentor: {
            name: 'Aarav Menon',
            email: 'demo.mentor@mymail.sutd.edu.sg',
            studentId: 'DEMO0002',
            institutionId: 'sutd',
            institutionName: 'Singapore University of Technology and Design',
            shortName: 'SUTD',
            verifiedAt: new Date().toISOString(),
          },
        };
        const user = demoAccounts[role];
        const token = encodeSession({ user, expiresAt: Date.now() + sessionTtlSeconds * 1000 });
        json(res, 200, { user, role }, sessionHeaders(token));
        return true;
      }

      if (req.method === 'POST' && path === '/start') {
        const body = await readBody(req);
        const validated = validateAccess(body);
        if (!validated.ok) {
          json(res, 400, { message: validated.message });
          return true;
        }

        const name = String(body.name || '').trim();
        if (name.length < 2) {
          json(res, 400, { message: 'Add your full name before requesting a code.' });
          return true;
        }

        const code = process.env.COHORTLY_DEV_OTP || String(randomInt(100000, 1_000_000));
        pendingOtps.set(validated.normalizedEmail, {
          codeHash: hashOtp(code),
          expiresAt: Date.now() + otpTtlMs,
          attempts: 0,
          user: {
            name,
            email: validated.normalizedEmail,
            studentId: validated.normalizedStudentId,
            institutionId: validated.institution.id,
            institutionName: validated.institution.name,
            shortName: validated.institution.shortName,
          },
        });

        if (devMode) {
          console.info(`[cohortly-auth] OTP for ${validated.normalizedEmail}: ${code}`);
        } else {
          const delivered = await deliverOtp({
            code,
            to: validated.normalizedEmail,
            institution: validated.institution,
          });

          if (!delivered) {
            pendingOtps.delete(validated.normalizedEmail);
            json(res, 500, {
              message: 'OTP delivery is not configured. Set COHORTLY_OTP_WEBHOOK_URL or run in development mode.',
            });
            return true;
          }
        }

        json(res, 200, {
          ok: true,
          maskedEmail: validated.normalizedEmail.replace(/^(.{2}).*(@.*)$/, '$1***$2'),
          delivery: devMode ? 'development-code' : 'email',
          devCode: devMode ? code : undefined,
        });
        return true;
      }

      if (req.method === 'POST' && path === '/verify') {
        const body = await readBody(req);
        const email = String(body.email || '').trim().toLowerCase();
        const code = String(body.code || '').trim();
        const pending = pendingOtps.get(email);

        if (!pending || Date.now() > pending.expiresAt) {
          pendingOtps.delete(email);
          json(res, 400, { message: 'That verification code expired. Request a new code.' });
          return true;
        }

        pending.attempts += 1;
        if (pending.attempts > 5 || pending.codeHash !== hashOtp(code)) {
          json(res, 400, { message: 'That code is not correct.' });
          return true;
        }

        pendingOtps.delete(email);
        const user = { ...pending.user, verifiedAt: new Date().toISOString() };
        const token = encodeSession({ user, expiresAt: Date.now() + sessionTtlSeconds * 1000 });
        json(res, 200, { user }, sessionHeaders(token));
        return true;
      }
    } catch (error) {
      json(res, 500, { message: error instanceof Error ? error.message : 'Authentication service failed.' });
      return true;
    }

    return false;
  };
}
