import React from 'react';

interface LogoProps {
  className?: string;
  scale?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", scale = 1 }) => {
  return (
    <div 
      className={`font-display font-black tracking-wider flex items-center gap-2 select-none ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}
    >
      <div className="relative">
        <span className="text-brand-gold drop-shadow-[0_0_10px_rgba(192,160,98,0.5)] text-4xl italic">4F</span>
        <div className="absolute -bottom-1 left-0 w-full h-1 bg-brand-gold rounded-full opacity-80"></div>
      </div>
      <span className="text-white text-3xl tracking-widest uppercase">MOTORS</span>
    </div>
  );
};