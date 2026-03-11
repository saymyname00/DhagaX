import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeId, Theme, themes } from '@/constants/theme';

export interface ShadeItem {
  shade: string;
  number: string;
  strip: string;
  hex: string;
}

interface AppContextValue {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (v: boolean) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (v: boolean) => void;
  savedShades: ShadeItem[];
  saveShade: (shade: ShadeItem) => void;
  removeShade: (shadeNumber: string) => void;
  clearAllSaved: () => void;
  isShadesSaved: (shadeNumber: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEYS = {
  THEME: 'dhagax_theme',
  SOUND: 'dhagax_sound',
  HAPTICS: 'dhagax_haptics',
  ANIMATIONS: 'dhagax_animations',
  SAVED: 'dhagax_saved',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>('luxury-gold');
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [hapticsEnabled, setHapticsEnabledState] = useState(true);
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);
  const [savedShades, setSavedShades] = useState<ShadeItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [theme, sound, haptics, animations, saved] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
          AsyncStorage.getItem(STORAGE_KEYS.SOUND),
          AsyncStorage.getItem(STORAGE_KEYS.HAPTICS),
          AsyncStorage.getItem(STORAGE_KEYS.ANIMATIONS),
          AsyncStorage.getItem(STORAGE_KEYS.SAVED),
        ]);
        if (theme) setThemeIdState(theme as ThemeId);
        if (sound !== null) setSoundEnabledState(sound === 'true');
        if (haptics !== null) setHapticsEnabledState(haptics === 'true');
        if (animations !== null) setAnimationsEnabledState(animations === 'true');
        if (saved) setSavedShades(JSON.parse(saved));
      } catch {}
      setLoaded(true);
    }
    loadSettings();
  }, []);

  const setThemeId = async (id: ThemeId) => {
    setThemeIdState(id);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, id);
  };

  const setSoundEnabled = async (v: boolean) => {
    setSoundEnabledState(v);
    await AsyncStorage.setItem(STORAGE_KEYS.SOUND, String(v));
  };

  const setHapticsEnabled = async (v: boolean) => {
    setHapticsEnabledState(v);
    await AsyncStorage.setItem(STORAGE_KEYS.HAPTICS, String(v));
  };

  const setAnimationsEnabled = async (v: boolean) => {
    setAnimationsEnabledState(v);
    await AsyncStorage.setItem(STORAGE_KEYS.ANIMATIONS, String(v));
  };

  const saveShade = async (shade: ShadeItem) => {
    setSavedShades(prev => {
      const exists = prev.some(s => s.number === shade.number);
      if (exists) return prev;
      const updated = [shade, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
      return updated;
    });
  };

  const removeShade = async (shadeNumber: string) => {
    setSavedShades(prev => {
      const updated = prev.filter(s => s.number !== shadeNumber);
      AsyncStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllSaved = async () => {
    setSavedShades([]);
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify([]));
  };

  const isShadesSaved = (shadeNumber: string) => {
    return savedShades.some(s => s.number === shadeNumber);
  };

  const theme = themes[themeId];

  const value = useMemo(() => ({
    theme,
    themeId,
    setThemeId,
    soundEnabled,
    setSoundEnabled,
    hapticsEnabled,
    setHapticsEnabled,
    animationsEnabled,
    setAnimationsEnabled,
    savedShades,
    saveShade,
    removeShade,
    clearAllSaved,
    isShadesSaved,
  }), [theme, themeId, soundEnabled, hapticsEnabled, animationsEnabled, savedShades]);

  if (!loaded) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
