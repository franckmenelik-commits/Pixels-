"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth-context";

interface ChordSheets {
  piano?: string;
  guitare?: string;
  basse?: string;
  voix?: string;
  batterie?: string;
}

interface Song {
  _id?: string;
  id?: string;
  title: string;
  artistOriginal?: string;
  key?: string;
  tempoBpm?: number;
  genre?: string;
  difficulty?: string;
  tags?: string[];
  referenceUrl?: string;
  chordSheets?: ChordSheets;
}

const genres = [
  { value: "", label: "Tous les genres" },
  { value: "rock", label: "Rock" },
  { value: "pop", label: "Pop" },
  { value: "jazz", label: "Jazz" },
  { value: "blues", label: "Blues" },
  { value: "funk", label: "Funk" },
  { value: "soul", label: "Soul" },
  { value: "reggae", label: "Reggae" },
  { value: "metal", label: "Metal" },
  { value: "classique", label: "Classique" },
  { value: "hip-hop", label: "Hip-Hop" },
  { value: "electro", label: "Electro" },
  { value: "folk", label: "Folk" },
  { value: "country", label: "Country" },
  { value: "latin", label: "Latin" },
  { value: "other", label: "Autre" },
];

const difficulties = [
  { value: "", label: "Toutes difficultés" },
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
  { value: "expert", label: "Expert" },
];

const difficultyVariant = (d?: string) => {
  switch (d) {
    case "easy": return "success" as const;
    case "medium": return "warning" as const;
    case "hard": return "error" as const;
    case "expert": return "error" as const;
    default: return "neutral" as const;
  }
};

const instruments = ["piano", "guitare", "basse", "voix", "batterie"] as const;
const instrumentLabels: Record<string, string> = {
  piano: "Piano",
  guitare: "Guitare",
  basse: "Basse",
  voix: "Voix",
  batterie: "Batterie",
};

