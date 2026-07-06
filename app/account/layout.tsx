"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Menu
} from "lucide-react";
import { useShop } from "../../src/context/ShopContext";
import { motion, AnimatePresence } from "motion/react";

interface SidebarLink {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { navigate } = useShop();

  const handleLogout = () => {
    // Navigate using the custom Shop Context state first & fallback to router
    navigate("sign-in");
    router.push("/sign-in");
  };

  const navLinks: SidebarLink[] = [
    { name: "Dashboard", path: "/account", icon: User },
    { name: "My Orders", path: "/account/orders", icon: ShoppingBag },
    { name: "Wishlist", path: "/account/wishlist", icon: Heart },
    { name: "Addresses", path: "/account/addresses", icon: MapPin },
    { name: "Account Details", path: "/account/details", icon: ShieldCheck },
  ];

  return (
    <div className="bg-[#F7F2EA]/40 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" id="wen-membership-layout">
      <div className="max-w-7xl mx-auto">
        
        {/* Upper Sanctum Header Banner */}
        <div className="mb-10 text-left">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A227] uppercase font-bold block mb-2">
            Membership Sanctum
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-playfair text-4xl font-extrabold text-[#1F4D3A] tracking-wider uppercase">
                YOUR ELIXIR SUITE
              </h1>
              <p className="text-xs text-gray-400 font-light mt-1">
                Manage your organic apothecary deliveries, secret formulations, and clinical profile details.
              </p>
            </div>
          </div>
        </div>

        {/* Outer 2-Column Desktop Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation Column */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Desktop Navigation Box */}
            <div className="hidden lg:block bg-white border border-[#E8E1D3] rounded-2xl p-4 shadow-xs text-left">
              {/* Profile Avatar Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4 px-2">
                <div className="w-10 h-10 bg-[#1F4D3A] text-white rounded-full flex items-center justify-center font-playfair font-extrabold text-sm border-2 border-[#C9A227] select-none shadow-xs">
                  S
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1F4D3A] font-sans truncate max-w-[130px]" id="auth-sidebar-username-lbl">
                    Sarah Ahmed Malik
                  </h4>
                  <span className="text-[9px] text-[#C9A227] font-bold tracking-widest uppercase block mt-0.5">
                    Gold Circle Member
                  </span>
                </div>
              </div>

              {/* Sidebar Links list */}
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  // If matching exact path or nested under path (for orders)
                  const isActive = pathname === link.path || (link.path === "/account/orders" && pathname?.startsWith("/account/orders"));
                  
                  return (
                    <button
                      key={link.path}
                      onClick={() => router.push(link.path)}
                      id={`account-nav-${link.name.toLowerCase().replace(" ", "-")}`}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[11px] uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-[#F7F2EA] text-[#1F4D3A] border-l-3 border-[#C9A227] font-semibold"
                          : "text-gray-500 hover:text-[#1F4D3A] hover:bg-gray-50/50 border-l-3 border-transparent"
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-[#C9A227]" : "text-gray-400"}`} />
                      <span>{link.name}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[11px] uppercase font-bold tracking-wider text-rose-600 hover:bg-rose-50/50 transition-colors cursor-pointer mt-4"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Log Out Securely</span>
                </button>
              </div>
            </div>

            {/* Mobile Horizontal scrollable navigation */}
            <div className="lg:hidden w-full overflow-x-auto no-scrollbar bg-white border border-[#E8E1D3] rounded-xl p-2.5 flex items-center gap-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = pathname === link.path || (link.path === "/account/orders" && pathname?.startsWith("/account/orders"));

                return (
                  <button
                    key={link.path}
                    onClick={() => router.push(link.path)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-left text-[10px] uppercase font-bold tracking-wider transition-colors whitespace-nowrap cursor-pointer flex-shrink-0 ${
                      isActive
                        ? "bg-[#1F4D3A] text-white"
                        : "text-gray-500 hover:text-[#1F4D3A] hover:bg-gray-55"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-rose-600 text-[10px] uppercase font-bold tracking-wider hover:bg-rose-50 flex-shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>

            {/* Guarantee / Certification Badge */}
            <div className="hidden lg:flex bg-[#1F4D3A] border border-[#16382a] rounded-2xl p-6 text-[#F7F2EA] flex-col items-center text-center space-y-3 shadow-md relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#C9A227]/10 rounded-full" />
              <Sparkles className="w-6 h-6 text-[#C9A227] animate-pulse" />
              <div className="space-y-1">
                <h5 className="font-playfair text-xs font-bold tracking-widest uppercase text-white">7-Day Guarantee</h5>
                <p className="text-[10px] text-gray-300 font-light max-w-[170px] leading-relaxed mx-auto">
                  Every custom batch arrives fresh. We issue refunds or swaps instantly for local water triggers.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column Content Box container with animation */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#E8E1D3] rounded-3xl p-6 sm:p-8 min-h-[500px] shadow-xs relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
