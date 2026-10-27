import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Voucher } from '@/types/voucher';

interface VoucherItemProps {
  voucher: Voucher;
  isSelected?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export const VoucherItem: React.FC<VoucherItemProps> = ({
  voucher,
  isSelected = false,
  onSelect,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onSelect}
      disabled={disabled}
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        disabled && styles.containerDisabled,
      ]}
    >
      <View style={styles.leftStub}>
        <Text style={styles.discountBadge}>
          {voucher.type === 'percentage'
            ? `${voucher.discountValue}%`
            : `$${voucher.discountValue}`}
        </Text>
        <Text style={styles.offLabel}>OFF</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {voucher.title}
        </Text>
        <Text style={styles.subtitle}>
          Min order: ${voucher.minBillValue.toFixed(2)}
        </Text>
        {voucher.maxDiscount && (
          <Text style={styles.subtitle}>
            Max discount: ${voucher.maxDiscount.toFixed(2)}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.radioCircle,
          isSelected && styles.radioCircleSelected,
        ]}
      >
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  containerSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FAFFFF',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  leftStub: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  discountBadge: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  offLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});
