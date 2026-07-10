import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Clock, 
  Linkedin, 
  Github, 
  Globe, 
  Star, 
  Plus, 
  X, 
  Save, 
  Edit3, 
  Share2, 
  Download,
  Calendar,
  Languages,
  BadgeAlert,
  ArrowLeft,
  QrCode,
  Check
} from "lucide-react";
import { User } from "../types";

interface ProfileViewProps {
  user: User;
  isSelf: boolean;
  onUpdateProfile?: (updatedData: Partial<User>) => void;
  onBackToDiscover?: () => void;
  theme: "light" | "dark";
}

export default function ProfileView({ user, isSelf, onUpdateProfile, onBackToDiscover, theme }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrMode, setQrMode] = useState<"url" | "card">("url");
  const [name, setName] = useState(user.name);
  const [university, setUniversity] = useState(user.university);
  const [department, setDepartment] = useState(user.department);
  const [year, setYear] = useState(user.year);
  const [location, setLocation] = useState(user.location);
  const [bio, setBio] = useState(user.bio);
  const [linkedin, setLinkedin] = useState(user.linkedin || "");
  const [github, setGithub] = useState(user.github || "");
  const [portfolio, setPortfolio] = useState(user.portfolio || "");
  const [experienceLevel, setExperienceLevel] = useState(user.experienceLevel);
  const [availability, setAvailability] = useState(user.availability);
  const [avatar, setAvatar] = useState(user.avatar || "");

  // Teach/Learn tagging state
  const [teachSkills, setTeachSkills] = useState<string[]>(user.skillsToTeach || []);
  const [learnSkills, setLearnSkills] = useState<string[]>(user.skillsToLearn || []);
  const [newTeachInput, setNewTeachInput] = useState("");
  const [newLearnInput, setNewLearnInput] = useState("");

  const [shareFeedback, setShareFeedback] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);
  const [qrCopyFeedback, setQrCopyFeedback] = useState(false);

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        name,
        university,
        department,
        year,
        location,
        bio,
        linkedin,
        github,
        portfolio,
        experienceLevel,
        availability,
        skillsToTeach: teachSkills,
        skillsToLearn: learnSkills,
        avatar
      });
    }
    setIsEditing(false);
  };

  const handleAddTeachSkill = () => {
    if (newTeachInput.trim() && !teachSkills.includes(newTeachInput.trim())) {
      setTeachSkills([...teachSkills, newTeachInput.trim()]);
      setNewTeachInput("");
    }
  };

  const handleAddLearnSkill = () => {
    if (newLearnInput.trim() && !learnSkills.includes(newLearnInput.trim())) {
      setLearnSkills([...learnSkills, newLearnInput.trim()]);
      setNewLearnInput("");
    }
  };

  const handleRemoveTeach = (skill: string) => {
    setTeachSkills(teachSkills.filter((s) => s !== skill));
  };

  const handleRemoveLearn = (skill: string) => {
    setLearnSkills(learnSkills.filter((s) => s !== skill));
  };

  const handleShare = () => {
    setShareFeedback(true);
    navigator.clipboard.writeText(`${window.location.origin}/profile/${user.id}`);
    setTimeout(() => setShareFeedback(false), 2500);
  };

  const handleDownload = () => {
    setDownloadFeedback(true);
    setTimeout(() => setDownloadFeedback(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back to discover option when viewing another student's profile */}
      {!isSelf && onBackToDiscover && (
        <button 
          id="profile-back-discover-btn"
          onClick={onBackToDiscover}
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer mb-2 hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Student Discovery
        </button>
      )}

      {/* Main card */}
      <div className={`rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-2xl" : "border-slate-200 bg-white shadow-sm"} overflow-hidden`}>
        
        {/* Colorful gradient cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              id="profile-qr-btn"
              onClick={() => setIsQrOpen(true)}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
              title="Generate offline campus QR badge"
            >
              <QrCode className="w-4 h-4 text-cyan-300" />
              Profile QR
            </button>
            <button
              id="profile-share-btn"
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
              title="Share profile link"
            >
              <Share2 className="w-4 h-4" /> 
              {shareFeedback ? "Copied!" : "Share Profile"}
            </button>
            <button
              id="profile-download-btn"
              onClick={handleDownload}
              className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              {downloadFeedback ? "Downloaded PDF!" : "PDF Resume"}
            </button>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="p-6 md:p-8 pt-0 relative">
          
          {/* Avatar repositioned */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 mb-6 gap-4">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} 
              className="w-24 h-24 rounded-3xl border-4 border-[#0F172A] bg-slate-950 relative z-10 shadow-lg object-cover" 
              alt={user.name}
            />

            {isSelf && (
              <button
                id="profile-edit-toggle-btn"
                onClick={() => setIsEditing(!isEditing)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditing ? "Cancel Editing" : "Edit Profile Info"}
              </button>
            )}
          </div>

          {isEditing ? (
            /* Editing view */
            <div className="space-y-6">
              <h3 className="font-extrabold text-lg text-indigo-400 border-b border-white/5 pb-2">Edit Student Profile Info</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Full Name</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Avatar Image URL (Optional)</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={avatar} 
                    onChange={(e) => setAvatar(e.target.value)} 
                    placeholder="https://images.unsplash.com/photo..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">University Name</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={university} 
                    onChange={(e) => setUniversity(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Department</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Academic Year</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                  >
                    <option className="bg-slate-950 text-slate-200">1st Year</option>
                    <option className="bg-slate-950 text-slate-200">2nd Year</option>
                    <option className="bg-slate-950 text-slate-200">3rd Year</option>
                    <option className="bg-slate-950 text-slate-200">4th Year</option>
                    <option className="bg-slate-950 text-slate-200">Masters</option>
                    <option className="bg-slate-950 text-slate-200">PhD</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Location</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Experience Level</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={experienceLevel} 
                    onChange={(e: any) => setExperienceLevel(e.target.value)}
                  >
                    <option className="bg-slate-950 text-slate-200">Beginner</option>
                    <option className="bg-slate-950 text-slate-200">Intermediate</option>
                    <option className="bg-slate-950 text-slate-200">Advanced</option>
                    <option className="bg-slate-950 text-slate-200">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Availability Window</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={availability} 
                    onChange={(e: any) => setAvailability(e.target.value)}
                  >
                    <option className="bg-slate-950 text-slate-200">Weekday Evenings</option>
                    <option className="bg-slate-950 text-slate-200">Weekends</option>
                    <option className="bg-slate-950 text-slate-200">Flexible</option>
                    <option className="bg-slate-950 text-slate-200">Limited</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold block mb-1">Bio Description</label>
                <textarea 
                  className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none h-24 resize-none" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                />
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">LinkedIn Profile</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={linkedin} 
                    onChange={(e) => setLinkedin(e.target.value)} 
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">GitHub Username</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={github} 
                    onChange={(e) => setGithub(e.target.value)} 
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Portfolio Link</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/60 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" 
                    value={portfolio} 
                    onChange={(e) => setPortfolio(e.target.value)} 
                    placeholder="https://mywebsite.dev"
                  />
                </div>
              </div>

              {/* Skills Editor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
                
                {/* Skills Can Teach */}
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Skills I Can Teach (Press Add)</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      className="flex-1 px-4 py-2 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" 
                      value={newTeachInput}
                      onChange={(e) => setNewTeachInput(e.target.value)}
                      placeholder="e.g. Python, CSS, Figma"
                    />
                    <button onClick={handleAddTeachSkill} className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-950/40 rounded-xl border border-white/5">
                    {teachSkills.map((sk) => (
                      <span key={sk} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                        {sk}
                        <button onClick={() => handleRemoveTeach(sk)} className="hover:text-rose-500 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Want to Learn */}
                <div>
                  <label className="text-xs text-slate-400 font-bold block mb-1">Skills I Want to Learn</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      className="flex-1 px-4 py-2 rounded-xl border border-white/5 bg-slate-950/60 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" 
                      value={newLearnInput}
                      onChange={(e) => setNewLearnInput(e.target.value)}
                      placeholder="e.g. Photoshop, Cloud, AI"
                    />
                    <button onClick={handleAddLearnSkill} className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-950/40 rounded-xl border border-white/5">
                    {learnSkills.map((sk) => (
                      <span key={sk} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px]">
                        {sk}
                        <button onClick={() => handleRemoveLearn(sk)} className="hover:text-rose-500 transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action */}
              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  id="profile-save-btn"
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
                >
                  <Save className="w-4 h-4" /> Save Profile Details
                </button>
              </div>

            </div>
          ) : (
            /* Profile View Only Mode */
            <div className="space-y-6">
              
              {/* Header Info */}
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-100">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-indigo-400" /> {user.university}</span>
                  <span>•</span>
                  <span>{user.department}</span>
                  <span>•</span>
                  <span>{user.year}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mt-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" /> {user.location}
                </div>
              </div>

              {/* Rating, Badges summaries & QR code bento layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 flex flex-wrap gap-4 items-center p-4 bg-[#1E293B]/20 border border-white/5 rounded-2xl justify-between">
                  <div className="flex items-center gap-2 pr-4 border-r border-white/5">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`w-4 h-4 ${idx < Math.round(user.rating || 5) ? "fill-amber-500" : "text-slate-600"}`} 
                        />
                      ))}
                    </div>
                    <span className="font-extrabold text-sm text-slate-200">{user.rating || 5.0}</span>
                    <span className="text-[10px] text-slate-400">({user.ratingCount || 0} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Badges:</span>
                    {user.achievements && user.achievements.length > 0 ? (
                      user.achievements.map((ach) => (
                        <span key={ach} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold tracking-wide uppercase border border-indigo-500/20">
                          {ach.replace("-", " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500">No active merit badges yet.</span>
                    )}
                  </div>
                </div>

                <div 
                  id="profile-bento-qr-trigger"
                  onClick={() => setIsQrOpen(true)}
                  className="p-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] shadow-md hover:shadow-indigo-500/5 group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest block group-hover:text-cyan-300 transition-colors">Offline Barter QR</span>
                    <span className="text-xs font-extrabold text-slate-200 block">Campus QR Badge</span>
                    <span className="text-[9px] text-slate-400 block">Tap to scan skill card</span>
                  </div>
                  <div className="w-10 h-10 bg-slate-900/60 rounded-xl border border-white/10 flex items-center justify-center text-slate-300 group-hover:border-indigo-500/30 group-hover:text-white transition-all">
                    <QrCode className="w-5 h-5 text-indigo-400 group-hover:animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div>
                <h4 className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-2">Student Story / Bio</h4>
                <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                  {user.bio || "This student hasn't entered a description biography yet."}
                </p>
              </div>

              {/* Core Details (Teacher vs Learner blocks) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className={`p-5 rounded-[24px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/20" : "border-slate-100 bg-slate-50"}`}>
                  <h4 className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest mb-3">Skills I Can Teach</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {user.skillsToTeach && user.skillsToTeach.length > 0 ? (
                      user.skillsToTeach.map((sk) => (
                        <span key={sk} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No skills listed to teach yet.</span>
                    )}
                  </div>
                </div>

                <div className={`p-5 rounded-[24px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/20" : "border-slate-100 bg-slate-50"}`}>
                  <h4 className="text-xs text-purple-400 font-extrabold uppercase tracking-widest mb-3">Skills I Want to Learn</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {user.skillsToLearn && user.skillsToLearn.length > 0 ? (
                      user.skillsToLearn.map((sk) => (
                        <span key={sk} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No interests listed to learn yet.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata availability lists */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-6">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Level</span>
                    <span className="font-semibold text-slate-100">{user.experienceLevel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Clock className="w-4.5 h-4.5 text-purple-400" />
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Availability</span>
                    <span className="font-semibold text-slate-100">{user.availability}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Languages className="w-4.5 h-4.5 text-cyan-400" />
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px] uppercase">Languages</span>
                    <span className="font-semibold text-slate-100">{user.languages ? user.languages.join(", ") : "English"}</span>
                  </div>
                </div>
              </div>

              {/* Social and Portfolio links */}
              <div className="flex gap-4 border-t border-white/5 pt-6">
                {user.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-950/40 hover:bg-indigo-500/10 border border-white/5 text-slate-400 hover:text-indigo-400 rounded-xl transition-all hover:scale-105">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {user.github && (
                  <a href={user.github} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-950/40 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all hover:scale-105">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {user.portfolio && (
                  <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-950/40 hover:bg-cyan-500/10 border border-white/5 text-slate-400 hover:text-cyan-400 rounded-xl transition-all hover:scale-105">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Review list */}
      <div className={`p-6 md:p-8 rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/30 shadow-xl backdrop-blur-sm" : "border-slate-200 bg-white shadow-sm"}`}>
        <h3 className="font-extrabold text-base mb-6 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" /> Platform Feedback & Reviews History
        </h3>

        {user.reviews && user.reviews.length > 0 ? (
          <div className="space-y-4">
            {user.reviews.map((rev) => (
              <div 
                key={rev.id}
                className={`p-4 rounded-2xl border ${theme === "dark" ? "border-white/5 bg-slate-950/60" : "border-slate-100 bg-slate-50/50"} space-y-2`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img src={rev.reviewerAvatar} className="w-6 h-6 rounded-full border border-white/10" alt={rev.reviewerName} />
                    <span className="font-bold text-xs text-slate-200">{rev.reviewerName}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500" />)}
                  </div>
                </div>
                <p className={`text-xs leading-relaxed italic ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                  "{rev.feedback}"
                </p>
                <div className="text-[9px] text-slate-500 font-medium">
                  Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">
            No active review feedback available for this student yet. Make an exchange to leave peer endorsements!
          </p>
        )}
      </div>

      {/* QR CODE OVERLAY MODAL */}
      {isQrOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`w-full max-w-md p-6 rounded-[32px] border ${
            theme === "dark" 
              ? "border-white/10 bg-[#1E293B]/95 backdrop-blur-xl text-slate-100 shadow-indigo-500/5" 
              : "border-slate-200 bg-white text-slate-800 shadow-xl"
          } relative shadow-2xl overflow-hidden`}>
            
            {/* Ambient background decoration */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />

            <button 
              id="close-profile-qr-modal"
              onClick={() => {
                setIsQrOpen(false);
                setQrCopyFeedback(false);
              }} 
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <span className="inline-flex items-center gap-1 bg-indigo-500/20 border border-indigo-500/35 text-indigo-300 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full">
                <QrCode className="w-3 h-3 text-cyan-300 animate-pulse" /> Offline Campus Swap
              </span>
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                Student Profile QR Code
              </h3>
              <p className="text-xs text-slate-400">
                Scan this card with another phone's camera to instantly swap portfolio links and active teach/learn skills!
              </p>
            </div>

            {/* QR Mode Toggle */}
            <div className="flex bg-slate-950/40 p-1 rounded-xl border border-white/5 mb-6">
              <button
                onClick={() => {
                  setQrMode("url");
                  setQrCopyFeedback(false);
                }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  qrMode === "url"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Digital Web Link
              </button>
              <button
                onClick={() => {
                  setQrMode("card");
                  setQrCopyFeedback(false);
                }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  qrMode === "card"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Offline Skill Card
              </button>
            </div>

            {/* QR Display Container */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-200 relative overflow-hidden shadow-inner mb-6">
              
              {/* Scan target corner decorations */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />

              {/* Glowing scanning laser line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-[scan_2.5s_ease-in-out_infinite]" />

              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  qrMode === "url" 
                    ? `${window.location.origin}/profile/${user.id}` 
                    : `SkillSphere Peer Card\n---\nName: ${user.name}\nUniversity: ${user.university}\nDepartment: ${user.department}\nTeaches: ${(user.skillsToTeach || []).join(", ")}\nWants: ${(user.skillsToLearn || []).join(", ")}\nEmail: ${user.email || 'N/A'}`
                )}&color=0f172a&bgcolor=ffffff`}
                className="w-48 h-48 rounded-lg object-contain bg-white relative z-10"
                alt={`${user.name}'s Profile QR`}
              />
            </div>

            {/* Explanatory data review */}
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5 space-y-1.5 text-left mb-6">
              <span className="text-[9px] font-mono font-bold uppercase text-indigo-400 block tracking-wider">Scan Payload Preview:</span>
              <div className="text-[10px] text-slate-300 font-mono leading-relaxed break-all whitespace-pre-wrap max-h-24 overflow-y-auto">
                {qrMode === "url" ? (
                  `${window.location.origin}/profile/${user.id}`
                ) : (
                  <>
                    <strong className="text-slate-100">{user.name} ({user.department})</strong>
                    {"\n"}University: {user.university}
                    {"\n"}Teaches: {(user.skillsToTeach || []).join(", ")}
                    {"\n"}Wants: {(user.skillsToLearn || []).join(", ")}
                  </>
                )}
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="flex gap-3 justify-end pt-3.5 border-t border-white/5">
              <button
                id="profile-qr-copy-btn"
                onClick={() => {
                  const payload = qrMode === "url" 
                    ? `${window.location.origin}/profile/${user.id}` 
                    : `SkillSphere Peer Card\n---\nName: ${user.name}\nUniversity: ${user.university}\nDepartment: ${user.department}\nTeaches: ${(user.skillsToTeach || []).join(", ")}\nWants: ${(user.skillsToLearn || []).join(", ")}\nEmail: ${user.email || 'N/A'}`;
                  navigator.clipboard.writeText(payload);
                  setQrCopyFeedback(true);
                  setTimeout(() => setQrCopyFeedback(false), 2000);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  theme === "dark" 
                    ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10" 
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {qrCopyFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> : <QrCode className="w-3.5 h-3.5" />}
                {qrCopyFeedback ? "Copied!" : "Copy Payload"}
              </button>
              <button
                id="close-profile-qr-footer-btn"
                onClick={() => {
                  setIsQrOpen(false);
                  setQrCopyFeedback(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 active:scale-95"
              >
                Close QR Card
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
