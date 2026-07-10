import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MapPin, 
  GraduationCap, 
  Star, 
  MessageSquare, 
  Send, 
  Check, 
  X,
  AlertCircle,
  Clock,
  Briefcase,
  Sparkles,
  BrainCircuit
} from "lucide-react";
import { User, Skill } from "../types";

interface DiscoverViewProps {
  students: User[];
  user: User;
  onSendExchangeRequest: (requestData: {
    receiverId: string;
    skillOffered: string;
    skillRequested: string;
    durationWeeks: number;
    message: string;
  }) => void;
  onSelectStudent: (student: User) => void;
  theme: "light" | "dark";
}

export default function DiscoverView({
  students,
  user,
  onSendExchangeRequest,
  onSelectStudent,
  theme
}: DiscoverViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("All");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "score" | "name">("rating");

  // AI Matching Analysis Modal States
  const [aiAnalysisPartner, setAiAnalysisPartner] = useState<User | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    compatibilityScore: number;
    analysis: string;
    suggestedRoadmap: Array<{ phase: string; detail: string }>;
    tips: string[];
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Compatibility calculation algorithm
  const calculateCompatibility = (partner: User) => {
    let score = 55; // base score
    
    // Find overlaps between partner's teach and user's learn
    const matchingOffered = partner.skillsToTeach.filter(sk => 
      user.skillsToLearn.some(learn => learn.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(learn.toLowerCase()))
    );
    
    // Find overlaps between partner's learn and user's teach
    const matchingRequested = partner.skillsToLearn.filter(sk => 
      user.skillsToTeach.some(teach => teach.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(teach.toLowerCase()))
    );

    score += matchingOffered.length * 15;
    score += matchingRequested.length * 10;

    if (partner.rating) {
      score += (partner.rating - 4.0) * 10;
    } else {
      score += 5;
    }

    if (partner.profileScore) {
      score += Math.min(10, partner.profileScore * 0.05);
    }

    return Math.min(98, Math.max(45, Math.round(score)));
  };

  const getSynergyText = (partner: User) => {
    const matchingOffered = partner.skillsToTeach.filter(sk => 
      user.skillsToLearn.some(learn => learn.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(learn.toLowerCase()))
    );
    const matchingRequested = partner.skillsToLearn.filter(sk => 
      user.skillsToTeach.some(teach => teach.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(teach.toLowerCase()))
    );

    if (matchingOffered.length > 0 && matchingRequested.length > 0) {
      return `Mutual Swap: They teach ${matchingOffered[0]} & want ${matchingRequested[0]}!`;
    } else if (matchingOffered.length > 0) {
      return `Learning Synergy: They teach ${matchingOffered[0]} which is on your wishlist!`;
    } else if (matchingRequested.length > 0) {
      return `Mentorship Synergy: They want to learn ${matchingRequested[0]} which you offer!`;
    } else {
      return `General Synergy: High department and location affinity.`;
    }
  };

  const runStudentAiMatch = async (partner: User) => {
    setAiAnalysisPartner(partner);
    setAiLoading(true);
    setAiAnalysisResult(null);
    setAiError(null);
    
    try {
      const response = await fetch("/api/ai/match-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, partner }),
      });
      
      if (!response.ok) {
        throw new Error("The AI matchmaker is calibrating. Please retry in a few moments!");
      }
      
      const data = await response.json();
      setAiAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to generate AI swap analysis.");
    } finally {
      setAiLoading(false);
    }
  };

  // Exchange proposal modal
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [proposalPartner, setProposalPartner] = useState<User | null>(null);
  const [skillOffered, setSkillOffered] = useState("");
  const [skillRequested, setSkillRequested] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // List unique universities for filter
  const universities = ["All", ...Array.from(new Set(students.map((s) => s.university)))].sort();

  // Get unique departments, years, and availabilities from the student roster for dynamic filtering with structured fallbacks
  const uniqueDepartments = Array.from(
    new Set(students.filter(s => s.id !== user.id && s.role !== "admin" && s.department).map(s => s.department))
  ).sort();

  const uniqueYears = Array.from(
    new Set(students.filter(s => s.id !== user.id && s.role !== "admin" && s.year).map(s => s.year))
  ).sort();

  const uniqueAvailabilities = Array.from(
    new Set(students.filter(s => s.id !== user.id && s.role !== "admin" && s.availability).map(s => s.availability))
  ).sort();

  const departmentsList = uniqueDepartments.length > 0 ? uniqueDepartments : [
    "Computer Science",
    "Data Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Business Administration",
    "Mathematics",
    "Physics",
    "Graphic Design",
    "UI/UX Design",
    "Others"
  ];

  const yearsList = uniqueYears.length > 0 ? uniqueYears : [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "Masters",
    "PhD"
  ];

  const availabilitiesList = uniqueAvailabilities.length > 0 ? uniqueAvailabilities : [
    "Weekday Evenings",
    "Weekends",
    "Flexible",
    "Limited"
  ];

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const toggleYear = (yr: string) => {
    setSelectedYears(prev => 
      prev.includes(yr) ? prev.filter(y => y !== yr) : [...prev, yr]
    );
  };

  const toggleAvailability = (avail: string) => {
    setSelectedAvailabilities(prev => 
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
  };

  const clearAllFilters = () => {
    setSelectedDepartments([]);
    setSelectedYears([]);
    setSelectedAvailabilities([]);
    setSelectedUniversity("All");
    setSearchQuery("");
  };

  const activeFiltersCount = 
    selectedDepartments.length + 
    selectedYears.length + 
    selectedAvailabilities.length + 
    (selectedUniversity !== "All" ? 1 : 0);

  const aiRecommendedPartners = [...students]
    .filter((s) => s.id !== user.id && s.role !== "admin")
    .map((s) => ({ ...s, compatibility: calculateCompatibility(s) }))
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 3);

  const filteredStudents = students
    .filter((s) => s.id !== user.id && s.role !== "admin")
    .filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.skillsToTeach.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            s.skillsToLearn.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesUni = selectedUniversity === "All" || s.university === selectedUniversity;
      const matchesDept = selectedDepartments.length === 0 || selectedDepartments.includes(s.department);
      const matchesYear = selectedYears.length === 0 || selectedYears.includes(s.year);
      const matchesAvailability = selectedAvailabilities.length === 0 || selectedAvailabilities.includes(s.availability);
      return matchesSearch && matchesUni && matchesDept && matchesYear && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === "score") {
        return (b.profileScore || 0) - (a.profileScore || 0);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const handleOpenProposal = (partner: User) => {
    setProposalPartner(partner);
    // Autofill defaults if available
    setSkillOffered(user.skillsToTeach[0] || "");
    setSkillRequested(partner.skillsToTeach[0] || "");
    setMessage(`Hi ${partner.name}! I see you want to learn ${partner.skillsToLearn[0] || "your requested topics"} and teach ${partner.skillsToTeach[0] || "your skills"}. I would love to trade lessons with you!`);
    setIsSubmitted(false);
    setIsProposalOpen(true);
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalPartner || !skillOffered || !skillRequested) return;

    onSendExchangeRequest({
      receiverId: proposalPartner.id,
      skillOffered,
      skillRequested,
      durationWeeks,
      message
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsProposalOpen(false);
      setProposalPartner(null);
    }, 2000);
  };

  const renderSidebarContent = () => (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className={`flex items-center justify-between pb-4 border-b ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
        <h3 className={`text-sm font-black flex items-center gap-1.5 ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Filters
          {activeFiltersCount > 0 && (
            <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button 
            onClick={clearAllFilters}
            className={`text-[10px] font-bold hover:underline transition ${theme === "dark" ? "text-slate-400 hover:text-indigo-400" : "text-slate-500 hover:text-indigo-600"}`}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Departments Multiselect */}
      <div className="space-y-3">
        <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>Department</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {departmentsList.map(dept => {
            const isChecked = selectedDepartments.includes(dept);
            return (
              <label 
                key={dept} 
                className={`flex items-center gap-2.5 text-xs cursor-pointer select-none py-0.5 transition ${
                  theme === "dark" 
                    ? "text-slate-300 hover:text-white" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={() => toggleDepartment(dept)}
                  className={`rounded focus:ring-indigo-500/20 focus:ring-2 w-4 h-4 transition ${
                    theme === "dark" 
                      ? "border-white/10 bg-[#1E293B]/60 text-indigo-600" 
                      : "border-slate-300 bg-white text-indigo-600"
                  }`}
                />
                <span className={isChecked ? "text-indigo-400 font-semibold" : ""}>{dept}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Year of Study Multiselect */}
      <div className="space-y-3">
        <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>Year of Study</h4>
        <div className="space-y-2">
          {yearsList.map(yr => {
            const isChecked = selectedYears.includes(yr);
            return (
              <label 
                key={yr} 
                className={`flex items-center gap-2.5 text-xs cursor-pointer select-none py-0.5 transition ${
                  theme === "dark" 
                    ? "text-slate-300 hover:text-white" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={() => toggleYear(yr)}
                  className={`rounded focus:ring-indigo-500/20 focus:ring-2 w-4 h-4 transition ${
                    theme === "dark" 
                      ? "border-white/10 bg-[#1E293B]/60 text-indigo-600" 
                      : "border-slate-300 bg-white text-indigo-600"
                  }`}
                />
                <span className={isChecked ? "text-indigo-500 font-semibold" : ""}>{yr}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability Multiselect */}
      <div className="space-y-3">
        <h4 className={`text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>Availability</h4>
        <div className="space-y-2">
          {availabilitiesList.map(avail => {
            const isChecked = selectedAvailabilities.includes(avail);
            return (
              <label 
                key={avail} 
                className={`flex items-center gap-2.5 text-xs cursor-pointer select-none py-0.5 transition ${
                  theme === "dark" 
                    ? "text-slate-300 hover:text-white" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={() => toggleAvailability(avail)}
                  className={`rounded focus:ring-indigo-500/20 focus:ring-2 w-4 h-4 transition ${
                    theme === "dark" 
                      ? "border-white/10 bg-[#1E293B]/60 text-indigo-600" 
                      : "border-slate-300 bg-white text-indigo-600"
                  }`}
                />
                <span className={isChecked ? "text-indigo-500 font-semibold" : ""}>{avail}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <GraduationCap className="text-indigo-400 w-7 h-7" /> Discover Exchange Partners
        </h2>
        <p className={`text-xs mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
          Find other students matching your learning wishlist. Propose custom non-monetary trades.
        </p>
      </div>

      {/* Filter and Search Action Row */}
      <div className={`p-4 rounded-[32px] border ${
        theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"
      } flex flex-col md:flex-row gap-4 items-center justify-between`}>
        
        {/* Search Input & Mobile Filter Toggle */}
        <div className="relative w-full md:flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input 
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs placeholder-slate-400 focus:border-indigo-500 focus:outline-none transition-all duration-200 ${
                theme === "dark" 
                  ? "border-white/5 bg-[#1E293B]/60 text-slate-200" 
                  : "border-slate-200 bg-slate-50 text-slate-800"
              }`}
              placeholder="Search students, skills, or bios..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className={`lg:hidden p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer transition-all ${
              theme === "dark"
                ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-indigo-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* University Filter */}
        <div className="w-full md:w-56">
          <select 
            className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-indigo-500 focus:outline-none transition-all duration-200 ${
              theme === "dark" 
                ? "border-white/5 bg-[#1E293B]/60 text-slate-200" 
                : "border-slate-200 bg-slate-50 text-slate-800"
            }`}
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
          >
            <option value="All" className={theme === "dark" ? "bg-[#1E293B]" : "bg-white"}>All Colleges</option>
            {universities.map((uni) => (
              uni !== "All" ? <option key={uni} value={uni} className={theme === "dark" ? "bg-[#1E293B]" : "bg-white"}>{uni}</option> : null
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="w-full md:w-56">
          <select 
            className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:border-indigo-500 focus:outline-none transition-all duration-200 ${
              theme === "dark" 
                ? "border-white/5 bg-[#1E293B]/60 text-slate-200" 
                : "border-slate-200 bg-slate-50 text-slate-800"
            }`}
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
          >
            <option value="rating" className={theme === "dark" ? "bg-[#1E293B]" : "bg-white"}>Sort: Highest Rating</option>
            <option value="score" className={theme === "dark" ? "bg-[#1E293B]" : "bg-white"}>Sort: Most Profile Score</option>
            <option value="name" className={theme === "dark" ? "bg-[#1E293B]" : "bg-white"}>Sort: Name (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            Active Filters:
          </span>
          
          {/* University Chip */}
          {selectedUniversity !== "All" && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition ${
              theme === "dark" 
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" 
                : "bg-indigo-50 border-indigo-100 text-indigo-700"
            }`}>
              College: {selectedUniversity}
              <button onClick={() => setSelectedUniversity("All")} className="hover:text-rose-400 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Department Chips */}
          {selectedDepartments.map(dept => (
            <span key={dept} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition ${
              theme === "dark" 
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" 
                : "bg-indigo-50 border-indigo-100 text-indigo-700"
            }`}>
              Dept: {dept}
              <button onClick={() => toggleDepartment(dept)} className="hover:text-rose-400 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Year Chips */}
          {selectedYears.map(yr => (
            <span key={yr} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition ${
              theme === "dark" 
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" 
                : "bg-indigo-50 border-indigo-100 text-indigo-700"
            }`}>
              Year: {yr}
              <button onClick={() => toggleYear(yr)} className="hover:text-rose-400 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Availability Chips */}
          {selectedAvailabilities.map(avail => (
            <span key={avail} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition ${
              theme === "dark" 
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" 
                : "bg-indigo-50 border-indigo-100 text-indigo-700"
            }`}>
              Avail: {avail}
              <button onClick={() => toggleAvailability(avail)} className="hover:text-rose-400 transition">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Clear Button */}
          <button 
            onClick={clearAllFilters}
            className={`text-[10px] font-black underline hover:no-underline transition ${
              theme === "dark" ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Content Layout with Sidebar + Student List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Sidebar (col-span-1) */}
        <aside className={`hidden lg:block p-5 rounded-[32px] border ${
          theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"
        } sticky top-6`}>
          {renderSidebarContent()}
        </aside>

        {/* Student List Section (col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* AI-Powered Smart Matches Section */}
          {aiRecommendedPartners.length > 0 && (
            <div className="p-6 rounded-[32px] bg-gradient-to-r from-indigo-950/20 via-purple-950/20 to-slate-900/30 border border-indigo-500/15 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/35 text-indigo-300 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" /> AI Matchmaker Active
                  </span>
                  <h3 className="text-sm font-black tracking-tight text-slate-100 flex items-center gap-1.5">
                    Peer Swap Recommendations
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    We cross-analyzed ratings, barter completion frequencies, and teaching specialties to synthesize your top partners.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiRecommendedPartners.map((partner) => (
                  <div 
                    key={`rec-${partner.id}`}
                    className={`p-4 rounded-2xl border ${
                      theme === "dark" 
                        ? "border-white/5 bg-slate-900/50 hover:bg-slate-900/80" 
                        : "border-slate-200 bg-white"
                    } transition-all duration-300 flex flex-col justify-between relative`}
                  >
                    {/* Score badge top-right */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-2 py-1 rounded-full">
                      <span className="text-[10px] font-mono font-black text-indigo-400">{partner.compatibility}%</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Match</span>
                    </div>

                    <div>
                      {/* Partner Info Header */}
                      <div className="flex items-center gap-3 mb-3 pr-14">
                        <img 
                          src={partner.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${partner.name}`} 
                          className="w-10 h-10 rounded-xl border border-slate-700/50 object-cover cursor-pointer hover:scale-105 transition"
                          alt={partner.name}
                          onClick={() => onSelectStudent(partner)}
                        />
                        <div className="min-w-0">
                          <h4 
                            className="text-xs font-black text-slate-100 truncate hover:underline cursor-pointer"
                            onClick={() => onSelectStudent(partner)}
                          >
                            {partner.name}
                          </h4>
                          <p className="text-[9px] text-slate-400 truncate flex items-center gap-0.5">
                            <GraduationCap className="w-3 h-3 text-indigo-400" /> {partner.university}
                          </p>
                        </div>
                      </div>

                      {/* Synergy message */}
                      <p className="text-[10px] text-indigo-300 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1.5 rounded-lg mb-4 leading-relaxed font-medium">
                        {getSynergyText(partner)}
                      </p>
                    </div>

                    {/* Interactive buttons */}
                    <div className="flex gap-2">
                      <button
                        id={`ai-analysis-${partner.id}`}
                        onClick={() => runStudentAiMatch(partner)}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-[1.02]"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-200" /> AI Syllabus
                      </button>
                      <button
                        id={`propose-swap-rec-${partner.id}`}
                        onClick={() => handleOpenProposal(partner)}
                        className="px-2.5 py-1.5 rounded-lg text-[9px] font-bold border border-slate-700 hover:bg-slate-800 text-slate-300 cursor-pointer transition-all"
                      >
                        Propose Swap
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid of student profiles */}
          {filteredStudents.length === 0 ? (
            <div className={`text-center py-16 border border-dashed rounded-[32px] ${
              theme === "dark" ? "border-white/10 bg-[#1E293B]/20" : "border-slate-300 bg-slate-50"
            }`}>
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No students fit these filter specifications.</p>
              <p className="text-xs text-slate-500 mt-1">Try broadening your search criteria or resetting filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <div 
                  key={student.id}
                  className={`rounded-[32px] border transition-all duration-300 p-6 flex flex-col justify-between ${
                    theme === "dark" 
                      ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm hover:bg-[#1E293B]/60 hover:scale-[1.02] shadow-xl" 
                      : "border-slate-200 bg-white hover:shadow-lg"
                  }`}
                >
                  <div>
                    {/* Header block with avatar and main info */}
                    <div className="flex gap-4 items-center mb-4">
                      <img 
                        src={student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`} 
                        className="w-14 h-14 rounded-2xl border border-slate-700/60 cursor-pointer object-cover hover:scale-105 transition-all" 
                        alt={student.name}
                        onClick={() => onSelectStudent(student)}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 
                          className="font-extrabold text-base text-slate-100 leading-tight hover:underline cursor-pointer flex items-center justify-between gap-2"
                          onClick={() => onSelectStudent(student)}
                        >
                          <span>{student.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold shrink-0">
                            {calculateCompatibility(student)}% Match
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-0.5 mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {student.university}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {student.department} • {student.year}
                        </p>
                      </div>
                    </div>

                    {/* Rating display */}
                    <div className={`flex items-center gap-2 mb-4 px-2.5 py-1.5 rounded-xl border text-xs w-fit ${
                      theme === "dark" ? "bg-[#1E293B]/20 border-white/5 text-slate-200" : "bg-slate-50 border-slate-100 text-slate-700"
                    }`}>
                      <div className="flex gap-0.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                      </div>
                      <span className="font-extrabold">{student.rating || 5.0}</span>
                      <span className="text-[10px] text-slate-400">({student.ratingCount || 0} reviews)</span>
                    </div>

                    {/* Bio text */}
                    <p className="text-xs text-slate-400 leading-relaxed min-h-12 line-clamp-3 mb-4">
                      {student.bio || "No biography provided by this exchange partner yet."}
                    </p>

                    {/* Swap wishlist blocks */}
                    <div className={`space-y-2.5 pt-3 border-t mb-5 ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Offers To Teach:</span>
                        <div className="flex flex-wrap gap-1">
                          {student.skillsToTeach.map((sk) => (
                            <span key={sk} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-medium border border-indigo-500/10">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">Eager To Learn:</span>
                        <div className="flex flex-wrap gap-1">
                          {student.skillsToLearn.map((sk) => (
                            <span key={sk} className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-medium border border-purple-500/10">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interaction row */}
                  <div className={`flex flex-col sm:flex-row gap-2 pt-3 border-t mt-auto ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
                    <button
                      id={`view-profile-${student.id}`}
                      onClick={() => onSelectStudent(student)}
                      className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        theme === "dark" 
                          ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10" 
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                      }`}
                    >
                      Details
                    </button>
                    <button
                      id={`ai-analysis-grid-${student.id}`}
                      onClick={() => runStudentAiMatch(student)}
                      className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center gap-1 border-indigo-500/25 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20`}
                    >
                      <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" /> AI Syllabus
                    </button>
                    <button
                      id={`propose-swap-${student.id}`}
                      onClick={() => handleOpenProposal(student)}
                      className="flex-1 py-2 rounded-xl text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Send className="w-3 h-3" /> Swap
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Slideover */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fade-in">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          {/* Slide panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`relative w-80 max-w-full h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto ${
              theme === "dark" ? "bg-[#1E293B] text-slate-100" : "bg-white text-slate-800"
            }`}
          >
            <div>
              {/* Close button inside mobile slide drawer */}
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pt-8">
                {renderSidebarContent()}
              </div>
            </div>

            {/* Apply button at bottom of mobile drawer */}
            <div className="mt-8 pt-4 border-t border-white/5">
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Exchange Request Modal */}
      {isProposalOpen && proposalPartner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-lg p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/10 bg-[#1E293B]/95 backdrop-blur-xl text-slate-100" 
              : "border-slate-200 bg-white"
          } relative shadow-2xl`}>
            <button 
              id="close-proposal-modal"
              onClick={() => setIsProposalOpen(false)} 
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-400" /> Propose Skill Exchange
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Submit a formal trading proposal to <strong className="text-slate-200">{proposalPartner.name}</strong>.
            </p>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-100">Proposal Dispatched!</h4>
                <p className="text-xs text-slate-400">
                  {proposalPartner.name} will be notified immediately. Check your exchange requests panel for replies.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal} className="space-y-4">
                
                {/* Visual swap summary */}
                <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-4 text-center ${
                  theme === "dark" ? "bg-[#1E293B]/40 border-white/5" : "bg-slate-50 border-slate-100"
                }`}>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">You Offer to Teach:</span>
                    <select
                      className="w-full p-2.5 rounded-xl bg-slate-950 text-xs border border-white/5 focus:border-indigo-500 focus:outline-none font-medium text-indigo-400"
                      value={skillOffered}
                      onChange={(e) => setSkillOffered(e.target.value)}
                      required
                    >
                      <option value="" className="text-slate-500">Select your skill...</option>
                      {user.skillsToTeach.map((s) => (
                        <option key={s} value={s} className="bg-slate-950 text-indigo-400">{s}</option>
                      ))}
                      {user.skillsToTeach.length === 0 && <option value="General Coding" className="bg-slate-950">General Programming</option>}
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Requested from Partner:</span>
                    <select
                      className="w-full p-2.5 rounded-xl bg-slate-950 text-xs border border-white/5 focus:border-indigo-500 focus:outline-none font-medium text-purple-400"
                      value={skillRequested}
                      onChange={(e) => setSkillRequested(e.target.value)}
                      required
                    >
                      <option value="" className="text-slate-500">Select partner skill...</option>
                      {proposalPartner.skillsToTeach.map((s) => (
                        <option key={s} value={s} className="bg-slate-950 text-purple-400">{s}</option>
                      ))}
                      {proposalPartner.skillsToTeach.length === 0 && <option value="Figma Basics" className="bg-slate-950">Figma Design</option>}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Target Exchange Duration</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    >
                      <option value={2} className="bg-slate-950">2 Weeks Sprint</option>
                      <option value={4} className="bg-slate-950">4 Weeks (1 Month)</option>
                      <option value={8} className="bg-slate-950">8 Weeks (2 Months)</option>
                      <option value={12} className="bg-slate-950">12 Weeks (Full Semester)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1">Partner Location Availability</label>
                    <div className={`p-3 rounded-xl border text-xs font-semibold ${
                      theme === "dark" ? "bg-slate-950/60 border-white/5 text-slate-200" : "bg-slate-50 border-slate-100 text-slate-700"
                    }`}>
                      {proposalPartner.availability || "Flexible Dates"}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Personal Greeting / Cover Note</label>
                  <textarea 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none h-20 resize-none" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your goals, weekly timeline ideas, and experience."
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    id="submit-proposal-btn"
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" /> Dispatch Trade Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* AI Analysis Slideover / Modal Popup */}
      {aiAnalysisPartner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`w-full max-w-xl p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/10 bg-[#1E293B]/95 backdrop-blur-xl text-slate-100" 
              : "border-slate-200 bg-white text-slate-800"
          } relative shadow-2xl`}>
            
            <button 
              id="close-ai-analysis-modal"
              onClick={() => {
                setAiAnalysisPartner(null);
                setAiAnalysisResult(null);
              }} 
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-lg mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> AI Skill Exchange Architect
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time Gemini synergy analysis between <strong className="text-slate-200">{user.name}</strong> and <strong className="text-slate-200">{aiAnalysisPartner.name}</strong>.
            </p>

            {aiLoading ? (
              <div className="text-center py-16 space-y-4">
                <BrainCircuit className="w-12 h-12 animate-spin text-indigo-400 mx-auto" />
                <p className="text-xs text-slate-300">Synthesizing skill portfolios and drafting personalized learning roadmaps...</p>
                <div className="w-32 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-indigo-500 animate-[loading_1.5s_infinite]" />
                </div>
              </div>
            ) : aiError ? (
              <div className="text-center py-8 space-y-3">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">{aiError}</p>
                <button
                  onClick={() => runStudentAiMatch(aiAnalysisPartner)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                >
                  Retry Analysis
                </button>
              </div>
            ) : aiAnalysisResult ? (
              <div className="space-y-4">
                
                {/* Score and Core analysis */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-center col-span-1">
                    <span className="text-[9px] text-indigo-400 font-bold block uppercase tracking-wide">Compatibility</span>
                    <span className="text-2xl font-black text-indigo-300 font-mono">{aiAnalysisResult.compatibilityScore || 92}%</span>
                    <span className="text-[8px] text-slate-400 block mt-0.5">High Synergy</span>
                  </div>
                  <div className={`p-4 rounded-2xl border text-xs font-medium leading-relaxed col-span-3 ${
                    theme === "dark" ? "bg-[#1E293B]/60 border-white/5 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"
                  }`}>
                    {aiAnalysisResult.analysis}
                  </div>
                </div>

                {/* Bespoke Roadmap Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Proposed Learning Roadmap
                  </h4>
                  <div className="space-y-3 pl-2 border-l border-slate-700/60 ml-2">
                    {aiAnalysisResult.suggestedRoadmap?.map((stage, idx) => (
                      <div key={idx} className="relative pl-5">
                        {/* Dot marker */}
                        <div className="absolute -left-[14px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-slate-900" />
                        <span className="text-[10px] font-extrabold text-indigo-300 block uppercase font-mono">{stage.phase}</span>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{stage.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Success Tips */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Success Tips for this Exchange
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {aiAnalysisResult.tips?.map((tip, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="text-indigo-400 font-mono mt-0.5 shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action footer */}
                <div className="flex gap-3 justify-end pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      setAiAnalysisPartner(null);
                      setAiAnalysisResult(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                      theme === "dark" ? "border-white/10 text-slate-300 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const p = aiAnalysisPartner;
                      setAiAnalysisPartner(null);
                      setAiAnalysisResult(null);
                      handleOpenProposal(p);
                    }}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  >
                    Lock-In Deal & Propose Swap
                  </button>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      )}

    </div>
  );
}
