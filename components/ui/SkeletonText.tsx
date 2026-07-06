import React from "react";

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-2.5 w-full animate-pulse text-left">
      {Array.from({ length: lines }).map((_, idx) => {
        // Vary widths to look like natural paragraph lines
        const widths = ["w-full", "w-11/12", "w-4/5", "w-5/6", "w-3/4"];
        const selectedWidth = widths[idx % widths.length];

        return (
          <div
            key={idx}
            className={`h-3.5 bg-stone-100 rounded-md ${selectedWidth}`}
          />
        );
      })}
    </div>
  );
};

export default SkeletonText;
