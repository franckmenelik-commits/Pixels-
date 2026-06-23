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
            <a href="#vision" className="hover:text-[var(--dark)] transition">Vision</a>
            <a href="#artistes" className="hover:text-[var(--dark)] transition">Artistes</a>
            <a href="#communaute" className="hover:text-[var(--dark)] transition">Communaut&eacute;</a>
            <a href="#impact" className="hover:text-[var(--dark)] transition">Impact</a>
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
          <p className="tag-label text-white/50 mb-6">Incubateur culturel &bull; Montr&eacute;al</p>
          <h1 className="editorial-heading text-6xl md:text-8xl lg:text-9xl text-white leading-[0.95]">
            Cr&eacute;er des ponts<br className="hidden md:block" />
            humains &agrave; travers<br className="hidden md:block" />
            l&rsquo;art vivant<span className="text-[var(--primary)]">.</span>
          </h1>
          <p className="text-white/60 mt-8 max-w-xl text-lg leading-relaxed">
            Les gens n&rsquo;ont pas toujours besoin qu&rsquo;on cr&eacute;e la musique pour eux.
            Ils ont parfois simplement besoin qu&rsquo;on cr&eacute;e les conditions pour qu&rsquo;elle apparaisse.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <Link href="/register" className="bg-[var(--primary)] text-white px-8 py-4 rounded-full text-[15px] font-medium hover:brightness-110 transition inline-flex items-center gap-2">
              Rejoindre la communaut&eacute;
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <a href="#vision" className="text-white/50 text-sm hover:text-white transition hidden sm:block">D&eacute;couvrir notre histoire &darr;</a>
          </div>
        </div>
      </section>

      {/* ── 02 VISION ── */}
      <section id="vision" className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <span className="section-num">02 &mdash; Vision</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4">
            Un pixel seul est presque invisible<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed max-w-md">
            Le nom vient d&rsquo;une conviction : nous sommes tous des &ecirc;tres remarquablement lumineux, chacun avec une couleur, un ton, une histoire diff&eacute;rente.
          </p>
          <p className="text-[var(--text)] mt-4 leading-relaxed max-w-md font-medium">
            Un pixel seul, presque invisible. Assembl&eacute;s, ils cr&eacute;ent une image plus grande que la somme de leurs parties.
          </p>
        </div>
        <div className="relative min-h-[400px] md:min-h-0">
          <Image src="/images/event-6.jpg" alt="Pixels community" fill className="object-cover" sizes="50vw" />
        </div>
      </section>

      {/* ── 03 PROBLÈME / SOLUTION ── */}
      <section className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="relative min-h-[400px] md:min-h-0 order-2 md:order-1">
          <Image src="/images/event-3.jpg" alt="Pixels experience" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="p-10 md:p-16 flex flex-col justify-center order-1 md:order-2">
          <span className="section-num">03 &mdash; Notre r&ocirc;le</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4">
            Le talent existe. Les occasions existent. La coordination manque<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm mb-2">Avant Pixels</h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li className="flex items-start gap-2"><span className="text-[var(--text-light)] mt-0.5">&mdash;</span>Talent isol&eacute;</li>
                <li className="flex items-start gap-2"><span className="text-[var(--text-light)] mt-0.5">&mdash;</span>R&eacute;seau limit&eacute;</li>
                <li className="flex items-start gap-2"><span className="text-[var(--text-light)] mt-0.5">&mdash;</span>Organisation improvis&eacute;e</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Apr&egrave;s Pixels</h3>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li className="flex items-start gap-2"><span className="text-[var(--primary)] mt-0.5">&bull;</span>Communaut&eacute; artistique</li>
                <li className="flex items-start gap-2"><span className="text-[var(--primary)] mt-0.5">&bull;</span>R&eacute;seau interuniversitaire</li>
                <li className="flex items-start gap-2"><span className="text-[var(--primary)] mt-0.5">&bull;</span>Structure durable</li>
              </ul>
            </div>
          </div>
          <p className="text-[var(--text-muted)] mt-6 text-sm leading-relaxed max-w-md italic">
            &laquo; Les plateformes donnent acc&egrave;s &agrave; des musiciens. Nous donnons acc&egrave;s &agrave; la tranquillit&eacute; d&rsquo;esprit. &raquo;
          </p>
        </div>
      </section>

      {/* ── 04 ARTISTES ── */}
      <section id="artistes" className="grid md:grid-cols-3 border-b border-[var(--border)]">
        <div className="p-10 md:p-12 flex flex-col justify-between">
          <div>
            <span className="section-num">04 &mdash; Artistes</span>
            <h2 className="editorial-heading text-3xl md:text-4xl mt-4">
              Une mosa&iuml;que de couleurs humaines<span className="text-[var(--primary)]">.</span>
            </h2>
            <p className="text-[var(--text-muted)] mt-4 text-sm leading-relaxed">
              Notre groupe est d&eacute;j&agrave; une mosa&iuml;que : Afrique, Vietnam, Hong Kong, Espagne, France, Qu&eacute;bec. Des profils vari&eacute;s, une m&ecirc;me passion pour l&rsquo;art vivant.
            </p>
          </div>
          <Link href="/register?role=artist" className="inline-flex items-center gap-2 text-sm mt-8 hover:gap-3 transition-all">
            Devenir artiste Pixels
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

      {/* ── 05 EXPÉRIENCES ── */}
      <section className="grid md:grid-cols-3 border-b border-[var(--border)]">
        <div className="p-10 md:p-12 flex flex-col justify-between">
          <div>
            <span className="section-num">05 &mdash; Exp&eacute;riences</span>
            <h2 className="editorial-heading text-3xl md:text-4xl mt-4">
              Une pr&eacute;sence sur tout le parcours artistique<span className="text-[var(--primary)]">.</span>
            </h2>
          </div>
          <ul className="mt-8 space-y-3 text-[15px]">
            {[
              'Festivals de cinéma & galas',
              'Événements universitaires',
              'Mariages & lancements',
              'Créations médiatiques & podcasts',
              'Jam sessions ouvertes',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-1 p-1">
          {[6, 3, 1, 5].map((n, i) => (
            <div key={i} className="relative aspect-[4/3]">
              <Image src={`/images/event-${n}.jpg`} alt={`Projet ${i+1}`} fill className="object-cover hover:scale-[1.02] transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 06 COMMUNAUTÉ ── */}
      <section id="communaute" className="grid md:grid-cols-3 border-b border-[var(--border)]">
        <div className="md:col-span-2 p-10 md:p-16 flex flex-col justify-center">
          <span className="section-num">06 &mdash; Communaut&eacute;</span>
          <h2 className="editorial-heading text-3xl md:text-5xl mt-4">
            Montr&eacute;al comme terrain de jeu culturel<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed max-w-lg">
            Montr&eacute;al est une ville de festivals, de rencontres, de diversit&eacute; et de cr&eacute;ation : l&rsquo;endroit id&eacute;al pour prouver qu&rsquo;une infrastructure culturelle peut &ecirc;tre &agrave; la fois professionnelle, humaine et profond&eacute;ment vivante.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {['HEC Montréal', 'McGill', 'Polytechnique', 'UdeM', 'Concordia'].map((uni) => (
              <span key={uni} className="px-4 py-2 rounded-full border border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition cursor-default">
                {uni}
              </span>
            ))}
          </div>
          <p className="text-xs text-[var(--text-light)] mt-6 italic max-w-md">
            &laquo; Pixels n&rsquo;est pas un groupe de musique. C&rsquo;est un lieu pr&eacute;serv&eacute; ; un endroit o&ugrave; les gens cr&eacute;ent sans performance sociale, sans algorithme, sans masque. &raquo;
          </p>
        </div>
        <div className="relative min-h-[300px]">
          <Image src="/images/event-7.jpg" alt="Communaute Pixels" fill className="object-cover" sizes="33vw" />
        </div>
      </section>

      {/* ── 07 IMPACT ── */}
      <section id="impact" className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="p-10 md:p-16">
          <span className="section-num">07 &mdash; Impact</span>
          <h2 className="editorial-heading text-3xl md:text-4xl mt-4 mb-2">
            Des rencontres, des prestations, une communaut&eacute;<span className="text-[var(--primary)]">.</span>
          </h2>
          <div className="mt-8 space-y-8">
            {[
              { value: '80+', label: 'artistes mobilisés' },
              { value: '10K+', label: 'personnes rejointes' },
              { value: '5', label: 'universités représentées' },
              { value: '4', label: 'jam sessions ouvertes' },
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

      {/* ── 08 PHILOSOPHIE ── */}
      <section className="bg-[var(--dark)] text-white border-b border-[var(--border-dark)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <span className="section-num text-white/30">08 &mdash; Philosophie</span>
          <div className="grid md:grid-cols-3 gap-12 mt-10">
            <div>
              <span className="text-[var(--primary)] editorial-heading text-5xl">1</span>
              <h3 className="font-semibold text-lg mt-4 mb-3">L&rsquo;humain au centre</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Sans humains, l&rsquo;art vivant n&rsquo;a plus de raison d&rsquo;&ecirc;tre. Ce qui distingue l&rsquo;art de la machine, c&rsquo;est le contact humain.
              </p>
            </div>
            <div>
              <span className="text-[var(--primary)] editorial-heading text-5xl">2</span>
              <h3 className="font-semibold text-lg mt-4 mb-3">La structure prot&egrave;ge</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                La magie doit rester sur sc&egrave;ne. Le chaos, lui, doit &ecirc;tre g&eacute;r&eacute; en coulisses. La structure prot&egrave;ge les artistes, les organisateurs et les partenaires.
              </p>
            </div>
            <div>
              <span className="text-[var(--primary)] editorial-heading text-5xl">3</span>
              <h3 className="font-semibold text-lg mt-4 mb-3">La transmission compte</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Le v&eacute;ritable impact se mesure &agrave; ce qu&rsquo;on rend possible pour les autres &mdash; cr&eacute;er des terrains de jeu, pas seulement des &eacute;v&eacute;nements.
              </p>
            </div>
          </div>
          <p className="text-white/30 text-sm mt-16 max-w-2xl italic">
            &laquo; Les projets sinc&egrave;res ne commencent pas avec un business plan parfait. Ils commencent avec une envie suffisamment forte pour qu&rsquo;on accepte de ne pas tout comprendre tout de suite. &raquo;
          </p>
        </div>
      </section>

      {/* ── 09 REJOINDRE ── */}
      <section className="grid md:grid-cols-2 border-b border-[var(--border)]">
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <span className="section-num">09 &mdash; Construire des &eacute;chelles</span>
          <h2 className="editorial-heading text-4xl md:text-5xl mt-4">
            Je voudrais construire un monde o&ugrave; chacun se fait la courte &eacute;chelle<span className="text-[var(--primary)]">.</span>
          </h2>
          <p className="text-[var(--text-muted)] mt-6 leading-relaxed max-w-md">
            Construire des &eacute;chelles pour que des artistes puissent monter, que des organisateurs cr&eacute;ent autrement, que des &eacute;tudiants se rencontrent, et que des talents isol&eacute;s forment une image ensemble.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <Link href="/register?role=artist" className="text-center p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition group">
              <p className="font-semibold text-sm group-hover:text-[var(--primary)] transition">Artistes</p>
              <p className="text-xs text-[var(--text-light)] mt-1">Premi&egrave;res sc&egrave;nes, r&eacute;seau, collaborations</p>
            </Link>
            <Link href="/register?role=organizer" className="text-center p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition group">
              <p className="font-semibold text-sm group-hover:text-[var(--primary)] transition">Organisateurs</p>
              <p className="text-xs text-[var(--text-light)] mt-1">Fiabilit&eacute;, s&eacute;r&eacute;nit&eacute;, exp&eacute;riences vivantes</p>
            </Link>
            <Link href="/register" className="text-center p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition group">
              <p className="font-semibold text-sm group-hover:text-[var(--primary)] transition">Partenaires</p>
              <p className="text-xs text-[var(--text-light)] mt-1">Acc&egrave;s &agrave; l&rsquo;art vivant &agrave; Montr&eacute;al</p>
            </Link>
          </div>
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
          <p className="text-[var(--text-muted)] mt-4 text-sm leading-relaxed max-w-sm">
            Plus de musique, moins de stress. Pixels orchestre la musique de bout en bout.
          </p>
          <div className="mt-8 space-y-2 text-sm text-[var(--text-muted)]">
            <p>hello@pixels-montreal.com</p>
            <p>Montr&eacute;al, Canada</p>
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
          <div className="text-center mb-16">
            <span className="pixels-logo text-3xl text-white">pixels</span>
            <p className="text-white/30 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              Tant qu&rsquo;&agrave; traverser quelque chose de difficile, autant essayer d&rsquo;en faire quelque chose de beau, de mieux, que ce que la n&eacute;gation vaut.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[13px]">
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Exp&eacute;riences</h4>
              <ul className="space-y-2 text-white/40">
                <li>Concerts & showcases</li>
                <li>&Eacute;v&eacute;nements universitaires</li>
                <li>Mariages & lancements</li>
                <li>Festivals & galas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Artistes</h4>
              <ul className="space-y-2 text-white/40">
                <li>Rejoindre le r&eacute;seau</li>
                <li>Jam sessions</li>
                <li>Music Mondays</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">Communaut&eacute;</h4>
              <ul className="space-y-2 text-white/40">
                <li>HEC &bull; McGill &bull; Poly</li>
                <li>UdeM &bull; Concordia</li>
                <li>Partenaires</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white/80">&Agrave; propos</h4>
              <ul className="space-y-2 text-white/40">
                <li>Notre histoire</li>
                <li>Forces Avenir 2026</li>
                <li>Impact</li>
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
          <div className="border-t border-[var(--border-dark)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
