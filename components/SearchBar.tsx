'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllStories } from '@/data/stories';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const storiesList = getAllStories();

  const getStorySlug = (res: any) => {
    if (res.slug) return res.slug;
    const match = storiesList.find(s => s.id === res.story_id || s.title === res.title);
    return match ? match.slug : res.story_id;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (activeTooltipId && !(e.target as HTMLElement).closest('.tooltip-container')) {
        setActiveTooltipId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [activeTooltipId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto my-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search (e.g., 'pier gotcha fishing', 'winter dry fly')"
          className="flex-1 px-4 py-3 bg-white rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-70"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Search Results</h3>
          {results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((res) => (
                <li key={res.story_id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-semibold text-emerald-800 hover:text-emerald-600 transition-colors">
                    <Link href={`/stories/${getStorySlug(res)}`} className="hover:underline">
                      {res.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-slate-600 mt-2 italic line-clamp-3">"{res.chunk_text}"</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="text-xs text-emerald-600 font-medium">
                      Similarity: {(res.similarity * 100).toFixed(1)}%
                    </div>
                    
                    <div className="tooltip-container group relative flex items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTooltipId(activeTooltipId === res.story_id ? null : res.story_id);
                        }}
                        className="text-emerald-400 hover:text-emerald-600 focus:outline-none transition-colors"
                        aria-label="More information on similarity score"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <div
                        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-800 text-white text-xs rounded-lg shadow-lg text-center z-10 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-800 pb-3 ${
                          activeTooltipId === res.story_id ? 'block' : 'hidden group-hover:block'
                        }`}
                      >
                        Want to learn more about what this means? <br/>
                        <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 mt-1 inline-block">
                          Go to Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">{loading ? 'Searching vector space...' : 'No results found.'}</p>
          )}
        </div>
      )}
    </div>
  );
}
