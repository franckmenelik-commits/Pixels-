'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
interface Slot { artistName?: string; instrument?: string; status?: string; }
interface Mission {
  _id: string;
  eventName?: string;
  date?: string;
  status?: string;
  venue?: string;
  description?: string;
  roster?: Slot[];
  financials?: { total?: number; musicianShare?: number; logistics?: number; reserve?: number; };
}

const statusVariant = (s?: string) => {
  switch (s) { case 'completed': return 'success' as const; case 'confirmed': return 'primary' as const; case 'cancelled': return 'error' as const; default: return 'neutral' as const; }
};

export default function MissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, token, loading } = useAuth();
  const [mission, setMission] = useState<Mission | null>(null);

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [loading, user, router]);

  useEffect(() => {
    if (!user || !params.id) return;
    fetch(`/api/missions/${params.id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => setMission(d.mission || d)).catch(() => {});
  }, [user, token, params.id]);

  const updateStatus = async (newStatus: string) => {
    if (!params.id) return;
    await fetch(`/api/missions/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    });
    setMission(prev => prev ? { ...prev, status: newStatus } : prev);
  };

  if (loading || !user) return <div className="min-h-screen bg-[#040E3A] flex items-center justify-center"><div className="text-[#8E9BC0]">Chargement...</div></div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 max-w-4xl">
        <button onClick={() => router.back()} className="text-[#8E9BC0] hover:text-[#F0F0F0] text-sm">&larr; Retour</button>

        {!mission ? (
          <p className="text-[#8E9BC0]">Chargement de la mission...</p>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#F0F0F0]">{mission.eventName || 'Mission'}</h1>
                {mission.date && <p className="text-[#8E9BC0] mt-1">{new Date(mission.date).toLocaleDateString('fr-CA')}</p>}
              </div>
              <Badge variant={statusVariant(mission.status)}>{mission.status || 'nouveau'}</Badge>
            </div>

            <Card>
              <h2 className="text-xl font-semibold text-[#061E66] mb-3">Informations</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {mission.venue && <div><span className="text-[#8E9BC0]">Lieu:</span> <span className="text-[#F0F0F0]">{mission.venue}</span></div>}
                {mission.description && <div className="col-span-2"><span className="text-[#8E9BC0]">Description:</span> <span className="text-[#F0F0F0]">{mission.description}</span></div>}
              </div>
            </Card>

            {/* Roster */}
            <Card>
              <h2 className="text-xl font-semibold text-[#061E66] mb-3">Formation</h2>
              {(!mission.roster || mission.roster.length === 0) ? (
                <p className="text-[#8E9BC0] text-sm">Aucun musicien assigné.</p>
              ) : (
                <div className="space-y-2">
                  {mission.roster.map((slot, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#040E3A]/50">
                      <div>
                        <span className="text-[#F0F0F0]">{slot.artistName || 'Non assigné'}</span>
                        {slot.instrument && <span className="text-[#8E9BC0] ml-2">— {slot.instrument}</span>}
                      </div>
                      <Badge variant={slot.status === 'confirmed' ? 'success' : 'warning'}>{slot.status || 'en attente'}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Financials */}
            {mission.financials && (
              <Card>
                <h2 className="text-xl font-semibold text-[#061E66] mb-3">Finances</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total', value: mission.financials.total, color: '#F0F0F0' },
                    { label: 'Part musiciens', value: mission.financials.musicianShare, color: '#FF8C45' },
                    { label: 'Logistique', value: mission.financials.logistics, color: '#061E66' },
                    { label: 'Réserve', value: mission.financials.reserve, color: '#FF8C45' },
                  ].map(f => (
                    <div key={f.label} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: f.color }}>${f.value || 0}</div>
                      <div className="text-[#8E9BC0] text-sm">{f.label}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Admin actions */}
            {(user.role === 'admin' || user.role === 'operator') && (
              <Card>
                <h2 className="text-xl font-semibold text-[#061E66] mb-3">Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm" onClick={() => updateStatus('in_progress')}>Démarrer</Button>
                  <Button variant="secondary" size="sm" onClick={() => updateStatus('completed')}>Compléter</Button>
                  <Button variant="danger" size="sm" onClick={() => updateStatus('cancelled')}>Annuler</Button>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
