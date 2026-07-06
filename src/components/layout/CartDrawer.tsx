import { getSmallestVariant } from "../../lib/utils/variant";
import React, { useState } from "react";
import { useShop } from "../../context/ShopContext";
import { X, Trash2, ArrowRight, Minus, Plus, Sparkles, Tag, ShoppingBag, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQuantity,
    removeFromCart,
    products,
    addToCart,
    navigate,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useShop();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Defensively filter cart to ignore any null/undefined or corrupted objects
  const safeCart = Array.isArray(cart) ? cart.filter(item => item && item.product && item.product.id) : [];

  const subtotal = safeCart.reduce((acc, item) => acc + (item.product.price || 0) * (item.quantity || 1), 0);
  const shippingThreshold = Number(localStorage.getItem("wen_setting_free_delivery") || "2000");
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 250);
  
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discount_type === 'percentage' 
        ? Math.round(subtotal * (appliedCoupon.discount_value / 100)) 
        : appliedCoupon.discount_value)
    : 0;
  const estimatedTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoError("");
    setIsApplying(true);
    const result = await applyCoupon(promoCode.trim(), subtotal);
    setIsApplying(false);
    if (result.success) {
      setPromoCode("");
    } else {
      setPromoError(result.error || "Invalid coupon code.");
    }
  };

  // Recommendations
  const cartProductIds = safeCart.map(item => item.product.id);
  const upsellProducts = Array.isArray(products)
    ? products
        .filter(p => p && p.id && !cartProductIds.includes(p.id))
        .slice(0, 2)
    : [];

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black z-[9999] backdrop-blur-sm"
            id="cart-drawer-backdrop-overlay"
          />

          {/* Cart drawer panel sliding from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 bottom-0 right-0 w-[85vw] sm:w-[480px] bg-white shadow-2xl z-[9999] flex flex-col font-sans text-[#1a1a1a]"
            id="cart-drawer-card-container"
          >
            {/* Drawer Header */}
            <div className="p-[10px] md:p-[24px] border-b border-[#f0f0f0] flex items-center justify-between">
              <h3 className="font-playfair text-[12px] md:text-[24px] font-semibold text-[#1F4D3A]">
                Cart ({safeCart.reduce((acc, item) => acc + item.quantity, 0)})
              </h3>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-full hover:bg-[#f5f5f5] text-[#6b6b6b] hover:text-[#1F4D3A] transition-all hover:rotate-90 duration-300 focus:outline-none cursor-pointer"
                aria-label="Close formulations bag"
              >
                <X className="w-[12px] md:w-[24px] h-[12px] md:h-[24px]" />
              </button>
            </div>

            {/* Free Shipping Alert banner with classy progress bar */}
            {safeCart.length > 0 && (
              <div className="bg-[#F7F2EA] px-[16px] md:px-[24px] py-[12px] md:py-[16px]">
                {isFreeShipping ? (
                  <p className="text-[#1a1a1a] text-[10px] md:text-[12px] text-center font-medium">
                    You qualify for <strong className="text-[#C9A227]">FREE shipping</strong>!
                  </p>
                ) : (
                  <div className="space-y-[8px]">
                    <p className="text-[#1a1a1a] text-[10px] md:text-[12px] text-center">
                      Add Rs. {((shippingThreshold || 0) - (subtotal || 0)).toLocaleString()} more for FREE shipping!
                    </p>
                    <div className="w-full bg-gray-200 h-[4px] rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#C9A227] to-[#e1bd45] h-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main scrollable formulations list */}
            <div className="flex-1 overflow-y-auto p-[24px] space-y-0 scrollbar-thin max-h-[calc(100vh-300px)]">
              {safeCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-[60px] px-[24px]">
                  <ShoppingBag className="w-[64px] h-[64px] text-gray-300 mb-[16px]" />
                  <h4 className="font-semibold text-[20px] text-[#1F4D3A] mb-[8px]">Your cart is empty</h4>
                  <p className="text-[14px] text-[#6b6b6b] mb-[24px]">
                    Add some products to get started
                  </p>
                  <button
                    onClick={() => { setCartOpen(false); navigate('shop'); }}
                    className="bg-[#C9A227] hover:bg-[#b08d20] text-[#1F4D3A] text-[14px] font-bold px-[32px] py-[14px] rounded-[12px] transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-0">
                  {safeCart.map((item, index) => (
                    <div key={`${item.product.id}-${item.selectedVariant}`} className="flex flex-row py-[10px] md:py-[16px] border-b border-[#e5e5e5] gap-[10px] md:gap-[16px] items-start">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-[40px] md:w-[80px] h-[40px] md:h-[80px] object-cover rounded-[8px] md:rounded-[12px] bg-[#f5f5f5] flex-shrink-0"
                        referrerPolicy="no-referrer"
                      loading="lazy" />
                      <div className="flex-1 text-left flex flex-col">
                        <div className="flex justify-between items-start gap-1 md:gap-2">
                          <h4 className="text-[10px] md:text-[14px] font-medium text-[#1F4D3A] line-clamp-2 leading-tight">{item.product.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                            className="text-[#757575] hover:text-red-500 transition-colors p-1 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-[12px] md:w-[16px] h-[12px] md:h-[16px]" />
                          </button>
                        </div>
                        
                        <div className="text-[8px] md:text-[12px] text-[#6b6b6b] mt-[2px] md:mt-[4px]">
                          Size: {item.selectedVariant}
                        </div>
                        
                        <div className="flex items-center justify-between mt-[4px] md:mt-[8px]">
                          <span className="text-[10px] md:text-[14px] font-bold text-[#1F4D3A]">
                            Rs. {(item.product.price || 0).toLocaleString()}
                          </span>
                          
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-[#e5e5e5] rounded-[6px] md:rounded-[8px] bg-white w-[50px] md:w-[80px]">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedVariant, item.quantity - 1)}
                              className="w-1/3 py-1 flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-[8px] md:w-[10px] h-[8px] md:h-[10px]" />
                            </button>
                            <span className="w-1/3 text-[10px] md:text-[12px] font-medium text-[#1a1a1a] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedVariant, item.quantity + 1)}
                              className="w-1/3 py-1 flex items-center justify-center text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-[8px] md:w-[10px] h-[8px] md:h-[10px]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic Upsell Suggestions inside Sidebar */}
              {safeCart.length > 0 && upsellProducts.length > 0 && (
                <div className="pt-[24px] border-t border-[#e5e5e5] mt-[24px]">
                  <h5 className="text-[12px] font-bold text-[#1F4D3A] uppercase tracking-[1px] mb-[16px]">
                    Pair With
                  </h5>
                  <div className="space-y-[16px]">
                    {upsellProducts.map((p) => (
                      <div key={p.id} className="flex items-center gap-[12px]">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-[60px] h-[60px] object-cover rounded-[8px] border border-[#e5e5e5] bg-[#f5f5f5] flex-shrink-0"
                          referrerPolicy="no-referrer"
                        loading="lazy" />
                        <div className="flex-1 text-left flex flex-col">
                          <h6 className="text-[13px] font-medium text-[#1F4D3A] line-clamp-1">{p.name}</h6>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[13px] font-bold text-[#1F4D3A]">Rs. {(p.price || 0).toLocaleString()}</span>
                            <button
                              onClick={() => addToCart(p, 1, getSmallestVariant(p.variants, p.size))}
                              className="text-[11px] font-bold text-white bg-[#0a0a0a] hover:bg-[#1F4D3A] px-[12px] py-[6px] rounded-[6px] uppercase tracking-[0.5px] transition-colors cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky checkout footer details */}
            {safeCart.length > 0 && (
              <div className="p-[12px] md:p-[24px] border-t border-[#f0f0f0] bg-white sticky bottom-0" id="cart-drawer-checkout-footer">

                {/* Coupon Code Section */}
                <div className="mb-[10px] md:mb-[16px] pb-[10px] md:pb-[16px] border-b border-[#f0f0f0]">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-2 md:px-4 py-1.5 md:py-2 border border-[#e5e5e5] rounded-[6px] md:rounded-[8px] text-[11px] md:text-[13px] outline-none focus:border-[#C9A227]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !promoCode.trim()}
                      className="bg-[#1F4D3A] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-[6px] md:rounded-[8px] text-[11px] md:text-[13px] font-bold uppercase tracking-wider disabled:bg-gray-300 transition-colors cursor-pointer"
                    >
                      {isApplying ? "..." : "Apply"}
                    </button>
                  </form>
                  {promoError && <p className="text-red-500 text-[10px] md:text-[11px] mt-1 md:mt-2">{promoError}</p>}
                  {appliedCoupon && (
                    <div className="flex justify-between items-center mt-2 md:mt-3 bg-[#F7F2EA] px-2 md:px-3 py-1.5 md:py-2 rounded-[6px] md:rounded-[8px]">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Tag className="w-3 md:w-4 h-3 md:h-4 text-[#C9A227]" />
                        <span className="text-[10px] md:text-[12px] font-bold text-[#1F4D3A] uppercase">{appliedCoupon.code}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-[10px] md:text-[12px] text-red-500 hover:underline cursor-pointer">Remove</button>
                    </div>
                  )}
                </div>

                {/* Computational breakdowns */}
                <div className="flex justify-between items-center mb-[4px] md:mb-[8px]">
                  <span className="text-[12px] md:text-[14px] text-[#6b6b6b]">Subtotal</span>
                  <span className="text-[14px] md:text-[20px] font-bold text-[#1F4D3A]">Rs. {(subtotal || 0).toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center mb-[4px] md:mb-[8px]">
                    <span className="text-[12px] md:text-[14px] text-[#6b6b6b]">Discount</span>
                    <span className="text-[12px] md:text-[16px] font-bold text-[#1F4D3A]">-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between items-center mb-[4px] md:mb-[8px]">
                    <span className="text-[12px] md:text-[14px] text-[#6b6b6b]">Shipping</span>
                    <span className="text-[12px] md:text-[16px] font-bold text-[#1F4D3A]">Rs. {shippingCost.toLocaleString()}</span>
                  </div>
                )}
                { (appliedCoupon || shippingCost > 0) && (
                  <div className="flex justify-between items-center mb-[4px] md:mb-[8px] pt-1 md:pt-2 border-t border-[#f0f0f0]">
                    <span className="text-[12px] md:text-[14px] font-bold text-[#1a1a1a]">Total</span>
                    <span className="text-[16px] md:text-[20px] font-bold text-[#C9A227]">Rs. {estimatedTotal.toLocaleString()}</span>
                  </div>
                )}
                
                <p className="text-[9px] md:text-[11px] text-[#6b6b6b] mb-[10px] md:mb-[16px]">Taxes and shipping calculated at checkout</p>

                {/* Checkout Trigger Action button */}
                <button
                  onClick={() => {
                    setCartOpen(false);
                    navigate('checkout');
                  }}
                  className="w-full bg-[#0a0a0a] hover:bg-[#1F4D3A] text-white font-bold text-[12px] md:text-[14px] tracking-[1px] uppercase py-[12px] md:py-[18px] rounded-[8px] md:rounded-[12px] transition-all duration-300 focus:outline-none flex items-center justify-center cursor-pointer mb-[8px] md:mb-[12px]"
                  id="checkout-trigger-btn"
                >
                  Checkout
                </button>
                <div className="text-center">
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="text-[11px] md:text-[13px] text-[#C9A227] font-medium hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
