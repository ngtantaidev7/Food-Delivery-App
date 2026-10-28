import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Clock,
  MapPin,
  DollarSign,
  ChevronRight,
  Ticket,
  Bike,
  ShoppingBag,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getRestaurantById, getRestaurantMenu, getRestaurantReviews } from '@/services/api';
import { Restaurant } from '@/types/restaurant';
import { FoodItem } from '@/types/food';
import { useCartStore } from '@/stores/useCartStore';

const { width } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItems = useCartStore((s) => s.items);
  const cartSubtotal = useCartStore((s) => s.subtotal());
  const cartItemCount = useCartStore((s) => s.totalItems());

  useEffect(() => {
    if (id) {
      loadDetails(id);
    }
  }, [id]);

  const loadDetails = async (restId: string) => {
    try {
      setLoading(true);
      const [restRes, menuRes, reviewsRes]: any = await Promise.all([
        getRestaurantById(restId).catch(() => null),
        getRestaurantMenu(restId).catch(() => []),
        getRestaurantReviews(restId).catch(() => []),
      ]);

      setRestaurant(restRes);
      setMenu(menuRes || []);
      setReviews(reviewsRes || []);
    } catch (err) {
      console.error('Error fetching restaurant detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const fallbackRestaurant = restaurant || {
    id: id || '1',
    name: 'Hana Chicken',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    openTime: '6am',
    closeTime: '9pm',
    distanceKm: 2,
    ratingAverage: 4.5,
    totalReviews: 289,
    tags: ['Deal $1', 'Near you'],
    priceRange: { min: 5, max: 50 },
    address: '124 Pham Van Dong, Go Vap',
  };

  const forYouFoods = menu.length > 0 ? menu.slice(0, 4) : [
    {
      id: 'f1',
      name: 'Fried Chicken',
      basePrice: 15,
      ratingAverage: 4.5,
      totalReviews: 99,
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'f2',
      name: 'Chicken Salad',
      basePrice: 15,
      ratingAverage: 4.5,
      totalReviews: 99,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'f3',
      name: 'Spicy Chicken',
      basePrice: 15,
      ratingAverage: 4.5,
      totalReviews: 99,
      imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'f4',
      name: 'Fried Potatos',
      basePrice: 15,
      ratingAverage: 4.5,
      totalReviews: 99,
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const menuFoods = menu.length > 4 ? menu.slice(4) : [
    {
      id: 'f5',
      name: 'Sauté Chicken Rice',
      description: 'Sauté chicken, Rice & fresh cucumber',
      basePrice: 15,
      ratingAverage: 4.5,
      totalReviews: 99,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'f6',
      name: 'Chicken Burger',
      description: 'Fried chicken, Cheese & Burger',
      basePrice: 15,
      ratingAverage: 4.5,
      totalReviews: 99,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <View style={styles.container}>
      {/* ── Top Cover Image & Nav ── */}
      <View style={styles.coverWrapper}>
        <Image
          source={{ uri: fallbackRestaurant.imageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <SafeAreaView style={styles.navBar} edges={['top']}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft color="#1E2022" size={20} />
          </TouchableOpacity>

          <View style={styles.rightNavGroup}>
            <TouchableOpacity style={styles.circleBtn} activeOpacity={0.8}>
              <Share2 color="#1E2022" size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.circleBtn}
              activeOpacity={0.8}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                color={isFavorite ? '#FF4D4F' : '#1E2022'}
                fill={isFavorite ? '#FF4D4F' : 'none'}
                size={18}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Floating Header Card (Page 4 PDF) ── */}
        <View style={styles.floatingCard}>
          {/* Tags */}
          <View style={styles.tagRow}>
            {(fallbackRestaurant.tags || ['Deal $1', 'Near you']).map((tag, idx) => (
              <View
                key={idx}
                style={[
                  styles.tagPill,
                  tag.includes('Deal') ? styles.tagDeal : styles.tagNearYou,
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    tag.includes('Deal') ? styles.tagDealText : styles.tagNearYouText,
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.restName}>{fallbackRestaurant.name}</Text>

          {/* Meta Info Row */}
          <View style={styles.metaRow}>
            <Clock color={Colors.primary} size={14} />
            <Text style={styles.metaText}>
              {fallbackRestaurant.openTime} - {fallbackRestaurant.closeTime}
            </Text>

            <MapPin color={Colors.primary} size={14} style={{ marginLeft: 8 }} />
            <Text style={styles.metaText}>{fallbackRestaurant.distanceKm || 2} km</Text>

            <DollarSign color={Colors.primary} size={14} style={{ marginLeft: 8 }} />
            <Text style={styles.metaText}>$5 - $50</Text>
          </View>

          <View style={styles.divider} />

          {/* Rating Row */}
          <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <Star color={Colors.rating} size={16} fill={Colors.rating} />
              <Text style={styles.actionText}>
                {fallbackRestaurant.ratingAverage?.toFixed(1) || '4.5'} ({fallbackRestaurant.totalReviews || 289} reviews)
              </Text>
            </View>
            <ChevronRight color={Colors.textMuted} size={18} />
          </TouchableOpacity>

          {/* Voucher Row */}
          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.7}
            onPress={() => router.push('/checkout/offers')}
          >
            <View style={styles.actionLeft}>
              <Ticket color={Colors.primary} size={16} />
              <Text style={styles.actionText}>2 discount vouchers for restaurant</Text>
            </View>
            <ChevronRight color={Colors.textMuted} size={18} />
          </TouchableOpacity>

          {/* Delivery Row */}
          <View style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Bike color={Colors.primary} size={16} />
              <Text style={styles.actionText}>Delivery in 20 mins</Text>
            </View>
            <ChevronRight color={Colors.textMuted} size={18} />
          </View>
        </View>

        {/* ── Section: For you (Page 4 PDF) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For you</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.forYouGrid}>
          {forYouFoods.map((food: any) => (
            <TouchableOpacity
              key={food.id || food._id}
              style={styles.forYouCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/food/${food.id || food._id}`)}
            >
              <Image source={{ uri: food.imageUrl }} style={styles.forYouImg} />
              <Text style={styles.forYouName} numberOfLines={1}>
                {food.name}
              </Text>
              <View style={styles.forYouBottom}>
                <View style={styles.foodRatingRow}>
                  <Star color={Colors.rating} size={12} fill={Colors.rating} />
                  <Text style={styles.foodRatingText}>
                    {food.ratingAverage || 4.5} ({food.totalReviews || 99})
                  </Text>
                </View>
                <Text style={styles.foodPrice}>${food.basePrice.toFixed(0)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Section: Menu (Page 4 PDF) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Menu</Text>
        </View>

        <View style={styles.menuList}>
          {menuFoods.map((food: any) => (
            <TouchableOpacity
              key={food.id || food._id}
              style={styles.menuItem}
              activeOpacity={0.8}
              onPress={() => router.push(`/food/${food.id || food._id}`)}
            >
              <Image source={{ uri: food.imageUrl }} style={styles.menuImg} />
              <View style={styles.menuDetails}>
                <Text style={styles.menuName}>{food.name}</Text>
                {food.description ? (
                  <Text style={styles.menuDesc} numberOfLines={1}>
                    {food.description}
                  </Text>
                ) : null}
                <View style={styles.menuBottomRow}>
                  <Text style={styles.menuPrice}>${food.basePrice.toFixed(0)}</Text>
                  <View style={styles.foodRatingRow}>
                    <Star color={Colors.rating} size={12} fill={Colors.rating} />
                    <Text style={styles.foodRatingText}>4.5 (99)</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.8}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>

        {/* ── Section: Reviews (Page 4 PDF - Jinny Oslin) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              }}
              style={styles.reviewerAvatar}
            />
            <View style={styles.reviewerInfo}>
              <Text style={styles.reviewerName}>Jinny Oslin</Text>
              <Text style={styles.reviewTime}>A day ago</Text>
            </View>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} color={Colors.rating} size={13} fill={Colors.rating} />
              ))}
            </View>
          </View>
          <Text style={styles.reviewComment}>
            Quick delivery, good dishes. I love the chicken burger.
          </Text>
        </View>

        {/* ── Section: Combo (Page 4 PDF) ── */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Combo</Text>
        </View>

        <TouchableOpacity
          style={styles.comboCard}
          activeOpacity={0.8}
          onPress={() => router.push('/food/f1')}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.comboImg}
          />
          <View style={styles.comboDetails}>
            <Text style={styles.comboTitle}>Combo B</Text>
            <Text style={styles.comboDesc} numberOfLines={1}>
              Fried Chicken, Chicken Rice & Salad
            </Text>
            <View style={styles.comboBottom}>
              <Text style={styles.comboPrice}>$25</Text>
              <View style={styles.foodRatingRow}>
                <Star color={Colors.rating} size={12} fill={Colors.rating} />
                <Text style={styles.foodRatingText}>4.5 (90)</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Bottom Cart Floating Bar ── */}
      {cartItemCount > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.cartButton}
            activeOpacity={0.9}
            onPress={() => router.push('/checkout/review')}
          >
            <View style={styles.cartIconWrapper}>
              <ShoppingBag color="#00BDD6" size={18} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            </View>
            <Text style={styles.cartButtonText}>View Order</Text>
            <Text style={styles.cartTotalPrice}>${cartSubtotal.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverWrapper: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightNavGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  floatingCard: {
    marginHorizontal: 16,
    marginTop: -40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tagDeal: {
    backgroundColor: '#FFF4E5',
  },
  tagDealText: {
    color: '#FF9900',
    fontSize: 11,
    fontWeight: '700',
  },
  tagNearYou: {
    backgroundColor: '#E0F8FB',
  },
  tagNearYouText: {
    color: '#00BDD6',
    fontSize: 11,
    fontWeight: '700',
  },
  restName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  forYouGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  forYouCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingBottom: 10,
  },
  forYouImg: {
    width: '100%',
    height: 110,
    backgroundColor: '#F0F0F0',
  },
  forYouName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginHorizontal: 10,
    marginTop: 8,
  },
  forYouBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 6,
  },
  foodRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  foodRatingText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  foodPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  menuList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
  },
  menuImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  menuDetails: {
    flex: 1,
    marginLeft: 12,
  },
  menuName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  menuDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  menuBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  menuPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  seeAllBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#E0F8FB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00BDD6',
  },
  reviewCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEEEEE',
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 10,
    lineHeight: 18,
  },
  comboCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
  },
  comboImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  comboDetails: {
    flex: 1,
    marginLeft: 12,
  },
  comboTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  comboDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  comboBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  comboPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cartButton: {
    backgroundColor: '#00BDD6',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  cartIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF4D4F',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cartTotalPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
