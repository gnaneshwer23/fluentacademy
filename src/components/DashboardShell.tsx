import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

export function DashboardShell({ title, children }: { title: string; children: ReactNode }) {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-ink/15 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display">F</div>
            <span className="font-display text-lg font-semibold">Fluent</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/dashboard" className="hover:text-accent">Overview</Link>
            {roles.includes("parent") && <Link to="/dashboard/parent" className="hover:text-accent">Parent</Link>}
            {roles.includes("student") && <Link to="/dashboard/student" className="hover:text-accent">Student</Link>}
            {roles.includes("tutor") && <Link to="/dashboard/tutor" className="hover:text-accent">Tutor</Link>}
            {roles.includes("admin") && <Link to="/dashboard/admin" className="hover:text-accent">Admin</Link>}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-muted-foreground">{user?.email}</span>
            <button onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="rounded-full border border-ink/20 px-4 py-1.5 text-xs font-semibold hover:bg-accent hover:text-accent-foreground">
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-display text-4xl md:text-5xl font-semibold">{title}</h1>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-ink rounded-2xl bg-card p-6 border border-ink/15">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-4xl">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
