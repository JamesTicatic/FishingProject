'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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
          <h3 className="font-semibold text-slate-800 mb-4">Vector Search Results</h3>
          {results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((res) => (
                <li key={res.story_id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-medium text-emerald-800">{res.title}</h4>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{res.excerpt}</p>
                  <div className="text-xs text-emerald-600 mt-2 font-medium">Similarity: {(res.similarity * 100).toFixed(1)}%</div>
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
