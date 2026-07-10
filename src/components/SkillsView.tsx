import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  X,
  PlusCircle,
  HelpCircle
} from "lucide-react";
import { Skill, SkillCategory, User } from "../types";

interface SkillsViewProps {
  skills: Skill[];
  user: User;
  onAddSkill: (skillData: Omit<Skill, "id" | "isApproved" | "favoritesCount">) => void;
  onEditSkill: (id: string, skillData: Partial<Skill>) => void;
  onDeleteSkill: (id: string) => void;
  theme: "light" | "dark";
}

export default function SkillsView({
  skills,
  user,
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
  theme
}: SkillsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  // Skill Add Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillCategory>("Programming");
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>("Intermediate");
  const [description, setDescription] = useState("");

  // Edit Modal State
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const categories: SkillCategory[] = [
    "Programming", "Web Development", "AI", "Machine Learning", "Data Science", 
    "Cyber Security", "Cloud", "DevOps", "UI UX", "Graphic Design", 
    "Video Editing", "Photography", "Public Speaking", "Languages", 
    "Mathematics", "Electronics", "Business", "Finance", "Marketing", 
    "Music", "Sports", "Cooking", "Others"
  ];

  const filteredSkills = skills.filter((sk) => {
    const matchesSearch = sk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sk.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || sk.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || sk.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSkill({
      name,
      category,
      level,
      studentId: user.id,
      studentName: user.name,
      studentAvatar: user.avatar,
      description
    });

    // Reset Form
    setName("");
    setCategory("Programming");
    setLevel("Intermediate");
    setDescription("");
    setIsAddOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSkill && editingSkill.name.trim()) {
      onEditSkill(editingSkill.id, {
        name: editingSkill.name,
        category: editingSkill.category,
        level: editingSkill.level,
        description: editingSkill.description
      });
      setEditingSkill(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Search Header and Quick Trigger */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="text-indigo-400 w-6 h-6" /> Skills Exchange Catalog
          </h2>
          <p className={`text-xs mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            Browse skills listed by students or add what you can teach to unlock matches.
          </p>
        </div>

        <button
          id="skills-catalog-add-btn"
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Add Skill You Teach
        </button>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 bg-[#1E293B]/60 text-xs text-slate-200 placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-all duration-200" 
            placeholder="Search skills, topics, tools, or student names..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <select 
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#1E293B]/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-all duration-200"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All" className="bg-slate-950">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-950">{cat}</option>
            ))}
          </select>
        </div>

        {/* Level Dropdown */}
        <div>
          <select 
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-[#1E293B]/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-all duration-200"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="All" className="bg-slate-950">All Difficulty Levels</option>
            <option value="Beginner" className="bg-slate-950">Beginner</option>
            <option value="Intermediate" className="bg-slate-950">Intermediate</option>
            <option value="Advanced" className="bg-slate-950">Advanced</option>
            <option value="Expert" className="bg-slate-950">Expert</option>
          </select>
        </div>

      </div>

      {/* Grid List */}
      {filteredSkills.length === 0 ? (
        <div className={`text-center py-16 border border-dashed rounded-[32px] ${
          theme === "dark" ? "border-white/10 bg-[#1E293B]/20" : "border-slate-300 bg-slate-50"
        }`}>
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No matching skills found in our current catalog.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting filters or searching with a different term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((sk) => {
            const isOwnSkill = sk.studentId === user.id;
            return (
              <div 
                key={sk.id}
                className={`p-6 rounded-[32px] border transition-all duration-300 ${
                  theme === "dark" 
                    ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl hover:bg-[#1E293B]/60 hover:scale-[1.02]" 
                    : "border-slate-200 bg-white shadow-sm hover:shadow-md"
                } flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase border border-indigo-500/20">
                      {sk.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[9px] font-mono font-bold text-slate-400">
                      {sk.level}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base leading-snug text-slate-100">{sk.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed min-h-12 line-clamp-3">
                    {sk.description}
                  </p>
                </div>

                <div className={`mt-5 pt-4 border-t ${theme === "dark" ? "border-white/5" : "border-slate-100"} flex justify-between items-center`}>
                  <div className="flex items-center gap-2">
                    <img 
                      src={sk.studentAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${sk.studentName}`} 
                      className="w-6 h-6 rounded-full border border-slate-700" 
                      alt={sk.studentName}
                    />
                    <span className="text-xs text-slate-300 font-medium">{sk.studentName}</span>
                  </div>

                  {isOwnSkill ? (
                    <div className="flex gap-2">
                      <button 
                        id={`edit-skill-${sk.id}`}
                        onClick={() => setEditingSkill(sk)}
                        className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition-all cursor-pointer"
                        title="Edit skill information"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        id={`delete-skill-${sk.id}`}
                        onClick={() => onDeleteSkill(sk.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-indigo-400/80 font-semibold font-mono tracking-wider">Peer Teacher</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Skill Dialog (Glassmorphism Overlay) */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/10 bg-[#1E293B]/95 backdrop-blur-xl text-slate-100" 
              : "border-slate-200 bg-white"
          } relative shadow-2xl`}>
            <button 
              id="close-add-skill-modal"
              onClick={() => setIsAddOpen(false)} 
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> List a Skill You Teach
            </h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Skill Title</label>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Photoshop Design Basics, Intermediate Python"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-950">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">My Expertise Level</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    value={level}
                    onChange={(e: any) => setLevel(e.target.value)}
                  >
                    <option value="Beginner" className="bg-slate-950">Beginner</option>
                    <option value="Intermediate" className="bg-slate-950">Intermediate</option>
                    <option value="Advanced" className="bg-slate-950">Advanced</option>
                    <option value="Expert" className="bg-slate-950">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Lesson Syllabus / Description</label>
                <textarea 
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none h-24 resize-none" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed syllabus of what you will cover, how many lessons, and what the student will learn."
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="submit-add-skill-form"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  Publish Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Skill Dialog */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/10 bg-[#1E293B]/95 backdrop-blur-xl text-slate-100" 
              : "border-slate-200 bg-white"
          } relative shadow-2xl`}>
            <button 
              id="close-edit-skill-modal"
              onClick={() => setEditingSkill(null)} 
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-lg mb-4">Edit Skill Details</h3>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Skill Title</label>
                <input 
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    value={editingSkill.category}
                    onChange={(e: any) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-950">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Expertise Level</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    value={editingSkill.level}
                    onChange={(e: any) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                  >
                    <option value="Beginner" className="bg-slate-950">Beginner</option>
                    <option value="Intermediate" className="bg-slate-950">Intermediate</option>
                    <option value="Advanced" className="bg-slate-950">Advanced</option>
                    <option value="Expert" className="bg-slate-950">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Description</label>
                <textarea 
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none h-24 resize-none" 
                  value={editingSkill.description}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="submit-edit-skill-form"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
