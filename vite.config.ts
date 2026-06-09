import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { createAuthHandler } from './server/auth-core.mjs';

const authHandler = createAuthHandler({ devMode: true });

export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/api/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/analytics'],
        },
      },
    },
  },
  plugins: [
    {
      name: 'cohortly-auth-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/auth')) {
            const handled = await authHandler(req, res);
            if (!handled) next();
            return;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/auth')) {
            const handled = await authHandler(req, res);
            if (!handled) next();
            return;
          }
          next();
        });
      },
    },
    react(),
  ],
});
