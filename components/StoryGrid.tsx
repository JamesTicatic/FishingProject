'use client';
import { useState } from 'react';
import StoryCard from './StoryCard';
import { FishingStory } from '@/data/stories';
import { SPECIES_LIST } from '@/data/species';
import { GEAR_LIST } from '@/data/gear';

export default function StoryGrid({ initialStories }: { initialStories: FishingStory[] }) {
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [selectedGear, setSelectedGear] = useState('All');

  const filteredStories = initialStories.filter(story => {
    const matchesSpecies = selectedSpecies === 'All' || story.species.includes(selectedSpecies);
    const matchesGear = selectedGear === 'All' || story.gear.includes(selectedGear);
    return matchesSpecies && matchesGear;
  });

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
            Explore all the stories by species and used gear.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="gridSpeciesFilter" className="sr-only">
            Filter Species:
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

          <label htmlFor="gridGearFilter" className="sr-only">
            Filter Gear:
          </label>
          <select 
            id="gridGearFilter"
            value={selectedGear}
            onChange={(e) => setSelectedGear(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block px-3 py-2 outline-none transition-colors"
          >
            <option value="All">All Gear</option>
            {GEAR_LIST.map((gear) => (
              <option key={gear} value={gear}>{gear}</option>
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
            No stories found matching your selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
