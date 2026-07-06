import { useState, useEffect, RefObject } from 'react';

export const useScrollArrows = (scrollContainerRef: RefObject<HTMLElement | null>) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft <= 1);
      // Added a small threshold (1px) for floating point precision issues
      setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1);
    };

    const element = scrollContainerRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      // Check again after a small delay in case images load
      setTimeout(handleScroll, 100);
      setTimeout(handleScroll, 500);
      window.addEventListener('resize', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollContainerRef]);

  return { isAtStart, isAtEnd };
};
