import React from "react";
import * as LucideIcons from "lucide-react";
import { motion } from "motion/react";

interface FeatureCardProps {
  iconName: keyof typeof LucideIcons;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  iconName,
  title,
  description,
}) => {
  const Icon = LucideIcons[iconName] as any;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
      className="flex flex-col items-center text-center p-8 bg-white border border-[#E8E1D3] rounded-2xl shadow-xs transition-shadow hover:shadow-md h-full"
    >
      <div className="mb-5 p-4 bg-[#254936]/5 rounded-full text-[#B69355] transition-transform duration-300 group-hover:scale-110">
        {Icon ? <Icon className="w-10 h-10 stroke-[1.5]" /> : null}
      </div>
      <h3 className="font-playfair text-lg font-bold text-[#254936] mb-2.5">
        {title}
      </h3>
      <p className="text-sm font-sans text-[#63786A] font-light leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
