import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  Alert, // For user feedback
  Platform, // Import Platform to handle OS-specific behavior
  KeyboardAvoidingView, // Import KeyboardAvoidingView
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker"; // For picking documents
import { useRouter } from "expo-router"; // For navigation
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers";

// Get screen width for responsive sizing
const { width: screenWidth } = Dimensions.get("window");

/**
 * Header Component for UploadScreen
 * Provides back navigation and a 'more options' icon.
 */
const UploadScreenHeader = ({ onBackPress, onMorePress, insets }) => {
  return (
    <View
      style={[headerStyles.container, { paddingTop: insets.top + SPACING.S }]}
    >
      <TouchableOpacity onPress={onBackPress} style={headerStyles.iconButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
      </TouchableOpacity>
      <View style={headerStyles.rightIcons}>
        <TouchableOpacity onPress={onMorePress} style={headerStyles.iconButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={COLORS.TEXT_DARK}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    backgroundColor: COLORS.WHITE, // Match company header background
    paddingBottom: SPACING.S, // Add some bottom padding
  },
  iconButton: {
    padding: SPACING.XS, // Touchable area
  },
  rightIcons: {
    flexDirection: "row",
  },
});

const UploadCVScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter(); // Initialize useRouter
  const [resumeFile, setResumeFile] = useState(null); // Stores file object { name, size, uri, etc. }
  const [motivationText, setMotivationText] = useState(""); // State for "Information" text area

  const jobDetails = {
    logoUri:
      "https://images.unsplash.com/photo-1678483789111-3a04c4628bd6?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Google logo placeholder
    title: "UI/UX Designer",
    company: "Google",
    location: "California",
    postedTime: "1 day ago",
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ], // Specific types for CV/Resume
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        const file = result.assets[0];
        setResumeFile({
          name: file.name,
          size: file.size,
          uri: file.uri,
          date: new Date().toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        });
        Alert.alert("File Selected", `Selected: ${file.name}`);
      }
    } catch (err) {
      console.log("Document Picker Error:", err);
      Alert.alert("Error", "Could not pick document.");
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    Alert.alert("File Removed", "Your resume has been removed.");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmitApplication = () => {
    if (!resumeFile) {
      Alert.alert("Missing Resume", "Please upload your resume/CV to apply.");
      return;
    }
    if (!motivationText.trim()) {
      Alert.alert(
        "Missing Information",
        "Please explain why you are the right person for this job."
      );
      return;
    }

    Alert.alert(
      "Application Submitted!",
      "Your application has been submitted successfully. Thank you!"
    );
    // navigate to a success screen
    router.push("apply/SuccessScreen");
  };

  // Calculate keyboardVerticalOffset based on platform and safe area insets
  // This value might need fine-tuning depending on your exact header height and device.
  const keyboardVerticalOffset =
    Platform.OS === "ios" ? insets.top + SPACING.XXL : 0;

  return (
    <View style={styles.container}>
      {/* Custom Header for Upload Screen */}
      <UploadScreenHeader
        onBackPress={() => router.back()}
        onMorePress={() => console.log("More options pressed")}
        insets={insets}
      />

      {/* KeyboardAvoidingView to push content up when keyboard appears */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // 'padding' often works better for iOS, 'height' for Android
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.jobInfoHeader}>
            <Image
              source={{ uri: jobDetails.logoUri }}
              style={styles.jobInfoLogo}
              onError={(e) =>
                console.log("Job info logo loading error:", e.nativeEvent.error)
              }
            />
            <Text style={styles.jobInfoTitle}>{jobDetails.title}</Text>
            <View style={styles.jobInfoRow}>
              <Text style={styles.jobInfoDetailText}>{jobDetails.company}</Text>
              <Text style={styles.jobInfoDotSeparator}>•</Text>
              <Text style={styles.jobInfoDetailText}>
                {jobDetails.location}
              </Text>
              <Text style={styles.jobInfoDotSeparator}>•</Text>
              <Text style={styles.jobInfoDetailText}>
                {jobDetails.postedTime}
              </Text>
            </View>
          </View>

          {/* Upload CV Section */}
          <Text style={styles.sectionHeading}>Upload CV</Text>
          <Text style={styles.sectionSubtext}>
            Add your CV/Resume to apply for a job
          </Text>

          {!resumeFile ? (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handleDocumentPick}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={48}
                color={COLORS.TEXT_GRAY}
              />
              <Text style={styles.uploadText}>Upload CV/Resume</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadedFileBox}>
              <Ionicons
                name="document-text-outline"
                size={40}
                color={COLORS.ACCENT_ORANGE}
              />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{resumeFile.name}</Text>
                <Text style={styles.fileDetails}>
                  {formatFileSize(resumeFile.size)} • {resumeFile.date} at{" "}
                  {resumeFile.time}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleRemoveFile}
                style={styles.removeFileButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={COLORS.TEXT_GRAY}
                />
                <Text style={styles.removeFileText}>Remove file</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Information Text Area */}
          <Text style={styles.sectionHeading}>Information</Text>
          <TextInput
            style={styles.motivationTextInput}
            placeholder="Explain why you are the right person for this job"
            placeholderTextColor={COLORS.TEXT_GRAY}
            multiline={true}
            numberOfLines={8} // Adjust as needed
            textAlignVertical="top" // Ensure placeholder starts at top
            value={motivationText}
            onChangeText={setMotivationText}
          />
          {/* Add some extra padding at the bottom of the scroll view to ensure content is not obscured by the bottom bar */}
          <View style={{ height: SPACING.XXL * 3 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Apply Bar */}
      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.S }]}
      >
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitApplication}
        >
          <Text style={styles.submitButtonText}>APPLY NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardAvoidingView: {
    flex: 1, // Ensure KeyboardAvoidingView takes full available space
  },
  scrollViewContent: {
    paddingHorizontal: SPACING.XL,
    paddingBottom: SPACING.L, // Initial padding, KeyboardAvoidingView will adjust
  },
  // --- Header Styles (from previous snippet) ---
  // ... (headerStyles are defined outside the component, no change needed here)

  // --- Job Info Header Section Styles (New) ---
  jobInfoHeader: {
    alignItems: "center",
    paddingVertical: SPACING.XXL,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: -SPACING.XL, // Extend to screen edges
    borderBottomLeftRadius: SPACING.L,
    borderBottomRightRadius: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: SPACING.XL,
  },
  jobInfoLogo: {
    width: 80,
    height: 80,
    borderRadius: SPACING.S, // Slightly rounded square
    marginBottom: SPACING.M,
  },
  jobInfoTitle: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
    textAlign: "center",
  },
  jobInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  jobInfoDetailText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
  },
  jobInfoDotSeparator: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginHorizontal: SPACING.XS,
  },
  // --- Upload Section Styles ---
  sectionHeading: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.L,
    marginBottom: SPACING.XXS, // Reduced margin for subtext
  },
  sectionSubtext: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.M,
  },
  uploadBox: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    borderWidth: 2,
    borderColor: COLORS.BORDER_LIGHT, // Lighter border for dashed effect
    borderStyle: "dashed",
    paddingVertical: SPACING.XXL,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.L,
  },
  uploadText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginTop: SPACING.S,
    fontWeight: "600", // Make "Upload CV/Resume" bolder
  },
  // --- Uploaded File Display Styles ---
  uploadedFileBox: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    padding: SPACING.M,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.L,
  },
  fileInfo: {
    flex: 1, // Take remaining space
    marginLeft: SPACING.M,
  },
  fileName: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  fileDetails: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    marginTop: SPACING.XXS,
  },
  removeFileButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.XS,
  },
  removeFileText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    marginLeft: SPACING.XXS,
  },
  // --- Information Text Area Styles ---
  motivationTextInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    minHeight: 150, // Minimum height for the text area
    lineHeight: FONT_SIZES.BODY * 1.5, // Better readability
    marginBottom: SPACING.L,
  },
  // --- Bottom Bar & Submit Button Styles ---
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.S,
    borderTopLeftRadius: SPACING.L,
    borderTopRightRadius: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY_DARK_BLUE, // Use the primary dark blue for consistency
    borderRadius: SPACING.S,
    paddingVertical: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
  },
});

export default UploadCVScreen;
