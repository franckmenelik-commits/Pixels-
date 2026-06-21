"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import type {
  Song,
  ChordChart,
  ChordSection,
  ChordBar,
  InstrumentPart,
  InstrumentType,
  RehearsalNote,
} from "@/lib/music/types";
import { INSTRUMENT_LABELS } from "@/lib/music/types";

const KEY_OPTIONS = [
  "C","C#","Db","D","D#","Eb","E","F","F#","Gb","G","G#","Ab","A","A#","Bb","B",
  "Am","Bbm","Bm","Cm","C#m","Dm","Ebm","Em","Fm","F#m","Gm","G#m","Abm",
];

const SECTION_SUGGESTIONS = ["Intro","Verse","Chorus","Bridge","Pre-Chorus","Outro","Solo","Interlude"];

const STATUS_BADGE: Record<string, { variant: "neutral" | "warning" | "primary" | "success"; label: string }> = {
  draft: { variant: "neutral", label: "Brouillon" },
  chord_detected: { variant: "warning", label: "Accords détectés" },
  arranged: { variant: "primary", label: "Arrangé" },
  ready: { variant: "success", label: "Prêt" },
};

const ALL_INSTRUMENTS: InstrumentType[] = [
  "guitar","bass","piano","drums","sax_alto","sax_tenor",
  "trumpet_bb","trombone","violin","cello","flute","vocals",
];

