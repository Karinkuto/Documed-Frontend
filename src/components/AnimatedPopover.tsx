'use client';

import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useId } from 'react';

const TRANSITION = {
  type: 'spring',
  bounce: 0.05,
  duration: 0.3,
};

interface AnimatedPopoverProps {
  isOpen: boolean;
  position: { top: number; left: number };
  children: React.ReactNode;
  color: string;
}

export function AnimatedPopover({ isOpen, position, children, color }: AnimatedPopoverProps) {
  const uniqueId = useId();

  return (
    <MotionConfig transition={TRANSITION}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId={`popover-${uniqueId}`}
            className={`absolute overflow-hidden border border-zinc-950/10 outline-none ${color}`}
            style={{
              borderRadius: 12,
              top: position.top,
              left: position.left,
              width: '300px',
              maxHeight: '300px',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className='flex flex-col h-full'>
              <div className='flex-grow overflow-auto p-4'>{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
