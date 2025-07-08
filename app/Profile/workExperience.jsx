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
  Switch, // For the "This is my current position" toggle
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker"; // For date pickers

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

const AddWorkExperienceScreen = () => {
  const router = useRouter();

  // State variables for form inputs
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCurrentPosition, setIsCurrentPosition] = useState(false);
  const [description, setDescription] = useState("");

  // State for showing date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  /**
   * Handles the change event for the date pickers.
   * @param {Event} event - The event object.
   * @param {Date} selectedDate - The date selected by the user.
   * @param {string} type - 'start' or 'end' to determine which date is being set.
   */
  const onDateChange = (event, selectedDate, type) => {
    const currentDate =
      selectedDate || (type === "start" ? startDate : endDate);
    if (type === "start") {
      setShowStartDatePicker(Platform.OS === "ios"); // Hide picker on Android after selection
      setStartDate(currentDate);
    } else {
      setShowEndDatePicker(Platform.OS === "ios"); // Hide picker on Android after selection
      setEndDate(currentDate);
    }
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
   * Handles the saving of the work experience.
   * Performs basic validation and then simulates saving the data.
   */
  const handleSave = () => {
    if (!jobTitle.trim() || !company.trim()) {
      Alert.alert("Error", "Job Title and Company are required.");
      return;
    }

    if (!isCurrentPosition && startDate >= endDate) {
      Alert.alert(
        "Error",
        "End Date must be after Start Date for past positions."
      );
      return;
    }

    const workExperienceData = {
      jobTitle,
      company,
      startDate: formatDate(startDate),
      endDate: isCurrentPosition ? "Present" : formatDate(endDate),
      isCurrentPosition,
      description: description.trim(),
    };
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
        <Text style={styles.headerTitle}>Add work experience</Text>
        <View style={styles.headerIconContainer} />
        {/* Placeholder for spacing */}
      </View>
      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Job Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Job title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Senior Product Designer"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={jobTitle}
            onChangeText={setJobTitle}
          />
        </View>
        {/* Company Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Company</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Google Inc."
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={company}
            onChangeText={setCompany}
          />
        </View>
        {/* Start Date & End Date Inputs */}
        <View style={styles.dateInputsContainer}>
          <View style={styles.dateInputGroup}>
            <Text style={styles.inputLabel}>Start date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateInputText}>
                {formatDate(startDate) || "Select Date"}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_GRAY}
              />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, date) => onDateChange(event, date, "start")}
              />
            )}
          </View>
          <View style={styles.dateInputGroup}>
            <Text style={styles.inputLabel}>End date</Text>
            <TouchableOpacity
              style={[
                styles.dateInput,
                isCurrentPosition && styles.dateInputDisabled,
              ]}
              onPress={() => setShowEndDatePicker(true)}
              disabled={isCurrentPosition}
            >
              <Text
                style={[
                  styles.dateInputText,
                  isCurrentPosition && styles.dateInputTextDisabled,
                ]}
              >
                {isCurrentPosition
                  ? "Present"
                  : formatDate(endDate) || "Select Date"}
              </Text>
              {!isCurrentPosition && (
                <Ionicons
                  name="calendar-outline"
                  size={FONT_SIZES.BODY_LARGE}
                  color={COLORS.TEXT_GRAY}
                />
              )}
            </TouchableOpacity>
            {showEndDatePicker && !isCurrentPosition && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, date) => onDateChange(event, date, "end")}
              />
            )}
          </View>
        </View>
        {/* Current Position Switch */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>This is my current position</Text>
          <Switch
            trackColor={{ false: COLORS.TEXT_LIGHT, true: COLORS.PRIMARY_BLUE }}
            thumbColor={COLORS.WHITE}
            ios_backgroundColor={COLORS.TEXT_LIGHT}
            onValueChange={setIsCurrentPosition}
            value={isCurrentPosition}
          />
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
            maxLength={1000} 
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
    paddingBottom: SPACING.XXL,
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
  dateInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.L,
  },
  dateInputGroup: {
    flex: 1,
    marginRight: SPACING.S, // Space between date inputs
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
  dateInputDisabled: {
    backgroundColor: COLORS.BACKGROUND, // Lighter background for disabled input
  },
  dateInputTextDisabled: {
    color: COLORS.TEXT_GRAY, // Gray out text for disabled input
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  switchLabel: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    fontWeight: "500",
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
  },
  saveButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default AddWorkExperienceScreen;
