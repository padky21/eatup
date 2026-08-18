import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Accent, Surface } from '@/constants/theme';

type DailySummaryProps = {
  consumed: number;
  target: number;
  remaining: number;
};

export default function DailySummary({ consumed, target, remaining }: DailySummaryProps) {
  const isOver = remaining < 0;

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.value}>{consumed.toLocaleString()}</Text>
        <Text style={styles.label}>consumed</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={[styles.value, isOver && styles.overValue]}>
          {Math.abs(remaining).toLocaleString()}
        </Text>
        <Text style={styles.label}>{isOver ? 'over target' : 'remaining'}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stat}>
        <Text style={styles.value}>{target.toLocaleString()}</Text>
        <Text style={styles.label}>target</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: Surface.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Surface.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  overValue: {
    color: '#FF6B6B',
  },
  label: {
    color: Surface.textDim,
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: Surface.border,
  },
});
