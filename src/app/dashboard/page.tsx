'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth-context';

interface Mission {
  _id?: string; id?: string;
  eventName?: string; date?: string; status?: string;
  event?: { name?: string };
}

interface Event {
  _id?: string; id?: string;
  name?: string; date?: string; status?: string;
}

function StatIcon({ d }: { d: string }) {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({ artists: 0, missions: 0, revenue: 0, pendingEvents: 0 });

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || !token) return;
    const headers = { Authorization: `Bearer ${token}` };
    if (user.role === 'artist') {
      fetch('/api/missions', { headers }).then(r => r.json()).then(d => setMissions(Array.isArray(d) ? d : d.missions || [])).catch(() => {});
    }
    if (user.role === 'organizer') {
      fetch('/api/events', { headers }).then(r => r.json()).then(d => setEvents(Array.isArray(d) ? d : d.events || [])).catch(() => {});
    }
    if (user.role === 'admin' || user.role === 'operator') {
      Promise.all([
        fetch('/api/artists', { headers }).then(r => r.json()).catch(() => []),
        fetch('/api/missions', { headers }).then(r => r.json()).catch(() => []),
        fetch('/api/finances', { headers }).then(r => r.json()).catch(() => ({ totalRevenue: 0 })),
        fetch('/api/events', { headers }).then(r => r.json()).catch(() => []),
      ]).then(([a, m, f, e]) => {
        const artists = Array.isArray(a) ? a : a.artists || [];
        const missionsList = Array.isArray(m) ? m : m.missions || [];
        const eventsList = Array.isArray(e) ? e : e.events || [];
        setStats({
          artists: artists.length,
          missions: missionsList.length,
          revenue: f.totalRevenue || 0,
          pendingEvents: eventsList.filter((ev: Event) => ev.status === 'nouveau').length,
        });
      });
    }
  }, [user, token]);

  if (authLoading || !user) return <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center text-[var(--text-muted)]">Chargement...</div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Bienvenue, {user.name}</h1>
          <p className="text-[var(--text-muted)] mt-1">
            {user.role === 'artist' && 'Votre espace artiste'}
            {user.role === 'organizer' && 'Votre espace organisateur'}
            {(user.role === 'admin' || user.role === 'operator') && 'Vue d\'ensemble'}
          </p>
        </div>

        {user.role === 'artist' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { value: missions.length, label: 'Missions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-[var(--primary)]' },
                { value: missions.filter(m => m.status === 'completed').length, label: 'Completees', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-[var(--success)]' },
                { value: '—', label: 'Note moyenne', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-[var(--primary)]' },
              ].map((s) => (
                <Card key={s.label}>
                  <div className="flex items-center gap-4">
                    <div className={`${s.color} bg-[var(--surface)] p-3 rounded-xl`}>
                      <StatIcon d={s.icon} />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-[var(--text-muted)] text-sm">{s.label}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Card>
              <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Missions a venir</h2>
              {missions.length === 0 ? (
                <p className="text-[var(--text-muted)]">Aucune mission pour le moment.</p>
              ) : (
                <div className="space-y-3">
                  {missions.slice(0, 5).map((m) => (
                    <Link href={`/missions/${m.id || m._id}`} key={m.id || m._id} className="block p-3 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)] transition">
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--text)]">{m.event?.name || m.eventName || 'Mission'}</span>
                        <Badge variant={m.status === 'completed' ? 'success' : 'primary'}>{m.status || 'en cours'}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {user.role === 'organizer' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <Link href="/events/new">
                <Button variant="primary">Soumettre un evenement</Button>
              </Link>
            </div>
            <Card>
              <h2 className="text-xl font-semibold text-[var(--text)] mb-4">Vos evenements</h2>
              {events.length === 0 ? (
                <p className="text-[var(--text-muted)]">Aucun evenement soumis.</p>
              ) : (
                <div className="space-y-3">
                  {events.map((e) => (
                    <div key={e.id || e._id} className="p-3 rounded-lg bg-[var(--surface)] flex justify-between items-center">
                      <span className="text-[var(--text)]">{e.name || 'Evenement'}</span>
                      <Badge variant="neutral">{e.status || 'nouveau'}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {(user.role === 'admin' || user.role === 'operator') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: stats.artists, label: 'Artistes actifs', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: 'text-[var(--primary)]' },
              { value: stats.missions, label: 'Missions actives', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: 'text-[var(--secondary)]' },
              { value: `$${stats.revenue}`, label: 'Revenus ce mois', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-[var(--success)]' },
              { value: stats.pendingEvents, label: 'Evenements en attente', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-[var(--warning)]' },
            ].map((s) => (
              <Card key={s.label}>
                <div className="flex items-center gap-4">
                  <div className={`${s.color} bg-[var(--surface)] p-3 rounded-xl`}>
                    <StatIcon d={s.icon} />
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[var(--text-muted)] text-sm">{s.label}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
