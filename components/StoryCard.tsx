import Link from "next/link";
import { FishingStory } from "@/data/stories";

interface StoryCardProps {
  story: FishingStory;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 overflow-hidden group">
      <div className="p-6 flex flex-col flex-1">
        {/* Top Badges: Location & Read Time */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 text-emerald-600"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {story.location}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight mb-2">
          <Link href={`/stories/${story.slug}`} className="focus:outline-none focus:underline">
            {story.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-1">
          {story.excerpt}
        </p>

        {/* Species Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {story.species.map((sp) => (
            <span
              key={sp}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              🐟 {sp}
            </span>
          ))}
        </div>

        {/* Card Footer: Date, Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span className="mx-1.5">•</span>
            <time dateTime={story.date}>{story.date}</time>
          </div>
          <Link
            href={`/stories/${story.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
          >
            Read Story
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
