import React from "react";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-[#254936]/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-[#F4EBDB] border-t-4 border-[#B69355] border-x border-b border-[#E8E1D3] rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full text-center z-10"
          >
            {/* Elegant Icon Accent */}
            <div className="mx-auto w-12 h-12 rounded-full bg-[#254936]/5 border border-[#B69355]/30 text-[#B69355] flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            {/* Typography Heading */}
            <h3 className="font-playfair text-xl font-bold text-[#254936] mb-2 leading-tight">
              {title}
            </h3>

            {/* Description Message */}
            <p className="font-sans text-xs text-[#63786A] font-light leading-relaxed mb-6">
              {message}
            </p>

            {/* CTA Controls Row */}
            <div className="flex items-center gap-3 justify-center">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 border border-[#E0D4BE] bg-white hover:bg-stone-50 text-[#63786A] rounded-xl text-[10px] font-bold uppercase tracking-widest transition cursor-pointer"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3 px-4 bg-[#254936] hover:bg-[#B69355] hover:text-[#254936] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition shadow-md border-none cursor-pointer"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
