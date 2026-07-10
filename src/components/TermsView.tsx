import React from "react";
import { motion } from "motion/react";
import { Scale, CheckCircle2, AlertOctagon, UserCheck } from "lucide-react";

interface TermsViewProps {
  theme: "light" | "dark";
}

export default function TermsView({ theme }: TermsViewProps) {
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

  const rules = [
    {
      icon: Scale,
      title: "1. Acceptance & Contractual Binding",
      content: "By creating an account, registering student details, or submitting skill swap proposals on SkillSphere, you represent and warrant that you are an active student at an accredited academic institution and agree to adhere strictly to these platform rules.",
    },
    {
      icon: UserCheck,
      title: "2. Reciprocal Exchange Code of Conduct",
      content: "SkillSphere runs on reciprocal trust. You are expected to deliver mentoring sessions in a polite, supportive, and academically integral manner. Commercial solicitations, currency deals, or homework-for-hire solutions are strictly prohibited.",
    },
    {
      icon: AlertOctagon,
      title: "3. Abuse & Cancellation Policies",
      content: "Students reported for late cancellations, abusive interactions, academic dishonesty, or submitting false skill reviews will be investigated by operations. Administrators retain the unilateral authority to ban or terminate profiles.",
    },
    {
      icon: CheckCircle2,
      title: "4. Limitations of Personal Liability",
      content: "SkillSphere is a decentralized facilitator of peer interactions. We do not assume responsibility for individual learning outcomes, specific grades, meeting links safety, or external actions between barter participants.",
    },
  ];

  return (
    <motion.div
      id="skillsphere-terms-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-12 md:py-16"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          Terms of Service
        </span>
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          Platform Guidelines & <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Terms of Service
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
          Last revised: January 1, 2026. Familiarize yourself with our basic expectations, peer conduct requirements, and service limits.
        </p>
      </motion.div>

      {/* Grid Rules */}
      <motion.div variants={itemVariants} className="space-y-6">
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
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
                    {rule.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rule.content}
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
