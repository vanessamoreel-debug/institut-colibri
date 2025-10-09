// /lib/firebaseAdmin.ts
import { cert, getApps, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let _db: FirebaseFirestore.Firestore | null = null;

export function getAdminDb() {
  if (_db) return _db;

  if (!getApps().length) {
    const sa: ServiceAccount = {
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, "\n")
    };
    initializeApp({ credential: cert(sa) });
  }
  _db = getFirestore();
  return _db;
}
