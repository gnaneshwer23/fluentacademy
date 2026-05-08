import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "Blog · Fluent Resources" }] }),
  component: Blog,
});

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_emoji: string | null;
  author: string | null;
  created_at: string;
}

function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts((data ?? []) as Post[]));
  }, []);
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-accent">
          ← Back to home
        </Link>
        <h1 className="mt-6 font-display text-5xl font-semibold">Resources</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Articles on confidence, learning, and parenting confident kids.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="card-ink rounded-3xl bg-card p-6 border border-ink/15 hover:border-accent transition"
            >
              <div className="text-4xl">{p.cover_emoji}</div>
              <h2 className="mt-4 font-display text-xl">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
              <div className="mt-4 text-xs uppercase tracking-widest text-accent-foreground/70">
                {p.author}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
