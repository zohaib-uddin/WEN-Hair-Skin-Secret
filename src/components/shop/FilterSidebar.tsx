import React from "react";
import { X, Star, RotateCcw } from "lucide-react";
import { Product } from "../../types";
import { useShop } from "../../context/ShopContext";

interface FilterSidebarProps {
  products: Product[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedConcerns: string[];
  setSelectedConcerns: (concerns: string[]) => void;
  minRating: number | null;
  setMinRating: (rating: number | null) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  products,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  selectedConcerns,
  setSelectedConcerns,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  isOpen,
  onClose,
}) => {
  const { shopCategories, shopConcerns } = useShop();
  
  const [minPrice, maxPrice] = priceRange;

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleConcernToggle = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSelectedConcerns([]);
    setMinRating(null);
    setInStockOnly(false);
  };

  // Helper to count products matching category
  const getCategoryCount = (catName: string): number => {
    return products.filter((p) => {
      if (catName === "Skin Care") {
        return ["Face Serum", "Face Wash", "Night Cream", "Skin Care"].includes(p.category);
      }
      if (catName === "Hair Care") {
        return ["Hair Oil", "Shampoo", "Hair Care"].includes(p.category);
      }
      return p.category === catName;
    }).length;
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setPriceRange([val, maxPrice]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setPriceRange([minPrice, val]);
  };

  const sidebarContent = (
    <div className="space-y-8 pr-1 text-left font-sans text-[#1C1917]">
      {/* Active Filter summary and Reset button */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e5e5e5]">
        <h3 className="text-lg font-playfair font-bold text-[#1F4D3A]">Filters</h3>
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-1.5 text-xs text-[#C9A227] hover:text-[#1F4D3A] transition-colors uppercase tracking-wider font-semibold bg-transparent border-none p-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Categories Checkbox List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold tracking-widest text-[#1F4D3A] uppercase border-l-2 border-[#C9A227] pl-2">
          Categories
        </h4>
        <div className="space-y-2.5">
          {shopCategories.map((catObj) => {
            const cat = catObj.name;
            const count = getCategoryCount(cat);
            const isChecked = selectedCategories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center justify-between group cursor-pointer text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryChange(cat)}
                      className="peer h-4 w-4 shrink-0 rounded border-[#e5e5e5] bg-stone-50 text-[#C9A227] focus:ring-0 focus:ring-offset-0 focus:outline-none appearance-none border cursor-pointer checked:bg-[#1F4D3A] checked:border-[#C9A227]"
                    />
                    {isChecked && (
                      <svg
                        className="absolute left-0.5 top-0.5 h-3 w-3 text-[#C9A227] pointer-events-none stroke-current"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="4"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[#757575] group-hover:text-[#1F4D3A] transition-colors">
                    {cat}
                  </span>
                </div>
                <span className="text-xs text-[#757575] font-mono">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider & Inputs */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold tracking-widest text-[#1F4D3A] uppercase border-l-2 border-[#C9A227] pl-2">
          Price Range
        </h4>
        <div className="space-y-4">
          {/* Dual Range Sliders using HTML5 dual-range emulation styled elegantly */}
          <div className="relative h-2 rounded-full bg-[#FAFAF9] border border-gray-150 flex items-center">
            {/* Native slider emulation bar background */}
            <div 
              className="absolute h-full bg-[#C9A227]" 
              style={{ 
                left: `${(minPrice / 5000) * 105}%`, 
                right: `${100 - (maxPrice / 5000) * 100}%` 
              }} 
            />
            {/* Min Slider Track */}
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="absolute outer-slider w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-10"
              style={{ WebkitAppearance: "none" }}
            />
            {/* Max Slider Track */}
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="absolute outer-slider w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-20"
              style={{ WebkitAppearance: "none" }}
            />
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            .outer-slider::-webkit-slider-thumb {
              pointer-events: auto;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #1F4D3A;
              border: 2px solid #FFFFFF;
              cursor: pointer;
              -webkit-appearance: none;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .outer-slider::-moz-range-thumb {
              pointer-events: auto;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #1F4D3A;
              border: 2px solid #FFFFFF;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
          `}} />

          {/* Min & Max value inputs */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="space-y-1">
              <span className="text-[10px] text-[#757575] uppercase font-semibold">Min (Rs.)</span>
              <input
                type="number"
                min="0"
                max="5000"
                value={minPrice}
                onChange={handleMinPriceChange}
                className="w-full bg-[#FAFAF9] border border-gray-250 rounded-lg p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C9A227] font-mono"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#757575] uppercase font-semibold">Max (Rs.)</span>
              <input
                type="number"
                min="0"
                max="5000"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="w-full bg-[#FAFAF9] border border-gray-250 rounded-lg p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C9A227] font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Concerns Section clickable pills */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold tracking-widest text-[#1F4D3A] uppercase border-l-2 border-[#C9A227] pl-2">
          Shop by Concern
        </h4>
        <div className="flex flex-wrap gap-2">
          {shopConcerns.map((concernObj) => {
            const concern = concernObj.name;
            const isSelected = selectedConcerns.includes(concern);
            return (
              <button
                key={concern}
                type="button"
                onClick={() => handleConcernToggle(concern)}
                className={`text-[11px] px-3.5 py-1.5 rounded-full border transition-all duration-300 font-medium ${
                  isSelected
                    ? "bg-[#C9A227] text-[#1F4D3A] border-[#C9A227]"
                    : "bg-white text-gray-505 border-[#e5e5e5] hover:border-[#C9A227] text-[#757575] hover:text-[#1F4D3A]"
                }`}
              >
                {concern}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating interactive selection */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold tracking-widest text-[#1F4D3A] uppercase border-l-2 border-[#C9A227] pl-2">
          Rating Filter
        </h4>
        <div className="space-y-2">
          {[5, 4, 3].map((starRating) => {
            const isSelected = minRating === starRating;
            return (
              <button
                key={starRating}
                type="button"
                onClick={() => setMinRating(isSelected ? null : starRating)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                  isSelected ? "bg-[#F7F2EA]/40 border-[#C9A227]" : "border-transparent bg-white hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#C9A227]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < starRating ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-150 fill-gray-150"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-505">
                    {starRating === 5 ? "5 stars only" : `${starRating} & up`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability stock toggling */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold tracking-widest text-[#1F4D3A] uppercase border-l-2 border-[#C9A227] pl-2">
          Availability
        </h4>
        <label className="flex items-center gap-3 cursor-pointer group text-xs sm:text-sm">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="peer h-4 w-4 shrink-0 rounded border-[#e5e5e5] bg-stone-50 text-[#C9A227] focus:ring-0 focus:ring-offset-0 focus:outline-none appearance-none border cursor-pointer checked:bg-[#1F4D3A] checked:border-[#C9A227]"
            />
            {inStockOnly && (
              <svg
                className="absolute left-0.5 top-0.5 h-3 w-3 text-[#C9A227] pointer-events-none stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="4"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="text-[#757575] group-hover:text-[#1F4D3A] transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Quality Badge */}
      <div className="p-4 bg-[#F7F2EA]/60 rounded-2xl border border-[#FAFAF9] text-center space-y-2">
        <span className="text-[10px] text-[#C9A227] font-bold block uppercase tracking-wider">
          WEN LAB STANDARDS
        </span>
        <p className="text-[11px] text-[#78716C] font-light leading-relaxed">
          Sourced and tested clinically against Pakistan's local climate indices and humidity variables.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sticky Sidebar */}
      <div className="hidden lg:block w-[280px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-140px)] overflow-y-auto pr-2 pb-10 scrollbar-thin">
        {sidebarContent}
      </div>

      {/* Mobile drawer filter drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden">
          {/* Backdrop screen */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-xs"
          />

          {/* Slider Drawer Panel */}
          <div className="absolute top-0 bottom-0 left-0 w-full max-w-xs bg-white border-r border-[#F0F0F0] p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-2">
                <span className="text-xs font-bold tracking-widest text-[#C9A227] uppercase">
                  FILTER FORMULAS
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-[#757575] hover:text-[#1a1a1a] hover:bg-stone-50 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full bg-[#1F4D3A] text-white py-4 rounded-xl text-xs uppercase font-bold tracking-wider hover:bg-[#C9A227] hover:text-[#1F4D3A] transition-all"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </>
  );
};
