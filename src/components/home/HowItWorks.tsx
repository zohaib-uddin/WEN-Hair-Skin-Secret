import React, { useRef } from "react";
import { motion } from "motion/react";
import { Droplet, FlaskConical, Shield, ArrowLeft, ArrowRight } 
from "lucide-react";
import { useScrollArrows } from "../../hooks/useScrollArrows";

export const HowItWorks: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isAtStart, isAtEnd } = useScrollArrows(scrollContainerRef);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const steps = [
    {
      number: "1",
      title: "Cleanse",
      desc: "Begin with a gentle, sulfate-free cleanser to remove impurities without stripping natural moisture from your hair or skin.",
      icon: <Droplet className="w-6 h-6 text-[#1F4D3A]" />
    },
    {
      number: "2",
      title: "Treat",
      desc: "Apply our targeted botanical serums and oils to deliver deep nourishment and address specific clinical concerns.",
      icon: <FlaskConical className="w-6 h-6 text-[#1F4D3A]" />
    },
    {
      number: "3",
      title: "Protect",
      desc: "Lock in all the active ingredients and defend against environmental stressors with our protective creams.",
      icon: <Shield className="w-6 h-6 text-[#1F4D3A]" />
    },
  ];

  return (
    <section className="py-[32px] md:py-[60px] lg:py-[80px] bg-white font-sans overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-[16px] md:px-[24px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[600px] mx-auto mb-[24px] md:mb-[40px] flex flex-col items-center"
        >
          <div className="w-[40px] h-[2px] bg-[#C9A227] mb-[8px] md:mb-[12px]" />
          <span className="text-[#C9A227] text-[9px] md:text-[11px] font-bold tracking-[3px] uppercase block mb-[8px] md:mb-[12px]">
            SIMPLE RITUAL
          </span>
          <h2 className="font-playfair text-[20px] md:text-[36px] font-bold text-[#1F4D3A] tracking-[-0.01em]">
            Your Daily Routine
          </h2>
          <p className="text-[11px] md:text-[14px] text-[#6b6b6b] leading-[1.6] mt-[6px] md:mt-[10px] max-w-[400px]">
            Achieve radiant skin and strong hair with our straightforward three-step botanical process.
          </p>
        </motion.div>

        {/* Steps Grid - Horizontal */}
        <div className="relative group">
          <button
            onClick={scrollLeft}
            className={`absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-[#1F4D3A] transition-all duration-300 cursor-pointer ${
              isAtStart ? "opacity-0 pointer-events-none translate-x-[-10px]" : "opacity-100 translate-x-0"
            }`}
            aria-label="Scroll left"
          >
            <ArrowLeft size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
          </button>
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[20px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-[#C9A227]/30 -z-10" />
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 -mx-[16px] px-[16px] md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-[12px] md:gap-[20px] scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="w-[85vw] sm:w-[280px] md:w-auto snap-center shrink-0 flex flex-col items-center text-center relative bg-white p-[16px] md:p-0 rounded-[16px] md:rounded-none border md:border-none border-[#f0f0f0]"
              >
                <div className="w-[36px] md:w-[40px] h-[36px] md:h-[40px] rounded-full bg-[#C9A227] flex items-center justify-center font-sans font-bold text-white text-[14px] md:text-[16px] mb-[12px] shadow-sm ring-4 ring-white">
                  {step.number}
                </div>
                <div className="w-[48px] h-[48px] rounded-full bg-[#F7F2EA] flex items-center justify-center mb-[12px]">
                  {step.icon}
                </div>
                <h3 className="font-playfair text-[16px] md:text-[18px] font-bold text-[#1F4D3A] mb-[6px]">
                  {step.title}
                </h3>
                <p className="text-[#6b6b6b] text-[11px] md:text-[12px] leading-[1.6] max-w-[240px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
          
          <button
            onClick={scrollRight}
            className={`absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-[#1F4D3A] transition-all duration-300 cursor-pointer ${
              isAtEnd ? "opacity-0 pointer-events-none translate-x-[10px]" : "opacity-100 translate-x-0"
            }`}
            aria-label="Scroll right"
          >
            <ArrowRight size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    </section>
  );
};
