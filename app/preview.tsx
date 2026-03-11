import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '@/context/AppContext';

function isLightColor(hex: string): boolean {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  } catch {
    return false;
  }
}

export default function PreviewScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { hapticsEnabled, saveShade, removeShade, isShadesSaved } = useApp();

  const shade = String(params.shade ?? '');
  const number = String(params.number ?? '');
  const strip = String(params.strip ?? '');
  const hex = String(params.hex ?? '#888888');

  const isSaved = isShadesSaved(number);
  const isLight = isLightColor(hex);
  const textColor = isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)';
  const mutedColor = isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.55)';
  const overlayBg = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
  const borderClr = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 350 });
    translateY.value = withSpring(0, { damping: 16, stiffness: 120 });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handleSaveToggle = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (isSaved) {
      removeShade(number);
    } else {
      saveShade({ shade, number, strip, hex });
    }
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: hex }]}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} />

      <View style={[styles.topBar, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: overlayBg, borderColor: borderClr }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-down" size={22} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: isSaved ? overlayBg : overlayBg, borderColor: isSaved ? borderClr : borderClr }]}
          onPress={handleSaveToggle}
          activeOpacity={0.7}
        >
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? '#FF4B6E' : textColor} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.detailsCard, { backgroundColor: overlayBg, borderColor: borderClr }, animStyle]}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: mutedColor }]}>SHADE NO.</Text>
            <Text style={[styles.detailValue, { color: textColor }]}>P{number}</Text>
          </View>
          <View style={[styles.detailDivider, { backgroundColor: borderClr }]} />
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: mutedColor }]}>STRIP NO.</Text>
            <Text style={[styles.detailValue, { color: textColor }]}>{strip}</Text>
          </View>
          <View style={[styles.detailDivider, { backgroundColor: borderClr }]} />
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: mutedColor }]}>HEX</Text>
            <Text style={[styles.detailValueSmall, { color: textColor }]}>{hex.toUpperCase()}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={[styles.bottom, { paddingBottom: bottomPad + 20 }]}>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: overlayBg, borderColor: borderClr }]}
          onPress={handleSaveToggle}
          activeOpacity={0.75}
        >
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={18} color={isSaved ? '#FF4B6E' : textColor} />
          <Text style={[styles.saveBtnText, { color: textColor }]}>
            {isSaved ? 'Saved to favorites' : 'Save to favorites'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 2,
  },
  detailValue: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
  },
  detailValueSmall: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
  },
  detailDivider: {
    width: 1,
    height: 40,
  },
  bottom: {
    paddingHorizontal: 20,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
});
