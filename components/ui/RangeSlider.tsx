import React, { useRef, useEffect, useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, value, onChange }) => {
  const [minValue, maxValue] = value;
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease/increase from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minValue);
      const maxPercent = getPercent(Number(maxValRef.current.value));

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minValue, getPercent]);

  // Set width of the range to decrease/increase from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(Number(minValRef.current.value));
      const maxPercent = getPercent(maxValue);

      if (rangeRef.current) {
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxValue, getPercent]);

  return (
    <div className="w-full flex flex-col space-y-4 font-sans text-[#1F4D3A]">
      <div className="relative h-6 flex items-center">
        {/* Style block for overlapping native range inputs */}
        <style dangerouslySetInnerHTML={{ __html: `
          .thumb,
          .thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            -webkit-tap-highlight-color: transparent;
          }

          .thumb {
            pointer-events: none;
            position: absolute;
            height: 0;
            width: 100%;
            outline: none;
            z-index: 10;
          }

          .thumb-left {
            z-index: 11;
          }

          /* Webkit browsers */
          .thumb::-webkit-slider-thumb {
            background-color: #FFFFFF;
            border: 2px solid #C9A227;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            height: 18px;
            width: 18px;
            margin-top: 4px;
            pointer-events: all;
            position: relative;
            transition: transform 0.1s ease;
          }
          .thumb::-webkit-slider-thumb:hover {
            transform: scale(1.15);
          }
          .thumb::-webkit-slider-thumb:active {
            transform: scale(1.2);
            background-color: #F7F2EA;
          }

          /* Firefox browsers */
          .thumb::-moz-range-thumb {
            background-color: #FFFFFF;
            border: 2px solid #C9A227;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            height: 18px;
            width: 18px;
            pointer-events: all;
            position: relative;
            transition: transform 0.1s ease;
          }
          .thumb::-moz-range-thumb:hover {
            transform: scale(1.15);
          }
          .thumb::-moz-range-thumb:active {
            transform: scale(1.2);
            background-color: #F7F2EA;
          }
        ` }} />

        {/* Overlapping Input sliders */}
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          ref={minValRef}
          onChange={(event) => {
            const val = Math.min(Number(event.target.value), maxValue - 1);
            onChange([val, maxValue]);
          }}
          className="thumb thumb-left"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          ref={maxValRef}
          onChange={(event) => {
            const val = Math.max(Number(event.target.value), minValue + 1);
            onChange([minValue, val]);
          }}
          className="thumb"
        />

        {/* Range visuals container */}
        <div className="relative w-full h-1 bg-[#E8E1D3] rounded-full">
          <div
            ref={rangeRef}
            className="absolute h-1 bg-[#C9A227] rounded-full"
          />
        </div>
      </div>

      {/* Numerical inputs layout */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex flex-col flex-1">
          <label className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">Min Price</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400">Rs.</span>
            <input
              type="number"
              value={minValue}
              onChange={(e) => {
                const val = Math.max(min, Math.min(Number(e.target.value), maxValue - 1));
                onChange([val, maxValue]);
              }}
              className="w-full bg-white border border-[#E8E1D3] text-[#1F4D3A] rounded-xl pl-9 pr-2 py-2 focus:ring-1 focus:ring-[#C9A227] focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        <span className="text-gray-400 self-end mb-2.5 font-light">to</span>

        <div className="flex flex-col flex-1">
          <label className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">Max Price</label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400">Rs.</span>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => {
                const val = Math.min(max, Math.max(Number(e.target.value), minValue + 1));
                onChange([minValue, val]);
              }}
              className="w-full bg-white border border-[#E8E1D3] text-[#1F4D3A] rounded-xl pl-9 pr-2 py-2 focus:ring-1 focus:ring-[#C9A227] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
