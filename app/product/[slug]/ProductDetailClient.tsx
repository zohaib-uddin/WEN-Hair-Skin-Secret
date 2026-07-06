"use client";

import React, { useState, useEffect } from "react";
import { Star, Shield, Heart, ShoppingBag, Plus, Minus, Share2, Sparkle, Truck, RotateCcw, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Accordion, AccordionItem } from "../../../components/ui/Accordion";
import { Product } from "../../../src/types";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant("Standard");
    }
  }, [product]);

  const currentPrice = selectedVariant === "50ml" || selectedVariant === "30ml"
    ? product.price - 400
    : selectedVariant === "200ml" || selectedVariant === "500ml" || selectedVariant === "200g"
    ? product.price + 1200
    : product.price;

  const originalPrice = product.originalPrice 
    ? (selectedVariant === "50ml" || selectedVariant === "30ml"
      ? product.originalPrice - 400
      : selectedVariant === "200ml" || selectedVariant === "500ml" || selectedVariant === "200g"
      ? product.originalPrice + 1200
      : product.originalPrice)
    : currentPrice + 450;

  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  const placeholderImages = [
    product.image,
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop"
  ];

  const handleShareClick = () => {
    setCopiedLink(true);
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText?.(window.location.href);
    }
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAddingToCart(false);
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2000);
  };

  return (
    <div className="bg-white text-[#1F4D3A] min-h-screen pt-12 pb-20 font-sans text-left relative selection:bg-[#1F4D3A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Luxury Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-[#78716C] mb-8 uppercase tracking-widest font-semibold" id="luxury-breadcrumbs-next">
          <span className="cursor-pointer hover:text-[#1F4D3A]">Home</span>
          <span>/</span>
          <span className="cursor-pointer hover:text-[#1F4D3A]">Shop</span>
          <span>/</span>
          <span className="text-[#C9A227] font-bold">{product.category ? product.category.toUpperCase() : "HAIR CARE"}</span>
          <span>/</span>
          <span className="text-[#1F4D3A] font-normal">{product.name}</span>
        </div>

        {/* 2-Column Desktop Grid, Stacked Mobile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          
          {/* LEFT COLUMN: Premium Portrait Image Gallery (55% on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Interactive Gallery image */}
            <div 
              onClick={() => setLightboxOpen(true)}
              className="relative aspect-[4/5] bg-gradient-to-b from-[#FAFAF9] to-[#F5F5F4] rounded-2xl overflow-hidden cursor-zoom-in border border-[#F0F0F0] flex items-center justify-center p-8 sm:p-12 group select-none"
              id="luxury-main-pdp-gallery-frame-next"
            >
              <img
                src={placeholderImages[activeThumb] || product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 bg-[#C9A227] text-white text-[9px] font-bold px-3.5 py-1.5 uppercase tracking-widest rounded-full shadow-md flex items-center gap-1 z-10">
                <Sparkle className="w-3 h-3 fill-white" />
                Pure Kashmiri Formulations
              </span>
              
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/90 text-xs tracking-widest font-bold uppercase py-2.5 px-5 rounded-lg shadow-xl text-[#1F4D3A]">
                  Click to Expand
                </span>
              </div>
            </div>

            {/* Thumbnail Strip (Horizontal Scroll / Grid) */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 justify-start">
              {placeholderImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveThumb(idx)}
                  className={`relative aspect-[4/5] w-16 sm:w-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 focus:outline-none bg-[#FAFAF9] p-2 flex items-center justify-center cursor-pointer border-2 ${
                    activeThumb === idx ? "border-[#C9A227] shadow-sm bg-white scale-98" : "border-transparent hover:border-gray-250"
                  }`}
                  aria-label={`View thumbnail ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} View ${idx + 1}`}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Info details (45% on desktop, sticky on scroll) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            
            {/* Header category title, ratings */}
            <div className="space-y-2">
              <span className="text-[#C9A227] text-xs font-bold tracking-[0.25em] uppercase block">
                {product.category ? product.category.toUpperCase() : "HAIR CARE"}
              </span>
              <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-[#1F4D3A] tracking-tight leading-tight">
                {product.name}
              </h1>
              
              {/* Star Rating summary review stars */}
              <div className="flex items-center gap-2 pt-1 border-b border-gray-100 pb-4">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1F4D3A]">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-[#78716C] font-light">({product.reviewCount || 128} Kashmiri Reviews)</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-3xl font-extrabold text-[#1F4D3A] font-sans">
                Rs. {currentPrice.toLocaleString()}
              </span>
              <span className="text-lg text-gray-400 line-through">
                Rs. {originalPrice.toLocaleString()}
              </span>
              <span className="bg-[#1F4D3A]/10 text-[#1F4D3A] font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
                Save {discountPercent}%
              </span>
            </div>

            {/* Short description */}
            <p className="text-sm text-[#78716C] font-light leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector (Size/Volume) */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-[#1F4D3A] uppercase tracking-wider block">
                  Select Formulation Size:
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-3 border rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none cursor-pointer ${
                        selectedVariant === v
                          ? "border-[#C9A227] bg-[#F7F2EA] text-[#1F4D3A] font-bold ring-1 ring-[#C9A227]"
                          : "border-gray-200 text-gray-500 hover:border-[#C9A227]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector Option */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-[#1F4D3A] uppercase tracking-wider block">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden w-32 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 bg-white text-gray-400 hover:bg-[#F7F2EA] hover:text-[#1F4D3A] transition-colors border-none cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="w-12 text-center text-xs font-bold text-[#1F4D3A] outline-none border-x border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 bg-white text-gray-400 hover:bg-[#F7F2EA] hover:text-[#1F4D3A] transition-colors border-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Checkout and Cart Actions Block (HIDDEN on mobile, substituted by sticky bottom bar) */}
            <div className="hidden md:block pt-4 space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-[#1F4D3A] hover:bg-[#C9A227] hover:text-[#1F4D3A] text-white disabled:bg-gray-150 font-bold py-4.5 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none cursor-pointer shadow-md"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding to Bag...</span>
                  </>
                ) : cartSuccess ? (
                  <span>Formulation Added!</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag - Rs. {(currentPrice * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 py-3.5 px-4 text-xs font-bold uppercase tracking-wider border rounded-xl flex items-center justify-center gap-2 transition-all focus:outline-none cursor-pointer ${
                    isWishlisted 
                      ? "bg-red-50 border-red-500 text-red-500"
                      : "border-gray-200 text-gray-400 hover:border-[#C9A227] hover:text-[#1F4D3A]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  <span>{isWishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
                </button>

                <button
                  onClick={handleShareClick}
                  className="py-3.5 px-5 text-xs font-bold uppercase border border-gray-200 rounded-xl hover:border-[#C9A227] text-[#1F4D3A] transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? "Link Copied!" : "Share Secret"}</span>
                </button>
              </div>
            </div>

            {/* Direct Trust Badges */}
            <div className="flex items-center justify-between border-y border-gray-100 py-6 text-[11px] text-[#78716C] tracking-wide font-semibold uppercase gap-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C9A227]" />
                <span>Free Shipping</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#C9A227]" />
                <span>7-Day Returns</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>100% Authentic</span>
              </div>
            </div>

            {/* Luxury Expanding Accordion details blocks */}
            <Accordion>
              <AccordionItem title="Product Details & Science" isOpenByDefault={true}>
                <p className="leading-relaxed mb-3">
                  {product.description}
                </p>
                {product.keyBenefits && product.keyBenefits.length > 0 && (
                  <div className="space-y-1 mt-4">
                    <p className="font-semibold text-[#1F4D3A] uppercase text-[10px] tracking-wider font-sans">Key Claims:</p>
                    <ul className="list-disc list-inside space-y-1 font-light">
                      {product.keyBenefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionItem>
              <AccordionItem title="Transparency Ingredients">
                <p className="font-mono text-xs text-[#C9A227] font-semibold bg-[#F7F2EA]/50 p-4 rounded-lg leading-relaxed border border-[#E8E1D3]">
                  {product.ingredients || "Pure botanical extracts, Distilled Saffron Hydrosol, Hyaluronic acid, Aloe leaf complex, Potassium Sorbate."}
                </p>
              </AccordionItem>
              <AccordionItem title="How To Use (Ritual)">
                <p className="leading-relaxed font-sans italic">
                  {product.howToUse || "Massage gently into roots or skin layers daily before sleeping. Avoid direct chemical formulations during ritual cycles."}
                </p>
              </AccordionItem>
            </Accordion>

          </div>

        </div>

      </div>

      {/* FULL SCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] z-10 overflow-hidden rounded-2xl border border-white/10"
            >
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white text-white hover:text-black py-2.5 px-4 text-xs font-bold tracking-widest uppercase rounded-full transition-all focus:outline-none cursor-pointer border-none shadow-md"
              >
                Close Visual
              </button>
              <img
                src={placeholderImages[activeThumb] || product.image}
                alt={product.name}
                className="w-full h-full max-h-[80vh] object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40 flex items-center justify-between gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Amount</span>
          <span className="text-lg font-extrabold text-[#1F4D3A] font-sans">
            Rs. {(currentPrice * quantity).toLocaleString()}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-1/2 bg-[#1F4D3A] hover:bg-[#C9A227] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors duration-300 flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer border-none shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add To Bag</span>
        </button>
      </div>

    </div>
  );
}
