"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Layout, 
  Package, 
  ShoppingBag, 
  Tags, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut,
  X 
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Layout },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 w-[260px] bg-[#1F4D3A] text-white flex flex-col z-50 h-screen transition-transform duration-300 border-r border-white/5 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link href="/admin" className="font-playfair text-2xl font-bold tracking-wider text-white">
            Wen Admin
          </Link>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 select-none">
          {navigation.map((item) => {
            const Icon = item.icon;
            // Handle active checks for subpaths (e.g. /admin/products/new matches /admin/products)
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all group duration-200 border-l-[3px] ${
                  isActive
                    ? "bg-white/10 text-[#C9A227] border-[#C9A227]"
                    : "text-gray-300 border-transparent hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon 
                  className={`w-4.5 h-4.5 transition-colors duration-200 ${
                    isActive ? "text-[#C9A227]" : "text-gray-400 group-hover:text-white"
                  }`} 
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 hover:border-white/40 text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Store Front</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
