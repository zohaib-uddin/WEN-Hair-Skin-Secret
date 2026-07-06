import React from "react";
import { X, Star, RefreshCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RangeSlider } from "../ui/RangeSlider";
import { FilterState } from "./FilterSidebar";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  products,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const concernsList = [
    { label: "Hair Thinning", value: "Hair Thinning & Fall" },
    { label: "Pore Control", value: "Acne & Pore Control" },
    { label: "Dry Skin", value: "Dry Skin" },
    { label: "Anti-Aging", value: "Anti-Aging" },
    { label: "Dullness & Glow", value: "Dullness & Glow" }
  ];

  const categoriesList = React.useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const catName = String(p.category || "");
      counts[catName] = (counts[catName] || 0) + 1;
    });
    const unique = Array.from(new Set(products.map((p) => String(p.category || "")))) as string[];
    return unique.map((cat: string) => ({
      name: cat,
      count: counts[cat] || 0,
    })).sort((a, b) => b.count - a.count);
  }, [products]);

  const handleCategoryToggle = (categoryName: string) => {
    const updated = filters.selectedCategories.includes(categoryName)
      ? filters.selectedCategories.filter((c) => c !== categoryName)
      : [...filters.selectedCategories, categoryName];
    onFilterChange({ ...filters, selectedCategories: updated });
  };

  const handleConcernToggle = (concernValue: string) => {
    const updated = filters.selectedConcerns.includes(concernValue)
      ? filters.selectedConcerns.filter((c) => c !== concernValue)
      : [...filters.selectedConcerns, concernValue];
    onFilterChange({ ...filters, selectedConcerns: updated });
  };

  const handlePriceChange = (range: [number, number]) => {
    onFilterChange({ ...filters, priceRange: range });
  };

  const handleRatingSelect = (rating: number | null) => {
    onFilterChange({ ...filters, minRating: rating === filters.minRating ? null : rating });
  };

  const handleStockToggle = () => {
    onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const isFiltered =
    filters.selectedCategories.length > 0 ||
    filters.selectedConcerns.length > 0 ||
    filters.minRating !== null ||
    filters.inStockOnly ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 6000;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-[3px]"
            id="mobile-filters-drawer-backdrop"
          />

          {/* Centering Filter drawer panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-h-[92vh] bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col font-sans text-[#1F4D3A] overflow-hidden"
            id="mobile-filters-drawer-container"
          >
            {/* Drawer Drag Bar Accent helper */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto my-3 flex-shrink-0" />

            {/* Drawer Header */}
            <div className="px-6 pb-4 border-b border-[#E8E1D3] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-playfair text-lg font-bold uppercase tracking-wider">
                  Filter & Sort
                </h3>
                {isFiltered && (
                  <span className="bg-[#1F4D3A] text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-mono">
                    {Number(filters.selectedCategories.length > 0) +
                      Number(filters.selectedConcerns.length > 0) +
                      Number(filters.minRating !== null) +
                      Number(filters.inStockOnly) +
                      Number(filters.priceRange[0] > 0 || filters.priceRange[1] < 6000)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {isFiltered && (
                  <button
                    onClick={onClearFilters}
                    className="text-xs text-red-500 hover:text-red-700 underline flex items-center gap-1 font-semibold transition-colors focus:outline-none"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-[#1F4D3A] focus:outline-none"
                  aria-label="Close filters list"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Scrollable layout content for Mobile touch targets */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 pb-24 text-left">
              
              {/* Category section */}
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <h5 className="text-xs font-bold tracking-widest text-[#C9A227] uppercase">
                  Formulation Category
                </h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {categoriesList.map((cat) => {
                    const isChecked = filters.selectedCategories.includes(cat.name);
                    return (
                      <label
                        key={cat.name}
                        className="flex items-center justify-between cursor-pointer group py-1 bg-gray-50/50 px-3 py-2 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCategoryToggle(cat.name)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4-half h-4-half rounded border flex items-center justify-center transition-all ${
                              isChecked
                                ? "bg-[#1F4D3A] border-[#1F4D3A] text-white"
                                : "border-gray-300 bg-white text-transparent"
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className={`text-[11px] ${isChecked ? "text-[#1F4D3A] font-bold" : "text-gray-600 font-light"}`}>
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono">
                          ({cat.count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price section */}
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <h5 className="text-xs font-bold tracking-widest text-[#C9A227] uppercase">
                  Price Limit (PKR)
                </h5>
                <div className="px-1">
                  <RangeSlider
                    min={0}
                    max={6000}
                    value={filters.priceRange}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>

              {/* Target Concern */}
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <h5 className="text-xs font-bold tracking-widest text-[#C9A227] uppercase">
                  Target concern
                </h5>
                <div className="flex flex-wrap gap-2">
                  {concernsList.map((concern) => {
                    const isSelected = filters.selectedConcerns.includes(concern.value);
                    return (
                      <button
                        key={concern.value}
                        onClick={() => handleConcernToggle(concern.value)}
                        type="button"
                        className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer focus:outline-none ${
                          isSelected
                            ? "bg-[#1F4D3A] text-white border-[#1F4D3A]"
                            : "bg-white text-gray-500 border-gray-200"
                        }`}
                      >
                        {concern.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reviews & Star ratings */}
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <h5 className="text-xs font-bold tracking-widest text-[#C9A227] uppercase">
                  Reviews & Rating
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {[4.5, 4.0, 3.5].map((starLimit) => {
                    const isSelected = filters.minRating === starLimit;
                    return (
                      <button
                        key={starLimit}
                        onClick={() => handleRatingSelect(starLimit)}
                        type="button"
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border space-y-1.5 focus:outline-none transition-all ${
                          isSelected
                            ? "bg-[#1F4D3A]/5 border-[#1F4D3A] font-bold text-[#1F4D3A]"
                            : "border-gray-200 bg-white text-gray-500 hover:border-amber-400"
                        }`}
                      >
                        <span className="text-xs">{starLimit}+</span>
                        <div className="flex text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Filter toggle */}
              <div className="pb-6">
                <label className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={handleStockToggle}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        filters.inStockOnly
                          ? "bg-[#1F4D3A] border-[#1F4D3A] text-white"
                          : "border-gray-300 bg-white text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">Show In Stock Only</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Active Status</span>
                </label>
              </div>

            </div>

            {/* Static layout CTA checkout footer bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E8E1D3] bg-white">
              <button
                onClick={onClose}
                className="w-full bg-[#1F4D3A] hover:bg-[#C9A227] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors focus:shadow-lg focus:outline-none"
              >
                Apply Active Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default FilterDrawer;
