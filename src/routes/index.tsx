import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-student.jpg";
import confidenceImg from "@/assets/confidence.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fluent — From Low Confidence to High Performance" },
      {
        name: "description",
        content:
          "British teaching methods, AI-powered practice and weekly accountability — building confident, articulate learners across India.",
      },
      { property: "og:title", content: "Fluent — Confidence-First Learning" },
      {
        property: "og:description",
        content:
          "Concept-based learning with UK-trained educators. Watch your child speak, think and perform with confidence.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <FontLink />
      <Nav />
      <Hero />
      <Marquee />
      <Problem />
      <Solution />
      <USP />
      <Flow />
      <Confidence />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function FontLink() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg">
            F
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Fluent</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Accountable Hindustan
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#programs" className="hover:text-accent">Programs</a>
          <a href="#how" className="hover:text-accent">How it works</a>
          <a href="#results" className="hover:text-accent">Results</a>
          <a href="#pricing" className="hover:text-accent">Pricing</a>
        </nav>
        <a href="#cta" className="btn-gold rounded-full px-5 py-2 text-sm font-semibold">
          Book Free Demo
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-card px-4 py-1.5 text-xs uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            British curriculum · AI assisted
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.02] text-balance md:text-7xl lg:text-8xl">
            From low confidence{" "}
            <em className="not-italic gold-underline">to high</em>{" "}
            <span className="italic font-normal">performance.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground md:text-xl">
            Fluent blends British teaching methods with AI-driven practice and
            weekly accountability — so your child learns to think, speak and perform
            with quiet, lasting confidence.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#cta" className="btn-ink rounded-full px-7 py-3.5 text-sm font-semibold">
              Book Free Demo →
            </a>
            <a href="#how" className="rounded-full px-6 py-3.5 text-sm font-semibold underline underline-offset-4 decoration-accent decoration-2">
              Watch how it works
            </a>
          </div>
          <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-accent to-primary" />
              ))}
            </div>
            <p>2,400+ parents trust Fluent across India.</p>
          </div>
        </div>

        <div className="relative md:col-span-5">
          <div className="absolute -left-6 -top-6 hidden h-full w-full rounded-3xl border border-ink md:block" />
          <div className="relative overflow-hidden rounded-3xl border border-ink bg-card">
            <img
              src={heroImg}
              alt="Confident young student smiling while studying"
              width={1280}
              height={1280}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 max-w-[220px] rounded-2xl bg-primary p-5 text-primary-foreground card-ink">
            <div className="font-display text-3xl">+38%</div>
            <div className="text-xs uppercase tracking-widest opacity-80">
              Avg. marks improvement in 90 days
            </div>
          </div>
          <div className="absolute -right-4 top-8 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground card-ink">
            🇬🇧 UK-trained tutors
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "British Curriculum",
    "AI Doubt Solver",
    "Weekly Parent Reports",
    "Live UK Educators",
    "Concept Mastery",
    "Confidence Coaching",
  ];
  return (
    <div className="border-y border-ink/15 bg-primary py-5 text-primary-foreground">
      <div className="marquee-fade overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 whitespace-nowrap">
          {[...items, ...items, ...items].map((it, i) => (
            <span key={i} className="font-display text-2xl">
              {it} <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

function Problem() {
  const items = [
    { t: "Afraid to answer in class", d: "Knows the answer but won't raise a hand." },
    { t: "Quiet confidence dip", d: "Withdrawn during oral exams or presentations." },
    { t: "Marks have plateaued", d: "Hours of effort, no visible improvement." },
    { t: "Memorises, doesn't understand", d: "Fragile knowledge that breaks under pressure." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.25em] text-accent-foreground/70">
            The quiet problem
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Is your child <em className="italic gold-underline">struggling</em> with confidence?
          </h2>
          <p className="mt-6 text-muted-foreground">
            Most learning systems chase marks. We've found the missing layer beneath
            them — the confidence to think, speak and try.
          </p>
        </div>
        <div className="grid gap-4 md:col-span-7 md:grid-cols-2">
          {items.map((it) => (
            <div key={it.t} className="card-ink rounded-2xl bg-card p-6">
              <div className="font-display text-xl font-semibold">{it.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const items = [
    { t: "Concept Learning", d: "Understand deeply instead of memorising. We teach the why before the what." },
    { t: "AI Companion", d: "Personalised practice and 24/7 doubt-solving tuned to your child's pace." },
    { t: "Confidence Studio", d: "Weekly speaking labs that turn shy learners into clear communicators." },
  ];
  return (
    <section id="programs" className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            A new way of <em className="italic text-accent">learning.</em>
          </h2>
          <p className="max-w-md text-primary-foreground/70">
            Three pillars working together — built by educators trained in the UK,
            delivered for the Indian classroom.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <div
              key={it.t}
              className="group relative overflow-hidden rounded-3xl border border-primary-foreground/15 bg-primary-foreground/5 p-8 transition hover:bg-primary-foreground/10"
            >
              <div className="absolute right-6 top-6 font-display text-5xl opacity-20">
                0{i + 1}
              </div>
              <h3 className="mt-10 font-display text-2xl">{it.t}</h3>
              <p className="mt-3 text-sm text-primary-foreground/70">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function USP() {
  const items = [
    { k: "01", t: "British Teaching Methods", d: "Inquiry-led, interactive lessons that prize understanding over rote." },
    { k: "02", t: "UK-Based Educators", d: "Mentors with global classroom experience — your child learns from them weekly." },
    { k: "03", t: "Weekly Accountability", d: "Transparent dashboards and parent reports. Progress, every Sunday." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="border-t border-ink/20 pt-12">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 className="font-display text-4xl font-semibold leading-tight md:col-span-5 md:text-5xl">
            What makes us <em className="italic">different.</em>
          </h2>
          <div className="md:col-span-7">
            <div className="divide-y divide-ink/15">
              {items.map((it) => (
                <div key={it.k} className="grid grid-cols-[auto_1fr] gap-8 py-8">
                  <div className="font-display text-2xl text-accent">{it.k}</div>
                  <div>
                    <h3 className="font-display text-2xl">{it.t}</h3>
                    <p className="mt-2 text-muted-foreground">{it.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Flow() {
  const steps = [
    { t: "Learn", d: "Concept-first lessons with UK educators." },
    { t: "Practice", d: "AI tutor adapts daily to your child's level." },
    { t: "Test", d: "Weekly assessments — written and oral." },
    { t: "Report", d: "Parents receive a Sunday progress brief." },
  ];
  return (
    <section id="how" className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">How it works</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.t} className="card-ink relative rounded-2xl bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">
                  {i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span className="text-2xl text-accent">→</span>
                )}
              </div>
              <h3 className="mt-6 font-display text-xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Confidence() {
  const points = ["Answer confidently", "Speak clearly", "Present ideas", "Think independently"];
  return (
    <section id="results" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <img
            src={confidenceImg}
            alt="Confident students raising hands in classroom"
            width={1280}
            height={1024}
            loading="lazy"
            className="rounded-3xl border border-ink object-cover"
          />
          <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-accent px-5 py-4 text-accent-foreground card-ink md:block">
            <div className="font-display text-2xl">94%</div>
            <div className="text-xs uppercase tracking-widest">Speak up in class</div>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">The outcome</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            We build <em className="italic gold-underline">confidence</em> — not just marks.
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-3">
            {points.map((p) => (
              <li key={p} className="rounded-xl border border-ink/15 bg-card px-4 py-3 text-sm font-medium">
                ✓ {p}
              </li>
            ))}
          </ul>
          <blockquote className="mt-10 border-l-4 border-accent pl-5 font-display text-2xl italic leading-snug">
            “Your child won't just learn — they'll speak, present and lead with
            confidence.”
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { q: "My child gained real confidence in just four weeks. He now volunteers in class.", a: "Priya M.", c: "Parent · Mumbai" },
    { q: "Marks improved, but more importantly her thinking is sharper. Worth every rupee.", a: "Rahul K.", c: "Parent · Bengaluru" },
    { q: "Best decision we made for our daughter's education. The Sunday reports are gold.", a: "Anita S.", c: "Parent · Delhi" },
  ];
  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">
          What parents <em className="italic text-accent">say.</em>
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.map((x) => (
            <figure key={x.a} className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/5 p-8">
              <div className="text-accent">★★★★★</div>
              <blockquote className="mt-5 font-display text-xl leading-snug">
                “{x.q}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <div className="font-semibold">{x.a}</div>
                <div className="text-primary-foreground/60">{x.c}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Starter", price: "₹2,999", per: "/month", features: ["2 live classes / week", "AI doubt solver", "Monthly report"], cta: "Start" },
    { name: "Standard", price: "₹3,999", per: "/month", features: ["4 live classes / week", "Confidence studio", "Weekly Sunday report"], cta: "Most chosen", featured: true },
    { name: "Premium", price: "₹6,000+", per: "/month", features: ["1:1 mentor pairing", "Unlimited AI practice", "Parent strategy calls"], cta: "Talk to us" },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-4xl font-semibold md:text-5xl">
          Simple, honest <em className="italic">pricing.</em>
        </h2>
        <p className="max-w-md text-muted-foreground">
          One free demo. Cancel any time. No hidden fees — ever.
        </p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`card-ink rounded-3xl p-8 ${t.featured ? "bg-primary text-primary-foreground" : "bg-card"}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">{t.name}</h3>
              {t.featured && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  Popular
                </span>
              )}
            </div>
            <div className="mt-6 flex items-baseline gap-1">
              <div className="font-display text-5xl">{t.price}</div>
              <div className={t.featured ? "text-primary-foreground/70" : "text-muted-foreground"}>{t.per}</div>
            </div>
            <ul className={`mt-6 space-y-2 text-sm ${t.featured ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
              {t.features.map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
            <a
              href="#cta"
              className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                t.featured ? "bg-accent text-accent-foreground" : "btn-ink"
              }`}
            >
              {t.cta} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="px-6 pb-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-ink bg-accent p-10 md:p-16 grain">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <h2 className="md:col-span-8 font-display text-4xl font-semibold leading-[1.05] text-accent-foreground md:text-6xl">
            Give your child <em className="italic">confidence</em> for life.
          </h2>
          <div className="md:col-span-4">
            <p className="text-accent-foreground/80">
              Book a 30-minute demo this week. We'll assess, advise, and show you the
              path forward — no obligation.
            </p>
            <a href="mailto:futureminds.academy26@gmail.com?subject=Book%20Free%20Demo" className="btn-ink mt-6 inline-flex rounded-full px-7 py-4 text-sm font-semibold">
              Book Free Demo →
            </a>
            <a href="tel:+447553886303" className="mt-3 inline-flex text-sm font-semibold text-accent-foreground underline underline-offset-4">
              Or call 07553 886303
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/15 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">Fluent</div>
          <p className="mt-2 text-sm text-primary-foreground/60">
            An Accountable Hindustan initiative. Building India's most confident
            generation, one child at a time.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-foreground/50">Contact</div>
          <p className="mt-3 text-sm"><a href="mailto:futureminds.academy26@gmail.com" className="hover:text-accent">futureminds.academy26@gmail.com</a></p>
          <p className="text-sm"><a href="tel:+447553886303" className="hover:text-accent">07553 886303</a></p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-foreground/50">Explore</div>
          <ul className="mt-3 space-y-1 text-sm">
            <li><a href="#programs" className="hover:text-accent">Programs</a></li>
            <li><a href="#how" className="hover:text-accent">How it works</a></li>
            <li><a href="#pricing" className="hover:text-accent">Pricing</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 px-6 py-5 text-center text-xs text-primary-foreground/50">
        © 2026 Fluent · Accountable Hindustan. All rights reserved.
      </div>
    </footer>
  );
}
