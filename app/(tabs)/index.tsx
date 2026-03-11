import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';
import type { ShadeItem } from '@/context/AppContext';

const shadeData: ShadeItem[] = require('@/assets/data/data.json');

function StarIcon({ theme, animationsEnabled }: { theme: any; animationsEnabled: boolean }) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (animationsEnabled) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        -1,
        false
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0, { duration: 1200 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(rotation);
      cancelAnimation(scale);
      cancelAnimation(glow);
      rotation.value = 0;
      scale.value = 1;
      glow.value = 0;
    }
  }, [animationsEnabled]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: interpolate(glow.value, [0, 1], [0.7, 1]),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.15, 0.45]),
    transform: [{ scale: interpolate(glow.value, [0, 1], [1, 1.3]) }],
  }));

  return (
    <View style={styles.starContainer}>
      <Animated.View style={[styles.starGlow, { backgroundColor: theme.accent }, glowStyle]} />
      <Animated.View style={animStyle}>
        <Ionicons name="star" size={52} color={theme.accent} />
      </Animated.View>
    </View>
  );
}

function ResultCard({ result, theme, onPreview }: { result: ShadeItem; theme: any; onPreview: () => void }) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 300 });
  }, [result.number]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.resultCard, { backgroundColor: theme.backgroundCard, borderColor: theme.borderAccent }, cardStyle]}>
      <View style={styles.resultTop}>
        <View style={styles.resultLeft}>
          <Text style={[styles.resultLabel, { color: theme.textMuted }]}>STRIP NO.</Text>
          <Text style={[styles.resultStripNo, { color: theme.accent }]}>{result.strip}</Text>
          <Text style={[styles.resultShadeLabel, { color: theme.textMuted }]}>SHADE</Text>
          <Text style={[styles.resultShadeNo, { color: theme.text }]}>P{result.number}</Text>
        </View>
        <View style={[styles.colorCircleLarge, { backgroundColor: result.hex, borderColor: theme.border }]} />
      </View>
      <TouchableOpacity
        style={[styles.previewBtn, { backgroundColor: theme.accent }]}
        onPress={onPreview}
        activeOpacity={0.8}
      >
        <Ionicons name="expand" size={16} color="#000" />
        <Text style={styles.previewBtnText}>Tap to Preview</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { theme, soundEnabled, hapticsEnabled, animationsEnabled } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ShadeItem | null>(null);
  const [searched, setSearched] = useState(false);
  const [found, setFound] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const playSound = useCallback(async (type: 'yes' | 'no') => {
    if (!soundEnabled) return;
    try {
      const source = type === 'yes'
        ? require('@/assets/sounds/yes.mp3')
        : require('@/assets/sounds/no.mp3');
      const { sound } = await Audio.Sound.createAsync(source);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch {}
  }, [soundEnabled]);

  const triggerHaptic = useCallback((type: 'success' | 'error') => {
    if (!hapticsEnabled) return;
    if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [hapticsEnabled]);

  const shakeAnimation = useCallback(() => {
    if (!animationsEnabled) return;
    shakeX.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-4, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  }, [animationsEnabled]);

  const searchShade = useCallback((q: string) => {
    const cleaned = q.trim();
    if (!cleaned) {
      setResult(null);
      setSearched(false);
      return;
    }

    const match = shadeData.find(s => s.number === cleaned);

    if (match) {
      setResult(match);
      setFound(true);
      setSearched(true);
      playSound('yes');
      triggerHaptic('success');
      Keyboard.dismiss();
    } else {
      setResult(null);
      setFound(false);
      setSearched(true);
      playSound('no');
      triggerHaptic('error');
      shakeAnimation();
    }
  }, [playSound, triggerHaptic, shakeAnimation]);

  const handleChangeText = (text: string) => {
    const filtered = text.replace(/[^0-9]/g, '').slice(0, 5);
    setQuery(filtered);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchShade(filtered);
    }, 1000);
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setSearched(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    inputRef.current?.focus();
  };

  const handlePreview = () => {
    if (!result) return;
    router.push({
      pathname: '/preview',
      params: {
        shade: result.shade,
        number: result.number,
        strip: result.strip,
        hex: result.hex,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Platform.OS === 'web' ? 67 : insets.top + 12,
            paddingBottom: 120,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerBrand, { color: theme.accent }]}>RUBY</Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>MATCHING CENTRE</Text>
          <TouchableOpacity style={styles.phoneRow} activeOpacity={0.7}>
            <Ionicons name="call" size={13} color={theme.textMuted} />
            <Text style={[styles.headerPhone, { color: theme.textMuted }]}>9871574562</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={shakeStyle}>
          <View style={[styles.searchBarContainer, { backgroundColor: theme.searchBg, borderColor: theme.borderAccent }]}>
            <Ionicons name="search" size={18} color={theme.accent} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={[styles.searchInput, { color: theme.text, fontFamily: 'Inter_500Medium' }]}
              placeholder="Enter Shade No."
              placeholderTextColor={theme.textMuted}
              value={query}
              onChangeText={handleChangeText}
              keyboardType="number-pad"
              autoCorrect={false}
              returnKeyType="search"
              maxLength={5}
              onSubmitEditing={() => {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                searchShade(query);
              }}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {!searched && (
          <View style={styles.centerSection}>
            <StarIcon theme={theme} animationsEnabled={animationsEnabled} />
            <Text style={[styles.findText, { color: theme.textMuted }]}>Find Shade No.</Text>
          </View>
        )}

        {searched && !found && (
          <View style={styles.centerSection}>
            <View style={[styles.notFoundIcon, { borderColor: theme.border }]}>
              <Ionicons name="close-circle-outline" size={48} color={theme.textMuted} />
            </View>
            <Text style={[styles.notFoundText, { color: theme.text }]}>Shade not found</Text>
            <Text style={[styles.notFoundSub, { color: theme.textMuted }]}>Try another number</Text>
          </View>
        )}

        {searched && found && result && (
          <ResultCard result={result} theme={theme} onPreview={handlePreview} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBrand: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 8,
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 4,
    marginTop: 2,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  headerPhone: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 32,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    letterSpacing: 1,
  },
  clearBtn: {
    padding: 4,
  },
  centerSection: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 12,
  },
  starContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  findText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 2,
    marginTop: 8,
  },
  notFoundIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
  },
  notFoundSub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  resultCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  resultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultLeft: {
    gap: 2,
  },
  resultLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 3,
  },
  resultStripNo: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    lineHeight: 56,
  },
  resultShadeLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 3,
    marginTop: 4,
  },
  resultShadeNo: {
    fontSize: 22,
    fontFamily: 'Inter_600SemiBold',
  },
  colorCircleLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
  },
  previewBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#000',
    letterSpacing: 1,
  },
});
