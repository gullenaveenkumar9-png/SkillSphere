export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  university: string;
  department: string;
  year: string; // "1st Year", "2nd Year", "3rd Year", "4th Year", "Masters", "PhD"
  location: string;
  bio: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skillsToTeach: string[]; // references to Skill IDs or plain string array (we'll use plain string array for simple robust editing)
  skillsToLearn: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  availability: 'Weekday Evenings' | 'Weekends' | 'Flexible' | 'Limited';
  languages: string[];
  rating: number;
  ratingCount: number;
  reviews: Review[];
  achievements: string[]; // Achievement IDs
  isBanned?: boolean;
  profileScore?: number;
  points?: number;
  level?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  studentId: string; // who teaches it
  studentName: string;
  studentAvatar?: string;
  description: string;
  isApproved: boolean;
  favoritesCount: number;
}

export type SkillCategory =
  | 'Programming'
  | 'Web Development'
  | 'AI'
  | 'Machine Learning'
  | 'Data Science'
  | 'Cyber Security'
  | 'Cloud'
  | 'DevOps'
  | 'UI UX'
  | 'Graphic Design'
  | 'Video Editing'
  | 'Photography'
  | 'Public Speaking'
  | 'Languages'
  | 'Mathematics'
  | 'Electronics'
  | 'Business'
  | 'Finance'
  | 'Marketing'
  | 'Music'
  | 'Sports'
  | 'Cooking'
  | 'Others';

export interface ExchangeRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  skillOffered: string;
  skillRequested: string;
  durationWeeks: number;
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Completed';
  createdAt: string;
  schedule?: SessionSchedule;
}

export interface SessionSchedule {
  date: string;
  time: string;
  durationMinutes: number;
  platform: 'Google Meet' | 'Zoom' | 'In Person' | 'Discord';
  link?: string;
}

export interface Message {
  id: string;
  exchangeId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'pdf' | 'link';
}

export interface Session {
  id: string;
  exchangeId: string;
  senderId: string;
  receiverId: string;
  skillName: string;
  date: string;
  time: string;
  durationHours: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink: string;
  meetingPlatform: 'Google Meet' | 'Zoom' | 'Discord';
  reminderSent: boolean;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  exchangeId: string;
  rating: number; // 1-5
  feedback: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'request' | 'chat' | 'session' | 'achievement' | 'system';
  isRead: boolean;
  createdAt: string;
  referenceId?: string; // exchangeId, sessionId etc
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string; // e.g. "award", "zap", "star"
  criteria: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  university: string;
  hoursTaught: number;
  hoursLearned: number;
  exchangesCompleted: number;
  rating: number;
  skillsCount: number;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  status: 'Pending' | 'Resolved';
  createdAt: string;
}
