import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathFormulaProps> = ({ math, block = false, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          strict: false
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        containerRef.current.innerText = math;
      }
    }
  }, [math, block]);

  return (
    <span
      ref={containerRef}
      dir="ltr"
      className={`inline-block font-sans ${block ? 'my-2 overflow-x-auto max-w-full text-center py-2' : ''} ${className}`}
    />
  );
};
