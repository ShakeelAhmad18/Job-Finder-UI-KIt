import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView, 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // For navigation
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers"; // Adjust path if necessary

const { width: screenWidth } = Dimensions.get("window");


const SuccessScreenHeader = ({ onBackPress, onMorePress, insets }) => {
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

const SuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter(); // Initialize useRouter

  // Dummy job details for the top section (consistent with previous screens)
  const jobDetails = {
    logoUri:
      "https://images.unsplash.com/photo-1678483789111-3a04c4628bd6?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Google logo placeholder
    title: "UI/UX Designer",
    company: "Google",
    location: "California",
    postedTime: "1 day ago",
  };

  // Dummy uploaded file details to display (as per Successful.jpg)
  const uploadedFile = {
    name: "Jamel kudasi - CV - UI/UX Designer",
    size: "867 Kb",
    date: "14 Feb 2022",
    time: "11:30 am",
  };

  return (
    <View style={styles.container}>
      {/* Custom Header for Success Screen */}
      <SuccessScreenHeader
        onBackPress={() => router.back()} // Go back to the previous screen (Upload CV)
        onMorePress={() => console.log("More options pressed")}
        insets={insets}
      />

      {/* Job Info Header Section (consistent with previous screens) */}
      <View style={styles.jobInfoHeader}>
        <Image
          source={{ uri: jobDetails.logoUri }}
          style={styles.jobInfoLogo}
        />
        <Text style={styles.jobInfoTitle}>{jobDetails.title}</Text>
        <View style={styles.jobInfoRow}>
          <Text style={styles.jobInfoDetailText}>{jobDetails.company}</Text>
          <Text style={styles.jobInfoDotSeparator}>•</Text>
          <Text style={styles.jobInfoDetailText}>{jobDetails.location}</Text>
          <Text style={styles.jobInfoDotSeparator}>•</Text>
          <Text style={styles.jobInfoDetailText}>{jobDetails.postedTime}</Text>
        </View>
      </View>

      {/* Main Content Area - Now a ScrollView */}
      <ScrollView
        style={styles.scrollViewContentArea} // Apply flex to ScrollView itself
        contentContainerStyle={styles.contentAreaContainer} // Apply centering to contentContainerStyle
        showsVerticalScrollIndicator={false}
      >
        {/* Uploaded File Display (from Successful.jpg) */}
        <View style={styles.uploadedFileBox}>
          <Ionicons
            name="document-text-outline"
            size={40}
            color={COLORS.ACCENT_ORANGE}
          />
          <View style={styles.fileInfo}>
            <Text style={styles.fileName}>{uploadedFile.name}</Text>
            <Text style={styles.fileDetails}>
              {uploadedFile.size} • {uploadedFile.date} at {uploadedFile.time}
            </Text>
          </View>
        </View>

        {/* Success Illustration */}
        <Image
          source={require("../../assets/images/success.png")} // Create this asset or use a remote one
          style={styles.successIllustration}
        />

        {/* Success Message */}
        <Text style={styles.successHeading}>Successful</Text>
        <Text style={styles.successSubtext}>
          Congratulations, your application has been sent
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.findSimilarButton}
          onPress={() => router.push("/jobs/similar")} // Navigate to a similar jobs screen
        >
          <Text style={styles.findSimilarButtonText}>FIND A SIMILAR JOB</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToHomeButton}
          onPress={() => router.push("/")} // Navigate back to the home screen
        >
          <Text style={styles.backToHomeButtonText}>BACK TO HOME</Text>
        </TouchableOpacity>

        {/* Add some padding at the bottom of the scroll view if needed to prevent content from being hidden by any potential bottom bars */}
        <View style={{ height: SPACING.L }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  

  // --- Job Info Header Section Styles (Copied for consistency) ---
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
  // --- Content Area Specific Styles ---
  scrollViewContentArea: {
    flex: 1, // Allow ScrollView to take available space
  },
  contentAreaContainer: {
    paddingHorizontal: SPACING.XL,
    alignItems: "center", // Center content horizontally within the scrollable area
    justifyContent: "flex-start", // Align content to the top
    paddingBottom: SPACING.XXL, // Add padding at the bottom for scroll comfort
  },
  // --- Uploaded File Display Styles (Consistent with UploadCVScreen) ---
  uploadedFileBox: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    padding: SPACING.M,
    flexDirection: "row",
    alignItems: "center",
    width: "100%", // Take full width
    marginBottom: SPACING.XXL, // Add more space below this element
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
  // --- Success Illustration & Text ---
  successIllustration: {
    width: screenWidth * 0.5, // Adjust size responsively
    height: screenWidth * 0.5, // Adjust size responsively
    resizeMode: "contain",
    marginBottom: SPACING.L,
  },
  successHeading: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  successSubtext: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    marginBottom: SPACING.XXL, // Space before buttons
  },
  // --- Action Buttons ---
  findSimilarButton: {
    backgroundColor: COLORS.PRIMARY_LIGHT_PURPLE, // Lighter purple for "Find Similar"
    borderRadius: SPACING.S,
    paddingVertical: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: SPACING.M,
  },
  findSimilarButtonText: {
    color: COLORS.TEXT_DARK, // Darker text for lighter button
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
  },
  backToHomeButton: {
    backgroundColor: COLORS.PRIMARY_DARK_BLUE, // Dark blue for "Back to Home"
    borderRadius: SPACING.S,
    paddingVertical: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: SPACING.L, // Space from bottom
  },
  backToHomeButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
  },
});

export default SuccessScreen;
