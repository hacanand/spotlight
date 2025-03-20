import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function Login() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
const handleGoogleSignIn = async () => {
  try {
    const response = await startSSOFlow({ strategy: "oauth_google" });
    

    const { setActive, createdSessionId } = response;

    if (setActive && createdSessionId) {
      setActive({ session: createdSessionId });
      router.replace("/(tabs)"); // Ensure '/(tabs)' is a valid path in your app
    } else {
      console.error("OAuth flow failed: Missing required data");
    }
  } catch (error) {
    console.error("OAuth error:", error); // Log the actual error
  }
};

    return (
      <View style={styles.container}>
        {/* //brand section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>spotlight</Text>
          <Text style={styles.tagline}>don't miss anything</Text>
        </View>
        {/* //illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("@/assets/images/login-screen.png")}
            style={styles.illustration}
            resizeMode="cover"
          />
        </View>
        {/* //login section */}
        <View style={styles.loginSection}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.9}
          >
            <View style={styles.googleIconContainer}>
              <Ionicons name="logo-google" size={20} color={COLORS.surface} />
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By Continuing, you agree to our Terms and Privacy Policy
          </Text>
        </View>
      </View>
    );
  }
