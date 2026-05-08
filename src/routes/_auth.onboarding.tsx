import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, CheckCircle2, Users, GraduationCap, BookOpen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_auth/onboarding")({
  head: () => ({ meta: [{ title: "Welcome · Fluent" }] }),
  component: Onboarding,
});

type Role = "parent" | "student" | "tutor" | "admin";

const ROLE_META: Record<Exclude<Role, "admin">, { icon: typeof Users; title: string; tagline: string }> = {
  parent: { icon: Users, title: "Welcome, Parent!", tagline: "Help us tailor weekly Sunday reports for your child." },
  student: { icon: GraduationCap, title: "Hi there, learner!", tagline: "Tell us about you so we can personalise your practice." },
  tutor: { icon: BookOpen, title: "Welcome, Tutor!", tagline: "A few details so we can match you with the right students." },
};

function Onboarding() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  // form state
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    child_name: "",
    child_grade: "",
    grade: "",
    subjects: [] as string[],
    goals: "",
    learning_style: "",
    experience_years: 0,
    bio: "",
    availability: "",
  });

  const role: Exclude<Role, "admin"> = (roles.find((r) => r !== "admin") as any) ?? "parent";
  const meta = ROLE_META[role];

  useEffect(() => {
    if (loading || !user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        setProfile(data);
        if (data?.onboarded) {
          navigate({ to: "/dashboard" });
          return;
        }
        setForm((f) => ({
          ...f,
          full_name: data?.full_name ?? user.email?.split("@")[0] ?? "",
          phone: data?.phone ?? "",
        }));
        setChecking(false);
      });
  }, [user, loading, navigate]);

  const STEPS = roleSteps(role);
  const last = step === STEPS.length - 1;

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    const payload: any = {
      full_name: form.full_name,
      phone: form.phone || null,
      onboarded: true,
      updated_at: new Date().toISOString(),
    };
    if (role === "parent") {
      payload.child_name = form.child_name || null;
      payload.child_grade = form.child_grade || null;
      payload.goals = form.goals || null;
    } else if (role === "student") {
      payload.grade = form.grade || null;
      payload.subjects = form.subjects.length ? form.subjects : null;
      payload.goals = form.goals || null;
      payload.learning_style = form.learning_style || null;
    } else if (role === "tutor") {
      payload.subjects = form.subjects.length ? form.subjects : null;
      payload.experience_years = form.experience_years || null;
      payload.bio = form.bio || null;
      payload.availability = form.availability || null;
    }
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("You're all set!");
    navigate({ to: "/dashboard" });
  };

  if (loading || checking) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const Icon = meta.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>

        <div className="rounded-3xl bg-card border border-ink/15 p-8 lg:p-12">
          {step === 0 && (
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold">{meta.title}</h1>
              <p className="mt-3 text-muted-foreground">{meta.tagline}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 text-left">
                <Field label="Your full name">
                  <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </Field>
                <Field label="Phone (optional)">
                  <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
              </div>
            </div>
          )}

          {step > 0 && role === "parent" && (
            <ParentSteps step={step} form={form} setForm={setForm} />
          )}
          {step > 0 && role === "student" && (
            <StudentSteps step={step} form={form} setForm={setForm} />
          )}
          {step > 0 && role === "tutor" && (
            <TutorSteps step={step} form={form} setForm={setForm} />
          )}

          {/* Nav */}
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border border-ink/15 hover:bg-secondary transition disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <span className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</span>
            {last ? (
              <button
                onClick={finish}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Finish"} <CheckCircle2 className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold hover:opacity-90"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground inline-flex items-center gap-1.5 w-full justify-center">
          <Sparkles className="h-3 w-3" /> You can update these anytime from your dashboard.
        </p>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid color-mix(in oklab, var(--ink) 15%, transparent);
          background: var(--background);
          border-radius: 0.75rem;
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
        }
        .input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 15%, transparent); }
        .chip {
          padding: 0.5rem 0.9rem; border-radius: 999px; font-size: 0.8rem; font-weight: 500;
          border: 1px solid color-mix(in oklab, var(--ink) 15%, transparent); cursor: pointer; transition: all .15s;
        }
        .chip[data-active="true"] { background: var(--primary); color: var(--primary-foreground); border-color: var(--primary); }
      `}</style>
    </div>
  );
}

function roleSteps(role: Exclude<Role, "admin">) {
  if (role === "parent") return ["intro", "child", "goals"];
  if (role === "student") return ["intro", "grade", "subjects", "style"];
  return ["intro", "expertise", "availability"]; // tutor
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

const SUBJECTS = ["Maths", "English", "Science", "Hindi", "Social Studies", "Coding", "Public Speaking"];
const GRADES = ["Grade 1-2", "Grade 3-5", "Grade 6-8", "Grade 9-10", "Grade 11-12"];

function ToggleChips({ values, selected, onChange }: { values: string[]; selected: string[]; onChange: (s: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => {
        const on = selected.includes(v);
        return (
          <button key={v} type="button" className="chip" data-active={on}
            onClick={() => onChange(on ? selected.filter((x) => x !== v) : [...selected, v])}>
            {v}
          </button>
        );
      })}
    </div>
  );
}

function ParentSteps({ step, form, setForm }: any) {
  if (step === 1) return (
    <div>
      <h2 className="font-display text-2xl mb-1">About your child</h2>
      <p className="text-sm text-muted-foreground mb-6">We'll personalise reports and class recommendations.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Child's name"><input className="input" value={form.child_name} onChange={(e) => setForm({ ...form, child_name: e.target.value })} /></Field>
        <Field label="Grade">
          <select className="input" value={form.child_grade} onChange={(e) => setForm({ ...form, child_grade: e.target.value })}>
            <option value="">Select grade…</option>
            {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
  return (
    <div>
      <h2 className="font-display text-2xl mb-1">What are your goals?</h2>
      <p className="text-sm text-muted-foreground mb-6">e.g. confidence in English, exam prep, daily reading habit.</p>
      <Field label="Your goals">
        <textarea rows={5} className="input resize-none" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
      </Field>
    </div>
  );
}

function StudentSteps({ step, form, setForm }: any) {
  if (step === 1) return (
    <div>
      <h2 className="font-display text-2xl mb-1">What grade are you in?</h2>
      <p className="text-sm text-muted-foreground mb-6">Pick the closest grade band.</p>
      <div className="flex flex-wrap gap-2">
        {GRADES.map((g) => (
          <button key={g} type="button" className="chip" data-active={form.grade === g}
            onClick={() => setForm({ ...form, grade: g })}>{g}</button>
        ))}
      </div>
    </div>
  );
  if (step === 2) return (
    <div>
      <h2 className="font-display text-2xl mb-1">Which subjects do you want help with?</h2>
      <p className="text-sm text-muted-foreground mb-6">Pick as many as you like.</p>
      <ToggleChips values={SUBJECTS} selected={form.subjects} onChange={(s) => setForm({ ...form, subjects: s })} />
    </div>
  );
  return (
    <div>
      <h2 className="font-display text-2xl mb-1">How do you learn best?</h2>
      <p className="text-sm text-muted-foreground mb-6">We'll match your AI practice style accordingly.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {["Visual", "Listening", "Doing / hands-on", "Reading & writing"].map((s) => (
          <button key={s} type="button" className="chip" data-active={form.learning_style === s}
            onClick={() => setForm({ ...form, learning_style: s })}>{s}</button>
        ))}
      </div>
      <Field label="Anything else you'd like us to know?">
        <textarea rows={3} className="input resize-none mt-4" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
      </Field>
    </div>
  );
}

function TutorSteps({ step, form, setForm }: any) {
  if (step === 1) return (
    <div>
      <h2 className="font-display text-2xl mb-1">Your expertise</h2>
      <p className="text-sm text-muted-foreground mb-6">Tell us what you teach and your years of experience.</p>
      <Field label="Subjects you teach">
        <div className="mt-1"><ToggleChips values={SUBJECTS} selected={form.subjects} onChange={(s) => setForm({ ...form, subjects: s })} /></div>
      </Field>
      <Field label="Years of experience">
        <input type="number" min={0} className="input mt-4" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: +e.target.value })} />
      </Field>
    </div>
  );
  return (
    <div>
      <h2 className="font-display text-2xl mb-1">Availability & bio</h2>
      <p className="text-sm text-muted-foreground mb-6">Help students and parents get to know you.</p>
      <Field label="Short bio">
        <textarea rows={4} className="input resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </Field>
      <Field label="Availability (e.g. Mon–Fri, 4–8pm IST)">
        <input className="input mt-4" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} />
      </Field>
    </div>
  );
}
