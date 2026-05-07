import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_auth/dashboard")({
  component: Overview,
});

function Overview() {
  const { user, roles } = useAuth();
  return (
    <DashboardShell title={`Welcome back${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}`}>
      <p className="text-muted-foreground">Your roles: <span className="text-foreground font-semibold">{roles.join(", ") || "parent"}</span></p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Active programs" value={2} sub="Concept + Confidence" />
        <StatCard label="This week's classes" value={4} sub="2 attended, 2 upcoming" />
        <StatCard label="Confidence score" value="78%" sub="↑ 12% this month" />
      </div>
      <h2 className="mt-12 font-display text-2xl">Quick links</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.includes("parent") && <DashLink to="/dashboard/parent" title="Parent view" desc="Weekly Sunday reports" />}
        {roles.includes("student") && <DashLink to="/dashboard/student" title="Student view" desc="Classes, AI practice, streak" />}
        {roles.includes("tutor") && <DashLink to="/dashboard/tutor" title="Tutor view" desc="Submit weekly reports" />}
        {roles.includes("admin") && <DashLink to="/dashboard/admin" title="Admin view" desc="Bookings & messages" />}
      </div>
    </DashboardShell>
  );
}

function DashLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className="card-ink block rounded-2xl bg-card p-6 border border-ink/15 hover:border-accent transition">
      <div className="font-display text-lg">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </Link>
  );
}
