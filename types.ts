
export enum ThumbnailStyle {
  LUXURY_SHOWROOM = 'Luxury Showroom',
  NEON_CITY = 'Neon City Night',
  EPIC_MOUNTAIN = 'Epic Mountain Road',
  SPEED_MOTION = 'High Speed Motion blur',
  MINIMALIST_STUDIO = 'Minimalist Dark Studio'
}

export enum BadgeType {
  NONE = 'None',
  SOLD = 'SOLD',
  REVIEW = 'REVIEW',
  OFFER = 'OFFER',
  YEAR_2025 = '2025',
  HD_4K = '4K QUALITY',
  EXCLUSIVE = '4F EXCLUSIVE'
}

export enum FontFamily {
  MODERN = 'Orbitron',
  CLASSIC = 'Playfair Display',
  CLEAN = 'Inter'
}

export enum StrokeWidth {
  NONE = 0,
  THIN = 1,
  MEDIUM = 2,
  THICK = 4
}

export enum ShadowIntensity {
  NONE = '0px',
  SOFT = '10px',
  HARD = '20px',
  NEON = '30px'
}

export interface GenerationConfig {
  style: ThumbnailStyle;
  overlayText: string;
  showLogo: boolean;
  enhanceLighting: boolean;
}

export interface GeneratedResult {
  imageUrl: string;
  id: string;
}

export type AppSection = 'THUMBNAIL' | 'MARKETING';

export interface MarketingResult {
  youtubeDescription: string;
  commercialScript: string;
}
