import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  COLORS,
  FONT_SIZES,
  BORDER_RADIUS,
  SPACING,
  SHADOWS,
  GRADIENTS,
} from "../../constants/helpers";

const SignInScreen = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {isSignedIn}=useAuth();

   if (isSignedIn) {
      return <Redirect href={"/"} />;
    }

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!isLoaded) return;

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("(tabs)");
      } else {
        Alert.alert("Error", "Sign in failed, please try again");
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      Alert.alert("Error", error.errors?.[0]?.message || "Sign in failed");
      console.error("Sign-in error:", error);
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to find your dream job
            </Text>
          </View>
          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Email Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.TEXT_LIGHT}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="your@email.com"
                  placeholderTextColor={COLORS.TEXT_LIGHT}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.TEXT_LIGHT}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.TEXT_LIGHT}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.TEXT_LIGHT}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color={COLORS.WHITE} />
                  )}
                </View>
                <Text style={styles.checkboxText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.WHITE} size="small" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Options */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => console.log("Google sign in")}
              >
                <Image
                  source={require("../../assets/images/google_logo.png")}
                  style={styles.socialIcon}
                  contentFit="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => console.log("Apple sign in")}
              >
                <Image
                  source={require("../../assets/images/apple_icon.png")}
                  style={styles.socialIcon}
                  contentFit="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => console.log("Facebook sign in")}
              >
                <Image
                  source={require("../../assets/images/facebook-icon.png")}
                  style={styles.socialIcon}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/sign-up")}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.XXL,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.XXL,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: SPACING.L,
  },
  title: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    paddingHorizontal: SPACING.XL,
    lineHeight: 24,
  },
  formContainer: {
    marginTop: SPACING.XL,
  },
  inputWrapper: {
    marginBottom: SPACING.L,
  },
  label: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    borderWidth: 1,
    borderColor: COLORS.INPUT_BORDER_COLOR,
    paddingHorizontal: SPACING.M,
    height: 56,
    ...SHADOWS.small,
  },
  inputIcon: {
    marginRight: SPACING.S,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    paddingVertical: SPACING.M,
    height: "100%",
  },
  eyeButton: {
    padding: SPACING.XS,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.XL,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.S,
    borderWidth: 1,
    borderColor: COLORS.INPUT_BORDER_COLOR,
    backgroundColor: COLORS.WHITE,
    marginRight: SPACING.XS,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  checkboxText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DARK,
  },
  forgotPasswordLink: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontWeight: "500",
  },
  authButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.L,
    paddingVertical: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.XL,
    height: 56,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.WHITE,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.XL,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_LIGHT,
    paddingHorizontal: SPACING.M,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.L,
    marginBottom: SPACING.XXL,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.M,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.small,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.XS,
  },
  footerText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
  },
  footerLink: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
});

export default SignInScreen;
