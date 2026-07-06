import React, { useState, useEffect } from "react";

export const BreakpointIndicator: React.FC = () => {
  const [width, setWidth] = useState<number>(() => {
    return typeof window !== "undefined" ? window.innerWidth : 0;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Only render in development mode
  const isDev = (import.meta as any).env?.DEV || process.env.NODE_ENV !== "production";
  if (!isDev) return null;

  const getBreakpoint = (w: number) => {
    if (w >= 1920) return { name: "4K / Ultra-Wide (3xl)", color: "bg-emerald-600 text-white" };
    if (w >= 1536) return { name: "Desktop Large (2xl)", color: "bg-[#1F4D3A] text-white" };
    if (w >= 1280) return { name: "Desktop Standard (xl)", color: "bg-[#1F4D3A] text-white" };
    if (w >= 1024) return { name: "Laptop/Desktop (lg)", color: "bg-[#C9A227] text-[#1F4D3A]" };
    if (w >= 768) return { name: "Tablet (md)", color: "bg-teal-650 text-white" };
    if (w >= 640) return { name: "Mobile Land / Sm (sm)", color: "bg-amber-600 text-white" };
    if (w >= 375) return { name: "Mobile Portrait (xs)", color: "bg-neutral-800 text-white" };
    return { name: "Mini Device (<xs)", color: "bg-red-800 text-white" };
  };

  const breakpoint = getBreakpoint(width);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 pointer-events-none select-none">
      <div className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase shadow-xl border border-white/15 backdrop-blur-md opacity-90 transition-all duration-300 ${breakpoint.color}`}>
        {breakpoint.name} • {width}px
      </div>
    </div>
  );
};

export default BreakpointIndicator;
