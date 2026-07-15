import React from "react";
import { Heart, Star, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { getSmallestVariant } from "../../lib/utils/variant";

interface WishlistTabProps {
  products: any[];
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  addToCart: (product: any, quantity: number, variant: string) => void;
  onNavigateShop: () => void;
  onNavigateProduct: (id: string) => void;
}

export const WishlistTab: React.FC<WishlistTabProps> = ({
  products,
  wishlist,
  toggleWishlist,
  addToCart,
  onNavigateShop,
  onNavigateProduct,
}) => {
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-[24px] md:space-y-[32px] font-sans"
    >
      <div>
        <h2 className="font-playfair text-[24px] md:text-[32px] font-bold text-[#254936] mb-[4px] md:mb-[8px]">
          Your Wishlist
        </h2>
        <p className="text-[14px] md:text-[15px] text-[#63786A]">
          Items you've saved for later.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-[60px] md:py-[80px] text-center bg-white rounded-[16px] md:rounded-[20px] border-2 border-dashed border-[#E0D4BE] px-[16px]">
          <div className="w-[48px] md:w-[64px] h-[48px] md:h-[64px] bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-[16px] md:mb-[24px]">
            <Heart className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] text-[#63786A]" />
          </div>
          <h3 className="font-playfair text-[20px] md:text-[24px] font-bold text-[#254936] mb-[8px]">
            Wishlist is Empty
          </h3>
          <p className="text-[14px] md:text-[15px] text-[#63786A] mb-[16px] md:mb-[24px]">
            You haven't saved any items yet.
          </p>
          <button
            onClick={onNavigateShop}
            className="px-[20px] md:px-[24px] py-[10px] md:py-[12px] bg-[#254936] hover:bg-[#254936] text-white text-[12px] md:text-[14px] font-bold uppercase tracking-wider rounded-lg md:rounded-xl transition-colors cursor-pointer"
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[24px]">
          {wishlistedProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border-2 border-[#E0D4BE] rounded-[16px] md:rounded-[20px] p-[12px] md:p-[16px] flex flex-col justify-between hover:border-[#254936] hover:shadow-md transition-all group"
            >
              {/* Image */}
              <div className="relative aspect-square w-full bg-[#f5f5f5] rounded-xl overflow-hidden mb-[12px] md:mb-[16px]">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-[8px] md:top-[12px] right-[8px] md:right-[12px] w-[28px] md:w-[32px] h-[28px] md:h-[32px] bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-50 shadow-sm transition-all border border-[#E0D4BE]"
                >
                  <Trash2 className="w-[14px] md:w-[16px] h-[14px] md:h-[16px]" />
                </button>
              </div>

              {/* Details */}
              <div className="text-left space-y-[6px] md:space-y-[8px] flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] md:text-[11px] text-[#B69355] font-bold uppercase tracking-wider">
                    {p.category}
                  </span>
                  <h3
                    onClick={() => onNavigateProduct(p.id)}
                    className="font-playfair text-[15px] md:text-[16px] font-bold text-[#254936] hover:text-[#254936] transition-colors cursor-pointer line-clamp-1 mt-[2px] md:mt-[4px]"
                  >
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-[4px] py-[2px] md:py-[4px]">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-[10px] md:w-[12px] h-[10px] md:h-[12px] ${
                            i < Math.floor(p.rating)
                              ? "fill-amber-400"
                              : "text-[#E0D4BE]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] md:text-[12px] font-bold text-[#254936]">
                      {p.rating}
                    </span>
                  </div>
                </div>

                <div className="pt-[12px] md:pt-[16px] border-t border-[#E0D4BE] flex items-center justify-between mt-[12px] md:mt-[16px]">
                  <span className="font-bold text-[15px] md:text-[16px] text-[#254936]">
                    Rs. {(p.price || 0).toLocaleString()}
                  </span>
                  <button
                    onClick={() =>
                      addToCart(
                        p,
                        1,
                        getSmallestVariant(p.variants, p.size)
                      )
                    }
                    className="w-[36px] h-[36px] bg-[#254936] hover:bg-[#254936] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                  >
                    <ShoppingCart className="w-[16px] h-[16px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
