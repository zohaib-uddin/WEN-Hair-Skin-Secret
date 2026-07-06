"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "../../../src/context/ShopContext";
import { UserPlus, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "../../../src/lib/supabase/client";

export default function NextSignUpPage() {
  const router = useRouter();
  const { navigate } = useShop();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/account`
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save registration mock data
    localStorage.setItem(
      "wen_active_user",
      JSON.stringify({
        fullName: fullName || "Sarah Ahmed Malik",
        email: email || "sarah.malik@outlook.com",
        phone: phone || "03008432120",
        city: "Lahore"
      })
    );
    navigate("account");
    router.push("/account");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F7F2EA] pt-[88px]" id="next-signup-page-root">
      
      {/* Left Column: Split-screen brand visual backdrop */}
      <div className="hidden lg:flex flex-col items-center justify-center relative min-h-[calc(100vh-88px)] p-12 bg-white">
        <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1200&auto=format&fit=crop"
            alt="Hair care beauty representation"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Dark Green (#1F4D3A) overlay 30% */}
          <div className="absolute inset-0 bg-[#1F4D3A]/30 flex flex-col justify-between p-12 text-[#F7F2EA] text-left">
            <div>
              <span className="font-playfair text-3xl font-extrabold tracking-widest text-white">W E N</span>
              <span className="font-sans text-[9px] font-bold text-[#C9A227] tracking-[0.25em] uppercase block -mt-1">
                HAIR & SKIN SECRET
              </span>
            </div>

            <div className="space-y-4 max-w-lg">
              <span className="inline-flex items-center gap-1.5 bg-[#C9A227]/20 border border-[#C9A227]/20 text-[#C9A227] text-[10px] font-mono font-bold uppercase py-1 px-4 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Pure Clinical Ayurveda
              </span>
              <h1 className="font-playfair text-5xl font-extrabold text-white leading-tight">
                Welcome to Wen.
              </h1>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="font-light text-sm text-[#1F4D3A] leading-relaxed max-w-md mx-auto">
            Unlock organic skincare diagnostics, limited-batch extraction journals, and join Pakistan's gold-standard hair restructural secrets circles.
          </p>
          <div className="text-[10px] text-gray-400 font-light font-sans tracking-wide mt-4">
            © 2026 Wen Secrets. Modern Luxury Crafted for Pakistan.
          </div>
        </div>
      </div>

      {/* Right Column: Sign Up Form container */}
      <div className="flex flex-col justify-start items-center p-6 pt-12 sm:p-12 sm:pt-20 lg:p-20 bg-white min-h-screen">
        <div className="max-w-md w-full text-left space-y-8">
          
          {/* Logo at the top center for Mobile layout */}
          <div className="lg:hidden flex flex-col items-center text-center">
            <span className="font-playfair text-3xl font-extrabold tracking-widest text-[#1F4D3A]">W E N</span>
            <span className="font-sans text-[8px] font-bold text-[#C9A227] tracking-[0.2em] uppercase block -mt-1">
              HAIR & SKIN SECRET
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-playfair text-3xl font-semibold text-[#1F4D3A] tracking-wider mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-400 font-light text-xs font-sans mb-8">
              Welcome! Please enter your details below.
            </p>
          </div>

          {/* Social Continue with Google */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-3.5 border border-gray-200 hover:border-[#C9A227] rounded-xl font-sans font-bold text-xs uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" width="24" height="24">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M21.35,11.1H12v2.7h5.38C16.88,15.22,14.77,16.5,12,16.5c-3.03,0-5.6-2.08-6.51-4.89-.26-.79-.41-1.63-.41-2.51s.15-1.72,.41-2.51c.91-2.81,3.48-4.89,6.51-4.89,2.1,0,3.93,.81,5.32,2.15l2-2C17.06,1.85,14.7,1,12,1,7.24,1,3.21,4.1,1.55,8.4c-.46,1.18-.72,2.45-.72,3.77s.26,2.59,.72,3.77c1.66,4.3,5.69,7.4,10.45,7.4,6.2,0,10.3-4.14,10.3-10.3,0-.68-.07-1.35-.22-1.94Z" fill="#C9A227" />
              </g>
            </svg>
            Continue with Google
          </button>

          {/* Separator */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-150"></div>
            <span className="flex-shrink mx-4 text-[9px] font-mono text-gray-300 font-bold uppercase tracking-widest select-none">
              Or Initiate Suite
            </span>
            <div className="flex-grow border-t border-gray-150"></div>
          </div>

          {/* Signup core form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Minimalist Input: Border bottom only as requested */}
            <div className="relative group border-b border-gray-200 focus-within:border-[#C9A227] pb-1 transition-colors">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Ahmed Malik"
                className="w-full bg-transparent text-xs font-light text-[#1F4D3A] outline-none py-1 placeholder-gray-300"
                required
              />
            </div>

            <div className="relative group border-b border-gray-200 focus-within:border-[#C9A227] pb-1 transition-colors">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Luxury Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah.malik@outlook.com"
                className="w-full bg-transparent text-xs font-light text-[#1F4D3A] outline-none py-1 placeholder-gray-300"
                required
              />
            </div>

            <div className="relative group border-b border-gray-200 focus-within:border-[#C9A227] pb-1 transition-colors">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Contact Phone (WhatsApp Target)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03008432120"
                className="w-full bg-transparent text-xs font-light text-[#1F4D3A] outline-none py-1 placeholder-gray-300 font-mono"
                required
              />
            </div>

            <div className="relative group border-b border-gray-200 focus-within:border-[#C9A227] pb-1 transition-colors">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Private Pass Key Formulation
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-xs font-light text-[#1F4D3A] outline-none py-1 placeholder-gray-300"
                required
              />
            </div>

            {/* Submit Block: py-4, bg-Dark Green, hover: bg-Gold */}
            <button
              type="submit"
              className="w-full py-4 bg-[#1F4D3A] hover:bg-[#C9A227] text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-350 shadow-md hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer group"
            >
              <UserPlus className="w-4 h-4 text-[#C9A227]" />
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </form>

          {/* Navigation link back to login */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400 font-light font-sans">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/sign-in")}
                className="text-[#C9A227] hover:text-[#1F4D3A] hover:underline font-bold uppercase tracking-wider text-[11px] ml-1 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
