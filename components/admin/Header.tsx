"use client";

import React, { useState } from "react";
import { Search, Bell, Menu, User, LogOut, Settings } from "lucide-react";

interface HeaderProps {
  title: string;
  onOpenSidebar?: () => void;
}

export default function Header({ title, onOpenSidebar }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 h-20 px-6 sm:px-8 flex items-center justify-between z-30">
      {/* Off-canvas menu trigger (mobile only) + Title */}
      <div className="flex items-center gap-4">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
            aria-label="Toggle side navigation"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h1 className="font-playfair text-xl sm:text-2xl font-bold text-[#1F4D3A] tracking-wide truncate max-w-[200px] sm:max-w-xs md:max-w-md">
          {title}
        </h1>
      </div>

      {/* Utilities Column */}
      <div className="flex items-center gap-4">
        {/* Search tool */}
        <div className="relative">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          {searchOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-55">
              <input 
                type="text" 
                placeholder="Search orders, SKU, queries..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C9A227]"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Notifications Icon with Badge indicator */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 hover:bg-gray-100 rounded-xl transition text-left cursor-pointer"
          >
            <div className="w-9 h-9 bg-[#1F4D3A] rounded-lg text-[#F7F2EA] flex items-center justify-center font-bold font-sans text-sm">
              AD
            </div>
            <div className="hidden md:block select-none">
              <p className="text-xs font-semibold text-gray-800 leading-tight">Admin Director</p>
              <p className="text-[10px] text-gray-400">admin@wenhairskin.com</p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div 
                onClick={() => setProfileOpen(false)}
                className="fixed inset-0 z-40 bg-transparent"
              />
              <div className="absolute right-0 mt-2.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-850">Zara Ahmed</p>
                  <p className="text-gray-400 text-[10px] truncate">Owner & Chemist</p>
                </div>
                <button 
                  onClick={() => { alert("Navigating to settings..."); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-650 hover:bg-gray-50 hover:text-gray-900 transition text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Admin Profile</span>
                </button>
                <button 
                  onClick={() => { window.location.href = "/sign-out"; }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
