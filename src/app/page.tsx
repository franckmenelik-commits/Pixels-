'use client';

import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--text)]">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
          <Link href="/" className="pixels-logo text-xl">pixels&trade;</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-muted)]">
            <a href="#mission" className="hover:text-[var(--text)] transition">Notre mission</a>
            <a href="#comment" className="hover:text-[var(--text)] transition">Comment ca marche</a>
            <a href="#temoignages" className="hover:text-[var(--text)] transition">Temoignages</a>
            <a href="#galerie" className="hover:text-[var(--text)] transition">Galerie</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition hidden sm:block">
              Connexion
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Rejoindre Pixels</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl">
            <span className="tag-label">Incubateur Culturel Musical &mdash; Montreal</span>
            <h1 className="editorial-heading text-5xl md:text-7xl mt-4 text-[var(--secondary)]">
              La musique<br />
              se vit mieux<br />
              <span className="text-[var(--primary)]">ensemble.</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-muted)] mt-6 max-w-xl leading-relaxed">
              Pixels connecte les artistes emergents aux organisateurs d&apos;evenements
              culturels. Un espace ou chaque talent trouve sa scene.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link href="/register?role=artist">
                <Button variant="primary" size="lg">Rejoindre en tant qu&apos;artiste</Button>
              </Link>
              <Link href="/register?role=organizer">
                <Button variant="secondary" size="lg">Soumettre un evenement</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-16 right-0 w-1/3 h-full opacity-10 pointer-events-none hidden lg:block">
          <div className="w-full h-full bg-gradient-to-bl from-[var(--primary)] to-transparent rounded-full blur-3xl" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section-cream py-20 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <span className="tag-label">Pixels en chiffres</span>
          <h2 className="editorial-heading text-3xl md:text-4xl mt-3 text-[var(--secondary)]">
            Une communaute qui grandit.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              { value: '80+', label: 'Artistes actifs', sub: 'Musiciens, chanteurs et DJs de la scene montrealaise' },
              { value: '10 000+', label: 'Personnes rejointes', sub: 'A travers nos evenements et jam sessions' },
              { value: '4', label: 'Jam Sessions', sub: 'Des soirees ouvertes pour jouer, experimenter, creer' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[var(--border)] rounded-xl p-6">
                <div className="text-4xl md:text-5xl font-bold text-[var(--primary)]">{s.value}</div>
                <div className="text-lg font-semibold text-[var(--text)] mt-2">{s.label}</div>
                <p className="text-sm text-[var(--text-muted)] mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section id="mission" className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="tag-label">Notre mission</span>
              <h2 className="editorial-heading text-3xl md:text-5xl mt-3 text-[var(--secondary)]">
                Un tremplin pour les artistes qui debutent &mdash;
                pas un algorithme.
              </h2>
              <p className="text-[var(--text-muted)] mt-6 leading-relaxed text-lg">
                Pixels est ne d&apos;un constat simple : les musiciens etudiants
                ont du talent, mais pas de scene. Les organisateurs cherchent
                des artistes, mais ne savent pas ou regarder. On a cree le pont.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[var(--surface)]">
              <Image
                src="/images/event-1.jpg"
                alt="Evenement Pixels"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Ce dont on ne parle pas ── */}
      <section className="section-cream py-20 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <span className="tag-label">Le constat</span>
          <h2 className="editorial-heading text-3xl md:text-4xl mt-3 text-[var(--secondary)] max-w-2xl">
            Ce dont on ne parle jamais dans les ecoles de musique.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {[
              { title: 'La solitude du musicien freelance', desc: 'Jouer seul dans sa chambre ne mene nulle part. Il faut un reseau, des connexions, une scene.' },
              { title: 'Le manque de visibilite', desc: 'Les talents sont la. Les organisateurs aussi. Mais personne ne se trouve.' },
              { title: 'La gestion qui deborde', desc: 'Contrats, paiements, logistique, repertoire... Tout est eparpille.' },
              { title: 'La pression financiere', desc: 'Etre etudiant et musicien, c\'est jongler entre passion et survie.' },
              { title: 'L\'acces au materiel', desc: 'Instruments, cables, sonorisation — pas tout le monde a les moyens.' },
              { title: 'Le passage a l\'action', desc: 'On reve de jouer, mais on ne sait pas par ou commencer.' },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-[var(--border)] rounded-xl p-6">
                <h3 className="font-semibold text-[var(--text)] mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <div className="text-5xl text-[var(--primary)] mb-6">&laquo;</div>
          <blockquote className="editorial-heading text-2xl md:text-3xl text-[var(--secondary)] leading-snug">
            Il faut creer une bulle bienveillante pour leur permettre de
            deposer leurs peurs, leurs questionnements mais aussi leur faire
            entrevoir la beaute de ce qui les attend.
          </blockquote>
          <p className="text-[var(--text-muted)] mt-6 text-sm uppercase tracking-wider">
            &mdash; L&apos;equipe Pixels
          </p>
        </div>
      </section>

      {/* ── Comment ca marche ── */}
      <section id="comment" className="section-cream py-24 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <span className="tag-label">Comment ca marche</span>
              <h2 className="editorial-heading text-3xl md:text-5xl mt-3 text-[var(--secondary)]">
                Une reponse construite par celles et ceux qui sont passes par la.
              </h2>
              <p className="text-[var(--text-muted)] mt-6 leading-relaxed">
                Pas d&apos;algorithme, pas de matching automatique.
                Des humains qui ecoutent, qui connectent, qui accompagnent.
              </p>
            </div>
            <div className="space-y-8">
              {[
                { n: '01', title: 'Des conversations, pas des cours.', desc: 'On parle musique, carriere, vie. Pas de programme rigide, juste des echanges qui font avancer.' },
                { n: '02', title: 'Du matching pensé, pas algorithmique.', desc: 'On te propose des missions qui collent a ton profil, ton style, tes disponibilites.' },
                { n: '03', title: 'Des rencontres, pivoter quand ca se branche.', desc: 'Les jam sessions sont la pour ca : jouer ensemble, decouvrir des affinites, monter des projets.' },
                { n: '04', title: 'Une communaute qui se renouvelle.', desc: 'Chaque session amene de nouveaux visages, de nouvelles energies, de nouvelles collaborations.' },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <span className="text-2xl font-bold text-[var(--primary)] flex-shrink-0 mt-1">{step.n}</span>
                  <div>
                    <h3 className="font-semibold text-[var(--text)] text-lg">{step.title}</h3>
                    <p className="text-[var(--text-muted)] text-sm mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Nos valeurs ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <span className="tag-label">Nos valeurs</span>
          <h2 className="editorial-heading text-3xl md:text-4xl mt-3 text-[var(--secondary)]">
            Pas une charte. Une boussole.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-12">
            {[
              { name: 'Inclusion', desc: 'Chaque voix compte, chaque style a sa place.' },
              { name: 'Bienveillance', desc: 'On grandit mieux dans un espace safe.' },
              { name: 'Transparence', desc: 'Les finances, les decisions — tout est ouvert.' },
              { name: 'Ecoute', desc: 'Avant de parler, on ecoute.' },
              { name: 'Authenticite', desc: 'Sois toi-meme. Le reste suivra.' },
            ].map((v) => (
              <div key={v.name} className="text-left">
                <h3 className="text-[var(--primary)] font-bold text-lg">{v.name}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <section id="galerie" className="section-cream py-20 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <span className="tag-label">Galerie</span>
          <h2 className="editorial-heading text-3xl md:text-4xl mt-3 text-[var(--secondary)]">
            Des moments qui comptent.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {[1, 2, 3, 4, 5, 6, 7, 1].map((n, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl bg-[var(--border)] ${i === 0 || i === 5 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}>
                <Image
                  src={`/images/event-${n}.jpg`}
                  alt={`Pixels evenement ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Parcours / Phases ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <span className="tag-label">Le parcours</span>
          <h2 className="editorial-heading text-3xl md:text-5xl mt-3 text-[var(--secondary)]">
            De la terminale a la scene, en six etapes.
          </h2>
          <p className="text-[var(--text-muted)] mt-4 text-lg">
            Un accompagnement progressif pour te lancer sans pression.
          </p>
          <div className="mt-14 space-y-12">
            {[
              { phase: 'Phase 0', title: 'Inscription', desc: 'Cree ton profil, presente tes instruments et tes styles. 3 minutes, pas plus.', tags: ['Profil', 'Instruments', 'Genres'] },
              { phase: 'Phase 1', title: 'Decouverte', desc: 'Participe a ta premiere jam session. Rencontre d\'autres musiciens, joue, ecoute.', tags: ['Jam Session', 'Reseau'] },
              { phase: 'Phase 2', title: 'Premiere mission', desc: 'On te propose un evenement qui colle a ton profil. Tu decides si tu y vas.', tags: ['Evenement', 'Scene'] },
              { phase: 'Phase 3', title: 'Studio Musical', desc: 'Accede aux partitions, aux grilles d\'accords, aux transpositions pour tes instruments.', tags: ['Partitions', 'Accords'] },
              { phase: 'Phase 4', title: 'Autonomie', desc: 'Tu geres tes dispos, tes missions, tes finances. Tout au meme endroit.', tags: ['Gestion', 'Finance'] },
              { phase: 'Phase 5', title: 'Communaute', desc: 'Tu deviens un pilier. Tu accueilles les nouveaux, tu proposes des jams, tu partages.', tags: ['Mentorat', 'Leadership'] },
            ].map((p) => (
              <div key={p.phase} className="border-l-2 border-[var(--primary)] pl-8 relative">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[var(--primary)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">{p.phase}</span>
                <h3 className="editorial-heading text-2xl text-[var(--secondary)] mt-1">{p.title}</h3>
                <p className="text-[var(--text-muted)] mt-2">{p.desc}</p>
                <div className="flex gap-2 mt-3">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-medium">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-dark py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <h2 className="editorial-heading text-3xl md:text-5xl text-white">
            Ca commence quand tu veux.
          </h2>
          <p className="text-white/70 mt-4 text-lg max-w-xl mx-auto">
            Tu es musicien a Montreal ? Tu veux organiser un evenement culturel ?
            Rejoins la communaute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <Link href="/register?role=artist">
              <Button variant="primary" size="lg">Commencer comme artiste</Button>
            </Link>
            <Link href="/register?role=organizer">
              <button className="px-7 py-3.5 text-lg rounded-xl font-semibold border border-white/30 text-white hover:bg-white/10 transition w-full">
                Devenir organisateur
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[var(--cream)] border-t border-[var(--border)] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <span className="pixels-logo text-xl">pixels&trade;</span>
              <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed">
                Pixels est un incubateur culturel musical qui relie les
                artistes emergents aux organisateurs d&apos;evenements a Montreal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text)] text-sm mb-3">Le site</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><a href="#mission" className="hover:text-[var(--text)] transition">Notre mission</a></li>
                <li><a href="#comment" className="hover:text-[var(--text)] transition">Comment ca marche</a></li>
                <li><a href="#galerie" className="hover:text-[var(--text)] transition">Galerie</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text)] text-sm mb-3">Participer</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><Link href="/register?role=artist" className="hover:text-[var(--text)] transition">Devenir artiste</Link></li>
                <li><Link href="/register?role=organizer" className="hover:text-[var(--text)] transition">Soumettre un evenement</Link></li>
                <li><Link href="/login" className="hover:text-[var(--text)] transition">Se connecter</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--text)] text-sm mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li>Montreal, QC</li>
                <li>pixels-montreal.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border)] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[var(--text-muted)]">&copy; 2026 Pixels &mdash; Incubateur Culturel Musical. Tous droits reserves.</p>
            <div className="flex gap-6 text-xs text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--text)] transition">Mentions legales</a>
              <a href="#" className="hover:text-[var(--text)] transition">Confidentialite</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
