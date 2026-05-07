import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";

export const Route = createFileRoute("/_auth/dashboard/student")({
  component: StudentDash,
});

function StudentDash() {
  const classes = [
    { t: "Mon", time: "5:00 PM", subj: "Maths · Algebra", status: "upcoming" },
    { t: "Wed", time: "5:00 PM", subj: "English · Speaking Lab", status: "upcoming" },
    { t: "Fri", time: "5:00 PM", subj: "Science · Light", status: "completed" },
  ];
  return (
    <DashboardShell title="My Learning">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Practice streak" value="12 days 🔥" />
        <StatCard label="AI questions solved" value={148} sub="this week" />
        <StatCard label="Confidence" value="78%" sub="↑ this month" />
      </div>
      <h2 className="mt-12 font-display text-2xl">This week's classes</h2>
      <div className="mt-4 space-y-3">
        {classes.map((c, i) => (
          <div key={i} className="card-ink flex items-center justify-between rounded-2xl bg-card p-5 border border-ink/15">
            <div>
              <div className="font-display text-lg">{c.subj}</div>
              <div className="text-xs text-muted-foreground">{c.t} · {c.time}</div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${c.status === "completed" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
      <h2 className="mt-12 font-display text-2xl">AI Practice</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {["Maths drills", "Reading comprehension", "Speaking prompts"].map(p => (
          <div key={p} className="card-ink rounded-2xl bg-card p-6 border border-ink/15">
            <div className="font-display text-lg">{p}</div>
            <div className="mt-2 text-xs text-muted-foreground">10 questions · 5 min</div>
            <button className="btn-ink mt-4 rounded-full px-4 py-2 text-xs font-semibold">Start →</button>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
