import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Accent, Surface } from '@/constants/theme';
import type { Food } from '@/types/nutrition';

type FoodItemProps = {
  food: Food;
  onRemove?: () => void;
  compact?: boolean;
};

export default function FoodItem({ food, onRemove, compact }: FoodItemProps) {
  const qtyLabel =
    food.quantity != null && food.unit
      ? `${food.quantity} ${food.unit}`
      : food.quantity != null
        ? `${food.quantity}`
        : null;

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {food.name}
        </Text>
        {qtyLabel && <Text style={styles.qty}>{qtyLabel}</Text>}
      </View>
      <Text style={styles.calories}>{food.calories.toLocaleString()} kcal</Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
          <Text style={styles.remove}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  rowCompact: {
    paddingVertical: 4,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: Surface.textDim,
    fontSize: 13,
    fontWeight: '500',
  },
  qty: {
    color: '#4A4A4A',
    fontSize: 11,
  },
  calories: {
    color: Surface.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  remove: {
    color: Accent.green,
    fontSize: 20,
    fontWeight: '400',
    width: 24,
    textAlign: 'center',
  },
});
