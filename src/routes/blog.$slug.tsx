import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  component: Post,
});

interface PostData {
  title: string;
  content: string;
  cover_emoji: string | null;
  author: string | null;
  created_at: string;
}

function Post() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<PostData | null>(null);
  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => setPost(data as PostData | null));
  }, [slug]);
  if (!post)
    return (
      <div className="min-h-screen bg-background p-12 text-center text-muted-foreground">
        Loading…
      </div>
    );
  return (
    <article className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-accent">
          ← All articles
        </Link>
        <div className="mt-8 text-6xl">{post.cover_emoji}</div>
        <h1 className="mt-6 font-display text-4xl md:text-6xl font-semibold leading-tight">
          {post.title}
        </h1>
        <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
          {post.author} · {new Date(post.created_at).toLocaleDateString()}
        </div>
        <div className="prose prose-lg mt-10 whitespace-pre-wrap text-foreground">
          {post.content}
        </div>
      </div>
    </article>
  );
}
