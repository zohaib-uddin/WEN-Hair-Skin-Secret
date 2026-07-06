import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="w-full bg-white border border-[#F0EBE3] rounded-3xl p-5 space-y-4 animate-pulse relative overflow-hidden">
      {/* Aspect Ratio box */}
      <div className="aspect-[4/5] bg-stone-100 rounded-2xl w-full" />

      {/* Title block */}
      <div className="space-y-2 text-left">
        <div className="h-2.5 bg-stone-100 rounded-md w-1/3" />
        <div className="h-4 bg-stone-100 rounded-md w-3/4" />
        <div className="h-3 bg-stone-100 rounded-md w-5/6" />
      </div>

      {/* Bottom block with price and buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 bg-stone-100 rounded-md w-1/4" />
        <div className="h-8 bg-stone-100 rounded-xl w-1/3" />
      </div>
    </div>
  );
};

export default SkeletonCard;
