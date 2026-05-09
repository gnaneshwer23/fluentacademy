import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

type Role = "admin" | "tutor" | "parent" | "student";

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; role?: Role }[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/parent", label: "Parent", icon: Users, role: "parent" },
  { to: "/dashboard/student", label: "Student", icon: GraduationCap, role: "student" },
  { to: "/dashboard/tutor", label: "Tutor", icon: BookOpen, role: "tutor" },
  { to: "/dashboard/admin", label: "Admin", icon: Shield, role: "admin" },
  { to: "/dashboard/users", label: "Onboarding", icon: Users, role: "admin" },
];

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const items = NAV.filter((n) => !n.role || roles.includes(n.role) || roles.includes("admin"));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-ink/10 flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-ink/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg font-bold">
            F
          </div>
          <span className="font-display text-xl font-semibold">Fluent</span>
        </Link>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {items.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-ink/10">
          <div className="px-2 mb-3">
            <div className="text-xs text-muted-foreground">Signed in as</div>
            <div className="text-sm font-medium truncate">{user?.email}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {roles.map((r) => (
                <span
                  key={r}
                  className="text-[10px] uppercase tracking-wider bg-accent/30 px-2 py-0.5 rounded-full"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-ink/15 hover:bg-secondary transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 h-14 px-4 flex items-center justify-between bg-background/90 backdrop-blur border-b border-ink/10">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-secondary">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-display text-lg font-semibold">Fluent</span>
          <div className="w-9" />
        </header>

        <main className="px-6 lg:px-10 py-8 lg:py-12 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold">{title}</h1>
              {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  icon?: typeof LayoutDashboard;
}) {
  const trendColor =
    trend === "up"
      ? "text-emerald-700"
      : trend === "down"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <div className="rounded-2xl bg-card p-5 border border-ink/10 hover:border-ink/20 transition">
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-accent/30 flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold">{value}</div>
      {sub && <div className={`mt-1 text-xs ${trendColor}`}>{sub}</div>}
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display text-2xl">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-card border border-ink/10 p-6 ${className}`}>{children}</div>
  );
}
