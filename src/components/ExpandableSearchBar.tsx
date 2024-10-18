import React, { useRef, useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { Search } from 'lucide-react';
import useClickOutside from '@/hooks/useClickOutside';

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.2,
};

function SearchButton({
  onClick,
  isExpanded,
}: {
  onClick?: () => void;
  isExpanded: boolean;
}) {
  return (
    <button
      className={`relative flex h-10 w-10 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors ${
        isExpanded ? '' : 'hover:bg-zinc-100 hover:text-zinc-800'
      } focus-visible:ring-2 active:scale-[0.98]`}
      type='button'
      onClick={onClick}
      aria-label='Search'
    >
      <Search className='h-5 w-5' />
    </button>
  );
}

export default function ExpandableSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <MotionConfig transition={transition}>
      <div className='relative h-full' ref={containerRef}>
        <motion.div
          animate={{
            width: isOpen ? '300px' : '40px',
          }}
          initial={false}
          className={`h-full rounded-lg ${isOpen ? 'border border-zinc-200' : ''}`}
        >
          <div className='overflow-hidden h-full'>
            {!isOpen ? (
              <SearchButton onClick={() => setIsOpen(true)} isExpanded={false} />
            ) : (
              <div className='flex items-center h-full'>
                <SearchButton isExpanded={true} />
                <input
                  className='h-full w-full bg-transparent px-2 text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none'
                  autoFocus
                  placeholder='Search'
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
