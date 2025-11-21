
import React, { useRef } from 'react';
import { Logo } from './Logo';
import { BadgeType, FontFamily, StrokeWidth, ShadowIntensity } from '../types';

interface ThumbnailPreviewProps {
  baseImage: string;
  overlayText: string;
  showLogo: boolean;
  isProcessing: boolean;
  // Customization Props
  textPosition: number;
  textColor: string;
  fontSize: number;
  fontFamily: FontFamily;
  strokeWidth: StrokeWidth;
  shadowIntensity: ShadowIntensity;
  badge: BadgeType;
  textTilt: boolean;
  textBackground: boolean;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ 
  baseImage, 
  overlayText, 
  showLogo,
  isProcessing,
  textPosition,
  textColor,
  fontSize,
  fontFamily,
  strokeWidth,
  shadowIntensity,
  badge,
  textTilt,
  textBackground
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate Flex alignment based on 0-8 grid position
  const getPositionClasses = (pos: number) => {
    const row = Math.floor(pos / 3); // 0=Top, 1=Middle, 2=Bottom
    const col = pos % 3;             // 0=Left, 1=Center, 2=Right
    
    const vertical = ['items-start pt-10', 'items-center', 'items-end pb-10'];
    const horizontal = ['justify-start pl-10 text-left', 'justify-center text-center', 'justify-end pr-10 text-right'];
    
    return `${vertical[row]} ${horizontal[col]}`;
  };

  // Font Family Class Map
  const getFontClass = (font: FontFamily) => {
    switch (font) {
      case FontFamily.MODERN: return 'font-display';
      case FontFamily.CLASSIC: return 'font-serif';
      case FontFamily.CLEAN: return 'font-sans';
      default: return 'font-display';
    }
  };

  // Badge Renderer
  const renderBadge = () => {
    if (badge === BadgeType.NONE) return null;
    
    const badgeStyles = {
      [BadgeType.SOLD]: 'bg-red-600 text-white border-2 border-white',
      [BadgeType.REVIEW]: 'bg-blue-600 text-white border-2 border-white',
      [BadgeType.OFFER]: 'bg-brand-gold text-black border-2 border-white',
      [BadgeType.YEAR_2025]: 'bg-black text-white border-2 border-brand-gold',
      [BadgeType.HD_4K]: 'bg-zinc-900 text-brand-gold border border-brand-gold/50',
      [BadgeType.EXCLUSIVE]: 'bg-black text-brand-gold border-2 border-brand-gold shadow-[0_0_20px_rgba(192,160,98,0.6)]',
    };

    return (
      <div className={`absolute top-8 right-8 z-30 px-5 py-2 rounded-lg font-black text-xl uppercase tracking-widest shadow-2xl transform rotate-2 ${badgeStyles[badge]}`}>
        {badge}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800 group select-none ring-1 ring-white/10">
      {/* Base Generated Image */}
      <img 
        src={baseImage} 
        alt="Thumbnail Base" 
        className={`w-full h-full object-cover transition-all duration-700 ${isProcessing ? 'opacity-50 blur-md scale-105' : 'opacity-100 scale-100'}`}
      />

      {/* Film Grain Texture - Adds cinematic realism to prevent banding */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-10 mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(192,160,98,0.4)]"></div>
          <p className="text-brand-gold font-display font-bold animate-pulse tracking-widest">AI RENDERING...</p>
        </div>
      )}

      {/* Graphic Overlays */}
      {!isProcessing && baseImage && (
        <>
          {/* Cinematic Vignette & Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.4)_100%)] pointer-events-none z-0"></div>
          <div className="absolute top-0 w-full h-40 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none z-0"></div>
          <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-0"></div>

          {/* Badge */}
          {renderBadge()}

          {/* Logo - Always top left for brand consistency */}
          {showLogo && (
             <div className="absolute top-8 left-8 z-30 transform transition-transform hover:scale-105 origin-top-left drop-shadow-2xl">
               <Logo scale={0.9} />
             </div>
          )}

          {/* 4F Exclusive Tag - Bottom Centered in this design for a cleaner top */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-80">
             <div className="bg-black/60 backdrop-blur-md text-brand-gold border border-brand-gold/20 font-bold px-3 py-1 text-[9px] uppercase tracking-[0.2em] rounded-full">
              4F Motors Original
            </div>
          </div>

          {/* Main Text Overlay Grid */}
          <div className={`absolute inset-0 z-20 flex p-8 ${getPositionClasses(textPosition)}`}>
            {overlayText && (
              <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                <h2 
                  className={`
                    leading-[0.85] font-black uppercase whitespace-pre-wrap
                    ${getFontClass(fontFamily)}
                    ${textTilt ? '-skew-x-12 italic' : ''}
                    ${textBackground ? 'bg-brand-gold text-black px-6 py-3 inline-block shadow-[10px_10px_0px_rgba(0,0,0,1)] transform -rotate-1' : ''}
                  `}
                  style={{ 
                    fontSize: `${fontSize * 0.8}px`,
                    color: textBackground ? '#000000' : textColor,
                    WebkitTextStroke: strokeWidth > 0 && !textBackground ? `${strokeWidth}px black` : '0',
                    // Enhanced Shadow Logic
                    textShadow: !textBackground && shadowIntensity !== '0px' 
                      ? `0 10px ${shadowIntensity} rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)` // Double shadow for depth
                      : 'none',
                    filter: !textBackground && shadowIntensity === '30px' ? 'drop-shadow(0 0 15px rgba(255,255,255,0.3))' : 'none' // Extra glow for max intensity
                  }}
                >
                  {overlayText}
                </h2>
                
                {/* Decorative Elements under text if no background box */}
                {!textBackground && (
                  <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <div className="h-1.5 w-16 bg-brand-gold rounded-full shadow-lg"></div>
                     <div className="h-1.5 w-4 bg-white rounded-full shadow-lg"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty State Placeholder if no image */}
      {!baseImage && !isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 pattern-grid-lg text-zinc-800">
           <div className="text-center">
             <div className="inline-block p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
               <span className="text-zinc-600">📷</span>
             </div>
             <p className="text-zinc-600 font-display text-sm tracking-widest">PREVIEW CANVAS</p>
           </div>
        </div>
      )}
    </div>
  );
};
