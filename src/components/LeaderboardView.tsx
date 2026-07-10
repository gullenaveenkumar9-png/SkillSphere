import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Trophy, 
  Award, 
  Search, 
  Star, 
  MapPin, 
  TrendingUp, 
  Sparkles,
  Zap,
  Flame
} from "lucide-react";
import { User } from "../types";

interface LeaderboardViewProps {
  students: User[];
  user: User;
  theme: "light" | "dark";
}

export default function LeaderboardView({ students, user, theme }: LeaderboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUni, setSelectedUni] = useState("All");

  const universities = ["All", ...Array.from(new Set(students.map((s) => s.university)))];

  // Rank students by profileScore (our mock representation of reputation points/skill points)
  const rankedStudents = [...students]
    .filter((s) => s.role !== "admin")
    .filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUni = selectedUni === "All" || s.university === selectedUni;
      return matchesSearch && matchesUni;
    })
    .sort((a, b) => (b.profileScore || 0) - (a.profileScore || 0));

  const getRankBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs";
      case 1:
        return "bg-slate-300/10 text-slate-300 border-slate-300/30 text-xs";
      case 2:
        return "bg-amber-700/10 text-amber-700 border-amber-700/30 text-xs";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700/40 text-xs";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* Header card with top stats */}
      <div className="p-8 rounded-[32px] bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-950/40 border border-white/5 shadow-2xl text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="space-y-2">
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full w-fit">
            <Trophy className="w-3.5 h-3.5" /> Mentor Leaderboard
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-indigo-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent">Elite Mentors & Peer Barter Stars</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Ranked by total validated study hours taught, peer review rating endorsements, and profile completing merit badges.
          </p>
        </div>

        {/* Dynamic score summary */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 text-center md:min-w-[150px] backdrop-blur-md">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-1">Your Score</span>
          <span className="text-2xl font-black text-indigo-400 font-mono">{user.profileScore || 120}</span>
          <span className="text-[9px] text-slate-500 block font-bold font-mono mt-0.5">PTS (Rank #4)</span>
        </div>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 bg-slate-950/60 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none placeholder-slate-500" 
            placeholder="Search students on the leaderboard..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <select 
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-slate-950/60 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 font-semibold"
            value={selectedUni}
            onChange={(e) => setSelectedUni(e.target.value)}
          >
            <option value="All" className="bg-slate-900 text-slate-200">All Universities (Nationwide)</option>
            {universities.map((uni) => (
              uni !== "All" ? <option key={uni} value={uni} className="bg-slate-900 text-slate-200">{uni}</option> : null
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table Grid */}
      <div className={`rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} overflow-hidden text-xs`}>
        <table className="w-full text-left">
          <thead className={`bg-slate-950/60 border-b border-white/5 ${theme === "dark" ? "text-slate-400" : "text-slate-600"} font-bold`}>
            <tr>
              <th className="p-4 w-16 text-center">Rank</th>
              <th className="p-4">Student Mentor</th>
              <th className="p-4">Primary Teach Offer</th>
              <th className="p-4 text-center">Reputation Score</th>
              <th className="p-4 text-center">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rankedStudents.map((stud, idx) => {
              const rankNum = idx + 1;
              const isOwnRow = stud.id === user.id;

              return (
                <tr 
                  key={stud.id}
                  className={`transition-all ${
                    isOwnRow 
                      ? "bg-indigo-500/10 font-semibold" 
                      : theme === "dark" 
                        ? "hover:bg-slate-950/40" 
                        : "hover:bg-slate-50"
                  }`}
                >
                  {/* Rank Badge Column */}
                  <td className="p-4 text-center font-bold">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono font-extrabold border ${getRankBadge(idx)}`}>
                      {rankNum}
                    </span>
                  </td>

                  {/* Student profile detail */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={stud.avatar} className="w-9 h-9 rounded-full border border-white/10 object-cover" alt={stud.name} />
                      <div>
                        <span className="font-extrabold text-slate-200 text-xs block">{stud.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{stud.university}</span>
                      </div>
                    </div>
                  </td>

                  {/* Skills offer */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {stud.skillsToTeach.slice(0, 2).map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[10px] border border-indigo-500/10 font-medium">
                          {sk}
                        </span>
                      ))}
                      {stud.skillsToTeach.length > 2 && (
                        <span className="text-[9px] text-slate-500 font-bold font-mono">+{stud.skillsToTeach.length - 2} more</span>
                      )}
                    </div>
                  </td>

                  {/* Score */}
                  <td className="p-4 text-center font-mono font-extrabold text-sm text-indigo-400">
                    <div className="flex items-center justify-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                      {stud.profileScore || 90} PTS
                    </div>
                  </td>

                  {/* Badges Column */}
                  <td className="p-4">
                    <div className="flex gap-1 items-center justify-center">
                      {stud.achievements.slice(0, 2).map((ach) => (
                        <span 
                          key={ach} 
                          className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold uppercase tracking-wide border border-purple-500/10"
                          title={ach}
                        >
                          {ach.split("-")[0]}
                        </span>
                      ))}
                      {stud.achievements.length > 2 && (
                        <span className="text-[9px] text-slate-500 font-bold font-mono">+{stud.achievements.length - 2}</span>
                      )}
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
}
