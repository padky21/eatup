import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { View } from 'react-native';
import { useState } from 'react';
import CalorieProgressRing from '@/components/calorie-counter';
import MealList, { Meal } from '@/components/meal-card';

const initialMeals: Meal[] = [
  { id: '1', name: 'Breakfast', targetCalories: 750, completed: true },
  { id: '2', name: 'Lunch', targetCalories: 900, completed: true },
  { id: '3', name: 'Snack', subtitle: 'Now', targetCalories: 450, completed: false },
  { id: '4', name: 'Dinner', targetCalories: 500, completed: false },
];

export default function HomeScreen() {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);

  const totalCalories = meals.reduce((sum, m) => sum + m.targetCalories, 0);
  const consumedCalories = meals
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.targetCalories, 0);

  const handleToggleComplete = (id: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleAddFood = (id: string) => {
    // TODO: open food-logging flow for this meal
    console.log('Add food to meal', id);
  };

  const handleAddMeal = () => {
    // TODO: open a proper "new meal" flow (name + calorie target).
    // Adding a placeholder meal for now so the list stays fully dynamic.
    setMeals((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: `Meal ${prev.length + 1}`,
        targetCalories: 0,
        completed: false,
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>Today's Goal</ThemedText>
          <ThemedText type="small">Wednesday, Feb 27</ThemedText>
          <CalorieProgressRing current={consumedCalories} max={totalCalories} />

          <MealList
            meals={meals}
            onToggleComplete={handleToggleComplete}
            onAddFood={handleAddFood}
            onAddMeal={handleAddMeal}
          />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});