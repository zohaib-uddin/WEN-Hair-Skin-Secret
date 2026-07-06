"use client";

import React, { useEffect, useState } from "react";
import { useShop } from "../../src/context/ShopContext";
import { CheckCircle2, Truck, Copy, ClipboardCheck, ArrowRight, Home, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function OrderSuccessPage() {
  const { lastOrderId, checkoutDetails, navigate } = useShop();
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    if (lastOrderId) {
      navigator.clipboard.writeText(lastOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nameValue = checkoutDetails?.fullName || "Valued Client";
  const emailValue = checkoutDetails?.email || "your email inbox";

  const nextSteps = [
    {
      id: 1,
      title: "Formulation Synthesis",
      desc: "Our dermatologists and herbalists distill your Kashmiri saffron formulas custom-fresh under laboratory conditions."
    },
    {
      id: 2,
      title: "Logistic Transit & Routing",
      desc: "You will receive an automated SMS with tracking codes once the package leaves our facilities."
    },
    {
      id: 3,
      title: "Doorstep Clearance",
      desc: "Our delivery agents will contact you to ensure presence before carrying out Cash on Delivery handover."
    }
  ];

  return (
    <div className="bg-[#F7F2EA] min-h-screen py-[120px] font-sans">
      <div className="max-w-[1000px] mx-auto px-[24px]">
        <div className="bg-white border-2 border-[#e5e5e5] rounded-[32px] overflow-hidden flex flex-col md:flex-row">
          {/* Left panel - Success Message */}
          <div className="flex-1 p-[40px] md:p-[60px] flex flex-col justify-center items-center text-center relative overflow-hidden bg-[#1F4D3A]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative z-10 w-[80px] h-[80px] bg-[#C9A227] rounded-full flex items-center justify-center shadow-2xl mb-[32px]"
            >
              <CheckCircle2 className="w-[40px] h-[40px] text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 text-white"
            >
              <span className="text-[#C9A227] text-[10px] font-bold tracking-[0.3em] uppercase block mb-[16px]">
                Order Confirmed
              </span>
              <h1 className="font-playfair text-[32px] md:text-[40px] font-bold tracking-wide mb-[16px]">
                Thank You, {nameValue.split(" ")[0]}
              </h1>
              <p className="text-[14px] text-white/80 font-light leading-relaxed max-w-[300px] mx-auto mb-[32px]">
                Your premium formulations are being prepared. A confirmation invoice is arriving at {emailValue} shortly.
              </p>

              {/* Order ID Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-[24px] w-full max-w-[320px] mx-auto text-left flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest block font-sans">
                    Order Code
                  </span>
                  <strong className="text-[18px] font-bold font-mono tracking-wider text-white block mt-[4px]">
                    {lastOrderId || "WEN-72061A2"}
                  </strong>
                </div>
                <button
                  onClick={handleCopyOrderId}
                  className="w-[40px] h-[40px] bg-white/20 hover:bg-[#C9A227] rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  {copied ? (
                    <ClipboardCheck className="w-[18px] h-[18px] text-white" />
                  ) : (
                    <Copy className="w-[18px] h-[18px] text-white" />
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right panel - Next Steps & Actions */}
          <div className="flex-1 p-[40px] md:p-[60px] bg-white flex flex-col justify-center">
            <h3 className="font-playfair text-[24px] font-bold text-[#1F4D3A] mb-[32px]">
              What happens next?
            </h3>

            <div className="space-y-[32px] mb-[40px]">
              {nextSteps.map((step, index) => (
                <div key={step.id} className="flex gap-[16px]">
                  <div className="relative mt-[4px]">
                    <div className="w-[24px] h-[24px] rounded-full border-2 border-[#1F4D3A] flex items-center justify-center bg-white z-10 relative">
                      <div className="w-[8px] h-[8px] rounded-full bg-[#C9A227]" />
                    </div>
                    {index < nextSteps.length - 1 && (
                      <div className="absolute top-[24px] bottom-[-32px] left-1/2 -translate-x-1/2 w-[2px] bg-[#e5e5e5]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold uppercase tracking-wider text-[#1a1a1a] mb-[4px]">
                      {step.title}
                    </h4>
                    <p className="text-[13px] text-[#6b6b6b] font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-[16px]">
              <button
                onClick={() => navigate('track-order')}
                className="flex-1 py-[16px] bg-[#1F4D3A] hover:bg-[#C9A227] hover:text-white transition-colors text-white text-[12px] font-bold uppercase tracking-widest rounded-full cursor-pointer flex items-center justify-center gap-[8px]"
              >
                <span>Track Order</span>
                <ArrowRight className="w-[16px] h-[16px]" />
              </button>
              <button
                onClick={() => navigate('home')}
                className="flex-1 py-[16px] bg-[#f5f5f5] hover:bg-[#e5e5e5] transition-colors text-[#1a1a1a] text-[12px] font-bold uppercase tracking-widest rounded-full cursor-pointer flex items-center justify-center gap-[8px]"
              >
                <Home className="w-[16px] h-[16px]" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
