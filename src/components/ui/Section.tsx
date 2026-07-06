import React from "react";
import { motion } from "motion/react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  animate?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  id,
  as: Component = "section",
  animate = false,
}) => {
  const baseClasses = `w-full relative overflow-hidden py-10 xs:py-12 sm:py-14 md:py-20 lg:py-24 xl:py-28 ${className}`;

  if (animate) {
    const MotionComponent = motion(Component as any);
    return (
      <MotionComponent
        id={id}
        className={baseClasses}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <Component id={id} className={baseClasses}>
      {children}
    </Component>
  );
};

export default Section;
