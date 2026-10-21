import { FontTheme } from '../types';

export interface ThemeConfig {
  id: FontTheme;
  name: string;
  fontClass: string;
  fontFamilyName: string;
  previewGradient: string;
  heroGradient: string;
  buttonGradient: string;
  badgeGradient: string;
  accentColor: string;
  cardBorderGlow: string;
}

export const THEME_CONFIGS: Record<FontTheme, ThemeConfig> = {
  rainbow: {
    id: 'rainbow',
    name: 'Retro Rainbow',
    fontClass: 'font-righteous',
    fontFamilyName: 'Righteous & Outfit',
    previewGradient: 'from-pink-500 via-yellow-400 to-cyan-400',
    heroGradient: 'from-pink-500 via-amber-400 to-cyan-400',
    buttonGradient: 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600',
    badgeGradient: 'from-pink-500/20 to-amber-500/20 text-pink-300 border-pink-500/30',
    accentColor: '#ec4899',
    cardBorderGlow: 'hover:border-pink-500/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.25)]',
  },
  candy: {
    id: 'candy',
    name: 'Candy Pop',
    fontClass: 'font-fredoka',
    fontFamilyName: 'Fredoka Bubbles',
    previewGradient: 'from-fuchsia-400 via-pink-400 to-purple-400',
    heroGradient: 'from-fuchsia-400 via-pink-500 to-purple-500',
    buttonGradient: 'bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700',
    badgeGradient: 'from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border-fuchsia-500/30',
    accentColor: '#d946ef',
    cardBorderGlow: 'hover:border-fuchsia-500/40 hover:shadow-[0_0_25px_rgba(217,70,239,0.25)]',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    fontClass: 'font-comfortaa',
    fontFamilyName: 'Comfortaa Modern',
    previewGradient: 'from-orange-500 via-rose-500 to-purple-600',
    heroGradient: 'from-orange-400 via-rose-500 to-purple-600',
    buttonGradient: 'bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 hover:from-orange-600 hover:to-purple-700',
    badgeGradient: 'from-orange-500/20 to-rose-500/20 text-orange-300 border-orange-500/30',
    accentColor: '#f97316',
    cardBorderGlow: 'hover:border-orange-500/40 hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]',
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Neon',
    fontClass: 'font-space',
    fontFamilyName: 'Space Grotesk Tech',
    previewGradient: 'from-cyan-400 via-emerald-400 to-yellow-300',
    heroGradient: 'from-cyan-400 via-teal-300 to-emerald-400',
    buttonGradient: 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600',
    badgeGradient: 'from-cyan-500/20 to-emerald-500/20 text-cyan-300 border-cyan-500/30',
    accentColor: '#06b6d4',
    cardBorderGlow: 'hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
  },
  cyber: {
    id: 'cyber',
    name: 'Royal Electric',
    fontClass: 'font-jakarta',
    fontFamilyName: 'Jakarta Ultra',
    previewGradient: 'from-indigo-400 via-purple-400 to-pink-500',
    heroGradient: 'from-indigo-400 via-violet-400 to-pink-400',
    buttonGradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700',
    badgeGradient: 'from-indigo-500/20 to-pink-500/20 text-indigo-300 border-indigo-500/30',
    accentColor: '#6366f1',
    cardBorderGlow: 'hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]',
  },
};
