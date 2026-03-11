# DhagaX — Thread Shade Matching App

## Overview
A premium offline mobile app for Ruby Matching Centre that helps users quickly find thread shade matches. Built with Expo React Native.

## Architecture
- **Frontend**: Expo Router (file-based routing), React Native
- **State**: React Context (AppContext) + AsyncStorage for persistence
- **Data**: Local JSON file (`assets/data/data.json`) — fully offline
- **Sounds**: Local MP3 files (`assets/sounds/yes.mp3`, `assets/sounds/no.mp3`)
- **Backend**: Express server (serves landing page + API endpoints)

## Key Features
- Search shade by number (strips P prefix, 1s debounce)
- Sound feedback on match/no-match (expo-av)
- Shake animation on no match
- Animated glowing gold star icon
- 4-column color grid library
- Save/delete favorite shades (AsyncStorage)
- 3 themes: Luxury Gold, Fabric Texture, Thread Pattern
- Full-screen color preview
- Developer About page with photo

## File Structure
```
app/
  _layout.tsx          # Root layout with providers (QueryClient, AppProvider)
  preview.tsx          # Full-screen color preview modal
  (tabs)/
    _layout.tsx        # Tab layout (NativeTabs + classic fallback)
    index.tsx          # Search screen
    library.tsx        # Shade library grid
    saved.tsx          # Saved favorites
    settings.tsx       # Theme & preferences
    about.tsx          # About / developer info

context/
  AppContext.tsx        # Global state: theme, settings, saved shades

constants/
  theme.ts             # 3 theme definitions

assets/
  data/data.json       # Shade database (300+ entries)
  sounds/yes.mp3       # Match found sound
  sounds/no.mp3        # Not found sound
  images/me.png        # Developer photo
```

## Navigation
- Bottom tab navigation with 5 tabs
- Preview screen is a modal stack on top of tabs

## Themes
- **Luxury Gold**: Dark (#0a0a0a) + Gold (#C9A84C) accents
- **Fabric Texture**: Warm dark (#1C1410) + Copper (#D4956A) accents  
- **Thread Pattern**: Cool dark (#0C0F14) + Crimson (#B04040) accents

## Dependencies
- expo-av: Sound playback
- expo-haptics: Haptic feedback
- react-native-reanimated: Animations
- @react-native-async-storage/async-storage: Persistence
- expo-linear-gradient: Gradient effects (available)
