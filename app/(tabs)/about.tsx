import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : insets.top + 12;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad, paddingBottom: Platform.OS === 'web' ? 100 : 100 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.shopBadge, { backgroundColor: theme.accentSoft, borderColor: theme.borderAccent }]}>
        <Ionicons name="storefront-outline" size={14} color={theme.accent} />
        <Text style={[styles.shopBadgeText, { color: theme.accent }]}>RUBY MATCHING CENTRE</Text>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>About{'\n'}DhagaX</Text>
      <Text style={[styles.subtitle, { color: theme.accent }]}>Thread Shade Matching Tool</Text>

      <View style={[styles.storyCard, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
        <Text style={[styles.storyTitle, { color: theme.text }]}>The Story</Text>
        <Text style={[styles.storyText, { color: theme.textMuted }]}>
          My father runs a thread matching shop — Ruby Matching Centre. Every day, customers walk in with fabric samples and need to find the perfect thread shade match from hundreds of options.
        </Text>
        <Text style={[styles.storyText, { color: theme.textMuted, marginTop: 12 }]}>
          The process was slow, manual, and frustrating. So I — a college student — built DhagaX to digitize the entire shade catalog and make matching instant.
        </Text>
        <Text style={[styles.storyText, { color: theme.textMuted, marginTop: 12 }]}>
          Now any customer can type a shade number and find the matching strip in seconds. No more flipping through physical books.
        </Text>
      </View>

      <View style={[styles.developerCard, { backgroundColor: theme.backgroundCard, borderColor: theme.borderAccent }]}>
        <View style={[styles.developerImageContainer, { borderColor: theme.borderAccent }]}>
          <Image
            source={require('@/assets/images/me.png')}
            style={styles.developerImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.developerInfo}>
          <Text style={[styles.developerName, { color: theme.text }]}>Aryan Khan</Text>
          <Text style={[styles.developerRole, { color: theme.accent }]}>Developer & Designer</Text>
          <Text style={[styles.developerDesc, { color: theme.textMuted }]}>
            College student. Built this for his father's shop.
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statItem, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.accent }]}>300+</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Shades</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.accent }]}>100%</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Offline</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.accent }]}>1s</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Search</Text>
        </View>
      </View>

      <View style={[styles.contactCard, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
        <Text style={[styles.contactTitle, { color: theme.text }]}>Ruby Matching Centre</Text>
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => Linking.openURL('tel:9871574562')}
          activeOpacity={0.7}
        >
          <View style={[styles.contactIconBox, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="call" size={16} color={theme.accent} />
          </View>
          <Text style={[styles.contactText, { color: theme.textMuted }]}>9871574562</Text>
          <Ionicons name="chevron-forward" size={14} color={theme.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.versionRow}>
        <View style={[styles.versionBadge, { borderColor: theme.border }]}>
          <Ionicons name="star" size={10} color={theme.accent} />
          <Text style={[styles.versionText, { color: theme.textMuted }]}>DhagaX v1.0.0</Text>
        </View>
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
    gap: 16,
  },
  shopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  shopBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  title: {
    fontSize: 38,
    fontFamily: 'Inter_700Bold',
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1,
    marginTop: -4,
  },
  storyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  storyTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 10,
  },
  storyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  developerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  developerImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    overflow: 'hidden',
  },
  developerImage: {
    width: '100%',
    height: '100%',
  },
  developerInfo: {
    flex: 1,
    gap: 3,
  },
  developerName: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  developerRole: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  developerDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statItem: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1,
  },
  contactCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  versionRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  versionText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
  },
});
