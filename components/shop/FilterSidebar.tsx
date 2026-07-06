import React from "react";
import { Star, RefreshCcw, Check } from "lucide-react";
import { RangeSlider } from "../ui/RangeSlider";

export interface FilterState {
  selectedCategories: string[];
  priceRange: [number, number];
  selectedConcerns: string[];
  minRating: number | null;
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  products: any[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  products,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  // Available list of concerns/tags
  const concernsList = [
    { label: "Hair Thinning & Fall", value: "Hair Thinning & Fall" },
    { label: "Acne & Pore Control", value: "Acne & Pore Control" },
    { label: "Dry Skin", value: "Dry Skin" },
    { label: "Anti-Aging", value: "Anti-Aging" },
    { label: "Dullness & Glow", value: "Dullness & Glow" }
  ];

  // Unique categories derived dynamically with product count
  const categoriesList = React.useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const catName = String(p.category || "");
      counts[catName] = (counts[catName] || 0) + 1;
    });

    // Support clean lists
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
    <div className="hidden lg:block w-[280px] shrink-0 sticky top-28 bg-white border border-[#E8E1D3] rounded-2.5xl p-6 font-sans text-[#1F4D3A] self-start shadow-sm" id="desktop-filter-sidebar-wrapper">
      {/* Sidebar Header with Reset */}
      <div className="flex items-center justify-between border-b border-[#E8E1D3] pb-4 mb-6">
        <h4 className="font-playfair text-base font-bold tracking-wider uppercase">
          Filters
        </h4>
        {isFiltered && (
          <button
            onClick={onClearFilters}
            className="text-xs text-red-500 hover:text-red-700 underline flex items-center gap-1 font-semibold transition-colors"
          >
            <RefreshCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category section */}
        <div className="space-y-3 pb-5 border-b border-gray-100 text-left">
          <h5 className="text-[11px] font-bold tracking-widest text-[#C9A227] uppercase">
            Formulation Category
          </h5>
          <div className="space-y-2">
            {categoriesList.map((cat) => {
              const isChecked = filters.selectedCategories.includes(cat.name);
              return (
                <label
                  key={cat.name}
                  className="flex items-center justify-between cursor-pointer group text-xs py-1"
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-4-half h-4-half rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-[#1F4D3A] border-[#1F4D3A] text-white"
                          : "border-[#E8E1D3] bg-white text-transparent group-hover:border-[#C9A227]"
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span
                      className={`text-xs transition-colors ${
                        isChecked
                          ? "text-[#1F4D3A] font-extrabold"
                          : "text-[#78716C] font-light"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono font-medium">
                    ({cat.count})
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Custom Price double slider */}
        <div className="space-y-3 pb-5 border-b border-gray-100 text-left">
          <h5 className="text-[11px] font-bold tracking-widest text-[#C9A227] uppercase">
            Price Range (PKR)
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

        {/* Specific Concerns tag pills selector */}
        <div className="space-y-3 pb-5 border-b border-gray-100 text-left">
          <h5 className="text-[11px] font-bold tracking-widest text-[#C9A227] uppercase">
            Target Concern
          </h5>
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {concernsList.map((concern) => {
              const isSelected = filters.selectedConcerns.includes(concern.value);
              return (
                <button
                  key={concern.value}
                  onClick={() => handleConcernToggle(concern.value)}
                  type="button"
                  className={`px-3 py-1.5 text-[10px] font-semibold rounded-full border transition-all uppercase tracking-wider focus:outline-none cursor-pointer ${
                    isSelected
                      ? "bg-[#1F4D3A] text-white border-[#1F4D3A]"
                      : "bg-white text-[#78716C] border-[#E8E1D3] hover:border-[#C9A227] hover:text-[#1F4D3A]"
                  }`}
                >
                  {concern.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Star Rating Section */}
        <div className="space-y-3 pb-5 border-b border-gray-100 text-left">
          <h5 className="text-[11px] font-bold tracking-widest text-[#C9A227] uppercase">
            Reviews & Rating
          </h5>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5].map((starLimit) => {
              const isSelected = filters.minRating === starLimit;
              return (
                <button
                  key={starLimit}
                  onClick={() => handleRatingSelect(starLimit)}
                  type="button"
                  className={`w-full flex items-center space-x-2.5 cursor-pointer text-left py-1 text-xs focus:outline-none group ${
                    isSelected ? "font-bold text-[#1F4D3A]" : "text-[#78716C]"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#1F4D3A] border-[#1F4D3A] text-white"
                        : "border-[#E8E1D3] bg-white group-hover:border-[#C9A227]"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(starLimit) ? "fill-amber-500 text-amber-500" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {starLimit} & Up
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="space-y-3 text-left">
          <h5 className="text-[11px] font-bold tracking-widest text-[#C9A227] uppercase">
            Stock Status
          </h5>
          <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={handleStockToggle}
              className="sr-only"
            />
            <div
              className={`w-4-half h-4-half rounded-md border flex items-center justify-center transition-all ${
                filters.inStockOnly
                  ? "bg-[#1F4D3A] border-[#1F4D3A] text-white"
                  : "border-[#E8E1D3] bg-white hover:border-[#C9A227]"
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-[#78716C] font-light">Show In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};
export default FilterSidebar;
