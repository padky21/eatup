import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import AddFoodModal from '@/components/add-food-modal';
import FoodItem from '@/components/food-item';
import { Accent, Surface } from '@/constants/theme';
import type { Food, Meal } from '@/types/nutrition';
import { getMealCalories } from '@/utils/nutrition';

export type MealListProps = {
  meals: Meal[];
  currentMealId?: string;
  suggestedCalories: Map<string, number>;
  onToggleComplete: (id: string) => void;
  onAddFood: (mealId: string, food: Food) => void;
  onRemoveFood: (mealId: string, foodId: string) => void;
  onAddMeal?: () => void;
  expanded?: boolean;
};

export default function MealList({
  meals,
  currentMealId,
  suggestedCalories,
  onToggleComplete,
  onAddFood,
  onRemoveFood,
  onAddMeal,
  expanded = true,
}: MealListProps) {
  const [addFoodMealId, setAddFoodMealId] = useState<string | null>(null);
  const sortedMeals = [...meals].sort((a, b) => a.order - b.order);
  const addFoodMeal = sortedMeals.find((m) => m.id === addFoodMealId);

  return (
    <>
      <View style={styles.container}>
        {sortedMeals.map((meal, index) => (
          <MealCard
            key={meal.id}
            meal={meal}
            isCurrent={meal.id === currentMealId}
            isLast={index === sortedMeals.length - 1}
            suggestedCalories={suggestedCalories.get(meal.id)}
            onToggleComplete={() => onToggleComplete(meal.id)}
            onAddFood={() => setAddFoodMealId(meal.id)}
            onRemoveFood={(foodId) => onRemoveFood(meal.id, foodId)}
            expanded={expanded}
          />
        ))}

        {onAddMeal && (
          <Pressable
            onPress={onAddMeal}
            style={({ pressed }) => [styles.addMealRow, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={styles.plusCircle}>
              <Text style={styles.plusText}>+</Text>
            </View>
            <Text style={styles.addMealText}>Add meal</Text>
          </Pressable>
        )}
      </View>

      {addFoodMeal && (
        <AddFoodModal
          visible={addFoodMealId != null}
          mealName={addFoodMeal.name}
          onClose={() => setAddFoodMealId(null)}
          onAdd={(food) => onAddFood(addFoodMeal.id, food)}
        />
      )}
    </>
  );
}

type MealCardProps = {
  meal: Meal;
  isCurrent: boolean;
  isLast: boolean;
  suggestedCalories?: number;
  onToggleComplete: () => void;
  onAddFood: () => void;
  onRemoveFood: (foodId: string) => void;
  expanded: boolean;
};

function MealCard({
  meal,
  isCurrent,
  isLast,
  suggestedCalories,
  onToggleComplete,
  onAddFood,
  onRemoveFood,
  expanded,
}: MealCardProps) {
  const mealCalories = getMealCalories(meal);
  const kcalColor = meal.completed ? Accent.green : isCurrent ? '#FFFFFF' : Surface.textDim;
  const nameColor = meal.completed || isCurrent ? '#FFFFFF' : Surface.textDim;

  return (
    <View
      style={[
        styles.row,
        !isLast && styles.rowBorder,
        isCurrent && styles.rowCurrent,
        meal.completed && styles.rowCompleted,
      ]}
    >
      <Pressable
        onPress={onToggleComplete}
        hitSlop={8}
        style={[
          styles.checkbox,
          {
            borderColor: meal.completed ? Accent.green : '#4A4A4A',
            backgroundColor: meal.completed ? Accent.green : 'transparent',
          },
        ]}
      >
        {meal.completed && <Text style={styles.checkmark}>✓</Text>}
      </Pressable>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameWrapper}>
            <Text style={[styles.nameText, { color: nameColor }]} numberOfLines={1}>
              {meal.name}
            </Text>
            {isCurrent && !meal.completed && (
              <Text style={styles.currentBadge}> — current meal</Text>
            )}
            {meal.completed && <Text style={styles.completedBadge}> — completed</Text>}
          </View>

          <View style={styles.kcalRow}>
            <Text style={[styles.kcalText, { color: kcalColor }]}>
              {mealCalories.toLocaleString()} kcal
            </Text>
            <Pressable
              onPress={onAddFood}
              hitSlop={8}
              style={({ pressed }) => [styles.addFoodButton, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={styles.addFoodText}>+</Text>
            </Pressable>
          </View>
        </View>

        {!meal.completed && suggestedCalories != null && suggestedCalories > 0 && (
          <Text style={styles.suggestion}>
            Suggested: ~{suggestedCalories.toLocaleString()} kcal
          </Text>
        )}

        {expanded && meal.foods.length > 0 && (
          <View style={styles.foods}>
            {meal.foods.map((food) => (
              <FoodItem
                key={food.id}
                food={food}
                compact
                onRemove={() => onRemoveFood(food.id)}
              />
            ))}
          </View>
        )}

        {expanded && (
          <Pressable onPress={onAddFood} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
            <Text style={styles.addFoodLink}>+ add food</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Surface.border,
    backgroundColor: Surface.card,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Surface.border,
  },
  rowCurrent: {
    backgroundColor: Surface.elevated,
  },
  rowCompleted: {
    backgroundColor: 'rgba(184, 214, 58, 0.06)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkmark: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
  },
  currentBadge: {
    color: Accent.green,
    fontSize: 12,
    fontWeight: '500',
  },
  completedBadge: {
    color: Accent.green,
    fontSize: 12,
    fontWeight: '500',
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kcalText: {
    fontSize: 14,
    fontWeight: '700',
  },
  suggestion: {
    color: Surface.textDim,
    fontSize: 12,
    fontWeight: '500',
  },
  foods: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Surface.border,
  },
  addFoodButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#4A4A4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFoodText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: -1,
  },
  addFoodLink: {
    color: Surface.textDim,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  addMealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  plusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#4A4A4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: Surface.textDim,
    fontSize: 14,
    fontWeight: '600',
    marginTop: -1,
  },
  addMealText: {
    color: Surface.textDim,
    fontSize: 14,
    fontWeight: '500',
  },
});
