import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddMealModal from '@/components/add-meal-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Accent, BottomTabInset, MaxContentWidth, Spacing, Surface } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { getMealCalories } from '@/utils/nutrition';

export default function MealsScreen() {
  const { state, addMeal, renameMeal, deleteMeal, reorderMeals } = useApp();
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);

  const meals = [...state.dailyPlan.meals].sort((a, b) => a.order - b.order);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete meal', `Remove "${name}" from your meal plan?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMeal(id) },
    ]);
  };

  const moveMeal = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= meals.length) return;
    const ids = meals.map((m) => m.id);
    [ids[index], ids[newIndex]] = [ids[newIndex], ids[index]];
    reorderMeals(ids);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle" style={styles.title}>
            Your Meals
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Customize your daily meal structure
          </ThemedText>

          <View style={styles.list}>
            {meals.map((meal, index) => (
              <View key={meal.id} style={styles.mealRow}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealMeta}>
                    {getMealCalories(meal).toLocaleString()} kcal today · {meal.foods.length} foods
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    onPress={() => moveMeal(index, -1)}
                    disabled={index === 0}
                    style={({ pressed }) => [styles.iconBtn, (index === 0 || pressed) && styles.iconBtnDim]}
                  >
                    <Text style={styles.iconBtnText}>↑</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => moveMeal(index, 1)}
                    disabled={index === meals.length - 1}
                    style={({ pressed }) => [
                      styles.iconBtn,
                      (index === meals.length - 1 || pressed) && styles.iconBtnDim,
                    ]}
                  >
                    <Text style={styles.iconBtnText}>↓</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setRenameTarget({ id: meal.id, name: meal.name })}
                    style={({ pressed }) => [styles.textBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.textBtnLabel}>Rename</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(meal.id, meal.name)}
                    style={({ pressed }) => [styles.textBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.deleteLabel}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <Pressable
              onPress={() => setShowAddMeal(true)}
              style={({ pressed }) => [styles.addRow, pressed && styles.pressed]}
            >
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addLabel}>Add Meal</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      <AddMealModal visible={showAddMeal} onClose={() => setShowAddMeal(false)} onAdd={addMeal} />

      <AddMealModal
        visible={renameTarget != null}
        onClose={() => setRenameTarget(null)}
        initialName={renameTarget?.name ?? ''}
        title="Rename meal"
        confirmLabel="Save"
        onAdd={(name) => {
          if (renameTarget) renameMeal(renameTarget.id, name);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: Spacing.two,
  },
  subtitle: {
    marginBottom: Spacing.two,
  },
  list: {
    backgroundColor: Surface.card,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Surface.border,
    overflow: 'hidden',
  },
  mealRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Surface.border,
    gap: 12,
  },
  mealInfo: {
    gap: 4,
  },
  mealName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  mealMeta: {
    color: Surface.textDim,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDim: {
    opacity: 0.35,
  },
  iconBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Surface.elevated,
  },
  textBtnLabel: {
    color: Accent.green,
    fontSize: 13,
    fontWeight: '600',
  },
  deleteLabel: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  addIcon: {
    color: Surface.textDim,
    fontSize: 20,
    fontWeight: '600',
    width: 24,
    textAlign: 'center',
  },
  addLabel: {
    color: Surface.textDim,
    fontSize: 15,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
