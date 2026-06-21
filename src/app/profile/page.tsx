'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { useAuth } from '@/lib/auth-context';

const INSTRUMENTS_OPTIONS = ['Piano', 'Guitare', 'Basse', 'Batterie', 'Violon', 'Saxophone', 'Trompette', 'Flûte', 'Voix', 'Contrebasse', 'Ukulélé', 'Percussion', 'Clavier', 'Autre'];
const GENRES = ['Jazz', 'Pop', 'Rock', 'R&B', 'Soul', 'Classique', 'Afro', 'Latin', 'Funk', 'Blues', 'Hip-Hop', 'Électronique', 'Folk', 'Autre'];
const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Professionnel'];
const SKILLS = ['Arrangement', 'Composition', 'Direction musicale', 'Oreille absolue', 'Lecture de partitions', 'Improvisation'];

interface Instrument { name: string; level: string; }
interface Profile {
  stageName: string; university: string; program: string; bio: string;
  instruments: Instrument[]; genres: string[]; canSing: boolean; vocalRange: string;
  musicTraining: string; skills: string[];
  hasTransport: boolean; hasLicense: boolean; ownInstruments: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    stageName: '', university: '', program: '', bio: '',
    instruments: [], genres: [], canSing: false, vocalRange: '',
    musicTraining: '', skills: [],
    hasTransport: false, hasLicense: false, ownInstruments: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user || !token) return;
    if (user.role !== 'artist') { router.push('/dashboard'); return; }
    fetch(`/api/artists/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d) setProfile(prev => ({ ...prev, ...d })); })
      .catch(() => {});
  }, [user, token, router]);

  const handleSave = async () => {
    if (!user || !token) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/artists/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error();
      setMessage('Profil sauvegardé!');
    } catch {
      setMessage('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const addInstrument = () => setProfile({ ...profile, instruments: [...profile.instruments, { name: '', level: 'Débutant' }] });
  const removeInstrument = (i: number) => setProfile({ ...profile, instruments: profile.instruments.filter((_, idx) => idx !== i) });
  const updateInstrument = (i: number, field: keyof Instrument, value: string) => {
    const updated = [...profile.instruments];
    updated[i] = { ...updated[i], [field]: value };
    setProfile({ ...profile, instruments: updated });
  };

  const toggleGenre = (g: string) => {
    setProfile({
      ...profile,
      genres: profile.genres.includes(g) ? profile.genres.filter(x => x !== g) : [...profile.genres, g],
    });
  };

  const toggleSkill = (s: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.includes(s) ? profile.skills.filter(x => x !== s) : [...profile.skills, s],
    });
  };

  if (authLoading || !user) return <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center text-[var(--text-muted)]">Chargement...</div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-[var(--text)]">Mon Profil Artiste</h1>

        {message && (
          <div className={`rounded-lg p-3 text-sm ${message.includes('Erreur') ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--secondary)]/10 text-[var(--secondary)]'}`}>
            {message}
          </div>
        )}

        {/* Identité */}
        <Card>
          <h2 className="text-xl font-semibold text-[var(--secondary)] mb-4">Identit&eacute;</h2>
          <div className="space-y-4">
            <Input label="Nom de scène" value={profile.stageName} onChange={e => setProfile({ ...profile, stageName: e.target.value })} />
            <Input label="Université" value={profile.university} onChange={e => setProfile({ ...profile, university: e.target.value })} />
            <Input label="Programme" value={profile.program} onChange={e => setProfile({ ...profile, program: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1">Bio</label>
              <textarea
                className="w-full rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] p-3 focus:border-[var(--primary)] focus:outline-none"
                rows={4}
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Compétences Musicales */}
        <Card>
          <h2 className="text-xl font-semibold text-[var(--secondary)] mb-4">Comp&eacute;tences Musicales</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-[var(--text)]">Instruments</label>
                <Button variant="secondary" size="sm" onClick={addInstrument}>+ Ajouter</Button>
              </div>
              {profile.instruments.map((inst, i) => (
                <div key={i} className="flex gap-3 mb-2 items-end">
                  <div className="flex-1">
                    <Select
                      label=""
                      value={inst.name}
                      onChange={e => updateInstrument(i, 'name', e.target.value)}
                      options={[{ value: '', label: 'Instrument...' }, ...INSTRUMENTS_OPTIONS.map(o => ({ value: o, label: o }))]}
                    />
                  </div>
                  <div className="flex-1">
                    <Select
                      label=""
                      value={inst.level}
                      onChange={e => updateInstrument(i, 'level', e.target.value)}
                      options={LEVELS.map(l => ({ value: l, label: l }))}
                    />
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeInstrument(i)}>&times;</Button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">Genres musicaux</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${
                      profile.genres.includes(g)
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-[var(--text)]">
                <input type="checkbox" checked={profile.canSing} onChange={e => setProfile({ ...profile, canSing: e.target.checked })} className="accent-[var(--primary)]" />
                Peut chanter
              </label>
              {profile.canSing && (
                <Input label="Tessiture" value={profile.vocalRange} onChange={e => setProfile({ ...profile, vocalRange: e.target.value })} />
              )}
            </div>

            <Input label="Formation musicale" value={profile.musicTraining} onChange={e => setProfile({ ...profile, musicTraining: e.target.value })} />

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">Comp&eacute;tences</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${
                      profile.skills.includes(s)
                        ? 'bg-[var(--secondary)] text-white'
                        : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--secondary)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Logistique */}
        <Card>
          <h2 className="text-xl font-semibold text-[var(--secondary)] mb-4">Logistique</h2>
          <div className="space-y-3">
            {[
              { key: 'hasTransport' as const, label: 'A un moyen de transport' },
              { key: 'hasLicense' as const, label: 'Possède un permis de conduire' },
              { key: 'ownInstruments' as const, label: 'Possède ses propres instruments' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={profile[key]}
                  onChange={e => setProfile({ ...profile, [key]: e.target.checked })}
                  className="accent-[var(--primary)]"
                />
                {label}
              </label>
            ))}
          </div>
        </Card>

        <Button variant="primary" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Sauvegarder le profil'}
        </Button>
      </div>
    </DashboardLayout>
  );
}
