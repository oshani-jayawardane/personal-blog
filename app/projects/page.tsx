import fs from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";
import matter from "gray-matter";

type Project = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  thumbnail?: string;
  featured: boolean;
  order?: number;
};

function getProjects(): Project[] {
  const dir = path.join(process.cwd(), "content/projects");
  const files = fs.readdirSync(dir);

  const projects: Project[] = files
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);

      const order =
        typeof data.order === "number"
          ? data.order
          : data.order
          ? Number(data.order)
          : undefined;

      return {
        slug,
        title: (data.title ?? slug) as string,
        date: (data.date ?? "") as string,
        summary: (data.summary ?? "") as string,
        tags: (data.tags ?? []) as string[],
        thumbnail: (data.thumbnail ?? "") as string,
        featured: Boolean(data.featured ?? false),
        order,
      };
    });

  projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;

    const ao = a.order ?? 9999;
    const bo = b.order ?? 9999;
    if (ao !== bo) return ao - bo;

    return a.date < b.date ? 1 : -1;
  });

  return projects;
}

export default function ProjectsPage() {
  const projects = getProjects();

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
          Projects
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-zinc-600">
          Technical Projects and Publications
        </p>
      </header>

      <div className="border-t" />

      {/* Projects list */}
      <div className="space-y-8">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group flex gap-6 rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Thumbnail */}
            <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-xl border bg-zinc-100">
              {p.thumbnail ? (
                <Image
                  src={p.thumbnail}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              ) : null}
            </div>

            {/* Content */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm lg:text-base text-zinc-500">
                {p.featured ? (
                  <span className="rounded-full border px-2 py-0.5">
                    Featured
                  </span>
                ) : null}
                {p.date ? <span>{p.date}</span> : null}
              </div>

              <h2 className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold text-zinc-900 group-hover:underline">
                {p.title}
              </h2>

              <p className="mt-3 line-clamp-2 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 lg:leading-8 text-zinc-600">
                {p.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-2 py-0.5 text-xs sm:text-sm lg:text-base text-zinc-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}