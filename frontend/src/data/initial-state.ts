import type { AppState, Meal } from '@/types/nutrition';
import { todayDateKey } from '@/utils/nutrition';

export const DEFAULT_CALORIE_TARGET = 3400;

export const DEFAULT_MEALS: Meal[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    order: 0,
    completed: true,
    foods: [
      { id: 'f1', name: 'Oats', calories: 380, quantity: 80, unit: 'g' },
      { id: 'f2', name: 'Banana', calories: 105, quantity: 1, unit: 'medium' },
      { id: 'f3', name: 'Milk', calories: 150, quantity: 250, unit: 'ml' },
    ],
  },
  {
    id: 'lunch',
    name: 'Lunch',
    order: 1,
    completed: true,
    foods: [
      { id: 'f4', name: 'Chicken breast', calories: 330, quantity: 200, unit: 'g' },
      { id: 'f5', name: 'Rice', calories: 412, quantity: 2, unit: 'cup' },
      { id: 'f6', name: 'Bread', calories: 160, quantity: 2, unit: 'slice' },
    ],
  },
  {
    id: 'snack',
    name: 'Snack',
    order: 2,
    completed: false,
    foods: [
      { id: 'f7', name: 'Peanut butter', calories: 188, quantity: 2, unit: 'tbsp' },
      { id: 'f8', name: 'Banana', calories: 105, quantity: 1, unit: 'medium' },
      { id: 'f9', name: 'Milk', calories: 150, quantity: 250, unit: 'ml' },
    ],
  },
  {
    id: 'dinner',
    name: 'Dinner',
    order: 3,
    completed: false,
    foods: [],
  },
];

export function createInitialState(): AppState {
  return {
    profile: {
      calorieTarget: DEFAULT_CALORIE_TARGET,
      weightGoal: 'bulk',
    },
    dailyPlan: {
      date: todayDateKey(),
      meals: DEFAULT_MEALS.map((m) => ({ ...m, foods: [...m.foods] })),
    },
  };
}

export const STORAGE_KEY = '@eatup/app-state';
