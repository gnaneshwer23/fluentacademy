import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell, StatCard, Section, Panel } from "@/components/DashboardShell";
import { Flame, Sparkles, TrendingUp, Calendar, Play, CheckCircle2, Target, ArrowRight, Mic, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_auth/dashboard/student")({
  component: StudentDash,
});

function StudentDash() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null; grade: string | null; subjects: string[] | null; learning_style: string | null; goals: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name,grade,subjects,learning_style,goals")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);
  const firstName = (profile?.full_name || user?.email?.split("@")[0] || "there").split(" ")[0];
  const classes = [
    {
      day: "Mon",
      time: "5:00 PM",
      subject: "Maths",
      topic: "Algebra · Linear equations",
      status: "upcoming" as const,
    },
    {
      day: "Wed",
      time: "5:00 PM",
      subject: "English",
      topic: "Speaking Lab · Storytelling",
      status: "upcoming" as const,
    },
    {
      day: "Fri",
      time: "5:00 PM",
      subject: "Science",
      topic: "Light · Reflection",
      status: "completed" as const,
    },
  ];

  const practice = [
    { title: "Maths drills", count: "10 questions", time: "5 min", color: "bg-blue-100" },
    { title: "Reading comprehension", count: "1 passage", time: "8 min", color: "bg-emerald-100" },
    { title: "Speaking prompts", count: "3 prompts", time: "6 min", color: "bg-amber-100" },
  ];

  const styleTip: Record<string, string> = {
    Visual: "Try diagram-based maths today — it'll click faster.",
    Listening: "Start with a 5-min audio explainer before drills.",
    "Doing / hands-on": "Jump into a hands-on practice set first.",
    "Reading & writing": "Open today's passage and jot 3 takeaways.",
  };

  const nextActions = [
    {
      icon: Mic,
      title: "Today's speaking warm-up",
      desc: "2 min · Builds confidence before your next class.",
    },
    profile?.learning_style && {
      icon: Sparkles,
      title: `Tailored for ${profile.learning_style.toLowerCase()} learners`,
      desc: styleTip[profile.learning_style] ?? "We've matched your practice to your style.",
    },
    profile?.subjects && profile.subjects.length > 0 && {
      icon: BookOpen,
      title: `Focus subject: ${profile.subjects[0]}`,
      desc: "Start a 10-question warm-up for today's topic.",
    },
    !profile?.goals && {
      icon: Target,
      title: "Set your learning goal",
      desc: "Tell us what you want to achieve this term.",
      to: "/onboarding",
    },
  ].filter(Boolean) as { icon: typeof Target; title: string; desc: string; to?: string }[];

  return (
    <DashboardShell
      title={`Hi ${firstName} 👋`}
      subtitle={profile?.grade ? `${profile.grade} · keep your streak going.` : "Stay on streak, finish your classes, and practice with AI."}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Practice streak" value="12 days" sub="Keep it going! 🔥" icon={Flame} />
        <StatCard
          label="AI questions solved"
          value={148}
          sub="This week"
          trend="up"
          icon={Sparkles}
        />
        <StatCard
          label="Confidence"
          value="78%"
          sub="↑ 12% this month"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      <Section title="Your next actions" description="Picked for how you learn.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {nextActions.map((a, i) => {
            const Icon = a.icon;
            const body = (
              <Panel className="h-full hover:border-primary transition flex flex-col">
                <div className="h-9 w-9 rounded-lg bg-accent/30 flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="font-display text-base">{a.title}</div>
                <div className="mt-1 text-sm text-muted-foreground flex-1">{a.desc}</div>
                {a.to && (
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Go <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </Panel>
            );
            return a.to ? <Link key={i} to={a.to}>{body}</Link> : <div key={i}>{body}</div>;
          })}
        </div>
      </Section>

      <Section title="This week's classes" description="Your live sessions with tutors.">
        <div className="space-y-3">
          {classes.map((c, i) => (
            <Panel key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 rounded-xl bg-accent/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase tracking-wider font-semibold">
                    {c.day}
                  </span>
                  <Calendar className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-lg truncate">{c.subject}</div>
                  <div className="text-sm text-muted-foreground truncate">{c.topic}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.time}</div>
                </div>
              </div>
              {c.status === "completed" ? (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1.5 text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Done
                </span>
              ) : (
                <button className="flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold hover:opacity-90">
                  Join <Play className="h-3 w-3" />
                </button>
              )}
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="AI Practice" description="Quick warm-ups tailored to your level.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {practice.map((p) => (
            <Panel key={p.title} className="hover:border-primary transition flex flex-col">
              <div
                className={`h-10 w-10 rounded-xl ${p.color} flex items-center justify-center mb-4`}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="font-display text-lg">{p.title}</div>
              <div className="mt-1 text-xs text-muted-foreground flex-1">
                {p.count} · {p.time}
              </div>
              <button className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:opacity-90">
                Start <Play className="h-3 w-3" />
              </button>
            </Panel>
          ))}
        </div>
      </Section>
    </DashboardShell>
  );
}
