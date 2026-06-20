'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface User { _id: string; name: string; email: string; role: string; artistProfile?: string; }

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const SLOTS = ['Matin', 'Après-midi', 'Soir'];

type AvailabilityGrid = Record<string, Record<string, boolean>>;

export default function AvailabilityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [grid, setGrid] = useState<AvailabilityGrid>({});
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        setUser(data.user);
        if (data.user.artistProfile) {
          fetch(`/api/artists/${data.user.artistProfile}`)
            .then(r => r.json())
            .then(d => {
              if (d.artist?.availability) setGrid(d.artist.availability);
              if (d.artist?.blockedDates) setBlockedDates(d.artist.blockedDates);
            })
            .catch(() => {});
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const toggle = (day: string, slot: string) => {
    setGrid(prev => ({
      ...prev,
      [day]: { ...(prev[day] || {}), [slot]: !(prev[day]?.[slot]) },
    }));
  };

  const addBlockedDate = () => {
    if (newBlockedDate && !blockedDates.includes(newBlockedDate)) {
      setBlockedDates([...blockedDates, newBlockedDate]);
      setNewBlockedDate('');
    }
  };

  const removeBlockedDate = (date: string) => {
    setBlockedDates(blockedDates.filter(d => d !== date));
  };

  const handleSave = async () => {
    if (!user?.artistProfile) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/artists/${user.artistProfile}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: grid, blockedDates }),
      });
      if (!res.ok) throw new Error();
      setMessage('Disponibilités sauvegardées!');
    } catch {
      setMessage('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center text-[#8E8E9A]">Chargement...</div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-[#F0F0F0]">Disponibilités</h1>

        {message && (
          <div className={`rounded-lg p-3 text-sm ${message.includes('Erreur') ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' : 'bg-[#00D2FF]/10 text-[#00D2FF]'}`}>
            {message}
          </div>
        )}

        <Card>
          <h2 className="text-xl font-semibold text-[#00D2FF] mb-6">Grille hebdomadaire</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-[#8E8E9A] p-2"></th>
                  {DAYS.map(day => (
                    <th key={day} className="text-center text-[#F0F0F0] p-2 text-sm font-medium">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOTS.map(slot => (
                  <tr key={slot}>
                    <td className="text-[#8E8E9A] p-2 text-sm">{slot}</td>
                    {DAYS.map(day => (
                      <td key={day} className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => toggle(day, slot)}
                          className={`w-full h-12 rounded-lg transition-all ${
                            grid[day]?.[slot]
                              ? 'bg-[#6C5CE7] shadow-lg shadow-[#6C5CE7]/30'
                              : 'bg-[#0F0F1A] border border-[#1A1A2E] hover:border-[#6C5CE7]/50'
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4 text-sm text-[#8E8E9A]">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#6C5CE7] inline-block"></span> Disponible
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#0F0F1A] border border-[#1A1A2E] inline-block"></span> Indisponible
            </span>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[#00D2FF] mb-4">Dates bloquées</h2>
          <div className="flex gap-3 mb-4">
            <input
              type="date"
              value={newBlockedDate}
              onChange={e => setNewBlockedDate(e.target.value)}
              className="rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-[#F0F0F0] px-3 py-2 focus:border-[#6C5CE7] focus:outline-none"
            />
            <Button variant="secondary" size="sm" onClick={addBlockedDate}>Ajouter</Button>
          </div>
          {blockedDates.length === 0 ? (
            <p className="text-[#8E8E9A] text-sm">Aucune date bloquée.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {blockedDates.map(date => (
                <span key={date} className="flex items-center gap-2 bg-[#FF6B6B]/10 text-[#FF6B6B] px-3 py-1.5 rounded-full text-sm">
                  {new Date(date).toLocaleDateString('fr-CA')}
                  <button onClick={() => removeBlockedDate(date)} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
          )}
        </Card>

        <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </DashboardLayout>
  );
}
