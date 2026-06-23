import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { createHash } from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const contractDoc = await adminDb.collection("contracts").doc(id).get();
    if (!contractDoc.exists) return NextResponse.json({ error: "Contract not found" }, { status: 404 });

    const contract = contractDoc.data()!;
    const { fullName, agreementText } = await request.json();

    if (!fullName?.trim()) {
      return NextResponse.json({ error: "Full name required for signature" }, { status: 400 });
    }

    const signatureHash = createHash("sha256")
      .update(`${session.user.id}:${id}:${fullName}:${new Date().toISOString()}`)
      .digest("hex");

    const signature = {
      signerId: session.user.id,
      signerEmail: session.user.email,
      signerName: fullName.trim(),
      signerRole: session.user.role,
      signedAt: new Date().toISOString(),
      signatureHash,
      agreementText: agreementText || "J'accepte les termes de ce contrat.",
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    };

    await adminDb.collection("contracts").doc(id).collection("signatures").add(signature);

    const signaturesSnap = await adminDb.collection("contracts").doc(id).collection("signatures").get();
    const allSigned = signaturesSnap.size >= 2;

    if (allSigned) {
      await adminDb.collection("contracts").doc(id).update({ status: "signed", signedAt: new Date().toISOString() });
    } else {
      await adminDb.collection("contracts").doc(id).update({ status: "partially_signed" });
    }

    return NextResponse.json({
      signatureId: signatureHash.slice(0, 12),
      status: allSigned ? "signed" : "partially_signed",
      ...signature,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const snap = await adminDb.collection("contracts").doc(id).collection("signatures").get();
    const signatures = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json(signatures);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
