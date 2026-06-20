import { NextResponse } from "next/server";

export async function POST() {
  // Logout is handled client-side with Firebase Auth SDK
  return NextResponse.json({ ok: true });
}
