import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: (data.title ?? slug) as string,
    date: (data.date ?? "") as string,
    tags: (data.tags ?? []) as string[],
    content,
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;

  const post = getPost(slug);
  if (!post) return notFound();

  return (
    <div className="space-y-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm sm:text-base text-zinc-600 hover:text-zinc-900 hover:underline"
      >
        <span aria-hidden>←</span> Back to Blog
      </Link>

      {/* Centered header */}
      <header className="mx-auto max-w-4xl text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm text-zinc-500">
          {post.date ? <span>{post.date}</span> : null}
          {post.tags.length ? <span>•</span> : null}
          {post.tags.map((t) => (
            <span key={t} className="rounded-full border px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="border-t max-w-4xl mx-auto" />

      {/* Centered readable content */}
      <article className="prose prose-lg lg:prose-xl mx-auto text-justify">
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}