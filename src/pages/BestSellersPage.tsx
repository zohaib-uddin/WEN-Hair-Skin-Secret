import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ProductCard } from "../components/shop/ProductCard";
import { useShop } from "../context/ShopContext";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Product } from "../types";

export default function BestSellersPage() {
  const { products } = useShop();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Filter out only bestsellers
    if (products && products.length > 0) {
      const best = products.filter((p) => p.isBestSeller === true);
      setBestSellers(best);
    }
  }, [products]);

  return (
    <div className="bg-[#FAF9F6] text-[#1F4D3A] min-h-screen pt-20 pb-24 font-sans selection:bg-[#1F4D3A] selection:text-white">
      <main className="flex-1 w-full flex flex-col">
        {/* Search Header trigger banner equivalent for Best Sellers */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left max-w-4xl space-y-3 mb-16"
          >
            <span className="text-[#C9A227] text-[10px] sm:text-xs font-bold tracking-[0.25em] block uppercase">
              Top Rated Excellence
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl font-extrabold text-[#1F4D3A] leading-tight">
              Best Sellers
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-light max-w-2xl leading-relaxed">
              Discover our most loved, tried, and true natural skincare and hair care products for the best results.
            </p>
          </motion.div>
        </div>

        {/* Product Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {bestSellers.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <ProductCard product={product} pageContext="best-sellers" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-[#757575] font-medium">
              <p>No best sellers found at the moment.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
