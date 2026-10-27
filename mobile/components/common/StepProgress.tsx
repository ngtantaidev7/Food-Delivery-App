import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { OrderStatus } from '@/types/order';

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'confirm_order', label: 'Order Confirmed' },
  { key: 'look_for_driver', label: 'Finding Driver' },
  { key: 'prepare_food', label: 'Preparing Food' },
  { key: 'deliver', label: 'Delivering' },
  { key: 'arrived', label: 'Arrived' },
];

interface StepProgressProps {
  currentStatus: OrderStatus;
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentStatus }) => {
  if (currentStatus === 'cancelled') {
    return (
      <View style={styles.cancelledBox}>
        <Text style={styles.cancelledText}>Order has been cancelled</Text>
      </View>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isDone = index < activeIdx;
        const isCurrent = index === activeIdx;

        return (
          <View key={step.key} style={styles.stepItem}>
            <View style={styles.indicatorRow}>
              {index > 0 && (
                <View
                  style={[
                    styles.line,
                    (isDone || isCurrent) && styles.lineActive,
                  ]}
                />
              )}
              <View
                style={[
                  styles.circle,
                  isDone && styles.circleDone,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                {isDone && <View style={styles.innerDot} />}
                {isCurrent && <View style={styles.innerDotCurrent} />}
              </View>
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.line,
                    isDone && styles.lineActive,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                isCurrent && styles.labelCurrent,
                isDone && styles.labelDone,
              ]}
              numberOfLines={2}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E5E5',
  },
  lineActive: {
    backgroundColor: Colors.primary,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  circleDone: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  circleCurrent: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  innerDotCurrent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  labelDone: {
    color: Colors.textSecondary,
  },
  labelCurrent: {
    color: Colors.primary,
    fontWeight: '700',
  },
  cancelledBox: {
    backgroundColor: '#FFEAEA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelledText: {
    color: Colors.danger,
    fontWeight: '600',
  },
});
