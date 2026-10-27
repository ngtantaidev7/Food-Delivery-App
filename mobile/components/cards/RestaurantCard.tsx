import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Restaurant } from '@/types/restaurant';
import { TagBadge } from '@/components/common/TagBadge';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.container}
    >
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>
              {restaurant.ratingAverage?.toFixed(1) || '5.0'}
            </Text>
          </View>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {restaurant.address}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.timeText}>
            ⏱ {restaurant.openTime} - {restaurant.closeTime}
          </Text>
          {restaurant.distanceKm !== undefined && (
            <Text style={styles.dotSeparator}>•</Text>
          )}
          {restaurant.distanceKm !== undefined && (
            <Text style={styles.distanceText}>
              {restaurant.distanceKm.toFixed(1)} km
            </Text>
          )}
        </View>

        {restaurant.tags && restaurant.tags.length > 0 && (
          <View style={styles.tagRow}>
            {restaurant.tags.map((tag, idx) => (
              <TagBadge
                key={idx}
                label={tag}
                type={
                  tag.toLowerCase().includes('free')
                    ? 'freeship'
                    : tag.toLowerCase().includes('deal')
                    ? 'deal'
                    : 'popular'
                }
              />
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#F0F0F0',
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingStar: {
    color: Colors.rating,
    fontSize: 13,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A6200',
  },
  address: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: Colors.textMuted,
  },
  distanceText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
});
