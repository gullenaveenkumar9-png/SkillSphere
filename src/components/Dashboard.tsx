import React from "react";
import { motion } from "motion/react";
import { 
  Award, 
  Clock, 
  Calendar, 
  TrendingUp, 
  PlusCircle, 
  Users, 
  CheckCircle, 
  MessageSquare, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { User, Skill, ExchangeRequest, Session } from "../types";

interface DashboardProps {
  user: User;
  skills: Skill[];
  exchanges: ExchangeRequest[];
  sessions: Session[];
  notifications: any[];
  students: User[];
  onNavigate: (view: string) => void;
  onSelectStudent: (student: User) => void;
  theme: "light" | "dark";
}

export default function Dashboard({
  user,
  skills,
  exchanges,
  sessions,
  notifications,
  students,
  onNavigate,
  onSelectStudent,
  theme
}: DashboardProps) {
  // Filter active exchanges
  const activeExchanges = exchanges.filter(
    (e) => (e.senderId === user.id || e.receiverId === user.id) && e.status === "Accepted"
  );

  // Filter pending exchanges
  const pendingRequests = exchanges.filter(
    (e) => e.receiverId === user.id && e.status === "Pending"
  );

  // Upcoming sessions
  const upcomingSessions = sessions.filter(
    (s) => (s.senderId === user.id || s.receiverId === user.id) && s.status === "upcoming"
  );

  // Recommended students based on skills they want to learn vs what user can teach
  const recommendedStudents = students
    .filter((s) => s.id !== user.id)
    .filter((s) => 
      s.skillsToLearn.some((skill) => user.skillsToTeach.includes(skill)) ||
      s.skillsToTeach.some((skill) => user.skillsToLearn.includes(skill))
    )
    .slice(0, 3);

  // Fallback recommended if empty
  const displayRecommended = recommendedStudents.length > 0 
    ? recommendedStudents 
    : students.filter((s) => s.id !== user.id && s.role !== "admin").slice(0, 3);

  // Trending skills based on frequency in general skills array
  const trendingSkills = ["Figma UI/UX Systems", "Machine Learning Foundations", "Python Automation", "Cyber Security Fundamentals", "React Performance"];

  // Achievements
  const badgeDetails = {
    "first-exchange": { title: "First Exchange", desc: "Successfully completed your first trade", iconColor: "text-amber-400 bg-amber-500/10" },
    "five-star-mentor": { title: "5 Star Mentor", desc: "Earned pristine review feedback", iconColor: "text-purple-400 bg-purple-500/10" },
    "top-mentor": { title: "Top Mentor", desc: "Taught over 15 hours of classes", iconColor: "text-cyan-400 bg-cyan-500/10" },
    "gold-teacher": { title: "Gold Teacher", desc: "Highly active teaching contribution", iconColor: "text-rose-400 bg-rose-500/10" },
    "fast-learner": { title: "Fast Learner", desc: "Adopted 3+ new skills", iconColor: "text-emerald-400 bg-emerald-500/10" },
    "skill-master": { title: "Skill Master", desc: "Listed more than 4 advanced skills", iconColor: "text-blue-400 bg-blue-500/10" },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Welcome Card & Profile completion banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className={`lg:col-span-2 p-8 rounded-[32px] border ${
          theme === "dark" 
            ? "border-white/10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 shadow-2xl shadow-indigo-500/10" 
            : "border-slate-200 bg-white shadow-sm"
        } relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6`}>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-400 rounded-full mix-blend-screen opacity-20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 text-left w-full">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block ${
              theme === "dark" ? "bg-white/20 text-white backdrop-blur-md" : "bg-indigo-500/10 text-indigo-600"
            }`}>
              Current Streak: 12 Days
            </div>
            
            <div>
              <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Level Up Your Expertise<br />by Teaching Others.
              </h1>
              <p className={`text-xs mt-2 max-w-md ${theme === "dark" ? "text-indigo-100 opacity-90" : "text-slate-500"}`}>
                You've reached <strong className={theme === "dark" ? "text-white font-bold" : "text-indigo-600 font-bold"}>'{user.experienceLevel || "Expert"}'</strong> status in {user.skillsToTeach[0] || "Academic Swaps"}. Share your knowledge and earn SkillPoints!
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                id="dash-quick-discover-btn"
                onClick={() => onNavigate("discover")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95 ${
                  theme === "dark" 
                    ? "bg-white text-indigo-600 hover:bg-slate-50 shadow-white/10" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
                }`}
              >
                Start Exchange <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                id="dash-quick-profile-btn"
                onClick={() => onNavigate("profile")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  theme === "dark" 
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20" 
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Update Portfolio
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10 shrink-0 w-full md:w-auto">
            <div className={`p-4 rounded-2xl w-28 h-28 flex flex-col items-center justify-center text-center ${
              theme === "dark" 
                ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white" 
                : "bg-slate-50 border border-slate-100 text-slate-800"
            }`}>
              <span className="text-2xl font-black">4.9★</span>
              <span className={`text-[9px] uppercase font-bold tracking-wider mt-1 ${theme === "dark" ? "opacity-60" : "text-slate-500"}`}>Rating</span>
            </div>
            <div className={`p-4 rounded-2xl w-28 h-28 flex flex-col items-center justify-center text-center ${
              theme === "dark" 
                ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white" 
                : "bg-slate-50 border border-slate-100 text-slate-800"
            }`}>
              <span className="text-2xl font-black">{user.skillsToTeach.length}</span>
              <span className={`text-[9px] uppercase font-bold tracking-wider mt-1 ${theme === "dark" ? "opacity-60" : "text-slate-500"}`}>Offers</span>
            </div>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className={`p-6 rounded-[32px] border flex flex-col justify-between ${
          theme === "dark" 
            ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" 
            : "border-slate-200 bg-white shadow-sm"
        }`}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-sm">Profile Optimization Score</span>
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                {user.profileScore || 50}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800/20 h-2.5 rounded-full overflow-hidden mb-4 border border-slate-700/10">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full" 
                style={{ width: `${user.profileScore || 50}%` }}
              />
            </div>
            <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"} leading-relaxed`}>
              Optimize your profile rating! Students with 80%+ completion get up to <strong className="text-indigo-400">4x more peer matches</strong> on SkillSphere.
            </p>
          </div>

          <div className={`mt-4 p-3 rounded-xl flex items-start gap-2.5 ${
            theme === "dark" ? "bg-indigo-500/5 border border-indigo-500/10" : "bg-indigo-50 hover:bg-indigo-100/50"
          }`}>
            <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-[11px]">
              <span className="font-semibold block text-slate-300">Next Action:</span>
              <span className="text-slate-400">Run the <strong className="text-indigo-400 cursor-pointer underline" onClick={() => onNavigate("ai-match")}>AI Matching Copilot</strong> to generate custom learning roadmaps.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid of Main Dashboard widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column: Upcoming Sessions and Current Exchanges */}
        <div className="lg:col-span-2 space-y-6">

          {/* Current Exchanges */}
          <div className={`p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" 
              : "border-slate-200 bg-white shadow-sm"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Current Exchanges
              </h3>
              <span className="text-xs font-bold text-slate-400">{activeExchanges.length} Active</span>
            </div>

            {activeExchanges.length === 0 ? (
              <div className={`text-center py-8 border border-dashed rounded-2xl ${
                theme === "dark" ? "border-white/10" : "border-slate-300"
              }`}>
                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"} mb-3`}>
                  You don't have any ongoing exchanges right now.
                </p>
                <button 
                  id="dash-explore-partners-btn"
                  onClick={() => onNavigate("discover")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer"
                >
                  Discover Study Partners
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeExchanges.map((exch) => {
                  const isSender = exch.senderId === user.id;
                  const partnerName = isSender ? exch.receiverName : exch.senderName;
                  const partnerAvatar = isSender ? exch.receiverAvatar : exch.senderAvatar;
                  return (
                    <div 
                      key={exch.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        theme === "dark" 
                          ? "border-white/5 bg-[#1E293B]/20 hover:bg-white/5" 
                          : "border-slate-100 bg-slate-50"
                      } flex justify-between items-center`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={partnerAvatar} className="w-10 h-10 rounded-full border border-slate-700" alt={partnerName} />
                        <div>
                          <h4 className="font-bold text-sm">{partnerName}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Offered: <span className="text-indigo-400 font-medium">{exch.skillOffered}</span> • Requested: <span className="text-purple-400 font-medium">{exch.skillRequested}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          id={`dash-chat-exch-${exch.id}`}
                          onClick={() => onNavigate("exchanges")}
                          className="p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all cursor-pointer"
                          title="Open exchange workspace"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming sessions */}
          <div className={`p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" 
              : "border-slate-200 bg-white shadow-sm"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" /> Scheduled Learning Sessions
              </h3>
              <span className="text-xs font-bold text-slate-400">{upcomingSessions.length} Upcoming</span>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className={`text-center py-8 border border-dashed rounded-2xl ${
                theme === "dark" ? "border-white/10" : "border-slate-300"
              }`}>
                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"} mb-3`}>
                  No sessions scheduled this week.
                </p>
                <button 
                  id="dash-schedule-sess-btn"
                  onClick={() => onNavigate("sessions")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 transition-all cursor-pointer"
                >
                  Schedule A Lesson
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((sess) => {
                  return (
                    <div 
                      key={sess.id}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        theme === "dark" 
                          ? "border-white/5 bg-[#1E293B]/20 hover:bg-white/5" 
                          : "border-slate-100 bg-slate-50"
                      } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{sess.skillName}</h4>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {sess.date} @ {sess.time} ({sess.durationHours} hrs)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                          theme === "dark" ? "bg-purple-500/15 text-purple-400 border border-purple-500/20" : "bg-purple-50 text-purple-700"
                        }`}>
                          {sess.meetingPlatform}
                        </span>
                        <a 
                          href={sess.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                        >
                          Join <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Students */}
          <div className={`p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" 
              : "border-slate-200 bg-white shadow-sm"
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" /> Highly Recommended Peer Matches
              </h3>
              <span className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer" onClick={() => onNavigate("discover")}>View All</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayRecommended.map((student) => (
                <div 
                  key={student.id}
                  onClick={() => onSelectStudent(student)}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    theme === "dark" 
                      ? "border-white/5 bg-[#1E293B]/20 hover:bg-white/10 hover:scale-[1.03]" 
                      : "border-slate-200 bg-white hover:bg-slate-50 hover:shadow-md"
                  } cursor-pointer flex flex-col justify-between`}
                >
                  <div className={`text-center pb-3 border-b ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
                    <img src={student.avatar} className="w-12 h-12 rounded-full mx-auto border border-slate-700 mb-2" alt={student.name} />
                    <h4 className="font-bold text-sm leading-snug">{student.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-tight truncate">{student.university}</p>
                  </div>
                  <div className="pt-3 space-y-2 text-left">
                    <div className="text-[10px]">
                      <span className="text-indigo-400 font-bold block uppercase tracking-wider">Offers:</span>
                      <span className="text-slate-300 font-medium truncate block">{student.skillsToTeach.join(", ") || "General Skills"}</span>
                    </div>
                    <div className="text-[10px]">
                      <span className="text-purple-400 font-bold block uppercase tracking-wider">Seeks:</span>
                      <span className="text-slate-300 font-medium truncate block">{student.skillsToLearn.join(", ") || "General Topics"}</span>
                    </div>
                  </div>
                  <div className="pt-3 mt-2 text-center text-[10px] font-bold text-indigo-400 group-hover:underline">
                    View Profile Details
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Badges, Leaderboard snippet, trending skills */}
        <div className="space-y-6">

          {/* Quick Actions Panel */}
          <div className={`p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" 
              : "border-slate-200 bg-white shadow-sm"
          }`}>
            <h3 className="font-bold text-sm mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="dash-quick-add-skill"
                onClick={() => onNavigate("skills")}
                className={`p-3.5 rounded-2xl border transition-all text-center text-xs font-semibold cursor-pointer flex flex-col items-center gap-2 ${
                  theme === "dark" 
                    ? "bg-[#1E293B]/30 hover:bg-white/10 border-white/5 hover:border-indigo-500/50" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <span>List a Skill</span>
              </button>
              <button
                id="dash-quick-ai-match"
                onClick={() => onNavigate("ai-hub")}
                className={`p-3.5 rounded-2xl border transition-all text-center text-xs font-semibold cursor-pointer flex flex-col items-center gap-2 ${
                  theme === "dark" 
                    ? "bg-[#1E293B]/30 hover:bg-white/10 border-white/5 hover:border-purple-500/50" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <Award className="w-5 h-5 text-purple-400" />
                <span>AI match</span>
              </button>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className={`p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" 
              : "border-slate-200 bg-white shadow-sm"
          }`}>
            <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Earned Badges
            </h3>

            {user.achievements.length === 0 ? (
              <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"} leading-relaxed`}>
                Complete your first lesson or swap high-quality review feedback to unlock prestigious merit badges!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {user.achievements.map((badgeId) => {
                  const b = (badgeDetails as any)[badgeId];
                  if (!b) return null;
                  return (
                    <div 
                      key={badgeId}
                      className={`p-3 rounded-2xl border flex flex-col items-center text-center ${
                        theme === "dark" ? "bg-[#1E293B]/20 border-white/5" : "bg-slate-50 border-slate-100"
                      }`}
                      title={b.desc}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${b.iconColor}`}>
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold block leading-tight">{b.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trending and Recently Added Skills */}
          <div className={`p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" 
              : "border-slate-200 bg-white shadow-sm"
          }`}>
            <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-400" /> Trending Skill Demands
            </h3>
            <div className="space-y-2">
              {trendingSkills.map((trSkill, idx) => (
                <div 
                  key={idx}
                  className={`px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                    theme === "dark" 
                      ? "border-white/5 bg-[#1E293B]/20 hover:bg-white/5" 
                      : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                  } text-xs flex justify-between items-center`}
                  onClick={() => onNavigate("discover")}
                >
                  <span className="font-medium">{trSkill}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
