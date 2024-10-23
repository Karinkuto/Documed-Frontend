import React, { useState, useRef, useEffect } from 'react';
import { TimeIndicator } from './TimeIndicator';

interface TimeGridIndicatorProps {
  currentTime: Date;
  showIndicator: boolean;
  hourHeight: number;
}

export const TimeGridIndicator: React.FC<TimeGridIndicatorProps> = ({ currentTime, showIndicator, hourHeight }) => {
  const [isHovered, setIsHovered] = useState(false);
  const gridIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (gridIndicatorRef.current) {
        const rect = gridIndicatorRef.current.getBoundingClientRect();
        const isNear = (
          event.clientX >= rect.left - 20 &&
          event.clientX <= rect.right + 20 &&
          event.clientY >= rect.top - 20 &&
          event.clientY <= rect.bottom + 20
        );
        setIsHovered(isNear);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!showIndicator) return null;

  const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const top = (minutes / 60) * hourHeight + 30; // Add 30px for the half-hour row at the top

  return (
    <div
      ref={gridIndicatorRef}
      className="absolute left-0 right-0 z-10"
      style={{ top: `${top}px`, height: '2px' }}
    >
      <div className="border-t border-red-400 absolute left-0 right-0" />
      <TimeIndicator currentTime={currentTime} isHovered={isHovered} />
    </div>
  );
};