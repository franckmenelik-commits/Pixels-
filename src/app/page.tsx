'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Pixel {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  pulse: number;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [liveIndex, setLiveIndex] = useState(0);
  const [openStory, setOpenStory] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animFrameRef = useRef<number>(0);
  const liveVideos = ['/images/live-1.mp4', '/images/live-2.mp4', '/images/live-3.mp4', '/images/live-4.mp4', '/images/live-5.mp4', '/images/live-6.mp4'];

  const PIXEL_COLORS = ['#E0582F', '#FF7A50', '#FF9A76', '#0B1D3D', '#1E3A5F', '#3B82F6', '#FFFFFF', '#FDE8DE'];

  const initPixels = useCallback(() => {
    const pixels: Pixel[] = [];
    const count = window.innerWidth < 768 ? 60 : 120;
    for (let i = 0; i < count; i++) {
      pixels.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 1.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2 - 0.1,
        size: Math.random() * 3 + 1.5,
        color: PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)],
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    pixelsRef.current = pixels;
  }, []);

  const drawPixels = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scroll = window.scrollY;
    const maxScroll = window.innerHeight * 2;
    const scrollFactor = Math.min(scroll / maxScroll, 1);

    pixelsRef.current.forEach((p, i) => {
      p.x += p.vx + scrollFactor * (Math.sin(i * 0.1) * 0.5);
      p.y += p.vy - scroll * 0.0005;
      p.pulse += 0.02;

      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse)) * (1 - scrollFactor * 0.3);
      const currentSize = p.size * (1 + scrollFactor * 2);

      ctx.save();
      ctx.globalAlpha = currentOpacity;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = currentSize * 4;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw connections
      pixelsRef.current.forEach((p2, j) => {
        if (j <= i) return;
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120 + scrollFactor * 80;
        if (dist < maxDist) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / maxDist) * 0.08 * (1 - scrollFactor * 0.5);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      });
    });

    animFrameRef.current = requestAnimationFrame(drawPixels);
  }, []);

  useEffect(() => {
    initPixels();
    animFrameRef.current = requestAnimationFrame(drawPixels);
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [initPixels, drawPixels]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveIndex((prev) => (prev + 1) % liveVideos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [liveVideos.length]);

  // Scroll-triggered reveal hook
  const useReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return { ref, visible };
  };

  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal();
  const r5 = useReveal(), r6 = useReveal(), r7 = useReveal(), r8 = useReveal();
  const r9 = useReveal(), r10 = useReveal(), r11 = useReveal();

  const revealClass = (visible: boolean) =>
    `transition-all duration-[1200ms] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`;

  const glassCard = 'backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] shadow-2xl';

  return (
    <div className="min-h-screen bg-[#050A12] text-white overflow-x-hidden">

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ width: '100%', height: '100%' }} />

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#050A12]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 h-20">
          <Link href="/" className="flex items-center">
            <Image src="/images/pixels-logo.png" alt="pixels™" width={100} height={28} className="brightness-0 invert" priority />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/40">
            <a href="#manifesto" className="hover:text-[var(--primary)] transition">Manifeste</a>
            <a href="#live" className="hover:text-[var(--primary)] transition">En live</a>
            <a href="#artistes" className="hover:text-[var(--primary)] transition">Artistes</a>
            <a href="#impact" className="hover:text-[var(--primary)] transition">Impact</a>
            <a href="#contact" className="hover:text-[var(--primary)] transition">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[13px] font-medium text-white/40 hover:text-white transition hidden sm:block">Connexion</Link>
            <Link href="/register" className="text-[13px] bg-[var(--primary)] text-white px-5 py-2.5 rounded-full hover:brightness-110 transition font-semibold">
              Rejoindre
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          1. HERO — Luminous particles + bold title
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="mb-8">
            <span className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold">Infrastructure culturelle étudiante • Montréal</span>
          </div>
          <h1 className="editorial-heading text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-tight">
            <span className="block bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              La musique
            </span>
            <span className="block bg-gradient-to-r from-[var(--primary)] to-[#FF7A50] bg-clip-text text-transparent">
              rassemble.
            </span>
          </h1>
          <p className="text-white/30 mt-8 max-w-xl mx-auto text-lg leading-relaxed">
            Nous créons les espaces où artistes, étudiants et communautés se rencontrent enfin.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="group relative bg-[var(--primary)] text-white px-8 py-4 rounded-full text-[15px] font-semibold hover:brightness-110 transition inline-flex items-center gap-2 overflow-hidden">
              <span className="relative z-10">Rejoindre la communauté</span>
              <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <a href="#manifesto" className="text-white/30 text-sm hover:text-white/60 transition font-medium inline-flex items-center gap-2">
              Découvrir le manifeste
              <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </a>
          </div>
        </div>
        {/* Scroll indicator line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-[var(--primary)]/40" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. OH NO AI — Manifesto section, scroll-reveal typewriter
      ═══════════════════════════════════════════════════════════ */}
      <section id="manifesto" className="relative py-28 md:py-40">
        <div ref={r1.ref} className={revealClass(r1.visible)}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-white/20 text-xs tracking-[0.3em] uppercase font-semibold mb-12">Le manifeste</p>
            <div className="space-y-6 editorial-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15]">
              <p className="text-white/60">Oh no.</p>
              <p className="text-white/70">L&rsquo;IA vole les artistes.</p>
              <p className="text-white/70">L&rsquo;IA vole les guitaristes.</p>
              <p className="text-white/80">L&rsquo;IA vole la musique.</p>
              <p className="text-[var(--primary)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-10">Oh no.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Answer section */}
      <section className="relative py-20 md:py-28">
        <div ref={r2.ref} className={revealClass(r2.visible)}>
          <div className="max-w-4xl mx-auto px-6">
            <div className={`${glassCard} rounded-3xl p-10 md:p-16`}>
              <div className="space-y-5 editorial-heading text-xl sm:text-2xl md:text-3xl leading-[1.3]">
                <p className="text-white/90">I guess you gotta come see us <span className="text-[var(--primary)]">live</span>.</p>
                <p className="text-white/70">I guess you gotta go to live shows that cost 20 bucks.</p>
                <p className="text-white/80">I guess you gotta come see it in <span className="text-[var(--primary)]">real life</span>.</p>
                <p className="text-white/70">I guess you gotta <span className="text-[var(--primary)]">make friends</span>.</p>
                <p className="text-white/90">I guess you gotta come see more <span className="text-[var(--primary)]">live musicians</span>.</p>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-white/40 text-sm leading-relaxed max-w-2xl">
                  Pendant que le monde débat de ce que la technologie remplace, nous construisons ce qu&rsquo;elle ne pourra jamais reproduire&nbsp;: la présence. Le frisson. Le regard de quelqu&rsquo;un qui joue pour toi, devant toi, maintenant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. LIQUID GLASS MEDIA REVEAL — Pixels events
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={r3.ref} className={revealClass(r3.visible)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4 text-center">Ce que ça donne</p>
            <h2 className="editorial-heading text-3xl md:text-5xl text-center mb-16 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Quand les pixels s&rsquo;assemblent.
            </h2>

            {/* Liquid glass grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { img: '/images/event-1.jpg', span: 'md:col-span-2 md:row-span-2', aspect: 'aspect-[4/3] md:aspect-square' },
                { img: '/images/event-5.jpg', span: '', aspect: 'aspect-square' },
                { img: '/images/event-3.jpg', span: '', aspect: 'aspect-square' },
                { img: '/images/event-2.jpg', span: '', aspect: 'aspect-[4/3]' },
                { img: '/images/event-7.jpg', span: 'md:col-span-2', aspect: 'aspect-[2/1]' },
              ].map((item, i) => (
                <div key={i} className={`${item.span} group relative ${item.aspect} rounded-2xl overflow-hidden`}>
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Image src={item.img} alt={`Pixels ${i+1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
                  </div>
                  {/* Liquid glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050A12]/60 via-transparent to-[#050A12]/20 opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="absolute inset-0 border border-white/[0.06] rounded-2xl" />
                  {/* Glass reflection */}
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/[0.04] to-transparent rounded-t-2xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. PREVIEW — rejoindre video in liquid glass
      ═══════════════════════════════════════════════════════════ */}
      <section id="artistes" className="py-20 md:py-28">
        <div ref={r4.ref} className={revealClass(r4.visible)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4">Artistes</p>
                <h2 className="editorial-heading text-4xl md:text-6xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Ce qui t&rsquo;attend.
                </h2>
                <p className="text-white/40 mt-6 text-lg leading-relaxed">
                  Pixels est un terrain de jeu pour les artistes qui veulent rencontrer d&rsquo;autres artistes. Pas besoin d&rsquo;être célèbre, signé ou parfaitement légitime. Si tu joues, viens.
                </p>
                <div className={`${glassCard} rounded-xl p-5 mt-6`}>
                  <p className="text-white/30 text-sm italic">&laquo;&nbsp;Et si je ne suis pas assez bon ?&nbsp;&raquo;</p>
                  <p className="text-white text-sm font-semibold mt-2">Parfait. Personne ne l&rsquo;était la première fois.</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/register?role=artist" className="bg-[var(--primary)] text-white px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition">
                    Rejoindre une jam →
                  </Link>
                  <Link href="/register?role=artist" className="border border-white/20 text-white/60 px-6 py-3 rounded-full text-sm font-medium hover:bg-white/5 transition">
                    Proposer un projet
                  </Link>
                </div>
              </div>
              <div className={`${glassCard} rounded-2xl p-2 overflow-hidden`}>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover">
                    <source src="/images/rejoindre-preview.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. EN LIVE — Carousel in liquid glass container
      ═══════════════════════════════════════════════════════════ */}
      <section id="live" className="py-20 md:py-28">
        <div ref={r5.ref} className={revealClass(r5.visible)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4">En live</p>
                <h2 className="editorial-heading text-3xl md:text-5xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Pas de filtre. Pas de playback.
                </h2>
              </div>
              <div className="hidden md:flex gap-2">
                <button onClick={() => setLiveIndex((prev) => (prev - 1 + liveVideos.length) % liveVideos.length)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => setLiveIndex((prev) => (prev + 1) % liveVideos.length)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            <div className={`${glassCard} rounded-2xl p-2 overflow-hidden`}>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                {liveVideos.map((src, i) => (
                  <video key={src} autoPlay muted loop playsInline preload={i <= 1 ? 'auto' : 'none'}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === liveIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <source src={src} type="video/mp4" />
                  </video>
                ))}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {liveVideos.map((_, i) => (
                    <button key={i} onClick={() => setLiveIndex(i)} className={`h-1 rounded-full transition-all duration-300 ${i === liveIndex ? 'bg-[var(--primary)] w-8' : 'bg-white/20 w-4'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          6. ORGANISATEURS — liquid glass split
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={r6.ref} className={revealClass(r6.visible)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className={`${glassCard} rounded-2xl p-2 overflow-hidden order-2 md:order-1`}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image src="/images/event-4.jpg" alt="Événement Pixels" fill className="object-cover" sizes="50vw" />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4">Organisateurs</p>
                <h2 className="editorial-heading text-4xl md:text-6xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Rassembler.
                </h2>
                <p className="text-white/40 mt-6 text-lg leading-relaxed">
                  Pour les galas, mariages, festivals, levées de fonds, lancements, cocktails et moments qui méritent mieux qu&rsquo;une playlist.
                </p>
                <p className="text-white/70 mt-6 text-lg font-medium border-l-2 border-[var(--primary)] pl-4">
                  Les gens n&rsquo;oublient pas une salle qui s&rsquo;est mise à vibrer.
                </p>
                <a href="#contact" className="inline-block mt-8 bg-[var(--primary)] text-white px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition">
                  Inviter Pixels →
                </a>
              </div>
            </div>

            {/* Format cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-12">
              {[
                { title: 'Ambiance live', desc: "Musique d'accompagnement élégante pour cocktails et réceptions.", img: '/images/event-6.jpg' },
                { title: 'Moment signature', desc: 'Première danse, ouverture, surprise. Un moment marquant.', img: '/images/event-2.jpg' },
                { title: 'Création sur mesure', desc: "Un concept musical pensé pour votre vision.", img: '/images/event-3.jpg' },
              ].map((f) => (
                <div key={f.title} className={`${glassCard} rounded-2xl p-2 group`}>
                  <div className="relative aspect-[3/2] rounded-xl overflow-hidden">
                    <Image src={f.img} alt={f.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                  </div>
                  <div className="p-5">
                    <h4 className="text-white font-bold">{f.title}</h4>
                    <p className="text-white/30 text-sm mt-2">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          7. COMMUNAUTÉ — Full video with glass overlay
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40">
            <source src="/images/community-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050A12] via-transparent to-[#050A12]" />
        </div>
        <div ref={r7.ref} className={`relative z-10 ${revealClass(r7.visible)}`}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="editorial-heading text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-white via-white to-[var(--primary)] bg-clip-text text-transparent">
              Come see it in real life.
            </h2>
            <p className="text-white/40 mt-8 text-lg leading-relaxed max-w-xl mx-auto">
              Tu peux venir écouter, rencontrer, filmer, applaudir, rester après la dernière note. Pixels n&rsquo;est pas seulement une scène. C&rsquo;est un mouvement.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/20 transition">
                Voir les événements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          8. IMPACT — Stats in glass cards
      ═══════════════════════════════════════════════════════════ */}
      <section id="impact" className="py-20 md:py-28">
        <div ref={r8.ref} className={revealClass(r8.visible)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4">Impact</p>
                <h2 className="editorial-heading text-3xl md:text-5xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Ce qui reste après la dernière note.
                </h2>
                <div className="mt-10 grid grid-cols-2 gap-4">
                  {[
                    { value: '80+', label: 'artistes' },
                    { value: '10K+', label: 'personnes touchées' },
                    { value: '5', label: 'universités' },
                    { value: '4+', label: 'jam sessions' },
                  ].map((s) => (
                    <div key={s.label} className={`${glassCard} rounded-xl p-5`}>
                      <span className="editorial-heading text-3xl md:text-4xl text-[var(--primary)]">{s.value}</span>
                      <p className="text-white/40 text-sm mt-2">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${glassCard} rounded-2xl p-2`}>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover">
                    <source src="/images/impact-video.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          9. POURQUOI PIXELS — Name origin in glass
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={r9.ref} className={revealClass(r9.visible)}>
          <div className="max-w-3xl mx-auto px-6">
            <div className={`${glassCard} rounded-3xl p-10 md:p-16`}>
              <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-6 text-center">Le nom</p>
              <h2 className="editorial-heading text-2xl md:text-4xl text-center bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Pourquoi Pixels.
              </h2>
              <div className="mt-8 space-y-4 text-white/40 text-lg leading-relaxed text-center max-w-xl mx-auto">
                <p>Nous portons tous une couleur différente.</p>
                <p>Séparément, nous éclairons un morceau du monde.</p>
                <p className="text-white/70 font-medium">Ensemble, nous faisons apparaître l&rsquo;image.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          10. NOS HISTOIRES — Expandable glass cards
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={r10.ref} className={revealClass(r10.visible)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4 text-center">Nos histoires</p>
            <h2 className="editorial-heading text-3xl md:text-5xl text-center mb-16 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Ce qui fait qu&rsquo;on reste.
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'centre-sciences', title: 'Le Centre des sciences', desc: 'Notre premier événement d\'envergure.', tag: 'Événement', full: 'On nous a confié une soirée entière au Centre des sciences de Montréal. Ce soir-là, on a compris que ce qu\'on construisait dépassait notre cercle. Les gens sont venus pour la musique. Ils sont restés pour l\'énergie. Pixels n\'était plus une idée — c\'était un mouvement.' },
                { id: 'premier-mariage', title: 'Le premier mariage', desc: 'Un couple nous a fait confiance.', tag: 'Confiance', full: 'Un couple qu\'on ne connaissait pas nous a contactés. Ils voulaient de la musique live pour leur mariage. Pas un DJ — ils voulaient Pixels. Cette confiance nous a marqués.' },
                { id: 'forces-avenir', title: 'Forces AVENIR', desc: "L'impact dépasse la musique.", tag: 'Reconnaissance', full: 'Forces AVENIR récompense les initiatives étudiantes qui transforment leur communauté. Quand Pixels a été reconnu, ça a confirmé ce qu\'on sentait depuis longtemps : ce qu\'on construit n\'est pas seulement un projet musical.' },
                { id: 'artistes-trouvent', title: 'Des artistes qui se trouvent', desc: 'Deux musiciens. Six mois. Un projet.', tag: 'Rencontre', full: 'L\'un étudiait à McGill, l\'autre à HEC. Ils jouaient du même instrument sans le savoir. Ils se sont croisés à un événement Pixels, ont commencé à jammer, puis à composer. Six mois plus tard, ils avaient un projet à eux.' },
                { id: 'premier-festival', title: 'Le premier festival', desc: 'Quand la communauté se dépasse.', tag: 'Communauté', full: 'La communauté avait grandi au point qu\'un simple événement ne suffisait plus. Le premier festival Pixels est né de cette nécessité. Pas d\'un business plan — d\'une énergie collective.' },
                { id: 'hoodie', title: 'Le hoodie Pixels', desc: 'Porter ses couleurs.', tag: 'Identité', full: 'Le premier merch Pixels. Pas un produit marketing — un symbole d\'appartenance. Quand tu portes le hoodie, tu dis : je fais partie de cette histoire.' },
              ].map((story) => (
                <div key={story.id}
                  className={`${glassCard} rounded-xl p-6 cursor-pointer transition-all duration-300 ${openStory === story.id ? 'border-[var(--primary)]/30 bg-white/[0.06]' : 'hover:bg-white/[0.06]'}`}
                  onClick={() => setOpenStory(openStory === story.id ? null : story.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[var(--primary)] text-[10px] font-bold tracking-[0.15em] uppercase">{story.tag}</span>
                      <h3 className="font-bold text-lg mt-2 mb-2">{story.title}</h3>
                      <p className="text-white/30 text-sm">{story.desc}</p>
                    </div>
                    <svg className={`w-5 h-5 text-[var(--primary)] flex-shrink-0 transition-transform duration-300 ${openStory === story.id ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div className={`overflow-hidden transition-all duration-500 ${openStory === story.id ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-white/50 text-sm leading-relaxed">{story.full}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          11. MERCH + TECH — Hoodie in glass
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={r11.ref} className={revealClass(r11.visible)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4">Technologie</p>
              <h2 className="editorial-heading text-3xl md:text-4xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Coder les outils. Garder la chaleur.
              </h2>
              <p className="text-white/40 mt-6 leading-relaxed">
                Nous croyons à la technologie. Nous construisons des outils, des plateformes, des systèmes. Mais nous refusons que l&rsquo;efficacité remplace ce qui fait battre un cœur.
              </p>
              <p className="text-white/60 mt-6 font-medium border-l-2 border-[var(--primary)] pl-4">
                Un algorithme peut recommander une chanson. Il ne peut pas te présenter ton prochain meilleur ami.
              </p>
            </div>
            <div className={`${glassCard} rounded-2xl p-2`}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src="/images/hoodie.jpg" alt="Pixels merch" fill className="object-cover" sizes="50vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          LA FAMILLE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4">La famille</p>
          <h2 className="editorial-heading text-2xl md:text-3xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Personne ne possède Pixels. Tout le monde le construit.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['Franck Afane', 'Méline', 'Jean-Paul Romero', 'Paloma Hesry', 'Mai Linh Pham Dac', 'Louise Wang', 'Mira Charabati', 'Naomi Slama', 'Ivan Gaspart'].map(name => (
              <span key={name} className="px-3 py-1.5 border border-white/10 rounded-full text-white/30 text-xs hover:border-[var(--primary)]/30 hover:text-white/60 transition">{name}</span>
            ))}
            <span className="px-3 py-1.5 bg-[var(--primary)] rounded-full text-white text-xs font-semibold">+ 80 artistes</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION FINALE
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30">
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050A12] via-[#050A12]/50 to-[#050A12]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="editorial-heading text-3xl md:text-4xl lg:text-5xl leading-snug">
            <span className="text-white/60">Chaque concert se termine.</span><br />
            <span className="text-white/60">Chaque répétition aussi.</span><br />
            <span className="text-[var(--primary)]">Ce qui reste, ce sont les personnes.</span>
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?role=artist" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full text-[15px] font-semibold hover:brightness-110 transition">
              Je fais de la musique
            </Link>
            <a href="#contact" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full text-[15px] font-medium hover:bg-white/20 transition">
              J&rsquo;organise un événement
            </a>
            <Link href="/register" className="border border-white/10 text-white/50 px-8 py-4 rounded-full text-[15px] font-medium hover:bg-white/5 transition">
              Je veux vibrer
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="py-20 md:py-28 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <p className="text-[var(--primary)] text-xs tracking-[0.3em] uppercase font-semibold mb-4">Contact</p>
              <h2 className="editorial-heading text-3xl md:text-4xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Parlons-en.
              </h2>
              <div className="mt-6 space-y-3 text-white/30 leading-relaxed">
                <p>Vous cherchez des artistes ?</p>
                <p>Vous voulez rejoindre la communauté ?</p>
                <p>Vous avez une idée à construire ?</p>
              </div>
              <div className="mt-8 space-y-2 text-sm text-white/30">
                <p><a href="mailto:pixelsmtl@hotmail.com" className="hover:text-[var(--primary)] transition">pixelsmtl@hotmail.com</a></p>
                <p>Montréal, Canada</p>
              </div>
            </div>
            <div className={`${glassCard} rounded-2xl p-8`}>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nom" className="w-full border-b border-white/10 py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition placeholder:text-white/20 text-white" />
                <input type="email" placeholder="Courriel" className="w-full border-b border-white/10 py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition placeholder:text-white/20 text-white" />
                <select className="w-full border-b border-white/10 py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition text-white/20">
                  <option>Je suis...</option>
                  <option>Un artiste / musicien</option>
                  <option>Un organisateur d&apos;événement</option>
                  <option>Un partenaire potentiel</option>
                  <option>Juste curieux</option>
                </select>
                <textarea placeholder="Ton message" rows={3} className="w-full border-b border-white/10 py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--primary)] transition resize-none placeholder:text-white/20 text-white" />
                <button type="submit" className="bg-[var(--primary)] text-white px-8 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition mt-2">
                  Envoyer →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <Image src="/images/pixels-logo.png" alt="pixels™" width={120} height={34} className="brightness-0 invert mb-3" />
              <p className="text-white/20 text-sm">À bientôt quelque part entre deux accords.</p>
            </div>
            <div className="flex gap-5">
              <a href="https://www.instagram.com/pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[var(--primary)] transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="https://www.tiktok.com/@pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[var(--primary)] transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a>
              <a href="https://www.youtube.com/@pixelsmtl" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[var(--primary)] transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
              <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[var(--primary)] transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg></a>
              <a href="https://www.linkedin.com/company/pixelsmtl/" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[var(--primary)] transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-white/10">&copy; PIXELS&trade; 2025 — Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
