import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-emerald-950/95 backdrop-blur-md text-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/30 group-hover:bg-emerald-500 transition-colors">
              {/* Fishing Hook & Wave SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4H8a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h2" />
                <circle cx="16" cy="4" r="2" />
                <path d="M7 16l3 3-3 3" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight block text-white group-hover:text-emerald-200 transition-colors">
                Cast &amp; Catch Stories
              </span>
              <span className="hidden sm:block text-xs text-emerald-400 font-medium tracking-wide uppercase">
                The Angler&apos;s Field Journal
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-emerald-100 hover:text-white transition-colors"
            >
              Home
            </Link>
            <a
              href="https://github.com/JamesTicatic/FishingProject#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-100 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Docs / README</span>
            </a>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors border border-emerald-700/50"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Search API
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
