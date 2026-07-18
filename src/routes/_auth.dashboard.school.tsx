import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, Section, Panel, StatCard } from "@/components/DashboardShell";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { slugifySchoolName } from "@/lib/school-api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Building2, GraduationCap, Link2, Plus, Users } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_auth/dashboard/school")({
  component: SchoolAdmin,
});

type School = Tables<"schools">;
type ClassRow = Tables<"classes">;
type GuardianLink = Tables<"guardian_links"> & {
  guardian?: { full_name: string | null; email: string | null } | null;
  student?: { full_name: string | null; email: string | null } | null;
};

type TutorOption = { id: string; full_name: string | null; email: string | null };

function SchoolAdmin() {
  const { roles } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [links, setLinks] = useState<GuardianLink[]>([]);
  const [tutors, setTutors] = useState<TutorOption[]>([]);
  const [schoolForm, setSchoolForm] = useState({ name: "" });
  const [classForm, setClassForm] = useState({
    name: "",
    grade: "",
    subject: "",
    tutor_id: "",
  });

  const loadSchools = async () => {
    const { data } = await supabase.from("schools").select("*").order("name");
    setSchools(data ?? []);
    if (data?.length && !selectedSchool) setSelectedSchool(data[0].id);
  };

  const loadClasses = async (schoolId: string) => {
    const { data } = await supabase
      .from("classes")
      .select("*")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });
    setClasses(data ?? []);
  };

  const loadLinks = async () => {
    const { data } = await supabase
      .from("guardian_links")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setLinks((data ?? []) as GuardianLink[]);
  };

  const loadTutors = async () => {
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "tutor");
    const ids = roleRows?.map((r) => r.user_id) ?? [];
    if (!ids.length) return setTutors([]);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", ids);
    setTutors((data ?? []) as TutorOption[]);
  };

  useEffect(() => {
    if (!roles.includes("admin")) return;
    loadSchools();
    loadLinks();
    loadTutors();
  }, [roles]);

  useEffect(() => {
    if (selectedSchool) loadClasses(selectedSchool);
  }, [selectedSchool]);

  if (!roles.includes("admin")) {
    return (
      <DashboardShell title="School setup">
        <Panel>
          <p className="text-sm text-muted-foreground">Admin access required.</p>
        </Panel>
      </DashboardShell>
    );
  }

  const createSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugifySchoolName(schoolForm.name);
    const { error } = await supabase.from("schools").insert({ name: schoolForm.name, slug });
    if (error) return toast.error(error.message);
    toast.success("School created");
    setSchoolForm({ name: "" });
    loadSchools();
  };

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return toast.error("Select a school first");
    const { data, error } = await supabase
      .from("classes")
      .insert({
        school_id: selectedSchool,
        name: classForm.name,
        grade: classForm.grade || null,
        subject: classForm.subject || null,
        tutor_id: classForm.tutor_id || null,
      })
      .select("join_code")
      .single();
    if (error) return toast.error(error.message);
    toast.success(`Class created — join code: ${data.join_code}`);
    setClassForm({ name: "", grade: "", subject: "", tutor_id: "" });
    loadClasses(selectedSchool);
  };

  const verifyLink = async (id: string) => {
    const { error } = await supabase
      .from("guardian_links")
      .update({ status: "verified", verified_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Guardian link verified");
    loadLinks();
  };

  return (
    <DashboardShell
      title="School setup"
      subtitle="Create schools, classes with join codes, and manage guardian links."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Schools" value={schools.length} icon={Building2} />
        <StatCard label="Classes" value={classes.length} icon={GraduationCap} />
        <StatCard
          label="Guardian links"
          value={links.filter((l) => l.status === "verified").length}
          sub={`${links.filter((l) => l.status === "pending").length} pending`}
          icon={Link2}
        />
      </div>

      <Section title="Create school">
        <Panel>
          <form onSubmit={createSchool} className="flex flex-col sm:flex-row gap-3">
            <input
              required
              placeholder="School name"
              value={schoolForm.name}
              onChange={(e) => setSchoolForm({ name: e.target.value })}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm"
            />
            <button type="submit" className="btn-connectd shrink-0">
              <Plus className="h-4 w-4" /> Add school
            </button>
          </form>
        </Panel>
      </Section>

      <Section title="Classes" description="Share join codes with scholars during onboarding.">
        <div className="mb-4">
          <label className="text-xs font-semibold text-muted-foreground">School</label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="mt-1 block w-full max-w-md rounded-xl border border-border px-4 py-2.5 text-sm"
          >
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <Panel className="mb-4">
          <form onSubmit={createClass} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              required
              placeholder="Class name"
              value={classForm.name}
              onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
              className="rounded-xl border border-border px-4 py-2.5 text-sm"
            />
            <input
              placeholder="Grade"
              value={classForm.grade}
              onChange={(e) => setClassForm({ ...classForm, grade: e.target.value })}
              className="rounded-xl border border-border px-4 py-2.5 text-sm"
            />
            <input
              placeholder="Subject"
              value={classForm.subject}
              onChange={(e) => setClassForm({ ...classForm, subject: e.target.value })}
              className="rounded-xl border border-border px-4 py-2.5 text-sm"
            />
            <select
              value={classForm.tutor_id}
              onChange={(e) => setClassForm({ ...classForm, tutor_id: e.target.value })}
              className="rounded-xl border border-border px-4 py-2.5 text-sm"
            >
              <option value="">Assign tutor (optional)</option>
              {tutors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name ?? t.email}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-connectd sm:col-span-2 lg:col-span-4 justify-center">
              Create class
            </button>
          </form>
        </Panel>

        <div className="space-y-3">
          {classes.length === 0 && (
            <Panel>
              <p className="text-sm text-muted-foreground">No classes yet for this school.</p>
            </Panel>
          )}
          {classes.map((c) => (
            <Panel key={c.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-muted-foreground">
                  {[c.grade, c.subject].filter(Boolean).join(" · ") || "General"}
                </div>
              </div>
              <div className="rounded-full bg-[var(--teal-light)] px-4 py-1.5 text-sm font-mono font-semibold text-primary">
                {c.join_code}
              </div>
            </Panel>
          ))}
        </div>
      </Section>

      <Section title="Guardian links">
        <div className="space-y-3">
          {links.length === 0 && (
            <Panel>
              <p className="text-sm text-muted-foreground">
                No guardian links yet. Parents link during onboarding with a scholar&apos;s invite
                code.
              </p>
            </Panel>
          )}
          {links.map((l) => (
            <Panel key={l.id} className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <Users className="inline h-4 w-4 mr-1 text-primary" />
                Guardian ↔ Scholar ·{" "}
                <span
                  className={
                    l.status === "verified"
                      ? "text-emerald-600 font-medium"
                      : "text-amber-600 font-medium"
                  }
                >
                  {l.status}
                </span>
              </div>
              {l.status === "pending" && (
                <button
                  type="button"
                  onClick={() => verifyLink(l.id)}
                  className="btn-connectd btn-connectd-sm"
                >
                  Verify
                </button>
              )}
            </Panel>
          ))}
        </div>
      </Section>
    </DashboardShell>
  );
}
