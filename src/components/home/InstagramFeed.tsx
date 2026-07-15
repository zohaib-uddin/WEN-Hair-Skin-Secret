import React, { useRef } from "react";
import { motion } from "motion/react";
import img1 from "../../assets/images/wen 18.png";
import img2 from "../../assets/images/wen 19.png";
import img3 from "../../assets/images/wen 20.png";
import img4 from "../../assets/images/wen 21.png";
import img5 from "../../assets/images/wen 22.png";
import { Instagram, ArrowLeft, ArrowRight } 
from "lucide-react";
import { useScrollArrows } from "../../hooks/useScrollArrows";

export const InstagramFeed: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isAtStart, isAtEnd } = useScrollArrows(scrollContainerRef);
  const posts = [
    img1,
    img2,
    img3,
    img4,
    img5,
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <section className="py-[40px] md:py-[80px] lg:py-[120px] bg-white font-sans overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-[16px] md:px-[24px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-[32px] md:mb-[60px]"
        >
          <div className="w-[40px] h-[2px] bg-[#B69355] mb-[8px] md:mb-[16px]" />
          <span className="text-[#B69355] text-[9px] md:text-[11px] font-bold tracking-[3px] uppercase block mb-[8px] md:mb-[16px]">
            Follow Us
          </span>
          <h2 className="font-playfair text-[24px] md:text-[44px] font-bold text-[#254936] tracking-[-0.01em] mb-[16px] md:mb-[24px]">
            @WenHairAndSkin
          </h2>
          <a
            href="javascript:void(0)"
            className="text-[#254936] text-[11px] md:text-[13px] font-bold uppercase tracking-[1px] border-b-[2px] border-[#B69355] pb-[4px] hover:text-[#B69355] transition-colors"
          >
            Join the Community
          </a>
        </motion.div>

        <div className="relative group">
          <button
            onClick={scrollLeft}
            className={`absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-[#254936] transition-all duration-300 cursor-pointer ${
              isAtStart ? "opacity-0 pointer-events-none translate-x-[-10px]" : "opacity-100 translate-x-0"
            }`}
            aria-label="Scroll left"
          >
            <ArrowLeft size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex gap-[16px] md:gap-[24px] overflow-x-auto pb-[16px] md:pb-[32px] snap-x hide-scrollbar scroll-smooth px-[16px] md:px-0 -mx-[16px] md:mx-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {posts.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex-none w-[75vw] sm:w-[260px] md:w-[320px] aspect-square rounded-2xl overflow-hidden relative group cursor-pointer snap-center shadow-md border border-[#E0D4BE]"
              >
                <img
                  src={img}
                  alt={`Instagram post ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#254936]/0 group-hover:bg-[#254936]/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="text-white w-[24px] md:w-[32px] h-[24px] md:h-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className={`absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-[#254936] transition-all duration-300 cursor-pointer ${
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
