import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { searchFoods } from '@/data/foods';
import { Accent, Surface } from '@/constants/theme';
import type { FoodDatabaseItem } from '@/types/nutrition';
import { createFoodFromDatabaseItem } from '@/utils/nutrition';

type AddFoodModalProps = {
  visible: boolean;
  mealName: string;
  onClose: () => void;
  onAdd: (food: ReturnType<typeof createFoodFromDatabaseItem>) => void;
};

export default function AddFoodModal({ visible, mealName, onClose, onAdd }: AddFoodModalProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<FoodDatabaseItem | null>(null);
  const [quantity, setQuantity] = useState('');

  const results = useMemo(() => searchFoods(query), [query]);

  const reset = () => {
    setQuery('');
    setSelected(null);
    setQuantity('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelect = (item: FoodDatabaseItem) => {
    setSelected(item);
    setQuantity(String(item.defaultQuantity ?? 1));
  };

  const previewCalories = useMemo(() => {
    if (!selected) return 0;
    const qty = parseFloat(quantity) || 0;
    const baseQty = selected.defaultQuantity ?? 1;
    return Math.round(selected.calories * (qty / baseQty));
  }, [selected, quantity]);

  const handleAdd = () => {
    if (!selected) return;
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) return;
    onAdd(createFoodFromDatabaseItem(selected, qty));
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add food</Text>
          <Text style={styles.subtitle}>to {mealName}</Text>

          {!selected ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Search foods..."
                placeholderTextColor={Surface.textDim}
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                style={styles.list}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <Pressable
                    style={({ pressed }) => [styles.foodRow, pressed && styles.pressed]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodCalories}>
                      {item.calories} kcal / {item.defaultQuantity ?? 1} {item.unit ?? 'serving'}
                    </Text>
                  </Pressable>
                )}
              />
            </>
          ) : (
            <View style={styles.quantitySection}>
              <Pressable onPress={() => setSelected(null)}>
                <Text style={styles.backLink}>← Back to search</Text>
              </Pressable>
              <Text style={styles.selectedName}>{selected.name}</Text>
              <View style={styles.quantityRow}>
                <TextInput
                  style={[styles.input, styles.quantityInput]}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                />
                <Text style={styles.unit}>{selected.unit ?? 'serving'}</Text>
              </View>
              <Text style={styles.preview}>{previewCalories.toLocaleString()} kcal</Text>
              <Pressable
                style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
                onPress={handleAdd}
              >
                <Text style={styles.addButtonText}>Add to {mealName}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Surface.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Surface.border,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: Surface.textDim,
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    backgroundColor: Surface.elevated,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  list: {
    maxHeight: 320,
  },
  foodRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Surface.border,
  },
  foodName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  foodCalories: {
    color: Surface.textDim,
    fontSize: 13,
    marginTop: 2,
  },
  quantitySection: {
    gap: 12,
  },
  backLink: {
    color: Accent.green,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityInput: {
    flex: 1,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  unit: {
    color: Surface.textDim,
    fontSize: 16,
    minWidth: 60,
  },
  preview: {
    color: Accent.green,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 8,
  },
  addButton: {
    backgroundColor: Accent.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
