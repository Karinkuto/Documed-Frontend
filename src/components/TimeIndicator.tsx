import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeIndicatorProps {
  currentTime: Date;
  isHovered: boolean;
}

export const TimeIndicator: React.FC<TimeIndicatorProps> = ({ currentTime, isHovered }) => {
  return (
    <motion.div
      className="absolute left-0"
      style={{ transform: 'translateY(-50%)' }}
    >
      <motion.div 
        initial={{ width: 8, height: 8 }}
        animate={{ 
          width: isHovered ? 'auto' : 8, 
          height: isHovered ? 24 : 8,
          borderRadius: isHovered ? 4 : 8
        }}
        transition={{ duration: 0.2 }}
        className="bg-red-400 flex items-center justify-center overflow-hidden"
        style={{ transform: 'translateX(-50%)' }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, delay: 0.1 }}
              className="text-white text-xs px-2 whitespace-nowrap"
            >
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
