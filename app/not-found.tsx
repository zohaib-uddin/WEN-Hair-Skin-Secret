"use client";

import React from "react";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-[#1F4D3A] flex flex-col items-center justify-center font-sans p-6 text-center">
      <div className="max-w-md w-full border border-[#F7F2EA] rounded-3xl bg-stone-50/50 p-8 sm:p-12 space-y-6 mx-auto shadow-sm">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#F7F2EA] flex items-center justify-center text-[#C9A227]">
            <Sparkles className="w-8 h-8 fill-[#C9A227]/10" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[#C9A227] text-[10px] font-bold tracking-[0.25em] uppercase block leading-none">
            ERROR 404
          </span>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight text-[#1F4D3A]">
            Secret Code Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] font-light leading-relaxed">
            The page or secret formula details you're looking for cannot be located in our Kashmiri archive library.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="/#/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#1F4D3A] text-white hover:bg-[#C9A227] hover:text-[#1F4D3A] py-3.5 px-8 rounded-xl text-xs uppercase font-bold tracking-widest transition-all decoration-none shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Explore Formulations
          </a>
        </div>
      </div>
    </div>
  );
}
