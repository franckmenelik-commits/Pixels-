'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';

interface User { _id: string; name: string; email: string; role: string; }
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
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<FinanceData>({
    totalRevenue: 0, paidToMusicians: 0, logistics: 0, reserveFund: 0, transactions: [],
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setUser(d.user))
      .catch(() => router.push('/login'));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/finances').then(r => r.json()).then(d => setData({
      totalRevenue: d.totalRevenue || 0,
      paidToMusicians: d.paidToMusicians || 0,
      logistics: d.logistics || 0,
      reserveFund: d.reserveFund || 0,
      transactions: d.transactions || [],
    })).catch(() => {});
  }, [user]);

  if (!user) return <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center text-[#8E8E9A]">Chargement...</div>;

  const cards = [
    { label: 'Revenus totaux', value: data.totalRevenue, color: '#6C5CE7' },
    { label: 'Payé aux musiciens', value: data.paidToMusicians, color: '#00D2FF' },
    { label: 'Logistique', value: data.logistics, color: '#FF6B6B' },
    { label: 'Fonds de réserve', value: data.reserveFund, color: '#F0F0F0' },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-[#F0F0F0]">Finances</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(c => (
            <Card key={c.label}>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: c.color }}>${c.value.toLocaleString('fr-CA')}</div>
                <div className="text-[#8E8E9A] mt-1 text-sm">{c.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-[#00D2FF] mb-4">Transactions récentes</h2>
          {data.transactions.length === 0 ? (
            <p className="text-[#8E8E9A]">Aucune transaction.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#8E8E9A] border-b border-[#1A1A2E]">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Description</th>
                    <th className="text-left py-3 px-2">Type</th>
                    <th className="text-right py-3 px-2">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map(t => (
                    <tr key={t._id} className="border-b border-[#1A1A2E]/50 hover:bg-[#1A1A2E]/30">
                      <td className="py-3 px-2 text-[#8E8E9A]">{t.date ? new Date(t.date).toLocaleDateString('fr-CA') : '—'}</td>
                      <td className="py-3 px-2 text-[#F0F0F0]">{t.description || '—'}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${t.type === 'income' ? 'bg-[#6C5CE7]/20 text-[#6C5CE7]' : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'}`}>
                          {t.type === 'income' ? 'Revenu' : 'Dépense'}
                        </span>
                      </td>
                      <td className={`py-3 px-2 text-right font-medium ${t.type === 'income' ? 'text-[#6C5CE7]' : 'text-[#FF6B6B]'}`}>
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
