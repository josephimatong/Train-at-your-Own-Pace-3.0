/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trophy, Medal, Search, Flame, ArrowUp } from 'lucide-react';
import { LeaderboardEntry, Language, TRANSLATIONS } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentLanguage: Language;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];
  const [siteFilter, setSiteFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all unique sites for filtering
  const sites = ['All', ...Array.from(new Set(entries.map((e) => e.site)))];

  const filteredEntries = entries
    .filter((entry) => {
      const matchesSite = siteFilter === 'All' || entry.site === siteFilter;
      const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            entry.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSite && matchesSearch;
    })
    // Re-rank filtered entries or keep overall rankings
    .sort((a, b) => b.xp - a.xp);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-400 fill-amber-900/10 animate-bounce" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300 fill-slate-900/10" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600 fill-amber-900/10" />;
      default:
        return <span className="font-mono text-xs font-bold text-slate-500 w-5 text-center">{rank}</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      
      {/* Leaderboard Header Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-6 text-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-white fill-current" />
            {t.leaderboard}
          </h3>
          <p className="text-xs text-cyan-100 font-medium">Gamified safety & professional excellence rankings</p>
        </div>
        <div className="bg-slate-950/20 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono font-bold flex items-center gap-1">
          <Flame className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span>Active Streak: 5 Days</span>
        </div>
      </div>

      {/* Filtering Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
        
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="leaderboard-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees or roles..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Site Filter Dropdown */}
        <div className="w-full sm:w-auto">
          <select
            id="leaderboard-site-filter"
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {sites.map((site) => (
              <option key={site} value={site}>
                {site === 'All' ? 'All Sites' : site}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Leaderboard Grid list */}
      <div className="divide-y divide-slate-800/60 overflow-x-auto">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-955 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-b border-slate-800">
              <th className="py-3 px-6 w-16 text-center">Rank</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Project Site</th>
              <th className="py-3 px-4">Earned Badges</th>
              <th className="py-3 px-4 text-center">Modules</th>
              <th className="py-3 px-6 text-right">Training XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filteredEntries.map((entry, index) => {
              const isSelf = entry.isCurrentUser;
              return (
                <tr
                  key={entry.name}
                  className={`transition-colors ${
                    isSelf 
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15 font-semibold text-cyan-200' 
                      : 'hover:bg-slate-850 text-slate-300'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center">
                      {getRankBadge(entry.rank)}
                    </div>
                  </td>

                  {/* Employee Name & Role */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isSelf ? 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {entry.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm tracking-tight flex items-center gap-1.5 font-bold">
                          {entry.name}
                          {isSelf && (
                            <span className="text-[9px] bg-cyan-600 text-white font-mono rounded px-1.5 py-0.2 animate-pulse uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${isSelf ? 'text-cyan-400/80 font-medium' : 'text-slate-500'}`}>
                          {entry.role}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Site */}
                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold">{entry.site}</span>
                  </td>

                  {/* Badges */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {entry.badges.map((badge) => (
                        <span
                          key={badge}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-850/90 text-slate-300 border border-slate-800 shadow-sm"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Completions */}
                  <td className="py-4 px-4 text-center">
                    <span className="text-xs font-mono font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {entry.completions}
                    </span>
                  </td>

                  {/* XP */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 font-mono font-bold text-sm text-slate-100">
                      {isSelf && <ArrowUp className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />}
                      <span className={isSelf ? 'text-cyan-400 font-extrabold' : 'text-slate-100'}>
                        {entry.xp.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">XP</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
