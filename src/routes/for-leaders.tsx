import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, TrendingUp, ShieldCheck, Target, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/for-leaders")({
  head: () => ({
    meta: [
      { title: "Fluent for School Leaders — Real Learning Intelligence" },
      { name: "description", content: "Make better decisions with real-time learning intelligence. Fluent gives school leaders a system-wide view of teaching, learning and outcomes." },
      { property: "og:title", content: "Fluent for School Leaders" },
      { property: "og:description", content: "Make better decisions with real-time learning intelligence." },
      { property: "og:url", content: "https://fluentinstitute.lovable.app/for-leaders" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Fluent for School Leaders" },
      { name: "twitter:description", content: "Make better decisions with real-time learning intelligence." },
    ],
    links: [
      { rel: "canonical", href: "https://fluentinstitute.lovable.app/for-leaders" },
    ],
  }),
  component: LeadersPage,
});

function LeadersPage() {
  const kpis = [
    { icon: BarChart3, t: "Live school KPIs", d: "Fluency, engagement, attendance — every grade, every week." },
    { icon: TrendingUp, t: "Predictive insight", d: "See which cohorts are drifting before exams reveal it." },
    { icon: ShieldCheck, t: "Risk monitoring", d: "Early warning on learning gaps, attendance and confidence." },
    { icon: Target, t: "Strategic clarity", d: "From board reports to staffing — decisions backed by data." },
  ];
  return (
    <RolePage
      eyebrow="For School Leaders"
      title="Make better decisions with real learning intelligence."
      subtitle="Fluent turns every classroom signal into a system-wide view — so leaders can act with clarity, not guesswork."
      kpis={kpis}
      proof={[
        "One operating picture across grades and campuses",
        "Board-ready dashboards in one click",
        "Early intervention, not end-of-term surprises",
        "ROI visible by term — workload down, outcomes up",
      ]}
      ctaTitle="See your school in one intelligent view."
    />
  );
}

// shared role-page layout
type Kpi = { icon: React.ComponentType<{ className?: string }>; t: string; d: string };

export function RolePage({
  eyebrow,
  title,
  subtitle,
  kpis,
  proof,
  ctaTitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  kpis: Kpi[];
  proof: string[];
  ctaTitle: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg">F</div>
            <div className="font-display text-lg font-semibold">Fluent</div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm md:flex">
            <Link to="/for-leaders" className="hover:text-accent" activeProps={{ className: "text-accent font-semibold" }}>Leaders</Link>
            <Link to="/for-teachers" className="hover:text-accent" activeProps={{ className: "text-accent font-semibold" }}>Teachers</Link>
            <Link to="/for-parents" className="hover:text-accent" activeProps={{ className: "text-accent font-semibold" }}>Parents</Link>
            <Link to="/contact" className="hover:text-accent">Contact</Link>
          </nav>
          <Link to="/book-demo" className="btn-gold rounded-full px-5 py-2 text-sm font-semibold">Book a Demo</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-card px-4 py-1.5 text-xs uppercase tracking-[0.2em]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.04] md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{subtitle}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/book-demo" className="btn-ink rounded-full px-7 py-3.5 text-sm font-semibold">Book a Demo →</Link>
          <Link to="/contact" className="rounded-full border border-ink px-7 py-3.5 text-sm font-semibold hover:bg-ink hover:text-cream transition">Talk to us</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.t} className="card-ink rounded-2xl bg-card p-6">
              <k.icon className="h-7 w-7 text-accent-foreground" />
              <div className="mt-4 font-display text-xl">{k.t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{k.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">What you'll feel</p>
            <h2 className="mt-4 font-display text-4xl font-semibold md:text-5xl">Clarity, not noise.</h2>
          </div>
          <ul className="md:col-span-7 space-y-4">
            {proof.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                <span className="text-lg">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-ink bg-card p-10 md:p-16">
          <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">
            {ctaTitle}
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/book-demo" className="btn-ink rounded-full px-7 py-3.5 text-sm font-semibold inline-flex items-center gap-2">
              Book a Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="rounded-full border border-ink px-7 py-3.5 text-sm font-semibold hover:bg-ink hover:text-cream transition">
              Speak to our team
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/15 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-10 text-center text-xs text-muted-foreground">
          © 2026 Fluent · Learning Intelligence Platform. London · Bengaluru
        </div>
      </footer>
    </div>
  );
}
