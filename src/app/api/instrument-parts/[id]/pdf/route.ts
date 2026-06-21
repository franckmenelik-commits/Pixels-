import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import PDFDocument from "pdfkit";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const partDoc = await adminDb.collection("instrumentParts").doc(id).get();
    if (!partDoc.exists) return NextResponse.json({ error: "Instrument part not found" }, { status: 404 });

    const instrumentPart = partDoc.data()!;
    const songDoc = await adminDb.collection("songs").doc(instrumentPart.songId).get();
    if (!songDoc.exists) return NextResponse.json({ error: "Song not found" }, { status: 404 });

    const song = songDoc.data()!;

    // Generate PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));

    // Header
    doc.fontSize(18).font("Helvetica-Bold").text(song.title, { align: "center" });
    doc.fontSize(12).font("Helvetica").text(`${song.artist} — ${instrumentPart.instrument}`, { align: "center" });
    doc.fontSize(10).text(`Tonalité: ${instrumentPart.transposedKey || song.originalKey}  |  BPM: ${song.bpm || "N/A"}`, { align: "center" });
    doc.moveDown();

    // Sections
    for (const section of instrumentPart.transposedSections) {
      doc.fontSize(14).font("Helvetica-Bold").text(section.name);
      doc.moveDown(0.3);

      const chords = section.bars.map((b: any) => b.chord);
      for (let i = 0; i < chords.length; i += 4) {
        const row = chords.slice(i, i + 4);
        const rowText = row.map((c: string) => c.padEnd(12)).join("| ");
        doc.fontSize(12).font("Courier").text("| " + rowText + "|");
      }
      doc.moveDown();
    }

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${song.title}-${instrumentPart.instrument}.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
