"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Venue {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  capacity: number | null;
  contactName: string;
  contactEmail: string;
}

export default function VenuesPage() {
  const { user, token } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "venue", address: "", city: "Montréal", capacity: "", contactName: "", contactEmail: "" });

  useEffect(() => {
    if (!token) return;
    fetch("/api/venues", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => Array.isArray(data) && setVenues(data));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/venues", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, capacity: form.capacity ? parseInt(form.capacity) : null }),
    });
    if (res.ok) {
      const venue = await res.json();
      setVenues(prev => [venue, ...prev]);
      setShowForm(false);
      setForm({ name: "", type: "venue", address: "", city: "Montréal", capacity: "", contactName: "", contactEmail: "" });
    }
  }

  if (!user) return null;

  return (
    <DashboardLayout user={{ name: user.displayName || user.email || "", role: (user as any).role || "artist" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Studios & Salles</h1>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium">
            + Ajouter
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white border border-[var(--border)] rounded-xl p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Nom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" />
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
                <option value="venue">Salle</option>
                <option value="studio">Studio</option>
                <option value="rehearsal">Local de répétition</option>
              </select>
              <input placeholder="Adresse" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" />
              <input placeholder="Capacité" type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" />
              <input placeholder="Contact" value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" />
              <input placeholder="Email contact" type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]" />
            </div>
            <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium">Enregistrer</button>
          </form>
        )}

        <div className="grid gap-4">
          {venues.map(v => (
            <div key={v.id} className="bg-white border border-[var(--border)] rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{v.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">{v.address} — {v.city}</p>
                {v.contactName && <p className="text-xs text-[var(--text-light)] mt-1">{v.contactName} · {v.contactEmail}</p>}
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--surface)] text-[var(--text-muted)] capitalize">{v.type}</span>
                {v.capacity && <p className="text-xs text-[var(--text-light)] mt-1">{v.capacity} pers.</p>}
              </div>
            </div>
          ))}
          {venues.length === 0 && <p className="text-center text-[var(--text-muted)] py-12">Aucun lieu enregistré</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
