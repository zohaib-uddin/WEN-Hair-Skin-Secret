"use client";

import React, { useState, useTransition, useMemo } from "react";
import { ChevronRight, SlidersHorizontal, Grid, List, Search, ArrowRight, Star, RefreshCcw } from "lucide-react";
import { FilterSidebar, FilterState } from "../../components/shop/FilterSidebar";
import { FilterDrawer } from "../../components/shop/FilterDrawer";
import { ProductGrid } from "../../components/shop/ProductGrid";
import { SearchOverlay } from "../../components/search/SearchOverlay";
import { QuickViewModal } from "../../components/product/QuickViewModal";
import { PRODUCTS } from "../../src/lib/constants";

export default function ShopCollectionPage() {
  const [isPending, startTransition] = useTransition();

  // Primary filtering configurations state
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    priceRange: [0, 6000],
    selectedConcerns: [],
    minRating: null,
    inStockOnly: false,
  });

  const [sortOption, setSortOption] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Local state duplication of Cart just to satisfy standalone triggers inside the drawer
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    startTransition(() => {
      setFilters({
        selectedCategories: [],
        priceRange: [0, 6000],
        selectedConcerns: [],
        minRating: null,
        inStockOnly: false,
      });
      setSortOption("recommended");
    });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    // Wrap state update within Transition to trigger smooth grid fade opacity animations
    startTransition(() => {
      setFilters(newFilters);
    });
  };

  // Memoized filtered & sorted formulations pipeline
  const processedProducts = useMemo(() => {
    // 1. Filtering
    let results = PRODUCTS.filter((product) => {
      // Category match
      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(product.category)) {
          return false;
        }
      }

      // Price range match
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Concern match
      if (filters.selectedConcerns.length > 0) {
        if (!filters.selectedConcerns.includes(product.concern)) {
          return false;
        }
      }

      // Rating limit match
      if (filters.minRating !== null) {
        if (product.rating < filters.minRating) {
          return false;
        }
      }

      // In stock status
      if (filters.inStockOnly) {
        // Mock check - all in constants are in stock
        return true;
      }

      return true;
    });

    // 2. Sorting
    if (sortOption === "price-low") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      results.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "newest") {
      // Approximate using name length or secondary logic
      results.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      // "recommended"/best selling
      results.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return results;
  }, [filters, sortOption]);

  const activeBreadcrumbCategory = filters.selectedCategories.length === 1 
    ? filters.selectedCategories[0] 
    : "All Creations";

  return (
    <div className="bg-[#FAF9F6] text-[#1F4D3A] min-h-screen pt-20 pb-24 font-sans selection:bg-[#1F4D3A] selection:text-white">
      {/* Search Header trigger banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Luxury Breadcrumb links */}
        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 text-left">
          <a href="#" className="hover:text-[#C9A227] transition-all">
            Home
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <a href="#" className="hover:text-[#C9A227] transition-all">
            Shop
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-[#C9A227]">{activeBreadcrumbCategory}</span>
        </div>

        {/* Collection details title details */}
        <div className="text-left max-w-4xl space-y-3 mb-10">
          <span className="text-[#C9A227] text-[10px] sm:text-xs font-bold tracking-[0.25em] block uppercase">
            Apothecary Laboratory &bull; Formulations
          </span>
          <h1 className="font-playfair text-4xl lg:text-5xl font-extrabold text-[#1F4D3A] tracking-normal">
            Shop All Formulations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-2xl">
            Meticulously engineered utilizing pure high-mountain Kashmiri saffron threads, bio-active hair peptides, and botanical lipids. Each creation is rebalanced to pH 5.5 to mitigate hard water dryness in Pakistan.
          </p>
        </div>

        {/* Top Toolbar (Sticky dynamic list header controls) */}
        <div className="sticky top-20 z-10 bg-white border border-[#E8E1D3]/50 rounded-2xl px-5 py-4 mb-10 flex items-center justify-between shadow-sm">
          <div className="text-left">
            <p className="text-xs text-gray-400 font-medium">
              Showing <strong className="text-[#1F4D3A] font-extrabold font-mono">{processedProducts.length}</strong> of <strong className="text-[#1F4D3A] font-semibold font-mono">{PRODUCTS.length}</strong> secret formulas
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Icon button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl text-[#1F4D3A] hover:text-[#C9A227] transition-colors focus:outline-none"
              title="Search Formulations"
            >
              <Search className="w-4.5 h-4.5 stroke-[2]" />
            </button>

            {/* Mobile filter Toggle trigger button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-[#E8E1D3] px-3.5 py-2.5 rounded-xl hover:border-[#C9A227] transition-all text-xs font-bold uppercase tracking-wider text-[#1F4D3A] focus:outline-none bg-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C9A227]" />
              Filter & Sort
            </button>

            {/* Sort Dropdown select layout */}
            <div className="relative hidden sm:flex items-center space-x-2 text-xs">
              <span className="text-gray-400 font-medium font-sans">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-[#E8E1D3] text-[#1F4D3A] font-bold px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C9A227] cursor-pointer text-xs"
              >
                <option value="recommended">Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Formulation</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout holding Desktop sidebar on left and Grid listing on right */}
        <div className="flex gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            products={PRODUCTS}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Product Grid listing */}
          <div className={`flex-1 transition-opacity duration-300 ${isPending ? "opacity-30" : "opacity-100"}`}>
            
            {/* Display Active Filters tags if any are enabled */}
            {(filters.selectedCategories.length > 0 ||
              filters.selectedConcerns.length > 0 ||
              filters.minRating !== null ||
              filters.inStockOnly ||
              filters.priceRange[0] > 0 ||
              filters.priceRange[1] < 6000) && (
              <div className="flex flex-wrap items-center gap-2 mb-6 text-left">
                <span className="text-[11px] text-gray-400 font-semibold mr-1">Active Criteria:</span>
                
                {filters.selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E8E1D3] pl-3 pr-2 py-1 rounded-full text-[#1F4D3A] shadow-sm"
                  >
                    {cat}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          ...filters,
                          selectedCategories: filters.selectedCategories.filter((c) => c !== cat),
                        })
                      }
                      className="text-[#C9A227] hover:text-red-500 font-extrabold focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}

                {filters.selectedConcerns.map((con) => (
                  <span
                    key={con}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E8E1D3] pl-3 pr-2 py-1 rounded-full text-[#1F4D3A] shadow-sm"
                  >
                    {con}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          ...filters,
                          selectedConcerns: filters.selectedConcerns.filter((c) => c !== con),
                        })
                      }
                      className="text-[#C9A227] hover:text-red-500 font-extrabold focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}

                {filters.minRating !== null && (
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E8E1D3] pl-3 pr-2 py-1 rounded-full text-[#1F4D3A]"
                  >
                    Rating: {filters.minRating}+ Stars
                    <button
                      onClick={() => handleFilterChange({ ...filters, minRating: null })}
                      className="text-[#C9A227] hover:text-red-500 font-extrabold focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                )}

                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 6000) && (
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-[#E8E1D3] pl-3 pr-2 py-1 rounded-full text-[#1F4D3A]"
                  >
                    Price: Rs. {filters.priceRange[0]} - Rs. {filters.priceRange[1]}
                    <button
                      onClick={() => handleFilterChange({ ...filters, priceRange: [0, 6000] })}
                      className="text-[#C9A227] hover:text-red-500 font-extrabold focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                )}

                <button
                  onClick={handleClearFilters}
                  className="text-[10px] font-bold tracking-widest text-[#C9A227] hover:text-[#1F4D3A] hover:underline uppercase flex items-center gap-1 ml-auto"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Clear Filters
                </button>
              </div>
            )}

            <ProductGrid
              products={processedProducts}
              onAddToCart={(prod) => {
                alert(`Successfully added 1x ${prod.name} to Formulation Bag.`);
              }}
              onQuickView={(p) => setSelectedQuickViewProduct(p)}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onClearFilters={handleClearFilters}
            />
          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        products={PRODUCTS}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Search Overlay dropdown */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={PRODUCTS}
        onProductClick={(id) => {
          const matched = PRODUCTS.find((p) => p.id === id);
          if (matched) setSelectedQuickViewProduct(matched);
        }}
      />

      {/* Quick View modal panel */}
      <QuickViewModal
        isOpen={selectedQuickViewProduct !== null}
        onClose={() => setSelectedQuickViewProduct(null)}
        product={selectedQuickViewProduct}
      />
    </div>
  );
}
