import type { FoodDatabaseItem } from '@/types/nutrition';

/** Local mock food database — replace with API later */
export const FOOD_DATABASE: FoodDatabaseItem[] = [
  { id: 'rice', name: 'Rice', calories: 206, protein: 4, carbs: 45, fat: 0, defaultQuantity: 1, unit: 'cup' },
  { id: 'chicken', name: 'Chicken breast', calories: 165, protein: 31, carbs: 0, fat: 4, defaultQuantity: 100, unit: 'g' },
  { id: 'eggs', name: 'Eggs', calories: 78, protein: 6, carbs: 1, fat: 5, defaultQuantity: 1, unit: 'egg' },
  { id: 'oats', name: 'Oats', calories: 150, protein: 5, carbs: 27, fat: 3, defaultQuantity: 40, unit: 'g' },
  { id: 'banana', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, defaultQuantity: 1, unit: 'medium' },
  { id: 'milk', name: 'Milk', calories: 150, protein: 8, carbs: 12, fat: 8, defaultQuantity: 250, unit: 'ml' },
  { id: 'pb', name: 'Peanut butter', calories: 188, protein: 7, carbs: 7, fat: 16, defaultQuantity: 2, unit: 'tbsp' },
  { id: 'pasta', name: 'Pasta', calories: 220, protein: 8, carbs: 43, fat: 1, defaultQuantity: 1, unit: 'cup' },
  { id: 'bread', name: 'Bread', calories: 80, protein: 3, carbs: 15, fat: 1, defaultQuantity: 1, unit: 'slice' },
  { id: 'tuna', name: 'Tuna', calories: 120, protein: 26, carbs: 0, fat: 1, defaultQuantity: 100, unit: 'g' },
];

export function searchFoods(query: string): FoodDatabaseItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return FOOD_DATABASE;
  return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q));
}
