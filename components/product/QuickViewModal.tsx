import React, { useState, useEffect } from "react";
import { Star, X, ShoppingBag, Plus, Minus, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../../src/context/ShopContext";
import { getSmallestVariant } from "../../src/lib/utils/variant";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, product }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigate } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("");

  useEffect(() => {
    if (product) {
      setQuantity(1);
      const variants = product.variants && product.variants.length > 0 ? product.variants : (product.size ? [product.size] : ["100ml"]);
      setSelectedVariant(getSmallestVariant(variants, product.size));
    }
  }, [product]);

  if (!product || !isOpen) return null;

  const currentPrice = product.price || 0;
  const originalPrice = product.originalPrice || currentPrice * 1.19;
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100) || 19;
  const isWishlisted = isInWishlist(product.id);
  const variants = product.variants && product.variants.length > 0 ? product.variants : (product.size ? [product.size] : ["100ml"]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    onClose();
  };

  const handleViewFull = () => {
    onClose();
    navigate(`product/${product.id}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black backdrop-blur-[3px]"
        />

        {/* Modal panel centering */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#F7F2EA] border border-[#E8E1D3] rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col font-sans text-[#1F4D3A]"
          id="quickview-modal-container-next"
        >
          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-[#C9A227] text-white hover:text-white z-20 transition-all duration-300 hover:rotate-90 focus:outline-none backdrop-blur-sm cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 p-6 md:p-10 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
              
              {/* Left hand Image Box */}
              <div className="md:col-span-12 lg:col-span-5 relative aspect-square md:aspect-[4/4.5] bg-[#FAFAF9] border border-[#E8E1D3] rounded-2xl overflow-hidden self-center group cursor-pointer p-6 flex items-center justify-center" onClick={handleViewFull}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 bg-white/90 text-[#1F4D3A] backdrop-blur-sm border border-[#e5e5e5] text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold shadow-sm z-10 flex items-center gap-1">
                    <Sparkles className="w-[10px] h-[10px] fill-[#C9A227] text-[#C9A227]" />
                    Best Seller
                  </span>
                )}
              </div>

              {/* Right hand details and actions */}
              <div className="md:col-span-12 lg:col-span-7 flex flex-col justify-between text-left space-y-5">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#C9A227] uppercase block">
                    {product.category || "Hair Care"}
                  </span>
                  <h2 className="font-playfair text-2.5xl sm:text-3xl font-bold text-[#1F4D3A] leading-tight cursor-pointer hover:text-[#C9A227] transition-colors" onClick={handleViewFull}>
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-amber-500 text-amber-500' : 'text-gray-200 fill-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#1F4D3A]">{product.rating || "5.0"}</span>
                    <span className="text-xs text-gray-400 font-light">({product.reviewCount || "128"} Reviews)</span>
                  </div>

                  <p className="text-sm text-[#78716C] font-light leading-relaxed line-clamp-3">
                    {product.description || "Premium bioactive formula carefully crafted for structural recovery."}
                  </p>
                </div>

                <div className="h-px bg-[#E8E1D3]" />

                {/* Variant selection code */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-[#1F4D3A] uppercase tracking-wider block">
                    Select Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v: string) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        type="button"
                        className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all focus:outline-none cursor-pointer ${
                          selectedVariant === v
                            ? "bg-[#1F4D3A] text-white border-[#C9A227] shadow-sm font-bold active:scale-95"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#C9A227]"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Computational pricing structure */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3.5xl font-extrabold text-[#1F4D3A]">
                    Rs. {currentPrice.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-[#1F4D3A]/10 text-[#1F4D3A] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Save {discountPercent}%
                  </span>
                </div>

                {/* Quantity and Checkout/Add Actions row */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-[#FAFAF9] overflow-hidden max-w-[110px]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      type="button"
                      className="p-3 text-gray-400 hover:bg-[#E8E1D3] hover:text-[#1F4D3A] transition-colors focus:outline-none cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1 text-xs font-bold text-[#1F4D3A]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      type="button"
                      className="p-3 text-gray-400 hover:bg-[#E8E1D3] hover:text-[#1F4D3A] transition-colors focus:outline-none cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Main Add Button */}
                  <button
                    onClick={handleAddToCart}
                    type="button"
                    className="flex-1 bg-[#1F4D3A] hover:bg-[#C9A227] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest transition-all focus:outline-none flex items-center justify-center gap-2 active:scale-95 shadow-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    type="button"
                    className={`p-3 rounded-xl border flex items-center justify-center transition-colors focus:outline-none cursor-pointer ${
                      isWishlisted ? "bg-red-50 border-red-500 text-red-500" : "border-gray-200 text-gray-400 hover:border-[#C9A227]"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500" : ""}`} />
                  </button>
                </div>

                {/* View Full Details anchor link */}
                <div className="text-center sm:text-left pt-2">
                  <button
                    onClick={handleViewFull}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C9A227] font-bold hover:underline tracking-wide uppercase focus:outline-none cursor-pointer border-none bg-transparent"
                  >
                    View Full Details
                    <span className="text-sm font-light">→</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default QuickViewModal;
