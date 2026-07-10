import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Activity, 
  Award, 
  TrendingUp, 
  PlusCircle, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  GraduationCap, 
  Star, 
  Send, 
  Check, 
  X, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  Bell, 
  LogOut, 
  Moon, 
  Sun, 
  User as UserIcon, 
  Settings, 
  Flame,
  BrainCircuit,
  Megaphone,
  Briefcase
} from "lucide-react";

import { User, Skill, ExchangeRequest, Session, Notification, Report, Message } from "./types";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import ProfileView from "./components/ProfileView";
import SkillsView from "./components/SkillsView";
import DiscoverView from "./components/DiscoverView";
import ExchangeView from "./components/ExchangeView";
import ChatView from "./components/ChatView";
import LearningSessions from "./components/LearningSessions";
import ProgressTracker from "./components/ProgressTracker";
import AISmartHub from "./components/AISmartHub";
import LeaderboardView from "./components/LeaderboardView";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";

// Footer specific views
import AboutView from "./components/AboutView";
import ContactView from "./components/ContactView";
import ResourcesView from "./components/ResourcesView";
import HelpView from "./components/HelpView";
import FaqView from "./components/FaqView";
import PrivacyView from "./components/PrivacyView";
import TermsView from "./components/TermsView";
import SettingsView from "./components/SettingsView";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [activeTab, setActiveTab] = useState<string>("Landing");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Core domain states
  const [skills, setSkills] = useState<Skill[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeChatExchange, setActiveChatExchange] = useState<ExchangeRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Selected student for viewing details
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // Authentication forms
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("2nd Year");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Notification panel toggle
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // Path mapping for client-side routing
  const tabPathMap: Record<string, string> = {
    "Landing": "/",
    "Dashboard": "/dashboard",
    "Profile": "/profile",
    "Skills": "/skills",
    "Discover": "/discover",
    "Exchanges": "/exchanges",
    "Chat": "/chat",
    "Sessions": "/sessions",
    "Progress": "/progress",
    "AI Hub": "/ai-hub",
    "Leaderboard": "/leaderboard",
    "Settings": "/settings",
    "About": "/about",
    "Contact": "/contact",
    "Resources": "/resources",
    "Help": "/help",
    "FAQ": "/faq",
    "Privacy": "/privacy-policy",
    "Terms": "/terms",
    "Admin": "/admin",
  };

  const getNormalizedTab = (tab: string): string => {
    const normalizedTabMap: Record<string, string> = {
      "landing": "Landing",
      "dashboard": "Dashboard",
      "profile": "Profile",
      "skills": "Skills",
      "discover": "Discover",
      "exchanges": "Exchanges",
      "chat": "Chat",
      "sessions": "Sessions",
      "progress": "Progress",
      "ai hub": "AI Hub",
      "ai-hub": "AI Hub",
      "ai-match": "AI Hub",
      "leaderboard": "Leaderboard",
      "settings": "Settings",
      "about": "About",
      "contact": "Contact",
      "resources": "Resources",
      "help": "Help",
      "faq": "FAQ",
      "privacy": "Privacy",
      "privacy-policy": "Privacy",
      "terms": "Terms",
      "admin": "Admin"
    };
    return normalizedTabMap[tab.toLowerCase()] || tab;
  };

  // Navigation helper for URL routing
  const navigateTo = (tab: string, path: string) => {
    const normTab = getNormalizedTab(tab);
    setActiveTab(normTab);
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = (tab: string) => {
    const normTab = getNormalizedTab(tab);
    const path = tabPathMap[normTab] || "/";
    navigateTo(normTab, path);
  };

  // Sync state on load
  useEffect(() => {
    const savedUser = localStorage.getItem("skillsphere_user");
    const savedToken = localStorage.getItem("skillsphere_token");
    let loggedInUser = null;
    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setToken(savedToken);
      loggedInUser = parsedUser;
    }

    const path = window.location.pathname;
    let initialTab = "Landing";

    // Find tab matching path
    for (const [tab, p] of Object.entries(tabPathMap)) {
      if (p === path) {
        initialTab = tab;
        break;
      }
    }

    // Protected route check
    const protectedTabs = [
      "Dashboard", "Profile", "Skills", "Discover", 
      "Exchanges", "Chat", "Sessions", "Progress", 
      "AI Hub", "Leaderboard", "Settings", "Admin"
    ];

    if (protectedTabs.includes(initialTab) && !loggedInUser) {
      initialTab = "Landing";
      window.history.replaceState({}, "", "/");
    } else if (initialTab === "Landing" && loggedInUser) {
      initialTab = "Dashboard";
      window.history.replaceState({}, "", "/dashboard");
    }

    setActiveTab(initialTab);
  }, []);

  // Listen to popstate event (browser back/forward button clicks)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const isLoggedIn = !!localStorage.getItem("skillsphere_user");
      
      let matchedTab = "Landing";
      for (const [tab, p] of Object.entries(tabPathMap)) {
        if (p === path) {
          matchedTab = tab;
          break;
        }
      }

      // Protected routes redirection
      const protectedTabs = [
        "Dashboard", "Profile", "Skills", "Discover", 
        "Exchanges", "Chat", "Sessions", "Progress", 
        "AI Hub", "Leaderboard", "Settings", "Admin"
      ];

      if (protectedTabs.includes(matchedTab) && !isLoggedIn) {
        matchedTab = "Landing";
        window.history.replaceState({}, "", "/");
      } else if (matchedTab === "Landing" && isLoggedIn) {
        matchedTab = "Dashboard";
        window.history.replaceState({}, "", "/dashboard");
      }

      setActiveTab(matchedTab);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch collections when user changes or route changes
  useEffect(() => {
    fetchInitialData();
  }, [user?.id]);

  const fetchInitialData = async () => {
    try {
      const skillsRes = await fetch("/api/skills");
      if (skillsRes.ok) setSkills(await skillsRes.json());

      const studentsRes = await fetch("/api/students");
      if (studentsRes.ok) setStudents(await studentsRes.json());

      const exchangesRes = await fetch("/api/exchanges");
      if (exchangesRes.ok) setExchanges(await exchangesRes.json());

      const sessionsRes = await fetch("/api/sessions");
      if (sessionsRes.ok) setSessions(await sessionsRes.json());

      if (user) {
        const notifRes = await fetch(`/api/notifications/${user.id}`);
        if (notifRes.ok) setNotifications(await notifRes.json());

        if (user.role === "admin") {
          const reportsRes = await fetch("/api/admin/reports");
          if (reportsRes.ok) setReports(await reportsRes.json());
        }
      }
    } catch (e) {
      console.error("Failed to sync backend collections", e);
    }
  };

  // Poll notifications & active chat messages
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const notifRes = await fetch(`/api/notifications/${user.id}`);
        if (notifRes.ok) setNotifications(await notifRes.json());

        if (activeChatExchange) {
          const msgsRes = await fetch(`/api/messages/${activeChatExchange.id}`);
          if (msgsRes.ok) setChatMessages(await msgsRes.json());
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [user?.id, activeChatExchange?.id]);

  // Handle Auth
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMsg(data.error || "Login credentials failed.");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("skillsphere_user", JSON.stringify(data.user));
      localStorage.setItem("skillsphere_token", data.token);

      setShowAuthModal(false);
      navigate("Dashboard");
    } catch (e) {
      setErrorMsg("Failed to connect with SkillSphere servers.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, university, department, year, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMsg(data.error || "Account registration failed.");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("skillsphere_user", JSON.stringify(data.user));
      localStorage.setItem("skillsphere_token", data.token);

      setShowAuthModal(false);
      navigate("Dashboard");
    } catch (e) {
      setErrorMsg("Failed to dispatch registration request.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("skillsphere_user");
    localStorage.removeItem("skillsphere_token");
    navigate("Landing");
  };

  // Operations
  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/students/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem("skillsphere_user", JSON.stringify(updatedUser));
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSkill = async (skillData: any) => {
    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditSkill = async (id: string, skillData: any) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillData),
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendExchangeRequest = async (requestData: any) => {
    if (!user) return;
    try {
      const response = await fetch("/api/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          ...requestData
        }),
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateExchangeStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/exchanges/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenChat = async (exchange: ExchangeRequest) => {
    setActiveChatExchange(exchange);
    try {
      const msgsRes = await fetch(`/api/messages/${exchange.id}`);
      if (msgsRes.ok) {
        setChatMessages(await msgsRes.json());
      }
      navigate("Chat");
      // Mark read
      await fetch(`/api/messages/${exchange.id}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readerId: user?.id })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (text: string, attachment?: any) => {
    if (!user || !activeChatExchange) return;
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchangeId: activeChatExchange.id,
          senderId: user.id,
          text,
          attachmentUrl: attachment?.url,
          attachmentName: attachment?.name,
          attachmentType: attachment?.type
        }),
      });
      if (response.ok) {
        const newMsg = await response.json();
        setChatMessages((prev) => [...prev, newMsg]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleSession = async (sessionData: any) => {
    if (!user) return;
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          ...sessionData
        }),
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSessionStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/sessions/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Admin and reports
  const handleBanStudent = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}/ban`, {
        method: "POST"
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveReport = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${id}/resolve`, {
        method: "PUT"
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostBroadcast = async (message: string) => {
    try {
      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "System Announcement",
          description: message
        }),
      });
      if (response.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT"
      });
      if (response.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectStudentForView = (student: User) => {
    setSelectedStudent(student);
    navigate("Profile");
  };

  return (
    <div id="skillsphere-app-root" className={`min-h-screen font-sans transition-all duration-300 relative ${
      theme === "dark" 
        ? "bg-[#0F172A] text-slate-100 bg-[radial-gradient(circle_at_50%_-20%,_rgba(99,102,241,0.15),_transparent_50%)]" 
        : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Dynamic cover glow */}
      {theme === "dark" && (
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      )}

      {/* Main navigation header */}
      <nav id="skillsphere-navbar" className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        theme === "dark" 
          ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-xl" 
          : "border-slate-200 bg-white/90 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => user ? navigate("Dashboard") : navigate("Landing")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white transition-all hover:scale-105">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                SkillSphere
              </span>
            </div>

            {/* Middle Nav Items when logged in */}
            {user && (
              <div className="hidden md:flex items-center gap-1.5">
                {[
                  { id: "Dashboard", label: "Dashboard", icon: Activity },
                  { id: "Discover", label: "Discover", icon: Users },
                  { id: "Skills", label: "Skills Catalog", icon: BookOpen },
                  { id: "Exchanges", label: "Exchanges", icon: Send },
                  { id: "Sessions", label: "Sessions", icon: Calendar },
                  { id: "Progress", label: "Progress", icon: TrendingUp },
                  { id: "AI Hub", label: "AI Copilot", icon: BrainCircuit },
                  { id: "Leaderboard", label: "Leaderboard", icon: Star },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      onClick={() => {
                        navigate(item.id);
                        setSelectedStudent(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive 
                          ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25 shadow-sm shadow-indigo-500/5" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </button>
                  );
                })}

                {user.role === "admin" && (
                  <button
                    id="nav-Admin"
                    onClick={() => navigate("Admin")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "Admin"
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/25"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" /> Admin
                  </button>
                )}
              </div>
            )}

            {/* Right side utilities */}
            <div className="flex items-center gap-3">
              
              {/* Light/Dark theme selector */}
              <button
                id="theme-toggle-btn"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  theme === "dark" 
                    ? "border-white/5 bg-[#1E293B]/60 text-slate-300 hover:bg-white/10" 
                    : "border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                }`}
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {user ? (
                <>
                  {/* Notifications Alert Bell */}
                  <div className="relative">
                    <button
                      id="notif-bell-btn"
                      onClick={() => setShowNotifPanel(!showNotifPanel)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        theme === "dark" 
                          ? "border-white/5 bg-[#1E293B]/60 text-slate-300 hover:bg-white/10" 
                          : "border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      {notifications.filter((n) => !n.isRead).length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                      )}
                    </button>

                    {/* Popover */}
                    {showNotifPanel && (
                      <div className={`absolute right-0 mt-2 w-80 rounded-2xl border ${
                        theme === "dark" ? "border-slate-800 bg-slate-950 shadow-2xl" : "border-slate-200 bg-white shadow-lg"
                      } p-4 z-50 space-y-3`}>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                          <span className="font-extrabold text-xs">Alert Center</span>
                          <span className="text-[10px] text-indigo-400 font-bold font-mono">
                            {notifications.filter(n => !n.isRead).length} new
                          </span>
                        </div>
                        
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="text-[10px] text-slate-500 text-center py-4">No notifications yet.</p>
                          ) : (
                            notifications.map((notif) => (
                              <div 
                                key={notif.id} 
                                onClick={() => handleMarkNotifRead(notif.id)}
                                className={`p-2.5 rounded-lg border text-[10px] cursor-pointer transition-all ${
                                  notif.isRead 
                                    ? "border-transparent text-slate-400" 
                                    : "border-indigo-500/10 bg-indigo-500/5 text-slate-200"
                                }`}
                              >
                                <div className="font-bold flex justify-between">
                                  <span>{notif.title}</span>
                                  {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 self-center" />}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{notif.description}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile avatar link */}
                  <img
                    id="profile-avatar-nav-link"
                    src={user.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + user.name}
                    className="w-8 h-8 rounded-full border border-slate-800 cursor-pointer object-cover animate-pulse-subtle"
                    alt={user.name}
                    onClick={() => {
                      setSelectedStudent(null);
                      navigate("Profile");
                    }}
                  />

                  {/* Settings Link */}
                  <button
                    id="settings-nav-btn"
                    onClick={() => {
                      setSelectedStudent(null);
                      navigate("Settings");
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      activeTab === "Settings"
                        ? "bg-indigo-600/15 text-indigo-400 border-indigo-500/25"
                        : theme === "dark" 
                          ? "border-white/5 bg-[#1E293B]/60 text-slate-300 hover:bg-white/10" 
                          : "border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                    }`}
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Log Out */}
                  <button
                    id="logout-nav-btn"
                    onClick={handleLogout}
                    className="p-2 rounded-xl border border-slate-800/80 hover:bg-slate-900/40 text-rose-400 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  id="nav-join-btn"
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-all shadow-lg shadow-indigo-500/25"
                >
                  Join Platform
                </button>
              )}

            </div>

          </div>
        </div>
      </nav>

      {/* Main Page Swapper */}
      <main id="skillsphere-main-stage" className="py-2">
        {activeTab === "Landing" && (
          <LandingPage 
            onJoinNow={() => {
              setAuthMode("signup");
              setShowAuthModal(true);
            }}
            onExplore={() => {
              setAuthMode("login");
              setShowAuthModal(true);
            }}
            theme={theme}
          />
        )}

        {activeTab === "About" && (
          <AboutView theme={theme} />
        )}

        {activeTab === "Contact" && (
          <ContactView theme={theme} />
        )}

        {activeTab === "Resources" && (
          <ResourcesView theme={theme} />
        )}

        {activeTab === "Help" && (
          <HelpView theme={theme} />
        )}

        {activeTab === "FAQ" && (
          <FaqView theme={theme} />
        )}

        {activeTab === "Privacy" && (
          <PrivacyView theme={theme} />
        )}

        {activeTab === "Terms" && (
          <TermsView theme={theme} />
        )}

        {user && activeTab === "Dashboard" && (
          <Dashboard
            user={user}
            skills={skills}
            exchanges={exchanges}
            sessions={sessions}
            notifications={notifications}
            students={students}
            onNavigate={(view) => navigate(view)}
            onSelectStudent={handleSelectStudentForView}
            theme={theme}
          />
        )}

        {user && activeTab === "Profile" && (
          <ProfileView
            user={selectedStudent || user}
            isSelf={!selectedStudent || selectedStudent.id === user.id}
            onUpdateProfile={handleUpdateProfile}
            onBackToDiscover={selectedStudent ? () => {
              setSelectedStudent(null);
              navigate("Discover");
            } : undefined}
            theme={theme}
          />
        )}

        {user && activeTab === "Skills" && (
          <SkillsView
            skills={skills}
            user={user}
            onAddSkill={handleAddSkill}
            onEditSkill={handleEditSkill}
            onDeleteSkill={handleDeleteSkill}
            theme={theme}
          />
        )}

        {user && activeTab === "Discover" && (
          <DiscoverView
            students={students}
            user={user}
            onSendExchangeRequest={handleSendExchangeRequest}
            onSelectStudent={handleSelectStudentForView}
            theme={theme}
          />
        )}

        {user && activeTab === "Exchanges" && (
          <ExchangeView
            exchanges={exchanges}
            user={user}
            onUpdateStatus={handleUpdateExchangeStatus}
            onOpenChat={handleOpenChat}
            onOpenScheduler={(exch) => navigate("Sessions")}
            theme={theme}
          />
        )}

        {user && activeTab === "Chat" && activeChatExchange && (
          <ChatView
            exchange={activeChatExchange}
            user={user}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onBack={() => navigate("Exchanges")}
            theme={theme}
          />
        )}

        {user && activeTab === "Sessions" && (
          <LearningSessions
            sessions={sessions}
            user={user}
            exchanges={exchanges}
            onScheduleSession={handleScheduleSession}
            onUpdateSessionStatus={handleUpdateSessionStatus}
            theme={theme}
          />
        )}

        {user && activeTab === "Progress" && (
          <ProgressTracker
            sessions={sessions}
            user={user}
            theme={theme}
          />
        )}

        {user && activeTab === "AI Hub" && (
          <AISmartHub
            user={user}
            theme={theme}
          />
        )}

        {user && activeTab === "Leaderboard" && (
          <LeaderboardView
            students={students}
            user={user}
            theme={theme}
          />
        )}

        {user && activeTab === "Settings" && (
          <SettingsView
            user={user}
            onUpdateProfile={handleUpdateProfile}
            theme={theme}
            setTheme={setTheme}
          />
        )}

        {user && user.role === "admin" && activeTab === "Admin" && (
          <AdminPanel
            students={students}
            reports={reports}
            onBanStudent={handleBanStudent}
            onResolveReport={handleResolveReport}
            onPostBroadcast={handlePostBroadcast}
            theme={theme}
          />
        )}
      </main>

      {/* Global Shared Footer */}
      <Footer theme={theme} onNavigate={navigateTo} isLoggedIn={!!user} />

      {/* Auth Modal Overlay with glassmorphism */}
      {showAuthModal && (
        <div id="auth-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md p-6 rounded-2xl border ${
            theme === "dark" ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"
          } relative shadow-2xl space-y-4`}>
            
            <button 
              id="close-auth-modal"
              onClick={() => setShowAuthModal(false)} 
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header branding */}
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto text-white shadow-md">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-xl">
                {authMode === "login" ? "Welcome Back to SkillSphere" : "Create Student Account"}
              </h3>
              <p className="text-xs text-slate-500">
                {authMode === "login" ? "Enter your institutional email to begin swapping lessons" : "Setup your academic swap portfolio"}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {authMode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Student / Admin Email</label>
                  <input 
                    type="email"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                    placeholder="alex@university.edu or admin@skillsphere.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Password</label>
                  <input 
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-indigo-600" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    /> Remember Session
                  </label>
                  <span className="hover:underline cursor-pointer">Forgot Credentials?</span>
                </div>

                <button
                  id="auth-login-submit"
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer"
                >
                  Enter Platform Workspace
                </button>

                <p className="text-[10px] text-slate-500 text-center font-bold">
                  Demo access credentials: Use any student email (e.g. alex@university.edu) or admin (admin@skillsphere.com). Password can be anything.
                </p>

                <div className="text-center text-[10px] text-slate-400">
                  Don't have an account?{" "}
                  <strong onClick={() => setAuthMode("signup")} className="text-indigo-400 hover:underline cursor-pointer">
                    Sign Up
                  </strong>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Full Name</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                      placeholder="e.g. Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Email</label>
                    <input 
                      type="email"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                      placeholder="alex@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">University</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                      placeholder="e.g. Stanford"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Department</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                      placeholder="Computer Science"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Academic Year</label>
                    <select
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Masters</option>
                      <option>PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Password</label>
                    <input 
                      type="password"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs focus:border-indigo-500 focus:outline-none text-slate-200"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  id="auth-signup-submit"
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer"
                >
                  Register Swap Portfolio
                </button>

                <div className="text-center text-[10px] text-slate-400">
                  Already registered?{" "}
                  <strong onClick={() => setAuthMode("login")} className="text-indigo-400 hover:underline cursor-pointer">
                    Log In
                  </strong>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
