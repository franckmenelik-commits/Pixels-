import { NextResponse } from "next/server";

export async function POST() {
  // Login is handled client-side with Firebase Auth SDK
  // This endpoint is kept for compatibility but is a no-op
  return NextResponse.json({ message: "Login is handled client-side with Firebase Auth" });
}
