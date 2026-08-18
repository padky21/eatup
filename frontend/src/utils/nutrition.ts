import type { Food, FoodDatabaseItem, Meal } from '@/types/nutrition';

export function getFoodCalories(food: Food): number {
  return food.calories;
}

export function getMealCalories(meal: Meal): number {
  return meal.foods.reduce((sum, food) => sum + getFoodCalories(food), 0);
}

export function getConsumedCalories(meals: Meal[]): number {
  return meals.reduce((sum, meal) => sum + getMealCalories(meal), 0);
}

export function getRemainingCalories(consumed: number, target: number): number {
  return target - consumed;
}

export function getIncompleteMeals(meals: Meal[]): Meal[] {
  return [...meals].filter((m) => !m.completed).sort((a, b) => a.order - b.order);
}

export function getCurrentMealId(meals: Meal[]): string | undefined {
  return getIncompleteMeals(meals)[0]?.id;
}

/** Evenly split remaining calories across incomplete meals */
export function getSuggestedCaloriesPerMeal(
  remainingCalories: number,
  incompleteMeals: Meal[]
): Map<string, number> {
  const suggestions = new Map<string, number>();
  if (incompleteMeals.length === 0) return suggestions;

  const perMeal = Math.max(0, Math.round(remainingCalories / incompleteMeals.length));
  for (const meal of incompleteMeals) {
    suggestions.set(meal.id, perMeal);
  }
  return suggestions;
}

export function createFoodFromDatabaseItem(
  item: FoodDatabaseItem,
  quantity: number
): Food {
  const baseQty = item.defaultQuantity ?? 1;
  const factor = quantity / baseQty;

  return {
    id: `${item.id}-${Date.now()}`,
    name: item.name,
    calories: Math.round(item.calories * factor),
    protein: item.protein != null ? Math.round(item.protein * factor) : undefined,
    carbs: item.carbs != null ? Math.round(item.carbs * factor) : undefined,
    fat: item.fat != null ? Math.round(item.fat * factor) : undefined,
    quantity,
    unit: item.unit,
  };
}

export function formatTodayDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}
