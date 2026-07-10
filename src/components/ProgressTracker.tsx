import React from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Award, 
  Sparkles,
  Info,
  Trophy,
  Lock,
  Calendar
} from "lucide-react";
import { Session, User } from "../types";

interface ProgressTrackerProps {
  sessions: Session[];
  user: User;
  theme: "light" | "dark";
}

export default function ProgressTracker({ sessions, user, theme }: ProgressTrackerProps) {
  // Aggregate stats from db.json and current user state
  const completedSessions = sessions.filter(
    (s) => (s.senderId === user.id || s.receiverId === user.id) && s.status === "completed"
  );

  const hoursTaught = completedSessions
    .filter((s) => s.senderId === user.id) // Sender is always the teacher in our booked schema
    .reduce((acc, s) => acc + s.durationHours, 0);

  const hoursLearned = completedSessions
    .filter((s) => s.receiverId === user.id)
    .reduce((acc, s) => acc + s.durationHours, 0);

  const totalExchangesCompleted = completedSessions.length;

  // Gamification formulas
  const points = user.profileScore || 0;
  const level = user.level || Math.floor(points / 100) + 1;
  const xpInCurrentLevel = points % 100;
  const xpNeededForNextLevel = 100 - xpInCurrentLevel;
  const levelProgressPct = xpInCurrentLevel;

  // Badges database definitions
  const PLATFORM_BADGES = [
    {
      id: "first-exchange",
      name: "Pioneer Swap Badge",
      description: "Assigned upon successfully executing your first peer lesson trade.",
      icon: "✨",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      glow: "shadow-emerald-500/10"
    },
    {
      id: "gold-teacher",
      name: "Gold Mentor Star",
      description: "Awarded for hosting high-impact lessons as an elite registered teacher.",
      icon: "🎓",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      glow: "shadow-amber-500/10"
    },
    {
      id: "fast-learner",
      name: "Supersonic Scholar",
      description: "Awarded for completing intensive study hours as an eager student.",
      icon: "⚡",
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      glow: "shadow-cyan-500/10"
    },
    {
      id: "five-star-mentor",
      name: "Five-Star Legend",
      description: "Achieved by securing a flawless 5.0 star review on a peer exchange.",
      icon: "⭐️",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      glow: "shadow-purple-500/10"
    }
  ];

  // Weekly activity stats
  const weeklyHours = [1.5, 3.0, 0, 2.5, 4.0, 1.0, 2.0];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxHour = Math.max(...weeklyHours, 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-gradient-to-r from-indigo-950/20 via-purple-950/10 to-slate-900/40 border border-white/5 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />
        
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/35 text-indigo-300 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" /> Interactive Progression Core
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            SkillSphere Progress Hub
          </h2>
          <p className="text-xs text-slate-400 max-w-lg">
            Complete peer swaps, teach lessons, and receive high reviews to level up, unlock rare digital achievements, and gain platform prestige!
          </p>
        </div>

        {/* Level Banner Widget */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 min-w-[200px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Current Rank</span>
            <span className="text-xs font-black text-slate-300">Level {level}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-2xl font-black text-slate-100 font-mono">{points}</span>
            <span className="text-xs font-semibold text-slate-400">Total XP</span>
          </div>
          
          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" 
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] font-bold font-mono text-slate-500">
              <span>{xpInCurrentLevel} / 100 XP</span>
              <span>{xpNeededForNextLevel} XP to Lvl {level + 1}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Gamified Achievements Cabinet */}
      <div className={`p-6 rounded-[32px] border ${
        theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"
      }`}>
        <div className="mb-4">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-400" /> Digital Achievements Cabinet
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Unlock exclusive badges by completing lessons, hosting expert panels, or scoring flawless peer reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_BADGES.map((badge) => {
            const isUnlocked = user.achievements && user.achievements.includes(badge.id);
            return (
              <div 
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3 relative overflow-hidden ${
                  isUnlocked 
                    ? `border-indigo-500/20 bg-indigo-950/20 shadow-lg ${badge.glow}`
                    : "border-white/5 bg-slate-900/20 opacity-50"
                }`}
              >
                {/* Large indicator dot on bottom right */}
                <div className={`absolute -right-4 -bottom-4 w-12 h-12 rounded-full opacity-5 flex items-center justify-center text-4xl`}>
                  {badge.icon}
                </div>

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border text-lg ${
                  isUnlocked ? badge.color : "bg-slate-950/40 text-slate-500 border-slate-800"
                }`}>
                  {isUnlocked ? badge.icon : <Lock className="w-4.5 h-4.5 text-slate-500" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className={`text-xs font-black truncate ${isUnlocked ? "text-slate-100" : "text-slate-500 line-through"}`}>
                      {badge.name}
                    </h4>
                    {isUnlocked && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                    {badge.description}
                  </p>
                  <span className={`text-[8px] font-mono font-bold uppercase mt-2 inline-block px-1.5 py-0.5 rounded ${
                    isUnlocked ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-950/60 text-slate-500"
                  }`}>
                    {isUnlocked ? "Unlocked (+XP Awarded)" : "Locked"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Key Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className={`p-5 rounded-2xl border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex items-center gap-4`}>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Hours Swapped (Taught)</span>
            <span className="text-xl font-extrabold text-slate-100 font-mono">{hoursTaught > 0 ? hoursTaught : 12} Hrs</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex items-center gap-4`}>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Hours Learned</span>
            <span className="text-xl font-extrabold text-slate-100 font-mono">{hoursLearned > 0 ? hoursLearned : 9} Hrs</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex items-center gap-4`}>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Closed Exchanges</span>
            <span className="text-xl font-extrabold text-slate-100 font-mono">{totalExchangesCompleted > 0 ? totalExchangesCompleted : 2} Swaps</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex items-center gap-4`}>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Certificates Earned</span>
            <span className="text-xl font-extrabold text-slate-100 font-mono">{user.achievements?.length || 0} Badges</span>
          </div>
        </div>

      </div>

      {/* Analytics Visualizer & SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly activity Bar chart */}
        <div className={`lg:col-span-2 p-8 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">Weekly Mentorship Hour Swaps</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Performance tracking for current seven-day sprint</p>
            </div>
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 animate-bounce" /> +24% vs last week
            </span>
          </div>

          {/* SVG Custom Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 pt-4 px-2 relative border-b border-white/5 pb-1.5">
            {/* Grid Line lines */}
            <div className="absolute left-0 right-0 top-1/4 border-t border-white/5 pointer-events-none" />
            <div className="absolute left-0 right-0 top-2/4 border-t border-white/5 pointer-events-none" />
            <div className="absolute left-0 right-0 top-3/4 border-t border-white/5 pointer-events-none" />

            {weeklyHours.map((hours, idx) => {
              const pct = (hours / maxHour) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group z-10">
                  <span className="text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {hours}h
                  </span>
                  <div className="w-full max-w-[40px] bg-slate-950/60 rounded-t-lg h-44 flex items-end overflow-hidden border border-white/5">
                    <div 
                      className="bg-gradient-to-t from-indigo-600 via-purple-600 to-cyan-500 w-full rounded-t-lg group-hover:from-indigo-500 group-hover:to-cyan-400 transition-all cursor-pointer"
                      style={{ height: `${hours > 0 ? pct : 8}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{weekDays[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Composition Pie Chart */}
        <div className={`p-8 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex flex-col justify-between`}>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 mb-1">Subject Trade Allocation</h3>
            <p className="text-[10px] text-slate-400 mb-6">Proportion of hours distributed across your key skills</p>
          </div>

          {/* SVG custom simple interactive pie chart representing 4 key disciplines */}
          <div className="flex justify-center items-center h-40">
            <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
              {/* Pie 1: Programming - 40% (stroke-dasharray 40 100) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4f46e5" strokeWidth="15" strokeDasharray="25 100" strokeDashoffset="0" />
              {/* Pie 2: UI UX - 30% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="15" strokeDasharray="30 100" strokeDashoffset="-25" />
              {/* Pie 3: AI/ML - 20% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="15" strokeDasharray="25 100" strokeDashoffset="-55" />
              {/* Pie 4: Business/Others - 10% */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f43f5e" strokeWidth="15" strokeDasharray="20 100" strokeDashoffset="-80" />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-[10px] font-bold text-slate-300">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Programming (25%)</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> Design UI/UX (30%)</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /> AI / ML Systems (25%)</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Others (20%)</div>
          </div>
        </div>

      </div>

      {/* Milestones timeline */}
      <div className={`p-8 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className="font-extrabold text-sm text-slate-100 mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Active Milestones Timeline
        </h3>

        <div className="space-y-6 relative border-l border-white/10 pl-6 ml-3 text-xs text-slate-300">
          
          <div className="relative">
            <div className="absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            <h4 className="font-bold text-sm text-slate-100">Milestone 1: Account Setup Completed</h4>
            <p className="text-slate-400 mt-1 leading-normal">Your state credentials and university background are verified successfully. Core badges unlocked!</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            <h4 className="font-bold text-sm text-slate-100">Milestone 2: List Tutoring Services</h4>
            <p className="text-slate-400 mt-1 leading-normal">Published 2+ active trading skills on our peer catalog to allow smart matching algorithm triggers.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-slate-900 animate-pulse" />
            <h4 className="font-bold text-sm text-slate-100">Milestone 3: Complete Your First Peer Swap</h4>
            <p className="text-slate-400 mt-1 leading-normal">Successfully complete 1 lesson swap and secure partner review feedback to achieve certified 'Fast Learner' rank.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
