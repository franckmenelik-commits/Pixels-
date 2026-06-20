import { adminAuth, adminDb } from "./firebase-admin";
import { headers } from "next/headers";

export async function getSession() {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return null;
    const token = authorization.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) return null;
    return { user: { id: decoded.uid, ...userDoc.data() } };
  } catch {
    return null;
  }
}
