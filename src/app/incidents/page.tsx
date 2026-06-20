"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

interface Incident {
  _id: string;
  date: string;
  location?: string;
  description: string;
  partiesInvolved?: string[];
  damagesEstimate?: number;
  status?: string;
  resolution?: string;
  lessonsLearned?: string;
  insuranceRef?: string;
}

const statusConfig: Record<string, { variant: "warning" | "primary" | "success" | "neutral"; label: string }> = {
  open: { variant: "warning", label: "Ouvert" },
  in_progress: { variant: "primary", label: "En cours" },
  resolved: { variant: "success", label: "Résolu" },
};

const statusFilters = [
  { value: "", label: "Tous" },
  { value: "open", label: "Ouvert" },
  { value: "in_progress", label: "En cours" },
  { value: "resolved", label: "Résolu" },
];

export default function IncidentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ date: "", location: "", description: "", partiesInvolved: "", damagesEstimate: "" });

  useEffect(() => {
    fetch("/api/auth/me").then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(d => setUser(d.user)).catch(() => router.push("/login"));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/incidents").then(r => r.json()).then(d => setIncidents(d.incidents || [])).catch(() => {});
  }, [user]);

  if (!user) return <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center"><div className="text-[#8E8E9A]">Chargement...</div></div>;

  const filtered = statusFilter ? incidents.filter(i => i.status === statusFilter) : incidents;

  const handleCreate = async () => {
    try {
      const body = {
        ...form,
        partiesInvolved: form.partiesInvolved ? form.partiesInvolved.split(",").map(p => p.trim()) : [],
        damagesEstimate: form.damagesEstimate ? Number(form.damagesEstimate) : undefined,
      };
      const res = await fetch("/api/incidents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        setIncidents(prev => [...prev, data.incident]);
        setShowCreateModal(false);
        setForm({ date: "", location: "", description: "", partiesInvolved: "", damagesEstimate: "" });
      }
    } catch {}
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#F0F0F0]">Gestion des Incidents</h1>
          <Button onClick={() => setShowCreateModal(true)}>+ Signaler un incident</Button>
        </div>

        <div className="flex gap-2">
          {statusFilters.map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${statusFilter === f.value ? "bg-[#6C5CE7] text-white" : "bg-[#1A1A2E] text-[#8E8E9A] hover:text-[#F0F0F0]"}`}
            >{f.label}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card><p className="text-[#8E8E9A]">Aucun incident trouvé.</p></Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(incident => {
              const config = statusConfig[incident.status || "open"] || statusConfig.open;
              const isExpanded = expandedId === incident._id;
              return (
                <div key={incident._id} onClick={() => setExpandedId(isExpanded ? null : incident._id)} className="cursor-pointer">
                  <Card>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-sm text-[#6C5CE7]">
                              {new Date(incident.date).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                            </p>
                            {incident.location && <span className="text-sm text-[#8E8E9A]">{incident.location}</span>}
                          </div>
                          <p className={`text-[#F0F0F0] ${isExpanded ? "" : "line-clamp-2"}`}>{incident.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <Badge variant={config.variant}>{config.label}</Badge>
                          {incident.damagesEstimate != null && (
                            <span className="text-sm text-[#FF6B6B]">{incident.damagesEstimate.toLocaleString("fr-FR")} €</span>
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-[rgba(108,92,231,0.2)] pt-4 space-y-3">
                          {incident.partiesInvolved && incident.partiesInvolved.length > 0 && (
                            <div>
                              <p className="text-xs text-[#8E8E9A] mb-1">Parties impliquées</p>
                              <div className="flex gap-2 flex-wrap">
                                {incident.partiesInvolved.map((p, i) => <Badge key={i} variant="neutral">{p}</Badge>)}
                              </div>
                            </div>
                          )}
                          {incident.resolution && (
                            <div>
                              <p className="text-xs text-[#8E8E9A] mb-1">Résolution</p>
                              <p className="text-sm text-[#F0F0F0]">{incident.resolution}</p>
                            </div>
                          )}
                          {incident.lessonsLearned && (
                            <div className="bg-[#6C5CE7]/10 border border-[#6C5CE7]/30 rounded-lg p-3">
                              <p className="text-xs text-[#6C5CE7] font-semibold mb-1">Leçons apprises</p>
                              <p className="text-sm text-[#F0F0F0]">{incident.lessonsLearned}</p>
                            </div>
                          )}
                          {incident.insuranceRef && (
                            <p className="text-xs text-[#8E8E9A]">Réf. assurance: {incident.insuranceRef}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Signaler un incident">
        <div className="space-y-4">
          <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <Input label="Lieu" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#8E8E9A]">Description</label>
            <textarea className="bg-[var(--surface)] border border-[rgba(108,92,231,0.2)] rounded-lg px-4 py-2.5 text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-colors min-h-[100px] resize-y" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <Input label="Parties impliquées (séparées par des virgules)" value={form.partiesInvolved} onChange={e => setForm({ ...form, partiesInvolved: e.target.value })} />
          <Input label="Estimation des dommages (€)" type="number" value={form.damagesEstimate} onChange={e => setForm({ ...form, damagesEstimate: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Annuler</Button>
            <Button onClick={handleCreate} disabled={!form.date || !form.description}>Signaler</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
