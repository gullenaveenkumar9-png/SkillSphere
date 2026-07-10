import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  HelpCircle, 
  BrainCircuit, 
  ChevronRight, 
  Map, 
  CheckSquare, 
  Activity, 
  Zap,
  Bot,
  AlertCircle
} from "lucide-react";
import { User } from "../types";

interface AISmartHubProps {
  user: User;
  theme: "light" | "dark";
}

export default function AISmartHub({ user, theme }: AISmartHubProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI results
  const [results, setResults] = useState<{
    compatibilityScore: number;
    compatibilityComments: string;
    roadmap: Array<{ phase: string; detail: string }>;
    aiScore: number;
    aiTips: string[];
  } | null>(null);

  const [targetSkill, setTargetSkill] = useState("UI UX Design with Figma");

  const runAiEngine = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillsToTeach: user.skillsToTeach,
          skillsToLearn: user.skillsToLearn,
          targetSkill: targetSkill
        }),
      });

      if (!response.ok) {
        throw new Error("AI service is currently busy calibrating. Please retry shortly!");
      }

      const data = await response.json();
      setResults(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to contact Gemini AI MATCH server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="p-8 rounded-[32px] bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-950/40 border border-white/5 shadow-2xl relative overflow-hidden text-slate-100 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold tracking-wider uppercase rounded-full w-fit mb-4">
          <Bot className="w-3.5 h-3.5 animate-pulse" /> AI Matchmaker & Roadmap Copilot
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug bg-gradient-to-r from-indigo-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent">
          SkillSphere Intelligent Matching & Syllabus Roadmap Creator
        </h2>
        <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Powered by <strong className="text-indigo-400">Gemini 3.5 Flash</strong>. Our server-side neural algorithm cross-analyzes your academic goals, verifies profile details, and charts bespoke learning schedules.
        </p>
      </div>

      {/* Target config deck */}
      <div className={`p-6 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 font-bold block mb-1">Target Skill of Current Interest</label>
            <input 
              className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none font-medium" 
              value={targetSkill}
              onChange={(e) => setTargetSkill(e.target.value)}
              placeholder="e.g. Photoshop Design, React Performance, SQL"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-bold block mb-1 font-sans">Your Profile Skills To Cross-Analyze</label>
            <div className="p-2.5 rounded-xl border border-white/5 bg-[#1E293B]/20 text-[11px] font-semibold text-slate-300 truncate">
              Teach: {user.skillsToTeach.join(", ") || "None listed yet"} • Learn: {user.skillsToLearn.join(", ") || "None listed"}
            </div>
          </div>
        </div>

        <button
          id="trigger-ai-match-btn"
          onClick={runAiEngine}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-95"
        >
          {loading ? (
            <>
              <BrainCircuit className="w-4 h-4 animate-spin text-indigo-200" />
              <span>Analyzing skill arrays & querying Gemini servers...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Generate AI Swap Analysis & Roadmap syllabus</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Deck */}
      {results && !loading && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Compatibility Score card */}
            <div className={`p-6 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex flex-col justify-between`}>
              <div>
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wide">AI Match Compatibility Score</h3>
                <div className="text-4xl font-black text-indigo-400 font-mono mt-2">{results.compatibilityScore}%</div>
                <p className="text-[11px] text-slate-400 leading-normal mt-3">
                  This metrics indexes how sought after your offered skills are relative to current community demands.
                </p>
              </div>
              <div className="w-full bg-slate-950/60 h-2.5 rounded-full overflow-hidden mt-4 border border-white/5">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${results.compatibilityScore}%` }} />
              </div>
            </div>

            {/* Profile Optimizer card */}
            <div className={`p-6 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex flex-col justify-between`}>
              <div>
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wide">AI Profile Quality Level</h3>
                <div className="text-4xl font-black text-purple-400 font-mono mt-2">{results.aiScore}%</div>
                <p className="text-[11px] text-slate-400 leading-normal mt-3">
                  Calculates bio clarity, listed trade syllabus metrics, and trust credentials verification completeness.
                </p>
              </div>
              <div className="w-full bg-slate-950/60 h-2.5 rounded-full overflow-hidden mt-4 border border-white/5">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${results.aiScore}%` }} />
              </div>
            </div>

            {/* General Feedback Comments */}
            <div className={`p-6 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex flex-col justify-between`}>
              <div>
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wide">Swap Suitability Analysis</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-2.5 italic">
                  "{results.compatibilityComments}"
                </p>
              </div>
            </div>

          </div>

          {/* Syllabus Roadmap Phases */}
          <div className={`p-6 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
            <h3 className="font-extrabold text-sm text-slate-100 mb-6 flex items-center gap-2">
              <Map className="w-4 h-4 text-cyan-400" /> Phased Study Roadmap syllabus for <span className="text-indigo-400 font-bold">"{targetSkill}"</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.roadmap.map((phase, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border ${theme === "dark" ? "border-white/5 bg-slate-950/60" : "border-slate-100 bg-slate-50"} space-y-2 relative`}
                >
                  <div className="absolute top-2 right-3 text-2xl font-mono font-black text-indigo-500/10">0{idx+1}</div>
                  <h4 className="font-extrabold text-xs text-slate-200 font-sans tracking-wide uppercase">{phase.phase}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">{phase.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable profile improvements tips */}
          <div className={`p-6 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"}`}>
            <h3 className="font-extrabold text-sm text-slate-100 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" /> Actionable Quality Improvement Tips
            </h3>
            <div className="space-y-2.5">
              {results.aiTips.map((tip, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-slate-300 leading-relaxed">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
