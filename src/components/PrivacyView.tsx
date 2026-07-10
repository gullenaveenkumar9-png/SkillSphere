import React from "react";
import { motion } from "motion/react";
import { Eye, ShieldCheck, Lock, Database } from "lucide-react";

interface PrivacyViewProps {
  theme: "light" | "dark";
}

export default function PrivacyView({ theme }: PrivacyViewProps) {
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

  const sections = [
    {
      icon: Eye,
      title: "1. Information We Collect",
      content: "We collect only minimal credentials essential for student verification. This includes your name, institutional/university student email, academic department, current year, location, bio, and listings of skills to teach or learn. Password fields are processed locally.",
    },
    {
      icon: Lock,
      title: "2. How We Protect Your Data",
      content: "Your exchange information, uploaded session materials, and communication messages are securely isolated within our system databases. No public access or search indexation is permitted for student profiles without direct authorization.",
    },
    {
      icon: Database,
      title: "3. Third-Party Integrations & Cookies",
      content: "SkillSphere does not sell, lease, or lease student profiles to third-party marketing companies. Cookies are utilized strictly to preserve active sessions ('Remember Session' tokens) so that you remain authenticated across visits.",
    },
    {
      icon: ShieldCheck,
      title: "4. Student Rights & Deletion Requests",
      content: "As a student user, you retain absolute ownership over your educational swaps. You may update your profile or request full, irreversible erasure of your records from the SkillSphere registry at any time by contacting support operations.",
    },
  ];

  return (
    <motion.div
      id="skillsphere-privacy-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-12 md:py-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          Privacy Policy
        </span>
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          Your Privacy Is <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Our Top Priority
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
          Last revised: January 1, 2026. Review our straightforward guidelines detailing data collections, protective layers, and user rights.
        </p>
      </motion.div>

      {/* Grid Policies */}
      <motion.div variants={itemVariants} className="space-y-6">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className={`p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                theme === "dark"
                  ? "border-white/5 bg-[#1E293B]/40 hover:bg-[#1E293B]/50"
                  : "border-slate-200 bg-white hover:bg-slate-50/50"
              }`}
            >
              <div className="flex gap-5 items-start">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className={`font-bold text-sm ${
                    theme === "dark" ? "text-slate-100" : "text-slate-800"
                  }`}>
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
