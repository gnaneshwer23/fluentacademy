import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import {
  GraduationCap,
  Users,
  Heart,
  Building2,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fluent — Learning Intelligence Platform for Schools" },
      {
        name: "description",
        content:
          "Connecting ambitious schools and families with learning intelligence — measurable fluency, expert faculty, and real-time dashboards.",
      },
      { property: "og:title", content: "Fluent — School Transformation Platform" },
      {
        property: "og:description",
        content:
          "How can we help? Partner as a school or enrol as a family. One platform for teachers, scholars, parents, and leaders.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="page-shell">
      <FontLink />
      <Nav />
      <Hero />
      <HowCanWeHelp />
      <TrustStrip />
      <FluentFor />
      <Stakeholders />
      <Journey />
      <Platform />
      <Testimonials />
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
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

function Nav() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="site-header" className="site-header-connectd">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Fluent<span className="text-primary">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#help" className="text-muted-foreground hover:text-primary">
            How we help
          </a>
          <a href="#offerings" className="text-muted-foreground hover:text-primary">
            Programmes
          </a>
          <a href="#platform" className="text-muted-foreground hover:text-primary">
            Platform
          </a>
          <Link to="/login" className="text-muted-foreground hover:text-primary">
            Sign in
          </Link>
        </nav>
        <Link to="/book-demo" className="btn-connectd btn-connectd-sm">
          Book a demo
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-connectd text-center">
      <div className="hero-blob hero-blob-1" aria-hidden />
      <div className="hero-blob hero-blob-2" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-6 py-24 md:py-32">
        <p className="pill mx-auto">School transformation & learning intelligence</p>
        <h1 className="mt-6 text-4xl font-bold leading-[1.1] text-balance md:text-6xl">
          Connecting ambitious schools and families with{" "}
          <span className="text-primary">learning intelligence.</span>
        </h1>
        <p className="section-lead mx-auto mt-6">
          Knowledge drives growth. With British-trained faculty, AI-assisted teaching, and
          real-time dashboards, you get the insight and support to achieve your ambitions.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/book-demo" className="btn-connectd">
            Book a demo
          </Link>
          <a href="#help" className="btn-connectd-outline">
            See how we help
          </a>
        </div>
      </div>
    </section>
  );
}

