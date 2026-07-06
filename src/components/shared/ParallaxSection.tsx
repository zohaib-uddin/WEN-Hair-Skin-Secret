import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface ParallaxSectionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 30,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
