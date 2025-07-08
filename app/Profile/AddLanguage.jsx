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
  FlatList,
  Alert,
  Switch,
  Modal,
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

// Comprehensive list of languages with emojis as flags
const allLanguages = [
  { id: "arabic", name: "Arabic", flag: "🇸🇦" },
  { id: "indonesian", name: "Indonesian", flag: "🇮🇩" },
  { id: "malay", name: "Malay", flag: "🇲🇾" },
  { id: "english", name: "English", flag: "🇬🇧" },
  { id: "french", name: "French", flag: "🇫🇷" },
  { id: "german", name: "German", flag: "🇩🇪" },
  { id: "hindi", name: "Hindi", flag: "🇮🇳" },
  { id: "italian", name: "Italian", flag: "🇮🇹" },
  { id: "japanese", name: "Japanese", flag: "🇯🇵" },
  { id: "korean", name: "Korean", flag: "🇰🇷" },
  { id: "mandarin", name: "Mandarin", flag: "🇨🇳" },
  { id: "portuguese", name: "Portuguese", flag: "🇵🇹" },
  { id: "russian", name: "Russian", flag: "🇷🇺" },
  { id: "spanish", name: "Spanish", flag: "🇪🇸" },
  { id: "thai", name: "Thai", flag: "🇹🇭" },
  { id: "turkish", name: "Turkish", flag: "🇹🇷" },
  { id: "vietnamese", name: "Vietnamese", flag: "🇻🇳" },
  // Add more languages as needed
];

const proficiencyLevels = Array.from({ length: 11 }, (_, i) => i); // Levels 0 to 10

