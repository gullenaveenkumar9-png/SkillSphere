import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Settings, 
  Bell, 
  Shield, 
  User as UserIcon, 
  Check, 
  Trash2, 
  HelpCircle, 
  Activity, 
  Volume2, 
  Moon, 
  Sun,
  Laptop,
  CheckCircle,
  Eye,
  AlertCircle
} from "lucide-react";
import { User } from "../types";

interface SettingsViewProps {
  user: User;
  onUpdateProfile?: (updatedData: Partial<User>) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export default function SettingsView({ user, onUpdateProfile, theme, setTheme }: SettingsViewProps) {
  // Notification states
  const [emailNewProposals, setEmailNewProposals] = useState(true);
  const [emailChatMsgs, setEmailChatMsgs] = useState(true);
  const [emailSessions, setEmailSessions] = useState(true);
  const [emailLeaderboard, setEmailLeaderboard] = useState(false);

  // Privacy states
  const [publicProfile, setPublicProfile] = useState(true);
  const [showAcademicYear, setShowAcademicYear] = useState(true);
  const [showLocation, setShowLocation] = useState(true);

  // Account feedback states
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (deleteInput.toLowerCase() !== "delete") {
      setDeleteError("Please type 'delete' to confirm account closure.");
      return;
    }
    setDeleteError("");
    alert("In a production system, this request would flag your profile user-id for scheduled data-scrubbing. Thank you for utilizing the SkillSphere demo!");
    setShowDeleteConfirm(false);
  };

  return (
    <div id="skillsphere-settings-container" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Account & Platform Settings</h1>
          <p className="text-xs text-slate-500 font-medium">Configure your swap preferences, email alert thresholds, and privacy levels.</p>
        </div>
      </div>

      {saveSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Success! Your setting configurations have been synchronized with the SkillSphere servers.</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation panel */}
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border ${
            theme === "dark" ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200"
          } space-y-2`}>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-2">Workspace Preference</p>
            <button className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              theme === "dark" ? "bg-indigo-600/15 text-indigo-400" : "bg-indigo-50 text-indigo-600"
            }`}>
              <Settings className="w-4 h-4" /> Platform Customizations
            </button>
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-all">
              <UserIcon className="w-4 h-4" /> Student Profile Link
            </button>
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-all">
              <Shield className="w-4 h-4" /> Integrity & Safety
            </button>
          </div>

          <div className={`p-4 rounded-2xl border ${
            theme === "dark" ? "bg-slate-900/40 border-white/5" : "bg-white border-slate-200"
          } space-y-3`}>
            <div className="flex items-center gap-2 text-indigo-400">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs font-bold">Have Questions?</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If you have any questions or are running into issues with standard barter trades, visit our Help Center or check our system FAQs.
            </p>
          </div>
        </div>

        {/* Settings panels */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Theme Section */}
          <section className={`p-6 rounded-2xl border ${
            theme === "dark" ? "bg-slate-900/30 border-white/5" : "bg-white border-slate-200 shadow-sm"
          } space-y-4`}>
            <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
              <Sun className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold">Visual Themes</h2>
            </div>
            
            <p className="text-[11px] text-slate-400">Toggle your default workspace illumination theme.</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setTheme("dark")}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  theme === "dark" 
                    ? "border-indigo-500 bg-indigo-600/10 text-white" 
                    : "border-slate-200 bg-transparent text-slate-500 hover:border-slate-300"
                }`}
              >
                <Moon className="w-4 h-4" /> Dark Mode (Eye-safe)
              </button>
              <button 
                onClick={() => setTheme("light")}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  theme === "light" 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600" 
                    : "border-slate-800 bg-transparent text-slate-400 hover:border-slate-700"
                }`}
              >
                <Sun className="w-4 h-4" /> Light Mode (Vivid)
              </button>
            </div>
          </section>

          {/* Notifications Section */}
          <section className={`p-6 rounded-2xl border ${
            theme === "dark" ? "bg-slate-900/30 border-white/5" : "bg-white border-slate-200 shadow-sm"
          } space-y-4`}>
            <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
              <Bell className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold">Email Notification Controls</h2>
            </div>

            <p className="text-[11px] text-slate-400">Customize what alerts are dispatched to your institutional student address.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold">New Exchange Proposals</h3>
                  <p className="text-[10px] text-slate-500">Receive alerts when students offer a barter proposal.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailNewProposals}
                  onChange={(e) => setEmailNewProposals(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold">Direct Messages & Chat</h3>
                  <p className="text-[10px] text-slate-500">Receive alerts when you have new messages in active swap rooms.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailChatMsgs}
                  onChange={(e) => setEmailChatMsgs(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold">Session & Meet Scheduling</h3>
                  <p className="text-[10px] text-slate-500">Reminders for upcoming calendar sessions or links additions.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailSessions}
                  onChange={(e) => setEmailSessions(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold">Leaderboard & Achievement Digests</h3>
                  <p className="text-[10px] text-slate-500">Get notified when you advance in platform reputation levels.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailLeaderboard}
                  onChange={(e) => setEmailLeaderboard(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className={`p-6 rounded-2xl border ${
            theme === "dark" ? "bg-slate-900/30 border-white/5" : "bg-white border-slate-200 shadow-sm"
          } space-y-4`}>
            <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
              <Eye className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold">Privacy Settings</h2>
            </div>

            <p className="text-[11px] text-slate-400">Manage what other students see when they browse SkillSphere.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold">Public Discover Board Visibility</h3>
                  <p className="text-[10px] text-slate-500">Show your profile in the Discover Students section for peer requests.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={publicProfile}
                  onChange={(e) => setPublicProfile(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold">Academic Year Publicity</h3>
                  <p className="text-[10px] text-slate-500">Let other students view your current academic status (e.g. 3rd Year).</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={showAcademicYear}
                  onChange={(e) => setShowAcademicYear(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold">Display Location Coordinates</h3>
                  <p className="text-[10px] text-slate-500">Enable location mapping so students can look up peers nearby on campus.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={showLocation}
                  onChange={(e) => setShowLocation(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-all shadow-md"
            >
              Sync Preferences
            </button>
          </div>

          {/* Danger Zone */}
          <section className="p-6 rounded-2xl border border-rose-500/15 bg-rose-500/5 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <Trash2 className="w-4 h-4" />
              <h2 className="text-sm font-bold">Danger Zone</h2>
            </div>
            <p className="text-[11px] text-rose-300 leading-relaxed">
              Once you terminate your student swap portfolio, your reputation achievements, active learning sessions, and matching history will be permanently archived and unrecoverable.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-all"
              >
                Terminate Swap Account
              </button>
            ) : (
              <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Are you absolutely sure?
                </p>
                <p className="text-[10px] text-slate-400">Type <span className="font-bold text-slate-200">delete</span> below to request account closure:</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="delete" 
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs focus:border-rose-500 focus:outline-none"
                  />
                  <button 
                    onClick={handleDeleteAccount}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-all"
                  >
                    Confirm Terminate
                  </button>
                  <button 
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteInput("");
                      setDeleteError("");
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                </div>
                {deleteError && <p className="text-[10px] text-rose-400 font-bold">{deleteError}</p>}
              </div>
            )}
          </section>

        </div>

      </div>
    </div>
  );
}
