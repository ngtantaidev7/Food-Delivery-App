import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { FoodItem } from '@/types/food';

interface FoodRowItemProps {
  food: FoodItem;
  onPress: () => void;
  onQuickAdd?: () => void;
}

export const FoodRowItem: React.FC<FoodRowItemProps> = ({
  food,
  onPress,
  onQuickAdd,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <Image
        source={{ uri: food.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {food.name}
        </Text>
        {food.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {food.description}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text style={styles.price}>${food.basePrice.toFixed(2)}</Text>
          {onQuickAdd && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
              style={styles.addButton}
            >
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
});
