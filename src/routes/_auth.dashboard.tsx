import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell, StatCard, Section, Panel } from "@/components/DashboardShell";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { BookOpen, Calendar, TrendingUp, Sparkles, ArrowRight, Users, GraduationCap, Shield } from "lucide-react";

export const Route = createFileRoute("/_auth/dashboard")({
  component: Overview,
});

function Overview() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data && !data.onboarded) navigate({ to: "/onboarding" });
      });
  }, [user, navigate]);

  const quickLinks = [
    { to: "/dashboard/parent", title: "Parent view", desc: "Weekly Sunday reports", icon: Users, role: "parent" as const },
    { to: "/dashboard/student", title: "Student view", desc: "Classes, AI practice, streak", icon: GraduationCap, role: "student" as const },
    { to: "/dashboard/tutor", title: "Tutor view", desc: "Submit weekly reports", icon: BookOpen, role: "tutor" as const },
    { to: "/dashboard/admin", title: "Admin view", desc: "Bookings & messages", icon: Shield, role: "admin" as const },
  ].filter((q) => roles.includes(q.role) || roles.includes("admin"));

  return (
    <DashboardShell
      title={`Welcome back, ${name}`}
      subtitle="Here's a quick snapshot of your learning week."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active programs" value={2} sub="Concept + Confidence" icon={BookOpen} />
        <StatCard label="Classes this week" value={4} sub="2 attended · 2 upcoming" icon={Calendar} />
        <StatCard label="Confidence" value="78%" sub="↑ 12% this month" trend="up" icon={TrendingUp} />
        <StatCard label="AI practice" value={148} sub="questions solved" icon={Sparkles} />
      </div>

      <Section title="Your spaces" description="Jump into the dashboard for your role.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.to}
                to={q.to}
                className="group rounded-2xl bg-card border border-ink/10 p-5 hover:border-primary transition flex flex-col"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/30 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-display text-lg">{q.title}</div>
                <div className="mt-1 text-sm text-muted-foreground flex-1">{q.desc}</div>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Open <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title="Tips for the week">
        <Panel>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><span className="text-accent-foreground">•</span> Practice 10 minutes daily — consistency beats intensity.</li>
            <li className="flex gap-3"><span className="text-accent-foreground">•</span> Review last week's report with your tutor before the next class.</li>
            <li className="flex gap-3"><span className="text-accent-foreground">•</span> Try one AI speaking prompt before bed to build confidence.</li>
          </ul>
        </Panel>
      </Section>
    </DashboardShell>
  );
}
