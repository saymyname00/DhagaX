import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useApp } from '@/context/AppContext';
import type { ShadeItem } from '@/context/AppContext';

function SavedItem({
  item,
  theme,
  onDelete,
  onPress,
}: {
  item: ShadeItem;
  theme: any;
  onDelete: () => void;
  onPress: () => void;
}) {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const handleDelete = () => {
    opacity.value = withTiming(0, { duration: 250 });
    translateX.value = withTiming(30, { duration: 250 }, () => {
      runOnJS(onDelete)();
    });
  };

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[styles.savedItem, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <View style={[styles.colorCircle, { backgroundColor: item.hex, borderColor: theme.border }]} />
        <View style={styles.savedInfo}>
          <Text style={[styles.savedShade, { color: theme.text }]}>P{item.number}</Text>
          <Text style={[styles.savedStrip, { color: theme.textMuted }]}>Strip {item.strip}</Text>
        </View>
        <Text style={[styles.savedHex, { color: theme.textMuted }]}>{item.hex}</Text>
        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: theme.accentSoft }]}
          onPress={handleDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={16} color={theme.accent} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { theme, savedShades, removeShade, clearAllSaved } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return savedShades;
    const q = search.trim().toUpperCase().replace(/^P/, '');
    return savedShades.filter(s =>
      s.number.includes(q) || s.strip.includes(q) || s.hex.toLowerCase().includes(q.toLowerCase())
    );
  }, [savedShades, search]);

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Saved',
      'Delete all saved shades?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: clearAllSaved,
        },
      ]
    );
  };

  const handlePress = (item: ShadeItem) => {
    router.push({
      pathname: '/preview',
      params: {
        shade: item.shade,
        number: item.number,
        strip: item.strip,
        hex: item.hex,
      },
    });
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top + 12;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Saved</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>{savedShades.length} shades saved</Text>
          </View>
          {savedShades.length > 0 && (
            <TouchableOpacity
              style={[styles.clearAllBtn, { borderColor: theme.borderAccent }]}
              onPress={handleClearAll}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={14} color={theme.accent} />
              <Text style={[styles.clearAllText, { color: theme.accent }]}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {savedShades.length > 0 && (
          <View style={[styles.searchBar, { backgroundColor: theme.searchBg, borderColor: theme.border }]}>
            <Ionicons name="search" size={16} color={theme.accent} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text, fontFamily: 'Inter_500Medium' }]}
              placeholder="Search saved..."
              placeholderTextColor={theme.textMuted}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.shade}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 100 : 100 }]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No saved shades</Text>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>Save shades from the preview screen</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SavedItem
            item={item}
            theme={theme}
            onDelete={() => removeShade(item.number)}
            onPress={() => handlePress(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  clearAllText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  colorCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
  },
  savedInfo: {
    flex: 1,
  },
  savedShade: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
  savedStrip: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  savedHex: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});
