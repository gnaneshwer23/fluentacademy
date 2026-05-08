import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/login-context";

export const Route = createFileRoute("/_auth")({
  component: Guard,
});

function Guard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);
  if (loading || !user) return <div className="min-h-screen bg-background p-12 text-center text-muted-foreground">Loading…</div>;
  return <Outlet />;
}
