import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Percent,
  Bike,
  CreditCard,
  Ticket,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getVouchers } from '@/services/api';
import { Voucher } from '@/types/voucher';

export default function SelectOfferScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>('v1');

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const res: any = await getVouchers().catch(() => []);
      if (res && res.length > 0) {
        setVouchers(res);
        setSelectedVoucherId(res[0].id || res[0]._id);
      } else {
        // Fallback default list from Page 6 PDF
        setVouchers([
          {
            id: 'v1',
            title: '- 10%',
            type: 'percentage',
            discountValue: 10,
            minBillValue: 20,
            validUntil: '2026-12-31',
            isActive: true,
          },
          {
            id: 'v2',
            title: '-$1 shipping fee',
            type: 'fixed_shipping',
            discountValue: 1,
            minBillValue: 15,
            validUntil: '2026-12-31',
            isActive: true,
          },
          {
            id: 'v3',
            title: '-10% for E-wallet',
            type: 'wallet_discount',
            discountValue: 10,
            minBillValue: 25,
            validUntil: '2026-12-31',
            isActive: true,
          },
          {
            id: 'v4',
            title: '- 30% for bill over $50',
            type: 'bill_threshold',
            discountValue: 30,
            minBillValue: 50,
            validUntil: '2026-12-31',
            isActive: false, // Grayed out in PDF
          },
          {
            id: 'v5',
            title: 'Freeship',
            type: 'fixed_shipping',
            discountValue: 5,
            minBillValue: 40,
            validUntil: '2026-12-31',
            isActive: true,
          },
        ]);
        setSelectedVoucherId('v1');
      }
    } catch (err) {
      console.error('Error fetching vouchers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVoucherIcon = (type: string, title: string, disabled: boolean) => {
    const iconColor = disabled ? '#A0AEC0' : '#00BDD6';

    if (title.includes('E-wallet')) {
      return (
        <View style={[styles.iconBox, { backgroundColor: disabled ? '#EDF2F7' : '#F3E8FF' }]}>
          <CreditCard color={disabled ? '#A0AEC0' : '#8B5CF6'} size={20} />
        </View>
      );
    }
    if (title.includes('shipping') || title.includes('Freeship')) {
      return (
        <View style={[styles.iconBox, { backgroundColor: disabled ? '#EDF2F7' : '#E0F8FB' }]}>
          <Bike color={disabled ? '#A0AEC0' : '#00BDD6'} size={20} />
        </View>
      );
    }
    return (
      <View style={[styles.iconBox, { backgroundColor: disabled ? '#EDF2F7' : '#E0F2FE' }]}>
        <Ticket color={disabled ? '#A0AEC0' : '#0284C7'} size={20} />
      </View>
    );
  };

  const handleApplyVoucher = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ── Top Header (Page 6 PDF) ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#1E2022" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select offer</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Search Input (Page 6 PDF) ── */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Add or search for voucher"
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />
        ) : (
          vouchers
            .filter((v) =>
              v.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((voucher) => {
              const vId = voucher.id || (voucher as any)._id;
              const isSelected = selectedVoucherId === vId;
              const isDisabled = !voucher.isActive;

              return (
                <TouchableOpacity
                  key={vId}
                  style={[
                    styles.voucherRow,
                    isSelected && styles.voucherRowSelected,
                    isDisabled && styles.voucherRowDisabled,
                  ]}
                  activeOpacity={isDisabled ? 1 : 0.8}
                  onPress={() => {
                    if (!isDisabled) setSelectedVoucherId(vId);
                  }}
                >
                  <View style={styles.voucherLeft}>
                    {getVoucherIcon(voucher.type, voucher.title, isDisabled)}
                    <Text
                      style={[
                        styles.voucherTitle,
                        isDisabled && styles.voucherTitleDisabled,
                      ]}
                    >
                      {voucher.title}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                      isDisabled && styles.radioCircleDisabled,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })
        )}
      </ScrollView>

      {/* ── Bottom Button: Use now (Page 6 PDF) ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.useNowBtn}
          activeOpacity={0.9}
          onPress={handleApplyVoucher}
        >
          <Text style={styles.useNowText}>Use now</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  voucherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  voucherRowSelected: {
    borderColor: '#00BDD6',
  },
  voucherRowDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
  },
  voucherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  voucherTitleDisabled: {
    color: '#9CA3AF',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#00BDD6',
  },
  radioCircleDisabled: {
    borderColor: '#E5E7EB',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00BDD6',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  useNowBtn: {
    backgroundColor: '#00BDD6',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
