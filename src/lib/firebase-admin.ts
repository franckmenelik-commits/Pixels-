import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

function getApp(): App {
  if (getApps().length === 0) {
    return initializeApp({
      credential: cert({
        projectId: "pixels-7147c",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getApps()[0];
}

let _db: Firestore | undefined;
let _auth: Auth | undefined;

export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!_db) { getApp(); _db = getFirestore(); }
    return (_db as any)[prop];
  },
});

export const adminAuth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!_auth) { getApp(); _auth = getAuth(); }
    return (_auth as any)[prop];
  },
});
