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
import DateTimePicker from "@react-native-community/datetimepicker"; // For date picker

// --- Constants (re-using from previous responses for consistency) ---
export const COLORS = {
  BACKGROUND: "#F8F8F8",
  WHITE: "#FFFFFF",
  TEXT_DARK: "#0D0140",
  TEXT_GRAY: "#8E8E93",
  PRIMARY_BLUE: "#4A80F0",
  PRIMARY_DARK_BLUE: "#130160",
  ACCENT_PURPLE: "#8A2BE2",
  ACCENT_ORANGE: "#FF7A00",
  LIGHT_BLUE: "#E0F2F7",
  LIGHT_PURPLE: "#E6E6FA",
  LIGHT_ORANGE: "#FFF0E0",
  SHADOW: "rgba(0, 0, 0, 0.08)",
  BORDER_LIGHT: "#E0E0E0",

  FILTER_ICON_BG: "#E6E6FA",
  FILTER_ICON_COLOR: "#0D0140",
  CHIP_ACTIVE_BG: "#FF7A00",
  BACKGROUND_LIGHT: "#F5F7FA",
  TEXT_LIGHT: "#A0A4A8",
  PRIMARY: "#130160",
  BORDER_COLOR_LIGHT: "#E0E4E8",

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

const AddAppreciationScreen = () => {
  const router = useRouter();

  // State variables for form inputs
  const [awardName, setAwardName] = useState("");
  const [categoryAchievement, setCategoryAchievement] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");

  // State for showing date picker
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  /**
   * Handles the change event for the date picker.
   * @param {Event} event - The event object.
   * @param {Date} selectedDate - The date selected by the user.
   */
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios"); // Hide picker on Android after selection
    setEndDate(currentDate);
  };

  /**
   * Formats a Date object into a readable string (e.g., "Jan 2023").
   * @param {Date} date - The date object to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  /**
   * Handles the saving of the appreciation entry.
   * Performs basic validation and then simulates saving the data.
   */
  const handleSave = () => {
    if (!awardName.trim() || !categoryAchievement.trim()) {
      Alert.alert("Error", "Award Name and Category/Achievement are required.");
      return;
    }

    const appreciationData = {
      awardName,
      categoryAchievement,
      endDate: formatDate(endDate),
      description: description.trim(),
    };

    console.log("Saving Appreciation:", appreciationData);
    Alert.alert("Success", "Appreciation entry saved successfully!");
    // In a real app, you would typically:
    // 1. Send appreciationData to your backend/database.
    // 2. Handle success/error from the API.
    // 3. Navigate back: router.back();
  };

  return (
    <KeyboardAvoidingView
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
        <Text style={styles.headerTitle}>Add Appreciation</Text>
        <View style={styles.headerIconContainer} />{" "}
        {/* Placeholder for spacing */}
      </View>

      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Award Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Award name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Young Scientist Award"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={awardName}
            onChangeText={setAwardName}
          />
        </View>

        {/* Category/Achievement Achieved Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category/Achievement achieved</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Wireless Symposium (RWS)"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={categoryAchievement}
            onChangeText={setCategoryAchievement}
          />
        </View>

        {/* End Date Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>End date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateInputText}>
              {formatDate(endDate) || "Select Date"}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={FONT_SIZES.BODY_LARGE}
              color={COLORS.TEXT_GRAY}
            />
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Write additional information here"
            placeholderTextColor={COLORS.TEXT_GRAY}
            multiline={true}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
            maxLength={1000} // Optional: limit character count
          />
        </View>

        {/* Spacer to push the button to the bottom */}
        <View style={{ flex: 1 }} />
      </ScrollView>

      {/* Save Button */}
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
    flexGrow: 1,
    paddingBottom: SPACING.XXL * 2, // Ensure enough space for the fixed button
  },
  inputGroup: {
    marginBottom: SPACING.L,
  },
  inputLabel: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    fontWeight: "600",
    marginBottom: SPACING.S,
  },
  textInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  dateInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...SHADOWS.small,
  },
  dateInputText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
  },
  textAreaInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    minHeight: 120, // Set a minimum height for the text area
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    marginHorizontal: SPACING.XL,
    marginBottom: SPACING.XXL,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
    position: "absolute", // Fixed position at the bottom
    bottom: 0, // Align to bottom
    left: SPACING.XL, // Match horizontal padding
    right: SPACING.XL, // Match horizontal padding
    width: `auto`, // Allow width to be determined by left/right
    zIndex: 100, // Ensure it's above other content
  },
  saveButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default AddAppreciationScreen;
