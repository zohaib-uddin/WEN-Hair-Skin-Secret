import React from "react";
import { Star, Heart, Eye, ShoppingBag, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  product: any;
  onAddToCart: (product: any, quantity: number, variant: string) => void;
  onQuickView: (product: any) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 19; // Elegant standard discount percentage fallback

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1, product.variants?.[0] || "100ml");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="group bg-white border border-[#E8E1D3]/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C9A227] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full text-left relative cursor-pointer"
      id={`shop-luxury-card-${product.id}`}
      onClick={() => onQuickView(product)}
    >
      {/* Target Image Frame */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Floating Best Seller Badge tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.isBestSeller && (
            <span className="bg-white/90 backdrop-blur-sm border border-[#e5e5e5] text-[#1F4D3A] text-[9px] font-bold tracking-wider px-2 py-1 rounded-md uppercase shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Actions Row (Top right floats) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-full border shadow-sm transition-all focus:outline-none backdrop-blur-md ${
              isWishlisted ? "text-red-500 bg-red-50/80 border-red-200/50" : "bg-white/40 border-white/50 text-[#1F4D3A] hover:bg-white/80 hover:text-[#C9A227]"
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500" : ""}`} />
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 rounded-full border border-white/50 bg-white/40 backdrop-blur-md text-[#1F4D3A] hover:bg-white/80 hover:text-[#C9A227] shadow-sm transition-all focus:outline-none"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover "Quick Add" slider CTA footer for large displays */}
        <div className="absolute bottom-3 left-3 right-3 z-10 hidden md:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            type="button"
            className="w-full bg-[#1F4D3A] hover:bg-[#C9A227] text-white font-bold py-3 px-4 rounded-xl text-[10px] tracking-widest uppercase transition-colors shadow-lg flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1">
          <span className="text-[9px] font-bold tracking-[0.15em] text-[#C9A227] uppercase block">
            {product.category}
          </span>
          <h3 className="font-playfair text-sm sm:text-base font-bold text-[#1F4D3A] leading-tight line-clamp-2 group-hover:text-[#C9A227] transition-colors">
            {product.name}
          </h3>

          {/* Core rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-[#1F4D3A]">{product.rating}</span>
            <span className="text-[9px] text-gray-400 font-light">({product.reviewCount || 112})</span>
          </div>
        </div>

        {/* Static Pricing layout with thin border */}
        <div className="pt-2.5 border-t border-[#E8E1D3]/50 flex items-center justify-between">
          <div className="flex flex-col">
            {product.originalPrice ? (
              <span className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            ) : (
              <span className="text-[10px] text-gray-400 line-through leading-none mb-0.5 opacity-0">
                &nbsp;
              </span>
            )}
            <span className="text-xs sm:text-sm font-extrabold text-[#1F4D3A] leading-none">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>

          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold font-sans">
            In Stock
          </span>
        </div>
      </div>

      {/* Mobile-only interactive action buttons layout */}
      <div className="p-3 pt-0 sm:hidden">
        <button
          onClick={handleQuickAdd}
          type="button"
          className="w-full bg-[#1F4D3A] hover:bg-[#C9A227] text-white font-bold py-2.5 px-4 rounded-xl text-[10px] flex items-center justify-center gap-1.5 uppercase transition-all"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add Bag</span>
        </button>
      </div>

    </motion.div>
  );
};
export default ProductCard;
