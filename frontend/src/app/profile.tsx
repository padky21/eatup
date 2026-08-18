import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Accent, BottomTabInset, MaxContentWidth, Spacing, Surface } from '@/constants/theme';
import { useApp } from '@/context/app-context';

export default function ProfileScreen() {
  const { state, setProfile } = useApp();
  const { profile } = state;
  const mealCount = state.dailyPlan.meals.length;

  const [targetInput, setTargetInput] = useState(String(profile.calorieTarget));
  const [currentWeightInput, setCurrentWeightInput] = useState(
    profile.currentWeight != null ? String(profile.currentWeight) : ''
  );
  const [targetWeightInput, setTargetWeightInput] = useState(
    profile.targetWeight != null ? String(profile.targetWeight) : ''
  );

  const saveTarget = () => {
    const value = parseInt(targetInput, 10);
    if (value > 0) setProfile({ calorieTarget: value });
  };

  const saveWeights = () => {
    const current = parseFloat(currentWeightInput);
    const target = parseFloat(targetWeightInput);
    setProfile({
      currentWeight: Number.isFinite(current) ? current : undefined,
      targetWeight: Number.isFinite(target) ? target : undefined,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle" style={styles.title}>
            Profile
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
            Your bulking settings
          </ThemedText>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily calorie target</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={targetInput}
                onChangeText={setTargetInput}
                keyboardType="number-pad"
                onBlur={saveTarget}
              />
              <Text style={styles.unit}>kcal</Text>
            </View>
            <Pressable onPress={saveTarget} style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
              <Text style={styles.saveBtnText}>Save target</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weight goal</Text>
            <View style={styles.goalRow}>
              {(['bulk', 'maintain', 'cut'] as const).map((goal) => (
                <Pressable
                  key={goal}
                  onPress={() => setProfile({ weightGoal: goal })}
                  style={[
                    styles.goalChip,
                    profile.weightGoal === goal && styles.goalChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.goalChipText,
                      profile.weightGoal === goal && styles.goalChipTextActive,
                    ]}
                  >
                    {goal.charAt(0).toUpperCase() + goal.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Body weight</Text>
            <View style={styles.weightRow}>
              <View style={styles.weightField}>
                <Text style={styles.fieldLabel}>Current</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={currentWeightInput}
                    onChangeText={setCurrentWeightInput}
                    keyboardType="decimal-pad"
                    placeholder="—"
                    placeholderTextColor={Surface.textDim}
                  />
                  <Text style={styles.unit}>kg</Text>
                </View>
              </View>
              <View style={styles.weightField}>
                <Text style={styles.fieldLabel}>Target</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={targetWeightInput}
                    onChangeText={setTargetWeightInput}
                    keyboardType="decimal-pad"
                    placeholder="—"
                    placeholderTextColor={Surface.textDim}
                  />
                  <Text style={styles.unit}>kg</Text>
                </View>
              </View>
            </View>
            <Pressable onPress={saveWeights} style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
              <Text style={styles.saveBtnText}>Save weight</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal plan</Text>
            <Text style={styles.infoText}>
              {mealCount} meals configured · manage on the Meals tab
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    gap: Spacing.three,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: Spacing.two,
  },
  subtitle: {
    marginBottom: Spacing.one,
  },
  section: {
    backgroundColor: Surface.card,
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Surface.border,
    gap: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Surface.elevated,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  unit: {
    color: Surface.textDim,
    fontSize: 15,
    fontWeight: '500',
    minWidth: 36,
  },
  saveBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Accent.green,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  saveBtnText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  goalRow: {
    flexDirection: 'row',
    gap: 8,
  },
  goalChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Surface.elevated,
    alignItems: 'center',
  },
  goalChipActive: {
    backgroundColor: Accent.green,
  },
  goalChipText: {
    color: Surface.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  goalChipTextActive: {
    color: '#111111',
  },
  weightRow: {
    flexDirection: 'row',
    gap: 12,
  },
  weightField: {
    flex: 1,
    gap: 6,
  },
  fieldLabel: {
    color: Surface.textDim,
    fontSize: 13,
    fontWeight: '500',
  },
  infoText: {
    color: Surface.textDim,
    fontSize: 14,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
