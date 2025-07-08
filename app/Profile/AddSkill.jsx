import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList, // For efficient list rendering
  Alert, // For showing save confirmation
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

// A comprehensive list of skills for demonstration purposes
const allSkills = [
  "Graphic Design",
  "Graphic Thinking",
  "UI/UX Design",
  "Adobe InDesign",
  "Web Design",
  "Canva Design",
  "User Interface Design",
  "Product Design",
  "User Experience Design",
  "Figma",
  "Sketch",
  "Prototyping",
  "User Research",
  "Wireframing",
  "Design Systems",
  "Agile Methodologies",
  "Leadership",
  "Problem Solving",
  "Communication",
  "Teamwork",
  "Project Management",
  "Data Analysis",
  "Marketing Strategy",
  "Content Creation",
  "Software Development",
  "Mobile App Development",
  "Frontend Development",
  "Backend Development",
  "Database Management",
  "Cloud Computing",
  "Cybersecurity",
  "Network Administration",
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Robotics",
  "Blockchain",
  "Digital Marketing",
  "SEO",
  "SEM",
  "Social Media Marketing",
  "Email Marketing",
  "Copywriting",
  "Video Editing",
  "Photography",
  "Illustration",
  "Animation",
  "3D Modeling",
  "Game Development",
  "Technical Writing",
  "Customer Service",
  "Sales",
  "Negotiation",
  "Public Speaking",
  "Financial Analysis",
  "Budgeting",
  "Accounting",
  "Human Resources",
  "Recruitment",
  "Training & Development",
  "Coaching",
  "Mentoring",
  "Strategic Planning",
  "Business Development",
  "Market Research",
  "Brand Management",
  "Public Relations",
  "Event Planning",
  "Supply Chain Management",
  "Logistics",
  "Quality Assurance",
  "Testing",
  "Technical Support",
  "System Administration",
  "DevOps",
  "Containerization",
  "Virtualization",
  "Scripting",
  "Automation",
  "Data Visualization",
  "Statistical Analysis",
  "Predictive Modeling",
  "Big Data",
  "Data Warehousing",
  "ETL",
  "Business Intelligence",
  "UX Research",
  "Interaction Design",
  "Visual Design",
  "Information Architecture",
  "Usability Testing",
  "Accessibility",
  "Cross-functional Team Leadership",
  "Mentorship",
  "Conflict Resolution",
  "Time Management",
  "Adaptability",
  "Creativity",
  "Critical Thinking",
  "Decision Making",
  "Emotional Intelligence",
  "Interpersonal Skills",
  "Active Listening",
  "Feedback Giving",
  "Presentation Skills",
  "Report Writing",
  "Research Skills",
  "Analytical Skills",
  "Attention to Detail",
  "Organization",
  "Self-Motivation",
  "Stress Management",
  "Team Collaboration",
  "Work Ethic",
];

const AddSkillScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  // State to hold the skills selected by the user
  const [selectedSkills, setSelectedSkills] = useState([]);

  /**
   * Filters the list of all skills based on the search query.
   * Uses useMemo to optimize performance by memoizing the filtered list.
   */
  const filteredSkills = useMemo(() => {
    if (!searchQuery) {
      return allSkills; // Show all skills if search query is empty
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allSkills.filter((skill) =>
      skill.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  /**
   * Handles the selection of a skill from the list.
   * Adds the skill to the selectedSkills array if not already present.
   * @param {string} skill - The skill that was selected.
   */
  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill]);
      setSearchQuery(""); // Clear search query after selection for better UX
    } else {
      // Optional: Provide feedback if skill is already added
      // Alert.alert("Already Added", `${skill} has already been added.`);
    }
  };

  /**
   * Handles the removal of a skill from the selectedSkills array.
   * @param {string} skillToRemove - The skill to be removed.
   */
  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
  };

  /**
   * Clears the search query.
   */
  const clearSearch = () => {
    setSearchQuery("");
  };

  /**
   * Handles the saving of the selected skills.
   * In a real app, this would typically involve:
   * 1. Sending the `selectedSkills` array to a backend API or updating local storage/database.
   * 2. Showing a success/error message.
   * 3. Navigating back or to another screen.
   */
  const handleSave = () => {
    if (selectedSkills.length === 0) {
      Alert.alert(
        "No Skills Selected",
        "Please select at least one skill to save."
      );
      return;
    }
    Alert.alert(
      "Success",
      `Successfully saved ${selectedSkills.length} skill(s).`
    );
  
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
        <Text style={styles.headerTitle}>Add Skill</Text>
        <View style={styles.headerIconContainer} />
      </View>
      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search"
            size={FONT_SIZES.BODY_LARGE}
            color={COLORS.TEXT_GRAY}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a skill"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              style={styles.clearSearchIcon}
            >
              <Ionicons
                name="close-circle"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_GRAY}
              />
            </TouchableOpacity>
          )}
        </View>
        {selectedSkills.length > 0 && (
          <View style={styles.selectedSkillsContainer}>
            <Text style={styles.selectedSkillsLabel}>Selected Skills:</Text>
            <View style={styles.selectedSkillsPillsContainer}>
              {selectedSkills.map((skill, index) => (
                <View key={skill} style={styles.selectedSkillPill}>
                  <Text style={styles.selectedSkillText}>{skill}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveSkill(skill)}
                    style={styles.removeSkillIcon}
                  >
                    <Ionicons
                      name="close-circle"
                      size={FONT_SIZES.BODY}
                      color={COLORS.WHITE}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
        <FlatList
          data={filteredSkills}
          keyExtractor={(item, index) => `${item}-${index}`} 
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.skillItem}
              onPress={() => handleSkillSelect(item)}
            >
              <Text style={styles.skillText}>{item}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.skillListContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>No skills found.</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </ScrollView>
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
    paddingBottom: SPACING.XXL * 3,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.M,
    marginBottom: SPACING.L, 
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SPACING.S,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    paddingVertical: SPACING.S,
  },
  clearSearchIcon: {
    marginLeft: SPACING.S,
    padding: SPACING.XXS,
  },
  selectedSkillsContainer: {
    marginBottom: SPACING.L,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
  },
  selectedSkillsLabel: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
  },
  selectedSkillsPillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedSkillPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY_BLUE, // Use primary blue for selected skill chips
    borderRadius: BORDER_RADIUS.L,
    paddingVertical: SPACING.S,
    paddingLeft: SPACING.M,
    paddingRight: SPACING.XS, // Less padding on right to accommodate icon
    marginRight: SPACING.S,
    marginBottom: SPACING.S,
    ...SHADOWS.small,
  },
  selectedSkillText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.WHITE,
    fontWeight: "500",
    marginRight: SPACING.XS,
  },
  removeSkillIcon: {
    padding: SPACING.XXS, // Make touch target larger
  },
  skillListContent: {
    // No specific paddingBottom here as the parent ScrollView handles overall padding
  },
  skillItem: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    marginBottom: SPACING.S,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  skillText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    fontWeight: "500",
  },
  emptyListContainer: {
    alignItems: "center",
    marginTop: SPACING.XXL,
  },
  emptyListText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    marginHorizontal: SPACING.XL,
    marginBottom: SPACING.XXL, // This marginBottom is for spacing from the very bottom of the screen
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

export default AddSkillScreen;
