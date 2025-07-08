import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  RefreshControl,
  Alert, 
} from "react-native";
import { useUser, useClerk } from "@clerk/clerk-expo";
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

const ProfileScreen = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const profileData = {
    name: user?.fullName || "Orlando Diggs",
    location: "California, USA", 
    followers: "120k",
    following: "23k",
    about:
      "Senior Product Designer with 5+ years of experience creating user-centered designs, passionate about crafting intuitive and engaging user experiences. I thrive in collaborative environments and am always eager to learn new technologies.",
    workExperience: [
      {
        position: "Senior Product Designer",
        company: "Tech Solutions Inc.",
        duration: "Jan 2022 - Present",
        years: "2 Years",
      },
      {
        position: "Product Designer",
        company: "Innovate Co.",
        duration: "Mar 2019 - Dec 2021",
        years: "2 Years 10 Months",
      },
    ],
    education: [
      {
        degree: "M.Sc. Human-Computer Interaction",
        institution: "Stanford University",
        duration: "Sep 2017 - May 2019",
      },
      {
        degree: "B.Sc. Computer Science",
        institution: "University of California, Berkeley",
        duration: "Sep 2013 - May 2017",
      },
    ],
    skills: [
      "UI/UX Design",
      "Figma",
      "Sketch",
      "Prototyping",
      "User Research",
      "Wireframing",
      "Design Systems",
      "Agile Methodologies",
      "Leadership",
      "Problem Solving",
    ],
    languages: ["English", "German", "Spanish", "French", "Mandarin"], 
    appreciation: {
      title: "Young Scientist Award",
      role: "Wireless Symposium (RWS)",
      year: "2014",
    },
    resume: {
      name: "Orlando_Diggs_UIUX_Resume.pdf",
      size: "867 Kb",
      date: "14 Feb 2022 at 13:00 am",
    },
  };

  
  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      Alert.alert("Logout Error", "Failed to logout. Please try again.");
      console.error("Logout error:", err);
    }
  };

  
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => setShowSettings(!showSettings)}
          style={styles.headerIconContainer}
        >
          <Ionicons
            name="settings-sharp"
            size={FONT_SIZES.H2}
            color={COLORS.TEXT_DARK}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowSettings(false)}
        >
          <View style={styles.settingsDropdown}>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => {
                setShowSettings(false);
                router.push("notification/Notifications");
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.settingsText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={handleLogout}
            >
              <MaterialIcons
                name="logout"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.settingsText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={()=>router.push("Profile/Settings")}
            >
              <MaterialIcons
                name="settings"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.settingsText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <ScrollView
        style={styles.contentScrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY_BLUE]}
            tintColor={COLORS.PRIMARY_BLUE}
          />
        }
      >
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                user?.imageUrl ||
                "https://placehold.co/100x100/A0A4A8/FFFFFF?text=JD",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.location}>{profileData.location}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("Profile/EditProfile")}
            >
              <Feather
                name="edit-2"
                size={FONT_SIZES.BODY}
                color={COLORS.WHITE}
              />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <TouchableOpacity onPress={() => router.push("Profile/aboutMe")}>
              <Feather
                name="edit-2"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionContent}>{profileData.about}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <TouchableOpacity
              onPress={() => router.push("Profile/workExperience")}
            >
              <Feather
                name="edit-2"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
          </View>
          {profileData.workExperience.map((exp, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.companyLogo}>
                  <Text style={styles.companyInitial}>
                    {exp.company.charAt(0)}
                  </Text>
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                </View>
              </View>
              <Text style={styles.cardDuration}>
                {exp.duration} • {exp.years}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education</Text>
            <TouchableOpacity
              onPress={() => router.push("Profile/AddEducation")}
            >
              <Feather
                name="edit-2"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
          </View>
          {profileData.education.map((edu, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.educationIcon}>
                  <Ionicons
                    name="school-outline"
                    size={FONT_SIZES.H2}
                    color={COLORS.PRIMARY_BLUE}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  <Text style={styles.cardSubtitle}>{edu.institution}</Text>
                </View>
              </View>
              <Text style={styles.cardDuration}>{edu.duration}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity onPress={() => router.push("Profile/AddSkill")}>
              <Feather
                name="edit-2"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.skillsContainer}>
            {profileData.skills.map((skill, index) => (
              <View key={index} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <TouchableOpacity onPress={() => router.push("Profile/Language")}>
              <Feather
                name="edit-2"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.skillsContainer}>
            {profileData.languages.map((language, index) => (
              <View key={index} style={styles.skillPill}>
                <Text style={styles.skillText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appreciation</Text>
            <TouchableOpacity
              onPress={() => router.push("Profile/AddAppreciation")}
            >
              <Feather
                name="edit-2"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
          </View>
          {profileData.appreciation && (
            <View style={styles.appreciationCard}>
              <Ionicons
                name="trophy-outline"
                size={FONT_SIZES.H2}
                color={COLORS.ACCENT_ORANGE}
                style={styles.appreciationIcon}
              />
              <View style={styles.appreciationDetails}>
                <Text style={styles.appreciationTitle}>
                  {profileData.appreciation.title}
                </Text>
                <Text style={styles.appreciationSubtitle}>
                  {profileData.appreciation.role}
                </Text>
                <Text style={styles.appreciationYear}>
                  {profileData.appreciation.year}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Resume</Text>
            <TouchableOpacity onPress={() => router.push("Profile/AddResume")}>
              <Feather
                name="edit-2"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.resumeCard}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={FONT_SIZES.H1 + 4}
              color={COLORS.PRIMARY_BLUE}
            />
            <View style={styles.resumeDetails}>
              <Text style={styles.resumeTitle}>{profileData.resume.name}</Text>
              <Text style={styles.resumeSubtitle}>
                {profileData.resume.size} • {profileData.resume.date}
              </Text>
            </View>
            <Feather
              name="download"
              size={FONT_SIZES.H2}
              color={COLORS.PRIMARY_BLUE}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    borderBottomLeftRadius: BORDER_RADIUS.M, // Rounded bottom corners
    borderBottomRightRadius: BORDER_RADIUS.M,
  },
  headerIconContainer: {
    padding: SPACING.XS, // Add padding for easier touch
  },
  headerTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // Semi-transparent overlay
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60, // Align with header height
    paddingRight: SPACING.M,
  },
  settingsDropdown: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.S,
    ...SHADOWS.medium,
    zIndex: 100,
    width: 200, // Slightly wider for better text fit
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    // Add a subtle border or separator if needed
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: COLORS.BORDER_LIGHT,
  },
  settingsText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    marginLeft: SPACING.S,
    fontWeight: "500", // Slightly bolder for readability
  },
  contentScrollView: {
    flex: 1,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.L, // Add some top padding below the header
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: SPACING.XL,
    backgroundColor: COLORS.WHITE, // White background for the header section
    borderRadius: BORDER_RADIUS.L, // Rounded corners for the entire header block
    marginBottom: SPACING.XL,
    ...SHADOWS.small, // Subtle shadow
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_BLUE, // Use the new primary blue
    marginBottom: SPACING.M,
    ...SHADOWS.small, // Add a slight shadow to the avatar
  },
  name: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS, // Reduced spacing
  },
  location: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.M,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.S,
    width: "100%", // Ensure it takes full width of its parent
    paddingHorizontal: SPACING.M, // Add horizontal padding
  },
  statItem: {
    alignItems: "center",
    flex: 1, // Distribute space evenly
  },
  statNumber: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  statLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_LIGHT,
  },
  statSeparator: {
    width: 1,
    height: "60%", // Make separator shorter
    backgroundColor: COLORS.BORDER_LIGHT,
    marginHorizontal: SPACING.M,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_BLUE, // Use primary blue for the button background
    borderRadius: BORDER_RADIUS.M, // Use medium border radius
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    marginLeft: SPACING.M,
    ...SHADOWS.small, // Add a subtle shadow
  },
  editButtonText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE, // White text for primary button
    fontWeight: "600",
    marginLeft: SPACING.XS,
  },
  section: {
    marginBottom: SPACING.XL,
    backgroundColor: COLORS.WHITE, // White background for each section
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.M,
    paddingBottom: SPACING.S, // Add padding below header
    borderBottomWidth: 1, // Add a subtle separator
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  sectionContent: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    lineHeight: FONT_SIZES.BODY * 1.5, // Improved line height for readability
    paddingTop: SPACING.S, // Padding above content
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    marginBottom: SPACING.M,
    borderWidth: 1, // Add a subtle border
    borderColor: COLORS.BORDER_LIGHT,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.S,
  },
  companyLogo: {
    width: 48, // Slightly larger
    height: 48,
    borderRadius: BORDER_RADIUS.M, // Match card border radius
    backgroundColor: COLORS.LIGHT_BLUE, // Use a light blue for company logo background
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.M,
  },
  companyInitial: {
    fontSize: FONT_SIZES.H2, // Larger initial
    fontWeight: "bold",
    color: COLORS.PRIMARY_BLUE,
  },
  educationIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.M,
    backgroundColor: COLORS.LIGHT_PURPLE, // Use light purple for education icon background
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.M,
  },
  cardTextContainer: {
    flex: 1, // Allow text to take available space
  },
  cardTitle: {
    fontSize: FONT_SIZES.BODY_LARGE, // Use new BODY_LARGE
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XXS, // Use constant for small spacing
  },
  cardDuration: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY, // Use TEXT_GRAY for duration
    marginTop: SPACING.XS,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: SPACING.S,
  },
  skillPill: {
    backgroundColor: COLORS.LIGHT_ORANGE, // Use light orange for skill pills
    borderRadius: BORDER_RADIUS.L, // More rounded pills
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    marginRight: SPACING.S,
    marginBottom: SPACING.S,
    borderWidth: 1,
    borderColor: COLORS.ACCENT_ORANGE, // Border matching accent color
  },
  skillText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.ACCENT_ORANGE, // Text color matching accent
    fontWeight: "600",
  },
  resumeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    ...SHADOWS.small,
  },
  resumeDetails: {
    flex: 1,
    marginLeft: SPACING.M,
  },
  resumeTitle: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  resumeSubtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XS,
  },
  // NEW STYLES FOR APPRECIATION SECTION
  appreciationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  appreciationIcon: {
    marginRight: SPACING.M,
  },
  appreciationDetails: {
    flex: 1,
  },
  appreciationTitle: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  appreciationSubtitle: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XXS,
  },
  appreciationYear: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    marginTop: SPACING.XXS,
  },
  bottomSpacer: {
    height: SPACING.XXL * 2, // More space at the bottom for scrollability
  },
});

export default ProfileScreen;
