"use client";

import React from "react";
import { Award, Leaf, Sprout, Heart, ShieldCheck, Sparkles, Check, Flame, Droplets, Compass } from "lucide-react";
import { useShop } from "../../src/context/ShopContext";

export default function AboutPage() {
  const { navigate } = useShop();

  const ingredients = [
    {
      name: "Kashmiri Saffron",
      benefit: "Cellular Glow & Anti-Aging",
      desc: "Hand-harvested in Pamipor, Kashmiri Saffron is packed with high-potency crocin and saffronal compounds that repair hyperpigmentation, clear dullness, and activate sleeping roots.",
      icon: "✨"
    },
    {
      name: "Organic Argan Oil",
      benefit: "Deep Shaft Hydration",
      desc: "Rich in active vitamin E and essential Omega-3 fatty acids, this cold-pressed oil deeply coats hair stems to protect them from Pakistan's salty hard water and dry sun rays.",
      icon: "💧"
    },
    {
      name: "Active Biotin",
      benefit: "Follicular Tensile Strength",
      desc: "A pure B-complex compound that structurally fuses into hair scales to halt rapid breakage under shower drains, strengthening the hair stem density extensively.",
      icon: "🛡️"
    },
    {
      name: "Rosemary Extracted Serum",
      benefit: "Bulb Vascular Activation",
      desc: "Voted highly in trials for waking sleepy hair bulbs. Speeds up scalp blood flow natively to stimulate organic baby hair development along facial lines.",
      icon: "🌱"
    },
    {
      name: "True Aloe Vera Concentrate",
      benefit: "Pore Clearing Clarifier",
      desc: "Pure cooling botanical flesh containing salicylic compounds that wash out accumulated synthetic wax layer, dry flakes, and heavy summer sweat residues.",
      icon: "🍃"
    },
    {
      name: "Pure Vitamin E",
      benefit: "UV Radical Guardian",
      desc: "A key biological barrier antioxidant that prevents oxidative damage caused by severe Pakistani dry summer heat and strong ultraviolet exposures.",
      icon: "☀️"
    }
  ];

  const highlights = [
    {
      icon: <Leaf className="w-5 h-5 text-[#C9A227]" />,
      title: "100% Vegan & Cold-Pressed",
      desc: "We never heat our plant extracts. Keeping them un-boiled preserves active biological structures for double cellular repair rates."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C9A227]" />,
      title: "Hard Water Resilient",
      desc: "Formulated specifically with organic chelators that isolate heavy salt ions in local groundwater, preventing mineral scale buildup on your cuticles."
    },
    {
      icon: <Award className="w-5 h-5 text-[#C9A227]" />,
      title: "Clinical Potency Trials",
      desc: "Tested by private cosmetic panels under heavy Pakistani summer and dry winter months to optimize cellular strength outcomes."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-left overflow-hidden" id="about-brand-root">
      
      {/* Editorial Hero Banner (height 55vh) with dark overlay */}
      <div 
        className="w-full h-[55vh] relative flex items-center justify-center bg-cover bg-center text-center px-4"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1500&auto=format&fit=crop")`
        }}
      >
        <div className="absolute inset-0 bg-[#0E1B15]/60 z-10" />
        <div className="relative z-20 max-w-4xl space-y-4">
          <span className="text-[#C9A227] text-xs font-semibold uppercase tracking-[0.3em] block">SINCE 2026 &bull; PAKISTAN</span>
          <h1 className="font-playfair text-4xl sm:text-6xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
            Our Brand Story
          </h1>
          <p className="text-sm sm:text-base text-gray-200 font-light max-w-xl mx-auto leading-relaxed drop-shadow-md">
            Using pure natural ingredients to create luxury skincare and hair care products perfect for the Pakistani climate.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        
        {/* Section 1: The Beginning (Split Screen Narrative) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-[#1F4D3A]/5 text-[#1F4D3A] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
              <Compass className="w-3.5 h-3.5 text-[#C9A227]" /> The Beginning
            </span>
            <h2 className="font-playfair text-3xl sm:text-4.5xl font-bold text-[#1F4D3A] leading-tight tracking-wide">
              The Spark Behind the Secret
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              For decades, mainstream cosmetic shelves across Karachi, Lahore, and Islamabad have been flooded with aggressive chemicals designed for soft-water European climates. When brought home, these formulas caused severe follicle dryness and skin irritation when combined with our local salty hard tap waters or high UV sweltering suns.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              We asked: Why can't we adapt pure clinical science into standard Ayurvedic routines that actively repair cell layers natively?
            </p>
            <blockquote className="border-l-4 border-[#C9A227] pl-5 italic text-sm text-[#1F4D3A] font-medium py-1">
              "We took matters into our own hands. Crafting our products from raw natural ingredients and double-steam filtering Pamipor saffron threads."
            </blockquote>
          </div>

          <div>
            <div className="relative rounded-3xl overflow-hidden border border-[#E8E1D3] shadow-lg aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop"
                alt="Laboratory cold-pressed distillation"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Alternating segment (The Mission) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-2 space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-[#1F4D3A]/5 text-[#1F4D3A] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> Our Mission
            </span>
            <h2 className="font-playfair text-3xl sm:text-4.5xl font-bold text-[#1F4D3A] leading-tight tracking-wide">
              True Indigenous Care
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
              Every product in the Wen catalog is made specially for our local environment. We use natural Himalayan salts and minerals to help protect against hard-water damage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="text-left">
                <span className="text-2xl font-bold font-serif text-[#C9A227] block">98%</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Natural Actives</span>
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold font-serif text-[#C9A227] block">12+</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Lab Trials</span>
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold font-serif text-[#C9A227] block">10k+</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Active Patrons</span>
              </div>
            </div>
          </div>

          <div className="lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-[#E8E1D3] shadow-lg aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop"
                alt="Ayurvedic raw botanical roots blending"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Highlighting ingredient index */}
        <div className="space-y-10 pt-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest block font-mono">
              Therapeutic active list
            </span>
            <h2 className="font-playfair text-3xl sm:text-4.5xl font-bold text-[#1F4D3A]">
              Natural Beauty Extracts
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-light">
              We isolate only the highest potency cells to guarantee real cellular restoration in Pakistan's environmental conditions.
            </p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 pt-4 pb-4">
            {ingredients.map((ing, i) => (
              <div 
                key={i} 
                className="w-[85vw] shrink-0 snap-center md:w-auto p-6.5 bg-[#F7F2EA]/30 border border-[#E8E1D3]/40 rounded-3xl space-y-3 hover:translate-y-[-4px] transition duration-300"
              >
                <div className="text-2xl w-12 h-12 rounded-2xl bg-white border border-[#E8E1D3]/50 flex items-center justify-center shadow-xs">
                  {ing.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-playfair text-lg font-bold text-[#1F4D3A]">
                    {ing.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[#C9A227] tracking-wider block font-mono">
                    {ing.benefit}
                  </span>
                  <p className="text-xs text-gray-500 font-light leading-relaxed pt-1.5">
                    {ing.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight trust cards */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 md:grid md:grid-cols-3 pt-10 border-t border-gray-100 pb-4">
          {highlights.map((hl, i) => (
            <div key={i} className="w-[75vw] shrink-0 snap-center md:w-auto text-left space-y-2.5 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center">
                {hl.icon}
              </div>
              <h4 className="text-sm font-bold text-[#1F4D3A] uppercase tracking-wider font-mono">
                {hl.title}
              </h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                {hl.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
