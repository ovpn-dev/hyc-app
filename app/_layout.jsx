import { useEffect } from "react";
import { useFonts } from "expo-font";
import "react-native-url-polyfill/auto";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { Linking } from "react-native";
import GlobalProvider from "../context/GlobalProvider";
import { NotificationHandler } from "../components/NotificationHandler"; // Adjust the import path as needed

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const router = useRouter();
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  // Handle deep links
  useEffect(() => {
    // Handle deep links when app is already running
    const subscription = Linking.addEventListener("url", (event) => {
      // Deep links no longer need to handle auth-related actions
      console.log("Deep link received but auth is disabled:", event.url);
    });

    // Handle deep links when app is opened from a link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial deep link received:", url);
        // You can still handle non-auth deep links here if needed
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // We can remove the handleDeepLink function since auth-related links are no longer needed
  // If you still need to handle other deep links, keep a simplified version

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      // Optional: Auto-redirect to home screen after splash
      // This ensures users don't need to go through auth screens
      // router.replace("/home");
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GlobalProvider>
      <NotificationHandler />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Keep auth routes for backward compatibility, but they'll redirect to home */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
        <Stack.Screen name="quotes" options={{ headerShown: false }} />
        <Stack.Screen name="blog" options={{ headerShown: false }} />
        <Stack.Screen name="needhelp" options={{ headerShown: false }} />
        <Stack.Screen name="tips" options={{ headerShown: false }} />
        {/* These password-related routes will be added back if auth is restored so keep */}
        {/* <Stack.Screen name="forgot-pw" options={{ headerShown: false }} />
        <Stack.Screen name="reset-pw" options={{ headerShown: false }} /> */}
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
