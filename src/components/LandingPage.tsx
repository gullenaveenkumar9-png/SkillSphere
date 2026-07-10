import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Zap, 
  ArrowRight, 
  Users, 
  Globe, 
  Sparkles, 
  Shield, 
  CheckCircle, 
  MessageSquare, 
  Star, 
  BookOpen, 
  Check, 
  Clock, 
  ChevronDown,
  Award
} from "lucide-react";

interface LandingPageProps {
  onJoinNow: () => void;
  onExplore: () => void;
  theme: "light" | "dark";
}

export default function LandingPage({ onJoinNow, onExplore, theme }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "4,200+", label: "Active Students" },
    { value: "18,500+", label: "Hours Swapped" },
    { value: "120+", label: "Colleges Represented" },
    { value: "94%", label: "Satisfaction Rate" },
  ];

  const popularSkills = [
    { name: "Python AI Agents", category: "AI & ML", students: 142, icon: Sparkles, color: "from-blue-500 to-indigo-600" },
    { name: "Figma UI/UX Systems", category: "UI UX", students: 98, icon: Zap, color: "from-pink-500 to-rose-600" },
    { name: "React Performance", category: "Web Development", students: 121, icon: BookOpen, color: "from-cyan-500 to-blue-600" },
    { name: "Ethical Hacking", category: "Cyber Security", students: 64, icon: Shield, color: "from-emerald-500 to-teal-600" },
  ];

  const testimonials = [
    {
      quote: "SkillSphere transformed how I learn. I taught python scripting to a design student and she taught me Figma. We both built our senior thesis together!",
      author: "Alex Rivera",
      role: "CS Major, Stanford",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop"
    },
    {
      quote: "I saved thousands of dollars on programming tutors. The platform matches you with real students who are genuinely excited to exchange knowledge.",
      author: "Siddharth Mehta",
      role: "Mechanical Engineering, IIT Bombay",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      quote: "The scheduling and chat are so seamless. It doesn't feel like a chore; it feels like making friends who help you grow your portfolio.",
      author: "Elena Rostova",
      role: "Mathematics, MIT",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    }
  ];

  const faqs = [
    {
      q: "How does the skill exchange model actually work?",
      a: "It's built on a peer-to-peer barter system. You list skills you can teach (e.g., Python, Video Editing) and skills you want to learn (e.g., French, public speaking). SkillSphere finds other students who have the exact reverse matching interests, letting you swap lessons without spending a dollar."
    },
    {
      q: "Is it completely free?",
      a: "Yes! SkillSphere is 100% free for students. No hidden credits, subscriptions, or transactional fees. The only currency is your time and knowledge."
    },
    {
      q: "How are learning sessions conducted?",
      a: "Once an exchange request is accepted, you can chat with your partner and use our integrated scheduler. SkillSphere generates high-fidelity Google Meet or Zoom links directly inside the application workspace."
    },
    {
      q: "How do you guarantee quality or safety?",
      a: "We require valid university student credentials to sign up. Additionally, students review and rate each other after completed sessions, contributing to a public rating and unlocking prestigious Gamification Badges like 'Gold Teacher' and '5-Star Mentor'."
    }
  ];

  const features = [
    {
      title: "Smart AI Compatibility",
      desc: "Our server-side Gemini algorithm analyzes your unique skills to suggest highly compatible study matches instantly.",
      icon: Sparkles,
      color: "text-indigo-500 bg-indigo-50/10 border-indigo-500/20"
    },
    {
      title: "Collaborative Chat",
      desc: "Instantly coordinate lesson files, share high-contrast mockups, and talk seamlessly inside our premium glassmorphic chat room.",
      icon: MessageSquare,
      color: "text-purple-500 bg-purple-50/10 border-purple-500/20"
    },
    {
      title: "Learning Roadmaps",
      desc: "Receive customized, phased progress schedules powered by generative intelligence to keep your learning structured and accountable.",
      icon: BookOpen,
      color: "text-cyan-500 bg-cyan-50/10 border-cyan-500/20"
    },
    {
      title: "Earn Prestige Badges",
      desc: "Ascend the campus leaderboard! Unlock badges like 'Top Mentor' or 'Fast Learner' to showcase on your LinkedIn or portfolio.",
      icon: Award,
      color: "text-rose-500 bg-rose-50/10 border-rose-500/20"
    }
  ];

  const stepList = [
    { step: "01", title: "Create Your Profile", desc: "List what university you attend, what topics you can teach, and what you are eager to master." },
    { step: "02", title: "Smart Discover & Match", desc: "Browse high-fidelity student profiles or let SkillSphere AI suggest highly compatible trade requests." },
    { step: "03", title: "Schedule & Swap", desc: "Set dates on our integrated calendar, generate auto-Meet URLs, and swap real hours of mentorship." },
    { step: "04", title: "Level Up & Review", desc: "Earn verified badges, climb the campus leaderboard, and leave reviews to build your peer trust score." }
  ];

  return (
    <div className={`min-h-screen font-sans ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} transition-colors duration-300 overflow-hidden`}>
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[35rem] h-[35rem] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-400 mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Next-Gen Knowledge Barter for Students</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] mb-6"
        >
          Exchange <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Skills</span>, Not Money. Learn Anything.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`text-lg md:text-xl max-w-3xl mb-10 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
        >
          Connect with talented university peers. Teach what you are good at, learn what you need, and build premium portfolio-worthy projects entirely for free.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <button 
            id="join-now-hero-btn"
            onClick={onJoinNow}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            Join SkillSphere Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            id="explore-skills-hero-btn"
            onClick={onExplore}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold border ${theme === "dark" ? "border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"} backdrop-blur-md transition-all cursor-pointer`}
          >
            Explore Student Skills
          </button>
        </motion.div>

        {/* Floating Mockup Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`w-full max-w-5xl rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-slate-950/80 shadow-2xl shadow-indigo-500/10" : "border-slate-200 bg-white shadow-xl"} overflow-hidden backdrop-blur-md p-3.5 relative`}
        >
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <div className={`ml-4 text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"} font-mono`}>skillsphere.app/discover-students</div>
          </div>
          <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 text-left flex flex-col justify-between overflow-hidden border border-white/5">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-white text-xl font-bold font-sans">SkillSphere Matchmaker</h4>
                  <p className="text-slate-400 text-sm">Real-time compatible study pairs in Stanford University</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-full font-semibold">
                  8 Matches Found Today
                </span>
              </div>

              {/* Simulated Card Barter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-850/80 border border-white/5 flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop" className="w-12 h-12 rounded-full border border-slate-700 object-cover" alt="Student" />
                  <div>
                    <h5 className="text-white text-sm font-semibold">Alex Rivera</h5>
                    <p className="text-xs text-indigo-400 font-bold">Can Teach: Python, ML</p>
                    <p className="text-xs text-slate-400 mt-1">wants to learn UI/UX, Figma</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-500 text-[10px] text-white rounded-bl-lg font-bold font-sans">98% Match</div>
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" className="w-12 h-12 rounded-full border border-slate-700 object-cover" alt="Student" />
                  <div>
                    <h5 className="text-white text-sm font-semibold">Siddharth Mehta</h5>
                    <p className="text-xs text-pink-400 font-bold">Can Teach: UI UX, Figma</p>
                    <p className="text-xs text-slate-400 mt-1">wants to learn Python, React</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Interactive Exchange Enabled</span>
              <span className="font-mono text-slate-500">v1.4.0 Production Build</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Board */}
      <section className={`border-y ${theme === "dark" ? "border-white/5 bg-slate-950/40" : "border-slate-200 bg-white"} py-12 px-6`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((st, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                {st.value}
              </div>
              <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"} font-semibold`}>
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything You Need For Peer-to-Peer Success
          </h2>
          <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
            Our platform removes the financial barrier to master-class learning. Swap real-world intelligence with students globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((ft, i) => {
            const IconComponent = ft.icon;
            return (
              <div 
                key={i} 
                className={`p-6 rounded-[24px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white"} hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-6 ${ft.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{ft.title}</h3>
                <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {ft.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-24 px-6 ${theme === "dark" ? "bg-slate-900/10" : "bg-slate-100/60"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How SkillSphere Works
            </h2>
            <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
              A beautiful bartering workflow designed with modern academic timelines in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {stepList.map((st, i) => (
              <div key={i} className="relative group">
                <div className="text-5xl font-extrabold text-indigo-500/20 font-mono mb-4 group-hover:text-indigo-500/30 transition-colors">
                  {st.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{st.title}</h3>
                <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Popular Exchanged Skills</h2>
            <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>Top trending skills students are swapping right now.</p>
          </div>
          <button 
            id="see-all-skills-btn"
            onClick={onExplore}
            className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl font-semibold bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer text-sm"
          >
            See All Skills <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularSkills.map((sk, i) => {
            const IconComp = sk.icon;
            return (
              <div 
                key={i}
                className={`p-5 rounded-[24px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm" : "border-slate-200 bg-white"} hover:shadow-lg transition-all`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sk.color} flex items-center justify-center text-white`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-slate-100">{sk.name}</h3>
                    <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">{sk.category}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs text-slate-400">
                  <span>{sk.students} students list this</span>
                  <span className="text-indigo-400 font-semibold cursor-pointer hover:underline" onClick={onExplore}>Find Peers</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-24 px-6 ${theme === "dark" ? "bg-slate-950/50 border-t border-white/5" : "bg-slate-50 border-t border-slate-200"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Loved by Students Worldwide
            </h2>
            <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
              Read authentic feedback from high-achieving student matches on our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((ts, i) => (
              <div 
                key={i}
                className={`p-6 rounded-[24px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex gap-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-amber-500" />)}
                  </div>
                  <p className={`text-sm leading-relaxed italic mb-6 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                    "{ts.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <img src={ts.avatar} className="w-10 h-10 rounded-full border border-white/10 object-cover" alt={ts.author} />
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{ts.author}</h4>
                    <span className="text-xs text-indigo-400 font-semibold">{ts.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className={`rounded-xl border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/20" : "border-slate-200 bg-white"} overflow-hidden`}
              >
                <button
                  id={`faq-btn-${idx}`}
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold flex justify-between items-center hover:bg-indigo-500/[0.02] cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform ${isOpen ? "rotate-185" : ""}`} />
                </button>
                {isOpen && (
                  <div className={`p-5 pt-0 text-sm leading-relaxed ${theme === "dark" ? "text-slate-400 border-t border-white/5" : "text-slate-600 border-t border-slate-100"}`}>
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call To Action */}
      <section className="relative py-24 px-6 text-center max-w-6xl mx-auto">
        <div className={`p-8 md:p-16 rounded-[40px] border ${theme === "dark" ? "border-white/5 bg-gradient-to-b from-indigo-950/40 to-slate-950/90 shadow-2xl shadow-indigo-500/5 backdrop-blur-sm" : "border-slate-200 bg-gradient-to-b from-indigo-50 to-white shadow-lg"} overflow-hidden relative`}>
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Ready to Accelerate Your Learning?<br />
            No Tuition Fees Required.
          </h2>
          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-10 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            Connect with campus leaders, master hard technologies, and form collaborative senior projects today.
          </p>
          <button 
            id="join-now-cta-btn"
            onClick={onJoinNow}
            className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Create Your Free Account
          </button>
        </div>
      </section>
    </div>
  );
}
