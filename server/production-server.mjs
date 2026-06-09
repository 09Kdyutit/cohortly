import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAuthHandler } from './auth-core.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';
const authHandler = createAuthHandler({ devMode: process.env.COHORTLY_DEV_MODE === 'true' });

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function sendFile(res, filePath) {
  const type = contentTypes[extname(filePath)] || 'application/octet-stream';
  res.statusCode = 200;
  res.setHeader('Content-Type', type);
  createReadStream(filePath).pipe(res);
}

function safeStaticPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] || '/');
  const normalized = normalize(decoded)
    .replace(/^[/\\]+/, '')
    .replace(/^(\.\.([/\\]|$))+/, '');
  return join(dist, normalized === '' ? 'index.html' : normalized);
}

const server = createServer(async (req, res) => {
  if (req.url?.startsWith('/api/auth')) {
    const handled = await authHandler(req, res);
    if (handled) return;
  }

  if (!existsSync(dist)) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Build output not found. Run npm run build before npm start.');
    return;
  }

  const filePath = safeStaticPath(req.url || '/');
  const fallbackPath = join(dist, 'index.html');

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isFile()) {
      sendFile(res, filePath);
      return;
    }
  } catch {
    // Fall through to the SPA entry point.
  }

  sendFile(res, fallbackPath);
});

server.listen(port, host, () => {
  console.info(`[cohortly] serving ${dist} at http://${host}:${port}`);
});
