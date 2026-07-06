"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Derive page title from path or use a fallback
  const pageTitle = "Wen Admin Portal";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header 
          title={pageTitle} 
          onOpenSidebar={() => setSidebarOpen(true)} 
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#F7F2EA]/20 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
