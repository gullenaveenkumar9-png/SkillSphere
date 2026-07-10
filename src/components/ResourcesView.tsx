import React, { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Code, Compass, Download, ExternalLink, Figma, Layout, Palette, Video } from "lucide-react";

interface ResourcesViewProps {
  theme: "light" | "dark";
}

export default function ResourcesView({ theme }: ResourcesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Assets" },
    { id: "programming", label: "Web & Programming" },
    { id: "design", label: "UI/UX & Design" },
    { id: "math", label: "Math & Analytics" },
    { id: "multimedia", label: "Multimedia & Speaking" },
  ];

  const items = [
    {
      title: "Interactive React 19 Roadmap",
      category: "programming",
      type: "Handbook / Guide",
      description: "A comprehensive handbook detail step-by-step masteries from JSX, server state hooks, up to production ready SSR setups.",
      icon: Code,
      size: "4.2 MB",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
    },
    {
      title: "Clean UI/UX Design System v2.0",
      category: "design",
      type: "Figma Template",
      description: "Pruned wireframes, spacing systems, atomic widgets, typography styles, and high-fidelity layouts designed to fit Swiss design standards.",
      icon: Figma,
      size: "18.5 MB",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
    },
    {
      title: "Advanced Linear Algebra Workbook",
      category: "math",
      type: "PDF Textbook",
      description: "Detailed solved equations on eigenvalues, transformation matrices, and computational statistics for deep learning algorithms.",
      icon: BookOpen,
      size: "12.1 MB",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/25",
    },
    {
      title: "Premiere Pro Preset Toolkit",
      category: "multimedia",
      type: "Preset Pack",
      description: "Professional color LUTs, rapid sound effects, text overlay animations, and export configurations optimized for digital channels.",
      icon: Video,
      size: "54.0 MB",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    },
    {
      title: "Express API Boilerplate Starter",
      category: "programming",
      type: "Code Repository",
      description: "Secure node-express bootstrap configured with automated linting, CORS policies, environment setups, and rate-limiting middleware.",
      icon: Layout,
      size: "150 KB",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25",
    },
    {
      title: "Figma Auto-Layout & Component Library",
      category: "design",
      type: "Figma Asset File",
      description: "A deep dive tutorial on advanced Auto-Layout, nesting components, setting up variants, and creating functional interactive prototypes.",
      icon: Palette,
      size: "9.8 MB",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
    },
  ];

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

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
      id="skillsphere-resources-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-12 md:py-16"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-12">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          Curated Assets
        </span>
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          Academic & Technical <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Resource Cabinet
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
          Level up your next barter session with checked guides, toolkits, templates, and downloadable repositories handpicked by verified mentors.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              selectedCategory === cat.id
                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/15"
                : theme === "dark"
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full ${
                theme === "dark"
                  ? "border-white/5 bg-[#1E293B]/40 hover:bg-[#1E293B]/60"
                  : "border-slate-200 bg-white hover:bg-slate-50/50"
              } shadow-lg hover:shadow-xl relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-xl rounded-full pointer-events-none group-hover:scale-150 transition-all duration-500" />
              
              <div>
                {/* Badge Type */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${item.badgeColor}`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">
                    {item.size}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className={`font-bold text-sm mb-2 group-hover:text-indigo-400 transition-colors ${
                  theme === "dark" ? "text-slate-100" : "text-slate-800"
                }`}>
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Card CTA Footer */}
              <div className="flex gap-2 pt-4 border-t border-slate-800/30">
                <button
                  id={`resource-download-btn-${index}`}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  onClick={() => alert(`Beginning secure campus download for ${item.title}...`)}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  id={`resource-visit-btn-${index}`}
                  className={`p-2 rounded-xl border ${
                    theme === "dark" ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  } transition-all cursor-pointer`}
                  title="Open Preview"
                  onClick={() => alert(`Opening browser sandbox preview for ${item.title}...`)}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
