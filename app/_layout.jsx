import { Slot, SplashScreen } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeScreen from "../components/SafeScreen";
import { View, Image, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState, useCallback } from "react";

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(null);

  useEffect(() => {
    async function prepare() {
      try {
        const hasLaunched = await SecureStore.getItemAsync("hasLaunched");
        setIsFirstLaunch(!hasLaunched);

        setIsSignedIn(false); 

        // Simulate loading
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn("Error in prepare:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady || isFirstLaunch === null || isSignedIn === null) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ClerkProvider tokenCache={tokenCache}>
        <SafeScreen>
          {isFirstLaunch ? (
            // Redirect to onboarding flow
            <Slot initialRouteName="(onboarding)" />
          ) : isSignedIn ? (
            // User is signed in - show main app
            <Slot initialRouteName="(tabs)" />
          ) : (
            // User is not signed in - show auth screens
            <Slot initialRouteName="(auth)" />
          )}
        </SafeScreen>
      </ClerkProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D0140",
  },
  image: {
    width: "30%",
    height: "30%",
  },
});
