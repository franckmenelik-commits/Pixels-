'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const MUSIC_STYLES = ['Jazz', 'Pop', 'Rock', 'R&B', 'Soul', 'Classique', 'Afro', 'Latin', 'Funk', 'Blues', 'Hip-Hop', 'Électronique', 'Folk', 'Autre'];
const INSTRUMENTS = ['Piano', 'Guitare', 'Basse', 'Batterie', 'Violon', 'Saxophone', 'Trompette', 'Flûte', 'Voix', 'Contrebasse', 'Ukulélé', 'Percussion', 'Clavier', 'Autre'];

export default function NewEventPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: 'standard',
    name: '', dateStart: '', dateEnd: '', venue: '', address: '', venueType: '',
    guestCount: '', description: '', dressCode: '',
    musicStyles: [] as string[], playlistUrl: '', musiciansCount: '', instruments: [] as string[], duration: '',
    hasPower: false, hasSound: false, hasStage: false, hasParking: false, transportByOrg: false,
    budget: '', paymentMethod: '',
  });

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);

  const update = (field: string, value: string | boolean) => setForm(f => ({ ...f, [field]: value }));

  const toggleArray = (field: 'musicStyles' | 'instruments', val: string) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter((v: string) => v !== val) : [...f[field], val],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Erreur'); }
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) return <div className="min-h-screen bg-[#040E3A] flex items-center justify-center"><div className="text-[#8E9BC0]">Chargement...</div></div>;

  return (
    <DashboardLayout user={user}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-[#F0F0F0]">Soumettre un événement</h1>

        {error && <div className="bg-[#FF8C45]/10 border border-[#FF8C45]/30 text-[#FF8C45] rounded-lg p-3 text-sm">{error}</div>}

        <Card>
          <h2 className="text-xl font-semibold text-[#061E66] mb-4">Informations générales</h2>
          <div className="space-y-4">
            <Select
              label="Type d'événement"
              value={form.type}
              onChange={e => update('type', e.target.value)}
              options={[
                { value: 'access', label: 'Access (gratuit)' },
                { value: 'standard', label: 'Standard' },
                { value: 'premium', label: 'Premium' },
              ]}
            />
            <Input label="Nom de l'événement" value={form.name} onChange={e => update('name', e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Début" type="datetime-local" value={form.dateStart} onChange={e => update('dateStart', e.target.value)} required />
              <Input label="Fin" type="datetime-local" value={form.dateEnd} onChange={e => update('dateEnd', e.target.value)} required />
            </div>
            <Input label="Lieu" value={form.venue} onChange={e => update('venue', e.target.value)} required />
            <Input label="Adresse" value={form.address} onChange={e => update('address', e.target.value)} />
            <Select
              label="Type de lieu"
              value={form.venueType}
              onChange={e => update('venueType', e.target.value)}
              options={[
                { value: '', label: 'Sélectionner...' },
                { value: 'indoor', label: 'Intérieur' },
                { value: 'outdoor', label: 'Extérieur' },
                { value: 'hybrid', label: 'Hybride' },
              ]}
            />
            <Input label="Nombre d'invités" type="number" value={form.guestCount} onChange={e => update('guestCount', e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-[#F0F0F0] mb-1">Description</label>
              <textarea
                className="w-full rounded-lg bg-[#040E3A] border border-[#0A1A4A] text-[#F0F0F0] p-3 focus:border-[#FF8C45] focus:outline-none"
                rows={3}
                value={form.description}
                onChange={e => update('description', e.target.value)}
              />
            </div>
            <Input label="Code vestimentaire" value={form.dressCode} onChange={e => update('dressCode', e.target.value)} />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[#061E66] mb-4">Musique</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#F0F0F0] mb-2">Styles musicaux</label>
              <div className="flex flex-wrap gap-2">
                {MUSIC_STYLES.map(s => (
                  <button key={s} type="button" onClick={() => toggleArray('musicStyles', s)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${form.musicStyles.includes(s) ? 'bg-[#FF8C45] text-white' : 'bg-[#040E3A] text-[#8E9BC0] border border-[#0A1A4A] hover:border-[#FF8C45]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Input label="URL Playlist" value={form.playlistUrl} onChange={e => update('playlistUrl', e.target.value)} />
            <Input label="Nombre de musiciens souhaités" type="number" value={form.musiciansCount} onChange={e => update('musiciansCount', e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-[#F0F0F0] mb-2">Instruments souhaités</label>
              <div className="flex flex-wrap gap-2">
                {INSTRUMENTS.map(inst => (
                  <button key={inst} type="button" onClick={() => toggleArray('instruments', inst)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${form.instruments.includes(inst) ? 'bg-[#061E66] text-[#040E3A]' : 'bg-[#040E3A] text-[#8E9BC0] border border-[#0A1A4A] hover:border-[#061E66]'}`}>
                    {inst}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Durée (heures)" type="number" value={form.duration} onChange={e => update('duration', e.target.value)} />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[#061E66] mb-4">Logistique</h2>
          <div className="space-y-3">
            {[
              { key: 'hasPower', label: 'Alimentation électrique disponible' },
              { key: 'hasSound', label: 'Système de son disponible' },
              { key: 'hasStage', label: 'Scène disponible' },
              { key: 'hasParking', label: 'Stationnement disponible' },
              { key: 'transportByOrg', label: "Transport fourni par l'organisateur" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 text-[#F0F0F0]">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={e => update(key, e.target.checked)} className="accent-[#FF8C45]" />
                {label}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[#061E66] mb-4">Budget</h2>
          <div className="space-y-4">
            <Input label="Budget ($CAD)" type="number" value={form.budget} onChange={e => update('budget', e.target.value)} />
            <Select
              label="Méthode de paiement"
              value={form.paymentMethod}
              onChange={e => update('paymentMethod', e.target.value)}
              options={[
                { value: '', label: 'Sélectionner...' },
                { value: 'transfer', label: 'Virement bancaire' },
                { value: 'cash', label: 'Comptant' },
                { value: 'cheque', label: 'Chèque' },
                { value: 'other', label: 'Autre' },
              ]}
            />
          </div>
        </Card>

        <Button variant="primary" size="lg" type="submit" disabled={submitting}>
          {submitting ? 'Envoi...' : "Soumettre l'événement"}
        </Button>
      </form>
    </DashboardLayout>
  );
}
