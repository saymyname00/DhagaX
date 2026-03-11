export type ThemeId = 'luxury-gold' | 'fabric-texture' | 'thread-pattern';

export interface Theme {
  id: ThemeId;
  name: string;
  background: string;
  backgroundSecondary: string;
  backgroundCard: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  border: string;
  borderAccent: string;
  tabBar: string;
  searchBg: string;
}

export const themes: Record<ThemeId, Theme> = {
  'luxury-gold': {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    background: '#0a0a0a',
    backgroundSecondary: '#141414',
    backgroundCard: '#1a1a1a',
    text: '#F5F0E8',
    textSecondary: '#C9A84C',
    textMuted: '#6B6050',
    accent: '#C9A84C',
    accentSoft: 'rgba(201, 168, 76, 0.15)',
    border: 'rgba(201, 168, 76, 0.2)',
    borderAccent: 'rgba(201, 168, 76, 0.6)',
    tabBar: '#0d0d0d',
    searchBg: 'rgba(201, 168, 76, 0.06)',
  },
  'fabric-texture': {
    id: 'fabric-texture',
    name: 'Fabric Texture',
    background: '#1C1410',
    backgroundSecondary: '#251C16',
    backgroundCard: '#2E221A',
    text: '#F0E6D3',
    textSecondary: '#D4956A',
    textMuted: '#7A6454',
    accent: '#D4956A',
    accentSoft: 'rgba(212, 149, 106, 0.15)',
    border: 'rgba(212, 149, 106, 0.2)',
    borderAccent: 'rgba(212, 149, 106, 0.6)',
    tabBar: '#1a1008',
    searchBg: 'rgba(212, 149, 106, 0.06)',
  },
  'thread-pattern': {
    id: 'thread-pattern',
    name: 'Thread Pattern',
    background: '#0C0F14',
    backgroundSecondary: '#141820',
    backgroundCard: '#1A1F2A',
    text: '#E8EEF5',
    textSecondary: '#8B3A3A',
    textMuted: '#4A5060',
    accent: '#B04040',
    accentSoft: 'rgba(176, 64, 64, 0.15)',
    border: 'rgba(176, 64, 64, 0.2)',
    borderAccent: 'rgba(176, 64, 64, 0.6)',
    tabBar: '#0a0d12',
    searchBg: 'rgba(176, 64, 64, 0.06)',
  },
};
