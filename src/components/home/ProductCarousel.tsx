import { getSmallestVariant } from "../../lib/utils/variant";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { useShop } from "../../context/ShopContext";

export const ProductCarousel: React.FC = () => {
  const { products, addToCart, navigate } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic slides from real products
  const slides = products
    .filter((p) => !p.isBestSeller && !p.isNewArrival)
    .slice(0, 4);
  const displaySlides = slides.length > 0 ? slides : products.slice(0, 4);

  useEffect(() => {
    if (!isHovered && displaySlides.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === displaySlides.length - 1 ? 0 : prev + 1,
        );
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isHovered, displaySlides.length]);

  if (!displaySlides || displaySlides.length === 0) {
    return (
      <section className="relative w-full py-16 bg-[#FAFAF9] flex items-center justify-center min-h-[600px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#1F4D3A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === displaySlides.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displaySlides.length - 1 : prev - 1,
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleAddToCart = (slideId: string) => {
    const product = products.find((p) => p.id === slideId);
    if (product) {
      addToCart(product, 1, getSmallestVariant(product.variants, product.size));
    }
  };

  const safeIndex = currentIndex >= displaySlides.length ? 0 : currentIndex;
  const slide = displaySlides[safeIndex];

  return (
    <section
      className="relative w-full py-16 bg-[#FAFAF9] overflow-hidden border-b border-[#E8E1D3]"
      id="product-showcase-carousel-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="bg-[#F5F5F4] rounded-2xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row relative">
                {/* Product Showcase Half */}
                <div className="w-full md:w-[50%] h-[50vh] md:min-h-[600px] bg-[#E8E6E1] relative">
                  <img
                    src={slide.image}
                    alt={slide.name}
                    className="w-full h-full object-cover grayscale-[15%]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent mix-blend-multiply" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur text-[#1F4D3A] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                      {slide.category}
                    </span>
                  </div>
                </div>

                {/* Content & Details Half */}
                <div className="w-full md:w-[50%] p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                  <div className="max-w-md">
                    <h3 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1917] mb-4 leading-tight">
                      {slide.name}
                    </h3>

                    <p className="text-[#57534E] text-sm md:text-base font-light leading-relaxed mb-8">
                      {slide.description}
                    </p>

                    {/* Key benefits list */}
                    <ul className="space-y-3 mb-8">
                      {(slide.keyBenefits || [])
                        .slice(0, 4)
                        .map((benefit, bIdx) => (
                          <motion.li
                            key={bIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + bIdx * 0.1 }}
                            className="flex items-center gap-3 text-sm text-[#44403C]"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1F4D3A]" />
                            {benefit}
                          </motion.li>
                        ))}
                    </ul>

                    {/* Action Block */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#F5F5F4]">
                      <button
                        onClick={() => navigate(`product/${slide.id}`)}
                        className="w-full sm:w-auto bg-[#1C1917] hover:bg-[#1F4D3A] text-white px-8 py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase transition-colors"
                      >
                        Explore Details
                      </button>
                      <button
                        onClick={() => handleAddToCart(slide.id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#1C1917]/10 hover:border-[#1F4D3A] px-8 py-3.5 rounded-xl font-bold text-xs tracking-widest uppercase text-[#1C1917] transition-all hover:bg-[#F5F5F4]"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          Buy - Rs. {(slide.price || 0).toLocaleString()}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ARROW CONTROLS (Instruction 5) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-20">
            <button
              onClick={handlePrev}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur hover:bg-white rounded-full flex items-center justify-center text-[#1C1917] shadow-sm transition-all border border-black/5 cursor-pointer"
              aria-label="Previous product"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20">
            <button
              onClick={handleNext}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur hover:bg-white rounded-full flex items-center justify-center text-[#1C1917] shadow-sm transition-all border border-black/5 cursor-pointer"
              aria-label="Next product"
            >
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* DOT INDICATORS (Instruction 5) */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-white/70 backdrop-blur-md py-2 px-4 rounded-full border border-white/50"
            id="carousel-dot-indicators-bar"
          >
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                  index === safeIndex
                    ? "w-8 h-2 bg-[#1F4D3A]"
                    : "w-2 h-2 bg-[#1C1917]/30 hover:bg-[#1C1917]/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
