import { getAllStories } from "@/data/stories";
import StoryGrid from "@/components/StoryGrid";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const stories = getAllStories();

  return (
    <main className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-10 pb-24 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-10 mt-2">
            Adventures of James Ticatic Fishing
          </h1>

          <div className="w-full max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl border border-emerald-700/30">
            <img 
              src="https://acgy0tm5uubdnyxg.public.blob.vercel-storage.com/Jamesfish.jpg" 
              alt="Frontpage Fishing"
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-10">
            Real angling narratives from Maine salt rips to high-country Colorado fly rodding and everything in between.
          </p>
          
          <div className="max-w-2xl mx-auto mt-8 text-left">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Stories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <StoryGrid initialStories={stories} />
      </section>
    </main>
  );
}
