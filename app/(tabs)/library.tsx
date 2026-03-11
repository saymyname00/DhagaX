import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import type { ShadeItem } from '@/context/AppContext';

const shadeData: ShadeItem[] = require('@/assets/data/data.json');
const NUM_COLUMNS = 4;

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

function ShadeGridItem({
  item,
  theme,
  onPress,
  itemSize,
}: {
  item: ShadeItem;
  theme: any;
  onPress: () => void;
  itemSize: number;
}) {
  const isLight = isLightColor(item.hex);

  return (
    <TouchableOpacity
      style={[styles.gridItem, { width: itemSize }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.colorSquare,
          { backgroundColor: item.hex, width: itemSize - 12, height: itemSize - 12 },
        ]}
      >
        <Text
          style={[
            styles.shadeOverlay,
            { color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' },
          ]}
        >
          {item.shade}
        </Text>
      </View>
      <Text style={[styles.shadeLabel, { color: theme.textMuted }]} numberOfLines={1}>
        {item.shade}
      </Text>
    </TouchableOpacity>
  );
}

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useApp();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState('');

  const itemSize = (width - 20) / NUM_COLUMNS;

  const filteredData = useMemo(() => {
    if (!search.trim()) return shadeData;
    const q = search.trim().toUpperCase().replace(/^P/, '');
    return shadeData.filter(
      (s) =>
        s.shade.toUpperCase().includes(q) ||
        s.number.includes(q) ||
        s.strip.includes(q)
    );
  }, [search]);

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
        <Text style={[styles.title, { color: theme.text }]}>Shade Library</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>{shadeData.length} shades</Text>
        <View style={[styles.searchBar, { backgroundColor: theme.searchBg, borderColor: theme.border }]}>
          <Ionicons name="search" size={16} color={theme.accent} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, fontFamily: 'Inter_500Medium' }]}
            placeholder="Search shade..."
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
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.shade}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: Platform.OS === 'web' ? 100 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filteredData.length}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="color-palette-outline" size={40} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No shades found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ShadeGridItem
            item={item}
            theme={theme}
            onPress={() => handlePress(item)}
            itemSize={itemSize}
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
    paddingHorizontal: 10,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  gridItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  colorSquare: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
    overflow: 'hidden',
  },
  shadeOverlay: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  shadeLabel: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});
