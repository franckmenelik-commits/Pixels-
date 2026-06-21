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
    <div className="bg-white border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
      <div className="p-8 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text)]">Inscription</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Rejoignez la communaute Pixels</p>
        </div>
        {error && (
          <div className="bg-[var(--error)]/5 border border-[var(--error)]/20 text-[var(--error)] rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Nom complet" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
          <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            options={[
              { value: 'artist', label: 'Artiste' },
              { value: 'organizer', label: 'Organisateur' },
            ]}
          />

          {form.role === 'artist' && (
            <>
              <Input label="Universite" value={form.university} onChange={(e) => update('university', e.target.value)} />
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
                  { value: '', label: 'Selectionner...' },
                  { value: 'company', label: 'Entreprise' },
                  { value: 'association', label: 'Association' },
                  { value: 'individual', label: 'Particulier' },
                  { value: 'school', label: 'Ecole / Universite' },
                ]}
              />
            </>
          )}

          <Button variant="primary" size="lg" type="submit" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </Button>
        </form>
        <p className="text-center text-[var(--text-muted)] text-sm">
          Deja un compte?{' '}
          <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="pixels-logo text-3xl">pixels&trade;</span>
        </div>
        <Suspense fallback={<div className="text-[var(--text-muted)] text-center">Chargement...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
