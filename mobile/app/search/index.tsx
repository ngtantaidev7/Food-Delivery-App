import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { SearchInput } from '@/components/common/SearchInput';
import { TagBadge } from '@/components/common/TagBadge';
import { searchFoods } from '@/services/api';

const QUICK_TAGS = ['Freeship', 'Deal $1', 'Near you', 'Popular'];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (searchTerm = query, tag = selectedTag) => {
    setLoading(true);
    try {
      const res: any = await searchFoods(searchTerm, tag || undefined);
      setResults(res.groupedResults || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(query, selectedTag);
    }, 350);
    return () => clearTimeout(timeout);
  }, [query, selectedTag]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search foods, dishes, or restaurant..."
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.tagsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
          {QUICK_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <TouchableOpacity
                key={tag}
                onPress={() => setSelectedTag(isSelected ? null : tag)}
                activeOpacity={0.7}
              >
                <TagBadge
                  label={tag}
                  type={
                    tag.includes('Free')
                      ? 'freeship'
                      : tag.includes('Deal')
                      ? 'deal'
                      : 'popular'
                  }
                  style={isSelected ? styles.selectedTag : styles.unselectedTag}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>No dishes found</Text>
          <Text style={styles.emptySub}>Try searching with other keywords or tags</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.restaurant._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const rest = item.restaurant;
            return (
              <View style={styles.restaurantGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push(`/restaurant/${rest._id}`)}
                  style={styles.restaurantHeader}
                >
                  <View style={styles.restInfo}>
                    <Text style={styles.restaurantName}>{rest.name}</Text>
                    <Text style={styles.restaurantAddress} numberOfLines={1}>
                      {rest.address}
                    </Text>
                  </View>
                  <Text style={styles.viewMenuText}>View Menu →</Text>
                </TouchableOpacity>

                {item.items.map((food: any) => (
                  <TouchableOpacity
                    key={food._id}
                    onPress={() => router.push(`/food/${food._id}`)}
                    style={styles.foodRow}
                    activeOpacity={0.7}
                  >
                    <View style={styles.foodDetails}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      {food.description ? (
                        <Text style={styles.foodDesc} numberOfLines={1}>
                          {food.description}
                        </Text>
                      ) : null}
                      <Text style={styles.foodPrice}>${food.basePrice.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.addDishBtn}>Add</Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backArrow: {
    fontSize: 20,
    color: Colors.text,
  },
  searchInput: {
    flex: 1,
  },
  tagsContainer: {
    paddingVertical: 8,
  },
  tagsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  selectedTag: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  unselectedTag: {
    opacity: 0.85,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  restaurantGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  restInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  restaurantAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  viewMenuText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  foodDetails: {
    flex: 1,
    marginRight: 12,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  foodDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  foodPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  addDishBtn: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
