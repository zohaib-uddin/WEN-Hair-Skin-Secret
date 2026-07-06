import React, { useState } from "react";
import { X, Trash2, ArrowRight, Minus, Plus, Sparkles, Tag, ShoppingBag, Gift } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Standard standalone parameters for Next.js PDP alignment
export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (promoCode.trim().toUpperCase() === "WENSECRET10") {
      setDiscountApplied(true);
      setDiscountPercentage(10);
    } else {
      setPromoError("Invalid code. Try WENSECRET10");
    }
  };

  const itemPrice = 1299;
  const subtotal = itemPrice * quantity;
  const shippingThreshold = 2000;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 250);
  
  const discountAmount = discountApplied ? Math.round((subtotal * discountPercentage) / 100) : 0;
  const estimatedTotal = subtotal + shippingCost - discountAmount;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-[3px]"
            id="cart-drawer-backdrop-overlay-next"
          />

          {/* Cart drawer panel sliding from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-[#F7F2EA] border-l border-[#E8E1D3] shadow-2xl z-50 flex flex-col font-sans text-[#1F4D3A]"
            id="cart-drawer-card-container-next"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E8E1D3] flex items-center justify-between bg-white">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="w-5 h-5 text-[#C9A227]" />
                <h3 className="font-playfair text-base sm:text-lg font-bold text-[#1F4D3A] tracking-wider uppercase">
                  Your Formulation Bag (1)
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#78716C] hover:text-[#1F4D3A] transition-all hover:rotate-90 duration-300 focus:outline-none"
                aria-label="Close formulations bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Alert banner with classy progress bar */}
            <div className="bg-white px-6 py-4.5 border-b border-[#E8E1D3] space-y-3">
              {isFreeShipping ? (
                <p className="text-[#1F4D3A] text-xs font-bold text-center flex items-center justify-center gap-1.5 font-sans">
                  <Gift className="w-4 h-4 text-[#C9A227] animate-bounce" />
                  <span>Pure Secret: You qualify for <strong className="text-[#C9A227]">FREE Courier Delivery</strong>!</span>
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-[#78716C] text-xs text-center font-normal">
                    Add <strong className="text-[#1F4D3A] font-bold font-sans">Rs. {(shippingThreshold - subtotal).toLocaleString()}</strong> more to unlock FREE courier shipping
                  </p>
                  <div className="w-full bg-[#E8E1D3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#1F4D3A] to-[#C9A227] h-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Main scrollable formulations list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              <div className="space-y-4">
                <div className="flex items-start md:items-center bg-white border border-[#E8E1D3] rounded-2xl p-4 gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src="https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=800&auto=format&fit=crop"
                    alt="Saffron secret Product"
                    className="w-16 h-20 md:w-20 md:h-20 object-cover rounded-xl border border-gray-100 flex-shrink-0 bg-gray-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-left space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-[#1F4D3A] line-clamp-1 font-sans">Kashmiri Saffron Hydrating Serum</h4>
                      <button
                        onClick={() => setQuantity(0)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-[#C9A227] bg-[#F7F2EA] px-2 py-1 rounded-md uppercase font-sans">
                        100ml
                      </span>
                      <span className="text-xs text-gray-400 font-light">
                        Rs. {itemPrice.toLocaleString()} each
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E8E1D3] rounded-lg bg-[#F7F2EA] overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-1 px-2.5 text-[#1F4D3A] hover:bg-[#E8E1D3] transition-colors focus:outline-none"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1 text-xs font-bold text-[#1F4D3A] min-w-[18px] text-center font-sans">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-1 px-2.5 text-[#1F4D3A] hover:bg-[#E8E1D3] transition-colors focus:outline-none"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {/* Item Subtotal Price */}
                      <span className="text-sm font-extrabold text-[#1F4D3A] font-sans">
                        Rs. {(itemPrice * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Upsell Suggestions inside Sidebar */}
              <div className="pt-6 border-t border-[#E8E1D3] space-y-4 text-left">
                <h5 className="text-[10px] font-bold tracking-[0.2em] text-[#C9A227] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse stroke-[1.5]" /> Pair With (Bio-Active Secrets)
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center p-3.5 bg-white border border-[#E8E1D3] rounded-2xl shadow-sm hover:shadow transition-shadow">
                    <img
                      src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop"
                      alt="Recommended hair formulation"
                      className="w-12 h-14 object-cover rounded-lg border border-gray-100 mr-3.5 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 text-left space-y-1">
                      <h6 className="text-[11px] font-bold text-[#1F4D3A] line-clamp-1 font-sans">Bio-Shampoo with Rosemary Oil</h6>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#C9A227] font-sans">Rs. 1,890</span>
                        <button
                          className="text-[9px] font-bold bg-[#1F4D3A] text-white px-3 py-1.5 hover:bg-[#C9A227] transition-colors rounded-lg uppercase tracking-widest focus:outline-none"
                        >
                          + Add Bag
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky checkout footer details */}
            {quantity > 0 && (
              <div className="p-6 border-t border-[#E8E1D3] bg-white space-y-4">
                {/* Promo Codes */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo Code: WENSECRET10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={discountApplied}
                      className="w-full bg-[#FAFAF9] text-xs pl-9 pr-3 py-3 rounded-xl border border-[#E8E1D3] text-[#1F4D3A] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A227] disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={discountApplied || !promoCode}
                    className="bg-[#1F4D3A] hover:bg-[#C9A227] text-white font-bold text-xs px-5 py-2 transition-colors rounded-xl uppercase tracking-widest disabled:opacity-40 focus:outline-none"
                  >
                    Apply
                  </button>
                </form>

                {promoError && <p className="text-red-500 text-[10px] text-left font-semibold">{promoError}</p>}
                {discountApplied && (
                  <p className="text-emerald-700 text-[11px] font-medium text-left flex items-center gap-1 leading-normal">
                    🎉 Secret applied! <strong>10% Off Saffron elements</strong> activated.
                  </p>
                )}

                {/* Computational breakdowns */}
                <div className="space-y-2 text-xs text-[#78716C]">
                  <div className="flex justify-between font-normal">
                    <span>Subtotal:</span>
                    <span className="font-sans text-[#1F4D3A] font-bold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount (10%):</span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-normal">
                    <span>Shipping Courier:</span>
                    <span className="font-sans text-[#1F4D3A] font-bold">{shippingCost === 0 ? "FREE" : `Rs. ${shippingCost}`}</span>
                  </div>
                  <div className="h-px bg-[#E8E1D3] my-2" />
                  <div className="flex justify-between text-base font-extrabold text-[#1F4D3A]">
                    <span>Estimated Total:</span>
                    <span className="text-[#C9A227]">Rs. {estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Trigger Action button */}
                <button
                  onClick={onClose}
                  className="w-full bg-[#1F4D3A] hover:bg-[#C9A227] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all duration-300 focus:outline-none flex items-center justify-center space-x-2 shadow-md active:scale-95 hover:shadow-lg"
                  id="checkout-trigger-btn-next"
                >
                  <span>Proceed to COD Checkout</span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>
                <div className="text-center">
                  <span className="text-[10px] text-[#78716C] font-normal">🛡️ Cash on Delivery available across Pakistan</span>
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
