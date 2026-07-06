"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw,
  Search,
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { Skeleton } from "../../components/ui/Skeleton";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  replied: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all"); // 'all', 'unread', 'replied'

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages);
      } else {
        console.error("Failed to load customer messages:", data?.error);
      }
    } catch (e) {
      console.error("Error fetching messages:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (messageId: string, currentReadStatus: boolean) => {
    // Optimistic Update
    const originalMessages = [...messages];
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, is_read: !currentReadStatus } : m));

    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: messageId, is_read: !currentReadStatus })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update read state");
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
      setMessages(originalMessages); // Rollback
    }
  };

  const handleToggleReplied = async (messageId: string, currentRepliedStatus: boolean) => {
    // Optimistic Update
    const originalMessages = [...messages];
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, replied: !currentRepliedStatus } : m));

    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: messageId, replied: !currentRepliedStatus })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update reply status");
      }
    } catch (e: any) {
      alert(`Error: ${e.message}`);
      setMessages(originalMessages); // Rollback
    }
  };

  // Helper to format WhatsApp URL (converts Pakistani 03XXXXXXXXX to 923XXXXXXXXX format)
  const formatWhatsAppUrl = (phoneStr: string, textMsg: string) => {
    let cleanNumber = phoneStr.replace(/[^0-9]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "92" + cleanNumber.substring(1);
    } else if (!cleanNumber.startsWith("92") && cleanNumber.length === 10) {
      cleanNumber = "92" + cleanNumber;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMsg)}`;
  };

  const filteredMessages = messages.filter(m => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(query) || 
      m.email.toLowerCase().includes(query) || 
      (m.subject || "").toLowerCase().includes(query) || 
      m.message.toLowerCase().includes(query) || 
      (m.phone || "").includes(query);

    const matchesFilter = 
      filterType === "all" ||
      (filterType === "unread" && !m.is_read) ||
      (filterType === "replied" && m.replied);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FCFBEE]/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header section with brand accent */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200/60">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900 tracking-tight">Customer Enquiries</h1>
            <p className="text-sm font-sans text-gray-500 mt-1">Review feedback, support questions, and clinical consultations.</p>
          </div>
          <button 
            onClick={fetchMessages}
            className="mt-4 md:mt-0 px-4 py-2 border border-gray-300 rounded-xl hover:bg-white text-gray-650 font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Inbox
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center gap-4 justify-between shadow-xs">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            <input 
              type="text" 
              placeholder="Search by name, email, query keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition ${
                filterType === "all" 
                  ? "bg-[#1F4D3A] text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              All Inquiries
            </button>
            <button 
              onClick={() => setFilterType("unread")}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition flex items-center gap-1.5 ${
                filterType === "unread" 
                  ? "bg-amber-500 text-white" 
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              Unread
            </button>
            <button 
              onClick={() => setFilterType("replied")}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold transition ${
                filterType === "replied" 
                  ? "bg-emerald-700 text-white" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Replied
            </button>
          </div>
        </div>

        {/* Main Inbox cards list */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-150/60 p-20 text-center shadow-xs">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-playfair font-bold text-gray-900">Inbox is Clear</h3>
            <p className="text-sm font-sans text-gray-500 mt-1">No customer enquiries match your current scope filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`group bg-white rounded-2xl border transition-all p-6 md:p-8 relative ${
                  !msg.is_read 
                    ? "border-amber-300 bg-amber-50/10 shadow-md"
                    : "border-gray-100 hover:shadow-md"
                }`}
              >
                {/* Visual Blue / Amber Unread marker */}
                {!msg.is_read && (
                  <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 rounded-l-2xl animate-pulse"></span>
                )}

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className={`text-md font-sans font-bold text-gray-900 ${!msg.is_read ? "font-extrabold" : ""}`}>
                        {msg.name}
                      </h3>
                      {!msg.is_read && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full font-mono uppercase tracking-widest">
                          New
                        </span>
                      )}
                      {msg.replied && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full font-mono uppercase tracking-widest">
                          Replied
                        </span>
                      )}
                    </div>

                    {/* Metadata indicators */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-sans">
                      <span className="flex items-center gap-1 text-gray-650">
                        <Mail className="w-3.5 h-3.5" /> {msg.email}
                      </span>
                      {msg.phone && (
                        <span className="flex items-center gap-1 text-gray-650">
                          <Phone className="w-3.5 h-3.5" /> {msg.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Body Content details */}
                <div className="bg-gray-50/70 border border-gray-100 p-4 rounded-xl mb-6">
                  {msg.subject && (
                    <p className="text-sm font-bold text-[#1F4D3A] font-sans mb-1.5 uppercase tracking-wide">
                      Subject: {msg.subject}
                    </p>
                  )}
                  <p className="text-sm text-gray-800 font-sans leading-relaxed whitespace-pre-line">
                    "{msg.message}"
                  </p>
                </div>

                {/* Operations bar actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100/70">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleRead(msg.id, msg.is_read)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1 transition ${
                        msg.is_read 
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-500" 
                          : "bg-amber-100 hover:bg-amber-200 text-amber-900"
                      }`}
                    >
                      {msg.is_read ? <CheckCheck className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      {msg.is_read ? "Mark Unread" : "Mark as Read"}
                    </button>

                    <button 
                      onClick={() => handleToggleReplied(msg.id, msg.replied)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1 transition ${
                        msg.replied 
                          ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-900" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                      }`}
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      {msg.replied ? "Marked Unreplied" : "Mark as Replied"}
                    </button>
                  </div>

                  {msg.phone && (
                    <a 
                      href={formatWhatsAppUrl(msg.phone, `Assalam-o-Alaikum ${msg.name}, thank you for contacting Wen Hair & Skin Secret regarding: "${msg.subject || 'your enquiry'}".`)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Reply on WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
