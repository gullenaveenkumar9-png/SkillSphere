import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";

interface ContactViewProps {
  theme: "light" | "dark";
}

export default function ContactView({ theme }: ContactViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const contacts = [
    {
      icon: Mail,
      label: "Institutional Support",
      value: "support@skillsphere.com",
      subText: "Expect a response within 12-24 hours.",
    },
    {
      icon: MapPin,
      label: "Campus Operations",
      value: "State Tech University, Block C",
      subText: "San Jose, CA 95112",
    },
    {
      icon: Clock,
      label: "Operational Hours",
      value: "Monday – Friday: 9 AM - 6 PM PST",
      subText: "Weekend support for active swaps.",
    },
  ];

  return (
    <motion.div
      id="skillsphere-contact-view"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-12 md:py-16"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          Reach Our Team
        </span>
        <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${
          theme === "dark" ? "text-slate-100" : "text-slate-800"
        }`}>
          We'd Love to <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Hear From You
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed">
          Need help setting up your profile, resolving an active barter conflict, or hosting a campus-wide skill swap? Drop us a line!
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Info Column */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <h3 className={`text-lg font-bold ${
            theme === "dark" ? "text-slate-100" : "text-slate-800"
          }`}>
            Contact Channels
          </h3>
          <div className="space-y-4">
            {contacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    theme === "dark" ? "border-white/5 bg-[#1E293B]/40" : "border-slate-200 bg-white"
                  } flex items-start gap-4`}
                >
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}>
                      {contact.label}
                    </h4>
                    <p className={`text-xs font-semibold mb-1 ${
                      theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                    }`}>
                      {contact.value}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {contact.subText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact Form Column */}
        <motion.div
          variants={itemVariants}
          className={`lg:col-span-2 p-6 md:p-8 rounded-3xl border relative overflow-hidden ${
            theme === "dark" ? "border-white/5 bg-[#1E293B]/20" : "border-slate-200 bg-white"
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
          
          <h3 className={`text-lg font-extrabold mb-1 ${
            theme === "dark" ? "text-slate-100" : "text-slate-800"
          }`}>
            Send a Workspace Message
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Fill out the request form below, and our administration team will review and reply directly to your student inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl text-center space-y-3"
            >
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="font-extrabold text-sm text-slate-200">
                Message Received Successfully!
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out to SkillSphere. A support ticket has been registered in our database, and a representative will reach out shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/25 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@university.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiry about corporate/campus deployment"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Detailed Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Briefly describe your request, bug report, or feature suggestion..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-xs focus:border-indigo-500 focus:outline-none text-slate-200 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? (
                  <>Processing Submission...</>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Deliver Workspace Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
