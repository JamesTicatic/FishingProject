'use client';
import { useState } from 'react';
import StoryCard from './StoryCard';
import { FishingStory } from '@/data/stories';
import { SPECIES_LIST } from '@/data/species';

export default function StoryGrid({ initialStories }: { initialStories: FishingStory[] }) {
  const [selectedSpecies, setSelectedSpecies] = useState('All');

  const filteredStories = selectedSpecies === 'All' 
    ? [...initialStories] 
    : initialStories.filter(story => story.species.includes(selectedSpecies));

  // Sort descending (newest first)
  filteredStories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
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
        
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="gridSpeciesFilter" className="text-sm font-medium text-slate-700">
            Filter:
          </label>
          <select 
            id="gridSpeciesFilter"
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block px-3 py-2 outline-none transition-colors"
          >
            <option value="All">All Species</option>
            {SPECIES_LIST.map((sp) => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            {filteredStories.length} {filteredStories.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {filteredStories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
        {filteredStories.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No stories found for the selected species.
          </div>
        )}
      </div>
    </div>
  );
}
