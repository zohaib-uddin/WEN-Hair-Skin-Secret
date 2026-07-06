"use client";

import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#FFFFFF] z-[9999] flex flex-col items-center justify-center font-sans">
      <div className="relative flex flex-col items-center space-y-4">
        {/* Pulsing luxurious logotype ring */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex items-center justify-center w-24 h-24 rounded-full border border-[#F7F2EA] bg-[#FAFAF9] shadow-sm relative"
        >
          <span className="font-playfair text-3xl font-bold tracking-widest text-[#1F4D3A]">
            WEN
          </span>
          <Sparkles className="absolute top-2 right-2 w-4 h-4 text-[#C9A227] animate-pulse" />
        </motion.div>

        {/* Shimmering label */}
        <div className="flex flex-col items-center space-y-1.5">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-[#C9A227] uppercase leading-none">
            Apothecary Secret
          </span>
          <span className="text-xs text-[#78716C] font-light font-sans">
            Clarifying Bio-Formulas...
          </span>
        </div>
      </div>
    </div>
  );
}
