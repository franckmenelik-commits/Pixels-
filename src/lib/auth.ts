import { adminAuth, adminDb } from "./firebase-admin";
import { headers } from "next/headers";

export interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  role: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return null;
    const token = authorization.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) return null;
    const data = userDoc.data() as Record<string, unknown>;
    return {
      user: {
        id: decoded.uid,
        name: data.name as string | undefined,
        email: data.email as string | undefined,
        role: (data.role as string) || "artist",
        avatarUrl: data.avatarUrl as string | undefined,
        ...data,
      },
    };
  } catch {
    return null;
  }
}
