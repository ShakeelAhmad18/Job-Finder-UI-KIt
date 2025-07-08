import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

const YourApplicationScreen = () => {
  const router = useRouter();

  // Sample application data (in a real app, this would be fetched dynamically)
  const applicationData = {
    jobTitle: "UI/UX Designer",
    companyName: "Google inc",
    location: "California, USA",
    shippedDate: "February 14, 2022 at 11:30 am",
    updatedByRecruiter: "8 hours ago",
    jobDetails: ["Senior designer", "Full time", "1-3 Years work experience"],
    applicationDocuments: [
      {
        type: "CV/Resume",
        fileName: "Jamet kudasi - CV - UI/UX Designer.PDF",
        size: "867 Kb",
        uploadDate: "14 Feb 2022 at 11:30 am",
      },
      // You can add more documents here if needed, e.g., cover letter
      // {
      //   type: "Cover Letter",
      //   fileName: "Jamet kudasi - Cover Letter.PDF",
      //   size: "200 Kb",
      //   uploadDate: "14 Feb 2022 at 11:30 am",
      // }
    ],
  };

  /**
   * Handles the action to apply for more jobs.
   * In a real app, this would navigate to a job listing screen.
   */
  const handleApplyForMoreJobs = () => {
    router.push("(tabs)")
  };

  
  const handleOpenDocument = (document) => {
    Alert.alert("Open Document", `Opening ${document.fileName} (Simulated)`);
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Your application</Text>
        <View style={styles.headerIconContainer} />
        {/* Placeholder for spacing */}
      </View>
      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Company and Job Overview Section */}
        <View style={styles.sectionCard}>
          <View style={styles.companyLogoContainer}>
            <Ionicons
              name="logo-google"
              size={FONT_SIZES.H1 * 1.5}
              color={COLORS.PRIMARY_BLUE}
            />
          </View>
          <Text style={styles.jobTitle}>{applicationData.jobTitle}</Text>
          <Text style={styles.companyInfo}>
            {applicationData.companyName} • {applicationData.location}
          </Text>
          <View style={styles.statusList}>
            <View style={styles.statusItem}>
              <Text style={styles.statusBullet}>•</Text>
              <Text style={styles.statusText}>
                Shipped on {applicationData.shippedDate}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusBullet}>•</Text>
              <Text style={styles.statusText}>
                Updated by recruiter {applicationData.updatedByRecruiter}
              </Text>
            </View>
          </View>
        </View>
        {/* Job Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Job details</Text>
          <View style={styles.detailsList}>
            {applicationData.jobDetails.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>{detail}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Application Details Section (Documents) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Application details</Text>
          <View style={styles.detailsList}>
            {applicationData.applicationDocuments.map((doc, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailBullet}>•</Text>
                <TouchableOpacity
                  style={styles.documentCard}
                  onPress={() => handleOpenDocument(doc)}
                >
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={FONT_SIZES.H1}
                    color={COLORS.ACCENT_ORANGE}
                  />
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{doc.fileName}</Text>
                    <Text style={styles.documentMeta}>
                      {doc.size} • {doc.uploadDate}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        {/* Spacer to push the button to the bottom */}
        <View style={{ flex: 1 }} />
      </ScrollView>
      {/* Apply for More Jobs Button */}
      <TouchableOpacity
        style={styles.applyButton}
        onPress={handleApplyForMoreJobs}
      >
        <Text style={styles.applyButtonText}>APPLY FOR MORE JOBS</Text>
      </TouchableOpacity>
    </View>
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
    paddingBottom: SPACING.XXL * 3, // Ensure space for the fixed button
  },
  sectionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    marginBottom: SPACING.XL, // Space between sections
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  companyLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.M,
    backgroundColor: COLORS.LIGHT_BLUE, // Light blue background for company logo
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.M,
  },
  jobTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS,
  },
  companyInfo: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.M,
  },
  statusList: {
    marginTop: SPACING.S,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.XXS,
  },
  statusBullet: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginRight: SPACING.XXS,
  },
  statusText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR_LIGHT,
    paddingBottom: SPACING.S,
  },
  detailsList: {
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.S,
  },
  detailBullet: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginRight: SPACING.XXS,
    lineHeight: FONT_SIZES.BODY * 1.5, // Match line height of text
  },
  detailText: {
    flex: 1, // Allow text to wrap
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    lineHeight: FONT_SIZES.BODY * 1.5,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    padding: SPACING.M,
    flex: 1, // Take up available space next to bullet
    ...SHADOWS.small,
  },
  documentInfo: {
    flex: 1,
    marginLeft: SPACING.M,
  },
  documentName: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  documentMeta: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    marginTop: SPACING.XXS,
  },
  applyButton: {
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
  applyButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default YourApplicationScreen;
