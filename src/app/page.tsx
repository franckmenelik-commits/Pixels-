'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PixelDot {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  phase: number;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [liveIndex, setLiveIndex] = useState(0);
  const [openStory, setOpenStory] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<PixelDot[]>([]);
  const animRef = useRef<number>(0);
  const scrollRef = useRef(0);
  const liveVideos = ['/images/live-1.mp4', '/images/live-2.mp4', '/images/live-3.mp4', '/images/live-4.mp4', '/images/live-5.mp4', '/images/live-6.mp4'];

  const COLORS = {
    orange: ['#F97316', '#FB923C', '#EA580C', '#E0582F'],
    blue: ['#3B82F6', '#60A5FA', '#2563EB'],
    violet: ['#8B5CF6', '#A78BFA', '#7C3AED'],
    white: ['#FFFFFF', '#E5E7EB'],
  };

  const ALL_COLORS = [...COLORS.orange, ...COLORS.blue, ...COLORS.violet, ...COLORS.white];

  // Hero canvas — pixel constellation
  const initPixels = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = w < 768 ? 100 : 200;
    const pixels: PixelDot[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const waveX = w / 2 + Math.cos(angle * 3) * (w * 0.3) + (Math.random() - 0.5) * 100;
      const waveY = h / 2 + Math.sin(angle * 2) * 80 + (Math.random() - 0.5) * 60;

      pixels.push({
        x: Math.random() * w,
        y: Math.random() * h,
        targetX: waveX,
        targetY: waveY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 2,
        color: ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)],
        opacity: Math.random() * 0.7 + 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    pixelsRef.current = pixels;
  }, []);

  const animateHero = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scroll = scrollRef.current;
    const heroH = window.innerHeight;
    const scrollPct = Math.min(scroll / heroH, 1);
    const converge = scrollPct < 0.3 ? 1 - scrollPct / 0.3 : 0;
    const explode = scrollPct > 0.3 ? (scrollPct - 0.3) / 0.7 : 0;

    pixelsRef.current.forEach((p, i) => {
      p.phase += 0.015;

      if (converge > 0) {
        p.x += (p.targetX - p.x) * 0.02 * converge;
        p.y += (p.targetY - p.y) * 0.02 * converge;
      }

      if (explode > 0) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        p.x += (dx / dist) * explode * 3;
        p.y += (dy / dist) * explode * 3;
      }

      p.x += Math.sin(p.phase + i * 0.1) * 0.3;
      p.y += Math.cos(p.phase + i * 0.15) * 0.2;

      if (p.x < -50) p.x = canvas.width + 50;
      if (p.x > canvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = canvas.height + 50;
      if (p.y > canvas.height + 50) p.y = -50;

      const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.phase)) * (1 - explode * 0.6);

      // Glow
      ctx.save();
      ctx.globalAlpha = alpha * 0.3;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.size * 8;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      ctx.restore();

      // Square pixel
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.restore();

      // Connections (only nearby, not too many)
      if (i % 3 === 0) {
        for (let j = i + 1; j < Math.min(i + 8, pixelsRef.current.length); j++) {
          const p2 = pixelsRef.current[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 100 * (1 + converge)) {
            ctx.save();
            ctx.globalAlpha = (1 - d / (100 * (1 + converge))) * 0.06 * (1 - explode);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    });

    animRef.current = requestAnimationFrame(animateHero);
  }, []);

  // Network canvas — university nodes
  const animateNetwork = useCallback(() => {
    const canvas = networkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) * 0.35;
    const t = Date.now() * 0.001;

    const nodes = [
      { label: 'HEC', angle: -Math.PI / 2, color: '#F97316' },
      { label: 'McGill', angle: -Math.PI / 2 + (2 * Math.PI / 5), color: '#3B82F6' },
      { label: 'Concordia', angle: -Math.PI / 2 + (4 * Math.PI / 5), color: '#8B5CF6' },
      { label: 'Poly', angle: -Math.PI / 2 + (6 * Math.PI / 5), color: '#60A5FA' },
      { label: 'UdeM', angle: -Math.PI / 2 + (8 * Math.PI / 5), color: '#A78BFA' },
    ];

    // Draw lines from center to each node
    nodes.forEach((node, i) => {
      const nx = cx + Math.cos(node.angle) * r;
      const ny = cy + Math.sin(node.angle) * r;

      // Pulsing line
      const grad = ctx.createLinearGradient(cx, cy, nx, ny);
      grad.addColorStop(0, node.color + '60');
      grad.addColorStop(0.5, node.color + '20');
      grad.addColorStop(1, node.color + '60');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      // Traveling dot
      const dotPos = ((t * 0.3 + i * 0.4) % 1);
      const dx = cx + (nx - cx) * dotPos;
      const dy = cy + (ny - cy) * dotPos;
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(dx, dy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Node circle
      ctx.fillStyle = node.color + '15';
      ctx.beginPath();
      ctx.arc(nx, ny, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(nx, ny, 5, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = '#FFFFFF99';
      ctx.font = '11px var(--font-dm-sans), sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + 32);
    });

    // Center node (Pixels)
    ctx.fillStyle = '#F9731630';
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px var(--font-dm-sans), sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PIXELS', cx, cy + 44);

    requestAnimationFrame(animateNetwork);
  }, []);

  // CTA canvas — fiber optic rays
  const animateCTA = useCallback(() => {
    const canvas = ctaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * 2;
    canvas.height = h * 2;
    ctx.scale(2, 2);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const t = Date.now() * 0.0008;
    const rayCount = 40;

    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2 + t * 0.2;
      const len = 300 + Math.sin(t + i * 0.5) * 100;
      const startX = cx + Math.cos(angle) * len;
      const startY = cy + Math.sin(angle) * len;

      const colors = ['#F97316', '#3B82F6', '#8B5CF6', '#FB923C'];
      const color = colors[i % colors.length];

      const grad = ctx.createLinearGradient(startX, startY, cx, cy);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.6, color + '10');
      grad.addColorStop(1, color + '40');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Glow at center
      const dotDist = (t * 80 + i * 20) % len;
      const ratio = 1 - dotDist / len;
      const px = startX + (cx - startX) * ratio;
      const py = startY + (cy - startY) * ratio;

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Center glow
    const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
    cGrad.addColorStop(0, '#F9731640');
    cGrad.addColorStop(0.5, '#F9731610');
    cGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(animateCTA);
  }, []);

  useEffect(() => {
    initPixels();
    animRef.current = requestAnimationFrame(animateHero);
    return () => cancelAnimationFrame(animRef.current);
  }, [initPixels, animateHero]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) animateNetwork();
    }, { threshold: 0.1 });
    if (networkCanvasRef.current) obs.observe(networkCanvasRef.current);
    return () => obs.disconnect();
  }, [animateNetwork]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) animateCTA();
    }, { threshold: 0.1 });
    if (ctaCanvasRef.current) obs.observe(ctaCanvasRef.current);
    return () => obs.disconnect();
  }, [animateCTA]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setLiveIndex((p) => (p + 1) % liveVideos.length), 6000);
    return () => clearInterval(timer);
  }, [liveVideos.length]);

  // Scroll reveal
  const useReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.12 });
      o.observe(el);
      return () => o.disconnect();
    }, []);
    return { ref, vis };
  };

  const reveals = Array.from({ length: 12 }, () => useReveal());
  const rc = (v: boolean) => `transition-all duration-[1200ms] ease-out ${v ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`;
  const glass = 'backdrop-blur-2xl bg-white/[0.04] border border-white/[0.10] shadow-2xl';

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>

      {/* Hero canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* ═══ NAV ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#050508]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 h-20">
          <Link href="/" className="flex items-center">
            <Image src="/images/pixels-logo.png" alt="pixels™" width={100} height={28} className="brightness-0 invert" priority />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/30">
            <a href="#manifesto" className="hover:text-[#F97316] transition">Manifeste</a>
            <a href="#live" className="hover:text-[#F97316] transition">En live</a>
            <a href="#network" className="hover:text-[#F97316] transition">Réseau</a>
            <a href="#impact" className="hover:text-[#F97316] transition">Impact</a>
            <a href="#contact" className="hover:text-[#F97316] transition">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[13px] font-medium text-white/30 hover:text-white transition hidden sm:block">Connexion</Link>
            <Link href="/register" className="text-[13px] bg-[#F97316] text-white px-5 py-2.5 rounded-full hover:brightness-110 transition font-semibold">
              Rejoindre
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════
          1. HERO — Pixel Constellation
      ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="mb-6">
            <span className="text-[#F97316] text-[11px] tracking-[0.35em] uppercase font-semibold">Infrastructure culturelle étudiante • Montréal</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-[clamp(4rem,12vw,10rem)] leading-[0.88] tracking-[-0.04em] font-bold">
            <span className="block bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">PIXELS</span>
          </h1>
          <p className="text-white/25 mt-6 max-w-md mx-auto text-base leading-relaxed">
            Nous créons les espaces où artistes, étudiants et communautés se rencontrent enfin.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="group bg-[#F97316] text-white px-8 py-4 rounded-full text-[15px] font-semibold hover:brightness-110 transition inline-flex items-center gap-2">
              Rejoindre la communauté
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <a href="#manifesto" className="text-white/20 text-sm hover:text-white/40 transition inline-flex items-center gap-2 font-medium">
              Découvrir
              <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#F97316]/30 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════
          2. PROVOCATION IA — Lines appearing
      ═══════════════════════════════════════════════════ */}
      <section id="manifesto" className="relative py-32 md:py-44">
        <div ref={reveals[0].ref} className={rc(reveals[0].vis)}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-white/15 text-[10px] tracking-[0.4em] uppercase font-semibold mb-16">Le manifeste</p>
            <div className="space-y-4">
              {[
                { text: 'Oh no.', cls: 'text-white/40 text-2xl md:text-3xl' },
                { text: "AI is stealing artists.", cls: 'text-white/50 text-2xl md:text-4xl' },
                { text: "AI is stealing guitarists.", cls: 'text-white/55 text-2xl md:text-4xl' },
                { text: "AI is stealing music.", cls: 'text-white/65 text-3xl md:text-5xl' },
              ].map((line, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-fraunces), serif', transitionDelay: `${i * 200}ms` }}
                  className={`${line.cls} font-bold ${reveals[0].vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-1000`}>
                  {line.text}
                </p>
              ))}
              <p style={{ fontFamily: 'var(--font-fraunces), serif', transitionDelay: '1000ms' }}
                className={`text-[#F97316] text-4xl md:text-6xl font-bold mt-8 ${reveals[0].vis ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-all duration-1000`}>
                Oh no.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. LA RÉPONSE — Liquid glass card
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div ref={reveals[1].ref} className={rc(reveals[1].vis)}>
          <div className="max-w-3xl mx-auto px-6">
            <div className={`${glass} rounded-3xl p-8 md:p-14`}>
              <div className="space-y-4" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                {[
                  { text: <>I guess you gotta come see us <span className="text-[#F97316]">live</span>.</>, size: 'text-xl md:text-2xl' },
                  { text: 'I guess you gotta go to live shows that cost 20 bucks.', size: 'text-lg md:text-xl text-white/60' },
                  { text: <>I guess you gotta come see it in <span className="text-[#3B82F6]">real life</span>.</>, size: 'text-xl md:text-2xl' },
                  { text: <>I guess you gotta <span className="text-[#8B5CF6]">make friends</span>.</>, size: 'text-xl md:text-2xl' },
                  { text: <>I guess you gotta come see more <span className="text-[#F97316]">live musicians</span>.</>, size: 'text-xl md:text-2xl' },
                ].map((line, i) => (
                  <p key={i} className={`${line.size} font-semibold leading-relaxed`}>{line.text}</p>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-[#F97316] font-bold text-lg" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                  C&rsquo;est exactement ce que Pixels crée.
                </p>
                <p className="text-white/25 text-sm mt-3 leading-relaxed">
                  Pendant que le monde débat de ce que la technologie remplace, nous construisons ce qu&rsquo;elle ne pourra jamais reproduire&nbsp;: la présence, le frisson, le regard de quelqu&rsquo;un qui joue pour toi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. TROIS PANNEAUX LIQUID GLASS
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={reveals[2].ref} className={rc(reveals[2].vis)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  color: '#F97316', label: 'Music Mondays',
                  desc: 'Chaque lundi, les musiciens se retrouvent. Un piano, une résidence, zéro barrière.',
                  img: '/images/event-1.jpg',
                },
                {
                  color: '#3B82F6', label: 'Live sur mesure',
                  desc: "Mariages, galas, lancements. On crée le moment musical qui transforme votre événement.",
                  img: '/images/event-4.jpg',
                },
                {
                  color: '#8B5CF6', label: 'Campus Collabs',
                  desc: "5 universités, une scène commune. HEC × McGill × Concordia × Poly × UdeM.",
                  img: '/images/event-5.jpg',
                },
              ].map((panel, i) => (
                <div key={panel.label}
                  style={{ transitionDelay: `${i * 200}ms` }}
                  className={`${glass} rounded-2xl overflow-hidden group ${reveals[2].vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} transition-all duration-1000`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={panel.img} alt={panel.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent" />
                    {/* Colored glow at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: panel.color, boxShadow: `0 0 30px ${panel.color}40` }} />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: panel.color, boxShadow: `0 0 8px ${panel.color}` }} />
                      <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: panel.color }}>{panel.label}</span>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed">{panel.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. ARTISTES — Video preview in glass
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={reveals[3].ref} className={rc(reveals[3].vis)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#F97316] text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">Artistes</p>
              <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                Ce qui t&rsquo;attend.
              </h2>
              <p className="text-white/30 mt-6 leading-relaxed">
                Pixels est un terrain de jeu pour les artistes qui veulent rencontrer d&rsquo;autres artistes. Pas besoin d&rsquo;être célèbre. Si tu joues, viens.
              </p>
              <div className={`${glass} rounded-xl p-5 mt-6`}>
                <p className="text-white/20 text-sm italic">&laquo;&nbsp;Et si je ne suis pas assez bon ?&nbsp;&raquo;</p>
                <p className="text-white text-sm font-semibold mt-2">Parfait. Personne ne l&rsquo;était la première fois.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register?role=artist" className="bg-[#F97316] text-white px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition">
                  Rejoindre une jam →
                </Link>
              </div>
            </div>
            <div className={`${glass} rounded-2xl p-2`}>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover">
                  <source src="/images/rejoindre-preview.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. EN LIVE — Carousel
      ═══════════════════════════════════════════════════ */}
      <section id="live" className="py-20 md:py-28">
        <div ref={reveals[4].ref} className={rc(reveals[4].vis)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[#F97316] text-[10px] tracking-[0.3em] uppercase font-semibold mb-3">En live</p>
                <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                  Pas de filtre. Pas de playback.
                </h2>
              </div>
              <div className="hidden md:flex gap-2">
                <button onClick={() => setLiveIndex((p) => (p - 1 + liveVideos.length) % liveVideos.length)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/30 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={() => setLiveIndex((p) => (p + 1) % liveVideos.length)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/30 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            <div className={`${glass} rounded-2xl p-2`}>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                {liveVideos.map((src, i) => (
                  <video key={src} autoPlay muted loop playsInline preload={i <= 1 ? 'auto' : 'none'}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === liveIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <source src={src} type="video/mp4" />
                  </video>
                ))}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {liveVideos.map((_, i) => (
                    <button key={i} onClick={() => setLiveIndex(i)} className={`h-1 rounded-full transition-all ${i === liveIndex ? 'bg-[#F97316] w-8' : 'bg-white/15 w-4'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. NETWORK — Animated university constellation
      ═══════════════════════════════════════════════════ */}
      <section id="network" className="py-20 md:py-28">
        <div ref={reveals[5].ref} className={rc(reveals[5].vis)}>
          <div className="max-w-[900px] mx-auto px-6 text-center">
            <p className="text-[#8B5CF6] text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">Le réseau</p>
            <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent mb-4">
              5 campus. 1 scène.
            </h2>
            <p className="text-white/25 text-sm max-w-md mx-auto mb-12">Les connexions entre universités montréalaises passent par la musique.</p>
            <div className={`${glass} rounded-3xl p-4`}>
              <canvas ref={networkCanvasRef} className="w-full rounded-2xl" style={{ height: '360px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. MUSIC MONDAY — "Every Monday We Take Over"
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30">
            <source src="/images/community-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-transparent to-[#050508]" />
        </div>
        <div ref={reveals[6].ref} className={`relative z-10 ${rc(reveals[6].vis)}`}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.95]">
              <span className="text-white/80">Every Monday</span><br />
              <span className="text-[#F97316]">We Take Over.</span>
            </h2>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              {[
                { value: '50+', label: 'éditions' },
                { value: '200+', label: 'musiciens' },
                { value: '5', label: 'campus' },
              ].map((s) => (
                <div key={s.label} className={`${glass} rounded-xl px-8 py-5 text-center`}>
                  <span style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-3xl md:text-4xl font-bold text-[#F97316]">{s.value}</span>
                  <p className="text-white/30 text-xs mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          9. IMPACT + MEDIA GALLERY
      ═══════════════════════════════════════════════════ */}
      <section id="impact" className="py-20 md:py-28">
        <div ref={reveals[7].ref} className={rc(reveals[7].vis)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#F97316] text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">Impact</p>
              <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                Ce qui reste après la dernière note.
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { value: '80+', label: 'artistes', color: '#F97316' },
                  { value: '10K+', label: 'personnes', color: '#3B82F6' },
                  { value: '5', label: 'universités', color: '#8B5CF6' },
                  { value: '4+', label: 'jam sessions', color: '#FB923C' },
                ].map((s) => (
                  <div key={s.label} className={`${glass} rounded-xl p-4`}>
                    <span style={{ fontFamily: 'var(--font-fraunces), serif', color: s.color }} className="text-2xl md:text-3xl font-bold">{s.value}</span>
                    <p className="text-white/25 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${glass} rounded-2xl p-2`}>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover">
                  <source src="/images/impact-video.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media mosaic */}
      <section className="py-8">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1">
            {[2, 4, 5, 7, 1, 3, 6, 2].map((n, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                <Image src={`/images/event-${n}.jpg`} alt={`Pixels ${i+1}`} fill className="object-cover hover:scale-110 transition-transform duration-700" sizes="12.5vw" />
                <div className="absolute inset-0 border border-white/[0.05] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          10. NOS HISTOIRES
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={reveals[8].ref} className={rc(reveals[8].vis)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <p className="text-[#F97316] text-[10px] tracking-[0.3em] uppercase font-semibold mb-4 text-center">Nos histoires</p>
            <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent mb-12">
              Ce qui fait qu&rsquo;on reste.
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'sciences', title: 'Le Centre des sciences', desc: 'Notre premier événement d\'envergure.', tag: 'Événement', color: '#F97316', full: 'On nous a confié une soirée entière au Centre des sciences de Montréal. Les gens sont venus pour la musique. Ils sont restés pour l\'énergie.' },
                { id: 'mariage', title: 'Le premier mariage', desc: 'Un couple nous a fait confiance.', tag: 'Confiance', color: '#3B82F6', full: 'Pas un DJ, pas un groupe professionnel — ils voulaient Pixels. Cette confiance nous a marqués.' },
                { id: 'forces', title: 'Forces AVENIR', desc: 'L\'impact dépasse la musique.', tag: 'Reconnaissance', color: '#8B5CF6', full: 'Forces AVENIR récompense les initiatives qui transforment leur communauté. Pixels a été reconnu.' },
                { id: 'artistes', title: 'Artistes qui se trouvent', desc: 'Deux musiciens. Six mois. Un projet.', tag: 'Rencontre', color: '#F97316', full: 'L\'un à McGill, l\'autre à HEC. Ils jouaient du même instrument sans le savoir. Six mois après leur rencontre chez Pixels, ils avaient un projet à eux.' },
                { id: 'festival', title: 'Le premier festival', desc: 'La communauté se dépasse.', tag: 'Communauté', color: '#3B82F6', full: 'Le premier festival Pixels est né d\'une énergie collective qui avait besoin d\'un espace à sa mesure.' },
                { id: 'hoodie', title: 'Le hoodie Pixels', desc: 'Porter ses couleurs.', tag: 'Identité', color: '#8B5CF6', full: 'Pas un produit marketing — un symbole d\'appartenance. Quand tu le portes, tu dis : je fais partie de cette histoire.' },
              ].map((story) => (
                <div key={story.id} className={`${glass} rounded-xl p-6 cursor-pointer transition-all duration-300 ${openStory === story.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.06]'}`}
                  style={{ borderColor: openStory === story.id ? story.color + '40' : undefined }}
                  onClick={() => setOpenStory(openStory === story.id ? null : story.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: story.color }} />
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: story.color }}>{story.tag}</span>
                      </div>
                      <h3 className="font-bold text-base mb-1">{story.title}</h3>
                      <p className="text-white/25 text-sm">{story.desc}</p>
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${openStory === story.id ? 'rotate-45' : ''}`} style={{ color: story.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <div className={`overflow-hidden transition-all duration-500 ${openStory === story.id ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t pt-4" style={{ borderColor: story.color + '20' }}>
                      <p className="text-white/40 text-sm leading-relaxed">{story.full}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          11. TECH + MERCH
      ═══════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div ref={reveals[9].ref} className={rc(reveals[9].vis)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#3B82F6] text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">Technologie</p>
              <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                Coder les outils. Garder la chaleur.
              </h2>
              <p className="text-white/25 mt-6 leading-relaxed">
                Un algorithme peut recommander une chanson. Il ne peut pas te présenter ton prochain meilleur ami.
              </p>
            </div>
            <div className={`${glass} rounded-2xl p-2`}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src="/images/hoodie.jpg" alt="Pixels merch" fill className="object-cover" sizes="50vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          12. CTA — Fiber optic canvas
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-40">
        <canvas ref={ctaCanvasRef} className="absolute inset-0 w-full h-full" />
        <div ref={reveals[10].ref} className={`relative z-10 ${rc(reveals[10].vis)}`}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug">
              <span className="text-white/50">Chaque concert se termine.</span><br />
              <span className="text-white/50">Chaque répétition aussi.</span><br />
              <span className="text-[#F97316]">Ce qui reste, ce sont les personnes.</span>
            </h2>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className={`${glass} text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-[#F97316]/20 transition inline-flex items-center gap-2 border-[#F97316]/30`}>
                <span className="text-[#F97316]">Réserver maintenant</span>
                <svg className="w-5 h-5 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* La famille */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-white/15 text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">La famille</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Franck Afane', 'Méline', 'Jean-Paul Romero', 'Paloma Hesry', 'Mai Linh Pham Dac', 'Louise Wang', 'Mira Charabati', 'Naomi Slama', 'Ivan Gaspart'].map(name => (
              <span key={name} className="px-3 py-1.5 border border-white/[0.06] rounded-full text-white/20 text-xs">{name}</span>
            ))}
            <span className="px-3 py-1.5 bg-[#F97316] rounded-full text-white text-xs font-semibold">+ 80 artistes</span>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="py-20 md:py-28 border-t border-white/5">
        <div ref={reveals[11].ref} className={rc(reveals[11].vis)}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-[#F97316] text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">Contact</p>
              <h2 style={{ fontFamily: 'var(--font-fraunces), serif' }} className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                Parlons-en.
              </h2>
              <div className="mt-6 space-y-2 text-white/20 text-sm">
                <p>Vous cherchez des artistes ?</p>
                <p>Vous voulez rejoindre la communauté ?</p>
                <p>Vous avez une idée à construire ?</p>
              </div>
              <div className="mt-8 space-y-2 text-sm">
                <p><a href="mailto:pixelsmtl@hotmail.com" className="text-white/25 hover:text-[#F97316] transition">pixelsmtl@hotmail.com</a></p>
                <p className="text-white/15">Montréal, Canada</p>
              </div>
              <div className="mt-8 flex gap-4">
                {[
                  { href: 'https://www.instagram.com/pixelsmtl', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                  { href: 'https://www.tiktok.com/@pixelsmtl', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
                  { href: 'https://www.youtube.com/@pixelsmtl', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                  { href: 'https://www.linkedin.com/company/pixelsmtl/', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-[#F97316] transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>
            <div className={`${glass} rounded-2xl p-8`}>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Nom" className="w-full border-b border-white/[0.06] py-3 text-sm bg-transparent focus:outline-none focus:border-[#F97316] transition placeholder:text-white/15 text-white" />
                <input type="email" placeholder="Courriel" className="w-full border-b border-white/[0.06] py-3 text-sm bg-transparent focus:outline-none focus:border-[#F97316] transition placeholder:text-white/15 text-white" />
                <select className="w-full border-b border-white/[0.06] py-3 text-sm bg-transparent focus:outline-none focus:border-[#F97316] transition text-white/15">
                  <option>Je suis...</option>
                  <option>Un artiste / musicien</option>
                  <option>Un organisateur d&apos;événement</option>
                  <option>Un partenaire potentiel</option>
                  <option>Juste curieux</option>
                </select>
                <textarea placeholder="Ton message" rows={3} className="w-full border-b border-white/[0.06] py-3 text-sm bg-transparent focus:outline-none focus:border-[#F97316] transition resize-none placeholder:text-white/15 text-white" />
                <button type="submit" className="bg-[#F97316] text-white px-8 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition">
                  Envoyer →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <Image src="/images/pixels-logo.png" alt="pixels™" width={80} height={22} className="brightness-0 invert opacity-30" />
          <p className="text-[10px] text-white/10">&copy; PIXELS&trade; 2025 — Tous droits réservés</p>
          <p className="text-white/10 text-xs">À bientôt entre deux accords.</p>
        </div>
      </footer>
    </div>
  );
}
