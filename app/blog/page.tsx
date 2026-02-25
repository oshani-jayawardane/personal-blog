import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import matter from "gray-matter";

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  thumbnail?: string;
};

function getPosts(): Post[] {
  const dir = path.join(process.cwd(), "content/blog");
  const files = fs.readdirSync(dir);

  const posts = files
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        tags: data.tags ?? [],
        summary: data.summary ?? "",
        thumbnail: data.thumbnail ?? "",
      };
    });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="space-y-10">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm sm:text-base lg:text-lg text-zinc-600 hover:text-zinc-900 hover:underline"
      >
        <span aria-hidden>←</span> Back to Home
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
          Miss O’s Thought Dump
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-zinc-600">
          Thoughts, interesting facts, reviews, ideas.
        </p>
      </header>

      <div className="border-t" />

      {/* Posts */}
      <div className="space-y-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-6 rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Thumbnail */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-zinc-100">
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : null}
            </div>

            {/* Content */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm lg:text-base text-zinc-500">
                <span>{post.date}</span>
                {post.tags?.length ? <span>•</span> : null}
                {post.tags?.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>

              <h2 className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold text-zinc-900 group-hover:underline">
                {post.title}
              </h2>

              <p className="mt-3 line-clamp-2 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 lg:leading-8 text-zinc-600">
                {post.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}