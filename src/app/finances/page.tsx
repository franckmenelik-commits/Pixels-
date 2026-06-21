'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
interface Transaction { _id: string; date?: string; description?: string; amount?: number; type?: string; }
interface FinanceData {
  totalRevenue: number;
  paidToMusicians: number;
  logistics: number;
  reserveFund: number;
  transactions: Transaction[];
}

export default function FinancesPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [data, setData] = useState<FinanceData>({
    totalRevenue: 0, paidToMusicians: 0, logistics: 0, reserveFund: 0, transactions: [],
  });

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/finances', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => setData({
      totalRevenue: d.totalRevenue || 0,
      paidToMusicians: d.paidToMusicians || 0,
      logistics: d.logistics || 0,
      reserveFund: d.reserveFund || 0,
      transactions: d.transactions || [],
    })).catch(() => {});
  }, [user, token]);

  if (loading || !user) return <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center"><div className="text-[var(--text-muted)]">Chargement...</div></div>;

  const cards = [
    { label: 'Revenus totaux', value: data.totalRevenue, color: 'var(--primary)' },
    { label: 'Payé aux musiciens', value: data.paidToMusicians, color: 'var(--secondary)' },
    { label: 'Logistique', value: data.logistics, color: 'var(--primary)' },
    { label: 'Fonds de réserve', value: data.reserveFund, color: 'var(--text)' },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-[var(--text)]">Finances</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(c => (
            <Card key={c.label}>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: c.color }}>${c.value.toLocaleString('fr-CA')}</div>
                <div className="text-[var(--text-muted)] mt-1 text-sm">{c.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-[var(--secondary)] mb-4">Transactions récentes</h2>
          {data.transactions.length === 0 ? (
            <p className="text-[var(--text-muted)]">Aucune transaction.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[var(--text-muted)] border-b border-[var(--border)]">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Description</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-right py-3 px-2">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map(t => (
                    <tr key={t._id} className="border-b border-[var(--border)] hover:bg-[var(--surface)]">
                      <td className="py-3 px-2 text-[var(--text-muted)]">{t.date ? new Date(t.date).toLocaleDateString('fr-CA') : '—'}</td>
                      <td className="py-3 px-2 text-[var(--text)]">{t.description || '—'}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${t.type === 'income' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                          {t.type === 'income' ? 'Revenu' : 'Dépense'}
                        </span>
                      </td>
                      <td className={`py-3 px-2 text-right font-medium ${t.type === 'income' ? 'text-[var(--primary)]' : 'text-[var(--primary)]'}`}>
                        {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount || 0).toLocaleString('fr-CA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
