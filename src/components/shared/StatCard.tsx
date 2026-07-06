import React from "react";
import * as LucideIcons from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof LucideIcons;
  colorTheme?: "green" | "dark-green" | "blue" | "red" | "gold";
  percentageChange?: string;
  isPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  iconName,
  colorTheme = "dark-green",
  percentageChange,
  isPositive = true,
}) => {
  const Icon = LucideIcons[iconName] as any;

  // Modern luxury color schemes selection
  const themes = {
    green: {
      bg: "bg-emerald-50/50 border-emerald-100",
      iconContainer: "bg-emerald-500/10 text-emerald-600",
      valueColor: "text-emerald-700 font-extrabold",
    },
    "dark-green": {
      bg: "bg-[#1F4D3A]/5 border-[#1F4D3A]/10",
      iconContainer: "bg-[#1F4D3A]/10 text-[#1F4D3A]",
      valueColor: "text-[#1F4D3A] font-extrabold",
    },
    blue: {
      bg: "bg-sky-50/50 border-sky-100",
      iconContainer: "bg-sky-500/10 text-sky-600",
      valueColor: "text-sky-700 font-extrabold",
    },
    red: {
      bg: "bg-rose-50/50 border-rose-100",
      iconContainer: "bg-rose-500/10 text-rose-600",
      valueColor: "text-rose-700 font-extrabold",
    },
    gold: {
      bg: "bg-[#C9A227]/5 border-[#C9A227]/15",
      iconContainer: "bg-[#C9A227]/10 text-[#C9A227]",
      valueColor: "text-[#1F4D3A] font-extrabold",
    },
  };

  const selectedTheme = themes[colorTheme] || themes["dark-green"];

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`p-6 bg-white border border-[#E8E1D3] rounded-2xl shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full ${selectedTheme.bg}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#757575] font-sans">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${selectedTheme.iconContainer}`}>
          {Icon ? <Icon className="w-5 h-5 stroke-[1.5]" /> : null}
        </div>
      </div>

      <div className="mt-5 space-y-1">
        <h3
          className={`text-2xl sm:text-3xl tracking-tight leading-none ${selectedTheme.valueColor}`}
        >
          {value}
        </h3>
        {percentageChange && (
          <div className="flex items-center gap-1.5 pt-1.5">
            <span
              className={`text-[10px] font-mono font-bold uppercase ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
            >
              {isPositive ? "↑ " : "↓ "}
              {percentageChange}
            </span>
            <span className="text-[9px] text-[#757575] font-light font-sans">
              vs previous month
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
