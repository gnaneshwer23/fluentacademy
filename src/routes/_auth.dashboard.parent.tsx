import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_auth/dashboard/parent")({
  component: ParentDash,
});

interface Report { id: string; week_of: string; attendance: number; marks: number; confidence_score: number; notes: string | null; }

function ParentDash() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("progress_reports").select("*").eq("student_id", user.id).order("week_of", { ascending: false })
      .then(({ data }) => setReports((data ?? []) as Report[]));
  }, [user]);
  const latest = reports[0];
  return (
    <DashboardShell title="Parent Dashboard">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Latest attendance" value={`${latest?.attendance ?? 0}%`} />
        <StatCard label="Latest marks" value={`${latest?.marks ?? 0}/100`} />
        <StatCard label="Confidence" value={`${latest?.confidence_score ?? 0}%`} />
      </div>
      <h2 className="mt-12 font-display text-2xl">Weekly Sunday Reports</h2>
      {reports.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No reports yet. Your tutor will publish the first one this Sunday.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {reports.map(r => (
            <div key={r.id} className="card-ink rounded-2xl bg-card p-6 border border-ink/15">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg">Week of {new Date(r.week_of).toLocaleDateString()}</div>
                <div className="text-xs text-accent-foreground/70">Confidence {r.confidence_score}%</div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground">Attendance:</span> {r.attendance}%</div>
                <div><span className="text-muted-foreground">Marks:</span> {r.marks}</div>
                <div><span className="text-muted-foreground">Confidence:</span> {r.confidence_score}%</div>
              </div>
              {r.notes && <p className="mt-3 text-sm text-muted-foreground">{r.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
