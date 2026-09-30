import { getAllStories } from "@/data/stories";
import StoryCard from "@/components/StoryCard";

export default function HomePage() {
  const stories = getAllStories();

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-600/40 mb-6 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            OpenSearch Content Corpus Ready
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Adventures of James Ticatic Fishing
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-10">
            Real field reports and angling narratives from Maine salt rips to high-country Colorado fly rodding and everything in between.
          </p>

          {/* Quick Metrics Bar */}
          <div className="gap-4 max-w-2xl mx-auto pt-6 border-t border-emerald-800/60 text-center">
            <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/40">
              <div className="text-2xl font-bold text-white">{stories.length}</div>
              <div className="text-xs text-emerald-300 font-medium">Documented Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Featured Field Narratives
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore curated logs by species, location, used gear and article content.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              Showing {stories.length} entries
            </span>
          </div>

          {/* Responsive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
