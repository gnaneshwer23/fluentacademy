import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, Section, Panel } from "@/components/DashboardShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { FileText, Users, Award, Send, ArrowRight, AlertCircle, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard/tutor")({
  component: TutorDash,
});

interface MiniReport {
  id: string;
  week_of: string;
  student_id: string;
  marks: number | null;
}

function TutorDash() {
  const { user, roles } = useAuth();
  const [form, setForm] = useState({
    student_id: "",
    week_of: new Date().toISOString().slice(0, 10),
    attendance: 100,
    marks: 0,
    confidence_score: 0,
    notes: "",
  });
  const [reports, setReports] = useState<MiniReport[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!user) return;
    supabase
      .from("progress_reports")
      .select("id,week_of,student_id,marks")
      .eq("tutor_id", user.id)
      .order("week_of", { ascending: false })
      .limit(20)
      .then(({ data }) => setReports(data ?? []));
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase
      .from("progress_reports")
      .insert({ ...form, tutor_id: user.id });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Report submitted");
    setForm({ ...form, marks: 0, attendance: 100, confidence_score: 0, notes: "" });
    load();
  };

  if (!roles.includes("tutor") && !roles.includes("admin")) {
    return (
      <DashboardShell title="Tutor Workspace">
        <Panel>
          <p className="text-sm text-muted-foreground">
            You need a <code className="px-1.5 py-0.5 rounded bg-secondary">tutor</code> role to
            access this page.
          </p>
        </Panel>
      </DashboardShell>
    );
  }

  const avgMarks = reports.length
    ? Math.round(reports.reduce((s, r) => s + (r.marks ?? 0), 0) / reports.length)
    : 0;

  const today = new Date();
  const isSunday = today.getDay() === 0;
  const lastReportDate = reports[0] ? new Date(reports[0].week_of) : null;
  const daysSinceLast = lastReportDate
    ? Math.floor((today.getTime() - lastReportDate.getTime()) / 86400000)
    : null;
  const overdue = daysSinceLast == null || daysSinceLast > 7;

  const nextActions = [
    isSunday && {
      icon: Send,
      title: "It's Sunday — publish reports",
      desc: "Submit this week's progress reports for each student.",
    },
    overdue && reports.length > 0 && {
      icon: AlertCircle,
      title: "Reports overdue",
      desc: `Last submission was ${daysSinceLast} days ago.`,
    },
    reports.length === 0 && {
      icon: FileText,
      title: "Submit your first report",
      desc: "Use the form below to get started — students are waiting.",
    },
    {
      icon: Calendar,
      title: "Review next week's schedule",
      desc: "Confirm class slots with your students.",
    },
    {
      icon: Users,
      title: "Open student profiles",
      desc: "See onboarding goals and learning styles to plan classes.",
      to: "/dashboard/users",
    },
  ].filter(Boolean) as { icon: typeof Send; title: string; desc: string; to?: string }[];

  return (
    <DashboardShell
      title="Tutor Workspace"
      subtitle="Submit weekly Sunday reports and track your students."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Reports submitted" value={reports.length} icon={FileText} />
        <StatCard
          label="Active students"
          value={new Set(reports.map((r) => r.student_id)).size}
          icon={Users}
        />
        <StatCard label="Avg marks given" value={avgMarks} icon={Award} />
      </div>

      <Section title="Your next actions" description="What needs your attention this week.">
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
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
              </Panel>
            );
            return a.to ? <Link key={i} to={a.to}>{body}</Link> : <div key={i}>{body}</div>;
          })}
        </div>
      </Section>

      <Section
        title="Submit weekly report"
        description="Sunday is publish day — keep it consistent."
      >
        <Panel>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <Field label="Student user ID" className="sm:col-span-2">
              <input
                required
                placeholder="UUID from student's profile"
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Week of">
              <input
                required
                type="date"
                value={form.week_of}
                onChange={(e) => setForm({ ...form, week_of: e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Attendance %">
              <input
                type="number"
                min={0}
                max={100}
                value={form.attendance}
                onChange={(e) => setForm({ ...form, attendance: +e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Marks (out of 100)">
              <input
                type="number"
                min={0}
                max={100}
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: +e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Confidence %">
              <input
                type="number"
                min={0}
                max={100}
                value={form.confidence_score}
                onChange={(e) => setForm({ ...form, confidence_score: +e.target.value })}
                className="input"
              />
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              <textarea
                placeholder="What went well, what to focus on next week…"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                className="input resize-none"
              />
            </Field>
            <div className="sm:col-span-2 flex justify-end">
              <button
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
              >
                <Send className="h-4 w-4" /> {submitting ? "Submitting…" : "Submit report"}
              </button>
            </div>
          </form>
        </Panel>
      </Section>

      <Section title="Recent reports">
        {reports.length === 0 ? (
          <Panel>
            <p className="text-sm text-muted-foreground">You haven't submitted any reports yet.</p>
          </Panel>
        ) : (
          <Panel className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3">Week of</th>
                  <th className="text-left px-5 py-3">Student</th>
                  <th className="text-right px-5 py-3">Marks</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-t border-ink/5">
                    <td className="px-5 py-3">{new Date(r.week_of).toLocaleDateString()}</td>
                    <td className="px-5 py-3 font-mono text-xs truncate max-w-[200px]">
                      {r.student_id}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">{r.marks ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        )}
      </Section>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid color-mix(in oklab, var(--ink) 15%, transparent);
          background: var(--background);
          border-radius: 0.75rem;
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 15%, transparent); }
      `}</style>
    </DashboardShell>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
