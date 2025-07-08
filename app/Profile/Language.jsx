import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
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

const LanguageScreen = () => {
  const router = useRouter();

  // Sample language data (in a real app, this would come from a global state or API)
  const [userLanguages, setUserLanguages] = useState([
    {
      id: "indonesian",
      name: "Indonesian",
      flag: "🇮🇩",
      isFirstLanguage: true,
      oral: 10,
      written: 10,
    },
    {
      id: "english",
      name: "English",
      flag: "🇬🇧",
      isFirstLanguage: false,
      oral: 8,
      written: 8,
    },
    {
      id: "spanish",
      name: "Spanish",
      flag: "🇪🇸",
      isFirstLanguage: false,
      oral: 7,
      written: 6,
    },
  ]);

  /**
   * Handles the deletion of a language.
   * @param {string} id - The unique ID of the language to delete.
   */
  const handleDeleteLanguage = (id) => {
    Alert.alert(
      "Delete Language",
      "Are you sure you want to delete this language?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setUserLanguages((prevLanguages) =>
              prevLanguages.filter((lang) => lang.id !== id)
            );
            Alert.alert("Deleted", "Language successfully deleted.");
            // In a real app, you would also call an API to delete the language from the backend
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Handles saving the current list of languages.
   * This would typically be triggered after bulk edits or reordering,
   * but for now, it simulates saving the current state.
   */
  const handleSaveLanguages = () => {
    Alert.alert("Saved", "Your language list has been updated.");
    // In a real application, this would send the updated userLanguages array to your backend.
  };

  /**
   * Renders a single language item in the FlatList.
   * @param {object} item - The language object.
   * @returns {JSX.Element} The rendered language card.
   */
  const renderLanguageItem = ({ item }) => (
    <View style={styles.languageCard}>
      <View style={styles.languageCardHeader}>
        <Text style={styles.languageFlag}>{item.flag}</Text>
        <Text style={styles.languageName}>
          {item.name}
          {item.isFirstLanguage && (
            <Text style={styles.firstLanguageText}> (First language)</Text>
          )}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteLanguage(item.id)}
          style={styles.deleteIconContainer}
        >
          <Ionicons
            name="trash-outline"
            size={FONT_SIZES.H2}
            color={COLORS.ACCENT_ORANGE}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.languageProficiency}>
        <Text style={styles.proficiencyText}>Oral: Level {item.oral}</Text>
        <Text style={styles.proficiencyText}>
          Written: Level {item.written}
        </Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Language</Text>
        <TouchableOpacity
          onPress={() => router.push("Profile/AddLanguage")}
          style={styles.addLanguageButton}
        >
          <Text style={styles.addLanguageText}>Add</Text>
          <Ionicons
            name="add-circle-outline"
            size={FONT_SIZES.H2}
            color={COLORS.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {/* Language List */}
      <FlatList
        data={userLanguages}
        keyExtractor={(item) => item.id}
        renderItem={renderLanguageItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.languageListContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No languages added yet.</Text>
            <TouchableOpacity
              onPress={() => router.push("Profile/AddLanguage")}
              style={styles.addFirstLanguageButton}
            >
              <Text style={styles.addFirstLanguageButtonText}>
                Add Your First Language
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Save Button for the entire list (if needed for reordering/bulk edits) */}
      {userLanguages.length > 0 && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveLanguages}
        >
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      )}
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
  addLanguageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LIGHT_PURPLE, // Light background for add button
    borderRadius: BORDER_RADIUS.L, // More rounded
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
  },
  addLanguageText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY,
    fontWeight: "600",
    marginRight: SPACING.XXS,
  },
  languageListContent: {
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.L,
    paddingBottom: SPACING.XXL * 3, // Ensure space for the fixed save button
  },
  languageCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L, // Larger radius for the card
    padding: SPACING.M,
    marginBottom: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  languageCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.S,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR_LIGHT,
    paddingBottom: SPACING.S,
  },
  languageFlag: {
    fontSize: FONT_SIZES.H1, // Larger flag emoji
    marginRight: SPACING.S,
  },
  languageName: {
    flex: 1, // Allows name to take up space
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  firstLanguageText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    fontWeight: "normal",
  },
  deleteIconContainer: {
    padding: SPACING.XS,
    marginLeft: SPACING.S,
  },
  languageProficiency: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.S,
  },
  proficiencyText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
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
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.XXL * 2,
  },
  emptyListText: {
    fontSize: FONT_SIZES.H2,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.L,
    textAlign: "center",
  },
  addFirstLanguageButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.XL,
    ...SHADOWS.medium,
  },
  addFirstLanguageButtonText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default LanguageScreen;
