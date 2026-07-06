"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { PageTransition } from "../components/ui/PageTransition";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1F4D3A] flex flex-col items-center justify-center font-sans p-6 text-center">
      <PageTransition>
        <div className="max-w-md w-full border border-[#F7F2EA] rounded-3xl bg-stone-50/50 p-8 sm:p-12 space-y-6 mx-auto shadow-sm">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 scale-105">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[#C9A227] text-[10px] font-bold tracking-[0.25em] uppercase block leading-none">
              DIAGNOSTIC BLOCK
            </span>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight text-[#1F4D3A]">
              Oops! Something went wrong
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] font-light leading-relaxed">
              We encountered a minor disturbance in the database. Don't worry, your formulation selections are completely safe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1F4D3A] text-white hover:bg-[#C9A227] hover:text-[#1F4D3A] py-3.5 px-6 rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer border-none shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
            <a
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1F4D3A] hover:bg-[#F7F2EA] border border-gray-200 py-3.5 px-6 rounded-xl text-xs uppercase font-bold tracking-wider transition-all decoration-none shadow-xs"
            >
              <Home className="w-3.5 h-3.5 text-[#C9A227]" />
              Back to Home
            </a>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