function HowCanWeHelp() {
  return (
    <section id="help" className="section-muted py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl">How can we help?</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="help-card-school card-connectd rounded-2xl p-8 md:p-10">
            <p className="help-kicker text-primary">Transform your institution.</p>
            <h3 className="text-2xl font-bold md:text-[1.65rem]">
              Partner with Fluent as a school
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Your teachers need time back. By connecting with Fluent, you embed CPD, AI
              co-pilots, and school-wide intelligence — from pilot cohort to full rollout.
            </p>
            <Link to="/book-demo" className="text-link">
              School programmes <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
          <article className="help-card-family card-connectd rounded-2xl p-8 md:p-10">
            <p className="help-kicker text-[#b8860b]">Support your scholar at home.</p>
            <h3 className="text-2xl font-bold md:text-[1.65rem]">Enrol with Fluent as a family</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Scholar Studio and the Guardian Portal give honest progress and home strategies —
              plus optional live faculty when you want human expertise.
            </p>
            <Link to="/contact" className="text-link">
              Family programmes <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const stats = [
    { n: "10,000+", l: "Learning sessions" },
    { n: "50%+", l: "Less admin time" },
    { n: "24/7", l: "AI study support" },
    { n: "4", l: "Connected portals" },
    { n: "CBSE", l: "ICSE aligned" },
  ];
  return (
    <div className="stats-dark py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="text-2xl font-bold md:text-3xl">{s.n}</div>
            <div className="mt-1 text-sm font-medium text-white/65">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FluentFor() {
  const offerings = [
    {
      icon: Users,
      title: "Teacher excellence",
      subtitle: "CPD & AI co-pilot",
      body: "Embedded professional development and an AI lesson co-pilot that plans, differentiates, and marks — so teachers lead every classroom with less admin.",
      href: "/book-demo",
      cta: "For schools",
    },
    {
      icon: GraduationCap,
      title: "Scholar fluency",
      subtitle: "Studio & mastery",
      body: "Concept-level practice, confidence building, and a Mastery Ledger — personalised paths with an AI tutor that hints, never gives answers away.",
      href: "/contact",
      cta: "For families",
    },
    {
      icon: BarChart3,
      title: "School intelligence",
      subtitle: "Leadership dashboards",
      body: "Real-time cohort analytics, predictive risk signals, and leadership reports — the first honest view of learning across your institution.",
      href: "/book-demo",
      cta: "See dashboards",
    },
  ];

  return (
    <section id="offerings" className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow text-center">Fluent for schools & families</p>
        <h2 className="mt-3 text-center text-3xl font-bold md:text-4xl">
          Build fluency. Drive decisions.
        </h2>
        <p className="section-lead mx-auto mt-4 text-center">
          Three ways to work with Fluent — each designed for measurable outcomes, not
          vanity metrics.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {offerings.map((o) => (
            <article key={o.title} className="offering-card card-connectd">
              <o.icon className="h-8 w-8 text-primary" strokeWidth={1.75} />
              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-primary">
                {o.subtitle}
              </p>
              <h3 className="mt-2 text-xl font-bold">{o.title}</h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                {o.body}
              </p>
              <Link to={o.href} className="text-link mt-6">
                {o.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stakeholders() {
  const roles = [
    {
      icon: Users,
      title: "Teachers",
      desc: "AI lesson plans in 60 seconds, bulk marking approval, and CPD pathways.",
    },
    {
      icon: GraduationCap,
      title: "Scholars",
      desc: "Personalised paths, 24/7 AI tutor, and a digital portfolio from day one.",
    },
    {
      icon: Heart,
      title: "Parents",
      desc: "Weekly dashboards, plain-language updates, and home learning strategies.",
    },
    {
      icon: Building2,
      title: "School leaders",
      desc: "Cohort analytics, early risk detection, and measurable improvement.",
    },
  ];

  return (
    <section className="section-alt py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">One platform</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl">
          Every stakeholder, connected.
        </h2>
        <p className="section-lead mt-4">
          We architect <strong className="text-foreground">academic fluency</strong> — not
          just grades. Understanding, explaining, and applying knowledge with confidence.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <article key={r.title} className="role-card-connectd">
              <r.icon className="h-7 w-7 text-primary" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </article>
          ))}
        </div>
        <aside className="mt-12 flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-center md:justify-between card-connectd">
          <div>
            <p className="eyebrow">Core metric</p>
            <h3 className="mt-2 text-2xl font-bold">Academic Fluency Score</h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              One measure of accuracy, understanding, fluency, and confidence across Science,
              Maths, and English.
            </p>
          </div>
          <Link to="/book-demo" className="btn-connectd shrink-0">
            Learn more
          </Link>
        </aside>
      </div>
    </section>
  );
}

function Journey() {
  const steps = [
    {
      n: "01",
      title: "Discover & onboard",
      desc: "Align on goals, configure curriculum and cohorts, launch dashboards on day one.",
    },
    {
      n: "02",
      title: "Teach & learn",
      desc: "Live faculty, AI lesson planning, differentiated homework, syllabus-grounded support.",
    },
    {
      n: "03",
      title: "Assess & support",
      desc: "Smart marking, parent updates, wellbeing signals, and early intervention.",
    },
  ];
  const benefits = [
    {
      title: "Structured CPD",
      desc: "Self-paced pathways built around the realities of modern teaching — CPD-certified where applicable.",
    },
    {
      title: "Mentor-supported",
      desc: "British-trained faculty who know your context and how to make rollout smooth.",
    },
    {
      title: "Guaranteed visibility",
      desc: "Every cohort gets measurable fluency data from week one — not a black box until term end.",
    },
  ];

  return (
    <section id="how" className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow text-center">Your journey with Fluent</p>
        <h2 className="mt-3 text-center text-3xl font-bold md:text-4xl">
          From onboarding to outcomes
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="step-card-connectd">
              <span className="step-num">{s.n}</span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map((b) => (
            <article key={b.title} className="benefit-card">
              <h4 className="font-bold text-primary">{b.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Platform() {
  const portals = [
    { label: "Teacher", items: ["Lesson planner", "Auto-marking", "Cohort heatmap"] },
    { label: "Scholar", items: ["Practice tray", "AI tutor", "Mastery ledger"] },
    { label: "Guardian", items: ["Weekly report", "Home plays", "Progress Q&A"] },
    { label: "School", items: ["KPI overview", "Risk alerts", "Intervention queue"] },
  ];

  return (
    <section id="platform" className="section-muted py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow text-center">The platform</p>
        <h2 className="mt-3 text-center text-3xl font-bold md:text-4xl">
          Four portals. One picture of learning.
        </h2>
        <p className="section-lead mx-auto mt-4 text-center">
          Calm, contextual intelligence that supports people — never replaces them.
        </p>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {portals.map((p) => (
            <div key={p.label} className="card-connectd rounded-2xl bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-light text-sm font-bold text-primary">
                {p.label[0]}
              </div>
              <h3 className="mt-4 font-bold">{p.label}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {p.items.map((it) => (
                  <li key={it} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link to="/login" className="btn-connectd">
            Sign in to the app <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const SCHOOL_QUOTES = [
  {
    text: "Fluent gave our leadership team the first honest view of learning we've ever had — and it gave our teachers their afternoons back.",
    who: "Head of School · Partner institution",
  },
  {
    text: "The two advisors we connected through the platform are exceptional. The package of support and value we receive is outstanding.",
    who: "Principal · K–12 group",
  },
];

const FAMILY_QUOTES = [
  {
    text: "We finally see what our daughter is actually learning — not just a grade on a report card. The Guardian Portal changed how we support her at home.",
    who: "Parent · Scholar Studio",
  },
  {
    text: "The AI tutor explains concepts the way her teacher would — hints, not answers. Her confidence in Maths has genuinely shifted.",
    who: "Parent · Class 10 ICSE",
  },
];

function Testimonials() {
  const [tab, setTab] = useState<"schools" | "families">("schools");
  const quotes = tab === "schools" ? SCHOOL_QUOTES : FAMILY_QUOTES;

  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Hear from our community</h2>
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setTab("schools")}
            className={`tab-pill ${tab === "schools" ? "tab-pill-active" : "tab-pill-inactive"}`}
          >
            Schools
          </button>
          <button
            type="button"
            onClick={() => setTab("families")}
            className={`tab-pill ${tab === "families" ? "tab-pill-active" : "tab-pill-inactive"}`}
          >
            Families
          </button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {quotes.map((q) => (
            <blockquote key={q.who} className="quote-card">
              <p className="text-lg leading-relaxed text-foreground">&ldquo;{q.text}&rdquo;</p>
              <footer className="mt-5 text-sm font-medium text-muted-foreground">{q.who}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="px-6 pb-24">
      <div className="cta-banner mx-auto max-w-6xl p-10 md:flex md:items-center md:justify-between md:gap-10 md:p-14">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Take the next step
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
            Start your school transformation today.
          </h2>
          <p className="mt-4 text-white/80 leading-relaxed">
            Book a demo and see Fluent tailored to your grade, curriculum, and goals.
          </p>
        </div>
        <div className="mt-8 flex shrink-0 flex-col gap-3 md:mt-0">
          <Link
            to="/book-demo"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-lg hover:bg-white/95"
          >
            Book a demo
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-xl font-bold">
            Fluent<span className="text-primary">.</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            The Learning Intelligence Platform for forward-thinking schools and families.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Company
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/blog" className="hover:text-primary">
                Resources
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Offices
          </div>
          <p className="mt-3 text-sm">London · Bengaluru</p>
          <a
            href="mailto:info@fluent.academy"
            className="mt-2 block text-sm hover:text-primary"
          >
            info@fluent.academy
          </a>
        </div>
      </div>
      <div className="border-t border-border px-6 py-5 text-center text-xs text-muted-foreground">
        © 2026 Fluent · Learning Intelligence Platform
      </div>
    </footer>
  );
}
