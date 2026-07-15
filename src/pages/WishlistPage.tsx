import { getSmallestVariant } from "../lib/utils/variant";
import React from "react";
import { useShop } from "../context/ShopContext";
import { Heart, Star, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const WishlistPage: React.FC = () => {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    navigate
  } = useShop();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-gradient-to-b from-[#F4EBDB]/40 to-white min-h-screen pt-[120px] pb-[80px] font-sans">
      <div className="max-w-[1200px] mx-auto px-[24px]">
        
        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-[60px]">
          <span className="text-[#B69355] text-[10px] font-bold tracking-[0.3em] uppercase block mb-[16px]">
            Saved Formulations
          </span>
          <h1 className="font-playfair text-[40px] md:text-[56px] font-bold text-[#254936] tracking-wide mb-[24px]">
            Your Wishlist
          </h1>
          <p className="text-[14px] text-[#63786A] font-light leading-relaxed">
            Curated organic saffron hair oils and niacinamide drops you have noted during catalog inspections. Tap to move them to your bag.
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white border border-[#E0D4BE] rounded-[32px] p-[64px] text-center max-w-[600px] mx-auto shadow-sm">
            <div className="w-[80px] h-[80px] bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-[24px]">
              <Heart className="w-[32px] h-[32px] text-[#B69355]" />
            </div>
            <h3 className="font-playfair text-[24px] font-bold text-[#254936] mb-[12px]">Your wishlist is empty</h3>
            <p className="text-[14px] text-[#63786A] font-light leading-relaxed mb-[32px]">
              Pin items from our Kashmiri best sellers or specific categories to save them here for quick access later.
            </p>
            <button
              onClick={() => navigate('shop')}
              className="bg-[#254936] hover:bg-[#B69355] text-white text-[12px] font-bold px-[32px] py-[16px] rounded-full uppercase tracking-widest transition-colors inline-flex items-center gap-[8px]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-[16px] h-[16px]" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[24px]">
            <AnimatePresence>
              {wishlistedProducts.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-[#E0D4BE] rounded-[24px] overflow-hidden group hover:border-[#254936] transition-all flex flex-col shadow-sm"
                >
                  <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      loading="lazy" 
                    />
                    <div className="absolute top-[16px] right-[16px]">
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="w-[36px] h-[36px] bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#f5f5f5] transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-[16px] h-[16px] text-[#ef4444]" />
                      </button>
                    </div>
                  </div>

                  <div className="p-[20px] flex-1 flex flex-col">
                    <div className="mb-[12px]">
                      <span className="text-[10px] text-[#B69355] font-bold uppercase tracking-wider block mb-[4px]">
                        {p.category}
                      </span>
                      <h3
                        onClick={() => navigate('product', p.id)}
                        className="font-playfair text-[16px] font-bold text-[#254936] hover:text-[#254936] transition-colors cursor-pointer line-clamp-2"
                      >
                        {p.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-[4px] mb-[12px]">
                      <div className="flex text-[#B69355]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-[12px] h-[12px] ${i < Math.floor(p.rating) ? "fill-[#B69355]" : "text-[#E0D4BE]"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[12px] font-bold text-[#254936] ml-[4px]">{p.rating}</span>
                      <span className="text-[12px] text-[#63786A]">({p.reviewCount})</span>
                    </div>

                    <div className="mt-auto pt-[16px] border-t border-[#E0D4BE] flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#254936]">
                        Rs. {(p.price || 0).toLocaleString()}
                      </span>
                      <button
                        onClick={() => addToCart(p, 1, getSmallestVariant(p.variants, p.size))}
                        className="w-[36px] h-[36px] bg-[#254936] hover:bg-[#B69355] text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-md"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-[14px] h-[14px]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
export default WishlistPage;
