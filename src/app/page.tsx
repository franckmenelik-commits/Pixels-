'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openStory, setOpenStory] = useState<string | null>(null);
  const [liveIndex, setLiveIndex] = useState(0);
  const liveVideos = ['/images/live-1.mp4', '/images/live-2.mp4', '/images/live-3.mp4', '/images/live-4.mp4', '/images/live-5.mp4', '/images/live-6.mp4'];
  const constellationRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text)]">
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-[var(--border)] py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10">
          <Link href="/" className="flex items-center">
            <Image src="/images/pixels-logo.png" alt="pixels™" width={100} height={28} className={`transition-all duration-300 ${scrolled ? '' : 'brightness-0 invert'}`} priority />
          </Link>
          <div className={`hidden md:flex items-center gap-8 text-[13px] font-medium transition-colors duration-300 ${scrolled ? 'text-[var(--text-muted)]' : 'text-white/70'}`}>
            <a href="#artistes" className="hover:text-[var(--primary)] transition">Artistes</a>
            <a href="#organisateurs" className="hover:text-[var(--primary)] transition">Organisateurs</a>
            <a href="#histoires" className="hover:text-[var(--primary)] transition">Histoire</a>
            <a href="#contact" className="hover:text-[var(--primary)] transition">Contact</a>
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

      {/* ═══════════════════════════════════════════════
          1. HERO — QUESTION D'ENTRÉE
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3D]/90 via-[#0B1D3D]/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 w-full">
          <p className="text-white/40 text-sm tracking-[0.2em] uppercase mb-6 font-medium">
            Infrastructure culturelle &eacute;tudiante &bull; Montr&eacute;al
          </p>
          <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] max-w-4xl">
            &Agrave; quand remonte la derni&egrave;re fois que la musique t&rsquo;a pr&eacute;sent&eacute; quelqu&rsquo;un<span className="text-[var(--primary)]">&nbsp;?</span>
          </h1>
          <p className="text-white/50 mt-6 max-w-xl text-lg leading-relaxed">
            Pixels cr&eacute;e les espaces o&ugrave; les artistes, les organisateurs et le public se rencontrent.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#portes" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full text-[15px] font-medium hover:brightness-110 transition inline-flex items-center gap-2">
              Entrer dans l&rsquo;histoire
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </a>
            <a href="#contact" className="text-white/60 border border-white/20 px-8 py-4 rounded-full text-[15px] font-medium hover:bg-white/10 transition">
              Inviter Pixels
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. LES TROIS PORTES
      ═══════════════════════════════════════════════ */}
      <section id="portes" className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <h2 className="editorial-heading text-3xl md:text-5xl text-center mb-16">
            Pourquoi es-tu ici<span className="text-[var(--primary)]">&nbsp;?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                img: '/images/event-5.jpg',
                title: 'Je fais de la musique',
                desc: "Tu ne cherches peut-être pas seulement une scène. Tu cherches peut-être des personnes avec qui grandir.",
                cta: 'Rejoindre les artistes',
                href: '#artistes',
              },
              {
                img: '/images/event-3.jpg',
                title: "J'organise un événement",
                desc: "Les invités oublieront peut-être le menu. Ils oublieront rarement le moment où la musique a commencé.",
                cta: 'Créer un moment',
                href: '#organisateurs',
              },
              {
                img: '/images/event-7.jpg',
                title: 'Je veux vivre quelque chose',
                desc: "Tu ne joues peut-être d'aucun instrument. Et pourtant, tu fais déjà partie de l'histoire.",
                cta: 'Découvrir les rendez-vous',
                href: '#vibrer',
              },
            ].map((card) => (
              <a key={card.title} href={card.href} className="group relative rounded-2xl overflow-hidden aspect-[3/4] flex flex-col justify-end p-8 cursor-pointer">
                <Image src={card.img} alt={card.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3D]/80 via-[#0B1D3D]/20 to-transparent" />
                <div className="relative z-10">
                  <h3 className="editorial-heading text-2xl text-white mb-3">{card.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-5">{card.desc}</p>
                  <span className="inline-flex items-center gap-2 text-[var(--primary)] text-sm font-medium group-hover:gap-3 transition-all">
                    {card.cta}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. MANIFESTE COURT
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl text-center leading-snug">
            Les concerts ne sont qu&rsquo;une excuse<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-8 text-lg leading-relaxed text-center">
            Ce qui nous int&eacute;resse vraiment, c&rsquo;est ce qui se passe avant et apr&egrave;s la musique&nbsp;: les rencontres, les r&eacute;p&eacute;titions, les conversations, les projets qui naissent, les personnes qui se d&eacute;couvrent.
          </p>
        </div>
      </section>

      {/* Manifeste — phrase isolée plein écran */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <Image src="/images/event-1.jpg" alt="Public Pixels" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-[#0B1D3D]/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="editorial-heading text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1]">
            &laquo;&nbsp;Je veux voir des humains vibrer ensemble.&nbsp;&raquo;
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. ARTISTES — CRÉER
      ═══════════════════════════════════════════════ */}
      <section id="artistes" className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Artistes</p>
              <h2 className="editorial-heading text-4xl md:text-6xl">
                Cr&eacute;er<span className="text-[var(--primary)]">.</span>
              </h2>
              <p className="text-[var(--text-muted)] mt-3 text-lg">
                Pour celles et ceux qui jouent, chantent, composent, improvisent ou veulent simplement recommencer.
              </p>
              <p className="text-[var(--text)] mt-6 text-lg leading-relaxed">
                Pixels est un terrain de jeu pour les artistes qui veulent rencontrer d&rsquo;autres artistes. Pas besoin d&rsquo;&ecirc;tre c&eacute;l&egrave;bre, sign&eacute; ou parfaitement l&eacute;gitime. Si tu joues, viens.
              </p>
              <div className="mt-8 bg-[var(--cream)] rounded-xl p-6">
                <p className="text-[var(--text-muted)] text-sm italic">&laquo;&nbsp;Et si je ne suis pas assez bon&nbsp;?&nbsp;&raquo;</p>
                <p className="text-[var(--dark)] text-sm font-medium mt-2">Parfait. Personne ne l&rsquo;&eacute;tait la premi&egrave;re fois.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register?role=artist" className="bg-[var(--dark)] text-white px-6 py-3 rounded-full text-sm font-medium hover:brightness-150 transition inline-flex items-center gap-2">
                  Rejoindre une jam
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link href="/register?role=artist" className="border-2 border-[var(--dark)] text-[var(--dark)] px-6 py-3 rounded-full text-sm font-medium hover:bg-[var(--dark)] hover:text-white transition">
                  Proposer un projet
                </Link>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover">
                <source src="/images/rejoindre-preview.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live carousel ── */}
      <section className="bg-[var(--dark)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-8 text-center">En live</p>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-[var(--dark-surface)]">
            {liveVideos.map((src, i) => (
              <video
                key={src}
                autoPlay
                muted
                loop
                playsInline
                preload={i <= 1 ? 'auto' : 'none'}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === liveIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <source src={src} type="video/mp4" />
              </video>
            ))}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {liveVideos.map((_, i) => (
                <button key={i} onClick={() => setLiveIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === liveIndex ? 'bg-white w-6' : 'bg-white/40'}`} />
              ))}
            </div>
            <button onClick={() => setLiveIndex((prev) => (prev - 1 + liveVideos.length) % liveVideos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition z-10">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setLiveIndex((prev) => (prev + 1) % liveVideos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition z-10">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. ORGANISATEURS — RASSEMBLER
      ═══════════════════════════════════════════════ */}
      <section id="organisateurs" className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden order-2 md:order-1">
              <Image src="/images/event-4.jpg" alt="Événement Pixels" fill className="object-cover" sizes="50vw" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Organisateurs</p>
              <h2 className="editorial-heading text-4xl md:text-6xl">
                Rassembler<span className="text-[var(--primary)]">.</span>
              </h2>
              <p className="text-[var(--text-muted)] mt-3 text-lg">
                Pour les galas, mariages, festivals, lev&eacute;es de fonds, lancements, cocktails et moments qui m&eacute;ritent mieux qu&rsquo;une playlist.
              </p>
              <p className="text-[var(--text)] mt-6 text-lg leading-relaxed">
                Nous ne r&eacute;servons pas seulement des musiciens. Nous cr&eacute;ons des moments. Une arriv&eacute;e au violon. Un piano qui transforme une salle. Une ambiance qui fait parler les invit&eacute;s longtemps apr&egrave;s la fin.
              </p>
              <p className="text-[var(--dark)] mt-6 font-medium text-lg border-l-2 border-[var(--primary)] pl-4">
                Les gens n&rsquo;oublient pas une salle qui s&rsquo;est mise &agrave; vibrer.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="bg-[var(--primary)] text-white px-6 py-3 rounded-full text-sm font-medium hover:brightness-110 transition inline-flex items-center gap-2">
                  Inviter Pixels
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Formats */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { title: 'Ambiance live', desc: 'Musique d\'accompagnement élégante pour cocktails, réceptions et soirées.', img: '/images/event-6.jpg' },
              { title: 'Moment signature', desc: 'Une prestation marquante intégrée dans votre événement. Première danse, ouverture, surprise.', img: '/images/event-2.jpg' },
              { title: 'Création sur mesure', desc: 'Un concept musical entièrement pensé pour votre vision. De la direction artistique au dernier accord.', img: '/images/event-3.jpg' },
            ].map((f) => (
              <div key={f.title} className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image src={f.img} alt={f.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3D]/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h4 className="text-white font-semibold text-lg">{f.title}</h4>
                  <p className="text-white/50 text-sm mt-2 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. PUBLIC — VIBRER
      ═══════════════════════════════════════════════ */}
      <section id="vibrer" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/images/community-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0B1D3D]/75" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Public</p>
          <h2 className="editorial-heading text-4xl md:text-6xl text-white">
            Vibrer<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-white/50 mt-3 text-lg">
            Pour celles et ceux qui veulent simplement &ecirc;tre l&agrave; quand quelque chose se passe.
          </p>
          <p className="text-white/70 mt-8 text-lg leading-relaxed max-w-xl mx-auto">
            Tu peux venir &eacute;couter, rencontrer, filmer, applaudir, parler, rester apr&egrave;s la derni&egrave;re note. Pixels n&rsquo;est pas seulement une sc&egrave;ne&nbsp;: c&rsquo;est une communaut&eacute;.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="bg-white text-[var(--dark)] px-6 py-3 rounded-full text-sm font-medium hover:bg-white/90 transition">
              Voir les &eacute;v&eacute;nements
            </Link>
            <Link href="/register" className="border border-white/30 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition">
              S&rsquo;abonner aux nouvelles
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. ÉCOSYSTÈME — CONSTELLATION
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[var(--dark)] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="editorial-heading text-3xl md:text-5xl text-white leading-snug">
              Pixels n&rsquo;est pas au centre<span className="text-[var(--primary)]">.</span><br />
              Les connexions le sont.
            </h2>
            <p className="text-white/50 mt-6 text-lg leading-relaxed">
              Un artiste rencontre un organisateur. Un &eacute;v&eacute;nement rassemble un public. Une personne du public devient b&eacute;n&eacute;vole, musicienne ou partenaire. Puis l&rsquo;histoire recommence.
            </p>
          </div>

          {/* Constellation visuelle */}
          <div ref={constellationRef} className="relative max-w-3xl mx-auto py-12">
            {/* Lignes de connexion */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 200" fill="none" preserveAspectRatio="xMidYMid meet">
              <line x1="100" y1="100" x2="300" y2="50" stroke="var(--primary)" strokeWidth="0.5" opacity="0.4" />
              <line x1="300" y1="50" x2="500" y2="100" stroke="var(--primary)" strokeWidth="0.5" opacity="0.4" />
              <line x1="500" y1="100" x2="300" y2="150" stroke="var(--primary)" strokeWidth="0.5" opacity="0.4" />
              <line x1="300" y1="150" x2="100" y2="100" stroke="var(--primary)" strokeWidth="0.5" opacity="0.4" />
              <line x1="100" y1="100" x2="500" y2="100" stroke="var(--primary)" strokeWidth="0.3" opacity="0.2" />
              <line x1="300" y1="50" x2="300" y2="150" stroke="var(--primary)" strokeWidth="0.3" opacity="0.2" />
              {/* Nodes */}
              <circle cx="100" cy="100" r="6" fill="var(--primary)" opacity="0.8" />
              <circle cx="300" cy="50" r="6" fill="var(--primary)" opacity="0.8" />
              <circle cx="500" cy="100" r="6" fill="var(--primary)" opacity="0.8" />
              <circle cx="300" cy="150" r="6" fill="var(--primary)" opacity="0.8" />
              {/* Glow */}
              <circle cx="100" cy="100" r="20" fill="var(--primary)" opacity="0.08" />
              <circle cx="300" cy="50" r="20" fill="var(--primary)" opacity="0.08" />
              <circle cx="500" cy="100" r="20" fill="var(--primary)" opacity="0.08" />
              <circle cx="300" cy="150" r="20" fill="var(--primary)" opacity="0.08" />
            </svg>
            <div className="relative grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="w-12 h-12 mx-auto rounded-full border border-[var(--primary)]/40 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
                </div>
                <p className="text-white text-xs font-medium">Artistes</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto rounded-full border border-[var(--primary)]/40 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                </div>
                <p className="text-white text-xs font-medium">Rencontres</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto rounded-full border border-[var(--primary)]/40 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <p className="text-white text-xs font-medium">&Eacute;v&eacute;nements</p>
              </div>
              <div>
                <div className="w-12 h-12 mx-auto rounded-full border border-[var(--primary)]/40 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                </div>
                <p className="text-white text-xs font-medium">Public</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. IMPACT
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Impact</p>
              <h2 className="editorial-heading text-3xl md:text-5xl">
                Ce qui reste apr&egrave;s la derni&egrave;re note<span className="text-[var(--primary)]">.</span>
              </h2>
              <div className="mt-12 space-y-10">
                {[
                  { value: '80+', label: 'artistes', sub: 'Des personnes qui ne se connaissaient pas et qui jouent maintenant ensemble.' },
                  { value: '10K+', label: 'personnes touchées', sub: "Des oreilles, oui. Mais surtout des conversations." },
                  { value: '5', label: 'universités', sub: 'HEC, McGill, UdeM, Concordia, Polytechnique — une seule scène élargie.' },
                  { value: '4+', label: 'jam sessions', sub: "Des soirées qui commencent par une chanson et finissent souvent par une amitié." },
                ].map((s) => (
                  <div key={s.label} className="flex gap-6 items-start">
                    <span className="editorial-heading text-4xl md:text-5xl text-[var(--primary)] min-w-[100px]">{s.value}</span>
                    <div>
                      <p className="font-semibold text-[var(--dark)]">{s.label}</p>
                      <p className="text-[var(--text-muted)] text-sm mt-1">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover">
                <source src="/images/impact-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. ORIGINE DU NOM
      ═══════════════════════════════════════════════ */}
      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[450px]">
          <Image src="/images/event-6.jpg" alt="Communauté Pixels" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="bg-[var(--cream)] p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Le nom</p>
          <h2 className="editorial-heading text-3xl md:text-4xl">
            Pourquoi Pixels<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 text-lg leading-relaxed">
            Nous portons tous une couleur diff&eacute;rente. S&eacute;par&eacute;ment, nous &eacute;clairons un morceau du monde. Ensemble, nous faisons appara&icirc;tre l&rsquo;image.
          </p>
          <p className="text-[var(--dark)] mt-4 text-lg leading-relaxed font-medium">
            Pixels est n&eacute; de cette id&eacute;e simple&nbsp;: personne ne fait l&rsquo;image seul.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NOS HISTOIRES — CLIQUABLES
      ═══════════════════════════════════════════════ */}
      <section id="histoires" className="py-20 md:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Nos histoires</p>
            <h2 className="editorial-heading text-3xl md:text-5xl">
              Ce qui fait qu&rsquo;on reste<span className="text-[var(--primary)]">.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'music-mondays', title: 'Music Mondays', desc: 'Un piano, une résidence étudiante, un lundi soir.', tag: 'Origine', full: 'Paloma a vu un piano à queue dans un salon étudiant et a dit : « J\'aimerais tellement qu\'on fasse ça chaque semaine. » On lui a répondu que c\'était possible. Elle l\'a fait. Les Music Mondays sont nés comme ça — sans structure, sans budget, juste l\'envie de jouer ensemble. Aujourd\'hui, des dizaines de musiciens se retrouvent chaque lundi soir. Personne ne demande la permission. Tout le monde est le bienvenu.' },
              { id: 'centre-sciences', title: 'Le Centre des sciences', desc: 'Notre premier événement d\'envergure.', tag: 'Événement', full: 'On nous a confié une soirée entière au Centre des sciences de Montréal. C\'était la première fois qu\'on jouait dans un lieu aussi grand, devant un public qu\'on ne connaissait pas. Ce soir-là, on a compris que ce qu\'on construisait dépassait notre cercle. Les gens sont venus pour la musique. Ils sont restés pour l\'énergie. Pixels n\'était plus une idée — c\'était un mouvement.' },
              { id: 'premier-mariage', title: 'Le premier mariage', desc: 'Un couple nous a fait confiance pour le plus beau jour de leur vie.', tag: 'Confiance', full: 'Un couple qu\'on ne connaissait pas nous a contactés. Ils voulaient de la musique live pour leur mariage. Pas un DJ, pas un groupe professionnel — ils voulaient Pixels. Cette confiance nous a marqués. On a compris qu\'on pouvait aller au-delà des jams et des événements étudiants. Que les gens croyaient en ce qu\'on faisait assez pour nous confier leurs moments les plus importants.' },
              { id: 'forces-avenir', title: 'Forces AVENIR', desc: 'La reconnaissance que l\'impact de Pixels dépasse la musique.', tag: 'Reconnaissance', full: 'Forces AVENIR récompense les initiatives étudiantes qui transforment leur communauté. Quand Pixels a été reconnu, ça a confirmé quelque chose qu\'on sentait depuis longtemps : ce qu\'on construit n\'est pas seulement un projet musical. C\'est un projet de société étudiante. Un espace où des gens d\'horizons différents apprennent à créer ensemble.' },
              { id: 'artistes-trouvent', title: 'Des artistes qui se trouvent', desc: 'Deux musiciens qui ne se connaissaient pas il y a six mois.', tag: 'Rencontre', full: 'L\'un étudiait à McGill, l\'autre à HEC. Ils jouaient du même instrument sans le savoir. Ils se sont croisés à un Music Monday, ont commencé à jammer, puis à répéter ensemble, puis à composer. Six mois plus tard, ils avaient un projet à eux. C\'est exactement pour ça que Pixels existe : créer les conditions pour que ces rencontres arrivent.' },
              { id: 'premier-festival', title: 'Le premier festival', desc: 'Quand la communauté crée son propre rendez-vous.', tag: 'Communauté', full: 'On ne l\'avait pas planifié. La communauté avait grandi au point qu\'un simple lundi soir ne suffisait plus. Il fallait un moment plus grand, un rendez-vous fondateur. Le premier festival Pixels est né de cette nécessité. Pas d\'un business plan — d\'une énergie collective qui avait besoin d\'un espace à sa mesure.' },
            ].map((story) => (
              <div
                key={story.id}
                className={`border rounded-2xl p-8 cursor-pointer transition-all duration-300 ${openStory === story.id ? 'border-[var(--primary)] bg-[var(--cream)]' : 'border-[var(--border)] hover:border-[var(--primary)]/30'}`}
                onClick={() => setOpenStory(openStory === story.id ? null : story.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[var(--primary)] text-xs font-semibold tracking-wider uppercase">{story.tag}</span>
                    <h3 className="editorial-heading text-xl mt-3 mb-3">{story.title}</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{story.desc}</p>
                  </div>
                  <svg className={`w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-1 transition-transform duration-300 ${openStory === story.id ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className={`overflow-hidden transition-all duration-500 ${openStory === story.id ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                  <div className="border-t border-[var(--primary)]/20 pt-6">
                    <p className="text-[var(--text)] text-sm leading-relaxed">{story.full}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          D'OÙ VIENT PIXELS — ORIGINE
      ═══════════════════════════════════════════════ */}
      <section className="bg-[var(--cream)] py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-6 text-center">L&rsquo;origine</p>
          <h2 className="editorial-heading text-2xl md:text-3xl lg:text-4xl text-[var(--dark)] leading-snug text-center">
            D&rsquo;o&ugrave; vient Pixels<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="mt-10 space-y-6 text-lg leading-relaxed max-w-2xl mx-auto">
            <p className="text-[var(--text-muted)]">
              Je suis arriv&eacute; &agrave; Montr&eacute;al avec une certitude&nbsp;: je voulais faire de la musique. Mais HEC et le conservatoire, c&rsquo;&eacute;tait l&rsquo;un ou l&rsquo;autre. Pas les deux.
            </p>
            <p className="text-[var(--text-muted)]">
              Puis j&rsquo;ai rencontr&eacute; M&eacute;line. M&ecirc;me background, m&ecirc;me envie, m&ecirc;me frustration. On s&rsquo;est regard&eacute;s et on s&rsquo;est dit&nbsp;: si personne ne cr&eacute;e cet espace, on le fait nous-m&ecirc;mes.
            </p>
            <p className="text-[var(--text-muted)]">
              Quelques mois plus t&ocirc;t, une amie avait fait son anniversaire chez moi. Il y avait un piano &agrave; queue. Parmi les invit&eacute;s, Paloma. Elle m&rsquo;a dit&nbsp;: &laquo;&nbsp;J&rsquo;aimerais tellement qu&rsquo;on fasse &ccedil;a chaque semaine.&nbsp;&raquo; Je lui ai r&eacute;pondu que c&rsquo;&eacute;tait possible.
            </p>
            <p className="text-[var(--text-muted)]">
              Elle l&rsquo;a fait. Les Music Mondays sont n&eacute;s.
            </p>
            <p className="text-[var(--text-muted)]">
              Nous, on montait un groupe. Paloma faisait vivre ses lundis. On se connaissait tous sans savoir qu&rsquo;on construisait la m&ecirc;me chose.
            </p>
            <p className="text-[var(--dark)] font-medium">
              Le jour o&ugrave; ces histoires se sont rejointes, Pixels existait d&eacute;j&agrave;.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10. RAPPORT À LA TECHNOLOGIE
      ═══════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[var(--dark)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Technologie</p>
            <h2 className="editorial-heading text-3xl md:text-4xl text-white">
              Coder les outils<span className="text-[var(--primary)]">.</span><br />Garder la chaleur.
            </h2>
            <p className="text-white/50 mt-6 text-lg leading-relaxed">
              Nous croyons &agrave; la technologie. Nous construisons des outils, des plateformes, des syst&egrave;mes. Mais nous refusons que l&rsquo;efficacit&eacute; remplace ce qui fait battre un c&oelig;ur.
            </p>
            <p className="text-white mt-6 text-lg font-medium border-l-2 border-[var(--primary)] pl-4">
              Un algorithme peut recommander une chanson. Il ne peut pas te pr&eacute;senter ton prochain meilleur ami.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src="/images/hoodie.jpg" alt="Pixels merch" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </section>

      {/* ── Mosaïque photos ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {[2, 4, 5, 7, 1, 3, 6, 2].map((n, i) => (
          <div key={i} className="relative aspect-square overflow-hidden">
            <Image src={`/images/event-${n}.jpg`} alt={`Pixels moment ${i+1}`} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="25vw" />
          </div>
        ))}
      </section>

      {/* ── Témoignages ── */}
      <section className="bg-[var(--surface)] py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Je suis arrivé seul à Montréal.",
              "J'ai rencontré mon premier groupe ici.",
              "Les Music Mondays ont changé mes lundis.",
              "Je pensais venir jouer. Je suis resté pour les gens.",
            ].map((phrase) => (
              <div key={phrase} className="text-center">
                <span className="text-[var(--primary)] editorial-heading text-2xl">&ldquo;</span>
                <p className="text-[var(--dark)] text-sm font-medium leading-relaxed mt-1">{phrase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── La famille ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">La famille</p>
          <h2 className="editorial-heading text-3xl md:text-4xl">
            Personne ne poss&egrave;de Pixels<span className="text-[var(--primary)]">.</span> Tout le monde le construit.
          </h2>
          <p className="text-[var(--text-muted)] mt-6">
            De 6 musiciens en septembre 2025 &agrave; plus de 80 en mai 2026.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
            {['Franck Afane', 'Méline', 'Jean-Paul Romero', 'Paloma Hesry', 'Mai Linh Pham Dac', 'Louise Wang', 'Mira Charabati', 'Naomi Slama', 'Ivan Gaspart'].map(name => (
              <span key={name} className="px-3 py-1.5 bg-[var(--surface)] rounded-full text-[var(--text-muted)] border border-[var(--border)]">{name}</span>
            ))}
            <span className="px-3 py-1.5 bg-[var(--primary)] rounded-full text-white font-medium">+ 80 artistes</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          11. SECTION FINALE
      ═══════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0B1D3D]/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="editorial-heading text-3xl md:text-4xl lg:text-5xl text-white leading-snug">
            Chaque concert se termine. Chaque r&eacute;p&eacute;tition aussi. Ce qui reste, ce sont les personnes qui se sont rencontr&eacute;es<span className="text-[var(--primary)]">.</span>
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=artist" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full text-[15px] font-medium hover:brightness-110 transition">
              Je fais de la musique
            </Link>
            <a href="#contact" className="bg-white text-[var(--dark)] px-8 py-4 rounded-full text-[15px] font-medium hover:bg-white/90 transition">
              J&rsquo;organise un &eacute;v&eacute;nement
            </a>
            <Link href="/register" className="border border-white/30 text-white px-8 py-4 rounded-full text-[15px] font-medium hover:bg-white/10 transition">
              Je veux vivre quelque chose
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="grid md:grid-cols-2 border-t border-[var(--border)]">
        <div className="p-10 md:p-16 lg:p-20 bg-white">
          <p className="text-[var(--primary)] text-sm tracking-[0.15em] uppercase font-semibold mb-4">Contact</p>
          <h2 className="editorial-heading text-3xl md:text-4xl">
            Parlons-en<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="mt-6 space-y-3 text-[var(--text-muted)] leading-relaxed">
            <p>Vous cherchez des artistes&nbsp;?</p>
            <p>Vous voulez rejoindre la communaut&eacute;&nbsp;?</p>
            <p>Vous avez une id&eacute;e &agrave; construire&nbsp;?</p>
          </div>
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

      {/* ── Footer ── */}
      <footer className="bg-[var(--dark)] text-white py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-sm">
              <Image src="/images/pixels-logo.png" alt="pixels™" width={140} height={40} className="brightness-0 invert mb-4" />
              <p className="text-white/40 text-sm leading-relaxed">
                &Agrave; bient&ocirc;t quelque part entre deux accords.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-[13px]">
              <div>
                <h4 className="font-semibold mb-4 text-white/80">Artistes</h4>
                <ul className="space-y-2 text-white/40">
                  <li><a href="#artistes" className="hover:text-white transition">Rejoindre</a></li>
                  <li>Studio Musical</li>
                  <li>Music Mondays</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white/80">Organisateurs</h4>
                <ul className="space-y-2 text-white/40">
                  <li><a href="#organisateurs" className="hover:text-white transition">Inviter Pixels</a></li>
                  <li>Formats</li>
                  <li>&Eacute;v&eacute;nements</li>
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
