'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
interface Mission {
  _id: string;
  eventName?: string;
  date?: string;
  status?: string;
  venue?: string;
  musiciansCount?: number;
}

const statusVariant = (s?: string) => {
  switch (s) {
    case 'completed': return 'success';
    case 'in_progress': return 'primary';
    case 'cancelled': return 'error';
    case 'pending': return 'warning';
    default: return 'neutral';
  }
};

export default function MissionsPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/missions', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => setMissions(d.missions || [])).catch(() => {});
  }, [user, token]);

  if (loading || !user) return <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center"><div className="text-[var(--text-muted)]">Chargement...</div></div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--text)]">Missions</h1>
        {missions.length === 0 ? (
          <Card><p className="text-[var(--text-muted)]">Aucune mission trouvée.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map(m => (
              <Link href={`/missions/${m._id}`} key={m._id}>
                <Card>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-[var(--text)]">{m.eventName || 'Mission'}</h3>
                      <Badge variant={statusVariant(m.status)}>{m.status || 'nouveau'}</Badge>
                    </div>
                    {m.date && <p className="text-sm text-[var(--text-muted)]">{new Date(m.date).toLocaleDateString('fr-CA')}</p>}
                    {m.venue && <p className="text-sm text-[var(--text-muted)]">{m.venue}</p>}
                    {m.musiciansCount !== undefined && (
                      <p className="text-sm text-[var(--primary)]">{m.musiciansCount} musicien(s)</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
