import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Calendar, 
  Clock, 
  PlusCircle, 
  Video, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  HelpCircle,
  VideoOff
} from "lucide-react";
import { Session, ExchangeRequest, User } from "../types";

interface LearningSessionsProps {
  sessions: Session[];
  user: User;
  exchanges: ExchangeRequest[];
  onScheduleSession: (sessionData: {
    exchangeId: string;
    receiverId: string;
    skillName: string;
    date: string;
    time: string;
    durationHours: number;
    meetingPlatform: "Google Meet" | "Zoom" | "Discord";
  }) => void;
  onUpdateSessionStatus: (id: string, status: "completed" | "cancelled") => void;
  theme: "light" | "dark";
}

export default function LearningSessions({
  sessions,
  user,
  exchanges,
  onScheduleSession,
  onUpdateSessionStatus,
  theme
}: LearningSessionsProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedExchangeId, setSelectedExchangeId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionDuration, setSessionDuration] = useState(1);
  const [platform, setPlatform] = useState<"Google Meet" | "Zoom" | "Discord">("Google Meet");

  const acceptedExchanges = exchanges.filter(
    (e) => (e.senderId === user.id || e.receiverId === user.id) && e.status === "Accepted"
  );

  const upcomingSessions = sessions.filter(
    (s) => (s.senderId === user.id || s.receiverId === user.id) && s.status === "upcoming"
  );

  const historicalSessions = sessions.filter(
    (s) => (s.senderId === user.id || s.receiverId === user.id) && s.status !== "upcoming"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExchangeId || !sessionDate || !sessionTime) return;

    const exchange = acceptedExchanges.find((ex) => ex.id === selectedExchangeId);
    if (!exchange) return;

    const partnerId = exchange.senderId === user.id ? exchange.receiverId : exchange.senderId;
    const skillToTeach = exchange.senderId === user.id ? exchange.skillOffered : exchange.skillRequested;

    onScheduleSession({
      exchangeId: selectedExchangeId,
      receiverId: partnerId,
      skillName: skillToTeach,
      date: sessionDate,
      time: sessionTime,
      durationHours: Number(sessionDuration),
      meetingPlatform: platform
    });

    setIsAddOpen(false);
    setSelectedExchangeId("");
    setSessionDate("");
    setSessionTime("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Lesson Scheduling Center</h2>
          <p className="text-xs mt-1 text-slate-400">
            Plan upcoming mentorship lessons and launch interactive video workspaces.
          </p>
        </div>

        {acceptedExchanges.length > 0 && (
          <button
            id="book-lesson-btn"
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Book New Lesson
          </button>
        )}
      </div>

      {/* Grid of active meetings */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-extrabold text-indigo-400 uppercase tracking-wider mb-3">Upcoming Booked Lessons</h3>
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-[24px] bg-slate-950/20 backdrop-blur-sm">
              <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-slate-400 font-medium">No upcoming tutoring calls on your schedule.</p>
              {acceptedExchanges.length === 0 && (
                <p className="text-[11px] text-slate-500 mt-1">Activate a barter request to unlock session scheduling!</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingSessions.map((sess) => (
                <div 
                  key={sess.id}
                  className={`p-6 rounded-[24px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex flex-col justify-between space-y-4`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-200">{sess.skillName}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" /> {sess.date} @ {sess.time} ({sess.durationHours} hrs)
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-[10px] font-bold tracking-wider font-mono uppercase">
                      {sess.meetingPlatform}
                    </span>
                  </div>

                  {/* Actions row */}
                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <a 
                      href={sess.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white flex items-center gap-1 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Join Video Call <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex gap-1.5">
                      <button
                        id={`complete-session-${sess.id}`}
                        onClick={() => onUpdateSessionStatus(sess.id, "completed")}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all cursor-pointer"
                        title="Mark session completed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        id={`cancel-session-${sess.id}`}
                        onClick={() => onUpdateSessionStatus(sess.id, "cancelled")}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                        title="Cancel session"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History of completed/cancelled calls */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">Past Session Logs</h3>
          {historicalSessions.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No previous call logs recorded.</p>
          ) : (
            <div className={`rounded-[24px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white"} overflow-hidden text-xs`}>
              <table className="w-full text-left">
                <thead className={`bg-slate-950/60 border-b border-white/5 ${theme === "dark" ? "text-slate-400" : "text-slate-600"} font-bold`}>
                  <tr>
                    <th className="p-3">Topic / Skill Swapped</th>
                    <th className="p-3">Date Completed</th>
                    <th className="p-3">Duration Swapped</th>
                    <th className="p-3">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {historicalSessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-slate-950/20 transition-all">
                      <td className="p-3 font-semibold text-slate-200">{sess.skillName}</td>
                      <td className="p-3 text-slate-400">{sess.date}</td>
                      <td className="p-3 text-slate-400 font-mono">{sess.durationHours} Hours</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sess.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                        }`}>
                          {sess.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Book Session dialog modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg p-8 rounded-[32px] border border-white/10 bg-slate-950/95 relative shadow-2xl animate-fade-in">
            <button 
              id="close-book-session-modal"
              onClick={() => setIsAddOpen(false)} 
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2 text-slate-200">
              <Calendar className="w-5 h-5 text-indigo-400" /> Book Exchange Lesson
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Select Active Barter Group</label>
                <select
                  className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-white/5 focus:border-indigo-500 focus:outline-none text-xs text-slate-200 font-semibold"
                  value={selectedExchangeId}
                  onChange={(e) => setSelectedExchangeId(e.target.value)}
                  required
                >
                  <option value="" className="bg-slate-950 text-slate-300">Choose an ongoing study track...</option>
                  {acceptedExchanges.map((ex) => {
                    const isS = ex.senderId === user.id;
                    const partner = isS ? ex.receiverName : ex.senderName;
                    const offered = isS ? ex.skillOffered : ex.skillRequested;
                    return (
                      <option key={ex.id} value={ex.id} className="bg-slate-950 text-slate-300">
                        {partner} (Learning {offered})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Lesson Date</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900/80 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Session Start Time</label>
                  <input 
                    type="time"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900/80 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Tutoring Duration (Hours)</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900/80 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                  >
                    <option value={0.5} className="bg-slate-950">30 Minutes Briefing</option>
                    <option value={1} className="bg-slate-950">1.0 Hour Standard</option>
                    <option value={1.5} className="bg-slate-950">1.5 Hours Deep-Dive</option>
                    <option value={2} className="bg-slate-950">2.0 Hours Masterclass</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Meeting Platform</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-900/80 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                    value={platform}
                    onChange={(e: any) => setPlatform(e.target.value)}
                  >
                    <option value="Google Meet" className="bg-slate-950">Google Meet</option>
                    <option value="Zoom" className="bg-slate-950">Zoom Calls</option>
                    <option value="Discord" className="bg-slate-950">Discord Server</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  id="submit-book-session"
                  type="submit"
                  className="px-6 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-indigo-500/20 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm Booking & Dispatch Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
