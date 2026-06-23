'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--text)]">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 py-4">
          <Link href="/" className="pixels-logo text-xl text-[var(--dark)]">pixels</Link>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-[var(--text-muted)]">
            <a href="#projets" className="hover:text-[var(--dark)] transition">Projets</a>
            <a href="#artistes" className="hover:text-[var(--dark)] transition">Artistes</a>
            <a href="#communaute" className="hover:text-[var(--dark)] transition">Communaute</a>
            <a href="#apropos" className="hover:text-[var(--dark)] transition">A propos</a>
            <a href="#contact" className="hover:text-[var(--dark)] transition">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[13px] text-[var(--text-muted)] hover:text-[var(--dark)] transition hidden sm:block">
              Connexion
            </Link>
            <Link href="/register" className="text-[13px] bg-[var(--primary)] text-white px-5 py-2 rounded-full hover:brightness-110 transition font-medium">
              Rejoindre Pixels
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 01 HERO ── */}
      <section className="bg-[var(--dark)] text-white min-h-screen flex items-end relative overflow-hidden pt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/event-1.jpg"
            alt="Pixels live performance"
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark)] via-[var(--dark)]/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 pb-20 w-full">
          <h1 className="editorial-heading text-6xl md:text-8xl lg:text-9xl text-white leading-[0.95]">
            Creer<span className="text-[var(--primary)]">.</span><br />
            Rassembler<span className="text-[var(--primary)]">.</span><br />
            Faire vibrer<span className="text-[var(--primary)]">.</span>
          </h1>
          <p className="text-white/60 mt-8 max-w-lg text-lg leading-relaxed">
            Pixels reunit les talents pour creer des experiences qui marquent.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <Link href="/register" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full text-[15px] font-medium hover:brightness-110 transition inline-flex items-center gap-2">
              Rejoindre la communaute
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 02 A PROPOS ── */}
      <section id="apropos" className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <span className="section-num">02 &mdash; A propos</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4">
            Une rencontre peut tout changer<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed max-w-md">
            Pixels est ne a Montreal d&apos;une envie simple : rassembler les talents et creer ensemble.
          </p>
          <p className="text-[var(--text-muted)] mt-4 leading-relaxed max-w-md">
            De la musique aux images, des idees aux emotions. Tout commence par une rencontre.
          </p>
        </div>
        <div className="relative min-h-[400px] md:min-h-0">
          <Image src="/images/event-6.jpg" alt="Pixels community" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* ── 03 EXPERIENCES ── */}
      <section className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="relative min-h-[400px] md:min-h-0 order-2 md:order-1">
          <Image src="/images/event-3.jpg" alt="Pixels experience" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="p-10 md:p-16 flex flex-col justify-center order-1 md:order-2">
          <span className="section-num">03 &mdash; Experiences</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4">
            Des experiences sur mesure<span className="text-[var(--primary)]">.</span>
          </h2>
          <ul className="mt-8 space-y-3 text-[15px]">
            {['Concerts & showcases', 'Evenements corporatifs', 'Mariages & celebrations', 'Festivals & evenements publics', 'Projets speciaux'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[var(--text-muted)] mt-6 text-sm leading-relaxed max-w-md">
            Chaque projet est unique. Notre approche aussi.
          </p>
        </div>
      </section>

      {/* ── 04 ARTISTES ── */}
      <section id="artistes" className="grid md:grid-cols-3 border-b border-[var(--border)]">
        <div className="p-10 md:p-12 flex flex-col justify-between">
          <div>
            <span className="section-num">04 &mdash; Artistes</span>
            <h2 className="editorial-heading text-3xl md:text-4xl mt-4">
              Un collectif de talents<span className="text-[var(--primary)]">.</span>
            </h2>
            <p className="text-[var(--text-muted)] mt-4 text-sm leading-relaxed">
              Musiciens, producteurs, realisateurs, techniciens, createurs.
              Des profils varies, une meme passion.
            </p>
          </div>
          <Link href="/register?role=artist" className="inline-flex items-center gap-2 text-sm mt-8 hover:gap-3 transition-all">
            Decouvrir les artistes
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        <div className="md:col-span-2 grid grid-cols-3 gap-1 p-1">
          {[2, 4, 5, 7, 1, 3].map((n, i) => (
            <div key={i} className="relative aspect-square">
              <Image src={`/images/event-${n}.jpg`} alt={`Artiste ${i+1}`} fill className="object-cover" sizes="(max-width: 768px) 33vw, 22vw" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 PROJETS ── */}
      <section id="projets" className="grid md:grid-cols-3 border-b border-[var(--border)]">
        <div className="p-10 md:p-12 flex flex-col justify-between">
          <div>
            <span className="section-num">05 &mdash; Projets</span>
            <h2 className="editorial-heading text-3xl md:text-4xl mt-4">
              Nos projets en images<span className="text-[var(--primary)]">.</span>
            </h2>
          </div>
          <a href="#galerie" className="inline-flex items-center gap-2 text-sm mt-8 hover:gap-3 transition-all">
            Voir tous les projets
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-1 p-1">
          {[6, 3, 1, 5].map((n, i) => (
            <div key={i} className="relative aspect-[4/3]">
              <Image src={`/images/event-${n}.jpg`} alt={`Projet ${i+1}`} fill className="object-cover hover:scale-[1.02] transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 06 COMMUNAUTE ── */}
      <section id="communaute" className="grid md:grid-cols-3 border-b border-[var(--border)]">
        <div className="md:col-span-2 p-10 md:p-16 flex flex-col justify-center">
          <span className="section-num">06 &mdash; Communaute</span>
          <h2 className="editorial-heading text-3xl md:text-5xl mt-4">
            Montreal nous inspire<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed max-w-lg">
            Un reseau qui grandit, des connexions qui durent.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {['HEC Montreal', 'Polytechnique', 'McGill', 'Montreal', 'Laval'].map((uni) => (
              <span key={uni} className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition cursor-default">
                {uni}
              </span>
            ))}
          </div>
        </div>
        <div className="relative min-h-[300px]">
          <Image src="/images/event-7.jpg" alt="Communaute Pixels" fill className="object-cover" sizes="33vw" />
        </div>
      </section>

      {/* ── 07 IMPACT (Stats) ── */}
      <section className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="p-10 md:p-16">
          <span className="section-num">07 &mdash; Impact</span>
          <div className="mt-8 space-y-8">
            {[
              { value: '80+', label: 'artistes' },
              { value: '150+', label: 'projets realises' },
              { value: '10K+', label: 'personnes touchees' },
              { value: '5', label: 'universites' },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-6">
                <span className="editorial-heading text-4xl md:text-5xl text-[var(--dark)] min-w-[120px]">{s.value}</span>
                <span className="text-[var(--text-muted)] text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[400px]">
          <Image src="/images/event-4.jpg" alt="Impact Pixels" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* ── 08 JOURNAL ── */}
      <section className="grid md:grid-cols-3 border-b border-[var(--border)]">
        <div className="p-10 md:p-12 flex flex-col justify-between">
          <div>
            <span className="section-num">08 &mdash; Journal</span>
            <h2 className="editorial-heading text-3xl md:text-4xl mt-4">
              Histoires, rencontres, inspirations<span className="text-[var(--primary)]">.</span>
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm mt-8 hover:gap-3 transition-all">
            Lire le journal
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
        <div className="md:col-span-2 p-6 md:p-10">
          <div className="space-y-6">
            {[
              { date: '12.04.2026', title: 'Retour sur notre dernier Music Monday', img: 2 },
              { date: '28.03.2026', title: '5 questions a Oscar Anton', img: 5 },
              { date: '15.03.2026', title: 'Creer du lien a travers la musique', img: 7 },
            ].map((article) => (
              <div key={article.title} className="flex gap-4 items-start group cursor-pointer">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={`/images/event-${article.img}.jpg`} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="80px" />
                </div>
                <div>
                  <span className="text-xs text-[var(--text-light)]">{article.date}</span>
                  <h3 className="font-semibold text-[15px] mt-1 group-hover:text-[var(--primary)] transition">{article.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 09 REJOINDRE ── */}
      <section className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <span className="section-num">09 &mdash; Rejoindre Pixels</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4">
            Rejoins l&apos;aventure<span className="text-[var(--primary)]">.</span>
          </h2>
          <ul className="mt-8 space-y-2 text-sm text-[var(--text-muted)]">
            <li>Artistes</li>
            <li>Benevoles</li>
            <li>Partenaires</li>
          </ul>
          <Link href="/register" className="inline-flex items-center gap-2 text-sm mt-8 hover:gap-3 transition-all font-medium">
            En savoir plus
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
        <div className="relative min-h-[400px]">
          <Image src="/images/event-2.jpg" alt="Rejoindre Pixels" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* ── 10 CONTACT ── */}
      <section id="contact" className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="p-10 md:p-16">
          <span className="section-num">10 &mdash; Contact</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4">
            Discutons de votre projet<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="mt-8 space-y-2 text-sm text-[var(--text-muted)]">
            <p>hello@pixels-montreal.com</p>
            <p>514 123-4567</p>
            <p>Montreal, Canada</p>
          </div>
        </div>
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Nom" className="w-full border-b border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--dark)] transition placeholder:text-[var(--text-light)]" />
            <input type="email" placeholder="Courriel" className="w-full border-b border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--dark)] transition placeholder:text-[var(--text-light)]" />
            <input type="text" placeholder="Sujet" className="w-full border-b border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--dark)] transition placeholder:text-[var(--text-light)]" />
            <textarea placeholder="Votre message" rows={3} className="w-full border-b border-[var(--border)] py-3 text-sm bg-transparent focus:outline-none focus:border-[var(--dark)] transition resize-none placeholder:text-[var(--text-light)]" />
            <button type="submit" className="bg-[var(--dark)] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[var(--dark)]/90 transition mt-4">
              Envoyer
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--dark)] text-white py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex justify-center mb-12">
            <span className="pixels-logo text-2xl text-white">pixels</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[13px]">
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Projets</h4>
              <ul className="space-y-2 text-white/40">
                <li>Tous les projets</li>
                <li>Concerts</li>
                <li>Evenements</li>
                <li>Films & contenus</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Artistes</h4>
              <ul className="space-y-2 text-white/40">
                <li>Musiciens</li>
                <li>Createurs</li>
                <li>Equipe technique</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Communaute</h4>
              <ul className="space-y-2 text-white/40">
                <li>Universites</li>
                <li>Partenaires</li>
                <li>Benevoles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">A propos</h4>
              <ul className="space-y-2 text-white/40">
                <li>Notre histoire</li>
                <li>Notre mission</li>
                <li>Impact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Contact</h4>
              <ul className="space-y-2 text-white/40">
                <li>Parlons de votre projet</li>
                <li>Travailler avec nous</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border-dark)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">&copy; 2026 Pixels</p>
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
