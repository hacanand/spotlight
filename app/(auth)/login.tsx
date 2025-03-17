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
      const { setActive, createdSessionId } = await startSSOFlow({ strategy: 'oauth_google' })
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId })
        router.replace('/(tabs)')
      }
    } catch (error) {
      console.error('oauth error');
    }
  }
    return (
      <View style={styles.container}>
        {/* //brand section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>spotlight</Text>
          <Text style={styles.tagline}>don't miss anything</Text>
        </View>
        {/* //illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("@/assets/images/Fingerprint-bro.png")}
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
