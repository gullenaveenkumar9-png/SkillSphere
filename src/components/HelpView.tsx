import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, HelpCircle, UserPlus, Send, MessageSquare, Award, AlertTriangle, CheckCircle } from "lucide-react";

interface HelpViewProps {
  theme: "light" | "dark";
}

export default function HelpView({ theme }: HelpViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Technical Bug");
  const [ticketMsg, setTicketMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const guides = [
    {
      category: "Account Management",
      icon: UserPlus,
      title: "How do I sign up and join the platform?",
      answer: "Enter your verified university/institutional student email in the login modal. If no student account matches, the system will automatically create your profile portfolio in the secure SkillSphere registry.",
    },
    {
      category: "Skill Listings",
      icon: MessageSquare,
      title: "How do I list or edit a skill to teach?",
      answer: "Head over to your Skills Catalog tab, click '+ List Teaching Skill', enter the subject name, category, competence level, and brief syllabus description. Your skill will go live immediately on the discover boards.",
    },
    {
      category: "Exchange Proposals",
      icon: Send,
      title: "How do I propose a reciprocal swap with a student?",
      answer: "Head to the Discover Board, browse student profile cards, select a student to see their teaching skillset, and click 'Propose Skill Swap'. Enter the skills you want to exchange, and click send.",
    },
    {
      category: "Leaderboard & Points",
      icon: Award,
      title: "How does the Rep Points and Gamified rating work?",
      answer: "Teaching a scheduled peer session earns you +100 Rep points. Attending a session as a learner earns +50 points. Giving and receiving 5-star rating reviews yields large reputation multipliers to climb your campus leaderboard.",
    },
  ];

  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    setSubmitted(true);
    setTimeout(() => {
      setTicketSubject("");
      setTicketMsg("");
    }, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      id="skillsphere-help-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 py-12 md:py-16"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-12">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          Help & Support Center
        </span>
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          How Can We <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Guide You Today?
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
          Search our comprehensive knowledge base or register a direct administrative ticket to resolve any system questions.
        </p>

        {/* Search Input */}
        <div className="max-w-md mx-auto relative mt-6">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides, categories, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 transition-all placeholder-slate-500 shadow-inner"
          />
        </div>
      </motion.div>

      {/* Guides Section */}
      <motion.div variants={itemVariants} className="space-y-4 mb-16">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${
          theme === "dark" ? "text-slate-300" : "text-slate-700"
        }`}>
          Knowledge Base Guides ({filteredGuides.length})
        </h3>

        {filteredGuides.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
            No matching guides found for "{searchQuery}". Try searching for 'email', 'points', or 'swap'.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all duration-300 ${
                    theme === "dark" ? "border-white/5 bg-[#1E293B]/40" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="p-2 h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">
                        {guide.category}
                      </span>
                      <h4 className={`text-xs font-bold leading-snug ${
                        theme === "dark" ? "text-slate-100" : "text-slate-800"
                      }`}>
                        {guide.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed pt-2">
                        {guide.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Raise Ticket Section */}
      <motion.div
        variants={itemVariants}
        className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden ${
          theme === "dark" ? "border-white/5 bg-[#1E293B]/20" : "border-slate-200 bg-white"
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
        <h3 className={`text-lg font-extrabold mb-1 ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          Raise a Support Ticket
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Still stuck? Launch a workspace ticket below, and our administrative desk will contact you via email.
        </p>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl text-center space-y-3"
          >
            <CheckCircle className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-sm text-slate-200">
              Workspace Ticket Opened Successfully!
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your issue has been assigned a unique tracking token and is currently queued in the moderator dashboard.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/25 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Open New Ticket
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Ticket Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g., Cannot link LinkedIn profile url"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Issue Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 transition-all cursor-pointer"
                >
                  <option value="Technical Bug">Technical Bug</option>
                  <option value="Abuse/Report Student">Abuse/Report Student</option>
                  <option value="Leaderboard/Points System">Leaderboard/Points System</option>
                  <option value="General Query">General Query</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Issue Description & Context
              </label>
              <textarea
                required
                rows={4}
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                placeholder="Detail the steps to reproduce your issue, include error messages if any..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Submit Active Support Ticket</span>
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
