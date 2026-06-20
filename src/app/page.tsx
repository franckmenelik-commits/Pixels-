'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#040E3A] text-[#F0F0F0] pixel-grid">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <span className="text-2xl font-bold bg-gradient-to-r from-[#FF8C45] to-[#061E66] bg-clip-text text-transparent">
          PIXELS
        </span>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="secondary" size="sm">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">S&apos;inscrire</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-32">
        <h1 className="text-7xl md:text-9xl font-black tracking-tight bg-gradient-to-r from-[#FF8C45] via-[#061E66] to-[#FF8C45] bg-clip-text text-transparent mb-6">
          PIXELS
        </h1>
        <p className="text-2xl md:text-3xl font-semibold text-[#061E66] mb-4">
          Incubateur Culturel Musical
        </p>
        <p className="text-lg text-[#8E9BC0] max-w-2xl mb-12">
          La plateforme qui connecte les artistes émergents avec les organisateurs d&apos;événements.
          Trouvez des musiciens talentueux ou décrochez votre prochaine mission musicale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register?role=artist">
            <Button variant="primary" size="lg">Rejoindre en tant qu&apos;artiste</Button>
          </Link>
          <Link href="/register?role=organizer">
            <Button variant="secondary" size="lg">Soumettre un événement</Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: '80+', label: 'Artistes' },
            { value: '10 000+', label: 'Personnes rejointes' },
            { value: '4', label: 'Jam Sessions' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#FF8C45] to-[#061E66] bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-[#8E9BC0] text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Pour les Artistes', desc: 'Créez votre profil, montrez vos compétences et recevez des missions adaptées à votre talent.' },
            { title: 'Pour les Organisateurs', desc: 'Soumettez vos événements et trouvez les musiciens parfaits pour vos soirées.' },
            { title: 'Gestion Complète', desc: 'Suivi des missions, paiements transparents et coordination simplifiée.' },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#061E66] mb-3">{f.title}</h3>
              <p className="text-[#8E9BC0]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0A1A4A] py-8 px-8 text-center text-[#8E9BC0]">
        <p>&copy; 2026 Pixels — Incubateur Culturel Musical</p>
      </footer>
    </div>
  );
}
