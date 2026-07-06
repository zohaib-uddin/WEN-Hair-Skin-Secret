import React from "react";
import { motion } from "motion/react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  onClick?: () => void;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 40,
  className = "",
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 1.02, 0.43, 1.01], // custom smooth cubic-bezier easing
      }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
