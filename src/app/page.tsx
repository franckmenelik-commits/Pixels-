'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openStory, setOpenStory] = useState<string | null>(null);
  const [liveIndex, setLiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const liveVideos = ['/images/live-1.mp4', '/images/live-2.mp4', '/images/live-3.mp4', '/images/live-4.mp4', '/images/live-5.mp4', '/images/live-6.mp4'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveIndex((prev) => (prev + 1) % liveVideos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [liveVideos.length]);

  return (
    <div className="min-h-screen bg-white text-[var(--text)]">

      {/* ═══ NAVBAR — CSO Concert Hall style: clean, wide, with calendar-like CTA ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-md' : 'bg-[var(--dark)]'}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-20">
          <Link href="/" className="flex items-center">
            <Image src="/images/pixels-logo.png" alt="pixels™" width={90} height={26} className={`transition-all duration-300 ${scrolled ? '' : 'brightness-0 invert'}`} priority />
          </Link>
          <div className={`hidden md:flex items-center gap-1 text-[13px] font-medium ${scrolled ? 'text-[var(--text-muted)]' : 'text-white/70'}`}>
            {[
              { label: 'Artistes', href: '#qui' },
              { label: 'Organisateurs', href: '#organisateurs' },
              { label: 'En live', href: '#live' },
              { label: 'Histoire', href: '#histoire' },
              { label: 'Contact', href: '#contact' },
            ].map(link => (
              <a key={link.label} href={link.href} className={`px-4 py-2 rounded-lg hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all ${scrolled ? '' : 'hover:bg-white/10 hover:text-white'}`}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className={`hidden sm:block text-[13px] font-medium transition ${scrolled ? 'text-[var(--text-muted)] hover:text-[var(--dark)]' : 'text-white/70 hover:text-white'}`}>
              Connexion
            </Link>
            <Link href="/register" className="bg-[var(--primary)] text-white px-5 py-2.5 text-[13px] font-semibold hover:brightness-110 transition flex items-center gap-2" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              Rejoindre
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              <svg className={`w-6 h-6 ${scrolled ? 'text-[var(--dark)]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[var(--dark)] border-t border-white/10 px-6 py-4 space-y-1">
            {['Artistes', 'Organisateurs', 'En live', 'Histoire', 'Contact'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(' ', '-')}`} onClick={() => setMenuOpen(false)} className="block py-3 text-white/70 hover:text-white text-sm font-medium">{label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO — CSO Concert Hall: massive image, bold overlaid title
          + DJ Diablo: full-width background video
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--dark)]/95 via-[var(--dark)]/60 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end max-w-[1400px] mx-auto px-6 md:px-10 pb-16 md:pb-24">
          <h1 className="editorial-heading text-[clamp(3rem,8vw,7rem)] text-white leading-[0.95] max-w-[800px]">
            PIXELS<br />
            <span className="text-[var(--primary)]">MONTRÉAL</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-6 max-w-md leading-relaxed">
            — infrastructure culturelle étudiante.<br />
            Créer des ponts humains à travers l&rsquo;art vivant.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <a href="#qui" className="bg-[var(--primary)] text-white px-8 py-4 text-sm font-semibold tracking-wide uppercase hover:brightness-110 transition">
              Explorer
            </a>
            <a href="#contact" className="border border-white/30 text-white px-8 py-4 text-sm font-semibold tracking-wide uppercase hover:bg-white/10 transition">
              Inviter Pixels
            </a>
          </div>
          <div className="hidden md:flex items-center gap-6 mt-10">
            <a href="https://www.instagram.com/pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a href="https://www.tiktok.com/@pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
            <a href="https://www.youtube.com/@pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHAT'S ON — CSO Concert Hall: horizontal scroll event cards
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-10">
            <h2 className="editorial-heading text-4xl md:text-6xl uppercase">
              Ce qui t&rsquo;attend
            </h2>
            <div className="hidden md:flex items-center gap-2 text-[var(--primary)]">
              <div className="w-px h-8 bg-[var(--primary)]" />
              <span className="text-xs font-semibold tracking-wider uppercase -rotate-90 origin-center">2025</span>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory scrollbar-hide">
            {[
              { img: '/images/event-1.jpg', title: 'Music Mondays', sub: 'Chaque lundi • Résidence étudiante' },
              { img: '/images/event-2.jpg', title: 'Jam Sessions', sub: 'Mensuel • Lieux variés' },
              { img: '/images/event-3.jpg', title: 'Événements privés', sub: 'Sur demande • Montréal' },
              { img: '/images/event-5.jpg', title: 'Festival Pixels', sub: 'À venir • 2026' },
            ].map((ev) => (
              <div key={ev.title} className="flex-shrink-0 w-[280px] md:w-[320px] snap-start group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={ev.img} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="320px" />
                </div>
                <h3 className="font-bold text-lg mt-4 group-hover:text-[var(--primary)] transition">{ev.title}</h3>
                <p className="text-[var(--text-muted)] text-sm mt-1">{ev.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHO — DJ Diablo style: full-width bg image, bold question
      ═══════════════════════════════════════════════════════════ */}
      <section id="qui" className="relative min-h-[60vh] flex items-center overflow-hidden">
        <Image src="/images/event-7.jpg" alt="Communauté" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[var(--dark)]/70" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-20">
          <h2 className="editorial-heading text-[clamp(2.5rem,6vw,5rem)] text-[var(--primary)] uppercase leading-[0.95]">
            QUI
          </h2>
          <h3 className="editorial-heading text-[clamp(2rem,4vw,3.5rem)] text-white mt-2 leading-tight max-w-2xl">
            es-tu dans cette histoire<span className="text-[var(--primary)]">&nbsp;?</span>
          </h3>
          <p className="text-white/60 mt-6 max-w-lg text-lg leading-relaxed">
            À quand remonte la dernière fois que la musique t&rsquo;a présenté quelqu&rsquo;un&nbsp;?
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THREE DOORS — Morningside style: icon cards + About Us split
      ═══════════════════════════════════════════════════════════ */}
      <section className="grid md:grid-cols-2">
        {/* Left: 3 icon cards */}
        <div className="bg-[var(--dark)] p-10 md:p-16 lg:p-20">
          <div className="space-y-10">
            {[
              { icon: '♪', title: 'Artistes', desc: 'Tu fais de la musique. Tu cherches des personnes avec qui grandir, pas seulement une scène.' },
              { icon: '★', title: 'Organisateurs', desc: 'Tu veux que ton événement résonne. Pas une playlist — un moment vivant.' },
              { icon: '♥', title: 'Public', desc: "Tu ne joues d'aucun instrument. Et pourtant, tu fais déjà partie de l'histoire." },
            ].map((door) => (
              <div key={door.title} className="flex gap-6 items-start group cursor-pointer">
                <div className="w-14 h-14 flex-shrink-0 border border-[var(--primary)]/40 flex items-center justify-center text-[var(--primary)] text-2xl group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                  {door.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{door.title}</h4>
                  <p className="text-white/50 text-sm mt-2 leading-relaxed">{door.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: About */}
        <div className="bg-white p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <p className="text-[var(--primary)] text-sm font-bold tracking-[0.2em] uppercase mb-4">À propos</p>
          <h2 className="editorial-heading text-3xl md:text-4xl">
            Les concerts ne sont qu&rsquo;une excuse<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed">
            Ce qui nous intéresse vraiment, c&rsquo;est ce qui se passe avant et après la musique&nbsp;: les rencontres, les répétitions, les conversations, les projets qui naissent, les personnes qui se découvrent.
          </p>
          <p className="text-[var(--text-muted)] mt-4 leading-relaxed">
            Pixels crée les espaces où les artistes, les organisateurs et le public se rencontrent.
          </p>
          <a href="#histoire" className="inline-block mt-8 border-2 border-[var(--dark)] text-[var(--dark)] px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[var(--dark)] hover:text-white transition">
            Notre histoire
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CRÉER — Orchid style: full-bleed color block + product hero
      ═══════════════════════════════════════════════════════════ */}
      <section id="artistes" className="bg-[var(--primary)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-video md:aspect-auto md:min-h-[500px]">
              <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover">
                <source src="/images/rejoindre-preview.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center">
              <p className="text-white/60 text-sm font-bold tracking-[0.2em] uppercase mb-4">Artistes</p>
              <h2 className="editorial-heading text-5xl md:text-7xl text-white">Créer<span className="text-[var(--dark)]">.</span></h2>
              <p className="text-white/80 mt-6 text-lg leading-relaxed">
                Pixels est un terrain de jeu pour les artistes qui veulent rencontrer d&rsquo;autres artistes. Pas besoin d&rsquo;être célèbre, signé ou parfaitement légitime.
              </p>
              <div className="mt-6 bg-white/10 backdrop-blur-sm p-5">
                <p className="text-white/60 text-sm italic">&laquo;&nbsp;Et si je ne suis pas assez bon&nbsp;?&nbsp;&raquo;</p>
                <p className="text-white text-sm font-bold mt-2">Parfait. Personne ne l&rsquo;était la première fois.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register?role=artist" className="bg-white text-[var(--primary)] px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white/90 transition">
                  Rejoindre une jam →
                </Link>
                <Link href="/register?role=artist" className="border-2 border-white text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-[var(--primary)] transition">
                  Proposer un projet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          EN LIVE — CSO "What's On" carousel + DJ Diablo full-width
      ═══════════════════════════════════════════════════════════ */}
      <section id="live" className="bg-[var(--dark)] py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-10">
            <h2 className="editorial-heading text-4xl md:text-6xl text-white uppercase">
              En live
            </h2>
            <div className="flex gap-3">
              <button onClick={() => setLiveIndex((prev) => (prev - 1 + liveVideos.length) % liveVideos.length)} className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => setLiveIndex((prev) => (prev + 1) % liveVideos.length)} className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden bg-black">
            {liveVideos.map((src, i) => (
              <video key={src} autoPlay muted loop playsInline preload={i <= 1 ? 'auto' : 'none'}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === liveIndex ? 'opacity-100' : 'opacity-0'}`}>
                <source src={src} type="video/mp4" />
              </video>
            ))}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                {liveVideos.map((_, i) => (
                  <button key={i} onClick={() => setLiveIndex(i)} className={`h-1 transition-all duration-300 ${i === liveIndex ? 'bg-[var(--primary)] w-12' : 'bg-white/30 w-6'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          RASSEMBLER — Morningside: split layout image left, text right
          + alternating background
      ═══════════════════════════════════════════════════════════ */}
      <section id="organisateurs" className="grid md:grid-cols-2">
        <div className="relative min-h-[400px] md:min-h-[600px]">
          <Image src="/images/event-4.jpg" alt="Événement Pixels" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="bg-[var(--cream)] p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <p className="text-[var(--primary)] text-sm font-bold tracking-[0.2em] uppercase mb-4">Organisateurs</p>
          <h2 className="editorial-heading text-4xl md:text-6xl">
            Rassembler<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 text-lg leading-relaxed">
            Pour les galas, mariages, festivals, levées de fonds, lancements, cocktails et moments qui méritent mieux qu&rsquo;une playlist.
          </p>
          <p className="text-[var(--dark)] mt-6 text-lg font-bold border-l-4 border-[var(--primary)] pl-4">
            Les gens n&rsquo;oublient pas une salle qui s&rsquo;est mise à vibrer.
          </p>
          <a href="#contact" className="inline-block mt-8 bg-[var(--primary)] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:brightness-110 transition">
            Inviter Pixels →
          </a>
        </div>
      </section>

      {/* Formats — Orchid style: alternating color blocks with product images */}
      <section className="bg-white">
        <div className="grid md:grid-cols-3">
          {[
            { title: 'Ambiance live', desc: "Musique d'accompagnement élégante pour cocktails, réceptions et soirées.", img: '/images/event-6.jpg', bg: 'bg-[var(--dark)]' },
            { title: 'Moment signature', desc: 'Une prestation marquante intégrée dans votre événement. Première danse, ouverture, surprise.', img: '/images/event-2.jpg', bg: 'bg-[var(--primary)]' },
            { title: 'Création sur mesure', desc: "Un concept musical entièrement pensé pour votre vision. De la direction artistique au dernier accord.", img: '/images/event-3.jpg', bg: 'bg-[var(--dark)]' },
          ].map((f) => (
            <div key={f.title} className={`${f.bg} group`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={f.img} alt={f.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
              </div>
              <div className="p-8">
                <h4 className="text-white font-bold text-xl">{f.title}</h4>
                <p className="text-white/50 text-sm mt-3 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          VIBRER — DJ Diablo: full-width background video section
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/images/community-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[var(--dark)]/75" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-20 text-center">
          <h2 className="editorial-heading text-[clamp(3rem,7vw,6rem)] text-[var(--primary)] uppercase">Vibrer</h2>
          <p className="text-white/80 mt-6 text-xl max-w-xl mx-auto leading-relaxed">
            Tu peux venir écouter, rencontrer, filmer, applaudir, parler, rester après la dernière note.
          </p>
          <p className="text-white mt-4 text-lg font-bold">
            Pixels n&rsquo;est pas seulement une scène&nbsp;: c&rsquo;est une communauté.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="bg-white text-[var(--dark)] px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/90 transition">
              Voir les événements
            </Link>
            <Link href="/register" className="border-2 border-white text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition">
              S&rsquo;abonner
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROGRAMME — CSO Concert Hall: date list with booking
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6 md:px-10">
          <h2 className="editorial-heading text-3xl md:text-5xl text-center uppercase mb-12">Programme</h2>
          <div className="space-y-0">
            {[
              { day: 'LUN', date: 'Chaque semaine', title: 'Music Mondays', venue: 'Résidence étudiante', time: '19h00' },
              { day: 'SAM', date: 'Mensuel', title: 'Jam Session', venue: 'Lieux variés', time: '20h00' },
              { day: 'VEN', date: 'Sur demande', title: 'Événement privé', venue: 'Montréal', time: 'Variable' },
              { day: '—', date: '2026', title: 'Festival Pixels', venue: 'À confirmer', time: 'À venir' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-4 md:gap-8 py-5 border-b border-[var(--border)] group hover:bg-[var(--surface)] transition px-4 -mx-4">
                <div className="flex-shrink-0 w-16 text-center">
                  <span className="text-[var(--primary)] text-2xl font-bold block">{ev.day}</span>
                  <span className="text-[var(--text-muted)] text-xs">{ev.time}</span>
                </div>
                <div className="hidden md:block w-px h-10 bg-[var(--border)]" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--dark)] group-hover:text-[var(--primary)] transition">{ev.title}</p>
                  <p className="text-[var(--text-muted)] text-sm">{ev.venue} • {ev.date}</p>
                </div>
                <a href="#contact" className="flex-shrink-0 border border-[var(--dark)] text-[var(--dark)] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[var(--dark)] hover:text-white transition">
                  Réserver
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="#contact" className="inline-block bg-[var(--dark)] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:brightness-150 transition">
              Toutes les dates
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          IMPACT — Morningside: split layout, text left + video right
      ═══════════════════════════════════════════════════════════ */}
      <section className="grid md:grid-cols-2">
        <div className="bg-[var(--dark)] p-10 md:p-16 lg:p-20 flex flex-col justify-center order-2 md:order-1">
          <p className="text-[var(--primary)] text-sm font-bold tracking-[0.2em] uppercase mb-4">Impact</p>
          <h2 className="editorial-heading text-3xl md:text-5xl text-white">
            Ce qui reste après la dernière note<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="mt-10 space-y-8">
            {[
              { value: '80+', label: 'artistes', sub: 'Des personnes qui ne se connaissaient pas et qui jouent maintenant ensemble.' },
              { value: '10K+', label: 'personnes touchées', sub: "Des oreilles, oui. Mais surtout des conversations." },
              { value: '5', label: 'universités', sub: 'HEC, McGill, UdeM, Concordia, Polytechnique.' },
              { value: '4+', label: 'jam sessions', sub: "Des soirées qui commencent par une chanson et finissent par une amitié." },
            ].map((s) => (
              <div key={s.label} className="flex gap-5 items-start">
                <span className="editorial-heading text-4xl text-[var(--primary)] min-w-[80px]">{s.value}</span>
                <div>
                  <p className="font-bold text-white">{s.label}</p>
                  <p className="text-white/40 text-sm mt-1">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[400px] md:min-h-0 order-1 md:order-2">
          <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover absolute inset-0">
            <source src="/images/impact-video.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHEN — DJ Diablo style: full-width bg with bold word
      ═══════════════════════════════════════════════════════════ */}
      <section id="histoire" className="relative min-h-[50vh] flex items-center overflow-hidden">
        <Image src="/images/event-6.jpg" alt="Pixels moment" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[var(--dark)]/70" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 py-20 text-center">
          <h2 className="editorial-heading text-[clamp(3rem,8vw,7rem)] text-[var(--primary)] uppercase">Depuis</h2>
          <p className="text-white text-2xl md:text-3xl font-bold mt-4">Septembre 2025</p>
          <p className="text-white/50 mt-4 text-lg max-w-xl mx-auto">
            De 6 musiciens à plus de 80 artistes en moins d&rsquo;un an. Une seule mission&nbsp;: créer des ponts humains à travers l&rsquo;art vivant.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ORIGINE — Morningside: collage images + text split
      ═══════════════════════════════════════════════════════════ */}
      <section className="grid md:grid-cols-2">
        {/* Left: image collage */}
        <div className="grid grid-cols-2 grid-rows-2">
          <div className="relative aspect-square overflow-hidden">
            <Image src="/images/event-1.jpg" alt="Pixels 1" fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="25vw" />
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image src="/images/event-5.jpg" alt="Pixels 2" fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="25vw" />
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image src="/images/event-3.jpg" alt="Pixels 3" fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="25vw" />
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image src="/images/event-7.jpg" alt="Pixels 4" fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="25vw" />
          </div>
        </div>
        {/* Right: origin text */}
        <div className="bg-[var(--cream)] p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <p className="text-[var(--primary)] text-sm font-bold tracking-[0.2em] uppercase mb-4">L&rsquo;origine</p>
          <h2 className="editorial-heading text-3xl md:text-4xl italic">
            D&rsquo;où vient Pixels<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="mt-8 space-y-5 text-[var(--text-muted)] leading-relaxed">
            <p>Je suis arrivé à Montréal avec une certitude&nbsp;: je voulais faire de la musique. Mais HEC et le conservatoire, c&rsquo;était l&rsquo;un ou l&rsquo;autre.</p>
            <p>Puis j&rsquo;ai rencontré Méline. Même background, même envie, même frustration. On s&rsquo;est dit&nbsp;: si personne ne crée cet espace, on le fait nous-mêmes.</p>
            <p>Quelques mois plus tôt, une amie avait fait son anniversaire chez moi. Il y avait un piano à queue. Parmi les invités, Paloma. Elle m&rsquo;a dit&nbsp;: &laquo;&nbsp;J&rsquo;aimerais tellement qu&rsquo;on fasse ça chaque semaine.&nbsp;&raquo;</p>
            <p>Elle l&rsquo;a fait. Les Music Mondays sont nés.</p>
            <p className="text-[var(--dark)] font-bold text-lg">Le jour où ces histoires se sont rejointes, Pixels existait déjà.</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          NOS HISTOIRES — Morningside "Our Lessons" + "What You'll Need"
          alternating split sections
      ═══════════════════════════════════════════════════════════ */}
      <section id="histoires" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <h2 className="editorial-heading text-3xl md:text-5xl text-center mb-4">Nos histoires</h2>
          <p className="text-[var(--text-muted)] text-center mb-12">Ce qui fait qu&rsquo;on reste.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'music-mondays', title: 'Music Mondays', desc: 'Un piano, une résidence étudiante, un lundi soir.', tag: 'Origine', full: 'Paloma a vu un piano à queue dans un salon étudiant et a dit : « J\'aimerais tellement qu\'on fasse ça chaque semaine. » On lui a répondu que c\'était possible. Elle l\'a fait. Les Music Mondays sont nés comme ça — sans structure, sans budget, juste l\'envie de jouer ensemble.' },
              { id: 'centre-sciences', title: 'Le Centre des sciences', desc: 'Notre premier événement d\'envergure.', tag: 'Événement', full: 'On nous a confié une soirée entière au Centre des sciences de Montréal. Ce soir-là, on a compris que ce qu\'on construisait dépassait notre cercle. Les gens sont venus pour la musique. Ils sont restés pour l\'énergie.' },
              { id: 'premier-mariage', title: 'Le premier mariage', desc: 'Un couple nous a fait confiance pour le plus beau jour de leur vie.', tag: 'Confiance', full: 'Un couple qu\'on ne connaissait pas nous a contactés. Ils voulaient de la musique live pour leur mariage. Pas un DJ, pas un groupe professionnel — ils voulaient Pixels.' },
              { id: 'forces-avenir', title: 'Forces AVENIR', desc: "La reconnaissance que l'impact dépasse la musique.", tag: 'Reconnaissance', full: 'Forces AVENIR récompense les initiatives étudiantes qui transforment leur communauté. Quand Pixels a été reconnu, ça a confirmé quelque chose qu\'on sentait depuis longtemps : ce qu\'on construit n\'est pas seulement un projet musical.' },
              { id: 'artistes-trouvent', title: 'Des artistes qui se trouvent', desc: 'Deux musiciens qui ne se connaissaient pas il y a six mois.', tag: 'Rencontre', full: 'L\'un étudiait à McGill, l\'autre à HEC. Ils jouaient du même instrument sans le savoir. Ils se sont croisés à un Music Monday, ont commencé à jammer, puis à répéter ensemble, puis à composer.' },
              { id: 'premier-festival', title: 'Le premier festival', desc: 'Quand la communauté crée son propre rendez-vous.', tag: 'Communauté', full: 'La communauté avait grandi au point qu\'un simple lundi soir ne suffisait plus. Le premier festival Pixels est né de cette nécessité. Pas d\'un business plan — d\'une énergie collective.' },
            ].map((story) => (
              <div key={story.id}
                className={`border-2 p-8 cursor-pointer transition-all duration-300 ${openStory === story.id ? 'border-[var(--primary)] bg-[var(--cream)]' : 'border-[var(--border)] hover:border-[var(--primary)]'}`}
                onClick={() => setOpenStory(openStory === story.id ? null : story.id)}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[var(--primary)] text-xs font-bold tracking-[0.15em] uppercase">{story.tag}</span>
                    <h3 className="font-bold text-xl mt-3 mb-3">{story.title}</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{story.desc}</p>
                  </div>
                  <svg className={`w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1 transition-transform duration-300 ${openStory === story.id ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className={`overflow-hidden transition-all duration-500 ${openStory === story.id ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                  <div className="border-t-2 border-[var(--primary)]/20 pt-6">
                    <p className="text-[var(--text)] text-sm leading-relaxed">{story.full}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TECHNOLOGIE — Orchid style: rich bg color block + image
      ═══════════════════════════════════════════════════════════ */}
      <section className="grid md:grid-cols-2">
        <div className="bg-[var(--dark)] p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <p className="text-[var(--primary)] text-sm font-bold tracking-[0.2em] uppercase mb-4">Technologie</p>
          <h2 className="editorial-heading text-3xl md:text-4xl text-white italic">
            Coder les outils<span className="text-[var(--primary)]">.</span><br />Garder la chaleur.
          </h2>
          <p className="text-white/50 mt-6 leading-relaxed">
            Nous croyons à la technologie. Nous construisons des outils, des plateformes, des systèmes. Mais nous refusons que l&rsquo;efficacité remplace ce qui fait battre un cœur.
          </p>
          <p className="text-white mt-6 font-bold border-l-4 border-[var(--primary)] pl-4">
            Un algorithme peut recommander une chanson. Il ne peut pas te présenter ton prochain meilleur ami.
          </p>
        </div>
        <div className="relative min-h-[400px]">
          <Image src="/images/hoodie.jpg" alt="Pixels merch" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MOSAÏQUE — Morningside-style instrument collage bar
      ═══════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-4 md:grid-cols-8">
        {[2, 4, 5, 7, 1, 3, 6, 2].map((n, i) => (
          <div key={i} className="relative aspect-square overflow-hidden">
            <Image src={`/images/event-${n}.jpg`} alt={`Pixels ${i+1}`} fill className="object-cover hover:scale-110 transition-transform duration-700" sizes="12.5vw" />
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TÉMOIGNAGES — DJ Diablo: full-width bg + overlaid quotes
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <Image src="/images/event-1.jpg" alt="Pixels live" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[var(--dark)]/80" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Je suis arrivé seul à Montréal.",
              "J'ai rencontré mon premier groupe ici.",
              "Les Music Mondays ont changé mes lundis.",
              "Je pensais venir jouer. Je suis resté pour les gens.",
            ].map((phrase, i) => (
              <div key={i} className="text-center">
                <span className="text-[var(--primary)] text-5xl editorial-heading">&ldquo;</span>
                <p className="text-white text-sm font-medium leading-relaxed mt-2">{phrase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          LA FAMILLE — Morningside "Yours Truly" / instructor section
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6 md:px-10 text-center">
          <p className="text-[var(--primary)] text-sm font-bold tracking-[0.2em] uppercase mb-4">La famille</p>
          <h2 className="editorial-heading text-3xl md:text-4xl">
            Personne ne possède Pixels<span className="text-[var(--primary)]">.</span><br />Tout le monde le construit.
          </h2>
          <p className="text-[var(--text-muted)] mt-6">
            De 6 musiciens en septembre 2025 à plus de 80 en mai 2026.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {['Franck Afane', 'Méline', 'Jean-Paul Romero', 'Paloma Hesry', 'Mai Linh Pham Dac', 'Louise Wang', 'Mira Charabati', 'Naomi Slama', 'Ivan Gaspart'].map(name => (
              <span key={name} className="px-4 py-2 border-2 border-[var(--border)] text-[var(--text-muted)] text-sm font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition cursor-default">{name}</span>
            ))}
            <span className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-bold">+ 80 artistes</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION FINALE — DJ Diablo "MUSIC for PROMOTIONS" full-bleed
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[var(--dark)]/85" />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
          <h2 className="editorial-heading text-[clamp(2rem,5vw,4rem)] text-white leading-snug">
            Chaque concert se termine.<br />
            Chaque répétition aussi.<br />
            <span className="text-[var(--primary)]">Ce qui reste, ce sont les personnes qui se sont rencontrées.</span>
          </h2>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=artist" className="bg-[var(--primary)] text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:brightness-110 transition w-full sm:w-auto text-center">
              Je fais de la musique
            </Link>
            <a href="#contact" className="bg-white text-[var(--dark)] px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/90 transition w-full sm:w-auto text-center">
              J&rsquo;organise un événement
            </a>
            <Link href="/register" className="border-2 border-white text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition w-full sm:w-auto text-center">
              Je veux vibrer
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CONTACT — Morningside footer-style: split with newsletter
      ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="grid md:grid-cols-2">
        <div className="bg-[var(--dark)] p-10 md:p-16 lg:p-20">
          <p className="text-[var(--primary)] text-sm font-bold tracking-[0.2em] uppercase mb-4">Contact</p>
          <h2 className="editorial-heading text-3xl md:text-4xl text-white">
            Parlons-en<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="mt-6 space-y-3 text-white/60 leading-relaxed">
            <p>Vous cherchez des artistes&nbsp;?</p>
            <p>Vous voulez rejoindre la communauté&nbsp;?</p>
            <p>Vous avez une idée à construire&nbsp;?</p>
          </div>
          <div className="mt-8 space-y-3 text-sm">
            <p><a href="mailto:pixelsmtl@hotmail.com" className="text-white/60 hover:text-[var(--primary)] transition">pixelsmtl@hotmail.com</a></p>
            <p className="text-white/40">Montréal, Canada</p>
            <p><a href="https://pixels-montreal.com" className="text-white/60 hover:text-[var(--primary)] transition">pixels-montreal.com</a></p>
          </div>
          <div className="mt-10 flex gap-5">
            <a href="https://www.instagram.com/pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--primary)] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a href="https://www.tiktok.com/@pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--primary)] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
            <a href="https://www.youtube.com/@pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--primary)] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--primary)] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg></a>
            <a href="https://www.linkedin.com/company/pixelsmtl/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--primary)] transition"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          </div>
        </div>
        <div className="bg-[var(--cream)] p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <h3 className="font-bold text-xl mb-6">Écris-nous</h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Nom" className="w-full border-b-2 border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition placeholder:text-[var(--text-light)]" />
            <input type="email" placeholder="Courriel" className="w-full border-b-2 border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition placeholder:text-[var(--text-light)]" />
            <select className="w-full border-b-2 border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition text-[var(--text-light)]">
              <option>Je suis...</option>
              <option>Un artiste / musicien</option>
              <option>Un organisateur d&apos;événement</option>
              <option>Un partenaire potentiel</option>
              <option>Juste curieux</option>
            </select>
            <textarea placeholder="Ton message" rows={3} className="w-full border-b-2 border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition resize-none placeholder:text-[var(--text-light)]" />
            <button type="submit" className="bg-[var(--primary)] text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:brightness-110 transition">
              Envoyer →
            </button>
          </form>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[var(--dark)] text-white py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <Image src="/images/pixels-logo.png" alt="pixels™" width={120} height={34} className="brightness-0 invert mb-3" />
              <p className="text-white/30 text-sm">À bientôt quelque part entre deux accords.</p>
            </div>
            <div className="grid grid-cols-3 gap-10 text-[13px]">
              <div>
                <h4 className="font-bold mb-3 text-white/60 uppercase tracking-wider text-xs">Artistes</h4>
                <ul className="space-y-2 text-white/30">
                  <li><a href="#artistes" className="hover:text-white transition">Rejoindre</a></li>
                  <li>Studio Musical</li>
                  <li>Music Mondays</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-white/60 uppercase tracking-wider text-xs">Organisateurs</h4>
                <ul className="space-y-2 text-white/30">
                  <li><a href="#organisateurs" className="hover:text-white transition">Inviter Pixels</a></li>
                  <li>Formats</li>
                  <li>Événements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-white/60 uppercase tracking-wider text-xs">Contact</h4>
                <ul className="space-y-2 text-white/30">
                  <li><a href="mailto:pixelsmtl@hotmail.com" className="hover:text-white transition">pixelsmtl@hotmail.com</a></li>
                  <li><a href="https://pixels-montreal.com" className="hover:text-white transition">pixels-montreal.com</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-white/20">&copy; PIXELS&trade; 2025 — Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
