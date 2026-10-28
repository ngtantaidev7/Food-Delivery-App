import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, Star, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function FavoritesScreen() {
  const router = useRouter();

  const favoriteRestaurants = [
    {
      id: 'r1',
      name: 'Hana Chicken',
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
      category: 'Fastfood, Fried Chicken',
      time: '15 mins',
      rating: 4.8,
      tags: ['Freeship', 'Near you'],
    },
    {
      id: 'r2',
      name: 'Bamsu Restaurant',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
      category: 'Chicken Salad, Sandwich',
      time: '35 mins',
      rating: 4.1,
      tags: ['Freeship'],
    },
    {
      id: 'r3',
      name: "B'Fresh Coffee",
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80',
      category: 'Drinks & Smoothies',
      time: '30 mins',
      rating: 4.5,
      tags: ['Freeship', 'Near you'],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeText}>99+</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {favoriteRestaurants.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push(`/restaurant/${item.id}`)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.cardImg} />
            <View style={styles.cardDetails}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Heart color="#FF4D4F" fill="#FF4D4F" size={18} />
              </View>

              <Text style={styles.cardCategory}>{item.category}</Text>

              <View style={styles.metaRow}>
                <Clock color={Colors.textMuted} size={13} />
                <Text style={styles.metaText}>{item.time}</Text>
                <Text style={styles.dot}>•</Text>
                <Star color={Colors.rating} fill={Colors.rating} size={13} />
                <Text style={styles.metaText}>{item.rating}</Text>
              </View>

              <View style={styles.tagsRow}>
                {item.tags.map((t, idx) => (
                  <View key={idx} style={styles.tagPill}>
                    <Text style={styles.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  badgeCount: {
    backgroundColor: '#FF4D4F',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  cardImg: {
    width: 85,
    height: 85,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  cardCategory: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dot: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  tagPill: {
    backgroundColor: '#E0F8FB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00BDD6',
  },
});
