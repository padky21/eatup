import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { createInitialState, STORAGE_KEY } from '@/data/initial-state';
import type { AppState, Food, Meal, UserProfile } from '@/types/nutrition';
import {
  getConsumedCalories,
  getIncompleteMeals,
  getRemainingCalories,
  getSuggestedCaloriesPerMeal,
  todayDateKey,
} from '@/utils/nutrition';

type AppAction =
  | { type: 'HYDRATE'; state: AppState }
  | { type: 'SET_PROFILE'; profile: Partial<UserProfile> }
  | { type: 'ADD_MEAL'; name: string }
  | { type: 'RENAME_MEAL'; id: string; name: string }
  | { type: 'DELETE_MEAL'; id: string }
  | { type: 'REORDER_MEALS'; mealIds: string[] }
  | { type: 'TOGGLE_MEAL_COMPLETE'; id: string }
  | { type: 'ADD_FOOD'; mealId: string; food: Food }
  | { type: 'REMOVE_FOOD'; mealId: string; foodId: string }
  | { type: 'UPDATE_FOOD'; mealId: string; foodId: string; updates: Partial<Food> };

function sortMeals(meals: Meal[]): Meal[] {
  return [...meals].sort((a, b) => a.order - b.order);
}

function reindexMeals(meals: Meal[]): Meal[] {
  return sortMeals(meals).map((meal, index) => ({ ...meal, order: index }));
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'SET_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.profile },
      };

    case 'ADD_MEAL': {
      const newMeal: Meal = {
        id: `meal-${Date.now()}`,
        name: action.name,
        foods: [],
        completed: false,
        order: state.dailyPlan.meals.length,
      };
      return {
        ...state,
        dailyPlan: {
          ...state.dailyPlan,
          meals: [...state.dailyPlan.meals, newMeal],
        },
      };
    }

    case 'RENAME_MEAL':
      return {
        ...state,
        dailyPlan: {
          ...state.dailyPlan,
          meals: state.dailyPlan.meals.map((m) =>
            m.id === action.id ? { ...m, name: action.name } : m
          ),
        },
      };

    case 'DELETE_MEAL':
      return {
        ...state,
        dailyPlan: {
          ...state.dailyPlan,
          meals: reindexMeals(state.dailyPlan.meals.filter((m) => m.id !== action.id)),
        },
      };

    case 'REORDER_MEALS': {
      const orderMap = new Map(action.mealIds.map((id, index) => [id, index]));
      const meals = state.dailyPlan.meals.map((m) => ({
        ...m,
        order: orderMap.get(m.id) ?? m.order,
      }));
      return {
        ...state,
        dailyPlan: { ...state.dailyPlan, meals: reindexMeals(meals) },
      };
    }

    case 'TOGGLE_MEAL_COMPLETE':
      return {
        ...state,
        dailyPlan: {
          ...state.dailyPlan,
          meals: state.dailyPlan.meals.map((m) =>
            m.id === action.id ? { ...m, completed: !m.completed } : m
          ),
        },
      };

    case 'ADD_FOOD':
      return {
        ...state,
        dailyPlan: {
          ...state.dailyPlan,
          meals: state.dailyPlan.meals.map((m) =>
            m.id === action.mealId ? { ...m, foods: [...m.foods, action.food] } : m
          ),
        },
      };

    case 'REMOVE_FOOD':
      return {
        ...state,
        dailyPlan: {
          ...state.dailyPlan,
          meals: state.dailyPlan.meals.map((m) =>
            m.id === action.mealId
              ? { ...m, foods: m.foods.filter((f) => f.id !== action.foodId) }
              : m
          ),
        },
      };

    case 'UPDATE_FOOD':
      return {
        ...state,
        dailyPlan: {
          ...state.dailyPlan,
          meals: state.dailyPlan.meals.map((m) =>
            m.id === action.mealId
              ? {
                  ...m,
                  foods: m.foods.map((f) =>
                    f.id === action.foodId ? { ...f, ...action.updates } : f
                  ),
                }
              : m
          ),
        },
      };

    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  isHydrated: boolean;
  consumedCalories: number;
  remainingCalories: number;
  suggestedCalories: Map<string, number>;
  currentMealId: string | undefined;
  setProfile: (profile: Partial<UserProfile>) => void;
  addMeal: (name: string) => void;
  renameMeal: (id: string, name: string) => void;
  deleteMeal: (id: string) => void;
  reorderMeals: (mealIds: string[]) => void;
  toggleMealComplete: (id: string) => void;
  addFood: (mealId: string, food: Food) => void;
  removeFood: (mealId: string, foodId: string) => void;
  updateFood: (mealId: string, foodId: string, updates: Partial<Food>) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function normalizeHydratedState(parsed: AppState): AppState {
  const today = todayDateKey();
  if (parsed.dailyPlan.date !== today) {
    return {
      profile: parsed.profile,
      dailyPlan: {
        date: today,
        meals: [...parsed.dailyPlan.meals]
          .sort((a, b) => a.order - b.order)
          .map((m, i) => ({
            ...m,
            foods: [],
            completed: false,
            order: i,
          })),
      },
    };
  }
  return parsed;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, null, createInitialState);
  const [isHydrated, setIsHydrated] = React.useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as AppState;
            dispatch({ type: 'HYDRATE', state: normalizeHydratedState(parsed) });
          } catch {
            dispatch({ type: 'HYDRATE', state: createInitialState() });
          }
        }
      })
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, isHydrated]);

  const meals = state.dailyPlan.meals;
  const calorieTarget = state.profile.calorieTarget;
  const consumedCalories = useMemo(() => getConsumedCalories(meals), [meals]);
  const remainingCalories = useMemo(
    () => getRemainingCalories(consumedCalories, calorieTarget),
    [consumedCalories, calorieTarget]
  );
  const incompleteMeals = useMemo(() => getIncompleteMeals(meals), [meals]);
  const suggestedCalories = useMemo(
    () => getSuggestedCaloriesPerMeal(remainingCalories, incompleteMeals),
    [remainingCalories, incompleteMeals]
  );
  const currentMealId = incompleteMeals[0]?.id;

  const setProfile = useCallback((profile: Partial<UserProfile>) => {
    dispatch({ type: 'SET_PROFILE', profile });
  }, []);

  const addMeal = useCallback((name: string) => {
    dispatch({ type: 'ADD_MEAL', name });
  }, []);

  const renameMeal = useCallback((id: string, name: string) => {
    dispatch({ type: 'RENAME_MEAL', id, name });
  }, []);

  const deleteMeal = useCallback((id: string) => {
    dispatch({ type: 'DELETE_MEAL', id });
  }, []);

  const reorderMeals = useCallback((mealIds: string[]) => {
    dispatch({ type: 'REORDER_MEALS', mealIds });
  }, []);

  const toggleMealComplete = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_MEAL_COMPLETE', id });
  }, []);

  const addFood = useCallback((mealId: string, food: Food) => {
    dispatch({ type: 'ADD_FOOD', mealId, food });
  }, []);

  const removeFood = useCallback((mealId: string, foodId: string) => {
    dispatch({ type: 'REMOVE_FOOD', mealId, foodId });
  }, []);

  const updateFood = useCallback((mealId: string, foodId: string, updates: Partial<Food>) => {
    dispatch({ type: 'UPDATE_FOOD', mealId, foodId, updates });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      isHydrated,
      consumedCalories,
      remainingCalories,
      suggestedCalories,
      currentMealId,
      setProfile,
      addMeal,
      renameMeal,
      deleteMeal,
      reorderMeals,
      toggleMealComplete,
      addFood,
      removeFood,
      updateFood,
    }),
    [
      state,
      isHydrated,
      consumedCalories,
      remainingCalories,
      suggestedCalories,
      currentMealId,
      setProfile,
      addMeal,
      renameMeal,
      deleteMeal,
      reorderMeals,
      toggleMealComplete,
      addFood,
      removeFood,
      updateFood,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
