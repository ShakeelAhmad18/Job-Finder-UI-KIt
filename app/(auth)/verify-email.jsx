import { useSignUp } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import {
  COLORS,
  FONT_SIZES,
  BORDER_RADIUS,
  SPACING,
  SHADOWS,
} from "../../constants/helpers";
import { Ionicons } from "@expo/vector-icons";

const VerifyEmailScreen = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const signupAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signupAttempt.status === "complete") {
        await setActive({ session: signupAttempt.createdSessionId });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.errors?.[0]?.message || "Verification failed. Please try again."
      );
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to{" "}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
          </View>

          {/* Verification Code Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter verification code"
              placeholderTextColor={COLORS.TEXT_LIGHT}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              maxLength={6}
            />
            <Ionicons
              name="keypad-outline"
              size={20}
              color={COLORS.TEXT_LIGHT}
              style={styles.inputIcon}
            />
          </View>

          {/* Verification Button */}
          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.buttonDisabled]}
            onPress={handleVerification}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>
          {/* Resend Code Option */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive a code?</Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>Resend code</Text>
            </TouchableOpacity>
          </View>
          {/* Back to Sign Up Link */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons
              name="arrow-back-outline"
              size={16}
              color={COLORS.PRIMARY_BLUE}
              style={styles.backIcon}
            />
            <Text style={styles.backText}>Back to Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.XL,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.XXL,
    paddingBottom: SPACING.XL,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.XXL,
  },
  logo: {
    width: 120,
    height: 120,
  },
  header: {
    marginBottom: SPACING.M,
  },
  title: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 22,
  },
  emailHighlight: {
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    marginBottom: SPACING.M,
    ...SHADOWS.small,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    letterSpacing: 2,
  },
  inputIcon: {
    marginLeft: SPACING.XS,
  },
  verifyButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
    marginTop: SPACING.S,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.M,
  },
  resendText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT,
  },
  resendLink: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "bold",
    marginLeft: SPACING.XS,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.M,
  },
  backIcon: {
    marginRight: SPACING.XS,
  },
  backText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "500",
  },
});

export default VerifyEmailScreen;
