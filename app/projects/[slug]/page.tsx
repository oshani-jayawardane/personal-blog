import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

type Params = Promise<{ slug: string }>;

type ProjectMeta = {
  title: string;
  date?: string;
  summary?: string;
  tags?: string[];
  thumbnail?: string;
  featured?: boolean;
  order?: number;
  github?: string;
  demo?: string;
  paper?: string;
};

function getProject(slug: string) {
  const filePath = path.join(process.cwd(), "content/projects", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const meta: ProjectMeta = {
    title: (data.title ?? slug) as string,
    date: (data.date ?? "") as string,
    summary: (data.summary ?? "") as string,
    tags: (data.tags ?? []) as string[],
    thumbnail: (data.thumbnail ?? "") as string,
    featured: Boolean(data.featured ?? false),
    order:
      typeof data.order === "number"
        ? data.order
        : data.order
          ? Number(data.order)
          : undefined,
    github: (data.github ?? "") as string,
    demo: (data.demo ?? "") as string,
    paper: (data.paper ?? "") as string,
  };

  return { slug, meta, content };
}

function ActionLink({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border px-4 py-2 text-sm sm:text-base hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;

  const project = getProject(slug);
  if (!project) return notFound();

  const { meta, content } = project;

  return (
    <div className="space-y-10">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm sm:text-base text-zinc-600 hover:text-zinc-900 hover:underline"
      >
        <span aria-hidden>←</span> Back to Projects
      </Link>

      {/* Centered header (same style as blog) */}
      <header className="mx-auto max-w-4xl text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold tracking-tight">
          {meta.title}
        </h1>

        {meta.summary ? (
          <p className="mx-auto max-w-3xl text-sm sm:text-base leading-6 sm:leading-7 text-zinc-600">
            {meta.summary}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm text-zinc-500">
          {meta.featured ? (
            <span className="rounded-full border px-2 py-0.5">Featured</span>
          ) : null}
          {meta.date ? <span>{meta.date}</span> : null}
          {meta.tags?.length ? <span>•</span> : null}
          {meta.tags?.map((t) => (
            <span key={t} className="rounded-full border px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <ActionLink href={meta.github ?? ""} label="GitHub" />
          <ActionLink href={meta.demo ?? ""} label="Demo" />
          <ActionLink href={meta.paper ?? ""} label="Paper" />
        </div>
      </header>

      <div className="border-t max-w-4xl mx-auto" />

      {/* Centered readable content */}
      <article className="prose prose-lg lg:prose-xl mx-auto text-justify">
        <MDXRemote source={content} />
      </article>
      {/* <article className="mx-auto max-w-4xl text-justify space-y-6">
        <MDXRemote source={content} />
      </article> */}
    </div>
  );
}
