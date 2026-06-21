'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'artist';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: defaultRole,
    university: '',
    program: '',
    orgName: '',
    orgType: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, role: defaultRole }));
  }, [defaultRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'inscription");
      }
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="gradient-primary p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Inscription</h1>
        <p className="text-white/70 text-sm mt-1">Rejoignez la communaut&eacute; Pixels</p>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        {error && (
          <div className="bg-[#FF8C45]/10 border border-[#FF8C45]/30 text-[#FF8C45] rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        <Input label="Nom complet" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
        <Select
          label="R&ocirc;le"
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
          options={[
            { value: 'artist', label: 'Artiste' },
            { value: 'organizer', label: 'Organisateur' },
          ]}
        />

        {form.role === 'artist' && (
          <>
            <Input label="Universit&eacute;" value={form.university} onChange={(e) => update('university', e.target.value)} />
            <Input label="Programme" value={form.program} onChange={(e) => update('program', e.target.value)} />
          </>
        )}

        {form.role === 'organizer' && (
          <>
            <Input label="Nom de l'organisation" value={form.orgName} onChange={(e) => update('orgName', e.target.value)} />
            <Select
              label="Type d'organisation"
              value={form.orgType}
              onChange={(e) => update('orgType', e.target.value)}
              options={[
                { value: '', label: 'S&eacute;lectionner...' },
                { value: 'company', label: 'Entreprise' },
                { value: 'association', label: 'Association' },
                { value: 'individual', label: 'Particulier' },
                { value: 'school', label: '&Eacute;cole / Universit&eacute;' },
              ]}
            />
          </>
        )}

        <Button variant="primary" size="lg" type="submit" disabled={loading}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </Button>
        <p className="text-center text-[#8E9BC0] text-sm">
          D&eacute;j&agrave; un compte?{' '}
          <Link href="/login" className="text-[#061E66] hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#040E3A] pixel-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="text-[#8E9BC0] text-center">Chargement...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
