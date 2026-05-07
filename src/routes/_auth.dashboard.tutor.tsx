import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/dashboard/tutor")({
  component: TutorDash,
});

function TutorDash() {
  const { user, roles } = useAuth();
  const [form, setForm] = useState({ student_id: "", week_of: "", attendance: 100, marks: 0, confidence_score: 0, notes: "" });
  const [reports, setReports] = useState<{ id: string; week_of: string; student_id: string; marks: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("progress_reports").select("id,week_of,student_id,marks").eq("tutor_id", user.id).order("week_of", { ascending: false }).limit(20)
      .then(({ data }) => setReports(data ?? []));
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("progress_reports").insert({ ...form, tutor_id: user.id });
    if (error) toast.error(error.message);
    else { toast.success("Report submitted"); setForm({ ...form, marks: 0, notes: "" }); }
  };

  if (!roles.includes("tutor") && !roles.includes("admin")) {
    return <DashboardShell title="Tutor"><p className="text-muted-foreground">You need a tutor role to access this page.</p></DashboardShell>;
  }

  return (
    <DashboardShell title="Tutor Workspace">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Reports submitted" value={reports.length} />
        <StatCard label="Active students" value={new Set(reports.map(r => r.student_id)).size} />
        <StatCard label="Avg marks given" value={reports.length ? Math.round(reports.reduce((s, r) => s + r.marks, 0) / reports.length) : 0} />
      </div>
      <h2 className="mt-12 font-display text-2xl">Submit weekly report</h2>
      <form onSubmit={submit} className="mt-4 grid gap-4 md:grid-cols-2 card-ink rounded-3xl bg-card p-6 border border-ink/15">
        <input required placeholder="Student user ID (UUID)" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} className="rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm md:col-span-2" />
        <input required type="date" value={form.week_of} onChange={e => setForm({ ...form, week_of: e.target.value })} className="rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" />
        <input type="number" min={0} max={100} placeholder="Attendance %" value={form.attendance} onChange={e => setForm({ ...form, attendance: +e.target.value })} className="rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" />
        <input type="number" min={0} max={100} placeholder="Marks" value={form.marks} onChange={e => setForm({ ...form, marks: +e.target.value })} className="rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" />
        <input type="number" min={0} max={100} placeholder="Confidence %" value={form.confidence_score} onChange={e => setForm({ ...form, confidence_score: +e.target.value })} className="rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" />
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="md:col-span-2 rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" rows={3} />
        <button className="btn-ink md:col-span-2 rounded-full px-6 py-3 text-sm font-semibold">Submit report</button>
      </form>
    </DashboardShell>
  );
}
