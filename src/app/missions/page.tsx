'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface User { _id: string; name: string; email: string; role: string; }
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
  const [user, setUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setUser(data.user))
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/missions').then(r => r.json()).then(d => setMissions(d.missions || [])).catch(() => {});
  }, [user]);

  if (!user) return <div className="min-h-screen bg-[#040E3A] flex items-center justify-center text-[#8E9BC0]">Chargement...</div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#F0F0F0]">Missions</h1>
        {missions.length === 0 ? (
          <Card><p className="text-[#8E9BC0]">Aucune mission trouvée.</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map(m => (
              <Link href={`/missions/${m._id}`} key={m._id}>
                <Card>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-[#F0F0F0]">{m.eventName || 'Mission'}</h3>
                      <Badge variant={statusVariant(m.status)}>{m.status || 'nouveau'}</Badge>
                    </div>
                    {m.date && <p className="text-sm text-[#8E9BC0]">{new Date(m.date).toLocaleDateString('fr-CA')}</p>}
                    {m.venue && <p className="text-sm text-[#8E9BC0]">{m.venue}</p>}
                    {m.musiciansCount !== undefined && (
                      <p className="text-sm text-[#FF8C45]">{m.musiciansCount} musicien(s)</p>
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
