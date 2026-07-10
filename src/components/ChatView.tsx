import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Image, 
  Check, 
  CheckCheck, 
  AlertCircle,
  Clock,
  ArrowLeft,
  BookOpen,
  User,
  ShieldAlert,
  Download,
  Info
} from "lucide-react";
import { Message, ExchangeRequest, User as UserType } from "../types";

interface ChatViewProps {
  exchange: ExchangeRequest;
  user: UserType;
  messages: Message[];
  onSendMessage: (text: string, attachment?: { url: string; name: string; type: "image" | "pdf" | "link" }) => void;
  onBack: () => void;
  theme: "light" | "dark";
}

export default function ChatView({
  exchange,
  user,
  messages,
  onSendMessage,
  onBack,
  theme
}: ChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSender = exchange.senderId === user.id;
  const partnerName = isSender ? exchange.receiverName : exchange.senderName;
  const partnerAvatar = isSender ? exchange.receiverAvatar : exchange.senderAvatar;

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Simulate typing indicator when partner replies
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderId === user.id) {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages, user.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText.trim());
    setInputText("");
    setShowEmojis(false);
    setShowAttachments(false);
  };

  const handleQuickAttachment = (type: "image" | "pdf") => {
    if (type === "image") {
      onSendMessage("Shared wireframe layout screens:", {
        url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400",
        name: "figma_concept_wireframe.png",
        type: "image"
      });
    } else {
      onSendMessage("Shared the introductory syllabus:", {
        url: "#",
        name: "python_intro_syllabus.pdf",
        type: "pdf"
      });
    }
    setShowAttachments(false);
  };

  const emojis = ["👋", "👍", "💡", "🙌", "🔥", "🎯", "💻", "🎨", "📚", "🚀"];

  return (
    <div className={`max-w-4xl mx-auto px-4 py-4 h-[calc(100vh-12rem)] min-h-[500px] flex flex-col rounded-[32px] border ${theme === "dark" ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl" : "border-slate-200 bg-white shadow-sm"} overflow-hidden`}>
      
      {/* Header bar */}
      <div className={`flex justify-between items-center pb-4 border-b shrink-0 ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
        <div className="flex items-center gap-3">
          <button 
            id="chat-back-btn"
            onClick={onBack}
            className={`p-2 rounded-xl transition-all cursor-pointer ${theme === "dark" ? "hover:bg-white/5 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-600"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <img src={partnerAvatar} className="w-10 h-10 rounded-full border border-white/10 object-cover" alt={partnerName} />
          
          <div>
            <h3 className="font-extrabold text-sm leading-tight text-slate-100">{partnerName}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-semibold font-mono">Active Study Peer</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 max-w-xs">
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Swapping {exchange.skillOffered} for {exchange.skillRequested}</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Safety Tip */}
        <div className={`p-4 rounded-2xl flex gap-3 max-w-2xl mx-auto border ${
          theme === "dark" ? "bg-indigo-500/5 border-indigo-500/10" : "bg-indigo-50/50 border-indigo-100"
        }`}>
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-normal">
            <strong>SkillSphere Trust Tip:</strong> Keep lesson communication and scheduling on-platform to earn certified merit Badges and protect your barter credibility score.
          </p>
        </div>

        {/* Dynamic bubbles */}
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div 
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] rounded-[20px] p-4 shadow-sm space-y-2 ${
                isMe 
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none" 
                  : theme === "dark" 
                    ? "bg-slate-950/60 border border-white/5 text-slate-200 rounded-bl-none"
                    : "bg-slate-100 text-slate-850 rounded-bl-none"
              }`}>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Attachments UI */}
                {msg.attachmentUrl && (
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    isMe ? "bg-indigo-900/40 border-indigo-500/20 text-white" : "bg-slate-900 border-white/5 text-slate-200"
                  }`}>
                    <div className="flex items-center gap-2 truncate">
                      {msg.attachmentType === "image" ? <Image className="w-4 h-4 text-pink-400" /> : <Paperclip className="w-4 h-4 text-cyan-400" />}
                      <span className="font-mono text-[11px] truncate block">{msg.attachmentName}</span>
                    </div>
                    {msg.attachmentType === "image" ? (
                      <img src={msg.attachmentUrl} className="w-16 h-12 rounded-lg object-cover border border-white/10" alt="preview" />
                    ) : (
                      <button className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-slate-300 transition-all cursor-pointer"><Download className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && (
                    msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-indigo-400" /> : <Check className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-[20px] rounded-bl-none ${theme === "dark" ? "bg-[#1E293B]/60 border border-white/5" : "bg-slate-100"} flex items-center gap-1.5`}>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-300" />
              <span className="text-[10px] text-slate-500 ml-1 font-medium font-mono">{partnerName} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer toolbar */}
      <div className={`p-3 border-t flex flex-col gap-2 shrink-0 ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
        
        {/* Quick select accessories */}
        <div className="flex gap-2">
          {showEmojis && (
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950/80 rounded-xl border border-white/5 backdrop-blur-md">
              {emojis.map((em) => (
                <button
                  key={em}
                  onClick={() => setInputText((prev) => prev + em)}
                  className="p-1 text-sm hover:scale-125 hover:rotate-12 transition-transform cursor-pointer"
                >
                  {em}
                </button>
              ))}
            </div>
          )}

          {showAttachments && (
            <div className="flex gap-2 p-1.5 bg-slate-950/80 rounded-xl border border-white/5 text-[10px] font-bold backdrop-blur-md">
              <button 
                onClick={() => handleQuickAttachment("image")}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 flex items-center gap-1 cursor-pointer transition-all"
              >
                <Image className="w-3.5 h-3.5" /> Wireframe PNG
              </button>
              <button 
                onClick={() => handleQuickAttachment("pdf")}
                className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 flex items-center gap-1 cursor-pointer transition-all"
              >
                <Paperclip className="w-3.5 h-3.5" /> Syllabus PDF
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-3">
          <div className="flex-1 relative flex items-center bg-slate-950/60 rounded-xl border border-white/5 focus-within:border-indigo-500 transition-all">
            <button
              id="chat-toggle-emojis"
              type="button"
              onClick={() => {
                setShowEmojis(!showEmojis);
                setShowAttachments(false);
              }}
              className="p-2.5 text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5 rounded-lg"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <button
              id="chat-toggle-attachments"
              type="button"
              onClick={() => {
                setShowAttachments(!showAttachments);
                setShowEmojis(false);
              }}
              className="p-2.5 text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-white/5 rounded-lg"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input 
              className="flex-1 py-3 text-xs bg-transparent focus:outline-none text-slate-100 placeholder:text-slate-500 pr-4" 
              placeholder={`Write a message to ${partnerName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <button
            id="chat-send-btn"
            type="submit"
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-all flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
