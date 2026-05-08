import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, Section, Panel } from "@/components/DashboardShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Progress } from "@/components/ui/progress";
import { CalendarCheck, Award, Sparkles, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_auth/dashboard/parent")({
  component: ParentDash,
});

interface Report {
  id: string;
  week_of: string;
  attendance: number;
  marks: number;
  confidence_score: number;
  notes: string | null;
}

function ParentDash() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("progress_reports")
      .select("*")
      .eq("student_id", user.id)
      .order("week_of", { ascending: false })
      .then(({ data }) => {
        setReports((data ?? []) as Report[]);
        setLoading(false);
      });
  }, [user]);

  const latest = reports[0];

  return (
    <DashboardShell
      title="Parent Dashboard"
      subtitle="Track your child's weekly progress, attendance, and confidence."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Latest attendance"
          value={`${latest?.attendance ?? 0}%`}
          sub={latest ? `Week of ${new Date(latest.week_of).toLocaleDateString()}` : "No reports yet"}
          icon={CalendarCheck}
        />
        <StatCard
          label="Latest marks"
          value={`${latest?.marks ?? 0}/100`}
          sub={latest ? "Most recent assessment" : "No reports yet"}
          icon={Award}
        />
        <StatCard
          label="Confidence"
          value={`${latest?.confidence_score ?? 0}%`}
          sub="Tutor-rated this week"
          trend="up"
          icon={Sparkles}
        />
      </div>

      <Section title="Weekly Sunday reports" description="Detailed insights from your tutor each week.">
        {loading ? (
          <Panel><p className="text-sm text-muted-foreground">Loading reports…</p></Panel>
        ) : reports.length === 0 ? (
          <Panel>
            <div className="text-center py-8">
              <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">No reports yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your tutor will publish the first report this Sunday.
              </p>
            </div>
          </Panel>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <Panel key={r.id}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="font-display text-lg">
                      Week of {new Date(r.week_of).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Published by your tutor</div>
                  </div>
                  <span className="rounded-full bg-accent/30 px-3 py-1 text-xs font-semibold whitespace-nowrap">
                    {r.confidence_score}% confidence
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Metric label="Attendance" value={r.attendance} />
                  <Metric label="Marks" value={r.marks} />
                  <Metric label="Confidence" value={r.confidence_score} />
                </div>
                {r.notes && (
                  <div className="mt-4 pt-4 border-t border-ink/10">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tutor notes</div>
                    <p className="text-sm leading-relaxed">{r.notes}</p>
                  </div>
                )}
              </Panel>
            ))}
          </div>
        )}
      </Section>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
