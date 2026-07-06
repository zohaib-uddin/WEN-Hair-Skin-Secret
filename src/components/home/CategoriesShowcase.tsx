import React, { useRef } from "react";
import { useShop } from "../../context/ShopContext";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } 
from "lucide-react";
import { useScrollArrows } from "../../hooks/useScrollArrows";
import img1 from "../../assets/images/wen 7.png"
import img2 from "../../assets/images/wen 8.png"
import img3 from "../../assets/images/wen 9.png"


interface CategoryItem {
  name: string;
  key: string;
  image: string;
}

export const CategoriesShowcase: React.FC = () => {
  const { navigate, setCategoryFilter, setConcernFilter } = useShop();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isAtStart, isAtEnd } = useScrollArrows(scrollContainerRef);

  const categories: CategoryItem[] = [
    {
      name: "Hair Care",
      key: "Hair Care",
      image:
        img1,
    },
    {
      name: "Skin Care",
      key: "Skin Care",
      image:
        img2,
    },
    {
      name: "Body Care",
      key: "Body Care",
      image:
        img3,
    },
  ];

  const handleCategoryClick = (categoryKey: string) => {
    setCategoryFilter(categoryKey);
    setConcernFilter(null);
    navigate("shop");
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section
      className="bg-white py-[40px] md:py-[80px] lg:py-[120px] font-sans overflow-hidden"
      id="categories-showcase-section"
    >
      <div className="max-w-[1280px] mx-auto px-[16px] md:px-[24px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[600px] mx-auto mb-[24px] md:mb-[60px] flex flex-col items-center"
        >
          <div className="w-[40px] h-[2px] bg-[#C9A227] mb-[8px] md:mb-[16px]" />
          <span className="text-[#C9A227] text-[9px] md:text-[11px] font-bold tracking-[3px] uppercase block mb-[8px] md:mb-[16px]">
            Shop by Category
          </span>
          <h2 className="font-playfair text-[20px] md:text-[44px] font-bold text-[#1F4D3A] tracking-[-0.01em]">
            Formulated Essentials
          </h2>
          <p className="text-[11px] md:text-[15px] text-[#6b6b6b] leading-[1.6] md:leading-[1.7] mt-[6px] md:mt-[12px] max-w-[500px]">
            Explore our curated collections of clinical botanical formulations
            tailored to your unique skin and hair needs.
          </p>
        </motion.div>

        {/* Dynamic Cards Grid with Arrows */}
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

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 gap-[16px] md:gap-[32px] scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="w-[75vw] shrink-0 md:w-[calc(33.333%-22px)] snap-center group cursor-pointer flex flex-col relative rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white"
                onClick={() => handleCategoryClick(cat.key)}
              >
                <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={`${cat.name} Collection`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.05]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                
                <div className="bg-white p-[16px] md:p-[24px] flex flex-col items-center text-center z-10 transition-colors duration-300 group-hover:bg-[#f9f9f9]">
                  <h3 className="font-playfair text-[20px] md:text-[28px] font-bold text-[#1F4D3A] mb-[4px] md:mb-[8px]">
                    {cat.name}
                  </h3>
                  <span className="text-[#C9A227] text-[10px] md:text-[12px] uppercase font-bold tracking-[1px] flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                    Shop Now <span className="ml-2">→</span>
                  </span>
                </div>
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

export default CategoriesShowcase;
