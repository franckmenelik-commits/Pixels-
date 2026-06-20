'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface User { _id: string; name: string; email: string; role: string; }
interface Event {
  _id: string;
  name?: string;
  date?: string;
  dateStart?: string;
  organizerName?: string;
  type?: string;
  status?: string;
}

const COLUMNS = [
  { key: 'nouveau', label: 'Nouveau', icon: '📥' },
  { key: 'evaluation', label: 'Évaluation', icon: '📋' },
  { key: 'devis_envoye', label: 'Devis envoyé', icon: '💰' },
  { key: 'accepte', label: 'Accepté', icon: '✅' },
  { key: 'formation_groupe', label: 'Formation groupe', icon: '🎸' },
  { key: 'realise', label: 'Réalisé', icon: '🎤' },
  { key: 'archive', label: 'Archivé', icon: '📁' },
];

const segmentVariant = (t?: string) => {
  switch (t) { case 'premium': return 'primary' as const; case 'standard': return 'success' as const; case 'access': return 'neutral' as const; default: return 'neutral' as const; }
};

export default function EventsPipelinePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setUser(data.user))
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/events').then(r => r.json()).then(d => setEvents(d.events || [])).catch(() => {});
  }, [user]);

  const moveEvent = async (eventId: string, newStatus: string) => {
    try {
      await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setEvents(prev => prev.map(e => e._id === eventId ? { ...e, status: newStatus } : e));
    } catch { /* ignore */ }
  };

  if (!user) return <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center text-[#8E8E9A]">Chargement...</div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#F0F0F0]">Pipeline Événements</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col, colIdx) => {
            const colEvents = events.filter(e => (e.status || 'nouveau') === col.key);
            return (
              <div key={col.key} className="min-w-[280px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span>{col.icon}</span>
                  <h3 className="text-sm font-semibold text-[#F0F0F0]">{col.label}</h3>
                  <span className="text-xs text-[#8E8E9A] bg-[#1A1A2E] px-2 py-0.5 rounded-full">{colEvents.length}</span>
                </div>
                <div className="space-y-3">
                  {colEvents.map(evt => {
                    const nextCol = COLUMNS[colIdx + 1];
                    const prevCol = COLUMNS[colIdx - 1];
                    return (
                      <Card key={evt._id}>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-[#F0F0F0]">{evt.name || 'Événement'}</h4>
                          {(evt.dateStart || evt.date) && (
                            <p className="text-xs text-[#8E8E9A]">{new Date(evt.dateStart || evt.date!).toLocaleDateString('fr-CA')}</p>
                          )}
                          {evt.organizerName && <p className="text-xs text-[#8E8E9A]">{evt.organizerName}</p>}
                          {evt.type && <Badge variant={segmentVariant(evt.type)}>{evt.type}</Badge>}
                          <div className="flex gap-2 pt-1">
                            {prevCol && (
                              <Button variant="secondary" size="sm" onClick={() => moveEvent(evt._id, prevCol.key)}>&larr;</Button>
                            )}
                            {nextCol && (
                              <Button variant="primary" size="sm" onClick={() => moveEvent(evt._id, nextCol.key)}>&rarr;</Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  {colEvents.length === 0 && (
                    <div className="text-center py-8 text-[#8E8E9A] text-xs border border-dashed border-[#1A1A2E] rounded-lg">Vide</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