export default function SongDetailPage() {
  const { songId } = useParams<{ songId: string }>();
  const { user, token, loading } = useAuth();

  const [song, setSong] = useState<Song | null>(null);
  const [chordCharts, setChordCharts] = useState<ChordChart[]>([]);
  const [instrumentParts, setInstrumentParts] = useState<InstrumentPart[]>([]);
  const [fetching, setFetching] = useState(true);

  // Edit song modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  // Chord chart editor
  const [editingChart, setEditingChart] = useState(false);
  const [chartKey, setChartKey] = useState("C");
  const [chartSections, setChartSections] = useState<ChordSection[]>([]);
  const [editingChartId, setEditingChartId] = useState<string | null>(null);
  const [savingChart, setSavingChart] = useState(false);

  // Generate parts
  const [selectedInstruments, setSelectedInstruments] = useState<InstrumentType[]>([]);
  const [generatingParts, setGeneratingParts] = useState(false);

  // Rehearsal notes
  const [activePartId, setActivePartId] = useState<string | null>(null);
  const [rehearsalNotes, setRehearsalNotes] = useState<RehearsalNote[]>([]);
  const [noteForm, setNoteForm] = useState({ barRange: "", note: "" });
  const [submittingNote, setSubmittingNote] = useState(false);

  const fetchSong = useCallback(async () => {
    if (!token || !songId) return;
    setFetching(true);
    try {
      const res = await fetch(`/api/songs/${songId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSong(data.song || data);
        setChordCharts(data.chordCharts || []);
        setInstrumentParts(data.instrumentParts || []);
      }
    } finally {
      setFetching(false);
    }
  }, [token, songId]);

  useEffect(() => {
    if (!loading && token) fetchSong();
  }, [loading, token, fetchSong]);

  // --- Edit Song ---
  const openEditModal = () => {
    if (!song) return;
    setEditForm({
      title: song.title,
      artist: song.artist,
      originalKey: song.originalKey,
      bpm: String(song.bpm || ""),
      genre: song.genre || "",
      durationSeconds: String(song.durationSeconds || ""),
      sourceUrl: song.sourceUrl || "",
    });
    setShowEditModal(true);
  };

  const handleEditSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const body: Record<string, unknown> = { ...editForm };
    if (editForm.bpm) body.bpm = Number(editForm.bpm);
    else delete body.bpm;
    if (editForm.durationSeconds) body.durationSeconds = Number(editForm.durationSeconds);
    else delete body.durationSeconds;
    if (!editForm.genre) delete body.genre;
    if (!editForm.sourceUrl) delete body.sourceUrl;

    const res = await fetch(`/api/songs/${songId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setShowEditModal(false);
      fetchSong();
    }
  };

  // --- Chord Chart Editor ---
  const startNewChart = () => {
    setEditingChart(true);
    setEditingChartId(null);
    setChartKey(song?.originalKey || "C");
    setChartSections([{ name: "Verse", bars: [{ chord: "", beats: 4 }] }]);
  };

  const startEditChart = (chart: ChordChart) => {
    setEditingChart(true);
    setEditingChartId(chart.id);
    setChartKey(chart.key);
    setChartSections(JSON.parse(JSON.stringify(chart.sections)));
  };

  const addSection = () => {
    setChartSections([...chartSections, { name: "", bars: [{ chord: "", beats: 4 }] }]);
  };

  const removeSection = (idx: number) => {
    setChartSections(chartSections.filter((_, i) => i !== idx));
  };

  const updateSectionName = (idx: number, name: string) => {
    const next = [...chartSections];
    next[idx] = { ...next[idx], name };
    setChartSections(next);
  };

  const addBar = (sIdx: number) => {
    const next = [...chartSections];
    next[sIdx] = { ...next[sIdx], bars: [...next[sIdx].bars, { chord: "", beats: 4 }] };
    setChartSections(next);
  };

  const removeBar = (sIdx: number, bIdx: number) => {
    const next = [...chartSections];
    next[sIdx] = { ...next[sIdx], bars: next[sIdx].bars.filter((_, i) => i !== bIdx) };
    setChartSections(next);
  };

  const updateBar = (sIdx: number, bIdx: number, field: keyof ChordBar, value: string | number) => {
    const next = [...chartSections];
    const bars = [...next[sIdx].bars];
    bars[bIdx] = { ...bars[bIdx], [field]: value };
    next[sIdx] = { ...next[sIdx], bars };
    setChartSections(next);
  };

  const saveChart = async () => {
    if (!token) return;
    setSavingChart(true);
    try {
      const body = { key: chartKey, sections: chartSections };
      let res: Response;
      if (editingChartId) {
        res = await fetch(`/api/songs/${songId}/chord-charts/${editingChartId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/songs/${songId}/chord-charts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      }
      if (res.ok) {
        setEditingChart(false);
        fetchSong();
      }
    } finally {
      setSavingChart(false);
    }
  };

  // --- Generate Parts ---
  const toggleInstrument = (inst: InstrumentType) => {
    setSelectedInstruments((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const generateParts = async (chartId: string) => {
    if (!token || selectedInstruments.length === 0) return;
    setGeneratingParts(true);
    try {
      const res = await fetch(`/api/chord-charts/${chartId}/generate-parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ instruments: selectedInstruments }),
      });
      if (res.ok) {
        setSelectedInstruments([]);
        fetchSong();
      }
    } finally {
      setGeneratingParts(false);
    }
  };

  // --- Rehearsal Notes ---
  const fetchNotes = async (partId: string) => {
    if (!token) return;
    const res = await fetch(`/api/instrument-parts/${partId}/rehearsal-notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setRehearsalNotes(Array.isArray(data) ? data : data.notes || []);
    }
  };

  const openNotes = (partId: string) => {
    if (activePartId === partId) {
      setActivePartId(null);
      return;
    }
    setActivePartId(partId);
    fetchNotes(partId);
  };

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activePartId || submittingNote) return;
    setSubmittingNote(true);
    try {
      const res = await fetch(`/api/instrument-parts/${activePartId}/rehearsal-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(noteForm),
      });
      if (res.ok) {
        setNoteForm({ barRange: "", note: "" });
        fetchNotes(activePartId);
      }
    } finally {
      setSubmittingNote(false);
    }
  };

  const toggleNoteApplied = async (noteId: string, applied: boolean) => {
    if (!token) return;
    await fetch(`/api/rehearsal-notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ appliedToChart: applied }),
    });
    if (activePartId) fetchNotes(activePartId);
  };

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#8E9BC0]">Chargement...</p>
      </div>
    );
  }

  if (!user || !song) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#8E9BC0]">Chanson introuvable.</p>
      </div>
    );
  }

  const chart = chordCharts[0] || null;
  const sb = STATUS_BADGE[song.status] || STATUS_BADGE.draft;

  return (
    <DashboardLayout user={user}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Section A: Song Metadata */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#F0F0F0]">{song.title}</h1>
              <p className="text-lg text-[#8E9BC0] mt-1">{song.artist}</p>
            </div>
            <Button size="sm" variant="secondary" onClick={openEditModal}>
              Modifier
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="primary">{song.originalKey}</Badge>
            {song.bpm && <Badge variant="neutral">{song.bpm} BPM</Badge>}
            {song.genre && <Badge variant="neutral">{song.genre}</Badge>}
            {song.durationSeconds && (
              <Badge variant="neutral">
                {Math.floor(song.durationSeconds / 60)}:{String(song.durationSeconds % 60).padStart(2, "0")}
              </Badge>
            )}
            <Badge variant={sb.variant}>{sb.label}</Badge>
          </div>
          {song.sourceUrl && (
            <a
              href={song.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#FF8C45] hover:underline mt-3 inline-block"
            >
              Voir la source
            </a>
          )}
        </Card>

        {/* Section B: Chord Charts */}
        <Card>
          <h2 className="text-xl font-semibold text-[#F0F0F0] mb-4">Grille d&apos;accords</h2>

          {!editingChart && !chart && (
            <div className="text-center py-8">
              <p className="text-[#8E9BC0] mb-4">Aucune grille d&apos;accords</p>
              <Button onClick={startNewChart}>Créer une grille</Button>
            </div>
          )}

          {!editingChart && chart && (
            <>
              <div className="mb-4">
                <Badge variant="primary">Tonalité : {chart.key}</Badge>
              </div>
              {chart.sections.map((section, sIdx) => (
                <div key={sIdx} className="mb-6">
                  <h3 className="text-sm font-semibold text-[#FF8C45] uppercase tracking-wider mb-2">
                    {section.name}
                  </h3>
                  <div className="font-mono text-[#F0F0F0] bg-[#040E3A] rounded-lg p-3">
                    {(() => {
                      const rows: ChordBar[][] = [];
                      for (let i = 0; i < section.bars.length; i += 4) {
                        rows.push(section.bars.slice(i, i + 4));
                      }
                      return rows.map((row, rIdx) => (
                        <div key={rIdx} className="flex">
                          <span className="text-[#8E9BC0]">|</span>
                          {row.map((bar, bIdx) => (
                            <span key={bIdx} className="inline-block w-36 text-center">
                              {bar.chord || "—"}
                              <span className="text-[#8E9BC0] ml-1">|</span>
                            </span>
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              ))}
              <Button size="sm" variant="secondary" onClick={() => startEditChart(chart)}>
                Modifier
              </Button>
            </>
          )}

          {editingChart && (
            <div className="space-y-6">
              <div className="w-48">
                <Select
                  label="Tonalité"
                  options={KEY_OPTIONS.map((k) => ({ value: k, label: k }))}
                  value={chartKey}
                  onChange={(e) => setChartKey(e.target.value)}
                />
              </div>

              {chartSections.map((section, sIdx) => (
                <div key={sIdx} className="border border-[rgba(108,92,231,0.2)] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Input
                      placeholder="Nom de section"
                      value={section.name}
                      onChange={(e) => updateSectionName(sIdx, e.target.value)}
                      className="!py-1.5 flex-1"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {SECTION_SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateSectionName(sIdx, s)}
                          className="text-xs px-2 py-1 rounded bg-[#0A1A4A] text-[#8E9BC0] hover:text-[#F0F0F0] cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSection(sIdx)}
                      className="text-[#8E9BC0] hover:text-red-400 cursor-pointer text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {section.bars.map((bar, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="Cmaj7"
                          value={bar.chord}
                          onChange={(e) => updateBar(sIdx, bIdx, "chord", e.target.value)}
                          className="bg-[#040E3A] border border-[rgba(108,92,231,0.2)] rounded px-2 py-1 text-sm text-[#F0F0F0] font-mono w-full focus:outline-none focus:border-[#FF8C45]"
                        />
                        <select
                          value={bar.beats}
                          onChange={(e) => updateBar(sIdx, bIdx, "beats", Number(e.target.value))}
                          className="bg-[#040E3A] border border-[rgba(108,92,231,0.2)] rounded px-1 py-1 text-xs text-[#8E9BC0] w-12 focus:outline-none appearance-none"
                        >
                          {[2, 3, 4, 5, 6].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeBar(sIdx, bIdx)}
                          className="text-[#8E9BC0] hover:text-red-400 text-sm cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => addBar(sIdx)}>
                    + Mesure
                  </Button>
                </div>
              ))}

              <div className="flex gap-3">
                <Button size="sm" variant="secondary" onClick={addSection}>
                  + Section
                </Button>
                <Button size="sm" onClick={saveChart} disabled={savingChart}>
                  {savingChart ? "Sauvegarde..." : "Sauvegarder la grille"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditingChart(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Section C: Instrument Parts */}
        {chart && (
          <Card>
            <h2 className="text-xl font-semibold text-[#F0F0F0] mb-4">Parties instrumentales</h2>

            {/* Generate parts */}
            <div className="mb-6">
              <p className="text-sm text-[#8E9BC0] mb-3">
                Sélectionnez les instruments pour générer les grilles transposées :
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {ALL_INSTRUMENTS.map((inst) => (
                  <label
                    key={inst}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer border transition-colors ${
                      selectedInstruments.includes(inst)
                        ? "border-[#FF8C45] bg-[#FF8C45]/10 text-[#FF8C45]"
                        : "border-[rgba(108,92,231,0.2)] text-[#8E9BC0] hover:text-[#F0F0F0]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedInstruments.includes(inst)}
                      onChange={() => toggleInstrument(inst)}
                      className="sr-only"
                    />
                    {INSTRUMENT_LABELS[inst]}
                  </label>
                ))}
              </div>
              <Button
                size="sm"
                onClick={() => generateParts(chart.id)}
                disabled={selectedInstruments.length === 0 || generatingParts}
              >
                {generatingParts ? "Génération..." : "Générer les grilles"}
              </Button>
            </div>

            {/* Existing parts */}
            {instrumentParts.length > 0 && (
              <div className="space-y-3">
                {instrumentParts.map((part) => (
                  <div key={part.id}>
                    <div className="flex items-center justify-between p-3 bg-[#040E3A] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="primary">{INSTRUMENT_LABELS[part.instrument]}</Badge>
                        {part.transposedSections && (
                          <span className="text-xs text-[#8E9BC0]">
                            Tonalité transposée
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            window.open(`/api/instrument-parts/${part.id}/pdf`, "_blank")
                          }
                        >
                          Télécharger PDF
                        </Button>
                        <Button
                          size="sm"
                          variant={activePartId === part.id ? "primary" : "secondary"}
                          onClick={() => openNotes(part.id)}
                        >
                          Notes de répétition
                        </Button>
                      </div>
                    </div>

                    {/* Section D: Rehearsal Notes */}
                    {activePartId === part.id && (
                      <div className="mt-2 p-4 bg-[#0A1A4A] rounded-lg space-y-4">
                        <h3 className="text-sm font-semibold text-[#F0F0F0]">
                          Notes de répétition — {INSTRUMENT_LABELS[part.instrument]}
                        </h3>

                        {rehearsalNotes.length === 0 ? (
                          <p className="text-sm text-[#8E9BC0]">Aucune note pour le moment.</p>
                        ) : (
                          <div className="space-y-2">
                            {rehearsalNotes.map((rn) => (
                              <div
                                key={rn.id}
                                className="flex items-start gap-3 p-3 bg-[#040E3A] rounded-lg"
                              >
                                <label className="flex items-center gap-2 cursor-pointer mt-0.5">
                                  <input
                                    type="checkbox"
                                    checked={rn.appliedToChart}
                                    onChange={(e) => toggleNoteApplied(rn.id, e.target.checked)}
                                    className="rounded border-[rgba(108,92,231,0.2)] accent-[#FF8C45]"
                                  />
                                  <span className="text-xs text-[#8E9BC0]">Intégré</span>
                                </label>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="neutral">Mesures {rn.barRange}</Badge>
                                    <span className="text-xs text-[#8E9BC0]">
                                      {rn.authorName}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#F0F0F0]">{rn.note}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add note form */}
                        <form onSubmit={submitNote} className="space-y-3 pt-2 border-t border-[rgba(108,92,231,0.2)]">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <Input
                              placeholder="ex: 12-16"
                              value={noteForm.barRange}
                              onChange={(e) => setNoteForm({ ...noteForm, barRange: e.target.value })}
                              className="sm:col-span-1"
                            />
                            <textarea
                              placeholder="Attention au changement de tempo..."
                              value={noteForm.note}
                              onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
                              className="sm:col-span-3 bg-[#040E3A] border border-[rgba(108,92,231,0.2)] rounded-lg px-4 py-2.5 text-sm text-[#F0F0F0] placeholder:text-[#8E9BC0] focus:outline-none focus:border-[#FF8C45] resize-none"
                              rows={2}
                            />
                          </div>
                          <Button size="sm" type="submit" disabled={submittingNote || !noteForm.note}>
                            {submittingNote ? "Envoi..." : "Ajouter une note"}
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Edit Song Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Modifier la chanson">
        <form onSubmit={handleEditSong} className="space-y-4">
          <Input
            label="Titre"
            required
            value={editForm.title || ""}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <Input
            label="Artiste"
            required
            value={editForm.artist || ""}
            onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
          />
          <Select
            label="Tonalité"
            options={KEY_OPTIONS.map((k) => ({ value: k, label: k }))}
            value={editForm.originalKey || "C"}
            onChange={(e) => setEditForm({ ...editForm, originalKey: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="BPM"
              type="number"
              value={editForm.bpm || ""}
              onChange={(e) => setEditForm({ ...editForm, bpm: e.target.value })}
            />
            <Input
              label="Durée (secondes)"
              type="number"
              value={editForm.durationSeconds || ""}
              onChange={(e) => setEditForm({ ...editForm, durationSeconds: e.target.value })}
            />
          </div>
          <Input
            label="Genre"
            value={editForm.genre || ""}
            onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
          />
          <Input
            label="URL source"
            type="url"
            value={editForm.sourceUrl || ""}
            onChange={(e) => setEditForm({ ...editForm, sourceUrl: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
