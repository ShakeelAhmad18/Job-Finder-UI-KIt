import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </SafeAreaView>
  );
}
