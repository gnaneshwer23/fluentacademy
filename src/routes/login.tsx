import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Users, GraduationCap, BookOpen } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In · Fluent" }] }),
  component: AuthPage,
});

const ROLES = [
  { id: "parent", label: "Parent", desc: "Track your child's progress", icon: Users },
  { id: "student", label: "Student", desc: "Classes, AI practice, streak", icon: GraduationCap },
  { id: "tutor", label: "Tutor", desc: "Teach & submit weekly reports", icon: BookOpen },
] as const;

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"parent" | "student" | "tutor">("parent");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/onboarding" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: { full_name: name, role },
        },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created! Check your email to confirm.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else {
        toast.success("Welcome back!");
        navigate({ to: "/onboarding" });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="text-sm text-muted-foreground hover:text-accent">
          ← Back to home
        </Link>
        <div className="mt-6 card-ink rounded-3xl bg-card p-8 border border-ink/15">
          <h1 className="font-display text-3xl font-semibold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to your Fluent dashboard."
              : "Join thousands of confident learners."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <span className="block text-xs font-medium text-muted-foreground mb-2">
                    I am a…
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const active = role === r.id;
                      return (
                        <button
                          type="button"
                          key={r.id}
                          onClick={() => setRole(r.id)}
                          className={`rounded-xl border p-3 text-left transition ${
                            active
                              ? "border-primary bg-primary/5"
                              : "border-ink/15 hover:border-ink/30"
                          }`}
                        >
                          <Icon className="h-4 w-4 mb-1.5" />
                          <div className="text-xs font-semibold">{r.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm"
                />
              </>
            )}
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm"
            />
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)"
              className="w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm"
            />
            <button
              disabled={loading}
              className="btn-ink w-full rounded-full px-6 py-3 text-sm font-semibold"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-accent"
          >
            {mode === "login" ? "No account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
