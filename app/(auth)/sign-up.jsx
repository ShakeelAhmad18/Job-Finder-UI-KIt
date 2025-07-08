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
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONT_SIZES,
  BORDER_RADIUS,
  SPACING,
  SHADOWS,
} from "../../constants/helpers";
import VerifyEmailScreen from "./verify-email";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
     const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignUpPress = async () => {
    if (!validateForm()) return;
    if (!isLoaded) return;

    setLoading(true);
    setErrors({});

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: email,  
        password
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      setPendingVerification(true);
    } catch (err) {
      console.error("Sign up error:", JSON.stringify(err, null, 2));
      
      if (err.errors) {
        const clerkError = err.errors[0];
        if (clerkError.code === "client_state_invalid") {
          setErrors({ form: "Please complete all fields correctly" });
        } else {
          setErrors({ form: clerkError.longMessage || clerkError.message });
        }
      } else {
        setErrors({ form: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return <VerifyEmailScreen email={email} onBack={() => setPendingVerification(false)} />;
  }

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
          {/* Header Section */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Join us to get started with your personalized experience
            </Text>
          </View>

          {/* Error Message */}
          {errors.form && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={20} color={COLORS.ERROR} />
              <Text style={styles.errorText}>{errors.form}</Text>
            </View>
          )}

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[
                styles.inputContainer,
                errors.fullName && styles.inputError
              ]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.TEXT_LIGHT}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="John Doe"
                  placeholderTextColor={COLORS.TEXT_LIGHT}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) setErrors({...errors, fullName: ''});
                  }}
                  autoCapitalize="words"
                />
              </View>
              {errors.fullName && (
                <Text style={styles.fieldError}>{errors.fullName}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[
                styles.inputContainer,
                errors.email && styles.inputError
              ]}>
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
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && (
                <Text style={styles.fieldError}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[
                styles.inputContainer,
                errors.password && styles.inputError
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.TEXT_LIGHT}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="At least 8 characters"
                  placeholderTextColor={COLORS.TEXT_LIGHT}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
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
              {errors.password && (
                <Text style={styles.fieldError}>{errors.password}</Text>
              )}
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{" "}
                <Text style={styles.link}>Terms of Service</Text> and{" "}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.buttonDisabled]}
              onPress={onSignUpPress}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.WHITE} size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
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
                onPress={() => console.log("Google sign up")}
              >
                <Image
                  source={require("../../assets/images/google_logo.png")}
                  style={styles.socialIcon}
                  contentFit="contain"
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => console.log("Apple sign up")}
              >
                <Image
                  source={require("../../assets/images/apple_icon.png")}
                  style={styles.socialIcon}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/sign-in")}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.ERROR_LIGHT,
    padding: SPACING.M,
    borderRadius: BORDER_RADIUS.M,
    marginBottom: SPACING.M,
  },
  errorText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.ERROR,
    marginLeft: SPACING.S,
    flex: 1,
  },
  formContainer: {
    marginTop: SPACING.M,
  },
  inputGroup: {
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
  inputError: {
    borderColor: COLORS.ERROR,
  },
  inputIcon: {
    marginRight: SPACING.S,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    paddingVertical: SPACING.S,
    height: "100%",
  },
  eyeButton: {
    padding: SPACING.XS,
  },
  fieldError: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
  },
  termsContainer: {
    marginVertical: SPACING.M,
  },
  termsText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
  },
  link: {
    color: COLORS.PRIMARY,
    fontWeight: "500",
  },
  signUpButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.L,
    paddingVertical: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.M,
    height: 56,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
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
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.XS,
  },
  signInText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
  },
  signInLink: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
});