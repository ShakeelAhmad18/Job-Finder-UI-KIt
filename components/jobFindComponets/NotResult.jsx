import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers"; // Assuming these are defined

/**
 * NoResultsHeader Component
 * Specifically designed for the "No results found" screen
 */
const NoResultsHeader = ({
  onBackPress,
  searchText,
  onSearchTextChange,
  insets,
}) => {
  return (
    <View
      style={[headerStyles.container, { paddingTop: insets.top + SPACING.S }]}
    >
      <TouchableOpacity onPress={onBackPress} style={headerStyles.backButton}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={COLORS.PRIMARY_DARK_BLUE}
        />
      </TouchableOpacity>
      <View style={headerStyles.searchBarContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={COLORS.PRIMARY_DARK_BLUE}
          style={headerStyles.searchIcon}
        />
        <TextInput
          style={headerStyles.searchInput}
          placeholder="Design" 
          placeholderTextColor={COLORS.TEXT_GRAY}
          value={searchText}
          onChangeText={onSearchTextChange}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    backgroundColor: COLORS.BACKGROUND_BLUE, // Match previous screens' header background
    paddingBottom: SPACING.L,
    borderBottomLeftRadius: SPACING.L,
    borderBottomRightRadius: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: SPACING.XS,
    marginRight: SPACING.M, // Space between back button and search bar
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.M,
    paddingHorizontal: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flex: 1, // Allow search bar to take available space
  },
  searchIcon: {
    marginRight: SPACING.S,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
  },
});

// Main NoResultsFoundScreen Component
const NoResultsFoundScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams(); // To potentially get the search term that led to no results

  const [searchText, setSearchText] = useState(params.searchTerm || "");

  
  const noResultsIllustration = require("../../assets/images/Notfound.png");

  return (
    <View style={styles.container}>
      {/* Header */}
      <NoResultsHeader
        onBackPress={() => router.back()}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        insets={insets}
      />

      {/* Main Content: Illustration and Text */}
      <View style={styles.content}>
        <Image
          source={noResultsIllustration}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.title}>No results found</Text>
        <Text style={styles.subtitle}>
          The search could not be found, please check spelling or write another
          word.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND, // Light background as per image
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    paddingBottom: SPACING.XXL * 2, // Add some bottom padding to push content slightly up if needed
  },
  illustration: {
    width: 200, // Adjust size as needed
    height: 200, // Adjust size as needed
    marginBottom: SPACING.XXL,
  },
  title: {
    fontSize: FONT_SIZES.H1, // Larger, bold title
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    lineHeight: FONT_SIZES.BODY * 1.4, // Improve readability
    paddingHorizontal: SPACING.M, // Ensure text wraps nicely
  },
});

export default NoResultsFoundScreen;
