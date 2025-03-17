import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; 
import { StatusBar } from 'expo-status-bar';
import InitialLayout from "@/components/initial-layout";
import ClerkAndConvexProvider from "@/providers/clerk-and-convex-provider";
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}
export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <StatusBar style="light" backgroundColor="#121212" />
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1}}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
