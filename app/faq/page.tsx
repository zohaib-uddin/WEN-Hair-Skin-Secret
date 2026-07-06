"use client";

import React, { useState } from "react";
import Accordion from "../../components/ui/Accordion";
import { HelpCircle, Mail, Phone, Heart, Sparkles, Sprout } from "lucide-react";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "purity" | "hair" | "shipping">("all");

  const faqData = [
    {
      id: "faq-1",
      category: "purity",
      question: "What makes Wen Secrets formulations different from ordinary cosmetics?",
      answer: "Every single formulation in the Wen Secrets archives is un-boiled and cold-pressed natively under Clifton, Karachi sterile conditions. Ordinary manufacturers heat active elements up to 100°C which completely boils off vulnerable natural peptides and Ayurvedic trace elements. Our un-boiled process preserves cellular structures for double hair and skin cuticle repair rates, making it highly compatible with native hard groundwater."
    },
    {
      id: "faq-2",
      category: "purity",
      question: "Are your ingredients completely organic and vegan?",
      answer: "Yes, our extracts are 100% plant-based, cruelty-free, and vegan. We source raw Kashmiri saffron threads directly from certified Ayurvedic farms in Pamipor, clean Himalayan mineral water, and true aloe pulp concentrated by hand."
    },
    {
      id: "faq-3",
      category: "hair",
      question: "How does Pakistani hard ground water affect hair fall and how does Wen prevent it?",
      answer: "Pakistani groundwater (especially in municipal sectors of Karachi and Lahore) contains high concentrations of heavy calcium, magnesium, and salt ions. During warm showers, these minerals fuse directly into delicate hair cuticles creating a heavy crust scale that blocks bulb respiration and triggers bald hair breakage. Wen Shampoos and Hair Oils are formulated with complex natural plant-derived chelators that bind, dissolve, and rinse away this mineral salt buildup on first contact."
    },
    {
      id: "faq-4",
      category: "hair",
      question: "How often should I apply the Kashmiri Saffron Hair Serum?",
      answer: "For severe thinning along facial temple sectors, we suggest massaging 4-6 droplets onto dry sections of your clean scalp every night before bed. Massage in soft circular movements for 90 seconds. Brush gently using clean combs. Persistent daily use activates dormant follicles within 4 to 6 weeks."
    },
    {
      id: "faq-5",
      category: "shipping",
      question: "How long will my delivery take to reach Gilgit or Quetta?",
      answer: "All parcels route directly from our Clifton laboratory facility. For major metropolitan areas (Karachi, Lahore, twin Islamabad/Rawalpindi), transit takes 2-4 working days. For far territories like Gilgit-Baltistan, interior Sindh, or Balochistan (Quetta), please allow up to 4-6 business days for complete secure doorstep clearance via TCS or Leopards tracking."
    },
    {
      id: "faq-6",
      category: "shipping",
      question: "Can I pay via cash on delivery (COD) across Pakistan?",
      answer: "Certainly. We support complete door-step cash checking (COD) transitions across all major cities and towns in Pakistan with zero hidden transaction costs. Simply select Cash on Delivery at checkout, and have raw Pakistani rupee cash ready during courier handover."
    }
  ];

  // Filtering faqs based on selected tab
  const filteredFaqs = activeCategory === "all" 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24 font-sans text-left relative overflow-hidden" id="faq-main-frame">
      {/* Visual gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#1F4D3A]/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-24 left-0 w-80 h-80 bg-[#C9A227]/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page title panel */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-[#C9A227] text-xs font-bold tracking-[0.25em] uppercase block font-mono">
            Client assistance desk
          </span>
          <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#1F4D3A] tracking-wide">
            Frequently Asked Secrets
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
            All your questions regarding native hard-water scalp care, clinical botanical extraction processes, and nationwide Pakistani door-step routing answered.
          </p>
        </div>

        {/* Tab Filters section */}
        <div className="flex flex-wrap justify-center gap-2.5 pb-2 select-none border-b border-gray-100">
          {[
            { id: "all", label: "All Questions" },
            { id: "purity", label: "Purity & Ayurvedic Sourcing" },
            { id: "hair", label: "Hair Thinning Solutions" },
            { id: "shipping", label: "全國 Delivery & COD" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4.5 py-2.5 text-xs font-bold tracking-wider rounded-xl transition-all duration-300 cursor-pointer focus:outline-none ${
                activeCategory === tab.id 
                  ? "bg-[#1F4D3A] text-white shadow-md border border-[#1F4D3A]" 
                  : "bg-gray-50 text-gray-400 border border-transparent hover:bg-[#F7F2EA]/60 hover:text-[#1F4D3A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordions component mounted */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-10 shadow-xs animate-fade-in">
          {filteredFaqs.length > 0 ? (
            <Accordion items={filteredFaqs} allowMultiple={false} />
          ) : (
            <p className="text-gray-400 text-xs text-center">No questions found matching this filter.</p>
          )}
        </div>

        {/* Further Support Desk Coordinate banner */}
        <div className="bg-[#F7F2EA]/40 border border-[#E8E1D3]/50 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-playfair text-lg font-bold text-[#1F4D3A]">
              Still have botanical queries?
            </h4>
            <p className="text-xs text-gray-500 leading-normal max-w-sm">
              Our clinical care response desk is active. Get in touch directly via our support helplines details.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a 
              href="mailto:care@wenhairskin.com"
              className="flex-1 text-center py-3 px-5 border border-gray-250 bg-white hover:bg-gray-50 transition text-[#1F4D3A] font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Email Help
            </a>
            <a 
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center py-3 px-5 bg-[#1F4D3A] hover:bg-[#C9A227] hover:text-white transition text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
