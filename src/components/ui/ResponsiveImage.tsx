import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "video" | "auto";
  sizesType?: "full" | "half" | "third" | "two-column" | "three-column";
  priority?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio = "auto",
  sizesType = "full",
  priority = false,
  className = "",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-calculate sizes parameter based on design types
  const getSizesAttribute = () => {
    switch (sizesType) {
      case "third":
      case "three-column":
        return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
      case "half":
      case "two-column":
        return "(max-width: 768px) 100vw, 50vw";
      case "full":
      default:
        return "100vw";
    }
  };

  const ratioClasses = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[4/3]",
    video: "aspect-video",
    auto: "",
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-[#FAFAF9] to-[#F5F5F4] w-full ${ratioClasses[aspectRatio]} ${className}`}
    >
      {/* Blurred image placeholder or shimmer effect */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-100 flex items-center justify-center animate-pulse"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={src}
        alt={alt}
        sizes={getSizesAttribute()}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out referrer-policy="no-referrer" ${
          isLoaded ? "scale-100 blur-0 opacity-100" : "scale-105 blur-md opacity-0"
        }`}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;
