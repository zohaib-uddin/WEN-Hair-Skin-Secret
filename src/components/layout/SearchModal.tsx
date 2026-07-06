import React, { useRef, useEffect } from "react";
import { useShop } from "../../context/ShopContext";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const SearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    navigate
  } = useShop();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen]);

  // Filters matching products against searchQuery
  const filteredProducts = searchQuery.trim() === ""
    ? []
    : products.filter(product => {
        const q = searchQuery.toLowerCase();
        return (
          (product.name || "").toLowerCase().includes(q) ||
          (product.description || "").toLowerCase().includes(q) ||
          ((product.ingredients && product.ingredients[0]) || "").toLowerCase().includes(q) ||
          (product.category || "").toLowerCase().includes(q) ||
          (product.concern || "").toLowerCase().includes(q)
        );
      });

  const quickSearches = [
    { label: "Saffron", term: "saffron" },
    { label: "Hair Fall Oil", term: "hair growth oil" },
    { label: "Face Serum", term: "face serum" },
    { label: "Pore Control", term: "pore" },
    { label: "Night Glow Cream", term: "night cream" }
  ];

  const handleProductClick = (id: string) => {
    navigate('product', id);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          {/* Backdrop screen filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Search container drawer from top */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed top-0 left-0 right-0 max-h-[85vh] bg-white border-b border-[#E0E0E0] shadow-2xl z-50 overflow-hidden font-sans"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              {/* Header Action */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold tracking-[0.2em] text-[#C9A227] uppercase">FORMULATION DISCOVERY HUB</span>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-full text-[#757575] hover:text-[#2C2C2C] hover:bg-[#f5f5f5] transition-all"
                  aria-label="Close search"
                  id="search-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Central Input element */}
              <div className="relative border-b-2 border-[#1F4D3A] pb-3 mb-6 flex items-center">
                <Search className="w-6 h-6 text-[#1F4D3A] mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Analyze skin concerns or browse ingredients (Saffron, Niacinamide, Zinc...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-base sm:text-lg text-[#2C2C2C] bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0 select-none"
                  id="search-input-field"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-[#757575] hover:text-[#757575]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Suggestion buttons */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-xs font-semibold text-[#757575] mr-2">Top Searches for Pakistan:</span>
                {quickSearches.map((qs, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(qs.term)}
                    className="text-xs bg-[#F7F2EA] text-[#1F4D3A] font-medium border border-[#E0E0E0] px-3 py-1.5 rounded-full hover:bg-[#1F4D3A] hover:text-[#F7F2EA] hover:border-[#1F4D3A] transition-all"
                  >
                    {qs.label}
                  </button>
                ))}
              </div>

              {/* Search Results list */}
              <div className="overflow-y-auto max-h-[45vh] pr-2 scrollbar-thin">
                {searchQuery.trim() === "" ? (
                  <div className="text-center py-10">
                    <p className="text-[#757575] text-sm">Discover matching luxury creams, hair serums, and natural organic oils by typing above.</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <p className="text-[#757575] font-medium text-sm">No formulations found for "{searchQuery}"</p>
                    <p className="text-xs text-[#757575] font-light">Try searching for generic concerns like "acne", "hair fall", or active compounds like "saffron".</p>
                  </div>
                ) : (
                  <div>
                    <h5 className="text-xs font-bold text-[#1F4D3A] tracking-wider mb-4 uppercase">
                      MATCHING LAB FORMULATIONS ({filteredProducts.length})
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center p-3 border border-[#E0E0E0] rounded-sm hover:border-[#1F4D3A] hover:bg-[#F7F2EA]/40 transition-all cursor-pointer group"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-sm border border-[#E0E0E0]"
                            referrerPolicy="no-referrer"
                          loading="lazy" />
                          <div className="ml-4 flex-1 text-left">
                            <h4 className="text-xs font-bold text-[#2C2C2C] group-hover:text-[#1F4D3A] transition-colors line-clamp-1">{product.name}</h4>
                            <p className="text-[10px] text-[#C9A227] font-semibold tracking-wide uppercase mt-0.5">{product.category} &bull; {product.concern}</p>
                            <p className="text-xs text-[#2C2C2C] font-semibold mt-1">Rs. {(product.price || 0).toLocaleString()}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#757575] group-hover:text-[#1F4D3A] transition-transform duration-300 transform group-hover:translate-x-1" />
                        </div>
                      ))}
                    </div>
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
