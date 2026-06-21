import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const { name, email, password, role, orgName, university, program, orgType, googleAuth } = await request.json();

    let uid: string;

    if (googleAuth) {
      const authHeader = request.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Token required for Google auth" }, { status: 400 });
      }
      const token = authHeader.split("Bearer ")[1];
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
      const existingDoc = await adminDb.collection("users").doc(uid).get();
      if (existingDoc.exists) {
        return NextResponse.json({ id: uid, ...existingDoc.data() });
      }
    } else {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }
      const firebaseUser = await adminAuth.createUser({
        email,
        password,
        displayName: name,
      });
      uid = firebaseUser.uid;
    }

    // Create Firestore user document
    const userData: Record<string, any> = {
      name,
      email,
      role: role || "artist",
      createdAt: FieldValue.serverTimestamp(),
    };

    if (role === "artist" || !role) {
      userData.artistProfile = true;
      if (university) userData.university = university;
      if (program) userData.program = program;
    }

    if (role === "organizer") {
      if (!orgName) {
        // Clean up the auth user since we can't complete registration
        await adminAuth.deleteUser(uid);
        return NextResponse.json({ error: "Organization name is required for organizers" }, { status: 400 });
      }
      userData.orgName = orgName;
      if (orgType) userData.orgType = orgType;
    }

    await adminDb.collection("users").doc(uid).set(userData);

    return NextResponse.json({
      id: uid,
      name,
      email,
      role: userData.role,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
