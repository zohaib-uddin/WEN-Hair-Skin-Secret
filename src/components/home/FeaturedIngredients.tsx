import React from "react";
import { motion } from "motion/react";
import { Leaf } from "lucide-react";
import img1 from "../../assets/images/wen 1.png"
import img2 from "../../assets/images/wen 2.png"
import img3 from "../../assets/images/wen 3.png"
import img4 from "../../assets/images/wen 4.png"
import img5 from "../../assets/images/wen 5.png"
import img6 from "../../assets/images/wen 6.png"


export const FeaturedIngredients: React.FC = () => {
  const ingredients = [
    {
      name: "Kashmiri Saffron",
      tagline: "Cellular Glow & Anti-Aging",
      description: "Our signature thread extract deeply brightens and repairs cellular damage from the first application.",
      image: img1,
    },
    {
      name: "Organic Argan Oil",
      tagline: "Deep Hydration",
      description: "Liquid gold from Morocco that locks in moisture and smooths frizz without weighing hair down.",
      image: img2,
    },
    {
      name: "Active Biotin",
      tagline: "Follicular Strength",
      description: "Essential B-vitamin complex that fortifies hair roots and promotes thicker, stronger growth.",
      image: img3,
    },
    {
      name: "Rosemary Extract",
      tagline: "Scalp Activation",
      description: "Stimulates micro-circulation in the scalp to awaken dormant follicles and soothe irritation.",
      image: img4,
    },
    {
      name: "Vitamin C",
      tagline: "Brightening Power",
      description: "A potent antioxidant that evens skin tone, fades dark spots, and defends against environmental stress.",
      image: img5,
    },
    {
      name: "Hyaluronic Acid",
      tagline: "Moisture Lock",
      description: "Draws in and retains 1000x its weight in water for plump, deeply hydrated, and bouncy skin.",
      image: img6,
    }
  ];

  return (
    <section className="py-[40px] md:py-[80px] lg:py-[120px] bg-white font-sans overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-[16px] md:px-[24px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[600px] mx-auto mb-[32px] md:mb-[60px] flex flex-col items-center"
        >
          <div className="w-[40px] h-[2px] bg-[#C9A227] mb-[12px] md:mb-[16px]" />
          <span className="text-[#C9A227] text-[9px] md:text-[11px] font-bold tracking-[3px] uppercase block mb-[12px] md:mb-[16px]">
            98% Natural Actives
          </span>
          <h2 className="font-playfair text-[24px] md:text-[44px] font-bold text-[#1F4D3A] tracking-[-0.01em]">
            Formulated Botanicals
          </h2>
          <p className="text-[12px] md:text-[15px] text-[#6b6b6b] leading-[1.6] md:leading-[1.7] mt-[8px] md:mt-[12px] max-w-[500px]">
            Sourced ethically and backed by science, our natural ingredients are hand-blended for the best results.
          </p>
        </motion.div>

        {/* Ingredients Carousel / Grid */}
        <div 
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-[20px] -mx-[16px] px-[16px] md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-[16px] md:gap-[32px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {ingredients.map((ing, idx) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="w-[75vw] md:w-auto shrink-0 snap-center bg-white rounded-2xl border border-[#f0f0f0] p-[24px] md:p-[28px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-[80px] h-[80px] rounded-full bg-[#F7F2EA] flex items-center justify-center mb-[20px] overflow-hidden p-[2px]">
                <img
                  src={ing.image}
                  alt={ing.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <h3 className="font-playfair text-[18px] font-bold text-[#1F4D3A] mb-[4px]">
                {ing.name}
              </h3>
              <span className="text-[#C9A227] text-[10px] tracking-[1px] uppercase font-bold block mb-[12px]">
                {ing.tagline}
              </span>
              <p className="text-[13px] text-[#6b6b6b] leading-[1.7]">
                {ing.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
