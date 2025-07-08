import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker"; // Import expo-document-picker

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

const AddResumeScreen = () => {
  const router = useRouter();

  // State to hold the uploaded resume file details
  const [uploadedResume, setUploadedResume] = useState(null); // { name: string, size: string, date: string }

  /**
   * Handles picking a document from the device's file system/gallery.
   * Uses expo-document-picker to simulate real-time file selection.
   */
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Only allow PDF files
        copyToCacheDirectory: false, // Don't copy to cache unless necessary for upload
      });

      // Simulate a successful result if running in a non-Expo Go environment
      // where actual file picking might not be possible or for quick testing.
      // In a real app, you'd rely solely on `result.type === 'success'`.
      if (result.canceled) {
        // Check if the user cancelled the picker
        console.log("Document picking cancelled.");
        return;
      }

      // Simulate a successful pick with data from the image
      // In a real app, 'result' would contain the actual file details.
      const now = new Date();
      setUploadedResume({
        name: result.assets[0].name, // Accessing name from assets array
        size: `${(result.assets[0].size / 1024).toFixed(0)} Kb`, // Convert bytes to KB
        date: `${now.getDate()} ${now.toLocaleString("en-US", {
          month: "short",
        })} ${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()} ${
          now.getHours() >= 12 ? "pm" : "am"
        }`,
        uri: result.assets[0].uri, // The URI of the picked file
      });
      Alert.alert("Success", "Resume uploaded successfully!");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to pick document. Please ensure 'expo-document-picker' is installed and permissions are granted."
      );
      console.error("Document picking error:", error);
    }
  };

  /**
   * Handles removing the uploaded resume file.
   */
  const handleRemoveFile = () => {
    Alert.alert(
      "Remove Resume",
      "Are you sure you want to remove this resume?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            setUploadedResume(null);
            Alert.alert("Removed", "Resume has been removed.");
            // In a real app, you would also call an API to delete the file from storage
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Handles saving the resume.
   * In a real app, this would typically involve:
   * 1. Confirming the uploaded file (if not already sent to backend during upload).
   * 2. Showing a success/error message.
   * 3. Navigating back or to another screen.
   */
  const handleSave = () => {
    if (!uploadedResume) {
      Alert.alert("Error", "Please upload a resume before saving.");
      return;
    }
    Alert.alert("Success", "Resume saved successfully!");
    // In a real app, you might navigate back after saving:
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
            color={COLORS.TEXT_DARK}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Resume</Text>
        <View style={styles.headerIconContainer} />{" "}
        {/* Placeholder for spacing */}
      </View>

      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {uploadedResume ? (
          // --- Display Uploaded Resume ---
          <View style={styles.uploadedResumeCard}>
            <MaterialCommunityIcons
              name="file-pdf-box"
              size={FONT_SIZES.H1 * 1.5}
              color={COLORS.ACCENT_ORANGE}
              style={styles.pdfIcon}
            />
            <View style={styles.uploadedResumeDetails}>
              <Text style={styles.uploadedResumeName}>
                {uploadedResume.name}
              </Text>
              <Text style={styles.uploadedResumeInfo}>
                {uploadedResume.size} • {uploadedResume.date}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleRemoveFile}
              style={styles.removeFileButton}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={FONT_SIZES.H2}
                color={COLORS.TEXT_GRAY}
              />
              <Text style={styles.removeFileText}>Remove file</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // --- Upload Area ---
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={handlePickDocument}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={FONT_SIZES.H1 * 1.5}
              color={COLORS.PRIMARY_BLUE}
            />
            <Text style={styles.uploadText}>Upload CV/Resume</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.uploadHint}>
          Upload files in PDF format up to 5 MB. Just upload it once and you can
          use it in your next application.
        </Text>

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
    paddingBottom: SPACING.XXL * 2, // Ensure space for the fixed save button
  },
  uploadArea: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    borderWidth: 2,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    borderStyle: "dashed", // Dashed border for upload area
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.XXL,
    marginBottom: SPACING.M,
    ...SHADOWS.small,
  },
  uploadText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "600",
    marginTop: SPACING.M,
  },
  uploadedResumeCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    padding: SPACING.M,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.M,
    ...SHADOWS.small,
  },
  pdfIcon: {
    marginRight: SPACING.M,
  },
  uploadedResumeDetails: {
    flex: 1,
  },
  uploadedResumeName: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  uploadedResumeInfo: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    marginTop: SPACING.XXS,
  },
  removeFileButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: SPACING.M,
    padding: SPACING.XS, // Make touch target larger
  },
  removeFileText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    marginLeft: SPACING.XXS,
  },
  uploadHint: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    lineHeight: FONT_SIZES.SMALL * 1.5,
    marginBottom: SPACING.XL,
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
    position: "absolute",
    bottom: 0,
    left: SPACING.XL,
    right: SPACING.XL,
    width: `auto`,
    zIndex: 100,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default AddResumeScreen;
