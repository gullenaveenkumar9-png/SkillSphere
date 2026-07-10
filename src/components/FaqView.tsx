import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FaqViewProps {
  theme: "light" | "dark";
}

export default function FaqView({ theme }: FaqViewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is SkillSphere?",
      answer: "SkillSphere is a decentralized, peer-to-peer student skill exchange network. It empowers students on campus to barter their skills, trade academic expertise, and participate in reciprocal tutoring without any financial cost.",
    },
    {
      question: "Is SkillSphere completely free to use?",
      answer: "Yes, entirely! SkillSphere operates strictly on the principle of academic reciprocity and bartering. You pay for your lessons by teaching others in return. No subscription fees, hidden commissions, or premium charges.",
    },
    {
      question: "How does the Rep Points and Leaderboard system work?",
      answer: "We employ a custom student gamification loop. Listing a teaching skill yields +10 points. Completing an active 1-hour session as a mentor grants +100 Rep points, while attending as a learner yields +50 points. Receiving positive feedback reviews awards multipliers, helping you scale up the campus rankings.",
    },
    {
      question: "Can I list and teach multiple skills at once?",
      answer: "Absolutely! There is no limit. If you have core competencies in React, Figma design, and conversational French, you can list all of them. This exponentially boosts your matching options on the student discover cards.",
    },
    {
      question: "What happens if a student cancels a scheduled session?",
      answer: "We recommend that students communicate cancellations at least 12 hours in advance via the built-in peer chat rooms. If a student consistently cancels without notice, they may be reported by their partners, and administrators can ban their account.",
    },
    {
      question: "Who developed SkillSphere?",
      answer: "SkillSphere was designed and developed with full layout precision, responsive grids, and modern typography by Gulle Naveen Kumar as a pristine student peer exchange application.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
      id="skillsphere-faq-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-12 md:py-16"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          FAQs
        </span>
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          Frequently Asked <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Questions
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
          Quickly resolve common questions about registrations, points algorithms, scheduled video calls, and community guidelines.
        </p>
      </motion.div>

      {/* Accordion Wrapper */}
      <motion.div variants={itemVariants} className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? theme === "dark"
                    ? "border-indigo-500/20 bg-indigo-500/5"
                    : "border-indigo-500/20 bg-indigo-50/20 shadow-md"
                  : theme === "dark"
                    ? "border-white/5 bg-[#1E293B]/30 hover:border-white/10"
                    : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Question Header */}
              <button
                id={`faq-accordion-header-${idx}`}
                onClick={() => handleToggle(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer transition-all focus:outline-none"
              >
                <div className="flex gap-4 pr-4">
                  <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    isOpen ? "text-indigo-400" : "text-slate-500"
                  }`} />
                  <span className={`text-xs font-bold leading-normal transition-colors ${
                    isOpen
                      ? "text-indigo-400"
                      : theme === "dark"
                        ? "text-slate-200"
                        : "text-slate-800"
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`p-1 rounded-lg shrink-0 ${
                  isOpen ? "bg-indigo-500/10 text-indigo-400" : "text-slate-500"
                }`}>
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsible Answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-16 pb-6 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/10">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
