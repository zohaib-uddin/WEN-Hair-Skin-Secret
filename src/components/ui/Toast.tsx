import React, { useEffect, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../../context/ShopContext";

export const Toast: React.FC = () => {
  const { toast } = useShop();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast?.show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [toast]);

  return (
    <AnimatePresence>
      {isVisible && toast && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-20 right-4 md:right-8 z-[10000] w-auto max-w-[300px] md:max-w-sm md:min-w-[320px] bg-white border border-[#E8E1D3] rounded-xl shadow-2xl overflow-hidden font-sans border-l-4 ${
            toast.type === "error" ? "border-l-rose-500" : "border-l-[#1F4D3A]"
          }`}
          id="global-toast-luxury-notification"
        >
          <div className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
            {toast.productImage ? (
              <img
                src={toast.productImage}
                alt={toast.productName || "Product"}
                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border border-[#E8E1D3]"
                referrerPolicy="no-referrer"
              loading="lazy" />
            ) : (
              <div className={`size-8 md:size-10 rounded-full flex items-center justify-center ${
                toast.type === "error" ? "bg-rose-50 text-rose-600" : "bg-[#1F4D3A]/10 text-[#1F4D3A]"
              }`}>
                {toast.type === "error" ? (
                  <X className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
              </div>
            )}

            <div className="flex-1 text-left">
              <span className={`text-[10px] font-bold tracking-[0.15em] block uppercase mb-0.5 ${
                toast.type === "error" ? "text-rose-500" : "text-[#C9A227]"
              }`}>
                {toast.type === "error" ? "System Alert" : toast.productName ? "Cart Updated" : "Notification"}
              </span>
              <p className="text-[11px] md:text-xs font-semibold text-[#1F4D3A]">
                {toast.message}
              </p>
              {toast.productName && (
                <p className="text-[10px] md:text-[11px] text-[#78716C] line-clamp-1 mt-0.5 font-light">
                  {toast.productName}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-[#78716C] hover:text-[#1F4D3A] transition-colors p-1"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Progress Timer bar animation */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 4, ease: "linear" }}
            className={`h-1 w-full ${
              toast.type === "error" 
                ? "bg-rose-500" 
                : "bg-gradient-to-r from-[#1F4D3A] to-[#C9A227]"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
