import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function MarketingShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="page-shell">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <header className="site-header-connectd scrolled border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Fluent<span className="text-primary">.</span>
          </Link>
          <Link to="/book-demo" className="btn-connectd btn-connectd-sm">
            Book a demo
          </Link>
        </div>
      </header>
      <main className="hero-connectd px-6 py-16 md:py-20">
        <div className="mx-auto max-w-xl">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary">
            ← Back to home
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
