"use client";

import React from "react";
import * as Lucide from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  changeText: string;
  isPositive?: boolean;
  iconName: "DollarSign" | "ShoppingBag" | "Users" | "AlertTriangle";
}

export default function StatCard({ 
  title, 
  value, 
  changeText, 
  isPositive = true, 
  iconName 
}: StatCardProps) {
  // Map icon names safely
  const IconComponent = () => {
    switch (iconName) {
      case "DollarSign":
        return <Lucide.DollarSign className="w-6 h-6 text-emerald-600" />;
      case "ShoppingBag":
        return <Lucide.ShoppingBag className="w-6 h-6 text-blue-600" />;
      case "Users":
        return <Lucide.Users className="w-6 h-6 text-amber-600" />;
      case "AlertTriangle":
        return <Lucide.AlertTriangle className="w-6 h-6 text-red-650" />;
      default:
        return <Lucide.Activity className="w-6 h-6" />;
    }
  };

  const getIconBg = () => {
    switch (iconName) {
      case "DollarSign":
        return "bg-emerald-50";
      case "ShoppingBag":
        return "bg-blue-50";
      case "Users":
        return "bg-amber-50";
      case "AlertTriangle":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1 text-left">
          <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase font-sans">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-950 font-sans tracking-tight leading-none pt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl flex items-center justify-center ${getIconBg()}`}>
          <IconComponent />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-1 text-xs text-left">
        <span 
          className={`font-semibold ${
            iconName === "AlertTriangle" 
              ? "text-red-650" 
              : isPositive 
                ? "text-emerald-600" 
                : "text-gray-400"
          }`}
        >
          {changeText}
        </span>
      </div>
    </div>
  );
}
