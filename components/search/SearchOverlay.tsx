import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Trash2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onProductClick: (productId: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  products,
  onProductClick,
}) => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wen_recent_searches_state");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.warn("Could not load recent searches.");
      }
    }
  }, [isOpen]);

  // Focus input automatically
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Trigger escape closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSearchSubmit = (searchWord: string) => {
    if (!searchWord.trim()) return;
    const word = searchWord.trim();
    setQuery(word);
    
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== word.toLowerCase());
      const updated = [word, ...filtered].slice(0, 3);
      localStorage.setItem("wen_recent_searches_state", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("wen_recent_searches_state");
  };

  const activeQuery = query.trim().toLowerCase();
  
  const liveResults = activeQuery === ""
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(activeQuery) ||
        p.category.toLowerCase().includes(activeQuery) ||
        p.description.toLowerCase().includes(activeQuery) ||
        (p.ingredients && p.ingredients.toLowerCase().includes(activeQuery))
      ).slice(0, 4);

  const popularSearches = [
    "Saffron Hair Oil",
    "Rosemary Bio-Shampoo",
    "Hydrating Serum",
    "Aloe Cleanser",
    "Acne Formula"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "-10px" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-15px" }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 bg-white z-[9999] flex flex-col font-sans text-[#1F4D3A] overflow-y-auto"
          id="search-overlay-fullscreen-container"
        >
          {/* Top Nav Header */}
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-6 flex items-center justify-between border-b border-[#E8E1D3]/40">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C9A227] uppercase">
              Discovery Laboratories &bull; Global Search
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#1F4D3A] transition-all hover:rotate-90 duration-300 focus:outline-none"
              aria-label="Close search overlay"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Core Central Focus Search input */}
          <div className="max-w-3xl mx-auto w-full px-6 md:px-10 py-12 flex-1 flex flex-col justify-start space-y-12">
            
            <div className="space-y-4">
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase text-left block">
                What formulation are you searching for?
              </label>
              <div className="relative border-b-2 border-gray-150 focus-within:border-[#C9A227] pb-4 flex items-center transition-colors">
                <Search className="w-7 h-7 text-[#1F4D3A] mr-4 stroke-[1.5]" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Skin acids, Saffron extract, Rosemary Oils..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit(query);
                  }}
                  className="w-full text-xl sm:text-2xl font-light text-[#1F4D3A] bg-transparent placeholder-gray-300 focus:outline-none focus:ring-0"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 px-2.5 rounded-xl block bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none text-xs uppercase tracking-wider font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Popular/Recent Searches layout */}
            {query.trim() === "" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Popular Searches */}
                <div className="space-y-4">
                  <h5 className="text-[11px] font-bold tracking-widest text-[#C9A227] uppercase flex items-center gap-1.5 leading-none">
                    <TrendingUp className="w-4 h-4 stroke-[1.5]" />
                    Popular Searches
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          handleSearchSubmit(term);
                        }}
                        className="px-4 py-2.5 text-xs font-semibold rounded-full bg-[#F7F2EA]/60 border border-[#E8E1D3]/50 text-[#1F4D3A] hover:bg-[#C9A227] hover:text-white hover:border-[#C9A227] transition-colors focus:outline-none"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center leading-none">
                    <h5 className="text-[11px] font-bold tracking-widest text-[#C9A227] uppercase">
                      Recent Searches
                    </h5>
                    {recentSearches.length > 0 && (
                      <button
                        onClick={handleClearRecent}
                        className="text-[10px] text-red-500 hover:underline uppercase font-bold flex items-center gap-1 focus:outline-none"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear All
                      </button>
                    )}
                  </div>

                  {recentSearches.length > 0 ? (
                    <div className="space-y-2">
                      {recentSearches.map((term, i) => (
                        <div
                          key={`${term}-${i}`}
                          className="flex items-center justify-between py-2 border-b border-gray-100"
                        >
                          <button
                            onClick={() => {
                              setQuery(term);
                              handleSearchSubmit(term);
                            }}
                            className="text-xs hover:text-[#C9A227] text-gray-600 font-medium transition-colors focus:outline-none text-left"
                          >
                            {term}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 font-light italic">
                      No searches have been recorded yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Live Search queries list result */}
            {query.trim() !== "" && (
              <div className="text-left space-y-6">
                <h5 className="text-[11px] font-bold tracking-widest text-[#C9A227] uppercase border-b border-gray-100 pb-2">
                  Live Laboratory Creations ({liveResults.length})
                </h5>

                {liveResults.length > 0 ? (
                  <div className="space-y-3">
                    {liveResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          handleSearchSubmit(query);
                          onProductClick(product.id);
                          onClose();
                        }}
                        className="flex items-center p-3 sm:p-4 border border-[#E8E1D3]/45 rounded-2xl hover:border-[#C9A227] bg-white hover:bg-[#F7F2EA]/20 transition-all cursor-pointer group shadow-sm"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="ml-4 flex-1">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A227] mb-0.5 block">
                            {product.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#1F4D3A] group-hover:text-[#C9A227] transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                        </div>
                        <div className="text-right flex items-center space-x-3 ml-4">
                          <span className="text-xs sm:text-sm font-bold font-sans text-[#1F4D3A]">
                            Rs. {product.price.toLocaleString()}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#C9A227] group-hover:translate-x-1.5 transition-all duration-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 border border-dashed border-[#E8E1D3] bg-[#F7F2EA]/30 rounded-2xl">
                    <p className="text-xs text-gray-500 font-light max-w-sm mx-auto">
                      No formulations match &ldquo;{query}&rdquo;. Check your spelling or try search terms like Saffron, Hair, Serum.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default SearchOverlay;
