import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_auth")({
  component: Guard,
});

function Guard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);
  if (loading || !user) return <div className="min-h-screen bg-background p-12 text-center text-muted-foreground">Loading…</div>;
  return <Outlet />;
}
