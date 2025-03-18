import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; 
import { StatusBar } from 'expo-status-bar';
import InitialLayout from "@/components/initial-layout";
import ClerkAndConvexProvider from "@/providers/clerk-and-convex-provider";
 
export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <StatusBar style="light"  />
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1,backgroundColor:'#000'}}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  );
}
