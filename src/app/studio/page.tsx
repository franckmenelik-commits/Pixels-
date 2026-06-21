"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import type { Song } from "@/lib/music/types";

const KEY_OPTIONS = [
  "C","C#","Db","D","D#","Eb","E","F","F#","Gb","G","G#","Ab","A","A#","Bb","B",
  "Am","Bbm","Bm","Cm","C#m","Dm","Ebm","Em","Fm","F#m","Gm","G#m","Abm",
];

const GENRE_OPTIONS = [
  { value: "", label: "Tous les genres" },
  { value: "jazz", label: "Jazz" },
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "funk", label: "Funk" },
  { value: "soul", label: "Soul" },
  { value: "blues", label: "Blues" },
  { value: "classical", label: "Classique" },
  { value: "latin", label: "Latin" },
  { value: "other", label: "Autre" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "draft", label: "Brouillon" },
  { value: "chord_detected", label: "Accords détectés" },
  { value: "arranged", label: "Arrangé" },
  { value: "ready", label: "Prêt" },
];

const STATUS_BADGE: Record<string, { variant: "neutral" | "warning" | "primary" | "success"; label: string }> = {
  draft: { variant: "neutral", label: "Brouillon" },
  chord_detected: { variant: "warning", label: "Accords détectés" },
  arranged: { variant: "primary", label: "Arrangé" },
  ready: { variant: "success", label: "Prêt" },
};

export default function StudioPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    originalKey: "C",
    bpm: "",
    genre: "",
    durationSeconds: "",
    sourceUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSongs = async () => {
    if (!token) return;
    setFetching(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre) params.set("genre", genre);
    if (status) params.set("status", status);
    try {
      const res = await fetch(`/api/songs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSongs(Array.isArray(data) ? data : data.songs || []);
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && token) fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, token, genre, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSongs();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || submitting) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: formData.title,
        artist: formData.artist,
        originalKey: formData.originalKey,
      };
      if (formData.bpm) body.bpm = Number(formData.bpm);
      if (formData.genre) body.genre = formData.genre;
      if (formData.durationSeconds) body.durationSeconds = Number(formData.durationSeconds);
      if (formData.sourceUrl) body.sourceUrl = formData.sourceUrl;

      const res = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ title: "", artist: "", originalKey: "C", bpm: "", genre: "", durationSeconds: "", sourceUrl: "" });
        fetchSongs();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--text-muted)]">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--text-muted)]">Veuillez vous connecter.</p>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Studio Musical</h1>
            <p className="text-[var(--text-muted)] mt-1">
              {songs.length} chanson{songs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>Nouvelle chanson</Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <Input
              placeholder="Rechercher par titre ou artiste..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="w-48">
            <Select
              options={GENRE_OPTIONS}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>

        {/* Songs grid */}
        {fetching ? (
          <p className="text-[var(--text-muted)] text-center py-12">Chargement des chansons...</p>
        ) : songs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-[var(--text-muted)]">Aucune chanson trouvée.</p>
            <Button className="mt-4" onClick={() => setShowModal(true)}>
              Ajouter une chanson
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song) => {
              const sb = STATUS_BADGE[song.status] || STATUS_BADGE.draft;
              return (
                <Card
                  key={song.id}
                  className="cursor-pointer hover:border-[var(--primary)]/40 transition-colors border border-transparent"
                >
                  <div onClick={() => router.push(`/studio/${song.id}`)} className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text)]">{song.title}</h3>
                      <p className="text-[var(--text-muted)] text-sm">{song.artist}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {song.originalKey && (
                        <Badge variant="primary">{song.originalKey}</Badge>
                      )}
                      {song.bpm && (
                        <Badge variant="neutral">{song.bpm} BPM</Badge>
                      )}
                      {song.genre && (
                        <Badge variant="neutral">{song.genre}</Badge>
                      )}
                      <Badge variant={sb.variant}>{sb.label}</Badge>
                    </div>
                    {song.sourceUrl && (
                      <a
                        href={song.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-[var(--primary)] hover:underline block truncate"
                      >
                        Source
                      </a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Song Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle chanson">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Titre"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Input
            label="Artiste"
            required
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
          />
          <Select
            label="Tonalité"
            options={KEY_OPTIONS.map((k) => ({ value: k, label: k }))}
            value={formData.originalKey}
            onChange={(e) => setFormData({ ...formData, originalKey: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="BPM"
              type="number"
              value={formData.bpm}
              onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
            />
            <Input
              label="Durée (secondes)"
              type="number"
              value={formData.durationSeconds}
              onChange={(e) => setFormData({ ...formData, durationSeconds: e.target.value })}
            />
          </div>
          <Select
            label="Genre"
            options={GENRE_OPTIONS}
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          />
          <Input
            label="URL source"
            type="url"
            value={formData.sourceUrl}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
