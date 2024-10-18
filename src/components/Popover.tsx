'use client';
import useClickOutside from '@/hooks/useClickOutside';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useRef, useEffect, useId } from 'react';

const TRANSITION = {
  type: 'spring',
  bounce: 0.05,
  duration: 0.3,
};

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position: { top: number; left: number };
  color: string;
}

export default function Popover({ isOpen, onClose, children, position, color }: PopoverProps) {
  const uniqueId = useId();
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(popoverRef, onClose);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <MotionConfig transition={TRANSITION}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            layoutId={`popover-${uniqueId}`}
            className={`absolute overflow-hidden border shadow-lg outline-none z-50 ${color}`}
            style={{
              borderRadius: 8,
              top: position.top,
              left: position.left,
              width: '250px',
              maxHeight: '200px', // Set a maximum height
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className='flex w-full flex-col'>
              <div className='p-3 text-xs'>
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
