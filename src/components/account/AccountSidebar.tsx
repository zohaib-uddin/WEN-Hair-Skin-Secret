import React from "react";
import { User, ShoppingBag, Heart, MapPin, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface AccountSidebarProps {
  userName: string;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onLogout: () => void;
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  userName,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "details", label: "Account Details", icon: ShieldCheck },
  ];

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "M";
  };

  return (
    <div className="bg-white border-2 border-[#e5e5e5] rounded-[16px] md:rounded-[20px] p-[16px] md:p-[24px] shadow-sm">
      {/* Profile Header */}
      <div className="flex items-center gap-[12px] md:gap-[16px] pb-[16px] md:pb-[24px] border-b border-[#e5e5e5] mb-[16px] md:mb-[24px]">
        <div className="w-[48px] md:w-[56px] h-[48px] md:h-[56px] bg-[#1F4D3A] text-white rounded-full flex items-center justify-center font-playfair font-bold text-[20px] md:text-[24px] border-2 border-[#C9A227] shrink-0">
          {getInitials(userName)}
        </div>
        <div>
          <h4 className="font-playfair text-[18px] md:text-[20px] font-bold text-[#1F4D3A] leading-tight">
            Hello, {userName.split(" ")[0] || "User"}
          </h4>
          <span className="text-[10px] md:text-[12px] font-sans font-bold text-[#C9A227] uppercase tracking-wider block mt-[2px] md:mt-0">
            WEN Member
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-[4px] md:space-y-[8px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-[12px] md:px-[16px] py-[12px] md:py-[14px] rounded-lg md:rounded-xl text-left text-[13px] md:text-[14px] font-sans font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-[#1F4D3A] text-white shadow-md"
                  : "bg-transparent text-[#6b6b6b] hover:bg-gray-50 hover:text-[#1a1a1a]"
              }`}
            >
              <div className="flex items-center gap-[10px] md:gap-[12px]">
                <Icon
                  className={`w-[16px] md:w-[18px] h-[16px] md:h-[18px] ${
                    isActive ? "text-[#C9A227]" : "text-[#6b6b6b]"
                  }`}
                />
                <span>{tab.label}</span>
              </div>
              {isActive && (
                <ChevronRight className="w-[14px] md:w-[16px] h-[14px] md:h-[16px] text-[#C9A227]" />
              )}
            </button>
          );
        })}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-[10px] md:gap-[12px] px-[12px] md:px-[16px] py-[12px] md:py-[14px] rounded-lg md:rounded-xl text-left text-[13px] md:text-[14px] font-sans font-medium text-rose-600 hover:bg-rose-50 transition-all cursor-pointer mt-[12px] md:mt-[16px]"
        >
          <LogOut className="w-[16px] md:w-[18px] h-[16px] md:h-[18px]" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};
