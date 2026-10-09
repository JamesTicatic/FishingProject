'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllStories } from '@/data/stories';

const storiesList = getAllStories();

const getStorySlug = (res: any) => {
  if (res.slug) return res.slug;
  const match = storiesList.find(s => s.id === res.story_id || s.title === res.title);
  return match ? match.slug : res.story_id;
};

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [resultsChunked, setResultsChunked] = useState<any[]>([]);
  const [resultsFull, setResultsFull] = useState<any[]>([]);
  const [resultsLexical, setResultsLexical] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const [resChunked, resFull, resLexical] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(query)}`),
        fetch(`/api/search-full?q=${encodeURIComponent(query)}`),
        fetch(`/api/search-lexical?q=${encodeURIComponent(query)}`)
      ]);

      const parseJson = async (res: Response) => {
        try {
          if (!res.ok) return { results: [] };
          return await res.json();
        } catch {
          return { results: [] };
        }
      };

      const [dataChunked, dataFull, dataLexical] = await Promise.all([
        parseJson(resChunked),
        parseJson(resFull),
        parseJson(resLexical)
      ]);

      setResultsChunked(dataChunked.results || []);
      setResultsFull(dataFull.results || []);
      setResultsLexical(dataLexical.results || []);
    } catch (err) {
      console.error(err);
      setResultsChunked([]);
      setResultsFull([]);
      setResultsLexical([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Search Comparison Dashboard
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Compare the effectiveness of search methods.
          </p>
        </div>

        {/* Information Block */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-12 text-sm text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="font-bold text-emerald-800 text-base mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Keyword Search
              </h3>
              <p className="leading-relaxed">
                Traditional search looks for literal, word-for-word text matches. Searching "boat" will miss stories mentioning "skiff" or "kayak" because the exact word isn't in the text.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-emerald-800 text-base mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Semantic Search
              </h3>
              <p className="leading-relaxed">
                Semantic search turns text into a <strong>vector</strong>: a list of numbers representing the meaning of the text. It measures how close meanings are, so searching "boat" can match "skiff" or "vessel".
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-emerald-800 text-base mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                Ingestion &amp; Search
              </h3> 
              <p className="leading-relaxed">
                <strong>Ingestion</strong> happens ahead of time: its when data to be searched turns into vectors and is saved to be compared against. 
                <strong>Search</strong> turns your query into a vector and finds the nearest matches from the ingested data.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-emerald-800 text-base mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Full vs. Chunked
              </h3>
              <p className="leading-relaxed">
                <strong>Full-Article</strong> embeddings ingest the entire article, diluting specific details. 
                <strong>Chunking</strong> embeds individual paragraphs so the ingested data is richer since it contains less text.
              </p>
            </div>
          </div>
        </div>

        {/* Try It Out Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Try It Out</h2>
          <p className="text-sm text-slate-500 mt-1">
            Test a query across Lexical (Keyword), Chunked Vector, and Full Article Vector search models in real time.
          </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lexical / Keyword Search Results */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h2 className="text-xl font-bold text-slate-800">Lexical (Keyword)</h2>
                <span className="ml-auto text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Word Matching
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Matches literal words and displays total occurrence counts.</p>
              
              {resultsLexical.length > 0 ? (
                <ul className="space-y-6">
                  {resultsLexical.map((res) => (
                    <li key={res.story_id} className="border border-slate-100 p-4 rounded-xl bg-slate-50">
                      <Link href={`/stories/${getStorySlug(res)}`} className="font-semibold text-emerald-700 hover:underline">
                        {res.title}
                      </Link>
                      <p className="text-sm text-slate-700 mt-3 italic line-clamp-4">"{res.chunk_text}"</p>
                      <div className="text-xs text-blue-700 mt-3 font-medium bg-blue-50 border border-blue-200 inline-block px-2.5 py-1 rounded-md">
                        Occurrences: {res.match_count}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">{loading ? 'Searching keywords...' : 'No keyword matches found.'}</p>
              )}
            </div>

            {/* Chunked Search Results */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h2 className="text-xl font-bold text-slate-800">Chunked (Semantic)</h2>
                <span className="ml-auto text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-800 rounded">
                  Highly Accurate
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Matches paragraph concepts and displays vector similarity score.</p>
              
              {resultsChunked.length > 0 ? (
                <ul className="space-y-6">
                  {resultsChunked.map((res) => (
                    <li key={res.story_id} className="border border-slate-100 p-4 rounded-xl bg-slate-50">
                      <Link href={`/stories/${getStorySlug(res)}`} className="font-semibold text-emerald-700 hover:underline">
                        {res.title}
                      </Link>
                      <p className="text-sm text-slate-700 mt-3 italic line-clamp-4">"{res.chunk_text}"</p>
                      <div className="text-xs text-emerald-700 mt-3 font-medium bg-emerald-50 border border-emerald-200 inline-block px-2.5 py-1 rounded-md">
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
                <h2 className="text-xl font-bold text-slate-800">Full Article (Semantic)</h2>
                <span className="ml-auto text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  Legacy / Baseline
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Matches average whole-story concept and displays similarity score.</p>
              
              {resultsFull.length > 0 ? (
                <ul className="space-y-6">
                  {resultsFull.map((res) => (
                    <li key={res.story_id} className="border border-slate-100 p-4 rounded-xl bg-slate-50 opacity-90">
                      <Link href={`/stories/${getStorySlug(res)}`} className="font-semibold text-emerald-700 hover:underline">
                        {res.title}
                      </Link>
                      <p className="text-sm text-slate-600 mt-3 line-clamp-4">{res.excerpt}</p>
                      <div className="text-xs text-slate-700 mt-3 font-medium bg-slate-100 border border-slate-200 inline-block px-2.5 py-1 rounded-md">
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
