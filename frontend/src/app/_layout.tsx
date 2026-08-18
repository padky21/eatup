import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppProvider } from '@/context/app-context';
import { Surface } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const EatUpDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Surface.base,
    card: Surface.card,
    border: Surface.border,
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? EatUpDarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </AppProvider>
  );
}
