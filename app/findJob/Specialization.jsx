import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  FlatList, // Using FlatList for efficient grid rendering
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // For navigation
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers"; 




// Get screen width for responsive sizing for grid items
const { width: screenWidth } = Dimensions.get("window");
const CARD_MARGIN = SPACING.S; // Margin between cards
const NUM_COLUMNS = 2;
// Recalculate CARD_WIDTH using the new SPACING constants
const CARD_WIDTH =
  (screenWidth - SPACING.XL * 2 - CARD_MARGIN * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;

/**
 * Header Component for Specialization Category Screen
 */
const SpecializationCategoryHeader = ({
  onBackPress,
  onFilterPress,
  insets,
}) => {
  return (
    <View
      style={[headerStyles.container, { paddingTop: insets.top + SPACING.S }]}
    >
      <TouchableOpacity onPress={onBackPress} style={headerStyles.iconButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
      </TouchableOpacity>
      <View style={headerStyles.rightIcons}>
        {/* Search bar is part of the main screen content, not header */}
        <TouchableOpacity
          onPress={onFilterPress}
          style={headerStyles.filterButton}
        >
          <Ionicons
            name="search-outline"
            size={24}
            color={COLORS.FILTER_ICON_COLOR}
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
    backgroundColor: COLORS.WHITE,
    paddingBottom: SPACING.S,
    borderBottomLeftRadius: SPACING.L,
    borderBottomRightRadius: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButton: {
    padding: SPACING.XS,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: COLORS.FILTER_ICON_BG,
    borderRadius: SPACING.S, // Smaller radius for the filter button
    padding: SPACING.S,
  },
});

/**
 * Specialization Card Component
 */
const SpecializationCard = ({ specialization, isSelected, onPress }) => {
  // Determine icon name based on specialization name (example mapping)
  let iconName;
  switch (specialization.name) {
    case "Design":
      iconName = "brush-outline";
      break;
    case "Finance":
      iconName = "wallet-outline";
      break;
    case "Education":
      iconName = "school-outline";
      break;
    case "Restaurant":
      iconName = "restaurant-outline";
      break;
    case "Health":
      iconName = "heart-outline";
      break;
    case "Programmer":
      iconName = "code-slash-outline";
      break;
    default:
      iconName = "cube-outline"; 
  }

  return (
    <TouchableOpacity
      style={[
        cardStyles.card,
        isSelected ? cardStyles.cardActive : cardStyles.cardInactive,
        { width: CARD_WIDTH, margin: CARD_MARGIN / 2 }, 
      ]}
      onPress={() => onPress(specialization)}
      activeOpacity={0.7}
    >
      <View
        style={[
          cardStyles.iconCircle,
          isSelected
            ? cardStyles.iconCircleActive
            : cardStyles.iconCircleInactive,
        ]}
      >
        <Ionicons
          name={iconName}
          size={32}
          color={isSelected ? COLORS.CHIP_ACTIVE_TEXT : COLORS.ACCENT_ORANGE} 
        />
      </View>
      <Text
        style={[
          cardStyles.cardTitle,
          isSelected
            ? cardStyles.cardTitleActive
            : cardStyles.cardTitleInactive,
        ]}
      >
        {specialization.name}
      </Text>
      <Text
        style={[
          cardStyles.jobCount,
          isSelected ? cardStyles.jobCountActive : cardStyles.jobCountInactive,
        ]}
      >
        {specialization.jobs} Jobs
      </Text>
    </TouchableOpacity>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: SPACING.L,
    padding: SPACING.S,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: CARD_MARGIN, // Add bottom margin for row spacing
  },
  cardActive: {
    backgroundColor: COLORS.ACCENT_ORANGE,
  },
  cardInactive: {
    backgroundColor: COLORS.WHITE,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.S,
  },
  iconCircleActive: {
    backgroundColor: "rgba(255,255,255,0.2)", // Semi-transparent white circle
  },
  iconCircleInactive: {
    backgroundColor: COLORS.BACKGROUND, // Light background for inactive icon circle
  },
  cardTitle: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
  },
  cardTitleActive: {
    color: COLORS.WHITE,
  },
  cardTitleInactive: {
    color: COLORS.TEXT_DARK,
  },
  jobCount: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: "500",
  },
  jobCountActive: {
    color: COLORS.WHITE,
  },
  jobCountInactive: {
    color: COLORS.TEXT_GRAY,
  },
});

const SpecializationScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(null); // Only one can be selected based on image

  // Dummy data for specializations
  const allSpecializations = [
    { id: "1", name: "Design", jobs: 140 },
    { id: "2", name: "Finance", jobs: 250 },
    { id: "3", name: "Education", jobs: 120 },
    { id: "4", name: "Restaurant", jobs: 85 },
    { id: "5", name: "Health", jobs: 235 },
    { id: "6", name: "Programmer", jobs: 412 },
    { id: "7", name: "Marketing", jobs: 180 },
    { id: "8", name: "Engineering", jobs: 300 },
    { id: "9", name: "Human Resources", jobs: 90 },
    { id: "10", name: "Sales", jobs: 150 },
  ];

  const filteredSpecializations = allSpecializations.filter((spec) =>
    spec.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCardPress = useCallback((specialization) => {
    setSelectedSpecialization((prevSelected) =>
      prevSelected?.id === specialization.id ? null : specialization
    );
  }, []);

  const handleShowResult = () => {
    if (!selectedSpecialization) {
      Alert.alert(
        "No Specialization Selected",
        "Please select a specialization to show results."
      );
      return;
    }
   
    router.push({
      pathname: "findJob/Search", 
      params: { specialization: selectedSpecialization.name },
    });
  };

  
  const bottomButtonHeight = SPACING.M * 2 + SPACING.S + insets.bottom;

  return (
    <View style={styles.container}>
      {/* Header */}
      <SpecializationCategoryHeader
        onBackPress={() => router.back()}
        onFilterPress={() => router.push("findJob/filters")}
        insets={insets}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: bottomButtonHeight + SPACING.L }, 
        ]}
        showsVerticalScrollIndicator={false} 
      >
        {/* Main Heading */}
        <Text style={styles.mainHeading}>What is your specialization?</Text>

        {/* Search Bar and Filter Icon */}
        <View style={styles.searchBarAndFilterContainer}>
          <View style={styles.searchBarContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={COLORS.TEXT_GRAY}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity
            style={styles.filterButtonInline}
            onPress={() => router.push("findJob/filters")}
          >
            <Ionicons
              name="options-outline"
              size={24}
              color={COLORS.FILTER_ICON_COLOR}
            />
          </TouchableOpacity>
        </View>

        {/* Specialization Heading */}
        <Text style={styles.sectionHeading}>Specialization</Text>

        {/* Specialization Grid */}
        <FlatList
          data={filteredSpecializations}
          renderItem={({ item }) => (
            <SpecializationCard
              specialization={item}
              isSelected={selectedSpecialization?.id === item.id}
              onPress={handleCardPress}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false} // FlatList inside ScrollView should not scroll itself
          columnWrapperStyle={styles.row} // Apply styles to the row of columns
        />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View
        style={[
          styles.bottomButtonContainer,
          { paddingBottom: insets.bottom + SPACING.S },
        ]}
      >
        <TouchableOpacity
          style={styles.showResultButton}
          onPress={handleShowResult}
          disabled={!selectedSpecialization} // Disable if no specialization is selected
        >
          <Text style={styles.showResultButtonText}>SHOW RESULT</Text>
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
  scrollViewContent: {
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.L, // Padding below the header
    // paddingBottom will be dynamically set to ensure content clears the fixed button
  },
  mainHeading: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.L,
  },
  searchBarAndFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.XXL,
    justifyContent: "space-between",
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
    flex: 1,
    marginRight: SPACING.S,
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
  filterButtonInline: {
    backgroundColor: COLORS.FILTER_ICON_BG,
    borderRadius: SPACING.S,
    padding: SPACING.S,
  },
  sectionHeading: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.M,
  },
  row: {
    justifyContent: "space-between",
  },
  bottomButtonContainer: {
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
  showResultButton: {
    backgroundColor: COLORS.PRIMARY_DARK_BLUE,
    borderRadius: SPACING.S,
    paddingVertical: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
  },
  showResultButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
  },
});

export default SpecializationScreen;
