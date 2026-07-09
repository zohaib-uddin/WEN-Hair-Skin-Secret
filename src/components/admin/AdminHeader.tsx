import React, { useState, useEffect } from "react";
import { Search, Bell, Menu, User, Settings, LogOut, Check } from "lucide-react";
import { useShop } from "../../context/ShopContext";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title: string;
  onNotificationClick?: (notif: any) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  title,
  onNotificationClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifList, setNotifList] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { navigate, profile, user } = useShop();

  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications", {
        headers: {
          "x-clerk-id": user?.id || ""
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.notifications) {
          setNotifList(data.notifications);
        }
      }

      const countRes = await fetch("/api/admin/notifications/unread-count", {
        headers: {
          "x-clerk-id": user?.id || ""
        }
      });
      if (countRes.ok) {
        const countData = await countRes.json();
        if (countData.success) {
          setUnreadCount(countData.count);
        }
      }
    } catch (err) {
      console.warn("Could not fetch admin notification states dynamically:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  useEffect(() => {
    if (showNotifications && user?.id) {
      loadNotifications();
    }
  }, [showNotifications, user?.id]);

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch("/api/admin/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-id": user?.id || ""
        },
        body: JSON.stringify({ all: true })
      });
      if (response.ok) {
        setNotifList(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      const response = await fetch("/api/admin/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-clerk-id": user?.id || ""
        },
        body: JSON.stringify({ id })
      });
      if (response.ok) {
        setNotifList(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const adminName = profile?.full_name || user?.fullName || "Zara Ahmed";
  const initials = adminName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "ZA";

  const getNotificationTime = (createdAtString: string) => {
    try {
      const diffMs = Date.now() - new Date(createdAtString).getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHrs = Math.floor(diffMins / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return `${Math.floor(diffHrs / 24)}d ago`;
    } catch {
      return "some time ago";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8E1D3] h-20 px-6 sm:px-8 flex items-center justify-between">
      {/* Left side column: Title, menu triggers, search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 text-[#1F4D3A] focus:outline-none hover:bg-[#f5f5f5] rounded-xl lg:hidden cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3 max-w-xs w-full relative">
          <Search className="w-4.5 h-4.5 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dashboard insights..."
            className="w-full bg-[#f5f5f5] border border-[#e5e5e5] focus:border-[#C9A227] rounded-xl pl-10 pr-4 py-2.5 text-xs font-light outline-none transition-all"
          />
        </div>

        <span className="text-gray-300 hidden sm:inline-block">|</span>
        <h2 className="font-playfair text-xl font-bold text-[#1F4D3A] tracking-wider uppercase lg:block hidden">
          {title}
        </h2>
      </div>

      {/* Right side controls: notifications, avatar */}
      <div className="flex items-center gap-4">
        {/* Navigation tracker indicator for demo */}
        <span className="hidden md:inline-flex items-center gap-1 bg-[#1F4D3A]/5 text-[#1F4D3A] text-[9.5px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#1F4D3A]/10">
          ● Real-Time Data
        </span>

        {/* Notifications list trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-[#757575] hover:text-[#1F4D3A] hover:bg-[#f5f5f5] rounded-xl transition-all border border-[#e5e5e5] relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C9A227] rounded-full animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#C9A227] text-white flex items-center justify-center rounded-full text-[7px] font-extrabold" />
              </>
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-3.5 w-[340px] bg-white border border-[#E8E1D3] rounded-2xl shadow-xl p-5 z-50 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5]">
                  <h4 className="font-sans font-bold text-xs text-[#1F4D3A] uppercase tracking-wider">
                    Recent Alerts {unreadCount > 0 && `(${unreadCount})`}
                  </h4>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-[#C9A227] hover:underline font-semibold uppercase cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="py-2.5 space-y-3 max-h-[300px] overflow-y-auto">
                  {notifList.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#757575] italic">No notifications received.</div>
                  ) : (
                    notifList.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => {
                          if (!notif.is_read) handleMarkOneRead(notif.id);
                          if (onNotificationClick) {
                            onNotificationClick(notif);
                            setShowNotifications(false);
                          }
                        }}
                        className={`text-xs leading-relaxed p-2 rounded-xl transition cursor-pointer flex items-start gap-2 ${
                          notif.is_read ? "text-[#757575] hover:bg-[#f5f5f5]" : "bg-[#1F4D3A]/5 border-l-2 border-[#C9A227] text-[#2C2C2C] hover:bg-[#1F4D3A]/10 font-medium"
                        }`}
                      >
                        <div className="flex-1 space-y-0.5">
                          <p className="font-sans leading-snug">{notif.message || notif.title}</p>
                          <span className="text-[9px] text-[#757575] font-mono font-semibold block">
                            {getNotificationTime(notif.created_at)}
                          </span>
                        </div>
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 bg-[#C9A227] rounded-full self-center flex-shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Administrator profile badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#e5e5e5]">
          <div className="w-9 h-9 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center font-sans font-extrabold text-xs border-2 border-[#C9A227] shadow-sm select-none">
            {initials}
          </div>
          <div className="text-left hidden lg:block leading-none">
            <h4 className="text-xs font-bold font-sans text-[#2C2C2C]">{adminName}</h4>
            <span className="text-[9px] text-[#C9A227] font-mono tracking-wider uppercase font-semibold">Chief Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