export default function SongsPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [activeTab, setActiveTab] = useState<string>("piano");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: "", artistOriginal: "", key: "", tempoBpm: "", genre: "", difficulty: "",
    tags: "", referenceUrl: "",
    chordSheets: { piano: "", guitare: "", basse: "", voix: "", batterie: "" },
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || !token) return;
    fetch("/api/songs", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setSongs(d.songs || []))
      .catch(() => {});
  }, [user, token]);

  if (authLoading || !user) return <div className="min-h-screen bg-[#040E3A] flex items-center justify-center"><div className="text-[#8E9BC0]">Chargement...</div></div>;

  const filtered = songs.filter(s => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.artistOriginal?.toLowerCase().includes(search.toLowerCase());
    const matchGenre = !genreFilter || s.genre === genreFilter;
    const matchDiff = !difficultyFilter || s.difficulty === difficultyFilter;
    return matchSearch && matchGenre && matchDiff;
  });

  const isAdmin = user.role === "admin" || user.role === "operator";

  const handleAddSong = async () => {
    try {
      const body = {
        ...form,
        tempoBpm: form.tempoBpm ? Number(form.tempoBpm) : undefined,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
      };
      const res = await fetch("/api/songs", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        setSongs(prev => [...prev, data.song]);
        setShowAddModal(false);
        setForm({ title: "", artistOriginal: "", key: "", tempoBpm: "", genre: "", difficulty: "", tags: "", referenceUrl: "", chordSheets: { piano: "", guitare: "", basse: "", voix: "", batterie: "" } });
      }
    } catch {}
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#F0F0F0]">
            Bibliothèque Musicale <span className="text-lg font-normal text-[#8E9BC0]">({filtered.length})</span>
          </h1>
          {isAdmin && <Button onClick={() => setShowAddModal(true)}>+ Ajouter un morceau</Button>}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input placeholder="Rechercher par titre ou artiste..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select label="" options={genres} value={genreFilter} onChange={e => setGenreFilter(e.target.value)} />
          <Select label="" options={difficulties} value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <Card><p className="text-[#8E9BC0]">Aucun morceau trouvé.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(song => (
              <div key={song.id || song._id} onClick={() => { setSelectedSong(song); setActiveTab("piano"); }} className="cursor-pointer">
                <Card>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-[#F0F0F0]">{song.title}</h3>
                      {song.genre && <Badge variant="primary">{song.genre}</Badge>}
                    </div>
                    {song.artistOriginal && <p className="text-sm text-[#8E9BC0]">{song.artistOriginal}</p>}
                    <div className="flex gap-3 text-sm text-[#8E9BC0]">
                      {song.key && <span>Tonalité: <span className="text-[#F0F0F0]">{song.key}</span></span>}
                      {song.tempoBpm && <span>Tempo: <span className="text-[#F0F0F0]">{song.tempoBpm} BPM</span></span>}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {song.difficulty && <Badge variant={difficultyVariant(song.difficulty)}>{song.difficulty}</Badge>}
                      {song.tags?.map(tag => <Badge key={tag} variant="neutral">{tag}</Badge>)}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Song Detail Modal */}
      <Modal isOpen={!!selectedSong} onClose={() => setSelectedSong(null)} title={selectedSong?.title}>
        {selectedSong && (
          <div className="space-y-4">
            <div className="flex gap-4 text-sm text-[#8E9BC0]">
              {selectedSong.artistOriginal && <span>{selectedSong.artistOriginal}</span>}
              {selectedSong.key && <span>Tonalité: {selectedSong.key}</span>}
              {selectedSong.tempoBpm && <span>{selectedSong.tempoBpm} BPM</span>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {selectedSong.genre && <Badge variant="primary">{selectedSong.genre}</Badge>}
              {selectedSong.difficulty && <Badge variant={difficultyVariant(selectedSong.difficulty)}>{selectedSong.difficulty}</Badge>}
              {selectedSong.tags?.map(tag => <Badge key={tag} variant="neutral">{tag}</Badge>)}
            </div>
            {selectedSong.referenceUrl && (
              <a href={selectedSong.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-[#061E66] text-sm hover:underline">Référence</a>
            )}
            <div className="flex gap-1 border-b border-[rgba(108,92,231,0.2)]">
              {instruments.map(inst => (
                <button key={inst} onClick={() => setActiveTab(inst)}
                  className={`px-3 py-2 text-sm transition-colors cursor-pointer ${activeTab === inst ? "text-[#FF8C45] border-b-2 border-[#FF8C45]" : "text-[#8E9BC0] hover:text-[#F0F0F0]"}`}
                >{instrumentLabels[inst]}</button>
              ))}
            </div>
            <div className="bg-[#040E3A] rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-auto">
              <pre className="font-mono text-sm text-[#F0F0F0] whitespace-pre-wrap">
                {selectedSong.chordSheets?.[activeTab as keyof ChordSheets] || "Aucune partition disponible pour cet instrument."}
              </pre>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Song Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter un morceau">
        <div className="space-y-4 max-h-[70vh] overflow-auto">
          <Input label="Titre" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Input label="Artiste original" value={form.artistOriginal} onChange={e => setForm({ ...form, artistOriginal: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tonalité" value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} placeholder="ex: Am, C, G" />
            <Input label="Tempo (BPM)" type="number" value={form.tempoBpm} onChange={e => setForm({ ...form, tempoBpm: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Genre" options={genres} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
            <Select label="Difficulté" options={difficulties} value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} />
          </div>
          <Input label="Tags (séparés par des virgules)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
          <Input label="URL de référence" value={form.referenceUrl} onChange={e => setForm({ ...form, referenceUrl: e.target.value })} />
          <div className="space-y-3">
            <p className="text-sm text-[#8E9BC0]">Partitions par instrument</p>
            {instruments.map(inst => (
              <div key={inst} className="flex flex-col gap-1.5">
                <label className="text-sm text-[#8E9BC0]">{instrumentLabels[inst]}</label>
                <textarea
                  className="bg-[var(--surface)] border border-[rgba(108,92,231,0.2)] rounded-lg px-4 py-2.5 text-[var(--text)] font-mono text-sm focus:outline-none focus:border-[var(--primary)] transition-colors min-h-[80px] resize-y"
                  value={form.chordSheets[inst]}
                  onChange={e => setForm({ ...form, chordSheets: { ...form.chordSheets, [inst]: e.target.value } })}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Annuler</Button>
            <Button onClick={handleAddSong} disabled={!form.title}>Ajouter</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
