import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MapPin,
  ChevronDown,
  Search,
  ChevronRight,
  Tag,
  Star,
  Clock,
  Bot,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getBanners, getCategories, getRestaurants } from '@/services/api';
import { Restaurant } from '@/types/restaurant';

const { width } = Dimensions.get('window');

const COLLECTIONS = [
  {
    id: 'freeship',
    name: 'FREESHIP',
    tag: 'Freeship',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'deal1',
    name: 'DEAL $1',
    tag: 'Deal $1',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'nearyou',
    name: 'NEAR YOU',
    tag: 'Near you',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'popular',
    name: 'POPULAR',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [bannersRes, categoriesRes, restaurantsRes]: any = await Promise.all([
        getBanners('home').catch(() => []),
        getCategories().catch(() => []),
        getRestaurants().catch(() => []),
      ]);

      setBanners(bannersRes || []);
      setCategories(categoriesRes || []);
      setRestaurants(restaurantsRes || []);
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCategory = (cat: any) => {
    router.push({
      pathname: '/search',
      params: { q: cat.name },
    });
  };

  const handleOpenTag = (tag: string) => {
    router.push({
      pathname: '/search',
      params: { tag },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Cyan Header (Page 1 PDF) ── */}
      <View style={styles.topHeader}>
        <View style={styles.locationRow}>
          <View style={styles.locationInfo}>
            <MapPin color="#FFFFFF" size={18} />
            <Text style={styles.locationTitle}>Home</Text>
            <ChevronDown color="#FFFFFF" size={16} style={{ marginLeft: 4 }} />
          </View>

          {/* AI Chat Shortcut */}
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => router.push('/ai-chat')}
            activeOpacity={0.8}
          >
            <Bot color="#00BDD6" size={18} />
            <Text style={styles.aiButtonText}>AI Suggest</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.9}
          onPress={() => router.push('/search')}
        >
          <Search color={Colors.textMuted} size={18} />
          <Text style={styles.searchPlaceholder}>Search dishes or restaurants...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Banner Carousel (Join Party $1 - Page 1 PDF) ── */}
        <View style={styles.bannerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
              setActiveBannerIdx(slide);
            }}
            scrollEventThrottle={16}
          >
            {(banners.length > 0 ? banners : [{
              title: 'Join Party',
              dealText: '$1',
              buttonText: 'SEE MORE',
              imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
            }]).map((banner, idx) => (
              <View key={idx} style={styles.bannerCard}>
                <View style={styles.bannerTextCol}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  {banner.dealText ? (
                    <Text style={styles.bannerDeal}>{banner.dealText}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.bannerBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push('/search')}
                  >
                    <Text style={styles.bannerBtnText}>{banner.buttonText || 'SEE MORE'}</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: banner.imageUrl }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>

          {banners.length > 1 && (
            <View style={styles.dotsRow}>
              {banners.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, activeBannerIdx === i && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>

        {/* ── Categories Row (Rice, Healthy, Drink, Fastfood - Page 1 PDF) ── */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {(categories.length > 0 ? categories : [
              { name: 'Rice', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3174/3174880.png' },
              { name: 'Healthy', iconUrl: 'https://cdn-icons-png.flaticon.com/512/2909/2909808.png' },
              { name: 'Drink', iconUrl: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png' },
              { name: 'Fastfood', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
            ]).map((cat, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.categoryItem}
                onPress={() => handleOpenCategory(cat)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryCircle}>
                  <Image
                    source={{ uri: cat.iconUrl || 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }}
                    style={styles.categoryIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.categoryLabel}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Voucher Strip Banner ("You have 5 voucher here >" - Page 1 PDF) ── */}
        <TouchableOpacity
          style={styles.voucherStrip}
          activeOpacity={0.85}
          onPress={() => router.push('/checkout/offers')}
        >
          <View style={styles.voucherStripLeft}>
            <Tag color="#00BDD6" size={18} />
            <Text style={styles.voucherStripText}>You have 5 vouchers here</Text>
          </View>
          <ChevronRight color="#00BDD6" size={18} />
        </TouchableOpacity>

        {/* ── Collections 2x2 Grid (Page 1 PDF) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Collections</Text>
        </View>
        <View style={styles.collectionsGrid}>
          {COLLECTIONS.map((col) => (
            <TouchableOpacity
              key={col.id}
              style={styles.collectionCard}
              activeOpacity={0.8}
              onPress={() => handleOpenTag(col.tag)}
            >
              <Image source={{ uri: col.image }} style={styles.collectionImg} />
              <Text style={styles.collectionName}>{col.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Recommended for you (Page 1 PDF) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {restaurants.slice(0, 5).map((rest) => (
              <TouchableOpacity
                key={rest.id || (rest as any)._id}
                style={styles.recommendCard}
                activeOpacity={0.85}
                onPress={() => router.push(`/restaurant/${rest.id || (rest as any)._id}`)}
              >
                <Image source={{ uri: rest.imageUrl }} style={styles.recommendImg} />
                <Text style={styles.recommendName} numberOfLines={1}>
                  {rest.name}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>20 mins</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Star color={Colors.rating} size={13} fill={Colors.rating} />
                  <Text style={styles.ratingText}>
                    {rest.ratingAverage?.toFixed(1) || '4.5'}
                  </Text>
                </View>
                {rest.tags && rest.tags.length > 0 && (
                  <View style={styles.tagsMiniRow}>
                    {rest.tags.slice(0, 2).map((t, idx) => (
                      <View key={idx} style={styles.tagPill}>
                        <Text style={styles.tagPillText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Sale up to 50% (Page 1 PDF) ── */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Sale up to 50%</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {restaurants.slice(1, 6).map((rest, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.recommendCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/restaurant/${rest.id || (rest as any)._id}`)}
            >
              <View style={styles.imgWrapper}>
                <Image source={{ uri: rest.imageUrl }} style={styles.recommendImg} />
                <View style={styles.saleBadge}>
                  <Text style={styles.saleBadgeText}>-25%</Text>
                </View>
              </View>
              <Text style={styles.recommendName} numberOfLines={1}>
                {rest.name}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>30 mins</Text>
                <Text style={styles.dot}>•</Text>
                <Star color={Colors.rating} size={13} fill={Colors.rating} />
                <Text style={styles.ratingText}>
                  {rest.ratingAverage?.toFixed(1) || '4.2'}
                </Text>
              </View>
              <View style={styles.tagsMiniRow}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagPillText}>Deal $1</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  topHeader: {
    backgroundColor: '#00BDD6',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00BDD6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  bannerContainer: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  bannerCard: {
    width: width - 32,
    height: 140,
    borderRadius: 16,
    backgroundColor: '#9B51E0',
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    paddingLeft: 18,
  },
  bannerTextCol: {
    flex: 1,
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  bannerDeal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  bannerBtn: {
    backgroundColor: '#00BDD6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  bannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  bannerImage: {
    width: 150,
    height: 140,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#00BDD6',
  },
  categoriesSection: {
    marginTop: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  categoryCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 34,
    height: 34,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 6,
    textAlign: 'center',
  },
  voucherStrip: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: '#E8F8FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C2EFF5',
  },
  voucherStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voucherStripText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00BDD6',
  },
  sectionHeader: {
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    marginTop: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  collectionsGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  collectionCard: {
    width: (width - 44) / 2,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  collectionImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  collectionName: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
    marginLeft: 10,
    flex: 1,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 14,
  },
  recommendCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingBottom: 10,
  },
  imgWrapper: {
    position: 'relative',
  },
  recommendImg: {
    width: '100%',
    height: 110,
    backgroundColor: '#EEEEEE',
  },
  saleBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  recommendName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
    marginHorizontal: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 4,
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  metaDot: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  tagsMiniRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginHorizontal: 8,
    marginTop: 6,
  },
  tagPill: {
    backgroundColor: '#E8F8FA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#00BDD6',
  },
});
