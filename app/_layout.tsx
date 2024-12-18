import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Ionicons } from '@expo/vector-icons';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ConvexProvider client={convex}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#EEA217',
            },
            headerTintColor: '#fff',
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerTitle: 'My Chats',
              headerRight: () => (
                <Link href={'/(modal)/createGroup'} asChild>
                  <TouchableOpacity>
                    <Ionicons name="add" size={32} color="white" />
                  </TouchableOpacity>
                </Link>
              ),
            }}
          />
          <Stack.Screen
            name="(modal)/createGroup"
            options={{
              headerTitle: 'Start a Chat',
              presentation: 'modal',
            }}
          />
          <Stack.Screen name="(chat)/[chatId]" options={{ headerTitle: 'Test' }} />
        </Stack>
      </ThemeProvider>
    </ConvexProvider>
  );
}
