import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddMealModal from '@/components/add-meal-modal';
import CalorieProgressRing from '@/components/calorie-counter';
import DailySummary from '@/components/daily-summary';
import MealList from '@/components/meal-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Accent } from '@/constants/theme';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useApp } from '@/context/app-context';
import { formatTodayDate } from '@/utils/nutrition';

export default function HomeScreen() {
  const {
    state,
    consumedCalories,
    remainingCalories,
    suggestedCalories,
    currentMealId,
    toggleMealComplete,
    addFood,
    removeFood,
    addMeal,
  } = useApp();

  const [showAddMeal, setShowAddMeal] = useState(false);
  const calorieTarget = state.profile.calorieTarget;
  const meals = state.dailyPlan.meals;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            Today&apos;s Goal
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatTodayDate()}
          </ThemedText>

          <CalorieProgressRing
            current={consumedCalories}
            max={calorieTarget}
            color={Accent.green}
          />

          <DailySummary
            consumed={consumedCalories}
            target={calorieTarget}
            remaining={remainingCalories}
          />

          <MealList
            meals={meals}
            currentMealId={currentMealId}
            suggestedCalories={suggestedCalories}
            onToggleComplete={toggleMealComplete}
            onAddFood={addFood}
            onRemoveFood={removeFood}
            onAddMeal={() => setShowAddMeal(true)}
          />
        </ScrollView>
      </SafeAreaView>

      <AddMealModal
        visible={showAddMeal}
        onClose={() => setShowAddMeal(false)}
        onAdd={addMeal}
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
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 38,
    marginTop: Spacing.two,
  },
});
