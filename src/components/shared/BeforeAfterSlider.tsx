import React, { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage = "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000&auto=format&fit=crop",
  afterImage = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop",
  beforeLabel = "Before",
  afterLabel = "After",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[600px] h-[300px] sm:h-[400px] md:h-[450px] rounded-[24px] overflow-hidden shadow-2xl select-none cursor-ew-resize border border-white/20 mx-auto group"
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After Image Content (Base image) */}
      <img
        src={afterImage}
        alt="After formulation usage"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        referrerPolicy="no-referrer"
        loading="lazy"
      />

      {/* After Label */}
      <span className="absolute bottom-[24px] right-[24px] text-white font-sans text-[11px] font-bold uppercase tracking-[2px] z-10 pointer-events-none drop-shadow-md">
        {afterLabel}
      </span>

      {/* Before Image with slider width masking */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before formulation usage"
          className="absolute inset-0 w-[100vw] max-w-none h-full object-cover"
          style={{
            width: containerRef.current?.getBoundingClientRect().width || 600,
          }}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>

      {/* Before Label */}
      <span
        className="absolute bottom-[24px] left-[24px] text-white font-sans text-[11px] font-bold uppercase tracking-[2px] z-10 pointer-events-none drop-shadow-md transition-opacity duration-300"
        style={{ opacity: sliderPosition > 15 ? 1 : 0 }}
      >
        {beforeLabel}
      </span>

      {/* Dynamic Drag Handle bar overlay */}
      <div
        className="absolute top-0 bottom-0 w-[1px] bg-white cursor-ew-resize z-20 flex items-center justify-center pointer-events-none transition-all duration-300"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute w-[40px] h-[40px] rounded-full border border-white bg-white/20 backdrop-blur-md shadow-lg flex items-center justify-center transform -translate-x-1/2 pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-all duration-200 group-hover:border-[#C9A227] group-hover:bg-[#C9A227]/20">
          <MoveHorizontal className="w-[16px] h-[16px] text-white group-hover:text-[#C9A227] transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