const AddLanguageScreen = () => {
  const router = useRouter();

  // State for the current step in the add language flow
  const [step, setStep] = useState("search"); // 'search' or 'details'

  // State for the language being added/edited
  const [selectedLanguage, setSelectedLanguage] = useState(null); // { id, name, flag }
  const [isFirstLanguage, setIsFirstLanguage] = useState(false);
  const [oralLevel, setOralLevel] = useState(null); // Level 0-10
  const [writtenLevel, setWrittenLevel] = useState(null); // Level 0-10

  // State for the proficiency selection modal
  const [showProficiencyModal, setShowProficiencyModal] = useState(false);
  const [currentProficiencyType, setCurrentProficiencyType] = useState(null); // 'oral' or 'written'

  /**
   * Filters the list of all languages based on the search query.
   * Uses useMemo to optimize performance by memoizing the filtered list.
   */
  const filteredLanguages = useMemo(() => {
    if (!searchQuery) {
      return allLanguages; // Show all languages if search query is empty
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allLanguages.filter((lang) =>
      lang.name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  /**
   * Handles selecting a language from the search list.
   * Sets the selected language and moves to the details step.
   * @param {object} language - The selected language object.
   */
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setStep("details");
    setSearchQuery(""); // Clear search query
  };

  /**
   * Opens the proficiency selection modal for a specific type (oral/written).
   * @param {string} type - 'oral' or 'written'.
   */
  const openProficiencyModal = (type) => {
    setCurrentProficiencyType(type);
    setShowProficiencyModal(true);
  };

  /**
   * Handles selecting a proficiency level from the modal.
   * @param {number} level - The selected proficiency level.
   */
  const handleProficiencySelect = (level) => {
    if (currentProficiencyType === "oral") {
      setOralLevel(level);
    } else if (currentProficiencyType === "written") {
      setWrittenLevel(level);
    }
    setShowProficiencyModal(false);
  };

  /**
   * Handles the saving of the language entry.
   * Performs basic validation and then simulates saving the data.
   */
  const handleSave = () => {
    if (!selectedLanguage) {
      Alert.alert("Error", "Please select a language.");
      return;
    }
    if (oralLevel === null || writtenLevel === null) {
      Alert.alert(
        "Error",
        "Please select oral and written proficiency levels."
      );
      return;
    }

    const languageData = {
      id: selectedLanguage.id,
      name: selectedLanguage.name,
      flag: selectedLanguage.flag,
      isFirstLanguage,
      oral: oralLevel,
      written: writtenLevel,
    };

    Alert.alert("Success", `${selectedLanguage.name} added successfully!`);
    // In a real app, you would typically:
    // 1. Send languageData to your backend/database.
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
        <Text style={styles.headerTitle}>Add Language</Text>
        <View style={styles.headerIconContainer} />{" "}
        {/* Placeholder for spacing */}
      </View>

      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {step === "search" ? (
          // --- Step 1: Search Language ---
          <View style={styles.searchSection}>
            <View style={styles.searchBarContainer}>
              <Ionicons
                name="search"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_GRAY}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search language"
                placeholderTextColor={COLORS.TEXT_GRAY}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
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

            <FlatList
              data={filteredLanguages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageSearchItem}
                  onPress={() => handleLanguageSelect(item)}
                >
                  <Text style={styles.languageSearchFlag}>{item.flag}</Text>
                  <Text style={styles.languageSearchName}>{item.name}</Text>
                  {/* Optional: Add a checkmark if already selected, or an arrow */}
                  <Ionicons
                    name="chevron-forward-outline"
                    size={FONT_SIZES.BODY_LARGE}
                    color={COLORS.TEXT_GRAY}
                  />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.languageSearchListContent}
              ListEmptyComponent={() => (
                <View style={styles.emptyListContainer}>
                  <Text style={styles.emptyListText}>No languages found.</Text>
                </View>
              )}
              scrollEnabled={false} // Let parent ScrollView handle scrolling
            />
          </View>
        ) : (
          // --- Step 2: Define Language Details ---
          <View style={styles.detailsSection}>
            {/* Selected Language Display */}
            <View style={styles.selectedLanguageDisplay}>
              <Text style={styles.selectedLanguageFlag}>
                {selectedLanguage?.flag}
              </Text>
              <Text style={styles.selectedLanguageName}>
                {selectedLanguage?.name}
              </Text>
            </View>

            {/* First Language Switch */}
            <View style={styles.inputGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.inputLabel}>First language</Text>
                <Switch
                  trackColor={{
                    false: COLORS.TEXT_LIGHT,
                    true: COLORS.PRIMARY_BLUE,
                  }}
                  thumbColor={COLORS.WHITE}
                  ios_backgroundColor={COLORS.TEXT_LIGHT}
                  onValueChange={setIsFirstLanguage}
                  value={isFirstLanguage}
                />
              </View>
            </View>

            {/* Oral Proficiency Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Oral</Text>
              <TouchableOpacity
                style={styles.proficiencyInput}
                onPress={() => openProficiencyModal("oral")}
              >
                <Text style={styles.proficiencyInputText}>
                  {oralLevel !== null
                    ? `Level ${oralLevel}`
                    : "Choose your speaking skill level"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={FONT_SIZES.BODY_LARGE}
                  color={COLORS.TEXT_GRAY}
                />
              </TouchableOpacity>
            </View>

            {/* Written Proficiency Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Written</Text>
              <TouchableOpacity
                style={styles.proficiencyInput}
                onPress={() => openProficiencyModal("written")}
              >
                <Text style={styles.proficiencyInputText}>
                  {writtenLevel !== null
                    ? `Level ${writtenLevel}`
                    : "Choose your writing skill level"}
                </Text>
                <Ionicons
                  name="chevron-down-outline"
                  size={FONT_SIZES.BODY_LARGE}
                  color={COLORS.TEXT_GRAY}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.proficiencyHint}>
              Proficiency level : 0 - Poor, 10 - Very good
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Save Button */}
      {step === "details" && ( // Only show save button on details step
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      )}

      {/* Proficiency Level Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showProficiencyModal}
        onRequestClose={() => setShowProficiencyModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowProficiencyModal(false)} // Close when clicking outside
        >
          <View style={styles.proficiencyModalContent}>
            <View style={styles.modalHandle} /> {/* Drag handle */}
            <FlatList
              data={proficiencyLevels}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.proficiencyModalItem}
                  onPress={() => handleProficiencySelect(item)}
                >
                  <Text style={styles.proficiencyModalText}>Level {item}</Text>
                  {((currentProficiencyType === "oral" && oralLevel === item) ||
                    (currentProficiencyType === "written" &&
                      writtenLevel === item)) && (
                    <Ionicons
                      name="radio-button-on"
                      size={FONT_SIZES.BODY_LARGE}
                      color={COLORS.PRIMARY_BLUE}
                    />
                  )}
                  {((currentProficiencyType === "oral" && oralLevel !== item) ||
                    (currentProficiencyType === "written" &&
                      writtenLevel !== item)) && (
                    <Ionicons
                      name="radio-button-off"
                      size={FONT_SIZES.BODY_LARGE}
                      color={COLORS.TEXT_GRAY}
                    />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={() => setShowProficiencyModal(false)}
            >
              <Text style={styles.modalDoneButtonText}>DONE</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  addLanguageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LIGHT_PURPLE,
    borderRadius: BORDER_RADIUS.L,
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
  },
  addLanguageText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY,
    fontWeight: "600",
    marginRight: SPACING.XXS,
  },
  contentScrollView: {
    flex: 1,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.L,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.XXL * 3, // Ensure space for the fixed save button
  },
  // --- Search Section Styles ---
  searchSection: {
    flex: 1,
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
  languageSearchListContent: {
    // No specific paddingBottom here as the parent ScrollView handles overall padding
  },
  languageSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    marginBottom: SPACING.S,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  languageSearchFlag: {
    fontSize: FONT_SIZES.H2, // Flag size
    marginRight: SPACING.M,
  },
  languageSearchName: {
    flex: 1,
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
  // --- Details Section Styles ---
  detailsSection: {
    flex: 1,
  },
  selectedLanguageDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    marginBottom: SPACING.L,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
  },
  selectedLanguageFlag: {
    fontSize: FONT_SIZES.H1,
    marginRight: SPACING.M,
  },
  selectedLanguageName: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  proficiencyInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  proficiencyInputText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    flex: 1, // Allow text to take space
  },
  proficiencyHint: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    marginTop: SPACING.S,
  },
  // --- Save Button (Common) ---
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
  // --- Proficiency Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Darker overlay for modals
    justifyContent: "flex-end", // Align modal to bottom
  },
  proficiencyModalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.L,
    borderTopRightRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    maxHeight: "70%", // Limit modal height
    ...SHADOWS.large, // Stronger shadow for modal
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.TEXT_GRAY,
    borderRadius: BORDER_RADIUS.S,
    alignSelf: "center",
    marginBottom: SPACING.L,
  },
  proficiencyModalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.M,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.BORDER_COLOR_LIGHT,
  },
  proficiencyModalText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
  },
  modalDoneButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    marginTop: SPACING.L,
  },
  modalDoneButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default AddLanguageScreen;
