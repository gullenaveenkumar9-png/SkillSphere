import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to file-based persistent DB
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Global data store structure
interface DataStore {
  users: any[];
  skills: any[];
  exchanges: any[];
  messages: any[];
  sessions: any[];
  reviews: any[];
  notifications: any[];
  reports: any[];
}

const DEFAULT_USERS = [
  {
    id: "user-1",
    name: "Alex Rivera",
    email: "alex@university.edu",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
    university: "Stanford University",
    department: "Computer Science",
    year: "3rd Year",
    location: "Stanford, CA",
    bio: "Passionate about building modern web apps & machine learning. I spend my weekends hacking on React projects and reading research papers. Happy to share my Python knowledge in exchange for solid design fundamentals!",
    linkedin: "https://linkedin.com/in/alexrivera",
    github: "https://github.com/alexrivera",
    portfolio: "https://alexrivera.dev",
    skillsToTeach: ["Python", "Machine Learning", "React", "TypeScript"],
    skillsToLearn: ["UI UX", "Figma", "Graphic Design", "Public Speaking"],
    experienceLevel: "Advanced",
    availability: "Weekends",
    languages: ["English", "Spanish"],
    rating: 4.9,
    ratingCount: 12,
    reviews: [
      {
        id: "rev-1",
        reviewerId: "user-2",
        reviewerName: "Siddharth Mehta",
        reviewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        exchangeId: "exch-101",
        rating: 5,
        feedback: "Alex was incredibly patient when teaching me Python basics. He used visual diagrams that made OOP concepts trivial. 10/10 mentor!",
        createdAt: "2026-06-15T14:30:00Z"
      }
    ],
    achievements: ["first-exchange", "five-star-mentor", "top-mentor"],
    isBanned: false,
    profileScore: 92
  },
  {
    id: "user-2",
    name: "Siddharth Mehta",
    email: "sid@iit.edu",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    university: "IIT Bombay",
    department: "Mechanical Engineering",
    year: "4th Year",
    location: "Mumbai, MH",
    bio: "Figma enthusiast and Product Design hobbyist. I've built UI kits and designed mobile apps for campus startups. Looking to pick up Web Development (React/CSS) and Cloud computing to bring my designs to life.",
    linkedin: "https://linkedin.com/in/sidmehta",
    github: "https://github.com/sidmehta",
    skillsToTeach: ["UI UX", "Figma", "Graphic Design", "Video Editing"],
    skillsToLearn: ["React", "CSS", "Cloud", "DevOps"],
    experienceLevel: "Advanced",
    availability: "Weekday Evenings",
    languages: ["English", "Hindi", "Gujarati"],
    rating: 4.8,
    ratingCount: 8,
    reviews: [
      {
        id: "rev-2",
        reviewerId: "user-1",
        reviewerName: "Alex Rivera",
        reviewerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
        exchangeId: "exch-101",
        rating: 5,
        feedback: "Sid reviewed my landing page layout and gave game-changing pointers about spacing and responsive grids. Huge help!",
        createdAt: "2026-06-20T10:00:00Z"
      }
    ],
    achievements: ["first-exchange", "fast-learner"],
    isBanned: false,
    profileScore: 85
  },
  {
    id: "user-3",
    name: "Elena Rostova",
    email: "elena@mit.edu",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    university: "Massachusetts Institute of Technology",
    department: "Mathematics",
    year: "Masters",
    location: "Cambridge, MA",
    bio: "Math wiz specializing in Calculus, Linear Algebra, and Cryptography. I write complex algorithms for fun. I am seeking a native Spanish speaker to help me practice conversational fluency before my semester abroad, and someone who can guide me in basic Music production.",
    linkedin: "https://linkedin.com/in/elenarostova",
    portfolio: "https://elena-math.mit.edu",
    skillsToTeach: ["Mathematics", "Data Science", "Cyber Security"],
    skillsToLearn: ["Languages", "Music", "Cooking"],
    experienceLevel: "Expert",
    availability: "Flexible",
    languages: ["English", "Russian"],
    rating: 5.0,
    ratingCount: 15,
    reviews: [],
    achievements: ["gold-teacher", "five-star-mentor", "skill-master"],
    isBanned: false,
    profileScore: 95
  },
  {
    id: "user-4",
    name: "Marcus Chen",
    email: "marcus@nus.edu",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    university: "National University of Singapore",
    department: "Business & Finance",
    year: "2nd Year",
    location: "Singapore",
    bio: "Avid public speaker, marketing strategist, and startup pitcher. I love pitch decks, growth hacking, and market research. Seeking someone to teach me basic Python coding for data analysis, and advanced Excel modeling.",
    linkedin: "https://linkedin.com/in/marcuschen",
    skillsToTeach: ["Public Speaking", "Marketing", "Business", "Finance"],
    skillsToLearn: ["Python", "Data Science", "Mathematics"],
    experienceLevel: "Intermediate",
    availability: "Weekday Evenings",
    languages: ["English", "Mandarin", "Cantonese"],
    rating: 4.7,
    ratingCount: 5,
    reviews: [],
    achievements: ["community-helper"],
    isBanned: false,
    profileScore: 78
  },
  {
    id: "user-admin",
    name: "Chief Admin",
    email: "admin@skillsphere.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop",
    university: "SkillSphereHQ",
    department: "Platform Moderation",
    year: "Staff",
    location: "Global",
    bio: "Main system administrator for SkillSphere. Ensuring a safe, educational, and productive environment for all student exchanges.",
    skillsToTeach: ["Platform Management"],
    skillsToLearn: [],
    experienceLevel: "Expert",
    availability: "Flexible",
    languages: ["English"],
    rating: 5.0,
    ratingCount: 0,
    reviews: [],
    achievements: [],
    isBanned: false,
    profileScore: 100
  }
];

