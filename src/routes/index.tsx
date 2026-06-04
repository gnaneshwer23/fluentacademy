import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  Heart,
  Building2,
  BookOpen,
  Brain,
  BarChart3,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fluent — Learning Intelligence Platform for Schools" },
      {
        name: "description",
        content:
          "Fluent is a School Transformation Platform that makes learning measurable, visible and actionable — for teachers, students, parents and leaders.",
      },
      { property: "og:title", content: "Fluent — School Transformation Platform" },
      {
        property: "og:description",
        content:
          "Improve teaching, build fluency, drive decisions. The unified learning intelligence platform for forward-thinking schools.",
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
      <HowCanWeHelp />
      <TrustStrip />
      <Problem />
      <Solution />
      <HowItWorks />
      <Pillars />
      <ProductPreview />
      <AISection />
      <Impact />
      <TargetSchools />
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Fluent<span className="text-primary">.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#help" className="text-muted-foreground hover:text-primary">How we help</a>
          <a href="#platform" className="text-muted-foreground hover:text-primary">Platform</a>
          <a href="#how" className="text-muted-foreground hover:text-primary">How it works</a>
          <Link to="/blog" className="text-muted-foreground hover:text-primary">Resources</Link>
          <Link to="/login" className="text-muted-foreground hover:text-primary">Sign in</Link>
        </nav>
        <Link to="/book-demo" className="btn-connectd text-sm">
          Book a demo
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden hero-connectd">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <span className="pill">School transformation platform</span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.08] text-balance md:text-6xl">
            Connecting schools and families with{" "}
            <span className="text-primary">learning intelligence.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Fluent makes learning measurable, visible, and actionable — for teachers, scholars,
            parents, and school leaders in one connected platform.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/book-demo" className="btn-connectd">
              Book a demo
            </Link>
            <Link to="/login" className="btn-connectd-outline">
              Sign in to the app
            </Link>
          </div>
        </div>

        <div className="relative md:col-span-5">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lg card-connectd">
            <DashboardMock />
          </div>
          <div className="absolute -bottom-4 -left-4 max-w-[200px] rounded-2xl bg-primary p-5 text-primary-foreground shadow-lg">
            <div className="text-3xl font-bold">+38%</div>
            <div className="text-xs font-medium opacity-90">Avg. fluency growth, term one</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowCanWeHelp() {
  return (
    <section id="help" className="section-muted py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
          How can we help?
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <article className="help-card-school rounded-2xl border border-border p-8 card-connectd">
            <p className="text-sm font-semibold text-primary mb-2">Transform your institution.</p>
            <h3 className="text-2xl font-bold mb-3">Partner with Fluent as a school</h3>
            <p className="text-muted-foreground leading-relaxed">
              AI teaching tools, British faculty, CPD, and a School Intelligence Dashboard — from
              pilot cohort to full-school rollout.
            </p>
            <Link to="/book-demo" className="inline-block mt-6 text-sm font-semibold text-primary hover:underline">
              School programmes →
            </Link>
          </article>
          <article className="help-card-family rounded-2xl border border-border p-8 card-connectd">
            <p className="text-sm font-semibold text-[#c9963a] mb-2">Support your scholar.</p>
            <h3 className="text-2xl font-bold mb-3">Enrol with Fluent as a family</h3>
            <p className="text-muted-foreground leading-relaxed">
              Scholar Studio, Guardian Portal, and optional live faculty — from AI-guided revision
              to mastery cohorts.
            </p>
            <Link to="/contact" className="inline-block mt-6 text-sm font-semibold text-primary hover:underline">
              Family programmes →
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-bold text-sm font-semibold">School Intelligence</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Term 2 · Week 6</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Fluency", v: "82%", t: "up" },
          { l: "Engagement", v: "91%", t: "up" },
          { l: "Workload", v: "−24%", t: "down" },
        ].map((m) => (
          <div key={m.l} className="rounded-xl border border-border/15 bg-background p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
            <div className="mt-1 font-bold text-xl">{m.v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border/15 bg-background p-4">
        <div className="text-xs font-semibold">Year 6 · Confidence</div>
        <div className="mt-3 flex h-24 items-end gap-1.5">
          {[40, 55, 48, 62, 58, 70, 68, 76, 72, 81, 78, 86].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-primary to-accent"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-accent/15 p-3 text-xs">
        <Sparkles className="h-4 w-4 text-accent-foreground" />
        <span><strong>Recommended:</strong> Intervene with 4 students in 7C — fluency dipping.</span>
      </div>
    </div>
  );
}

function TrustStrip() {
  const stats = [
    { n: "4", l: "Connected portals" },
    { n: "50%+", l: "Less admin time" },
    { n: "24/7", l: "AI study support" },
    { n: "CBSE", l: "ICSE aligned" },
  ];
  return (
    <div className="stats-dark py-10">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="text-3xl font-bold">{s.n}</div>
            <div className="text-sm text-white/65 mt-1 font-medium">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Problem() {
  const measured = ["Grades", "Exams", "Completion"];
  const missing = ["Understanding", "Confidence", "Communication", "Critical thinking"];
  const groups = [
    { icon: GraduationCap, t: "Students", d: "Low confidence, fragile understanding, unseen struggles." },
    { icon: Users, t: "Teachers", d: "Heavy workload, limited time to personalise instruction." },
    { icon: Heart, t: "Parents", d: "No visibility into real learning beyond report cards." },
    { icon: Building2, t: "Leaders", d: "Lagging insights, no system-wide intelligence layer." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">The gap</p>
          <h2 className="mt-4 font-bold text-4xl font-semibold leading-tight md:text-5xl">
            Schools are working hard. But learning <em className="italic text-primary underline decoration-primary/40 underline-offset-4">isn't fully visible.</em>
          </h2>
        </div>
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border/15 bg-card p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Schools measure</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {measured.map((m) => (
                <span key={m} className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium">{m}</span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-primary p-6 text-primary-foreground">
            <div className="text-xs uppercase tracking-widest text-accent">But struggle to measure</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {missing.map((m) => (
                <span key={m} className="rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-sm font-medium text-accent">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-4">
        {groups.map((g) => (
          <div key={g.t} className="card-connectd rounded-2xl bg-card p-6">
            <g.icon className="h-7 w-7 text-accent-foreground" />
            <div className="mt-4 font-bold text-xl font-semibold">{g.t}</div>
            <p className="mt-2 text-sm text-muted-foreground">{g.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Solution() {
  const cols = [
    { t: "Improve Teaching", d: "CPD and AI co-pilot tools that elevate every classroom." },
    { t: "Build Fluency", d: "Concept-level mastery, confidence and communication — measured." },
    { t: "Drive Decisions", d: "Real-time analytics that turn data into school-wide action." },
  ];
  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Introducing Fluent</p>
        <h2 className="mt-4 max-w-3xl font-bold text-4xl font-semibold leading-tight md:text-6xl">
          The Learning Intelligence <em className="italic text-accent">Platform.</em>
        </h2>
        <p className="mt-6 max-w-2xl text-primary-foreground/70 text-lg">
          Fluent makes learning measurable, visible and actionable — across teachers, students, parents and leaders.
        </p>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-primary-foreground/20 bg-primary-foreground/10 md:grid-cols-3">
          {cols.map((c, i) => (
            <div key={c.t} className="bg-primary p-8">
              <div className="font-bold text-5xl text-accent/40">0{i + 1}</div>
              <h3 className="mt-6 font-bold text-2xl">{c.t}</h3>
              <p className="mt-3 text-sm text-primary-foreground/70">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { t: "Teacher", d: "Plans and delivers." },
    { t: "Learning", d: "Captured in motion." },
    { t: "Data", d: "Structured signals." },
    { t: "Intelligence", d: "Pattern recognition." },
    { t: "Intervention", d: "Right action, right time." },
    { t: "Outcomes", d: "Measurable growth." },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">The system</p>
      <h2 className="mt-4 max-w-3xl font-bold text-4xl font-semibold leading-tight md:text-5xl">
        How Fluent transforms your <em className="italic">school.</em>
      </h2>
      <div className="mt-14 grid gap-3 md:grid-cols-6">
        {steps.map((s, i) => (
          <div key={s.t} className="relative">
            <div className="card-connectd rounded-2xl bg-card p-5">
              <div className="text-xs font-mono text-accent-foreground">0{i + 1}</div>
              <div className="mt-3 font-bold text-lg">{s.t}</div>
              <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="absolute -right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-accent md:block" />
            )}
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-2xl text-muted-foreground">
        We focus on the learning process — not just the outcome. Each step is instrumented, so the next is informed.
      </p>
    </section>
  );
}

function Pillars() {
  const pillars = [
    {
      icon: Users,
      t: "Teacher Excellence",
      items: ["Embedded CPD", "AI lesson co-pilot", "Workload reduction"],
      tone: "card",
    },
    {
      icon: GraduationCap,
      t: "Student Fluency",
      items: ["Concept accuracy", "Confidence building", "Articulation"],
      tone: "accent",
    },
    {
      icon: Heart,
      t: "Parent Partnership",
      items: ["Weekly dashboards", "Honest updates", "Home strategies"],
      tone: "accent",
    },
    {
      icon: BarChart3,
      t: "School Intelligence",
      items: ["School-wide analytics", "Predictive insights", "Leadership reports"],
      tone: "card",
    },
  ];
  return (
    <section id="pillars" className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">The framework</p>
        <h2 className="mt-4 font-bold text-4xl font-semibold leading-tight md:text-5xl">
          The four pillars of <em className="italic text-primary underline decoration-primary/40 underline-offset-4">Fluent.</em>
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pillars.map((p) => (
            <div
              key={p.t}
              className={`card-connectd rounded-3xl p-8 ${p.tone === "accent" ? "bg-accent text-accent-foreground" : "bg-card"}`}
            >
              <p.icon className="h-8 w-8" />
              <h3 className="mt-6 font-bold text-2xl font-semibold">{p.t}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {p.items.map((it) => (
                  <li key={it} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  const tabs = [
    { id: "teacher", label: "Teacher", desc: "Plan faster, mark smarter, and see every learner in one view.", mock: ["Lesson Planner", "Auto-marking", "Cohort heatmap"] },
    { id: "student", label: "Student", desc: "Personalised practice and on-demand explanations that build fluency.", mock: ["Practice tray", "Confidence meter", "AI tutor"] },
    { id: "parent", label: "Parent", desc: "Honest weekly updates and clear next-steps for home support.", mock: ["Sunday report", "Strengths & gaps", "Home plays"] },
    { id: "school", label: "School", desc: "Live intelligence for principals — every grade, every cohort, every week.", mock: ["KPI overview", "Attendance risk", "Intervention queue"] },
    { id: "ai", label: "AI", desc: "Calm, contextual AI that supports people — not replaces them.", mock: ["Lesson suggestions", "Doubt-solver", "Pattern alerts"] },
  ];
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;
  return (
    <section id="platform" className="mx-auto max-w-7xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">The product</p>
      <h2 className="mt-4 font-bold text-4xl font-semibold leading-tight md:text-5xl">
        A unified platform for your <em className="italic">whole school.</em>
      </h2>
      <div className="mt-10 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              active === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/20 bg-card hover:border-border"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-12">
        <div className="card-connectd md:col-span-8 rounded-3xl bg-card p-6">
          <div className="flex items-center gap-2 border-b border-border/10 pb-3">
            <span className="h-3 w-3 rounded-full bg-destructive/60" />
            <span className="h-3 w-3 rounded-full bg-accent" />
            <span className="h-3 w-3 rounded-full bg-primary/30" />
            <span className="ml-3 text-xs text-muted-foreground">fluent.app / {current.label.toLowerCase()}</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {current.mock.map((m) => (
              <div key={m} className="rounded-2xl border border-border/10 bg-background p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Module</div>
                <div className="mt-2 font-bold text-lg">{m}</div>
                <div className="mt-4 h-20 rounded-lg bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5" />
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <h3 className="font-bold text-2xl">{current.label} view</h3>
          <p className="mt-3 text-muted-foreground">{current.desc}</p>
          <Link to="/book-demo" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 decoration-accent decoration-2">
            See it live <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function AISection() {
  const cols = [
    { icon: Users, t: "Teachers", items: ["Lesson planning", "Auto-marking", "Differentiation"] },
    { icon: GraduationCap, t: "Students", items: ["Explanations", "Practice", "Doubt support"] },
    { icon: Heart, t: "Parents", items: ["Home guides", "Progress summaries", "Q&A"] },
    { icon: Building2, t: "Leaders", items: ["Insights", "Predictions", "Reports"] },
  ];
  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Calm intelligence</p>
            <h2 className="mt-4 font-bold text-4xl font-semibold leading-tight md:text-5xl">
              AI that supports <em className="italic text-accent">people.</em>
            </h2>
          </div>
          <p className="max-w-sm text-primary-foreground/70">
            Built to assist, never replace. Every output is reviewable, contextual and aligned to your school.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {cols.map((c) => (
            <div key={c.t} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6">
              <c.icon className="h-6 w-6 text-accent" />
              <div className="mt-4 font-bold text-xl">{c.t}</div>
              <ul className="mt-3 space-y-1.5 text-sm text-primary-foreground/75">
                {c.items.map((it) => (
                  <li key={it}>— {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <blockquote className="mt-14 border-l-4 border-accent pl-5 font-bold text-3xl italic">
          “AI assists. Teachers lead.”
        </blockquote>
      </div>
    </section>
  );
}

function Impact() {
  const metrics = [
    { icon: TrendingUp, l: "Confidence", t: "up" },
    { icon: TrendingDown, l: "Workload", t: "down" },
    { icon: TrendingUp, l: "Engagement", t: "up" },
    { icon: TrendingUp, l: "Outcomes", t: "up" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">The impact</p>
      <h2 className="mt-4 font-bold text-4xl font-semibold leading-tight md:text-5xl">
        Real impact you can <em className="italic text-primary underline decoration-primary/40 underline-offset-4">measure.</em>
      </h2>
      <div className="mt-14 grid gap-5 md:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.l} className="card-connectd rounded-2xl bg-card p-6">
            <m.icon className={`h-7 w-7 ${m.t === "up" ? "text-accent-foreground" : "text-destructive"}`} />
            <div className="mt-4 flex items-baseline gap-2">
              <span className={`font-bold text-2xl ${m.t === "up" ? "text-primary" : "text-destructive"}`}>
                {m.t === "up" ? "↑" : "↓"}
              </span>
              <span className="font-bold text-2xl">{m.l}</span>
            </div>
          </div>
        ))}
      </div>
      <figure className="mt-14 rounded-3xl border border-border bg-primary p-10 text-primary-foreground card-connectd">
        <div className="text-accent">★★★★★</div>
        <blockquote className="mt-5 max-w-3xl font-bold text-2xl italic leading-snug md:text-3xl">
          “Fluent gave our leadership team the first honest view of learning we've ever had — and it gave our teachers their afternoons back.”
        </blockquote>
        <figcaption className="mt-6 text-sm text-primary-foreground/70">
          Head of School · Partner institution
        </figcaption>
      </figure>
    </section>
  );
}

function TargetSchools() {
  const types = [
    { icon: BookOpen, t: "K–12" },
    { icon: Building2, t: "International" },
    { icon: Sparkles, t: "Premium" },
    { icon: Brain, t: "Innovative" },
  ];
  return (
    <section className="bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-bold text-4xl font-semibold leading-tight md:text-5xl">
          Built for forward-thinking <em className="italic">schools.</em>
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {types.map((t) => (
            <div key={t.t} className="flex items-center gap-4 rounded-2xl border border-border/15 bg-card p-6">
              <t.icon className="h-8 w-8 text-accent-foreground" />
              <span className="font-bold text-xl">{t.t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="px-6 py-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-primary p-10 text-primary-foreground md:p-16 grain">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Take the next step</p>
            <h2 className="mt-4 font-bold text-4xl font-semibold leading-[1.05] md:text-6xl">
              Start your school <em className="italic text-accent">transformation.</em>
            </h2>
            <p className="mt-6 max-w-xl text-primary-foreground/75">
              Book a demo and see Fluent in action — tailored to your school's grade, context and goals.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3">
            <Link to="/book-demo" className="btn-connectd bg-accent text-accent-foreground justify-center">
              Book a demo
            </Link>
            <Link to="/contact" className="btn-connectd-outline border-primary-foreground/40 text-primary-foreground justify-center hover:bg-primary-foreground/10">
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/15 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-xl font-bold">
            Fluent<span className="text-primary">.</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            The Learning Intelligence Platform for forward-thinking schools.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Company</div>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><a href="#" className="hover:text-accent-foreground">About</a></li>
            <li><Link to="/contact" className="hover:text-accent-foreground">Contact</Link></li>
            <li><a href="#" className="hover:text-accent-foreground">Careers</a></li>
            <li><a href="#" className="hover:text-accent-foreground">Privacy</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Offices</div>
          <p className="mt-3 text-sm">London · Bengaluru</p>
          <p className="mt-2 text-sm">
            <a href="mailto:info@fluent.academy" className="hover:text-accent-foreground">
              info@fluent.academy
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-border/10 px-6 py-5 text-center text-xs text-muted-foreground">
        © 2026 Fluent · Learning Intelligence Platform. All rights reserved.
      </div>
    </footer>
  );
}
