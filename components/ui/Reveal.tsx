"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  yOffset = 20,
  className = "",
  stagger = false,
  staggerDelay = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: yOffset, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: duration,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={className}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return <motion.div variants={itemVariants}>{child}</motion.div>;
        })}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: yOffset, scale: 0.96 }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
