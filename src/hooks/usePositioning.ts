import { useState, useEffect, RefObject } from 'react';

interface Position {
  top: number;
  left: number;
}

export function usePositioning(
  containerRef: RefObject<HTMLElement>,
  initialPosition: Position
) {
  const [adjustedPosition, setAdjustedPosition] = useState(initialPosition);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePosition = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const scrollY = window.scrollY;

      let newTop = initialPosition.top;
      let newLeft = initialPosition.left;

      // Adjust vertical position if needed
      if (newTop + rect.height > viewportHeight + scrollY) {
        // If showing below pushes it off screen, try showing above
        const aboveSpace = initialPosition.top - rect.height - scrollY;
        if (aboveSpace > 0) {
          newTop = initialPosition.top - rect.height;
        } else {
          // If neither above nor below fits perfectly, choose the side with more space
          newTop = viewportHeight - rect.height + scrollY - 20;
        }
      }

      // Adjust horizontal position if needed
      if (newLeft + rect.width > viewportWidth) {
        newLeft = Math.max(20, viewportWidth - rect.width - 20);
      }

      setAdjustedPosition({ top: newTop, left: newLeft });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [containerRef, initialPosition]);

  return { adjustedPosition };
}