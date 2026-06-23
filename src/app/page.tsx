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
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-[var(--border)] py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/pixels-logo.png"
              alt="pixels™"
              width={120}
              height={34}
              className={`transition-all duration-300 ${scrolled ? '' : 'brightness-0 invert'}`}
              priority
            />
          </Link>
          <div className={`hidden md:flex items-center gap-8 text-[13px] font-medium transition-colors duration-300 ${scrolled ? 'text-[var(--text-muted)]' : 'text-white/70'}`}>
            <a href="#ecosysteme" className="hover:text-[var(--primary)] transition">L&rsquo;&eacute;cosyst&egrave;me</a>
            <a href="#artistes" className="hover:text-[var(--primary)] transition">Artistes</a>
            <a href="#valeurs" className="hover:text-[var(--primary)] transition">Valeurs</a>
            <a href="#rejoindre" className="hover:text-[var(--primary)] transition">Rejoindre</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={`text-[13px] font-medium transition hidden sm:block ${scrolled ? 'text-[var(--text-muted)] hover:text-[var(--dark)]' : 'text-white/70 hover:text-white'}`}>
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
          <Image src="/images/event-2.jpg" alt="Pixels — musique vivante" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-[#0B1D3D]/60" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-white/50 text-sm tracking-[0.2em] uppercase mb-8 font-medium">
            Incubateur culturel &bull; Montr&eacute;al
          </p>
          <h1 className="editorial-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05]">
            Composer l&rsquo;harmonie<br />des gens heureux<span className="text-[var(--primary)]">.</span>
          </h1>
          <p className="text-white/60 mt-8 max-w-xl mx-auto text-lg leading-relaxed">
            Pixels rassemble artistes, organisateurs et communaut&eacute;s pour transformer des rencontres ordinaires en moments qui restent. <strong className="text-white/80">Une mosa&iuml;que de couleurs humaines.</strong>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full text-[15px] font-medium hover:brightness-110 transition inline-flex items-center gap-2">
              Rejoindre la communaut&eacute;
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <a href="#ecosysteme" className="text-white/50 text-sm hover:text-white transition font-medium">
              D&eacute;couvrir l&rsquo;&eacute;cosyst&egrave;me &darr;
            </a>
          </div>
        </div>
      </section>

      {/* ── CITATION ── */}
      <section className="bg-[var(--cream)] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="editorial-heading text-2xl md:text-3xl lg:text-4xl text-[var(--dark)] leading-snug">
            &laquo;&nbsp;Cr&eacute;er des ponts humains &agrave; travers l&rsquo;art vivant.&nbsp;&raquo;
          </p>
          <p className="text-[var(--text-muted)] mt-6 text-sm">
            Pixels est une infrastructure culturelle vivante qui relie les talents, les id&eacute;es et les opportunit&eacute;s pour cr&eacute;er un impact durable.
          </p>
        </div>
      </section>

      {/* ── POURQUOI PIXELS ── */}
      <section className="grid md:grid-cols-2">
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
        </div>
        <div className="relative min-h-[450px]">
          <Image src="/images/event-6.jpg" alt="La communauté Pixels" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* ── L'ÉCOSYSTÈME PIXELS™ ── */}
      <section id="ecosysteme" className="bg-[var(--surface)] py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">L&rsquo;&eacute;cosyst&egrave;me Pixels&trade;</p>
            <h2 className="editorial-heading text-3xl md:text-5xl">
              Tout ce qu&rsquo;il faut pour cr&eacute;er ensemble<span className="text-[var(--primary)]">.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>, title: 'Événements live' },
              { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, title: 'Partitions & arrangements' },
              { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>, title: 'Merchandise & vêtements' },
              { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>, title: 'Création audiovisuelle' },
              { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>, title: 'Direction artistique' },
              { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>, title: 'Communauté' },
              { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" /></svg>, title: 'Tournées & collaborations' },
              { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>, title: 'Production & accompagnement' },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-[var(--primary)] flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 mb-4">
                  {item.icon}
                </div>
                <p className="text-sm font-medium text-[var(--dark)]">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LE PROBLÈME ── */}
      <section className="bg-[var(--dark)] text-white py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Le probl&egrave;me</p>
          <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl max-w-3xl">
            Le talent existe. Les occasions existent. La coordination manque<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {[
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>, title: 'Artistes', desc: 'Veulent jouer, mais ne savent pas toujours où trouver des occasions fiables. Le talent est là — les connexions manquent.' },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>, title: 'Organisateurs', desc: "Veulent des événements vivants, mais font face à des retards, annulations et manque de structure. L'imprévu règne." },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>, title: 'La communauté', desc: "L'art est de plus en plus consommé seul. Les espaces de création collective disparaissent. Le contact humain s'efface." },
            ].map((card) => (
              <div key={card.title} className="border border-white/10 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl border border-[var(--primary)] flex items-center justify-center mb-5 text-[var(--primary)]">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDÉO LIVE ── */}
      <section className="bg-[var(--dark)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-8 text-center">En live</p>
          <div className="grid md:grid-cols-2 gap-4">
            {['1JDwAiZ2RYhI5WIX9GNDnShnf7uDsfRhZ', '1_XRBIdac61rW5Ebum8rqhApPSvXP7mSh'].map((id) => (
              <div key={id} className="aspect-video rounded-xl overflow-hidden bg-[var(--dark-surface)]">
                <iframe src={`https://drive.google.com/file/d/${id}/preview`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen loading="lazy" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {['1QbNQLD-SNqURBr-9HLUOLjb2qhwuWU_-', '1ZeNz3tdaNAu2JVoPkA84CKZvkD3pHc9C', '1JOaWrMlRQjsMjnuPgH7O-4XyViEqPZRY'].map((id) => (
              <div key={id} className="aspect-video rounded-xl overflow-hidden bg-[var(--dark-surface)]">
                <iframe src={`https://drive.google.com/file/d/${id}/preview`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARCOURS PAR SEGMENT ── */}
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
              <Link href="/register?role=artist" className="inline-flex items-center gap-2 mt-8 bg-[var(--dark)] text-white px-6 py-3 rounded-full text-sm font-medium hover:brightness-150 transition">
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

      {/* ── NOS VALEURS ── */}
      <section id="valeurs" className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Nos valeurs</p>
            <h2 className="editorial-heading text-3xl md:text-5xl">
              Ce qui nous guide<span className="text-[var(--primary)]">.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>, title: 'Communauté', desc: 'On est plus forts ensemble.' },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, title: 'Rencontres', desc: 'Des ponts humains qui créent du sens.' },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>, title: 'Art vivant', desc: 'Remettre du vivant dans les moments collectifs.' },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>, title: 'Transmission', desc: 'Partager, inspirer, faire grandir.' },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>, title: 'Structure', desc: 'Structurer sans assécher. Faire les choses bien.' },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>, title: 'Élévation', desc: "Construire des échelles, ouvrir des horizons." },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>, title: 'Création', desc: 'Imaginer, composer, exprimer.' },
              { icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>, title: 'Écosystème', desc: 'Un réseau vivant qui se renforce.' },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full border-2 border-[var(--primary)] flex items-center justify-center text-[var(--primary)] mb-4">
                  {v.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1">{v.title}</h4>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section className="py-20 md:py-28 bg-[var(--surface)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Notre impact</p>
              <h2 className="editorial-heading text-3xl md:text-5xl">
                Des rencontres qui durent bien apr&egrave;s l&rsquo;&eacute;v&eacute;nement<span className="text-[var(--primary)]">.</span>
              </h2>
              <p className="text-[var(--text-muted)] mt-6 leading-relaxed">
                Montr&eacute;al est une ville de festivals, de diversit&eacute; et de cr&eacute;ation : l&rsquo;endroit id&eacute;al pour prouver qu&rsquo;une infrastructure culturelle peut &ecirc;tre &agrave; la fois professionnelle, humaine et profond&eacute;ment vivante.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-10">
                {[
                  { value: '80+', label: 'artistes mobilisés' },
                  { value: '10K+', label: 'personnes rejointes' },
                  { value: '5', label: 'universités' },
                  { value: '4', label: 'jam sessions ouvertes' },
                ].map((s) => (
                  <div key={s.label}>
                    <span className="editorial-heading text-4xl md:text-5xl text-[var(--dark)]">{s.value}</span>
                    <p className="text-[var(--text-muted)] text-sm mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-8">
                {['HEC Montréal', 'McGill', 'Polytechnique', 'UdeM', 'Concordia'].map((uni) => (
                  <span key={uni} className="px-3 py-1.5 rounded-full bg-white text-xs text-[var(--text-muted)] font-medium border border-[var(--border)]">
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

      {/* ── PHRASES SIGNATURES ── */}
      <section className="bg-[var(--cream)] py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              "L'harmonie des gens heureux.",
              "Créer des ponts humains à travers l'art vivant.",
              "Une mosaïque de couleurs humaines.",
              "Les personnes passent. L'image demeure.",
              "Construire des échelles.",
            ].map((phrase) => (
              <div key={phrase} className="text-center">
                <span className="text-[var(--primary)] editorial-heading text-2xl">&ldquo;</span>
                <p className="text-[var(--dark)] text-sm font-medium leading-relaxed mt-1">{phrase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MERCH / HOODIE ── */}
      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[500px]">
          <Image src="/images/hoodie.jpg" alt="Le hoodie Pixels — la famille" fill className="object-cover object-center" sizes="50vw" />
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
            Construire des &eacute;chelles<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed max-w-xl mx-auto text-lg">
            Pour que des artistes puissent monter, que des organisateurs cr&eacute;ent autrement, que des &eacute;tudiants se rencontrent, et que des talents isol&eacute;s forment une image ensemble.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="bg-[var(--primary)] text-white px-10 py-4 rounded-full text-[15px] font-medium hover:brightness-110 transition inline-flex items-center gap-2">
              Rejoindre Pixels
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/login" className="text-[var(--text-muted)] text-sm hover:text-[var(--dark)] transition font-medium">
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
            <p><a href="mailto:pixelsmtl@hotmail.com" className="hover:text-[var(--primary)] transition">pixelsmtl@hotmail.com</a></p>
            <p>Montr&eacute;al, Canada</p>
            <p><a href="https://pixels-montreal.com" className="hover:text-[var(--primary)] transition">pixels-montreal.com</a></p>
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
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-sm">
              <Image src="/images/pixels-logo.png" alt="pixels™" width={140} height={40} className="brightness-0 invert mb-4" />
              <p className="text-white/40 text-sm leading-relaxed">
                Montr&eacute;al, Canada<br />
                Musique &bull; Communaut&eacute; &bull; Cr&eacute;ation &bull; &Eacute;l&eacute;vation
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-[13px]">
              <div>
                <h4 className="font-semibold mb-4 text-white/80">Exp&eacute;riences</h4>
                <ul className="space-y-2 text-white/40">
                  <li>Festivals &amp; galas</li>
                  <li>&Eacute;v&eacute;nements universitaires</li>
                  <li>Mariages &amp; lancements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white/80">Artistes</h4>
                <ul className="space-y-2 text-white/40">
                  <li>Rejoindre le r&eacute;seau</li>
                  <li>Studio Musical</li>
                  <li>Music Mondays</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white/80">Contact</h4>
                <ul className="space-y-2 text-white/40">
                  <li><a href="mailto:pixelsmtl@hotmail.com" className="hover:text-white transition">pixelsmtl@hotmail.com</a></li>
                  <li><a href="https://pixels-montreal.com" className="hover:text-white transition">pixels-montreal.com</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">&copy; PIXELS&trade; 2025 &mdash; Tous droits r&eacute;serv&eacute;s</p>
            <div className="flex gap-5 items-center">
              <a href="https://www.instagram.com/pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a href="https://www.youtube.com/@pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/pixelsmtl/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
