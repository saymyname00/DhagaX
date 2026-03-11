import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { themes, ThemeId } from '@/constants/theme';

const THEME_OPTIONS: { id: ThemeId; label: string; icon: keyof typeof Ionicons.glyphMap; colors: string[] }[] = [
  {
    id: 'luxury-gold',
    label: 'Luxury Gold',
    icon: 'diamond-outline',
    colors: ['#0a0a0a', '#C9A84C', '#1a1a1a'],
  },
  {
    id: 'fabric-texture',
    label: 'Fabric Texture',
    icon: 'layers-outline',
    colors: ['#1C1410', '#D4956A', '#2E221A'],
  },
  {
    id: 'thread-pattern',
    label: 'Thread Pattern',
    icon: 'color-wand-outline',
    colors: ['#0C0F14', '#B04040', '#1A1F2A'],
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {
    theme, themeId, setThemeId,
    soundEnabled, setSoundEnabled,
    hapticsEnabled, setHapticsEnabled,
    animationsEnabled, setAnimationsEnabled,
  } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top + 12;
  const bottomPad = Platform.OS === 'web' ? 34 : 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad, paddingBottom: Platform.OS === 'web' ? 100 : 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>THEMES</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
          {THEME_OPTIONS.map((opt, index) => (
            <React.Fragment key={opt.id}>
              {index > 0 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
              <TouchableOpacity
                style={styles.themeRow}
                onPress={() => setThemeId(opt.id)}
                activeOpacity={0.7}
              >
                <View style={styles.themeLeft}>
                  <View style={styles.themePalette}>
                    {opt.colors.map((c, i) => (
                      <View
                        key={i}
                        style={[
                          styles.paletteCircle,
                          { backgroundColor: c, marginLeft: i > 0 ? -6 : 0, zIndex: opt.colors.length - i },
                        ]}
                      />
                    ))}
                  </View>
                  <View>
                    <Text style={[styles.themeLabel, { color: theme.text }]}>{opt.label}</Text>
                  </View>
                </View>
                <View style={[
                  styles.radioOuter,
                  {
                    borderColor: themeId === opt.id ? theme.accent : theme.border,
                    backgroundColor: themeId === opt.id ? theme.accentSoft : 'transparent',
                  }
                ]}>
                  {themeId === opt.id && (
                    <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
                  )}
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>PREFERENCES</Text>
        <View style={[styles.sectionCard, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>

          <View style={styles.settingRow}>
            <View style={[styles.settingIconBox, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name="volume-medium" size={18} color={theme.accent} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Sound</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Play yes/no sounds on search</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.border, true: theme.accentSoft }}
              thumbColor={soundEnabled ? theme.accent : theme.textMuted}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingRow}>
            <View style={[styles.settingIconBox, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name="phone-portrait-outline" size={18} color={theme.accent} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Haptics</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Vibration feedback</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: theme.border, true: theme.accentSoft }}
              thumbColor={hapticsEnabled ? theme.accent : theme.textMuted}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingRow}>
            <View style={[styles.settingIconBox, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name="sparkles-outline" size={18} color={theme.accent} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Animations</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Star rotation and transitions</Text>
            </View>
            <Switch
              value={animationsEnabled}
              onValueChange={setAnimationsEnabled}
              trackColor={{ false: theme.border, true: theme.accentSoft }}
              thumbColor={animationsEnabled ? theme.accent : theme.textMuted}
            />
          </View>

        </View>
      </View>

      <View style={[styles.footer, { borderColor: theme.border }]}>
        <Ionicons name="star" size={14} color={theme.accent} />
        <Text style={[styles.footerText, { color: theme.textMuted }]}>DhagaX — Thread Shade Matching</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 3,
    marginBottom: 10,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themePalette: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paletteCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  themeLabel: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  settingDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
  },
});
