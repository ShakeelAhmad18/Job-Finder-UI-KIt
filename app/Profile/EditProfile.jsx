import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker"; // For date picker
import * as ImagePicker from "expo-image-picker"; // For picking profile image

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

const EditProfileScreen = () => {
  const router = useRouter();

  // State for user profile data (simulated)
  const [profile, setProfile] = useState({
    fullName: "Brandone Louis",
    dateOfBirth: new Date(1992, 7, 6), // August 6, 1992
    gender: "Male", // 'Male', 'Female', or null
    email: "Brandonelouis@gmail.com",
    phoneNumber: "619 3456 7890",
    location: "California, United states",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg", // Default image
  });

  // State for date picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);

  /**
   * Handles changes to text input fields.
   * @param {string} field - The name of the profile field to update.
   * @param {string} value - The new value for the field.
   */
  const handleChangeText = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Handles date selection from the date picker.
   * @param {Event} event - The event object.
   * @param {Date} selectedDate - The date selected by the user.
   */
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || profile.dateOfBirth;
    setShowDatePicker(Platform.OS === "ios"); // Hide picker on Android after selection
    setProfile((prev) => ({ ...prev, dateOfBirth: currentDate }));
  };

  /**
   * Formats a Date object into a readable string (e.g., "06 August 1992").
   * @param {Date} date - The date object to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  /**
   * Handles picking a new profile image from the device's gallery.
   * Uses expo-image-picker for real-time image selection.
   */
  const handleChangeImage = async () => {
    try {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant media library permissions to change your profile image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Allow user to crop/edit the image
        aspect: [1, 1], // Force a square aspect ratio
        quality: 1, // High quality
      });

      if (!result.canceled) {
        setProfile((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
        Alert.alert("Success", "Profile image updated successfully!");
      } else {
        console.log("Image picking cancelled.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
      console.error("Image picking error:", error);
    }
  };

  /**
   * Handles saving the updated profile data.
   * Performs basic validation.
   */
  const handleSave = () => {
    if (
      !profile.fullName.trim() ||
      !profile.email.trim() ||
      !profile.location.trim()
    ) {
      Alert.alert("Error", "Full Name, Email, and Location are required.");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    console.log("Saving Profile Data:", profile);
    Alert.alert("Success", "Profile updated successfully!");
    // In a real app, you would send 'profile' data to your backend.
    // router.back();
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
            color={COLORS.WHITE}
          />
        </TouchableOpacity>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={styles.headerIconContainer}>
            <Feather name="share" size={FONT_SIZES.H2} color={COLORS.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconContainer} onPress={()=>router.push("Profile/Settings")}>
            <Ionicons
              name="settings-sharp"
              size={FONT_SIZES.H2}
              color={COLORS.WHITE}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.contentScrollView}
        // FIX: Adjusted paddingBottom to ensure content clears the fixed SAVE button
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeaderSection}>
          <Image source={{ uri: profile.profileImage }} style={styles.avatar} />
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.location}>{profile.location}</Text>
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={handleChangeImage}
          >
            <Text style={styles.changeImageButtonText}>Change image</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields Section */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fullname</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={profile.fullName}
              onChangeText={(text) => handleChangeText("fullName", text)}
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of birth</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateInputText}>
                {formatDate(profile.dateOfBirth)}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_GRAY}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={profile.dateOfBirth}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderOptionsContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === "Male" && styles.genderOptionSelected,
                ]}
                onPress={() => handleChangeText("gender", "Male")}
              >
                <Ionicons
                  name={
                    profile.gender === "Male"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={FONT_SIZES.BODY_LARGE}
                  color={
                    profile.gender === "Male"
                      ? COLORS.ACCENT_ORANGE
                      : COLORS.TEXT_GRAY
                  }
                />
                <Text
                  style={[
                    styles.genderText,
                    profile.gender === "Male" && styles.genderTextSelected,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderOption,
                  profile.gender === "Female" && styles.genderOptionSelected,
                ]}
                onPress={() => handleChangeText("gender", "Female")}
              >
                <Ionicons
                  name={
                    profile.gender === "Female"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={FONT_SIZES.BODY_LARGE}
                  color={
                    profile.gender === "Female"
                      ? COLORS.ACCENT_ORANGE
                      : COLORS.TEXT_GRAY
                  }
                />
                <Text
                  style={[
                    styles.genderText,
                    profile.gender === "Female" && styles.genderTextSelected,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.TEXT_GRAY}
              keyboardType="email-address"
              value={profile.email}
              onChangeText={(text) => handleChangeText("email", text)}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone number</Text>
            <View style={styles.phoneNumberContainer}>
              <TouchableOpacity style={styles.countryCodeDropdown}>
                <Text style={styles.countryCodeText}>1+</Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={FONT_SIZES.BODY_LARGE}
                  color={COLORS.TEXT_DARK}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.phoneNumberInput}
                placeholder="e.g., 619 3456 7890"
                placeholderTextColor={COLORS.TEXT_GRAY}
                keyboardType="phone-pad"
                value={profile.phoneNumber}
                onChangeText={(text) => handleChangeText("phoneNumber", text)}
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your location"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={profile.location}
              onChangeText={(text) => handleChangeText("location", text)}
            />
          </View>
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
    backgroundColor: COLORS.PRIMARY_DARK_BLUE, // Dark blue header background
    zIndex: 10,
    // Note: No bottom radius here as it flows into the wave shape
  },
  headerIconContainer: {
    padding: SPACING.XS,
  },
  headerRightIcons: {
    flexDirection: "row",
  },
  profileHeaderSection: {
    backgroundColor: COLORS.PRIMARY_DARK_BLUE, // Dark blue background for header section
    alignItems: "center",
    paddingVertical: SPACING.XXL,
    paddingBottom: SPACING.XXL * 2, // Extra padding for the wave effect
    borderBottomLeftRadius: BORDER_RADIUS.XXL * 2, // Large radius for wave effect
    borderBottomRightRadius: BORDER_RADIUS.XXL * 2, // Large radius for wave effect
    marginBottom: -SPACING.XXL, // Pull it up to overlap with the form section
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.WHITE, // White border for avatar
    marginBottom: SPACING.M,
    ...SHADOWS.medium, // More prominent shadow for avatar
  },
  name: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.WHITE, // White text for name
    marginBottom: SPACING.XXS,
  },
  location: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT, // Light gray for location
    marginBottom: SPACING.M,
  },
  changeImageButton: {
    backgroundColor: COLORS.PRIMARY_BLUE, // Use a lighter primary blue for the button
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    ...SHADOWS.small,
  },
  changeImageButtonText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontWeight: "600",
  },
  formSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L, // Rounded corners for the form card
    padding: SPACING.M,
    // FIX: Adjusted marginHorizontal for consistency with other screens
    marginHorizontal: SPACING.XL,
    marginTop: SPACING.L, // Adjust to overlap with the header wave
    // FIX: Adjusted marginBottom to ensure enough space for content above the fixed button
    marginBottom: SPACING.XXL * 2, // Ensure ample space below the last input
    ...SHADOWS.medium, // Prominent shadow for the form card
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  dateInputText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
  },
  genderOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.M, // Space between options
  },
  genderOption: {
    flex: 1, // Distribute space evenly
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  genderOptionSelected: {
    borderColor: COLORS.ACCENT_ORANGE, // Highlight selected gender
    backgroundColor: COLORS.LIGHT_ORANGE, // Light background for selected
  },
  genderText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    marginLeft: SPACING.S,
  },
  genderTextSelected: {
    color: COLORS.ACCENT_ORANGE, // Highlight selected text color
    fontWeight: "bold",
  },
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  countryCodeDropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.M,
    borderRightWidth: 1,
    borderRightColor: COLORS.BORDER_COLOR_LIGHT,
    paddingVertical: SPACING.M,
  },
  countryCodeText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    marginRight: SPACING.XS,
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.M,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    marginHorizontal: SPACING.XL,
    // FIX: Adjusted marginBottom to ensure content clears the button
    marginBottom: SPACING.XXL, // This is the space from the very bottom of the screen
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
    position: "absolute",
    bottom: 0,
    left: SPACING.XL,
    right: SPACING.XL,
    width: `auto`,
    zIndex: 100,
    // FIX: Added white border
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default EditProfileScreen;
