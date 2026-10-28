import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, CheckCircle2, Check, Minus, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getFoodById } from '@/services/api';
import { useCartStore } from '@/stores/useCartStore';
import { FoodItem, FoodSizeOption, FoodToppingOption } from '@/types/food';

export default function FoodDetailModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState<FoodItem | null>(null);

  // Customization state (default configured according to Page 5 PDF)
  const [selectedSize, setSelectedSize] = useState<FoodSizeOption>({ name: 'L', extraPrice: 10 });
  const [selectedToppings, setSelectedToppings] = useState<FoodToppingOption[]>([
    { name: 'Corn', extraPrice: 2 },
    { name: 'Cheese Cheddar', extraPrice: 5 },
  ]);
  const [selectedSpiciness, setSelectedSpiciness] = useState<string>('Hot');
  const [specialNote, setSpecialNote] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const addItemToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (id) {
      loadFood(id);
    }
  }, [id]);

  const loadFood = async (foodId: string) => {
    try {
      setLoading(true);
      const res: any = await getFoodById(foodId).catch(() => null);
      if (res) {
        setFood(res);
        if (res.options?.sizes?.length > 0) {
          // Set default size L if available, else first
          const sizeL = res.options.sizes.find((s: any) => s.name === 'L') || res.options.sizes[0];
          setSelectedSize(sizeL);
        }
      }
    } catch (err) {
      console.error('Error fetching food detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentFood: FoodItem = food || {
    id: id || 'f1',
    restaurantId: 'r1',
    categoryId: 'c1',
    name: 'Fried Chicken',
    description: 'Crispy fried wings, thigh',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    basePrice: 15,
    options: {
      sizes: [
        { name: 'S', extraPrice: 0 },
        { name: 'M', extraPrice: 5 },
        { name: 'L', extraPrice: 10 },
      ],
      toppings: [
        { name: 'Corn', extraPrice: 2 },
        { name: 'Cheese Cheddar', extraPrice: 5 },
        { name: 'Salted egg', extraPrice: 10 },
      ],
      spicinessOptions: ['No', 'Hot', 'Very hot'],
    },
    isAvailable: true,
  };

  // Calculate total price dynamically
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.extraPrice, 0);
  const singleItemPrice = currentFood.basePrice + (selectedSize?.extraPrice || 0) + toppingsPrice;
  const totalPrice = singleItemPrice * quantity;

  const toggleTopping = (topping: FoodToppingOption) => {
    const exists = selectedToppings.some((t) => t.name === topping.name);
    if (exists) {
      setSelectedToppings(selectedToppings.filter((t) => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddToCart = () => {
    addItemToCart({
      foodId: currentFood.id,
      foodName: currentFood.name,
      imageUrl: currentFood.imageUrl,
      basePrice: currentFood.basePrice,
      size: selectedSize,
      toppings: selectedToppings,
      spiciness: selectedSpiciness,
      specialNote: specialNote || undefined,
      quantity,
      restaurantId: currentFood.restaurantId || 'r1',
      restaurantName: 'Hana Chicken',
    });

    router.push('/checkout/review');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ── Top Image with Close Button ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: currentFood.imageUrl }}
          style={styles.foodImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <X color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Base Price (Page 5 PDF) */}
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.foodName}>{currentFood.name}</Text>
            <Text style={styles.basePriceText}>${currentFood.basePrice}</Text>
          </View>
          <View style={styles.subRow}>
            <Text style={styles.foodDesc}>{currentFood.description}</Text>
            <Text style={styles.basePriceLabel}>Base price</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Size (Pick 1) (Page 5 PDF) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Size <Text style={styles.sectionSubtitle}>(Pick 1)</Text></Text>
          <CheckCircle2 color="#00BDD6" size={18} />
        </View>

        {currentFood.options.sizes.map((size) => {
          const isSelected = selectedSize?.name === size.name;
          return (
            <TouchableOpacity
              key={size.name}
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => setSelectedSize(size)}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionLabel}>{size.name}</Text>
              </View>
              {size.extraPrice > 0 ? (
                <Text style={styles.extraPriceText}>+${size.extraPrice}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        {/* ── Topping (Optional) (Page 5 PDF) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Topping <Text style={styles.sectionSubtitle}>(Optional)</Text></Text>
        </View>

        {currentFood.options.toppings.map((topping) => {
          const isSelected = selectedToppings.some((t) => t.name === topping.name);
          return (
            <TouchableOpacity
              key={topping.name}
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => toggleTopping(topping)}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                  {isSelected && <Check color="#FFFFFF" size={12} strokeWidth={3} />}
                </View>
                <Text style={styles.optionLabel}>{topping.name}</Text>
              </View>
              <Text style={styles.extraPriceText}>+${topping.extraPrice}</Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        {/* ── Spiciness (Pick 1) (Page 5 PDF) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spiciness <Text style={styles.sectionSubtitle}>(Pick 1)</Text></Text>
          <CheckCircle2 color="#00BDD6" size={18} />
        </View>

        {currentFood.options.spicinessOptions.map((spice) => {
          const isSelected = selectedSpiciness === spice;
          return (
            <TouchableOpacity
              key={spice}
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => setSelectedSpiciness(spice)}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionLabel}>{spice}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        {/* ── Note for restaurant (Page 5 PDF) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Note for restaurant</Text>
        </View>

        <View style={styles.noteBox}>
          <TextInput
            placeholder="Special note"
            placeholderTextColor={Colors.textMuted}
            value={specialNote}
            onChangeText={setSpecialNote}
            style={styles.noteInput}
            multiline
          />
        </View>
      </ScrollView>

      {/* ── Bottom Bar: Stepper & Add to cart button (Page 5 PDF) ── */}
      <View style={styles.bottomBar}>
        <View style={styles.stepperWrapper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            activeOpacity={0.7}
          >
            <Minus color="#6C757D" size={16} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.stepBtn, styles.stepBtnPlus]}
            onPress={() => setQuantity(quantity + 1)}
            activeOpacity={0.7}
          >
            <Plus color="#FFFFFF" size={16} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartBtn}
          activeOpacity={0.9}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to cart (${totalPrice.toFixed(0)})</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerInfo: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    flex: 1,
  },
  basePriceText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  foodDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  basePriceLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  extraPriceText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#00BDD6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00BDD6',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#00BDD6',
    borderColor: '#00BDD6',
  },
  noteBox: {
    backgroundColor: '#F7F8F9',
    borderRadius: 10,
    padding: 12,
    minHeight: 70,
    marginTop: 4,
  },
  noteInput: {
    fontSize: 13,
    color: Colors.text,
    textAlignVertical: 'top',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepperWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPlus: {
    backgroundColor: '#00BDD6',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
