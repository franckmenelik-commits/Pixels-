'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

function Icon({ d, className = "w-8 h-8" }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--text)]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <span className="pixels-logo text-2xl">pixels&trade;</span>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="secondary" size="sm">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">S&apos;inscrire</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-28 max-w-4xl mx-auto">
        <span className="pixels-logo text-7xl md:text-8xl mb-6">pixels&trade;</span>
        <p className="text-xl md:text-2xl font-medium text-[var(--secondary)] mb-4">
          Incubateur Culturel Musical
        </p>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl mb-12 leading-relaxed">
          La plateforme qui connecte les artistes emergents avec les organisateurs d&apos;evenements.
          Trouvez des musiciens talentueux ou decrochez votre prochaine mission musicale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register?role=artist">
            <Button variant="primary" size="lg">Rejoindre en tant qu&apos;artiste</Button>
          </Link>
          <Link href="/register?role=organizer">
            <Button variant="secondary" size="lg">Soumettre un evenement</Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-8 bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: '80+', label: 'Artistes', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { value: '10 000+', label: 'Personnes rejointes', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: '4', label: 'Jam Sessions', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-4 text-[var(--primary)]">
                <Icon d={stat.icon} className="w-10 h-10" />
              </div>
              <div className="text-4xl font-bold text-[var(--secondary)] mb-2">
                {stat.value}
              </div>
              <div className="text-[var(--text-muted)] text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--secondary)] mb-12">Comment ca marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Pour les Artistes', desc: 'Creez votre profil, montrez vos competences et recevez des missions adaptees a votre talent.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { title: 'Pour les Organisateurs', desc: 'Soumettez vos evenements et trouvez les musiciens parfaits pour vos soirees.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
              { title: 'Gestion Complete', desc: 'Suivi des missions, paiements transparents et coordination simplifiee.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
            ].map((f) => (
              <div key={f.title} className="border border-[var(--border)] rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-5 text-[var(--primary)]">
                  <Icon d={f.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--secondary)] mb-3">{f.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-8 text-center text-[var(--text-muted)]">
        <span className="pixels-logo text-lg mr-2">pixels&trade;</span>
        &copy; 2026 — Incubateur Culturel Musical
      </footer>
    </div>
  );
}
