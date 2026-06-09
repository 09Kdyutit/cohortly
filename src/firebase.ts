import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, OAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;

export const isFirebaseConfigured = !!projectId;

const firebaseApp = isFirebaseConfigured
  ? getApps().length === 0
    ? initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      })
    : getApp()
  : null;

export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;

// Microsoft provider with SUTD tenant — replace TENANT_ID with real value in production
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({ tenant: import.meta.env.VITE_MICROSOFT_TENANT_ID ?? 'common', prompt: 'select_account' });

// Analytics only runs in browsers that support it (not SSR/Node)
if (firebaseApp) {
  isSupported().then((yes) => {
    if (yes) getAnalytics(firebaseApp);
  });
}
