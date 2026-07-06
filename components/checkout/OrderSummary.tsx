"use client";

import React, { useState } from "react";
import { useShop } from "../../src/context/ShopContext";
import { ShieldCheck, Truck, Lock, RefreshCcw, Award } from "lucide-react";
import { supabase } from "../../src/lib/supabase/client";

interface OrderSummaryProps {
  isProcessing: boolean;
  shippingOptionCost: number; // passed based on selected shipping option
  onSubmitOrder: (e: React.FormEvent) => void;
  ctaText: string;
  canPlaceOrder?: boolean;
}

export default function OrderSummary({ 
  isProcessing, 
  shippingOptionCost, 
  onSubmitOrder,
  ctaText,
  canPlaceOrder = true
}: OrderSummaryProps) {
  const { cart, directCheckoutItem, appliedCoupon, applyCoupon, removeCoupon } = useShop();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const checkoutCart = directCheckoutItem ? [directCheckoutItem] : cart;

  const subtotal = checkoutCart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  const handleApplyCoupon = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError("");
    setIsApplying(true);
    const result = await applyCoupon(couponCode.trim(), subtotal);
    setIsApplying(false);
    if (result.success) {
      setCouponCode("");
    } else {
      setCouponError(result.error || "Invalid coupon code.");
    }
  };

  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discount_type === 'percentage' 
        ? Math.round(subtotal * (appliedCoupon.discount_value / 100)) 
        : appliedCoupon.discount_value)
    : 0;
  const finalTotal = Math.max(0, subtotal + shippingOptionCost - discountAmount);

  return (
    <div className="bg-white rounded-[16px] border border-[#f0f0f0] p-[32px] space-y-6 shadow-sm sticky top-24 font-sans text-left" id="order-summary-container">
      <div>
        <h3 className="font-playfair text-[24px] font-bold text-[#1F4D3A]">
          Order Summary
        </h3>
        <p className="text-[14px] text-[#6b6b6b] mt-1 font-medium">
          {checkoutCart.length} item{checkoutCart.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Cart Items List */}
      <div className="max-h-[300px] overflow-y-auto divide-y divide-[#f0f0f0] pr-2 -mr-2 space-y-4">
        {checkoutCart.map((item, idx) => (
          <div key={`${item.product.id}-${idx}`} className="flex gap-[16px] pt-4 first:pt-0 items-start">
            <div className="relative w-[80px] h-[80px] flex-shrink-0">
              <div className="w-full h-full bg-gray-50 rounded-[12px] overflow-hidden border border-[#e5e5e5] p-1">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -top-1.5 -right-1.5 bg-[#1a1a1a] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold z-10 shadow-sm">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0 text-left">
              <h4 className="font-medium text-[#1F4D3A] text-[13px] line-clamp-2 leading-tight">
                {item.product.name}
              </h4>
              <p className="text-[12px] text-[#6b6b6b] mt-1">
                Size: {item.selectedVariant || "100ml"}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="font-bold text-[#1F4D3A] text-[14px] block">
                Rs. {(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Vouchers Code Form for Premium Luxury Experience */}
      <div className="pt-[24px] border-t border-[#f0f0f0] space-y-2">
        <div className="flex gap-[8px]">
          <input 
            type="text" 
            placeholder="Promo Code" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={!!appliedCoupon || isApplying}
            className="flex-1 bg-white border border-[#e5e5e5] focus:border-[#1F4D3A] px-[16px] py-[12px] text-[13px] rounded-[12px] focus:outline-none"
          />
          <button 
            onClick={handleApplyCoupon}
            disabled={!!appliedCoupon || !couponCode || isApplying}
            className="px-[24px] py-[12px] bg-white border border-[#e5e5e5] hover:border-[#1F4D3A] text-[#1a1a1a] text-[13px] font-bold rounded-[12px] transition cursor-pointer disabled:opacity-50"
          >
            {isApplying ? "..." : "Apply"}
          </button>
        </div>
        {appliedCoupon && (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3 mt-2">
            <p className="text-emerald-800 text-[12px] font-medium text-left flex items-center gap-1.5 leading-normal">
              Code <strong className="font-bold text-emerald-900">{appliedCoupon.code}</strong> applied
            </p>
            <button
              type="button"
              onClick={removeCoupon}
              className="text-[11px] text-red-600 hover:text-red-800 font-bold uppercase tracking-wider cursor-pointer bg-transparent border-0"
            >
              Remove
            </button>
          </div>
        )}
        {couponError && (
          <p className="text-[12px] text-red-500 font-medium">
            {couponError}
          </p>
        )}
      </div>

      {/* Numerical breakdown calculations */}
      <div className="pt-[24px] border-t border-[#f0f0f0] space-y-[12px] text-[14px]">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-[#6b6b6b]">
          <span>Subtotal</span>
          <span className="font-semibold text-[#1a1a1a]">
            Rs. {subtotal.toLocaleString()}
          </span>
        </div>

        {/* Shipping Option */}
        <div className="flex justify-between items-center text-[#6b6b6b]">
          <span>Shipping</span>
          {shippingOptionCost === 0 ? (
            <span className="text-[#C9A227] font-bold text-[13px]">
              FREE
            </span>
          ) : (
            <span className="font-semibold text-[#1a1a1a]">
              Rs. {shippingOptionCost.toLocaleString()}
            </span>
          )}
        </div>

        {/* Discount Amount */}
        {appliedCoupon && (
          <div className="flex justify-between items-center text-emerald-600 font-semibold">
            <span>Discount ({appliedCoupon.code})</span>
            <span>- Rs. {discountAmount.toLocaleString()}</span>
          </div>
        )}

        {/* Total Price */}
        <div className="pt-[16px] border-t border-[#f0f0f0] flex justify-between items-center">
          <span className="text-[16px] font-bold text-[#1F4D3A]">Total</span>
          <span className="text-[24px] font-bold text-[#1F4D3A]">
            Rs. {finalTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Complete Order Trigger Button */}
      <div className="pt-[16px]">
        <button
          onClick={onSubmitOrder}
          disabled={isProcessing || !canPlaceOrder}
          className={`w-full py-[18px] text-white text-[14px] font-bold uppercase tracking-[1px] rounded-[12px] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 ${
            (!canPlaceOrder) ? "bg-gray-300 cursor-not-allowed opacity-70" : "bg-[#0a0a0a] hover:bg-[#1F4D3A] hover:shadow-lg cursor-pointer"
          }`}
          id="confirm-checkout-panel-btn"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{canPlaceOrder ? "Place Order" : "Continue to Next Step"} - Rs. {finalTotal.toLocaleString()}</span>
            </>
          )}
        </button>
      </div>

      {/* Secure Protection Assurances */}
      <div className="pt-[24px] grid grid-cols-2 gap-[16px] text-left">
        <div className="flex items-center gap-2 text-[12px] text-[#6b6b6b]">
          <Lock className="w-4 h-4 text-[#C9A227]" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#6b6b6b]">
          <Truck className="w-4 h-4 text-[#C9A227]" />
          <span>Free Shipping</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#6b6b6b]">
          <RefreshCcw className="w-4 h-4 text-[#C9A227]" />
          <span>Easy Returns</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#6b6b6b]">
          <Award className="w-4 h-4 text-[#C9A227]" />
          <span>100% Authentic</span>
        </div>
      </div>
    </div>
  );
}
