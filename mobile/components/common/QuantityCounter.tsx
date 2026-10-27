import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface QuantityCounterProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export const QuantityCounter: React.FC<QuantityCounterProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDecrement}
        disabled={quantity <= min}
        style={[styles.button, quantity <= min && styles.buttonDisabled]}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, quantity <= min && styles.textDisabled]}>-</Text>
      </TouchableOpacity>

      <Text style={styles.quantityText}>{quantity}</Text>

      <TouchableOpacity
        onPress={onIncrement}
        disabled={quantity >= max}
        style={[styles.button, quantity >= max && styles.buttonDisabled]}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, quantity >= max && styles.textDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  buttonDisabled: {
    backgroundColor: '#EAEAEA',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  textDisabled: {
    color: Colors.textDisabled,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
});
