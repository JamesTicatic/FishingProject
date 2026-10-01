'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [resultsChunked, setResultsChunked] = useState<any[]>([]);
  const [resultsFull, setResultsFull] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const [resChunked, resFull] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(query)}`),
        fetch(`/api/search-full?q=${encodeURIComponent(query)}`)
      ]);

      const dataChunked = await resChunked.json();
      const dataFull = await resFull.json();

      setResultsChunked(dataChunked.results || []);
      setResultsFull(dataFull.results || []);
    } catch (err) {
      console.error(err);
      setResultsChunked([]);
      setResultsFull([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Vector Search Comparison Dashboard
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Compare the effectiveness of standard full-article embeddings vs paragraph chunking.
          </p>
        </div>

        {/* Information Block */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-12 text-sm text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-emerald-800 text-base mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Semantic Search
              </h3>
              <p className="leading-relaxed">
                Unlike traditional keyword search, semantic search uses AI to understand the <em>meaning</em> of text. It translates text into high-dimensional coordinates (vectors). When you search, the system finds results that are mathematically closest to your query in "concept space."
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-emerald-800 text-base mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                Ingestion &amp; Search
              </h3>
              <p className="leading-relaxed">
                <strong>Ingestion</strong> happens ahead of time: the AI (Gemini) reads your stories, generates vectors, and saves them to a database (Postgres). 
                <strong>Search</strong> happens in real-time: your query is instantly turned into a vector to find the nearest matching database entries.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-emerald-800 text-base mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Full vs. Chunked
              </h3>
              <p className="leading-relaxed">
                <strong>Full-Article</strong> embeddings capture the <em>average</em> meaning of a whole story, which dilutes specific details. <br/>
                <strong>Chunking</strong> breaks stories into paragraphs and embeds them individually. This preserves fine details and allows the search to pinpoint highly specific concepts.
              </p>
            </div>
          </div>

          {/* ELI5 Metaphor */}
          <div className="mt-8 p-5 bg-emerald-50/80 border border-emerald-100 rounded-xl text-emerald-900">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span>🥤</span> The Smoothie Metaphor (Explain Like I&apos;m 5)
            </h4>
            <p className="leading-relaxed">
              Imagine taking a giant 5-course meal (a whole story) and throwing it into a blender. If someone tastes the resulting smoothie and asks, <em>"Are there carrots in this?"</em>, it's really hard to tell because the carrot flavor is diluted by the steak, potatoes, and cake. That's a <strong>Full-Article</strong> embedding. 
              <br/><br/>
              Now imagine putting every single ingredient into its own separate little bowl. If someone asks for carrots, you can instantly point to the exact bowl holding just carrots. That's <strong>Chunking</strong>!
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto mb-12">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a specific detail (e.g., 'acrobatic fish')"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chunked Search Results */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h2 className="text-xl font-bold text-slate-800">Chunked Search</h2>
                <span className="ml-auto text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
                  Highly Accurate
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Excerpt below article shows exact paragraph that matched your search.</p>
              
              {resultsChunked.length > 0 ? (
                <ul className="space-y-6">
                  {resultsChunked.map((res) => (
                    <li key={res.story_id} className="border border-slate-100 p-4 rounded-xl bg-slate-50">
                      <Link href={`/stories/${res.story_id.replace('story-', '')}`} className="font-semibold text-emerald-700 hover:underline">
                        {res.title}
                      </Link>
                      <p className="text-sm text-slate-700 mt-3 italic line-clamp-4">"{res.chunk_text}"</p>
                      <div className="text-xs text-slate-500 mt-3 font-medium bg-slate-200/50 inline-block px-2 py-1 rounded">
                        Similarity: {(res.similarity * 100).toFixed(1)}%
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">{loading ? 'Searching vector space...' : 'No results found.'}</p>
              )}
            </div>

            {/* Full Search Results */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <h2 className="text-xl font-bold text-slate-800">Full Article Search</h2>
                <span className="ml-auto text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  Legacy / Baseline
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Matches the average semantic meaning of the entire story.</p>
              
              {resultsFull.length > 0 ? (
                <ul className="space-y-6">
                  {resultsFull.map((res) => (
                    <li key={res.story_id} className="border border-slate-100 p-4 rounded-xl bg-slate-50 opacity-80">
                      <Link href={`/stories/${res.story_id.replace('story-', '')}`} className="font-semibold text-emerald-700 hover:underline">
                        {res.title}
                      </Link>
                      <p className="text-sm text-slate-600 mt-3 line-clamp-4">{res.excerpt}</p>
                      <div className="text-xs text-slate-500 mt-3 font-medium bg-slate-200/50 inline-block px-2 py-1 rounded">
                        Similarity: {(res.similarity * 100).toFixed(1)}%
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">{loading ? 'Searching vector space...' : 'No results found.'}</p>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
