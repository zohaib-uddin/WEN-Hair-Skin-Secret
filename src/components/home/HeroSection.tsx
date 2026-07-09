import { getSmallestVariant } from "../../lib/utils/variant";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../../context/ShopContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Images
import img1 from '../../assets/images/caraousel1.jpg'
import img2 from '../../assets/images/caraousel2.jpg'
import img3 from '../../assets/images/caraousel3.png'
import img4 from '../../assets/images/caraousel4.png'

import video1 from '../../assets/images/banner video1.mp4'

const slides = [
  {
    id: 1,
    type: 'image',
    subtitle: 'Clinical Formulation',
    title: 'Glow Beyond \n Expectations',
    description: 'Achieve the ultimate glass-skin radiance. Infused with professional-strength Glutathione, Alpha Arbutin, and pure Kashmiri Saffron.',
    productName: 'Wenglow',
    price: 'Rs. 1,799',
    mediaUrl: img1,
    color: '#E11D48',
    duration: 5000
  },
  {
    id: 2,
    type: 'image',
    subtitle: 'Acne Control',
    title: 'Clear Skin \n Starts Here',
    description: 'Fights acne and pimples. Constricts open pores, boosts collagen, maintains natural pH balance and oil levels.',
    productName: 'Wen Acne',
    price: 'Rs. 1,650',
    mediaUrl: img2,
    color: '#0284C7',
    duration: 5000
  },
  {
    id: 3,
    type: 'image',  
    subtitle: 'Anti-Aging',
    title: 'Turn Back Time \n Naturally',
    description: 'Removes wrinkles & black spots for visibly younger looking skin. Minimizes age spots and provides deep hydration.',
    productName: 'WenAging',
    price: 'Rs. 1,999',
    mediaUrl: img3,
    color: '#1E3A8A',
    duration: 5000
  },
  {
    id: 4,
    type: 'image',
    subtitle: 'Advanced Brightening',
    title: 'Superb \n Antioxidant',
    description: 'Brightens skin complexion, revitalizes uneven tone & texture. Helps protect skin with antioxidant power of Vitamin C.',
    productName: 'Wen-C',
    price: 'Rs. 1,550',
    mediaUrl: img4,
    color: '#EA580C',
    duration: 5000
  },
  {
    id: 5,
    type: 'video',
    subtitle: 'The Secret',
    title: 'Nature Meets \n Science',
    description: 'Discover the meticulous process behind our luxury botanical formulations. Every drop is crafted with precision.',
    productName: 'Shop All',
    price: 'Explore Collection',
    mediaUrl: video1,
    color: '#1F4D3A',
    duration: 8100
  }
];

// Premium smooth animations with subtle zoom-in
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1.02,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.8 },
      scale: { duration: 1.2, ease: "easeOut" }
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.6 },
      scale: { duration: 0.6 }
    }
  })
};

export const HeroSection: React.FC = () => {
  const { products, productsLoading, addToCart, navigate } = useShop();
  const [[page, direction], setPage] = useState([0, 0]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slideIndex = Math.abs(page % slides.length);
  const currentSlide = slides[slideIndex];

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      paginate(1);
    }, currentSlide.duration);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [page, currentSlide.duration]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  if (productsLoading) {
    return (
      <section className="relative w-full bg-[#F7F2EA] flex items-center justify-center aspect-[21/9] md:aspect-auto md:h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-[40px] h-[40px] border-[4px] border-[#C9A227] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full md:h-[80vh] overflow-hidden bg-black"
      id="hero-luxury-section"
      role="region"
      aria-label="Product Showcase"
    >
      {/* Media Container - 21:9 on mobile, full height on desktop */}
      <div className="relative w-full aspect-[21/9] md:absolute md:inset-0 md:w-full md:h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {currentSlide.type === 'video' ? (
              <video 
                src={currentSlide.mediaUrl} 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={currentSlide.mediaUrl}
                alt={currentSlide.productName}
               loading="eager"
fetchPriority="high"
                decoding="async"
                className="w-full h-full object-contain md:object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls - Smaller on mobile */}
      <div className="absolute bottom-[12px] md:bottom-[40px] left-1/2 -translate-x-1/2 z-20 flex items-center gap-[10px] md:gap-[24px]">
        <button 
           onClick={() => paginate(-1)} 
           className="w-[24px] md:w-[48px] h-[24px] md:h-[48px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors focus:outline-none"
           aria-label="Previous Slide"
        >
          <ChevronLeft className="w-[12px] md:w-[24px] h-[12px] md:h-[24px]" />
        </button>
        <div className="flex gap-[6px] md:gap-[12px]">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const newDirection = idx > slideIndex ? 1 : -1;
                setPage([idx, newDirection]);
              }}
              className={`h-[2px] md:h-[4px] rounded-full transition-all duration-300 focus:outline-none ${
                idx === slideIndex ? "w-[16px] md:w-[32px] bg-[#C9A227]" : "w-[8px] md:w-[16px] bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button 
           onClick={() => paginate(1)} 
           className="w-[24px] md:w-[48px] h-[24px] md:h-[48px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors focus:outline-none"
           aria-label="Next Slide"
        >
          <ChevronRight className="w-[12px] md:w-[24px] h-[12px] md:h-[24px]" />
        </button>
      </div>
    </section>
  );
};