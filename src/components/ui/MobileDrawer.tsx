import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, ChevronUp, ArrowRight, ShoppingBag, Heart, Search, Phone, ShieldCheck } from "lucide-react";
import { useShop } from "../../context/ShopContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onCategoryClick: (category: string | null) => void;
  onConcernClick: (concern: string) => void;
  wishlistCount: number;
  navCategories?: any[];
  navTargets?: any[];
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onCategoryClick,
  onConcernClick,
  wishlistCount,
  navCategories = [],
  navTargets = []
}) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [concernsOpen, setConcernsOpen] = useState(false);
  const { user } = useShop();

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    onClose();
  };

  const handleCategoryLink = (category: string | null) => {
    onCategoryClick(category);
    onClose();
  };

  const handleConcernLink = (concern: string) => {
    onConcernClick(concern);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#254936]/60 z-[100] lg:hidden backdrop-blur-sm"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[360px] bg-[#F4EBDB] z-[101] flex flex-col h-full lg:hidden shadow-2xl"
            id="mobile-fullscreen-menu"
          >
            {/* Header portion */}
            <div className="flex items-center justify-between p-4 h-[64px] border-b border-[#254936]/10">
              <div 
                onClick={() => handleLinkClick("home")}
                className="cursor-pointer text-left focus:outline-none"
              >
                <span className="font-playfair text-[24px] font-bold text-[#254936] leading-none block">
                  WEN
                </span>
                <span className="font-sans text-[9px] font-medium text-[#B69355] tracking-[2px] uppercase block mt-1">
                  HAIR & SKIN SECRET
                </span>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 text-[#254936] hover:text-[#B69355] transition-colors focus:outline-none"
                aria-label="Close Mobile Menu"
                id="drawer-close-btn"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Scrollable links */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1 custom-scrollbar">
              <button
                onClick={() => handleLinkClick("home")}
                className="w-full text-left h-[40px] flex items-center border-b border-[#254936]/10 text-[15px] font-playfair font-medium text-[#254936] hover:text-[#B69355] transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleCategoryLink(null)}
                className="w-full text-left h-[40px] flex items-center border-b border-[#254936]/10 text-[15px] font-playfair font-medium text-[#254936] hover:text-[#B69355] transition-colors"
              >
                Shop All
              </button>

              {/* Accordion 1: Categories dropdown */}
              <div className="border-b border-[#254936]/10">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full text-left h-[40px] flex items-center justify-between text-[15px] font-playfair font-medium text-[#254936] hover:text-[#B69355] transition-colors"
                  id="drawer-accordion-categories-btn"
                >
                  Categories
                  {categoriesOpen ? <ChevronUp className="w-[18px] h-[18px] text-[#B69355]" /> : <ChevronDown className="w-[18px] h-[18px] text-[#B69355]" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 pb-3"
                    >
                      {navCategories && navCategories.length > 0 ? (
                        navCategories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryLink(cat.name)}
                            className="w-full text-left py-2 px-3 text-sm text-[#63786A] hover:text-[#254936] font-medium block bg-white/50 rounded-md"
                          >
                            {cat.name}
                          </button>
                        ))
                      ) : (
                        <>
                          <button
                            onClick={() => handleCategoryLink("Hair Oil")}
                            className="w-full text-left py-2 px-3 text-sm text-[#63786A] hover:text-[#254936] font-medium block bg-white/50 rounded-md"
                          >
                            Saffron Hair Oils
                          </button>
                          <button
                            onClick={() => handleCategoryLink("Shampoo")}
                            className="w-full text-left py-2 px-3 text-sm text-[#63786A] hover:text-[#254936] font-medium block bg-white/50 rounded-md"
                          >
                            Sulfate-Free Shampoos
                          </button>
                          <button
                            onClick={() => handleCategoryLink("Face Serum")}
                            className="w-full text-left py-2 px-3 text-sm text-[#63786A] hover:text-[#254936] font-medium block bg-white/50 rounded-md"
                          >
                            Clinical Face Serums
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: Concerns dropdown */}
              <div className="border-b border-[#254936]/10">
                <button
                  onClick={() => setConcernsOpen(!concernsOpen)}
                  className="w-full text-left h-[40px] flex items-center justify-between text-[15px] font-playfair font-medium text-[#254936] hover:text-[#B69355] transition-colors"
                  id="drawer-accordion-concerns-btn"
                >
                  Shop By Concern
                  {concernsOpen ? <ChevronUp className="w-[18px] h-[18px] text-[#B69355]" /> : <ChevronDown className="w-[18px] h-[18px] text-[#B69355]" />}
                </button>
                
                <AnimatePresence initial={false}>
                  {concernsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 pb-3"
                    >
                      {navTargets && navTargets.length > 0 ? (
                        navTargets.map(target => (
                          <button
                            key={target.id}
                            onClick={() => handleConcernLink(target.name)}
                            className="w-full text-left py-2 px-3 text-sm text-[#63786A] hover:text-[#254936] font-medium block bg-white/50 rounded-md"
                          >
                            {target.name}
                          </button>
                        ))
                      ) : (
                        <>
                          <button
                            onClick={() => handleConcernLink("Hair Thinning & Fall")}
                            className="w-full text-left py-2 px-3 text-sm text-[#63786A] hover:text-[#254936] font-medium block bg-white/50 rounded-md"
                          >
                            Hair Thinning & Fall
                          </button>
                          <button
                            onClick={() => handleConcernLink("Acne & Pore Control")}
                            className="w-full text-left py-2 px-3 text-sm text-[#63786A] hover:text-[#254936] font-medium block bg-white/50 rounded-md"
                          >
                            Acne & Pore Congestion
                          </button>
                          <button
                            onClick={() => handleConcernLink("Pigmentation & Dark Spots")}
                            className="w-full text-left py-2 px-3 text-sm text-[#63786A] hover:text-[#254936] font-medium block bg-white/50 rounded-md"
                          >
                            Pigmentation & Sun-tan
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => handleLinkClick("about")}
                className="w-full text-left h-[40px] flex items-center border-b border-[#254936]/10 text-[15px] font-playfair font-medium text-[#254936] hover:text-[#B69355] transition-colors"
              >
                Our Story
              </button>
               
              <button
                onClick={() => handleLinkClick("contact")}
                className="w-full text-left h-[40px] flex items-center border-b border-[#254936]/10 text-[15px] font-playfair font-medium text-[#254936] hover:text-[#B69355] transition-colors"
              >
                Contact Us
              </button>

              <button
                onClick={() => handleLinkClick("track-order")}
                className="w-full text-left h-[40px] flex items-center border-b border-[#254936]/10 text-[15px] font-playfair font-medium text-[#B69355] hover:opacity-80 transition-opacity"
              >
                Track Your Order
              </button>
            </div>

            {/* Bottom Actions Area */}
            <div className="p-4 bg-[#254936] space-y-3">
              <div className="flex flex-col gap-2">
                {user ? (
                  <button
                    onClick={() => handleLinkClick("account")}
                    className="w-full h-[36px] bg-[#B69355] hover:bg-[#B38D1F] text-white font-sans text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all focus:outline-none flex items-center justify-center"
                    id="drawer-account-btn"
                  >
                    My Dashboard
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLinkClick("sign-in")}
                      className="flex-1 h-[36px] bg-white text-[#254936] hover:bg-neutral-100 font-sans text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all focus:outline-none flex items-center justify-center"
                      id="drawer-signin-btn"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleLinkClick("sign-up")}
                      className="flex-1 h-[36px] bg-[#B69355] hover:bg-[#B38D1F] text-white font-sans text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all focus:outline-none flex items-center justify-center"
                      id="drawer-signup-btn"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
