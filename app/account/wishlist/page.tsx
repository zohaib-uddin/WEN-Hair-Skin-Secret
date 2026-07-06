"use client";

import React from "react";
import { useShop } from "../../../src/context/ShopContext";
import { Heart, Star, ShoppingCart, Trash2 } from "lucide-react";

export default function AccountWishlistPage() {
  const {
    products,
    wishlist,
    toggleWishlist,
    addToCart,
    navigate
  } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in" id="account-wishlist-view">
      {/* Header Info */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A227] uppercase font-bold block mb-2">
          Exclusive Formula Vault
        </span>
        <h1 className="font-playfair text-3xl font-extrabold text-[#1F4D3A] tracking-wider uppercase">
          Your Wishlist Secrets
        </h1>
        <p className="text-xs text-gray-500 font-light mt-1 max-w-2xl leading-relaxed">
          The natural ingredients recipes, hair growth elixirs, and clinical skincare serums you have noted during catalog inspections.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        /* Empty State with large Heart Icon */
        <div className="py-16 text-center max-w-sm mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-[#F7F2EA] rounded-full text-[#1F4D3A] flex items-center justify-center mb-6 border border-[#E8E1D3]">
            <Heart className="w-8 h-8 text-[#C9A227] opacity-60 fill-[#C9A227]/10" />
          </div>
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#1F4D3A]">Your wishlist is empty.</h3>
            <p className="text-xs text-gray-400 font-light leading-relaxed mt-2">
              Save your favorite items here for later to easily move them to your shopping cart.
            </p>
          </div>
          <button
            onClick={() => {
              navigate("shop");
              // Fallback routing handle for Next router
              window.location.href = "/shop";
            }}
            className="mt-6 bg-[#1F4D3A] hover:bg-[#153427] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        /* Product Grid matching shop styles */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="group border border-gray-100 rounded-2xl p-4 bg-white hover:border-[#1F4D3A]/30 transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
              id={`wishlist-card-${product.id}`}
            >
              {/* Image box */}
              <div className="relative aspect-square w-full bg-[#F7F2EA]/20 rounded-xl overflow-hidden border border-gray-50 mb-3.5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-rose-500 hover:scale-105 shadow-sm transition-all border border-gray-100 hover:bg-white"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Info Detail */}
              <div className="text-left flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-[#C9A227] font-bold uppercase tracking-widest block mb-1">
                    {product.category}
                  </span>
                  <h3
                    onClick={() => {
                      navigate("product", product.id);
                      window.location.href = `/product?id=${product.id}`;
                    }}
                    className="font-playfair text-sm font-bold text-gray-900 hover:text-[#1F4D3A] transition-colors cursor-pointer line-clamp-1 mb-1"
                  >
                    {product.name}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 leading-none">{product.rating}</span>
                  </div>

                  <p className="text-[11px] text-gray-400 font-light leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Pricing & Add call */}
                <div className="pt-3.5 mt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1F4D3A]">Rs. {product.price.toLocaleString()}</span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigate("product", product.id);
                        window.location.href = `/product?id=${product.id}`;
                      }}
                      className="border border-[#1F4D3A] text-[#1F4D3A] text-[9px] font-bold px-3 py-2 hover:bg-[#1F4D3A]/5 transition-colors rounded-lg uppercase tracking-wider"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => addToCart(product, 1, product.variants[0] || "100ml")}
                      className="bg-[#1F4D3A] hover:bg-[#153427] text-white text-[9px] font-bold px-3 py-2 transition-colors rounded-lg uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3 h-3 text-[#C9A227]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
