import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Check, 
  X, 
  Inbox, 
  Send, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  FileText
} from "lucide-react";
import { ExchangeRequest, User } from "../types";

interface ExchangeViewProps {
  exchanges: ExchangeRequest[];
  user: User;
  onUpdateStatus: (id: string, status: "Accepted" | "Rejected" | "Cancelled" | "Completed") => void;
  onOpenChat: (exchange: ExchangeRequest) => void;
  onOpenScheduler: (exchange: ExchangeRequest) => void;
  theme: "light" | "dark";
}

export default function ExchangeView({
  exchanges,
  user,
  onUpdateStatus,
  onOpenChat,
  onOpenScheduler,
  theme
}: ExchangeViewProps) {
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");

  const incomingRequests = exchanges.filter((e) => e.receiverId === user.id);
  const outgoingRequests = exchanges.filter((e) => e.senderId === user.id);

  const displayList = activeTab === "incoming" ? incomingRequests : outgoingRequests;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Accepted":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Cancelled":
        return "bg-slate-800 text-slate-400 border-slate-700/60";
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700/60";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Inbox className="text-indigo-400 w-7 h-7" /> Exchange Requests & Workspaces
        </h2>
        <p className={`text-xs mt-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
          Manage pending proposals and enter workspace chats/sessions for accepted swaps.
        </p>
      </div>

      {/* Tabs */}
      <div className={`flex border-b gap-4 ${theme === "dark" ? "border-white/5" : "border-slate-100"}`}>
        <button
          id="exchange-incoming-tab-btn"
          onClick={() => setActiveTab("incoming")}
          className={`pb-3 text-sm font-extrabold flex items-center gap-2 relative transition-all cursor-pointer ${
            activeTab === "incoming" ? "text-indigo-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Inbox className="w-4 h-4" /> Incoming Proposals
          {incomingRequests.filter((e) => e.status === "Pending").length > 0 && (
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          )}
          {activeTab === "incoming" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>

        <button
          id="exchange-outgoing-tab-btn"
          onClick={() => setActiveTab("outgoing")}
          className={`pb-3 text-sm font-extrabold flex items-center gap-2 relative transition-all cursor-pointer ${
            activeTab === "outgoing" ? "text-indigo-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Send className="w-4 h-4" /> Sent Trade Proposals
          {activeTab === "outgoing" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>
      </div>

      {/* List content */}
      {displayList.length === 0 ? (
        <div className={`text-center py-16 border border-dashed rounded-[32px] ${
          theme === "dark" ? "border-white/10 bg-[#1E293B]/20" : "border-slate-300 bg-slate-50"
        }`}>
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            No {activeTab} exchange proposals to display.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Browse the discovery catalog to pitch or find custom study trades.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayList.map((exch) => {
            const isIncoming = activeTab === "incoming";
            const partnerName = isIncoming ? exch.senderName : exch.receiverName;
            const partnerAvatar = isIncoming ? exch.senderAvatar : exch.receiverAvatar;

            return (
              <div 
                key={exch.id}
                className={`p-6 rounded-[32px] border transition-all duration-300 flex flex-col space-y-4 ${
                  theme === "dark" 
                    ? "border-white/5 bg-[#1E293B]/40 backdrop-blur-sm shadow-xl hover:bg-[#1E293B]/50" 
                    : "border-slate-200 bg-white shadow-sm"
                }`}
              >
                {/* Header info */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
                  theme === "dark" ? "border-white/5" : "border-slate-100"
                }`}>
                  <div className="flex items-center gap-3">
                    <img src={partnerAvatar} className="w-11 h-11 rounded-full border border-white/10 object-cover" alt={partnerName} />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-100">{partnerName}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold font-mono">
                        Sent on {new Date(exch.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(exch.status)}`}>
                      {exch.status}
                    </span>
                  </div>
                </div>

                {/* Swap Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className={`p-3 border rounded-2xl ${
                    theme === "dark" ? "bg-[#1E293B]/20 border-white/5" : "bg-slate-50 border-slate-100"
                  }`}>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-0.5">Offered Skill</span>
                    <span className="text-xs font-bold text-indigo-400">{exch.skillOffered}</span>
                  </div>
                  <div className={`p-3 border rounded-2xl ${
                    theme === "dark" ? "bg-[#1E293B]/20 border-white/5" : "bg-slate-50 border-slate-100"
                  }`}>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-0.5">Requested Skill</span>
                    <span className="text-xs font-bold text-purple-400">{exch.skillRequested}</span>
                  </div>
                  <div className={`p-3 border rounded-2xl ${
                    theme === "dark" ? "bg-[#1E293B]/20 border-white/5" : "bg-slate-50 border-slate-100"
                  }`}>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block mb-0.5">Timeline Duration</span>
                    <span className="text-xs font-bold text-slate-200">{exch.durationWeeks} Weeks Sprint</span>
                  </div>
                </div>

                {/* Message body */}
                <div className={`p-4 rounded-2xl text-xs text-slate-300 leading-relaxed italic border ${
                  theme === "dark" ? "bg-slate-950/40 border-white/5" : "bg-slate-50 border-slate-100"
                }`}>
                  "{exch.message}"
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-2.5">
                    {/* Inbox actions */}
                    {isIncoming && exch.status === "Pending" && (
                      <>
                        <button
                          id={`accept-exch-${exch.id}`}
                          onClick={() => onUpdateStatus(exch.id, "Accepted")}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <Check className="w-4 h-4" /> Accept Swap
                        </button>
                        <button
                          id={`reject-exch-${exch.id}`}
                          onClick={() => onUpdateStatus(exch.id, "Rejected")}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <X className="w-4 h-4" /> Decline
                        </button>
                      </>
                    )}

                    {/* Outgoing actions */}
                    {!isIncoming && exch.status === "Pending" && (
                      <button
                        id={`cancel-exch-${exch.id}`}
                        onClick={() => onUpdateStatus(exch.id, "Cancelled")}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        Cancel Proposal
                      </button>
                    )}

                    {/* Active Swap Workspaces */}
                    {exch.status === "Accepted" && (
                      <>
                        <button
                          id={`chat-exch-${exch.id}`}
                          onClick={() => onOpenChat(exch)}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <MessageSquare className="w-4 h-4" /> Open Chat Room
                        </button>
                        <button
                          id={`schedule-exch-${exch.id}`}
                          onClick={() => onOpenScheduler(exch)}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
                        >
                          <Calendar className="w-4 h-4" /> Book Session
                        </button>
                        <button
                          id={`complete-exch-${exch.id}`}
                          onClick={() => onUpdateStatus(exch.id, "Completed")}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Complete Exchange
                        </button>
                      </>
                    )}

                    {exch.status === "Completed" && (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                        <ShieldCheck className="w-4 h-4 animate-pulse" /> Exchange Closed Successfully
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
