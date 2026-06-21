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

interface Equipment {
  _id?: string;
  id?: string;
  name: string;
  type?: string;
  ownerType?: string;
  condition?: string;
  status?: string;
  value?: number;
  description?: string;
}

interface Loan {
  _id?: string;
  id?: string;
  equipmentId: string;
  equipmentName?: string;
  borrower?: string;
  borrowDate?: string;
  returnDate?: string;
  status?: string;
}

const typeFilters = ["Tous", "Instruments", "Son", "Câbles", "Accessoires"];
const typeApiValues: Record<string, string> = {
  Instruments: "instrument", Son: "sound", "Câbles": "cable", Accessoires: "accessory",
};

const conditionConfig: Record<string, { variant: "success" | "primary" | "warning" | "error" | "neutral"; label: string }> = {
  new: { variant: "success", label: "Neuf" },
  good: { variant: "primary", label: "Bon" },
  worn: { variant: "warning", label: "Usé" },
  repair: { variant: "warning", label: "À réparer" },
  broken: { variant: "error", label: "Cassé" },
};

const statusLabel = (s?: string) => {
  switch (s) {
    case "available": return "Disponible";
    case "in_use": return "En utilisation";
    case "loaned": return "Prêté";
    case "maintenance": return "Maintenance";
    default: return s || "Disponible";
  }
};

const equipmentTypes = [
  { value: "", label: "Choisir un type" },
  { value: "instrument", label: "Instrument" },
  { value: "sound", label: "Son" },
  { value: "cable", label: "Câble" },
  { value: "accessory", label: "Accessoire" },
];

const conditions = [
  { value: "new", label: "Neuf" },
  { value: "good", label: "Bon" },
  { value: "worn", label: "Usé" },
  { value: "repair", label: "À réparer" },
  { value: "broken", label: "Cassé" },
];

export default function EquipmentPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "", condition: "good", status: "available", value: "", description: "", ownerType: "association" });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || !token) return;
    fetch("/api/equipment", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setEquipment(d.equipment || []); setLoans(d.loans || []); })
      .catch(() => {});
  }, [user, token]);

  if (authLoading || !user) return <div className="min-h-screen bg-[#040E3A] flex items-center justify-center"><div className="text-[#8E9BC0]">Chargement...</div></div>;

  const isAdmin = user.role === "admin" || user.role === "operator";
  const filtered = activeFilter === "Tous" ? equipment : equipment.filter(e => e.type === typeApiValues[activeFilter]);

  const handleBorrow = async (eqId: string) => {
    try {
      const res = await fetch("/api/equipment/loans", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ equipmentId: eqId }) });
      if (res.ok) {
        const data = await res.json();
        if (data.loan) setLoans(prev => [...prev, data.loan]);
        setEquipment(prev => prev.map(e => (e.id || e._id) === eqId ? { ...e, status: "loaned" } : e));
      }
    } catch {}
  };

  const handleAdd = async () => {
    try {
      const body = { ...form, value: form.value ? Number(form.value) : undefined };
      const res = await fetch("/api/equipment", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        setEquipment(prev => [...prev, data.equipment]);
        setShowAddModal(false);
        setForm({ name: "", type: "", condition: "good", status: "available", value: "", description: "", ownerType: "association" });
      }
    } catch {}
  };

  const activeLoans = loans.filter(l => !l.returnDate);

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#F0F0F0]">Inventaire & Équipement</h1>
          {isAdmin && <Button onClick={() => setShowAddModal(true)}>+ Ajouter</Button>}
        </div>

        <div className="flex gap-2 flex-wrap">
          {typeFilters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${activeFilter === f ? "bg-[#FF8C45] text-white" : "bg-[#0A1A4A] text-[#8E9BC0] hover:text-[#F0F0F0]"}`}
            >{f}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card><p className="text-[#8E9BC0]">Aucun équipement trouvé.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(eq => {
              const eqId = eq.id || eq._id!;
              const cond = conditionConfig[eq.condition || "good"] || conditionConfig.good;
              return (
                <Card key={eqId}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-[#F0F0F0]">{eq.name}</h3>
                      <Badge variant="primary">{eq.type || "autre"}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={cond.variant}>{cond.label}</Badge>
                      <Badge variant="neutral">{statusLabel(eq.status)}</Badge>
                    </div>
                    {eq.ownerType && <p className="text-xs text-[#8E9BC0]">Propriétaire: {eq.ownerType}</p>}
                    {eq.value != null && <p className="text-sm text-[#061E66]">{eq.value.toLocaleString("fr-FR")} €</p>}
                    {eq.status === "available" && (
                      <Button size="sm" variant="secondary" onClick={() => handleBorrow(eqId)}>Emprunter</Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeLoans.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#F0F0F0]">Emprunts actifs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeLoans.map(loan => (
                <Card key={loan.id || loan._id}>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[#F0F0F0]">{loan.equipmentName || "Équipement"}</h3>
                    {loan.borrower && <p className="text-sm text-[#8E9BC0]">Emprunteur: {loan.borrower}</p>}
                    {loan.borrowDate && <p className="text-xs text-[#8E9BC0]">Depuis: {new Date(loan.borrowDate).toLocaleDateString("fr-FR")}</p>}
                    <Badge variant="warning">En cours</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter un équipement">
        <div className="space-y-4">
          <Input label="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Select label="Type" options={equipmentTypes} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
          <Select label="État" options={conditions} value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} />
          <Input label="Valeur (€)" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#8E9BC0]">Description</label>
            <textarea className="bg-[var(--surface)] border border-[rgba(108,92,231,0.2)] rounded-lg px-4 py-2.5 text-[var(--text)] focus:outline-none focus:border-[var(--primary)] transition-colors min-h-[60px] resize-y" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Annuler</Button>
            <Button onClick={handleAdd} disabled={!form.name}>Ajouter</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
