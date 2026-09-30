import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStories, getStoryBySlug } from "@/data/stories";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const stories = getAllStories();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Story Not Found | Cast & Catch Stories",
    };
  }

  return {
    title: `${story.title} | Cast & Catch Stories`,
    description: story.excerpt,
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const paragraphs = story.content.split("\n\n").filter(Boolean);

  return (
    <main className="min-h-screen pb-20">
      {/* Article Header & Breadcrumbs */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Stories
            </Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-xs sm:max-w-md">
              {story.title}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 text-emerald-400"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {story.location}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <time className="text-xs text-slate-400" dateTime={story.date}>
              {story.date}
            </time>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {story.title}
          </h1>

          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {story.excerpt}
          </p>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Story Body */}
          <article className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            {story.coverImage && (
              <figure className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={story.coverImage.url}
                    alt={story.coverImage.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 750px"
                    className="object-cover"
                  />
                </div>
                {story.coverImage.caption && (
                  <figcaption className="px-4 py-2.5 text-xs text-slate-500 italic bg-slate-50 border-t border-slate-100">
                    {story.coverImage.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base sm:text-lg">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "text-lg sm:text-xl font-serif text-slate-900 leading-relaxed first-letter:text-8xl first-letter:font-bold first-letter:text-emerald-700 first-letter:mr-3 first-letter:float-left mb-6"
                      : "mb-6 text-slate-700 font-serif leading-relaxed"
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            {/* End of Story Navigation */}
            <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to All Stories
              </Link>

              <a
                href="/api/stories"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium underline"
              >
                View this corpus in JSON API →
              </a>
            </div>
          </article>

          {/* Metadata Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-emerald-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Field Metadata
              </h2>

              <dl className="space-y-6 text-sm divide-y divide-slate-100">
                {/* Location */}
                <div className="pt-2">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Location
                  </dt>
                  <dd className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-emerald-600 flex-shrink-0"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{story.location}</span>
                  </dd>
                </div>

                {/* Species */}
                <div className="pt-4">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Target Species
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {story.species.map((sp) => (
                      <span
                        key={sp}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        🐟 {sp}
                      </span>
                    ))}
                  </dd>
                </div>

                {/* Gear Used */}
                <div className="pt-4">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Gear Used
                  </dt>
                  <dd>
                    <ul className="space-y-2 text-slate-700">
                      {story.gear.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>

                {/* Published Date */}
                <div className="pt-4">
                  <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Recorded Date
                  </dt>
                  <dd className="text-slate-800 font-medium">
                    {story.date}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
