export type Food = {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  quantity?: number;
  unit?: string;
};

export type Meal = {
  id: string;
  name: string;
  foods: Food[];
  completed: boolean;
  order: number;
};

export type FoodDatabaseItem = {
  id: string;
  name: string;
  /** Calories per default serving */
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  defaultQuantity?: number;
  unit?: string;
};

export type UserProfile = {
  calorieTarget: number;
  currentWeight?: number;
  targetWeight?: number;
  weightGoal?: 'bulk' | 'maintain' | 'cut';
};

export type DailyPlan = {
  date: string;
  meals: Meal[];
};

export type AppState = {
  profile: UserProfile;
  dailyPlan: DailyPlan;
};
