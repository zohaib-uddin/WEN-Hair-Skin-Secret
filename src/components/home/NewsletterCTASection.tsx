import React, { useState } from "react";
import { motion } from "motion/react";
import { useShop } from "../../context/ShopContext";

export const NewsletterCTASection: React.FC = () => {
  const [email, setEmail] = useState("");
  const { toggleCart } = useShop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with ${email}`);
      setEmail("");
    }
  };

  return (
    <section
      className="bg-[#FAF9F6] py-[40px] md:py-[60px] lg:py-[80px] font-sans"
      id="newsletter-section"
    >
      <div className="max-w-[1280px] mx-auto px-[24px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[600px] mx-auto flex flex-col items-center"
        >
          <div className="w-[40px] h-[2px] bg-[#C9A227] mb-[24px]" />
          <h2 className="font-playfair text-[32px] md:text-[44px] font-bold text-[#1F4D3A] tracking-[-0.01em] mb-[16px]">
            Join the Secret
          </h2>
          <p className="text-[15px] text-gray-500 leading-[1.7] mb-[40px]">
            Subscribe to receive 10% off your first order, exclusive beauty
            tips, and early access to new botanical blends.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-[16px] w-full max-w-[500px]"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 bg-white border border-[#e5e5e5] text-[#1a1a1a] placeholder-gray-400 rounded-xl px-[24px] py-[16px] focus:outline-none focus:border-[#C9A227] transition-all font-sans text-[15px]"
            />
            <button
              type="submit"
              className="bg-[#1F4D3A] text-white font-bold uppercase tracking-[1px] rounded-xl px-[32px] py-[16px] hover:bg-[#C9A227] hover:text-white transition-all outline-none text-[13px]"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
