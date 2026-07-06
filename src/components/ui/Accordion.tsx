import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpenByDefault?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpenByDefault = false,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  return (
    <div className="border-b border-[#E5E5E5] last:border-b-0 w-full" id={`accordion-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 font-semibold text-[#1F4D3A] text-sm sm:text-base text-left transition-colors duration-200 hover:text-[#C9A227] focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-sans tracking-wide">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="text-[#78716C] flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 stroke-[1.5]" />
        </motion.div>
      </button>

      {/* Expandable Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-4 text-xs sm:text-sm leading-relaxed text-[#78716C] font-light font-sans text-left">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Accordion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="divide-y divide-[#E5E5E5] w-full">{children}</div>;
};

export default Accordion;
