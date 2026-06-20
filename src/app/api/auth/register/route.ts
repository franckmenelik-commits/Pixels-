import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const { name, email, password, role, orgName, university, program, orgType } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Create Firebase Auth user
    const firebaseUser = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

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
        await adminAuth.deleteUser(firebaseUser.uid);
        return NextResponse.json({ error: "Organization name is required for organizers" }, { status: 400 });
      }
      userData.orgName = orgName;
      if (orgType) userData.orgType = orgType;
    }

    await adminDb.collection("users").doc(firebaseUser.uid).set(userData);

    return NextResponse.json({
      id: firebaseUser.uid,
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
