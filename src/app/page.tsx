'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[var(--text)]">
      {/* ── Navbar (transparent → solid on scroll) ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-[var(--border)] py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/pixels-logo.svg"
              alt="pixels™"
              width={120}
              height={34}
              className={`transition-all duration-300 ${scrolled ? '' : 'brightness-0 invert'}`}
              priority
            />
          </Link>
          <div className={`hidden md:flex items-center gap-8 text-[13px] transition-colors duration-300 ${scrolled ? 'text-[var(--text-muted)]' : 'text-white/70'}`}>
            <a href="#pourquoi" className={`hover:${scrolled ? 'text-[var(--dark)]' : 'text-white'} transition`}>Pourquoi</a>
            <a href="#artistes" className={`hover:${scrolled ? 'text-[var(--dark)]' : 'text-white'} transition`}>Artistes</a>
            <a href="#communaute" className={`hover:${scrolled ? 'text-[var(--dark)]' : 'text-white'} transition`}>Communaut&eacute;</a>
            <a href="#rejoindre" className={`hover:${scrolled ? 'text-[var(--dark)]' : 'text-white'} transition`}>Rejoindre</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={`text-[13px] transition hidden sm:block ${scrolled ? 'text-[var(--text-muted)] hover:text-[var(--dark)]' : 'text-white/70 hover:text-white'}`}>
              Connexion
            </Link>
            <Link href="/register" className="text-[13px] bg-[var(--primary)] text-white px-5 py-2 rounded-full hover:brightness-110 transition font-medium">
              Rejoindre
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/event-1.jpg"
            alt="Pixels — musique vivante"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-white/50 text-sm tracking-[0.2em] uppercase mb-8">
            Incubateur culturel &bull; Montr&eacute;al
          </p>
          <h1 className="editorial-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05]">
            Composer l&rsquo;harmonie<br />des gens heureux<span className="text-[var(--primary)]">.</span>
          </h1>
          <p className="text-white/60 mt-8 max-w-xl mx-auto text-lg leading-relaxed">
            La musique est partout. Mais les espaces o&ugrave; des humains cr&eacute;ent r&eacute;ellement ensemble deviennent plus rares. Pixels commence par l&agrave;.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full text-[15px] font-medium hover:brightness-110 transition inline-flex items-center gap-2">
              Rejoindre la communaut&eacute;
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <a href="#pourquoi" className="text-white/50 text-sm hover:text-white transition">
              D&eacute;couvrir notre histoire &darr;
            </a>
          </div>
        </div>
      </section>

      {/* ── CITATION FONDATRICE ── */}
      <section className="bg-[var(--cream)] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="editorial-heading text-2xl md:text-3xl lg:text-4xl text-[var(--dark)] leading-snug">
            &laquo;&nbsp;Les gens n&rsquo;ont pas toujours besoin qu&rsquo;on cr&eacute;e la musique pour eux. Ils ont parfois simplement besoin qu&rsquo;on cr&eacute;e les conditions pour qu&rsquo;elle apparaisse.&nbsp;&raquo;
          </p>
          <p className="text-[var(--text-muted)] mt-6 text-sm">
            &mdash; De cette r&eacute;alisation est n&eacute; Pixels.
          </p>
        </div>
      </section>

      {/* ── POURQUOI PIXELS ── */}
      <section id="pourquoi" className="grid md:grid-cols-2">
        <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl">
            Un pixel seul est presque invisible<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed text-lg">
            Le nom vient d&rsquo;une conviction : nous sommes tous des &ecirc;tres remarquablement lumineux, chacun avec une couleur, un ton, une histoire diff&eacute;rente.
          </p>
          <p className="text-[var(--text)] mt-4 leading-relaxed text-lg font-medium">
            Assembl&eacute;s, nous cr&eacute;ons une image plus grande que la somme de nos parties.
          </p>
          <p className="text-[var(--text-muted)] mt-6 text-sm leading-relaxed">
            Notre groupe est d&eacute;j&agrave; une mosa&iuml;que : Afrique, Vietnam, Hong Kong, Espagne, France, Qu&eacute;bec. Des profils vari&eacute;s, une m&ecirc;me passion pour l&rsquo;art vivant.
          </p>
        </div>
        <div className="relative min-h-[450px]">
          <Image src="/images/event-6.jpg" alt="La communauté Pixels" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* ── LE PROBLÈME ── */}
      <section className="bg-[var(--dark)] text-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="text-white/40 text-sm tracking-[0.15em] uppercase mb-4">Le probl&egrave;me</p>
          <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl max-w-3xl">
            Le talent existe. Les occasions existent. La coordination manque<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            <div className="border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Artistes</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Veulent jouer, mais ne savent pas toujours o&ugrave; trouver des occasions fiables. Le talent est l&agrave; &mdash; les connexions manquent.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Organisateurs</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Veulent des &eacute;v&eacute;nements vivants, mais font face &agrave; des retards, annulations et manque de structure. L&rsquo;impr&eacute;vu r&egrave;gne.
              </p>
            </div>
            <div className="border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">La communaut&eacute;</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                L&rsquo;art est de plus en plus consomm&eacute; seul. Les espaces de cr&eacute;ation collective disparaissent. Le contact humain s&rsquo;efface.
              </p>
            </div>
          </div>
          <p className="text-white/30 text-sm mt-12 italic max-w-xl">
            Entre les deux : la magie d&eacute;pend encore trop souvent de la chance. Pixels traite ce probl&egrave;me &agrave; la source.
          </p>
        </div>
      </section>

      {/* ── VIDÉO LIVE ── */}
      <section className="bg-black">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <p className="text-white/40 text-sm tracking-[0.15em] uppercase mb-8 text-center">En live</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-[var(--dark-surface)]">
              <iframe
                src="https://drive.google.com/file/d/1JDwAiZ2RYhI5WIX9GNDnShnf7uDsfRhZ/preview"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-[var(--dark-surface)]">
              <iframe
                src="https://drive.google.com/file/d/1_XRBIdac61rW5Ebum8rqhApPSvXP7mSh/preview"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-[var(--dark-surface)]">
              <iframe
                src="https://drive.google.com/file/d/1QbNQLD-SNqURBr-9HLUOLjb2qhwuWU_-/preview"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-[var(--dark-surface)]">
              <iframe
                src="https://drive.google.com/file/d/1ZeNz3tdaNAu2JVoPkA84CKZvkD3pHc9C/preview"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-[var(--dark-surface)]">
              <iframe
                src="https://drive.google.com/file/d/1JOaWrMlRQjsMjnuPgH7O-4XyViEqPZRY/preview"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CE QUI SE PASSE APRÈS — parcours par segment ── */}
      <section id="artistes" className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Comment &ccedil;a marche</p>
            <h2 className="editorial-heading text-3xl md:text-5xl">
              Et si tu nous rejoignais<span className="text-[var(--primary)]">?</span>
            </h2>
            <p className="text-[var(--text-muted)] mt-4 max-w-lg mx-auto">
              Que tu sois artiste, organisateur ou simplement curieux &mdash; voil&agrave; ce qui t&rsquo;attend.
            </p>
          </div>

          {/* Artiste */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src="/images/event-5.jpg" alt="Artiste Pixels sur scène" fill className="object-cover" sizes="50vw" />
            </div>
            <div>
              <span className="text-[var(--primary)] font-semibold text-sm tracking-wider uppercase">Tu es musicien&middot;ne</span>
              <h3 className="editorial-heading text-2xl md:text-3xl mt-3 mb-6">
                Premi&egrave;res sc&egrave;nes, r&eacute;seau, collaborations<span className="text-[var(--primary)]">.</span>
              </h3>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Tu créés ton profil', desc: 'Instruments, genres, disponibilités — on apprend à te connaître.' },
                  { step: '02', title: 'Tu accèdes au Studio Musical', desc: 'Partitions, accords, transposition — tout pour préparer tes sets.' },
                  { step: '03', title: 'Tu rejoins des missions', desc: 'On te propose des événements qui matchent ton profil et tes dispos.' },
                  { step: '04', title: 'Tu grandis avec la communauté', desc: 'Jam sessions, badges, mentorat — chaque mission te fait progresser.' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <span className="text-[var(--primary)] font-bold text-sm mt-1 min-w-[28px]">{s.step}</span>
                    <div>
                      <p className="font-semibold text-[15px]">{s.title}</p>
                      <p className="text-[var(--text-muted)] text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register?role=artist" className="inline-flex items-center gap-2 mt-8 bg-[var(--secondary)] text-white px-6 py-3 rounded-full text-sm font-medium hover:brightness-125 transition">
                Devenir artiste Pixels
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>

          {/* Organisateur */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
            <div className="order-2 md:order-1">
              <span className="text-[var(--primary)] font-semibold text-sm tracking-wider uppercase">Tu organises un &eacute;v&eacute;nement</span>
              <h3 className="editorial-heading text-2xl md:text-3xl mt-3 mb-6">
                Plus de musique, moins de stress<span className="text-[var(--primary)]">.</span>
              </h3>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Tu décris ton événement', desc: 'Date, lieu, ambiance souhaitée, budget — on part de ta vision.' },
                  { step: '02', title: 'On te propose un devis', desc: 'Artistes sélectionnés, setlist sur mesure, plan logistique inclus.' },
                  { step: '03', title: 'On gère tout en coulisses', desc: 'Confirmations, backups, matériel, arrivée 30min avant — zéro surprise.' },
                  { step: '04', title: 'Tu profites du moment', desc: 'Contrat signé, artistes briefés, ambiance assurée. Toi, tu savoures.' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 items-start">
                    <span className="text-[var(--primary)] font-bold text-sm mt-1 min-w-[28px]">{s.step}</span>
                    <div>
                      <p className="font-semibold text-[15px]">{s.title}</p>
                      <p className="text-[var(--text-muted)] text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register?role=organizer" className="inline-flex items-center gap-2 mt-8 bg-[var(--primary)] text-white px-6 py-3 rounded-full text-sm font-medium hover:brightness-110 transition">
                Soumettre un &eacute;v&eacute;nement
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden order-1 md:order-2">
              <Image src="/images/event-3.jpg" alt="Événement Pixels" fill className="object-cover" sizes="50vw" />
            </div>
          </div>

          {/* Communauté */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src="/images/event-7.jpg" alt="Jam Session Pixels" fill className="object-cover" sizes="50vw" />
            </div>
            <div>
              <span className="text-[var(--primary)] font-semibold text-sm tracking-wider uppercase">Tu veux simplement vibrer</span>
              <h3 className="editorial-heading text-2xl md:text-3xl mt-3 mb-6">
                Rejoins les Music Mondays<span className="text-[var(--primary)]">.</span>
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                Avant Pixels, il y avait simplement un piano &agrave; queue. Une amie, Paloma, m&rsquo;a dit qu&rsquo;elle aimerait faire davantage de musique avec d&rsquo;autres. Je lui ai r&eacute;pondu : &laquo;&nbsp;&Agrave; la r&eacute;sidence il y a un piano. Qu&rsquo;est-ce que tu attends ?&nbsp;&raquo;
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                Quelques jours plus tard na&icirc;ssait le premier rendez-vous musical. Plus d&rsquo;un an plus tard, ces rencontres existent encore, avec de nouveaux visages. L&rsquo;&eacute;nergie est rest&eacute;e.
              </p>
              <p className="text-[var(--text)] font-medium">
                Jam sessions ouvertes, cr&eacute;ation collective, z&eacute;ro jugement. Viens comme tu es.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 mt-8 border-2 border-[var(--dark)] text-[var(--dark)] px-6 py-3 rounded-full text-sm font-medium hover:bg-[var(--dark)] hover:text-white transition">
                Rejoindre la communaut&eacute;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTOS GRID ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {[2, 4, 5, 7, 1, 3, 6, 2].map((n, i) => (
          <div key={i} className="relative aspect-square overflow-hidden">
            <Image src={`/images/event-${n}.jpg`} alt={`Pixels moment ${i+1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="25vw" />
          </div>
        ))}
      </section>

      {/* ── IMPACT ── */}
      <section id="communaute" className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Notre impact</p>
              <h2 className="editorial-heading text-3xl md:text-5xl">
                Des rencontres qui durent bien apr&egrave;s l&rsquo;&eacute;v&eacute;nement<span className="text-[var(--primary)]">.</span>
              </h2>
              <p className="text-[var(--text-muted)] mt-6 leading-relaxed">
                Montr&eacute;al est une ville de festivals, de rencontres, de diversit&eacute; et de cr&eacute;ation : l&rsquo;endroit id&eacute;al pour prouver qu&rsquo;une infrastructure culturelle peut &ecirc;tre &agrave; la fois professionnelle, humaine et profond&eacute;ment vivante.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-10">
                {[
                  { value: '80+', label: 'artistes mobilisés' },
                  { value: '10K+', label: 'personnes rejointes' },
                  { value: '5', label: 'universités' },
                  { value: '4', label: 'jam sessions ouvertes' },
                ].map((s) => (
                  <div key={s.label}>
                    <span className="editorial-heading text-4xl md:text-5xl text-[var(--secondary)]">{s.value}</span>
                    <p className="text-[var(--text-muted)] text-sm mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-8">
                {['HEC Montréal', 'McGill', 'Polytechnique', 'UdeM', 'Concordia'].map((uni) => (
                  <span key={uni} className="px-3 py-1.5 rounded-full bg-[var(--surface)] text-xs text-[var(--text-muted)] font-medium">
                    {uni}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image src="/images/event-4.jpg" alt="Impact Pixels" fill className="object-cover" sizes="50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHIE (3 piliers) ── */}
      <section className="bg-[var(--cream)] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4 text-center">Ce qui nous guide</p>
          <h2 className="editorial-heading text-3xl md:text-4xl text-center mb-16">
            Trois apprentissages<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <span className="text-[var(--primary)] editorial-heading text-6xl">1</span>
              <h3 className="font-semibold text-xl mt-4 mb-3">L&rsquo;humain au centre</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Sans humains, l&rsquo;art vivant n&rsquo;a plus de raison d&rsquo;&ecirc;tre. Ce qui distingue l&rsquo;art de la machine, c&rsquo;est le contact humain.
              </p>
            </div>
            <div className="text-center">
              <span className="text-[var(--primary)] editorial-heading text-6xl">2</span>
              <h3 className="font-semibold text-xl mt-4 mb-3">La structure prot&egrave;ge</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                La magie doit rester sur sc&egrave;ne. Le chaos, lui, doit &ecirc;tre g&eacute;r&eacute; en coulisses. Elle prot&egrave;ge les artistes, les organisateurs et les partenaires.
              </p>
            </div>
            <div className="text-center">
              <span className="text-[var(--primary)] editorial-heading text-6xl">3</span>
              <h3 className="font-semibold text-xl mt-4 mb-3">La transmission compte</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Le v&eacute;ritable impact se mesure &agrave; ce qu&rsquo;on rend possible pour les autres &mdash; cr&eacute;er des terrains de jeu, pas seulement des &eacute;v&eacute;nements.
              </p>
            </div>
          </div>
          <p className="text-center text-[var(--text-light)] text-sm mt-14 italic max-w-xl mx-auto">
            &laquo;&nbsp;Les projets sinc&egrave;res ne commencent pas avec un business plan parfait. Ils commencent avec une envie suffisamment forte pour qu&rsquo;on accepte de ne pas tout comprendre tout de suite.&nbsp;&raquo;
          </p>
        </div>
      </section>

      {/* ── MERCH / HOODIE ── */}
      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[500px]">
          <Image src="/images/event-2.jpg" alt="La famille Pixels" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="bg-[var(--surface)] p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">La famille</p>
          <h2 className="editorial-heading text-3xl md:text-4xl">
            Les personnes passent.<br />L&rsquo;image demeure<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed">
            Pixels n&rsquo;est pas un groupe de musique. C&rsquo;est un lieu pr&eacute;serv&eacute; &mdash; un endroit o&ugrave; les gens cr&eacute;ent sans performance sociale, sans algorithme, sans masque.
          </p>
          <p className="text-[var(--text-muted)] mt-4 leading-relaxed">
            De 6 musiciens en septembre 2025 &agrave; plus de 80 en mai 2026. Une croissance organique port&eacute;e par la conviction que les gens continuent de venir le lundi soir.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            {['Franck Afane', 'Jean-Paul Romero', 'Paloma Hesry', 'Mai Linh Pham Dac', 'Louise Wang', 'Mira Charabati', 'Naomi Slama', 'Ivan Gaspart'].map(name => (
              <span key={name} className="px-3 py-1.5 bg-white rounded-full text-[var(--text-muted)] border border-[var(--border)]">{name}</span>
            ))}
            <span className="px-3 py-1.5 bg-[var(--primary)] rounded-full text-white font-medium">+ 80 artistes</span>
          </div>
        </div>
      </section>

      {/* ── REJOINDRE ── */}
      <section id="rejoindre" className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="editorial-heading text-3xl md:text-5xl lg:text-6xl">
            Je voudrais construire un monde o&ugrave; chacun se fait la courte &eacute;chelle<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed max-w-xl mx-auto text-lg">
            Construire des &eacute;chelles pour que des artistes puissent monter, que des organisateurs cr&eacute;ent autrement, que des &eacute;tudiants se rencontrent, et que des talents isol&eacute;s forment une image ensemble.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-[var(--primary)] text-white px-10 py-4 rounded-full text-[15px] font-medium hover:brightness-110 transition inline-flex items-center gap-2">
              Rejoindre Pixels
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/login" className="text-[var(--text-muted)] text-sm hover:text-[var(--dark)] transition">
              D&eacute;j&agrave; membre ? Connexion
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="grid md:grid-cols-2 border-t border-[var(--border)]">
        <div className="p-10 md:p-16 lg:p-20">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Contact</p>
          <h2 className="editorial-heading text-3xl md:text-4xl">
            Discutons de votre projet<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-4 leading-relaxed">
            Nous ne vendons pas seulement de la musique. Nous vendons de la fiabilit&eacute; et de la s&eacute;r&eacute;nit&eacute;.
          </p>
          <div className="mt-8 space-y-2 text-sm text-[var(--text-muted)]">
            <p>hello@pixels-montreal.com</p>
            <p>Montr&eacute;al, Canada</p>
          </div>
        </div>
        <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center bg-[var(--cream)]">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Nom" className="w-full border-b border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition placeholder:text-[var(--text-light)]" />
            <input type="email" placeholder="Courriel" className="w-full border-b border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition placeholder:text-[var(--text-light)]" />
            <select className="w-full border-b border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition text-[var(--text-light)]">
              <option>Je suis...</option>
              <option>Un artiste / musicien</option>
              <option>Un organisateur d&apos;&eacute;v&eacute;nement</option>
              <option>Un partenaire potentiel</option>
              <option>Juste curieux</option>
            </select>
            <textarea placeholder="Ton message" rows={3} className="w-full border-b border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition resize-none placeholder:text-[var(--text-light)]" />
            <button type="submit" className="bg-[var(--primary)] text-white px-8 py-3 rounded-full text-sm font-medium hover:brightness-110 transition mt-2">
              Envoyer
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--dark)] text-white py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <Image src="/images/pixels-logo.svg" alt="pixels™" width={160} height={46} className="brightness-0 invert mx-auto" />
            <p className="text-white/30 mt-6 max-w-md mx-auto leading-relaxed">
              Tant qu&rsquo;&agrave; traverser quelque chose de difficile, autant essayer d&rsquo;en faire quelque chose de beau.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Exp&eacute;riences</h4>
              <ul className="space-y-2 text-white/40">
                <li>Festivals &amp; galas</li>
                <li>&Eacute;v&eacute;nements universitaires</li>
                <li>Mariages &amp; lancements</li>
                <li>Cr&eacute;ations m&eacute;diatiques</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Artistes</h4>
              <ul className="space-y-2 text-white/40">
                <li>Rejoindre le r&eacute;seau</li>
                <li>Studio Musical</li>
                <li>Music Mondays</li>
                <li>Jam sessions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Communaut&eacute;</h4>
              <ul className="space-y-2 text-white/40">
                <li>HEC &bull; McGill &bull; Poly</li>
                <li>UdeM &bull; Concordia</li>
                <li>Forces Avenir 2026</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Contact</h4>
              <ul className="space-y-2 text-white/40">
                <li>hello@pixels-montreal.com</li>
                <li>Montr&eacute;al, Canada</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">&copy; 2026 Pixels &mdash; S&eacute;lectionn&eacute;s pour la 28e &eacute;dition de Forces Avenir</p>
            <div className="flex gap-6 text-xs text-white/30">
              <span>Instagram</span>
              <span>LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
