import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, Section, Panel } from "@/components/DashboardShell";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Users, Search, GraduationCap, BookOpen, CheckCircle2, Clock, Save, Eye } from "lucide-react";

export const Route = createFileRoute("/_auth/dashboard/users")({
  head: () => ({ meta: [{ title: "Onboarding Responses · Fluent" }] }),
  component: UsersAdmin,
});

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  onboarded: boolean;
  grade: string | null;
  child_grade: string | null;
  child_name: string | null;
  subjects: string[] | null;
  goals: string | null;
  learning_style: string | null;
  bio: string | null;
  availability: string | null;
  experience_years: number | null;
  created_at: string;
  review_status: string;
  reviewer_notes: string | null;
  reviewed_at: string | null;
}

const ROLES = ["all", "parent", "student", "tutor", "admin"] as const;
const STATUSES = ["all", "new", "reviewing", "approved", "follow_up"] as const;
const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  follow_up: "bg-rose-100 text-rose-800",
};

function UsersAdmin() {
  const { roles, user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<(typeof ROLES)[number]>("all");
  const [grade, setGrade] = useState<string>("all");
  const [goalQ, setGoalQ] = useState("");
  const [q, setQ] = useState("");
  const [onboardedOnly, setOnboardedOnly] = useState(false);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [drafts, setDrafts] = useState<Record<string, { status: string; notes: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (!roles.includes("admin")) {
      setLoading(false);
      return;
    }
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProfiles((data ?? []) as Profile[]);
        setLoading(false);
      });
  }, [roles]);

  const grades = useMemo(() => {
    const set = new Set<string>();
    profiles.forEach((p) => {
      if (p.grade) set.add(p.grade);
      if (p.child_grade) set.add(p.child_grade);
    });
    return ["all", ...Array.from(set).sort()];
  }, [profiles]);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (role !== "all" && p.role !== role) return false;
      if (grade !== "all" && p.grade !== grade && p.child_grade !== grade) return false;
      if (onboardedOnly && !p.onboarded) return false;
      if (goalQ && !(p.goals ?? "").toLowerCase().includes(goalQ.toLowerCase())) return false;
      if (q) {
        const hay = [p.full_name, p.email, p.child_name, p.bio].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [profiles, role, grade, goalQ, q, onboardedOnly]);

  if (!roles.includes("admin")) {
    return (
      <DashboardShell title="Onboarding Responses">
        <Panel>
          <p className="text-sm text-muted-foreground">Admin access required.</p>
        </Panel>
      </DashboardShell>
    );
  }

  const onboardedCount = profiles.filter((p) => p.onboarded).length;
  const byRole = (r: string) => profiles.filter((p) => p.role === r).length;

  return (
    <DashboardShell
      title="Onboarding Responses"
      subtitle="Review who has signed up and what they told us during onboarding."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={profiles.length} icon={Users} />
        <StatCard label="Onboarded" value={onboardedCount} sub={`${profiles.length - onboardedCount} pending`} icon={CheckCircle2} />
        <StatCard label="Students" value={byRole("student")} icon={GraduationCap} />
        <StatCard label="Tutors" value={byRole("tutor")} icon={BookOpen} />
      </div>

      <Section title="Filter">
        <Panel>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-lg border border-ink/15 bg-card px-3 py-2 text-sm capitalize"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-card px-3 py-2 text-sm"
              >
                {grades.map((g) => (
                  <option key={g} value={g}>{g === "all" ? "All grades" : g}</option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Goals contain</label>
              <input
                value={goalQ}
                onChange={(e) => setGoalQ(e.target.value)}
                placeholder="e.g. confidence"
                className="w-full rounded-lg border border-ink/15 bg-card px-3 py-2 text-sm"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Search name / email</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search…"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-ink/15 bg-card text-sm"
                />
              </div>
            </div>
          </div>
          <label className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={onboardedOnly} onChange={(e) => setOnboardedOnly(e.target.checked)} />
            Onboarded only
          </label>
        </Panel>
      </Section>

      <Section title={`Results (${filtered.length})`}>
        {loading ? (
          <Panel><p className="text-sm text-muted-foreground">Loading…</p></Panel>
        ) : filtered.length === 0 ? (
          <Panel><p className="text-sm text-muted-foreground">No users match your filters.</p></Panel>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <Panel key={p.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-lg">{p.full_name || "(no name)"}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary capitalize">{p.role ?? "—"}</span>
                      {p.onboarded ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Onboarded
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {p.email}{p.phone && <> · {p.phone}</>} · joined {new Date(p.created_at).toLocaleDateString()}
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
                      {p.role === "parent" && (
                        <>
                          <Detail label="Child">{p.child_name || "—"}</Detail>
                          <Detail label="Child grade">{p.child_grade || "—"}</Detail>
                        </>
                      )}
                      {p.role === "student" && (
                        <>
                          <Detail label="Grade">{p.grade || "—"}</Detail>
                          <Detail label="Learning style">{p.learning_style || "—"}</Detail>
                        </>
                      )}
                      {p.role === "tutor" && (
                        <>
                          <Detail label="Experience">{p.experience_years ? `${p.experience_years} yrs` : "—"}</Detail>
                          <Detail label="Availability">{p.availability || "—"}</Detail>
                        </>
                      )}
                      {p.subjects && p.subjects.length > 0 && (
                        <Detail label="Subjects">
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.subjects.map((s) => (
                              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-secondary">{s}</span>
                            ))}
                          </div>
                        </Detail>
                      )}
                    </div>

                    {p.goals && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Goals</div>
                        <p className="text-sm bg-secondary/60 rounded-lg p-3 whitespace-pre-wrap">{p.goals}</p>
                      </div>
                    )}
                    {p.bio && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Bio</div>
                        <p className="text-sm bg-secondary/60 rounded-lg p-3 whitespace-pre-wrap">{p.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </Section>
    </DashboardShell>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
