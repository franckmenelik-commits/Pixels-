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

  if (authLoading || !user) return <div className="min-h-screen bg-[#040E3A] flex items-center justify-center text-[#8E9BC0]">Chargement...</div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#F0F0F0]">Bienvenue, {user.name}</h1>
          <p className="text-[#8E9BC0] mt-1">
            {user.role === 'artist' && 'Votre espace artiste'}
            {user.role === 'organizer' && 'Votre espace organisateur'}
            {(user.role === 'admin' || user.role === 'operator') && 'Vue d\'ensemble'}
          </p>
        </div>

        {/* Artist Dashboard */}
        {user.role === 'artist' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF8C45]">{missions.length}</div>
                  <div className="text-[#8E9BC0] mt-1">Missions</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#061E66]">
                    {missions.filter(m => m.status === 'completed').length}
                  </div>
                  <div className="text-[#8E9BC0] mt-1">Compl&eacute;t&eacute;es</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF8C45]">&mdash;</div>
                  <div className="text-[#8E9BC0] mt-1">Note moyenne</div>
                </div>
              </Card>
            </div>
            <Card>
              <h2 className="text-xl font-semibold text-[#F0F0F0] mb-4">Missions &agrave; venir</h2>
              {missions.length === 0 ? (
                <p className="text-[#8E9BC0]">Aucune mission pour le moment.</p>
              ) : (
                <div className="space-y-3">
                  {missions.slice(0, 5).map((m) => (
                    <Link href={`/missions/${m.id || m._id}`} key={m.id || m._id} className="block p-3 rounded-lg bg-[#040E3A]/50 hover:bg-[#040E3A] transition">
                      <div className="flex justify-between items-center">
                        <span className="text-[#F0F0F0]">{m.event?.name || m.eventName || 'Mission'}</span>
                        <Badge variant={m.status === 'completed' ? 'success' : 'primary'}>{m.status || 'en cours'}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Organizer Dashboard */}
        {user.role === 'organizer' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <Link href="/events/new">
                <Button variant="primary">Soumettre un &eacute;v&eacute;nement</Button>
              </Link>
            </div>
            <Card>
              <h2 className="text-xl font-semibold text-[#F0F0F0] mb-4">Vos &eacute;v&eacute;nements</h2>
              {events.length === 0 ? (
                <p className="text-[#8E9BC0]">Aucun &eacute;v&eacute;nement soumis.</p>
              ) : (
                <div className="space-y-3">
                  {events.map((e) => (
                    <div key={e.id || e._id} className="p-3 rounded-lg bg-[#040E3A]/50 flex justify-between items-center">
                      <span className="text-[#F0F0F0]">{e.name || '&Eacute;v&eacute;nement'}</span>
                      <Badge variant="neutral">{e.status || 'nouveau'}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Admin/Operator Dashboard */}
        {(user.role === 'admin' || user.role === 'operator') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF8C45]">{stats.artists}</div>
                <div className="text-[#8E9BC0] mt-1">Artistes actifs</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#061E66]">{stats.missions}</div>
                <div className="text-[#8E9BC0] mt-1">Missions actives</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF8C45]">${stats.revenue}</div>
                <div className="text-[#8E9BC0] mt-1">Revenus ce mois</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F0F0F0]">{stats.pendingEvents}</div>
                <div className="text-[#8E9BC0] mt-1">&Eacute;v&eacute;nements en attente</div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
