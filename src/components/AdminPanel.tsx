import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Flag, 
  TrendingUp, 
  Settings, 
  Trash2, 
  Megaphone, 
  Database, 
  BarChart3, 
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Ban,
  Activity,
  PlusCircle
} from "lucide-react";
import { User, Report } from "../types";

interface AdminPanelProps {
  students: User[];
  reports: Report[];
  onBanStudent: (id: string) => void;
  onResolveReport: (id: string) => void;
  onPostBroadcast: (message: string) => void;
  theme: "light" | "dark";
}

export default function AdminPanel({
  students,
  reports,
  onBanStudent,
  onResolveReport,
  onPostBroadcast,
  theme
}: AdminPanelProps) {
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    onPostBroadcast(broadcastText.trim());
    setBroadcastText("");
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 2500);
  };

  // Site analytics
  const totalStudents = students.filter(s => s.role !== "admin").length;
  const activeReportsCount = reports.filter(r => r.status === "Pending").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" /> Admin Command Dashboard
        </h2>
        <p className={`text-xs mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
          System analytics overview, broadcast notifications controls, and moderation tools.
        </p>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className={`p-5 rounded-2xl border ${theme === "dark" ? "border-slate-800 bg-slate-900/15" : "border-slate-200 bg-white shadow-sm"} flex items-center gap-4`}>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Registered Students</span>
            <span className="text-xl font-extrabold text-slate-100 font-mono">{totalStudents}</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${theme === "dark" ? "border-slate-800 bg-slate-900/15" : "border-slate-200 bg-white shadow-sm"} flex items-center gap-4`}>
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Active Abuse Flag Reports</span>
            <span className="text-xl font-extrabold text-slate-100 font-mono">{activeReportsCount}</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${theme === "dark" ? "border-slate-800 bg-slate-900/15" : "border-slate-200 bg-white shadow-sm"} flex items-center gap-4`}>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Active Database State</span>
            <span className="text-xl font-extrabold text-slate-100 font-mono">100% Nominal</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Post site wide Broadcast */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${theme === "dark" ? "border-slate-800 bg-slate-900/15" : "border-slate-200 bg-white shadow-sm"} space-y-4`}>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-indigo-400" /> Post Site-Wide System Broadcast
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            Distribute global notices to all student dashboard banners. Perfect for server maintenance updates or event launches.
          </p>

          {broadcastSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Broadcast dispatch successful! Active on all dashboard headers.</span>
            </div>
          )}

          <form onSubmit={handleBroadcastSubmit} className="space-y-3">
            <textarea 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/40 text-xs focus:border-indigo-500 focus:outline-none h-20 resize-none"
              placeholder="e.g. Server maintenance at 12:00 AM UTC. Or: Join the Friday Hackathon swaps!"
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              required
            />
            <button
              id="admin-dispatch-broadcast-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer"
            >
              Post Announcement
            </button>
          </form>
        </div>

        {/* System reports list */}
        <div className={`p-6 rounded-2xl border ${theme === "dark" ? "border-slate-800 bg-slate-900/15" : "border-slate-200 bg-white shadow-sm"} space-y-4`}>
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-400" /> Member Flag Reports
          </h3>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-6">All reports cleared. High member trust metrics.</p>
          ) : (
            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-300">By {rep.reporterName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[9px] uppercase">{rep.reason}</span>
                  </div>
                  <p className="text-slate-400 leading-normal font-medium">{rep.reason}</p>
                  
                  {rep.status === "Pending" ? (
                    <button
                      id={`resolve-report-${rep.id}`}
                      onClick={() => onResolveReport(rep.id)}
                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold cursor-pointer transition-all"
                    >
                      Clear Report
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold block pt-1">Resolved ✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Member Management List */}
      <div className={`p-6 rounded-2xl border ${theme === "dark" ? "border-slate-800 bg-slate-900/15" : "border-slate-200 bg-white shadow-sm"} space-y-4`}>
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" /> Platform Member Moderation
        </h3>

        <div className="overflow-hidden rounded-xl border border-slate-800 text-[11px] text-slate-300">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 font-bold text-slate-400">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">College & Department</th>
                <th className="p-3">Teach Offerings</th>
                <th className="p-3">Trust Level</th>
                <th className="p-3 text-center">Sanction / Mod Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {students.filter(s => s.role !== "admin").map((stud) => (
                <tr key={stud.id} className="hover:bg-slate-900/20">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={stud.avatar} className="w-6 h-6 rounded-full border border-slate-700" alt={stud.name} />
                      <span className="font-bold text-slate-200">{stud.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-400">{stud.university} • {stud.department}</td>
                  <td className="p-3 text-slate-400">{stud.skillsToTeach.slice(0, 2).join(", ")}</td>
                  <td className="p-3 font-mono font-bold text-indigo-400">{stud.profileScore || 100} PTS</td>
                  <td className="p-3 text-center">
                    <button
                      id={`ban-student-${stud.id}`}
                      onClick={() => onBanStudent(stud.id)}
                      className="px-2 py-1 rounded bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 font-bold transition-all cursor-pointer"
                    >
                      Ban User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
