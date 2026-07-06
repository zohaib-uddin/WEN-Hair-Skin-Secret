import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const WhatsAppCTASection: React.FC = () => {
  const handleWhatsAppChat = () => {
    // Open a direct WhatsApp link with prefilled consultation text
    const phoneNumber = "923001234567";
    const text = encodeURIComponent(
      "Asalam-o-Alaikum Wen, I want a free personalized Ayurvedic skin & hair consultation regarding my concerns.",
    );
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  return (
    <section className="py-24 bg-[#0A0D0B] text-center border-b border-[#1E2B24] relative overflow-hidden">
      {/* Abstract dark green luxury ambient backdrops */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1F4D3A]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1F4D3A] to-[#122F24] p-10 sm:p-16 rounded-3xl border border-[#C9A227]/30 shadow-2xl relative"
        >
          {/* Subtle gold decoration leaves in background */}
          <div className="absolute top-4 right-4 text-[#C9A227]/10 pointer-events-none">
            <Sparkles className="w-16 h-16 stroke-[1]" />
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full text-white mb-2 shadow-inner">
              <MessageCircle className="w-8 h-8 fill-white/10 text-white stroke-[1.5]" />
            </div>

            <h2 className="font-playfair text-3xl sm:text-4.5xl font-bold text-white tracking-wide leading-tight">
              Not sure which formulation is right for you?
            </h2>

            <p className="text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-xl mx-auto font-sans">
              Chat directly with our certified clinical Ayurvedic practitioners
              on WhatsApp. Share your skin textures, hair fall levels, or city
              residence to receive custom treatment cards.
            </p>

            <div className="pt-4">
              <button
                onClick={handleWhatsAppChat}
                className="bg-white hover:bg-[#C9A227] text-[#1F4D3A] hover:text-white font-bold text-sm sm:text-base px-10 py-4 rounded-full shadow-xl transition-all inline-flex items-center gap-3 hover:scale-105 active:scale-95 outline-none"
              >
                {/* Custom Inline SVG for WhatsApp Logo for high-fidelity conversion */}
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.11 1.453 4.837 1.455 5.51 0 9.995-4.485 9.998-10.001.002-2.673-1.033-5.187-2.914-7.07C16.643 1.654 14.135.618 11.465.618 5.952.618 1.468 5.103 1.465 10.619c-.001 1.83.479 3.619 1.392 5.197L1.898 22.1l6.326-1.658c1.513.824 3.033 1.258 4.423 1.258z" />
                </svg>
                <span>Free WhatsApp Consultation</span>
              </button>
            </div>

            <p className="text-white/60 text-xs font-mono tracking-widest pt-1">
              Usually responds in under 5 minutes &bull; 100% Free
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatsAppCTASection;
