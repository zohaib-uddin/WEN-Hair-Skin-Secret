"use client";

import React from "react";
import { motion } from "motion/react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
