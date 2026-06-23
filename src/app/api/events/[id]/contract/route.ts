import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!["admin", "operator", "organizer"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const eventDoc = await adminDb.collection("events").doc(id).get();
    if (!eventDoc.exists) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const event = eventDoc.data()!;
    const quoteSnap = await adminDb.collection("events").doc(id).collection("quotes")
      .where("status", "==", "accepted").limit(1).get();

    const quote = quoteSnap.empty ? null : { id: quoteSnap.docs[0].id, ...quoteSnap.docs[0].data() };

    const contract = {
      eventId: id,
      eventName: event.name || event.title,
      clientName: event.clientName || event.organizerName || "",
      clientEmail: event.clientEmail || event.organizerEmail || "",
      eventDate: event.date,
      venue: event.venue || event.location || "",
      quoteId: quote?.id || null,
      totalAmount: quote ? (quote as any).total : event.budget || 0,
      terms: [
        "Le prestataire s'engage à fournir les services musicaux décrits ci-dessus.",
        "Le paiement est dû dans les 30 jours suivant l'événement.",
        "Annulation gratuite jusqu'à 14 jours avant l'événement. Au-delà, 50% du montant est dû.",
        "Pixels se réserve le droit de remplacer un artiste en cas de force majeure.",
      ],
      status: "draft",
      generatedAt: new Date().toISOString(),
      generatedBy: session.user.uid,
    };

    const ref = await adminDb.collection("contracts").add(contract);

    return NextResponse.json({ id: ref.id, ...contract }, { status: 201 });
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
    const snap = await adminDb.collection("contracts").where("eventId", "==", id).get();
    const contracts = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return NextResponse.json(contracts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
