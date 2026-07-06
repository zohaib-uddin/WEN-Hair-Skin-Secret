import React from "react";
import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ToastProps {
  show: boolean;
  message: string;
  productName?: string;
  productImage?: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  show,
  message,
  productName,
  productImage,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-24 right-4 md:right-8 z-[10000] w-full max-w-sm bg-white border border-[#E8E1D3] rounded-xl shadow-2xl overflow-hidden font-sans border-l-4 border-l-[#1F4D3A]"
          id="global-toast-luxury-notification-next"
        >
          <div className="p-4 flex items-center gap-4">
            {productImage ? (
              <img
                src={productImage}
                alt={productName || "Product"}
                className="w-12 h-12 object-cover rounded-lg border border-[#E8E1D3]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="size-10 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center text-[#1F4D3A]">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 text-left">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#C9A227] block uppercase mb-0.5">
                Cart Updated
              </span>
              <p className="text-xs font-semibold text-[#1F4D3A]">
                {message}
              </p>
              {productName && (
                <p className="text-[11px] text-[#78716C] line-clamp-1 mt-0.5 font-light">
                  {productName}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="text-[#78716C] hover:text-[#1F4D3A] transition-colors p-1 focus:outline-none"
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
            className="h-1 bg-gradient-to-r from-[#1F4D3A] to-[#C9A227] w-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