const DEFAULT_SKILLS = [
  { id: "sk-1", name: "Python Automation", category: "Programming", level: "Advanced", studentId: "user-1", studentName: "Alex Rivera", studentAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop", description: "Learn Python script writing, web scraping with BeautifulSoup, API consumption, and automated data cleaning files.", isApproved: true, favoritesCount: 24 },
  { id: "sk-2", name: "Machine Learning Foundations", category: "Machine Learning", level: "Intermediate", studentId: "user-1", studentName: "Alex Rivera", studentAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop", description: "Cover basic algorithms: Linear Regression, Decision Trees, K-Means Clustering, and Scikit-Learn libraries.", isApproved: true, favoritesCount: 42 },
  { id: "sk-3", name: "Figma App Design & Prototyping", category: "UI UX", level: "Expert", studentId: "user-2", studentName: "Siddharth Mehta", studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", description: "Interactive components, design systems, layouts, responsive scaling, and high-fidelity clickable mockups.", isApproved: true, favoritesCount: 35 },
  { id: "sk-4", name: "Video Production with Premiere Pro", category: "Video Editing", level: "Advanced", studentId: "user-2", studentName: "Siddharth Mehta", studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", description: "Cutting-edge social media editing: color grading, sound design, transitions, keyframes, and fast export strategies.", isApproved: true, favoritesCount: 19 },
  { id: "sk-5", name: "Linear Algebra & Calculus Coaching", category: "Mathematics", level: "Expert", studentId: "user-3", studentName: "Elena Rostova", studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", description: "Solve hard equations, eigenvectors, matrix operations, multivariate calculus, and cryptographic applications.", isApproved: true, favoritesCount: 15 },
  { id: "sk-6", name: "Cyber Security Fundamentals", category: "Cyber Security", level: "Advanced", studentId: "user-3", studentName: "Elena Rostova", studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", description: "Network security, pen-testing, hashing, asymmetric encryption, and securing Express servers from common exploits.", isApproved: true, favoritesCount: 28 },
  { id: "sk-7", name: "Pitch Deck Secrets & Presentation", category: "Public Speaking", level: "Advanced", studentId: "user-4", studentName: "Marcus Chen", studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", description: "How to capture attention in the first 30 seconds, slide design, vocal tone control, and overcoming stage anxiety.", isApproved: true, favoritesCount: 11 },
  { id: "sk-8", name: "Growth Marketing & SEO", category: "Marketing", level: "Intermediate", studentId: "user-4", studentName: "Marcus Chen", studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", description: "Learn key metrics, Google Analytics, search engine optimization, content strategy pipelines, and organic growth.", isApproved: true, favoritesCount: 14 }
];

const DEFAULT_EXCHANGES = [
  {
    id: "exch-1",
    senderId: "user-2",
    senderName: "Siddharth Mehta",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    receiverId: "user-1",
    receiverName: "Alex Rivera",
    receiverAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
    skillOffered: "UI UX (Figma)",
    skillRequested: "Python (Automation)",
    durationWeeks: 4,
    message: "Hey Alex! I see you want to learn UI UX. I've designed apps for two years and would love to teach you Figma if you can teach me Python scripts for web scraping. Deal?",
    status: "Completed",
    createdAt: "2026-06-10T09:00:00Z"
  }
];

const DEFAULT_MESSAGES = [
  {
    id: "msg-1",
    exchangeId: "exch-1",
    senderId: "user-2",
    text: "Hi Alex, hope you liked my skill proposal!",
    timestamp: "2026-06-10T09:05:00Z",
    isRead: true
  },
  {
    id: "msg-2",
    exchangeId: "exch-1",
    senderId: "user-1",
    text: "Absolutely! I've been meaning to polish my designer skills. Let's start with a basic Figma orientation.",
    timestamp: "2026-06-10T10:12:00Z",
    isRead: true
  }
];

const DEFAULT_SESSIONS = [
  {
    id: "sess-1",
    exchangeId: "exch-1",
    senderId: "user-1",
    receiverId: "user-2",
    skillName: "Figma App Design & Prototyping",
    date: "2026-06-12",
    time: "15:00",
    durationHours: 1.5,
    status: "completed",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingPlatform: "Google Meet",
    reminderSent: true
  },
  {
    id: "sess-2",
    exchangeId: "exch-1",
    senderId: "user-2",
    receiverId: "user-1",
    skillName: "Python Automation",
    date: "2026-06-14",
    time: "18:00",
    durationHours: 1.5,
    status: "completed",
    meetingLink: "https://meet.google.com/xyz-pqrs-tuv",
    meetingPlatform: "Google Meet",
    reminderSent: true
  }
];

const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    reviewerId: "user-2",
    reviewerName: "Siddharth Mehta",
    reviewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    exchangeId: "exch-1",
    rating: 5,
    feedback: "Alex was incredibly patient when teaching me Python basics. He used visual diagrams that made OOP concepts trivial. 10/10 mentor!",
    createdAt: "2026-06-15T14:30:00Z"
  },
  {
    id: "rev-2",
    reviewerId: "user-1",
    reviewerName: "Alex Rivera",
    reviewerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
    exchangeId: "exch-1",
    rating: 5,
    feedback: "Sid reviewed my landing page layout and gave game-changing pointers about spacing and responsive grids. Huge help!",
    createdAt: "2026-06-20T10:00:00Z"
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Welcome to SkillSphere!",
    description: "Your passport to the ultimate student knowledge sharing economy. Complete your profile to double your matching rate!",
    type: "system",
    isRead: false,
    createdAt: "2026-07-09T08:00:00Z"
  }
];

const DEFAULT_REPORTS: any[] = [];

// Helper to load DB
function loadDB(): DataStore {
  let initialStore: DataStore;
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      initialStore = JSON.parse(content);
    } catch (e) {
      console.error("Failed to read DB, resetting to defaults", e);
      initialStore = {
        users: DEFAULT_USERS,
        skills: DEFAULT_SKILLS,
        exchanges: DEFAULT_EXCHANGES,
        messages: DEFAULT_MESSAGES,
        sessions: DEFAULT_SESSIONS,
        reviews: DEFAULT_REVIEWS,
        notifications: DEFAULT_NOTIFICATIONS,
        reports: DEFAULT_REPORTS
      };
    }
  } else {
    initialStore = {
      users: DEFAULT_USERS,
      skills: DEFAULT_SKILLS,
      exchanges: DEFAULT_EXCHANGES,
      messages: DEFAULT_MESSAGES,
      sessions: DEFAULT_SESSIONS,
      reviews: DEFAULT_REVIEWS,
      notifications: DEFAULT_NOTIFICATIONS,
      reports: DEFAULT_REPORTS
    };
  }

  // Pre-calculate points and level fields for all loaded users
  initialStore.users.forEach((user) => {
    user.profileScore = user.profileScore || 60; // default points
    user.points = user.profileScore;
    user.level = Math.floor(user.profileScore / 100) + 1;
    if (!user.achievements) user.achievements = [];
  });

  return initialStore;
}

// Helper to save DB
function saveDB(store: DataStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save DB file", e);
  }
}

// Initialize database in-memory for active request handling
let db = loadDB();

// Sync user points, level, and dynamic milestone awards
function syncUserPointsAndLevel(userId: string) {
  const user = db.users.find((u) => u.id === userId);
  if (!user) return;

  // Sync points with profileScore
  user.profileScore = user.profileScore || 0;
  user.points = user.profileScore;
  user.level = Math.floor(user.profileScore / 100) + 1;

  if (!user.achievements) {
    user.achievements = [];
  }

  // 1. Level 3 milestone achievement ("top-mentor")
  if (user.level >= 3 && !user.achievements.includes("top-mentor")) {
    user.achievements.push("top-mentor");
    db.notifications.push({
      id: `notif-badge-${Date.now()}-${userId}`,
      userId: userId,
      title: "New Badge Unlocked! 🏅",
      description: "Congratulations! You've unlocked the Elite Level 3 'Grandmaster Star' Badge for crossing 200 reputation points!",
      type: "system",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  // 2. High Points milestone achievement ("skill-master")
  if (user.profileScore >= 500 && !user.achievements.includes("skill-master")) {
    user.achievements.push("skill-master");
    db.notifications.push({
      id: `notif-badge-master-${Date.now()}-${userId}`,
      userId: userId,
      title: "Prestige Achievement! 🏆",
      description: "Phenomenal! You've earned the 'Skill Master' title for accumulating over 500 total barter points!",
      type: "system",
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }
}

// Sync current state of rating on users
function recalculateUserRating(userId: string) {
  const reviews = db.reviews.filter((r) => {
    const exch = db.exchanges.find((e) => e.id === r.exchangeId);
    if (!exch) return false;
    return r.reviewerId !== userId && (exch.senderId === userId || exch.receiverId === userId);
  });
  
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sum / reviews.length).toFixed(1));
    const user = db.users.find((u) => u.id === userId);
    if (user) {
      user.rating = avg;
      user.ratingCount = reviews.length;
    }
  }
}

// Recalculate and sync for default users
recalculateUserRating("user-1");
recalculateUserRating("user-2");
syncUserPointsAndLevel("user-1");
syncUserPointsAndLevel("user-2");
saveDB(db);

// ---------------------------------------------
// AUTH ENDPOINTS
// ---------------------------------------------

app.post("/api/auth/login", (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Support super simple credentials check
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    // Auto-create standard mock student user if not exists to facilitate frictionless login for testing
    const name = email.split("@")[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    user = {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: email.toLowerCase(),
      role: email.includes("admin") ? "admin" : "student",
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${formattedName}`,
      university: "State Tech University",
      department: "Engineering",
      year: "2nd Year",
      location: "San Jose, CA",
      bio: "Excited to share my expertise and pick up some amazing new skills!",
      skillsToTeach: ["Web Development", "React"],
      skillsToLearn: ["Figma", "UI UX"],
      experienceLevel: "Intermediate",
      availability: "Flexible",
      languages: ["English"],
      rating: 5.0,
      ratingCount: 0,
      reviews: [],
      achievements: ["first-exchange"],
      isBanned: false,
      profileScore: 50
    };
    db.users.push(user);
    saveDB(db);
  }

  if (user.isBanned) {
    return res.status(403).json({ error: "Your account is temporarily banned by administrators." });
  }

  // Simulate JWT token
  const mockToken = `mock-jwt-token-for-${user.id}`;
  res.json({ user, token: mockToken });
});

app.post("/api/auth/signup", (req, res) => {
  const { name, email, university, department, year, password } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  let existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    role: "student",
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
    university: university || "State Tech University",
    department: department || "Computer Science",
    year: year || "1st Year",
    location: "USA",
    bio: "Hi! I just joined SkillSphere! Looking forward to swapping coding lessons, design concepts, and languages.",
    skillsToTeach: [],
    skillsToLearn: [],
    experienceLevel: "Beginner" as const,
    availability: "Flexible" as const,
    languages: ["English"],
    rating: 5.0,
    ratingCount: 0,
    reviews: [],
    achievements: [],
    isBanned: false,
    profileScore: 40
  };

  db.users.push(newUser);
  // Give sign up system notification
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: newUser.id,
    title: "Account Created!",
    description: "Welcome to SkillSphere! Try listing what you can teach and what you want to learn to start matching.",
    type: "system",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  saveDB(db);
  res.status(201).json({ user: newUser, token: `mock-jwt-token-for-${newUser.id}` });
});

app.post("/api/auth/forgot-password", (req, res) => {
  res.json({ message: "An OTP password-reset code has been sent to your student email." });
});

app.post("/api/auth/verify-otp", (req, res) => {
  res.json({ success: true, message: "OTP Verification successful. Access granted." });
});

// ---------------------------------------------
// SKILLS ENDPOINTS
// ---------------------------------------------

app.get("/api/skills", (req, res) => {
  res.json(db.skills);
});

app.post("/api/skills", (req, res) => {
  const { name, category, level, studentId, studentName, studentAvatar, description } = req.body;
  
  if (!name || !category || !studentId) {
    return res.status(400).json({ error: "Skill name, category, and student ID are required." });
  }

  const newSkill = {
    id: `sk-${Date.now()}`,
    name,
    category,
    level: level || "Intermediate",
    studentId,
    studentName,
    studentAvatar: studentAvatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + studentName,
    description: description || `Learn awesome aspects of ${name}.`,
    isApproved: true, // Auto-approve for demo flexibility, can toggle in admin
    favoritesCount: 0
  };

  db.skills.push(newSkill);
  
  // Sync on teaching skills list for user
  const user = db.users.find((u) => u.id === studentId);
  if (user) {
    if (!user.skillsToTeach.includes(name)) {
      user.skillsToTeach.push(name);
    }
    // Boost profile score
    user.profileScore = Math.min(100, (user.profileScore || 40) + 10);
  }

  saveDB(db);
  res.status(201).json(newSkill);
});

app.put("/api/skills/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, level, description } = req.body;
  const skill = db.skills.find((s) => s.id === id);
  
  if (!skill) {
    return res.status(404).json({ error: "Skill not found" });
  }

  // Update
  if (name) skill.name = name;
  if (category) skill.category = category;
  if (level) skill.level = level;
  if (description) skill.description = description;

  saveDB(db);
  res.json(skill);
});

app.delete("/api/skills/:id", (req, res) => {
  const { id } = req.params;
  const index = db.skills.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Skill not found" });
  }

  const deleted = db.skills.splice(index, 1)[0];
  
  // Sync user skillsToTeach
  const user = db.users.find((u) => u.id === deleted.studentId);
  if (user) {
    user.skillsToTeach = user.skillsToTeach.filter((s: string) => s !== deleted.name);
  }

  saveDB(db);
  res.json({ message: "Skill deleted successfully", deletedId: id });
});

// Admin toggle approval
app.post("/api/skills/:id/approve", (req, res) => {
  const { id } = req.params;
  const skill = db.skills.find((s) => s.id === id);
  if (!skill) {
    return res.status(404).json({ error: "Skill not found" });
  }

  skill.isApproved = !skill.isApproved;
  saveDB(db);
  res.json(skill);
});

// ---------------------------------------------
// STUDENT / DISCOVER ENDPOINTS
// ---------------------------------------------

app.get("/api/students", (req, res) => {
  // Only non-admin & non-banned users
  const students = db.users.filter((u) => u.role !== "admin" && !u.isBanned);
  res.json(students);
});

app.put("/api/students/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update biography and custom profile elements
  if (data.name) user.name = data.name;
  if (data.university) user.university = data.university;
  if (data.department) user.department = data.department;
  if (data.year) user.year = data.year;
  if (data.location) user.location = data.location;
  if (data.bio) user.bio = data.bio;
  if (data.linkedin !== undefined) user.linkedin = data.linkedin;
  if (data.github !== undefined) user.github = data.github;
  if (data.portfolio !== undefined) user.portfolio = data.portfolio;
  if (data.skillsToTeach !== undefined) user.skillsToTeach = data.skillsToTeach;
  if (data.skillsToLearn !== undefined) user.skillsToLearn = data.skillsToLearn;
  if (data.experienceLevel) user.experienceLevel = data.experienceLevel;
  if (data.availability) user.availability = data.availability;
  if (data.languages !== undefined) user.languages = data.languages;
  if (data.avatar) user.avatar = data.avatar;

  // Calculate profile completion score dynamically
  let score = 40;
  if (user.bio && user.bio.length > 50) score += 15;
  if (user.skillsToTeach.length > 0) score += 15;
  if (user.skillsToLearn.length > 0) score += 15;
  if (user.linkedin || user.github) score += 15;
  user.profileScore = Math.min(100, score);

  saveDB(db);
  res.json(user);
});

// ---------------------------------------------
// EXCHANGE REQUESTS ENDPOINTS
// ---------------------------------------------

app.get("/api/exchanges", (req, res) => {
  res.json(db.exchanges);
});

app.post("/api/exchanges", (req, res) => {
  const { senderId, receiverId, skillOffered, skillRequested, durationWeeks, message } = req.body;
  if (!senderId || !receiverId || !skillOffered || !skillRequested) {
    return res.status(400).json({ error: "Incomplete exchange details." });
  }

  const sender = db.users.find((u) => u.id === senderId);
  const receiver = db.users.find((u) => u.id === receiverId);

  if (!sender || !receiver) {
    return res.status(404).json({ error: "Sender or receiver student not found" });
  }

  const newExchange = {
    id: `exch-${Date.now()}`,
    senderId,
    senderName: sender.name,
    senderAvatar: sender.avatar,
    receiverId,
    receiverName: receiver.name,
    receiverAvatar: receiver.avatar,
    skillOffered,
    skillRequested,
    durationWeeks: durationWeeks || 4,
    message: message || `Hi ${receiver.name}! I would love to teach you ${skillOffered} in exchange for learning ${skillRequested}.`,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  db.exchanges.push(newExchange);

  // Send request notification to receiver
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: receiverId,
    title: "New Exchange Proposal!",
    description: `${sender.name} offered to teach you ${skillOffered} in exchange for ${skillRequested}.`,
    type: "request",
    isRead: false,
    createdAt: new Date().toISOString(),
    referenceId: newExchange.id
  });

  saveDB(db);
  res.status(201).json(newExchange);
});

app.put("/api/exchanges/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Accepted', 'Rejected', 'Cancelled', 'Completed'
  const exchange = db.exchanges.find((e) => e.id === id);

  if (!exchange) {
    return res.status(404).json({ error: "Exchange proposal not found" });
  }

  exchange.status = status;

  // Notify sender
  const isSender = status === "Cancelled";
  const targetUserId = isSender ? exchange.receiverId : exchange.senderId;
  const actionParty = isSender ? exchange.senderName : exchange.receiverName;

  let notifyTitle = "Exchange Request Update";
  let notifyDesc = `Your exchange proposal has been ${status.toLowerCase()} by ${actionParty}.`;

  if (status === "Accepted") {
    notifyTitle = "Proposal Accepted! 🎉";
    notifyDesc = `${actionParty} accepted your exchange! Start a chat and schedule your first session.`;

    // Initialize custom messages
    db.messages.push({
      id: `msg-${Date.now()}-1`,
      exchangeId: exchange.id,
      senderId: exchange.receiverId,
      text: `Hello ${exchange.senderName}! I have accepted your exchange request. Let's schedule a mutually convenient time to meet!`,
      timestamp: new Date().toISOString(),
      isRead: false
    });
  } else if (status === "Completed") {
    notifyTitle = "Exchange Completed! 🌟";
    notifyDesc = `Congratulations! Your exchange with ${actionParty} is marked completed. Leave a review!`;

    // Award badges to both users
    const assignAchievement = (uId: string, badgeId: string) => {
      const u = db.users.find((usr) => usr.id === uId);
      if (u && !u.achievements.includes(badgeId)) {
        u.achievements.push(badgeId);
        db.notifications.push({
          id: `notif-${Date.now()}-${uId}`,
          userId: uId,
          title: "New Badge Unlocked! 🏆",
          description: `You earned the '${badgeId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}' badge.`,
          type: "achievement",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    };

    assignAchievement(exchange.senderId, "first-exchange");
    assignAchievement(exchange.receiverId, "first-exchange");
    assignAchievement(exchange.senderId, "skill-master");
    assignAchievement(exchange.receiverId, "fast-learner");
  }

  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: targetUserId,
    title: notifyTitle,
    description: notifyDesc,
    type: status === "Accepted" ? "session" : "request",
    isRead: false,
    createdAt: new Date().toISOString(),
    referenceId: exchange.id
  });

  saveDB(db);
  res.json(exchange);
});

// ---------------------------------------------
// MESSAGES & CHAT ENDPOINTS
// ---------------------------------------------

app.get("/api/messages/:exchangeId", (req, res) => {
  const { exchangeId } = req.params;
  const msgs = db.messages.filter((m) => m.exchangeId === exchangeId);
  res.json(msgs);
});

app.post("/api/messages", (req, res) => {
  const { exchangeId, senderId, text, attachmentUrl, attachmentName, attachmentType } = req.body;
  if (!exchangeId || !senderId || !text) {
    return res.status(400).json({ error: "Missing message details" });
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    exchangeId,
    senderId,
    text,
    timestamp: new Date().toISOString(),
    isRead: false,
    attachmentUrl,
    attachmentName,
    attachmentType
  };

  db.messages.push(newMessage);

  // Send real-time typing imitation / response if exchanging with a mock user
  const exchange = db.exchanges.find((e) => e.id === exchangeId);
  if (exchange) {
    const isSenderOwner = exchange.senderId === senderId;
    const partnerId = isSenderOwner ? exchange.receiverId : exchange.senderId;
    
    // Notify recipient of new message
    db.notifications.push({
      id: `notif-chat-${Date.now()}`,
      userId: partnerId,
      title: `Message from ${isSenderOwner ? exchange.senderName : exchange.receiverName}`,
      description: text.length > 50 ? text.substring(0, 47) + "..." : text,
      type: "chat",
      isRead: false,
      createdAt: new Date().toISOString(),
      referenceId: exchange.id
    });

    // Mock replies from default users (User 1, 2, 3, 4) to make chat interactive!
    const partnerUser = db.users.find(u => u.id === partnerId);
    if (partnerUser && partnerId.startsWith("user-") && partnerId !== "user-admin") {
      setTimeout(() => {
        const responses = [
          "Awesome! That sounds like an ideal schedule.",
          "I can jump on a Zoom call tomorrow evening, does that work for you?",
          "Sure thing, let's set up a study schedule. I'll send a Google Meet invite.",
          "Perfect. Looking forward to our exchange! Let me know if you need any prep work before we start.",
          "That makes total sense. Talk to you soon!"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const autoReply = {
          id: `msg-${Date.now()}-reply`,
          exchangeId,
          senderId: partnerId,
          text: `[Auto-Reply] ${randomResponse}`,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        db.messages.push(autoReply);
        saveDB(db);
      }, 3500);
    }
  }

  saveDB(db);
  res.status(201).json(newMessage);
});

// Mark messages as read
app.put("/api/messages/:exchangeId/read", (req, res) => {
  const { exchangeId } = req.params;
  const { readerId } = req.body;

  db.messages.forEach((m) => {
    if (m.exchangeId === exchangeId && m.senderId !== readerId) {
      m.isRead = true;
    }
  });

  saveDB(db);
  res.json({ success: true });
});

// ---------------------------------------------
// SESSIONS ENDPOINTS
// ---------------------------------------------

app.get("/api/sessions", (req, res) => {
  res.json(db.sessions);
});

app.post("/api/sessions", (req, res) => {
  const { exchangeId, senderId, receiverId, skillName, date, time, durationHours, meetingPlatform } = req.body;
  if (!exchangeId || !senderId || !receiverId || !skillName || !date || !time) {
    return res.status(400).json({ error: "Missing required session parameters." });
  }

  const platforms = {
    "Google Meet": "https://meet.google.com/" + Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5),
    "Zoom": "https://zoom.us/j/" + Math.floor(Math.random() * 9000000000 + 1000000000),
    "Discord": "https://discord.gg/skillsphere-room"
  };

  const chosenPlatform = meetingPlatform || "Google Meet";
  const link = (platforms as any)[chosenPlatform] || "https://meet.google.com/ss-session";

  const newSession = {
    id: `sess-${Date.now()}`,
    exchangeId,
    senderId,
    receiverId,
    skillName,
    date,
    time,
    durationHours: Number(durationHours) || 1,
    status: "upcoming",
    meetingLink: link,
    meetingPlatform: chosenPlatform,
    reminderSent: false
  };

  db.sessions.push(newSession);

  // Notify receiver
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: receiverId,
    title: "Learning Session Scheduled! 🗓️",
    description: `A session for '${skillName}' has been booked for ${date} at ${time} via ${chosenPlatform}.`,
    type: "session",
    isRead: false,
    createdAt: new Date().toISOString(),
    referenceId: newSession.id
  });

  saveDB(db);
  res.status(201).json(newSession);
});

app.put("/api/sessions/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'completed' | 'cancelled'
  const session = db.sessions.find((s) => s.id === id);

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  session.status = status;

  if (status === "completed") {
    // Gamification Points & Badges Allocation
    const teacherId = session.senderId;
    const learnerId = session.receiverId;

    const teacher = db.users.find((u) => u.id === teacherId);
    const learner = db.users.find((u) => u.id === learnerId);

    if (teacher) {
      teacher.profileScore = (teacher.profileScore || 0) + 100;
      if (!teacher.achievements) teacher.achievements = [];
      if (!teacher.achievements.includes("gold-teacher")) {
        teacher.achievements.push("gold-teacher");
      }
      if (!teacher.achievements.includes("first-exchange")) {
        teacher.achievements.push("first-exchange");
      }
      syncUserPointsAndLevel(teacherId);
    }

    if (learner) {
      learner.profileScore = (learner.profileScore || 0) + 50;
      if (!learner.achievements) learner.achievements = [];
      if (!learner.achievements.includes("fast-learner")) {
        learner.achievements.push("fast-learner");
      }
      if (!learner.achievements.includes("first-exchange")) {
        learner.achievements.push("first-exchange");
      }
      syncUserPointsAndLevel(learnerId);
    }

    // Notify both to leave reviews if applicable
    const participants = [teacherId, learnerId];
    participants.forEach((pId) => {
      db.notifications.push({
        id: `notif-${Date.now()}-${pId}`,
        userId: pId,
        title: "Session Completed! 🎉 +XP Earned",
        description: `Excellent work completing '${session.skillName}'! ${pId === teacherId ? "You earned +100 XP for teaching!" : "You earned +50 XP for learning!"} Write a review for your partner now.`,
        type: "system",
        isRead: false,
        createdAt: new Date().toISOString()
      });
    });
  }

  saveDB(db);
  res.json(session);
});

// ---------------------------------------------
// REVIEWS ENDPOINTS
// ---------------------------------------------

app.get("/api/reviews", (req, res) => {
  res.json(db.reviews);
});

app.post("/api/reviews", (req, res) => {
  const { reviewerId, reviewerName, reviewerAvatar, exchangeId, rating, feedback } = req.body;
  if (!reviewerId || !exchangeId || !rating) {
    return res.status(400).json({ error: "Reviewer ID, exchange proposal reference, and rating stars are required." });
  }

  const exchange = db.exchanges.find((e) => e.id === exchangeId);
  if (!exchange) {
    return res.status(404).json({ error: "Exchange not found" });
  }

  const isReviewerSender = exchange.senderId === reviewerId;
  const ratedUserId = isReviewerSender ? exchange.receiverId : exchange.senderId;

  const newReview = {
    id: `rev-${Date.now()}`,
    reviewerId,
    reviewerName,
    reviewerAvatar: reviewerAvatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + reviewerName,
    exchangeId,
    rating: Number(rating),
    feedback: feedback || "Completed successful skill exchange session.",
    createdAt: new Date().toISOString()
  };

  db.reviews.push(newReview);
  
  // Recalculate partner ratings
  recalculateUserRating(ratedUserId);

  // Award gamified points & achievements based on rating
  const ratedUser = db.users.find((u) => u.id === ratedUserId);
  if (ratedUser) {
    let reviewPoints = 50;
    if (rating === 5) {
      reviewPoints = 150;
      if (!ratedUser.achievements) ratedUser.achievements = [];
      if (!ratedUser.achievements.includes("five-star-mentor")) {
        ratedUser.achievements.push("five-star-mentor");
      }
    } else if (rating === 4) {
      reviewPoints = 100;
    } else if (rating === 3) {
      reviewPoints = 75;
    }
    ratedUser.profileScore = (ratedUser.profileScore || 0) + reviewPoints;
    syncUserPointsAndLevel(ratedUserId);
  }

  // Notify rated user
  db.notifications.push({
    id: `notif-${Date.now()}`,
    userId: ratedUserId,
    title: "New Review Received! ⭐️",
    description: `${reviewerName} gave you a ${rating}-star review: "${newReview.feedback.slice(0, 30)}..." (+XP Awarded)`,
    type: "system",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  saveDB(db);
  res.status(201).json(newReview);
});

// ---------------------------------------------
// NOTIFICATIONS ENDPOINTS
// ---------------------------------------------

app.get("/api/notifications/:userId", (req, res) => {
  const { userId } = req.params;
  const filtered = db.notifications.filter((n) => n.userId === userId);
  res.json(filtered);
});

app.put("/api/notifications/:id/read", (req, res) => {
  const { id } = req.params;
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) {
    notif.isRead = true;
    saveDB(db);
    return res.json(notif);
  }
  res.status(404).json({ error: "Notification not found" });
});

app.post("/api/notifications/all-read", (req, res) => {
  const { userId } = req.body;
  db.notifications.forEach((n) => {
    if (n.userId === userId) n.isRead = true;
  });
  saveDB(db);
  res.json({ success: true });
});

// Admin global push notification
app.post("/api/admin/broadcast", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Missing title or description" });
  }

  db.users.forEach((u) => {
    if (u.role !== "admin") {
      db.notifications.push({
        id: `notif-${Date.now()}-${u.id}`,
        userId: u.id,
        title,
        description,
        type: "system",
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  });

  saveDB(db);
  res.json({ success: true, message: "Broadcast sent successfully to all active users." });
});

// ---------------------------------------------
// ADMIN OPERATIONS & REPORTS
// ---------------------------------------------

app.get("/api/admin/reports", (req, res) => {
  res.json(db.reports);
});

app.post("/api/reports", (req, res) => {
  const { reporterId, reporterName, reportedUserId, reportedUserName, reason } = req.body;
  if (!reporterId || !reportedUserId || !reason) {
    return res.status(400).json({ error: "Reporter, reported user, and violation details are required." });
  }

  const newReport = {
    id: `rep-${Date.now()}`,
    reporterId,
    reporterName,
    reportedUserId,
    reportedUserName,
    reason,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  db.reports.push(newReport);
  saveDB(db);
  res.status(201).json(newReport);
});

app.put("/api/admin/reports/:id/resolve", (req, res) => {
  const { id } = req.params;
  const report = db.reports.find((r) => r.id === id);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }

  report.status = "Resolved";
  saveDB(db);
  res.json(report);
});

app.post("/api/admin/users/:id/ban", (req, res) => {
  const { id } = req.params;
  const user = db.users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.isBanned = !user.isBanned;
  saveDB(db);
  res.json(user);
});

app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  db.users.splice(index, 1);
  saveDB(db);
  res.json({ success: true, deletedId: id });
});

// ---------------------------------------------
// GEMINI INTELLIGENT MATCHING & ROADMAPS
// ---------------------------------------------

app.post("/api/ai/match", async (req, res) => {
  const { skillsToTeach, skillsToLearn, targetSkill } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    // Return friendly local mock AI feedback if API Key is not set up yet
    return res.json({
      compatibilityScore: 88,
      compatibilityComments: "Based on local matching analysis, your skillset aligns perfectly with Stanford's peer group. You offer strong Web and Python competencies, which are currently highly sought after in UI/UX tracks.",
      roadmap: [
        { phase: "Phase 1: Basic Integration", detail: "Understand how UI layout structures map directly to functional React component trees. Dive into Figma spacing constants." },
        { phase: "Phase 2: Prototyping Interactions", detail: "Learn interactive components, state changes, and Framer Motion layout transition triggers." },
        { phase: "Phase 3: Realworld deployment", detail: "Build high fidelity responsive dashboards that adhere to Swiss modern minimalist design philosophies." }
      ],
      aiScore: 78,
      aiTips: [
        "Include links to live project portfolios or GitHub repositories to boost credibility.",
        "Add availability details like 'Saturday afternoons' to facilitate easier matching sessions.",
        "Add standard Certifications or badges to prove your programming background."
      ]
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // We will build a unified, clean query to gemini-3.5-flash requesting a structured JSON response
    const prompt = `
      You are SkillSphere AI, a premium intelligent matching bot for an online peer student skill exchange.
      Analyze this student's profile:
      - Skills they can teach: ${JSON.stringify(skillsToTeach || [])}
      - Skills they want to learn: ${JSON.stringify(skillsToLearn || [])}
      - Target skill of current interest: "${targetSkill || 'UI UX UI design/Figma'}"

      Respond with a JSON object containing:
      1. "compatibilityScore": an integer from 0 to 100 representing how compatible they are with the platform's trending skills.
      2. "compatibilityComments": a short (3-4 sentence) professional, friendly, and motivational startup-style paragraph outlining their platform compatibility, key synergies, and what value they bring.
      3. "roadmap": an array of 3 objects representing a custom learning path. Each object should have keys "phase" (string, e.g., "Phase 1: Basics") and "detail" (string, description of specific student action).
      4. "aiScore": an integer representing their current profile optimization level (0-100).
      5. "aiTips": an array of 3 short bullet point tips on how to improve their profile to get matching faster.

      Return ONLY the raw JSON object conforming exactly to this shape. Do not wrap it in markdown block tags other than valid json response.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini AI API Call failed:", error);
    res.status(500).json({ error: "AI matching service is currently spinning up. Please try again in a moment!" });
  }
});

app.post("/api/ai/match-students", async (req, res) => {
  const { user, partner } = req.body;

  if (!user || !partner) {
    return res.status(400).json({ error: "User and Partner profiles are required." });
  }

  if (!process.env.GEMINI_API_KEY) {
    // Return robust friendly local mock response if no API Key is set up yet
    return res.json({
      compatibilityScore: 94,
      analysis: `We found incredible skill exchange synergy between you and ${partner.name}! ${partner.name} offers expert knowledge in '${partner.skillsToTeach[0] || 'their skills'}', which maps directly to your wishlist to learn '${user.skillsToLearn[0] || 'your wishlist'}'. In return, you teach '${user.skillsToTeach[0] || 'your skills'}' which perfectly fits their list of desired subjects to master!`,
      suggestedRoadmap: [
        { phase: "Stage 1: Fundamental Grounding", detail: `Schedule a 1-hour session. ${partner.name} guides you through '${partner.skillsToTeach[0] || 'their skill'}' core principles, and you explain '${user.skillsToTeach[0] || 'your skill'}' syntax and setup.` },
        { phase: "Stage 2: Co-Working Exercise", detail: "Pick a small mock challenge (e.g. building a mini landing page or writing an automation script). Work on it on Discord, trading reviews live." },
        { phase: "Stage 3: Advanced Integration & Endorsements", detail: `Deploy the project together. Finalize with cross-endorsement review stars to boost both of your SkillSphere leaderboard standings!` }
      ],
      tips: [
        "Agree on a weekly study hour slot (e.g., Saturday afternoon) to maintain learning momentum.",
        "Use a shared notebook (Notion/Google Doc) to compile helpful links, tips, and code blocks.",
        "Award each other skill badges upon completing the milestones in your progress cabinet."
      ]
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `
      You are SkillSphere AI, a premium intelligent peer matchmaker for university students.
      Provide a personalized, motivational, and technical analysis for a skill exchange between:
      Student A: ${user.name}
      - Skills they can teach: ${JSON.stringify(user.skillsToTeach || [])}
      - Skills they want to learn: ${JSON.stringify(user.skillsToLearn || [])}
      - University/Dept: ${user.university} - ${user.department}

      Student B: ${partner.name}
      - Skills they can teach: ${JSON.stringify(partner.skillsToTeach || [])}
      - Skills they want to learn: ${JSON.stringify(partner.skillsToLearn || [])}
      - University/Dept: ${partner.university} - ${partner.department}

      Provide a JSON response containing:
      1. "compatibilityScore": integer (0 to 100) representing their compatibility.
      2. "analysis": a 3-4 sentence warm, motivating, specific paragraph describing their exact trade synergies (how B's teaching matches A's learning, and vice versa).
      3. "suggestedRoadmap": an array of 3 milestone stages. Each milestone must have keys "phase" (string, e.g., "Stage 1") and "detail" (string description of mutual action items).
      4. "tips": an array of 3 practical, high-value advice points on how to ensure a successful barter session.

      Return ONLY the raw JSON object conforming exactly to this shape. Do not wrap it in markdown block tags other than valid json response.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini student match API Call failed:", error);
    res.status(500).json({ error: "AI matching engine failed to synthesize profiles." });
  }
});

// ---------------------------------------------
// APP BOOT & STATIC FILE SERVING
// ---------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SkillSphere Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
