import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export interface Meal {
    /** Unique id for this meal */
    id: string;
    /** e.g. "Breakfast", "Snack", or any custom name the user picks */
    name: string;
    /** Optional small tag next to the name, e.g. "Now" */
    subtitle?: string;
    /** Calories allocated/planned for this meal */
    targetCalories: number;
    /** Whether the user has marked this meal as logged/done */
    completed: boolean;
}

export interface MealListProps {
    meals: Meal[];
    /** Called when the checkbox is tapped for a meal */
    onToggleComplete: (id: string) => void;
    /** Called when the "add food" button is tapped for a meal */
    onAddFood: (id: string) => void;
    /** Called when the user taps "Add meal" at the bottom. Omit to hide the button. */
    onAddMeal?: () => void;
    /** Colors, all optional so you can wire in your theme later */
    colors?: {
        background?: string;
        rowActive?: string;
        border?: string;
        textPrimary?: string;
        textDim?: string;
        accent?: string;
        checkboxBorder?: string;
    };
}

const defaultColors = {
    background: '#1C1C1C',
    rowActive: '#242424',
    border: '#2E2E2E',
    textPrimary: '#FFFFFF',
    textDim: '#6E6E6E',
    accent: '#9ACD32',
    checkboxBorder: '#4A4A4A',
};

export default function MealList({
    meals,
    onToggleComplete,
    onAddFood,
    onAddMeal,
    colors: colorOverrides,
}: MealListProps) {
    const colors = { ...defaultColors, ...colorOverrides };

    // The first not-yet-completed meal is treated as the "current" one,
    // getting a highlighted row background, matching an active/"Now" state.
    const currentId = meals.find((m) => !m.completed)?.id;

    return (
        <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {meals.map((meal, index) => (
                <MealRow
                    key={meal.id}
                    meal={meal}
                    isCurrent={meal.id === currentId}
                    isLast={index === meals.length - 1}
                    colors={colors}
                    onToggleComplete={() => onToggleComplete(meal.id)}
                    onAddFood={() => onAddFood(meal.id)}
                />
            ))}

            {onAddMeal && (
                <Pressable
                    onPress={onAddMeal}
                    style={({ pressed }) => [
                        styles.addMealRow,
                        { opacity: pressed ? 0.6 : 1 },
                    ]}
                >
                    <View style={[styles.plusCircle, { borderColor: colors.checkboxBorder }]}>
                        <Text style={[styles.plusText, { color: colors.textDim }]}>+</Text>
                    </View>
                    <Text style={[styles.addMealText, { color: colors.textDim }]}>Add meal</Text>
                </Pressable>
            )}
        </View>
    );
}

function MealRow({
    meal,
    isCurrent,
    isLast,
    colors,
    onToggleComplete,
    onAddFood,
}: {
    meal: Meal;
    isCurrent: boolean;
    isLast: boolean;
    colors: Required<NonNullable<MealListProps['colors']>>;
    onToggleComplete: () => void;
    onAddFood: () => void;
}) {
    const kcalColor = meal.completed ? colors.accent : isCurrent ? colors.textPrimary : colors.textDim;
    const nameColor = meal.completed || isCurrent ? colors.textPrimary : colors.textDim;

    return (
        <View
            style={[
                styles.row,
                !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                isCurrent && { backgroundColor: colors.rowActive },
            ]}
        >
            <Pressable
                onPress={onToggleComplete}
                hitSlop={8}
                style={[
                    styles.checkbox,
                    {
                        borderColor: meal.completed ? colors.accent : colors.checkboxBorder,
                        backgroundColor: meal.completed ? colors.accent : 'transparent',
                    },
                ]}
            >
                {meal.completed && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>

            <View style={styles.nameWrapper}>
                <Text style={[styles.nameText, { color: nameColor }]} numberOfLines={1}>
                    {meal.name}
                </Text>
                {isCurrent && meal.subtitle && (
                    <Text style={[styles.subtitleText, { color: colors.textDim }]}> — {meal.subtitle}</Text>
                )}
            </View>

            <Text style={[styles.kcalText, { color: kcalColor }]}>
                {meal.targetCalories.toLocaleString()} kcal
            </Text>

            <Pressable
                onPress={onAddFood}
                hitSlop={8}
                style={({ pressed }) => [
                    styles.addFoodButton,
                    { borderColor: colors.checkboxBorder, opacity: pressed ? 0.6 : 1 },
                ]}
            >
                <Text style={[styles.addFoodText, { color: colors.textPrimary }]}>+</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
        alignSelf: 'stretch',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        color: '#111111',
        fontSize: 13,
        fontWeight: '700',
    },
    nameWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    nameText: {
        fontSize: 15,
        fontWeight: '500',
    },
    subtitleText: {
        fontSize: 13,
        fontWeight: '400',
    },
    kcalText: {
        fontSize: 14,
        fontWeight: '700',
    },
    addFoodButton: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addFoodText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: -1,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusText: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: -1,
    },
    addMealText: {
        fontSize: 14,
        fontWeight: '500',
    },
});