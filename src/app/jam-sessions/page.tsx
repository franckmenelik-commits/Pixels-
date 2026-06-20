"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface JamSession {
  _id: string;
  date: string;
  venueName?: string;
  venueAddress?: string;
  theme?: string;
  capacity?: number;
  participants?: string[];
  description?: string;
  status?: string;
  photos?: string[];
  feedbackSummary?: string;
}

const statusVariant = (s?: string) => {
  switch (s) {
    case "upcoming": return "primary" as const;
    case "ongoing": return "success" as const;
    case "completed": return "neutral" as const;
    case "cancelled": return "error" as const;
    default: return "neutral" as const;
  }
};

const statusLabel = (s?: string) => {
  switch (s) {
    case "upcoming": return "À venir";
    case "ongoing": return "En cours";
    case "completed": return "Terminée";
    case "cancelled": return "Annulée";
    default: return s || "À venir";
  }
};

const formatDate = (d: string) => {
  return new Date(d).toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

export default function JamSessionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<JamSession[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ date: "", venueName: "", venueAddress: "", theme: "", capacity: "", description: "" });

  useEffect(() => {
    fetch("/api/auth/me").then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(d => setUser(d.user)).catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/jam-sessions").then(r => r.json()).then(d => setSessions(d.sessions || [])).catch(() => {});
  }, [user]);

  if (!user) return <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center"><div className="text-[#8E8E9A]">Chargement...</div></div>;

  const now = new Date();
  const upcoming = sessions.filter(s => new Date(s.date) >= now && s.status !== "completed");
  const past = sessions.filter(s => new Date(s.date) < now || s.status === "completed");
  const isAdmin = user.role === "admin" || user.role === "operator";

  const handleJoinLeave = async (sessionId: string, action: "join" | "leave") => {
    try {
      const res = await fetch(`/api/jam-sessions/${sessionId}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, ...data.session } : s));
      }
    } catch {}
  };

  const handleCreate = async () => {
    try {
      const body = { ...form, capacity: form.capacity ? Number(form.capacity) : undefined };
      const res = await fetch("/api/jam-sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        setSessions(prev => [...prev, data.session]);
        setShowCreateModal(false);
        setForm({ date: "", venueName: "", venueAddress: "", theme: "", capacity: "", description: "" });
      }
    } catch {}
  };

  const isParticipant = (s: JamSession) => s.participants?.includes(user._id || user.id);

  const SessionCard = ({ session, isPast }: { session: JamSession; isPast?: boolean }) => (
    <Card>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-[#F0F0F0]">{session.theme || "Jam Session"}</h3>
          <Badge variant={statusVariant(session.status)}>{statusLabel(session.status)}</Badge>
        </div>
        <p className="text-sm text-[#6C5CE7]">{formatDate(session.date)}</p>
        {session.venueName && <p className="text-sm text-[#8E8E9A]">{session.venueName}</p>}
        <div className="flex items-center gap-2 text-sm text-[#8E8E9A]">
          <span>{session.participants?.length || 0}{session.capacity ? `/${session.capacity}` : ""} participants</span>
        </div>
        {session.description && <p className="text-sm text-[#8E8E9A] line-clamp-2">{session.description}</p>}
        {isPast && (
          <div className="flex gap-4 text-xs text-[#8E8E9A]">
            {session.photos && <span>{session.photos.length} photos</span>}
            {session.feedbackSummary && <span className="text-[#00D2FF]">Feedback disponible</span>}
          </div>
        )}
        {!isPast && (
          <div className="pt-2">
            {isParticipant(session) ? (
              <Button variant="danger" size="sm" onClick={() => handleJoinLeave(session._id, "leave")}>Quitter</Button>
            ) : (
              <Button size="sm" onClick={() => handleJoinLeave(session._id, "join")}
                disabled={!!session.capacity && (session.participants?.length || 0) >= session.capacity}>
                Rejoindre
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#F0F0F0]">
            Jam Sessions <span className="text-lg font-normal text-[#8E8E9A]">({upcoming.length} à venir)</span>
          </h1>
          {isAdmin && <Button onClick={() => setShowCreateModal(true)}>+ Créer une session</Button>}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#F0F0F0]">Prochaines Sessions</h2>
          {upcoming.length === 0 ? (
            <Card><p className="text-[#8E8E9A]">Aucune session à venir.</p></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map(s => <SessionCard key={s._id} session={s} />)}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#F0F0F0]">Sessions Passées</h2>
          {past.length === 0 ? (
            <Card><p className="text-[#8E8E9A]">Aucune session passée.</p></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map(s => <SessionCard key={s._id} session={s} isPast />)}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Créer une Jam Session">
        <div className="space-y-4">
          <Input label="Date et heure" type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <Input label="Nom du lieu" value={form.venueName} onChange={e => setForm({ ...form, venueName: e.target.value })} required />
          <Input label="Adresse" value={form.venueAddress} onChange={e => setForm({ ...form, venueAddress: e.target.value })} />
          <Input label="Thème" value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })} />
          <Input label="Capacité" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#8E8E9A]">Description</label>
            <textarea className="bg-[var(--surface)] border border-[rgba(108,92,231,0.2)] rounded-lg px-4 py-2.5 text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-colors min-h-[80px] resize-y" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!form.date || !form.venueName}>Créer</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
