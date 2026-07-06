"use client";

import React from "react";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number; // 1: Info, 2: Shipping, 3: Payment/Review
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = [
    { id: 1, name: "Contact", label: "Contact" },
    { id: 2, name: "Shipping", label: "Shipping" },
    { id: 3, name: "Payment", label: "Payment" },
  ];

  return (
    <div className="w-full max-w-2xl py-6 select-none font-sans" id="progress-indicator-container">
      <div className="relative flex items-center justify-between">
        {/* Background connector line */}
        <div className="absolute left-[16px] right-[16px] top-1/2 -translate-y-1/2 h-[1px] bg-[#e5e5e5] -z-10" />
        
        {/* Active tracking line */}
        <div 
          className="absolute left-[16px] top-1/2 -translate-y-1/2 h-[1px] bg-[#1F4D3A] transition-all duration-500 -z-10" 
          style={{ width: `${((Math.min(currentStep, 3) - 1) / 2) * 100}%` }}
        />

        {steps.map((step) => {
          const stepNumber = step.id;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
              <div 
                className={`w-[24px] h-[24px] rounded-full flex items-center justify-center border transition-all duration-300 font-bold text-[10px] ${
                  isCompleted 
                    ? "bg-[#1F4D3A] border-[#1F4D3A] text-white" 
                    : isActive 
                      ? "bg-white border-[#1F4D3A] text-[#1F4D3A] ring-4 ring-[#1F4D3A]/10" 
                      : "bg-white border-[#e5e5e5] text-[#6b6b6b]"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span 
                className={`mt-2 text-[12px] font-medium tracking-wide transition-colors duration-300 ${
                  isActive 
                    ? "text-[#1F4D3A] font-bold" 
                    : isCompleted 
                      ? "text-[#1F4D3A]" 
                      : "text-[#6b6b6b]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
