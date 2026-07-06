import React from "react";
import { ShieldCheck } from "lucide-react";

export const Certifications: React.FC = () => {
  const marqueeItems = [
    "Dermatologist Tested",
    "100% Natural Ingredients",
    "Cruelty Free & Vegan",
    "Made in Pakistan",
    "GMP Certified",
    "Sulfate & Paraben Free",
    "Clinically Proven Results"
  ];

  // Repeat for seamless loop
  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <section className="bg-[#F7F2EA] border-y border-[#C9A227]/20 font-sans overflow-hidden h-[40px] md:h-[48px] flex items-center">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33333%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="w-full relative flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee flex items-center">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center mx-[24px]">
              <ShieldCheck className="w-[20px] h-[20px] text-[#C9A227] mr-[12px]" />
              <span className="text-[13px] text-[#1F4D3A] font-medium tracking-[0.5px]">
                {item}
              </span>
              <div className="w-[4px] h-[4px] rounded-full bg-[#C9A227] ml-[48px]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

