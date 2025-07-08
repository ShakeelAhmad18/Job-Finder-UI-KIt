import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// --- Constants (re-using from previous response for consistency) ---
export const COLORS = {
  BACKGROUND: "#F8F8F8",
  WHITE: "#FFFFFF",
  TEXT_DARK: "#0D0140",
  TEXT_GRAY: "#8E8E93",
  PRIMARY_BLUE: "#4A80F0", // Original primary blue, keeping for potential use
  PRIMARY_DARK_BLUE: "#130160", // New primary blue from user's constants
  ACCENT_PURPLE: "#8A2BE2",
  ACCENT_ORANGE: "#FF7A00", // Active card color
  LIGHT_BLUE: "#E0F2F7",
  LIGHT_PURPLE: "#E6E6FA", // Filter icon background
  LIGHT_ORANGE: "#FFF0E0",
  SHADOW: "rgba(0, 0, 0, 0.08)",
  BORDER_LIGHT: "#E0E0E0",

  // Derived colors for clarity and consistency with the image
  FILTER_ICON_BG: "#E6E6FA",
  FILTER_ICON_COLOR: "#0D0140",
  CHIP_ACTIVE_BG: "#FF7A00",
  BACKGROUND_LIGHT: "#F5F7FA", // User's provided background light
  TEXT_LIGHT: "#A0A4A8", // User's provided text light
  PRIMARY: "#130160", // Re-aliasing PRIMARY_DARK_BLUE for general use as primary
  BORDER_COLOR_LIGHT: "#E0E4E8", // Re-aliasing BORDER_LIGHT for clarity

  CHIP_ACTIVE_TEXT: "#FFFFFF",
  CHIP_INACTIVE_BG: "#FFFFFF",
  CHIP_INACTIVE_TEXT: "#0D0140",
};

export const FONT_SIZES = {
  H1: 24,
  H2: 18,
  BODY_LARGE: 16,
  BODY: 14,
  SMALL: 12,
  TINY: 10,
};

export const BORDER_RADIUS = {
  S: 4,
  M: 8,
  L: 16,
  XL: 24,
  XXL: 30,
};

export const SPACING = {
  XXS: 4,
  XS: 8,
  S: 12,
  M: 16,
  L: 20,
  XL: 24,
  XXL: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};
// --- End of Constants ---

const AboutMeScreen = () => {
  const router = useRouter();
  const [aboutText, setAboutText] = useState(""); // State to hold the text input

  /**
   * Handles the saving of the "About Me" text.
   * In a real application, this would typically involve:
   * 1. Sending the `aboutText` to a backend API or updating local storage/database.
   * 2. Showing a success/error message.
   * 3. Navigating back or to another screen.
   */
  const handleSave = () => {
    // Simulate saving data
    console.log("Saving About Me:", aboutText);
    Alert.alert("Success", "Your 'About Me' information has been saved.");
    // In a real app, you might navigate back after saving:
    // router.back();
  };

  return (
    <KeyboardAvoidingView // Ensures content adjusts when keyboard appears
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconContainer}
        >
          <Ionicons
            name="arrow-back"
            size={FONT_SIZES.H2}
            color={COLORS.TEXT_DARK}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About me</Text>
        {/* Placeholder for right-side icon if needed, otherwise keep empty for spacing */}
        <View style={styles.headerIconContainer} />
      </View>

      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Input Field for About Me */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="Tell me about you."
            placeholderTextColor={COLORS.TEXT_GRAY}
            multiline={true} // Allow multiple lines of text
            textAlignVertical="top" // Align placeholder text to the top
            value={aboutText}
            onChangeText={setAboutText}
            maxLength={500} // Optional: limit character count
          />
        </View>

        {/* Spacer to push the button to the bottom */}
        <View style={{ flex: 1 }} />
      </ScrollView>

      {/* Save Button - positioned at the bottom */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>SAVE</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.M,
    backgroundColor: COLORS.WHITE,
    ...SHADOWS.small,
    zIndex: 10,
    borderBottomLeftRadius: BORDER_RADIUS.M,
    borderBottomRightRadius: BORDER_RADIUS.M,
  },
  headerIconContainer: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  contentScrollView: {
    flex: 1,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.L,
  },
  scrollViewContentContainer: {
    flexGrow: 1, // Allows content to grow and push the button down
    justifyContent: "space-between", // Distribute space between input and button
    paddingBottom: SPACING.XXL, // Add padding at the bottom for the button
  },
  inputCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    ...SHADOWS.small,
    minHeight: 200, // Minimum height for the text area
    marginBottom: SPACING.XL, // Space below the input field
  },
  textInput: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    flex: 1, // Allow text input to expand vertically
    padding: SPACING.S, // Padding inside the text input
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY, // Use the primary dark blue
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    marginHorizontal: SPACING.XL, // Match screen padding
    marginBottom: SPACING.XXL, // Space from the bottom of the screen
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium, // More prominent shadow for the button
  },
  saveButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase", // Uppercase text as in the image
  },
});

export default AboutMeScreen;
