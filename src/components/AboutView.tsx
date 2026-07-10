import React from "react";
import { motion } from "motion/react";
import { Award, BookOpen, Heart, Shield, Sparkles, Users } from "lucide-react";

interface AboutViewProps {
  theme: "light" | "dark";
}

export default function AboutView({ theme }: AboutViewProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const cards = [
    {
      icon: Users,
      title: "Peer-to-Peer Mentorship",
      description: "Connect directly with fellow students who excel in areas you want to master. Learn in an informal, low-pressure environment.",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: BookOpen,
      title: "Reciprocal Exchanges",
      description: "No money changes hands. Teach what you are passionate about, and learn what you need to level up your academic achievements.",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: Award,
      title: "Gamified Reputations",
      description: "Earn experience points, rank up on your campus leaderboard, and unlock badges for exceptional teaching and learning milestones.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Secure Verification",
      description: "Exclusively open to verified institutional and student emails, ensuring a clean, safe, and highly trusted student community.",
      color: "from-rose-500 to-rose-600",
    },
  ];

  return (
    <motion.div
      id="skillsphere-about-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-12 md:py-16"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          About Our Platform
        </span>
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          Bridging Campuses, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            One Skill at a Time
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-400 leading-relaxed">
          SkillSphere is a decentralized student skill exchange platform built to foster practical peer-to-peer collaboration, practical workspace mentorship, and mutual growth.
        </p>
      </motion.div>

      {/* Grid Features */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                theme === "dark"
                  ? "border-white/5 bg-[#1E293B]/40 hover:bg-[#1E293B]/60 hover:border-indigo-500/20"
                  : "border-slate-200 bg-white hover:bg-slate-50/50 hover:border-indigo-500/20"
              } shadow-xl relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl rounded-full pointer-events-none group-hover:scale-150 transition-all duration-500" />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className={`font-bold text-sm mb-2 ${
                theme === "dark" ? "text-slate-100" : "text-slate-800"
              }`}>
                {card.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </motion.div>

      {/* Detailed Mission Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Heart className="w-4 h-4" /> Our Foundational Philosophy
          </div>
          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
            theme === "dark" ? "text-slate-100" : "text-slate-800"
          }`}>
            Why reciprocal education is the future of learning.
          </h2>
          <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
            <p>
              We believe every student possesses a distinct superpower—whether it's writing complex backend services, prototyping beautiful UI screens, analyzing complex multivariate equations, or speaking a second language fluently.
            </p>
            <p>
              Traditional classrooms often move at a single pace. SkillSphere breaks down academic silos by letting you swap knowledge on demand. By coaching another peer, you solidify your own understanding while gaining hands-on expertise in another domain.
            </p>
            <p>
              No high tuition fees, no rigid schedules—just dynamic, collaborative, and empowering education driven by the community, for the community.
            </p>
          </div>
        </div>

        <div className={`p-8 rounded-3xl border relative overflow-hidden ${
          theme === "dark" ? "border-white/5 bg-[#1E293B]/20" : "border-slate-200 bg-white"
        }`}>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-2xl rounded-full" />
          <h3 className={`text-lg font-extrabold mb-6 ${
            theme === "dark" ? "text-slate-100" : "text-slate-800"
          }`}>
            Key Platform Highlights
          </h3>
          <ul className="space-y-5">
            {[
              "Double-loop feedback system with peer ratings and comprehensive reviews.",
              "Smart AI Copilot matchmaking to discover synergistic swap profiles.",
              "Integrated calendar system to manage upcoming meeting sessions.",
              "Verified student portfolios showcaseable on LinkedIn or personal resumes."
            ].map((text, idx) => (
              <li key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Developer Spotlight Card */}
      <motion.div
        variants={itemVariants}
        className={`p-8 rounded-3xl border text-center relative overflow-hidden ${
          theme === "dark" ? "border-indigo-500/10 bg-indigo-950/20" : "border-indigo-500/10 bg-indigo-50/20"
        }`}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
        <h3 className={`text-xl font-bold mb-2 ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          Designed & Developed with Passion
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto mb-6">
          This platform was architected with the highest attention to design, interactive animations, and structural layout precision to deliver a pristine student workspace.
        </p>
        <span className="inline-block text-sm font-black tracking-tight text-indigo-400 bg-indigo-500/10 px-5 py-2.5 rounded-2xl border border-indigo-500/25">
          Gulle Naveen Kumar
        </span>
      </motion.div>
    </motion.div>
  );
}
