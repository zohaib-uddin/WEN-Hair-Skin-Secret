import React, { useState, useEffect } from "react";
import { Sparkles, Search, RefreshCcw } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: any[];
  onAddToCart: (product: any, quantity: number, variant: string) => void;
  onQuickView: (product: any) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onClearFilters: () => void;
  cols?: 3 | 4;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
  onClearFilters,
  cols = 3,
}) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset pagination if products query changes
  useEffect(() => {
    setVisibleCount(8);
  }, [products]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 850); // Fluid luxury delay mimicking clinical research load
  };

  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = products.length > visibleCount;

  // Render Skeletons Loader helper
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="animate-pulse bg-white border border-[#E8E1D3]/50 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full text-left"
      >
        <div className="bg-gray-100 aspect-[4/5] w-full" />
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="h-2.5 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="pt-3 border-t border-[#E8E1D3]/30 flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/6" />
          </div>
        </div>
      </div>
    ));
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-[#E8E1D3] rounded-2.5xl bg-[#F7F2EA]/20 text-center max-w-lg mx-auto" id="shop-empty-search-state shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#1F4D3A]/5 flex items-center justify-center text-[#1F4D3A] mb-5">
          <Search className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h4 className="font-playfair text-xl font-bold text-[#1F4D3A] mb-1.5">No secret formulations found</h4>
        <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mb-6">
          We couldn&apos;t find any laboratory creations matching your active filter criteria. Try adjusting your selections or resetting.
        </p>
        <button
          onClick={onClearFilters}
          className="bg-[#1F4D3A] hover:bg-[#C9A227] text-white text-xs font-bold px-5 py-3 rounded-xl tracking-widest uppercase transition-colors flex items-center justify-center gap-2 focus:outline-none"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Clear All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col" id="shop-product-grid-section-container">
      {/* Responsive columns: configuration maps 3 columns vs 4 columns */}
      <div
        className={`grid grid-cols-2 md:grid-cols-2 ${
          cols === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3"
        } gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-10`}
      >
        {displayedProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            isWishlisted={wishlist.includes(p.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}

        {/* Append Loader skeletons inline if loading */}
        {isLoadingMore && renderSkeletons()}
      </div>

      {/* Pagination load more triggers centered layout */}
      {hasMore && !isLoadingMore && (
        <div className="mt-16 mb-16 flex justify-center items-center">
          <button
            onClick={handleLoadMore}
            className="border border-[#1F4D3A] hover:bg-[#1F4D3A] text-[#1F4D3A] hover:text-white font-bold text-xs tracking-[0.2em] uppercase px-8 py-4 transition-all duration-300 rounded-xl focus:outline-none flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95"
          >
            Load More Formulations
            <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>
        </div>
      )}
    </div>
  );
};
export default ProductGrid;
