"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface AccordionItemProps {
  key?: string | number | null;
  id?: string | number;
  question?: string;
  answer?: string | React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  // Next.js Product page compatibility
  title?: string;
  isOpenByDefault?: boolean;
  children?: React.ReactNode;
}

export function AccordionItem({ 
  question, 
  answer, 
  isOpen: controlledIsOpen, 
  onToggle: controlledOnToggle,
  title,
  isOpenByDefault = false,
  children
}: AccordionItemProps) {
  // If controlled by Accordion parent (via controlledIsOpen), use that, otherwise manage state locally
  const [localIsOpen, setLocalIsOpen] = useState(isOpenByDefault);
  
  const isActuallyOpen = controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;
  
  const handleToggleClick = () => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setLocalIsOpen(!localIsOpen);
    }
  };

  const displayTitle = title || question || "Details";
  const displayBody = children || answer;

  return (
    <div className="border-b border-gray-150 py-1.5 font-sans" id="accordion-item-div">
      <button
        onClick={handleToggleClick}
        className="w-full py-4.5 flex justify-between items-center text-left font-semibold text-[#1F4D3A] focus:outline-none focus:text-[#C9A227] hover:text-[#C9A227] transition duration-200 group cursor-pointer bg-transparent border-none"
        aria-expanded={isActuallyOpen}
      >
        <span className="text-sm sm:text-base pr-4 group-hover:translate-x-0.5 transition duration-200 leading-snug">
          {displayTitle}
        </span>
        <div 
          className={`p-1.5 rounded-full bg-[#F7F2EA]/40 text-[#1F4D3A] transition-transform duration-300 flex-shrink-0 ${
            isActuallyOpen ? "rotate-180 bg-[#C9A227]/10 text-[#C9A227]" : ""
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isActuallyOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-xs sm:text-sm text-gray-500 leading-relaxed font-light tracking-wide whitespace-pre-line pr-4">
              {displayBody}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface AccordionProps {
  items?: Array<{
    id: string | number;
    question: string;
    answer: string | React.ReactNode;
  }>;
  allowMultiple?: boolean;
  children?: React.ReactNode;
}

export function Accordion({ items, allowMultiple = false, children }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Array<string | number>>([]);

  const handleToggle = (id: string | number) => {
    if (allowMultiple) {
      if (openIds.includes(id)) {
        setOpenIds(openIds.filter((idx) => idx !== id));
      } else {
        setOpenIds([...openIds, id]);
      }
    } else {
      if (openIds.includes(id)) {
        setOpenIds([]);
      } else {
        setOpenIds([id]);
      }
    }
  };

  // If children are passed (children-based layout), render children directly with self-contained open/close logic
  if (children) {
    return (
      <div className="w-full divide-y divide-gray-100 border-t border-gray-100" id="reusable-accordion-children">
        {children}
      </div>
    );
  }

  const activeItems = items || [];

  return (
    <div className="w-full divide-y divide-gray-100 border-t border-gray-100" id="reusable-accordion-items">
      {activeItems.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          question={item.question}
          answer={item.answer}
          isOpen={openIds.includes(item.id)}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
}

export default Accordion;
