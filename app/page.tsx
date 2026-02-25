import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import matter from "gray-matter";

type CardItem = {
  title: string;
  description: string;
  href: string;
  meta?: string;
  thumbnail?: string;
};

function getRecentPosts(limit = 4): CardItem[] {
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
        title: (data.title ?? slug) as string,
        date: (data.date ?? "") as string,
        tags: (data.tags ?? []) as string[],
        summary: (data.summary ?? "") as string,
        thumbnail: (data.thumbnail ?? "") as string,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);

  return posts.map((p) => ({
    title: p.title,
    description: p.summary,
    href: `/blog/${p.slug}`,
    meta: `${p.date}${p.tags?.length ? ` · ${p.tags[0]}` : ""}`,
    thumbnail: p.thumbnail,
  }));
}

function getHighlightedProjects(limit = 4): CardItem[] {
  const dir = path.join(process.cwd(), "content/projects");
  const files = fs.readdirSync(dir);

  const projects = files
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        summary: data.summary ?? "",
        tags: data.tags ?? [],
        thumbnail: data.thumbnail ?? "",
        featured: Boolean(data.featured ?? false),
        order:
          typeof data.order === "number"
            ? data.order
            : data.order
              ? Number(data.order)
              : undefined,
      };
    });

  projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;

    const ao = a.order ?? 9999;
    const bo = b.order ?? 9999;
    if (ao !== bo) return ao - bo;

    return a.date < b.date ? 1 : -1;
  });

  return projects.slice(0, limit).map((p) => ({
    title: p.title,
    description: p.summary,
    href: `/projects/${p.slug}`,
    meta: p.featured ? "Featured Project" : p.date,
    thumbnail: p.thumbnail,
  }));
}

function SectionHeader({
  title,
  subtitle,
  href,
  hrefLabel,
}: {
  title: string;
  subtitle: string;
  href: string;
  hrefLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-600">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-zinc-900 hover:underline"
      >
        {hrefLabel}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function Card({ item }: { item: CardItem }) {
  return (
    <Link
      href={item.href}
      className="group rounded-2xl border bg-white overflow-hidden shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {item.thumbnail ? (
        <div className="relative h-40 sm:h-44 lg:h-48 w-full">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-40 sm:h-44 lg:h-48 w-full bg-zinc-100" />
      )}

      <div className="p-5 sm:p-6 lg:p-7 flex flex-col">
        {/* Meta */}
        <div className="text-xs sm:text-sm lg:text-base text-zinc-500">
          {item.meta}
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base sm:text-lg lg:text-xl font-semibold text-zinc-900 group-hover:underline">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 lg:leading-8 text-zinc-600">
          {item.description}
        </p>

        {/* CTA */}
        <div className="mt-4 text-sm sm:text-base lg:text-lg font-medium text-zinc-900">
          Read more <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const recentPosts = getRecentPosts(4);
  const highlightProjects = getHighlightedProjects(4);

  return (
    <div className="space-y-12 sm:space-y-14">
      {/* Banner */}
      <section className="rounded-3xl bg-[#EDF2F7] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col items-center text-center gap-6 md:flex-row md:items-center md:justify-between md:text-left">
          {/* Left block */}
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6 w-full md:w-auto">
            {/* Photo */}
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-3xl bg-zinc-100">
              <Image
                src="/oshi.jpeg"
                alt="Oshani profile photo"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>

            {/* Name + links */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-semibold tracking-tight">
                Oshani Jayawardane
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-zinc-700">
                Research Assistant | Embry-Riddle Aeronautical University
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2 text-sm sm:text-base">
                <a
                  className="rounded-full bg-white/80 px-4 py-2 hover:bg-white"
                  href="https://www.linkedin.com/in/oshani-jayawardane-267089153"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="rounded-full bg-white/80 px-4 py-2 hover:bg-white"
                  href="https://github.com/oshani-jayawardane"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="rounded-full bg-white/80 px-4 py-2 hover:bg-white"
                  href="https://scholar.google.com/citations?hl=en&user=iuwE7VMAAAAJ"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Scholar
                </a>
                <a
                  // className="rounded-full bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-800"
                  className="rounded-full bg-white/80 px-4 py-2 hover:bg-white"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </a>
              </div>
            </div>
          </div>

          {/* Right block */}
          <div className="max-w-md text-sm sm:text-base leading-6 sm:leading-7 text-zinc-700">
            <p>
              Hello Reader ! Welcome to my mind palace. This is where I think out loud. About work, about life, and about the strangest little things that I notice and refuse to stay quiet. And I choose you to share it with!
            </p>
          </div>
        </div>
      </section>

      {/* Recent blogs */}
      <section className="space-y-5 sm:space-y-6">
        <SectionHeader
          title="Recent posts"
          subtitle="The latest from Miss O’s Thought Dump."
          href="/blog"
          hrefLabel="More posts"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentPosts.map((item) => (
            <Card key={item.href} item={item} />
          ))}
        </div>
      </section>

      {/* Highlight projects */}
      <section className="space-y-5 sm:space-y-6">
        <SectionHeader
          title="Highlighted projects"
          subtitle="A few things I worked on."
          href="/projects"
          hrefLabel="More projects"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlightProjects.map((item) => (
            <Card key={item.href} item={item} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 text-sm sm:text-base text-zinc-600">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Oshani Jayawardane</p>
          <div className="flex gap-5">
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
