// app/AddJob/JobPositionPicker.js
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  SHADOWS,
  SPACING,
} from "../../constants/helpers";

// Enhanced job positions data with categories
const JOB_POSITIONS_DATA = [
  {
    category: "Administrative",
    positions: [
      "Administrative Assistant",
      "Executive Assistant",
      "Office Manager",
      "Receptionist",
      "Data Entry Clerk",
    ],
  },
  {
    category: "Sales & Retail",
    positions: [
      "Sales Associate",
      "Account Manager",
      "Retail Salesperson",
      "Sales Manager",
      "Customer Service Representative",
    ],
  },
  {
    category: "Technology",
    positions: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "UX/UI Designer",
      "Data Scientist",
      "Product Manager",
    ],
  },
  {
    category: "Finance",
    positions: [
      "Accountant",
      "Financial Analyst",
      "Auditor",
      "Investment Banker",
      "Financial Advisor",
    ],
  },
  {
    category: "Healthcare",
    positions: [
      "Registered Nurse",
      "Medical Assistant",
      "Physician",
      "Pharmacist",
      "Dental Hygienist",
    ],
  },
];

const JobPositionPicker = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialJobPosition = params.initialValue || "";

  const [searchQuery, setSearchQuery] = useState(initialJobPosition);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Animation for screen entrance
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  // Flatten positions for search
  const allPositions = useMemo(
    () => JOB_POSITIONS_DATA.flatMap((cat) => cat.positions),
    []
  );

  // Filter job positions based on search query
  const filteredJobPositions = useMemo(() => {
    if (!searchQuery.trim()) {
      return JOB_POSITIONS_DATA;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    return JOB_POSITIONS_DATA.map((category) => ({
      ...category,
      positions: category.positions.filter((position) =>
        position.toLowerCase().includes(lowerCaseQuery)
      ),
    })).filter((category) => category.positions.length > 0);
  }, [searchQuery]);

  // Handle selection of a job position
  const handleSelectPosition = useCallback(
    (position) => {
      router.setParams({ selectedJobPosition: position });
      router.back();
    },
    [router]
  );

  // Handle clearing the search input
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    Keyboard.dismiss();
  }, []);

  // Render each position item
  const renderPositionItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.positionItem}
        onPress={() => handleSelectPosition(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.positionText}>{item}</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_LIGHT} />
      </TouchableOpacity>
    ),
    [handleSelectPosition]
  );

  // Render each category section
  const renderCategorySection = useCallback(
    ({ item }) => (
      <View style={styles.categoryContainer} key={item.category}>
        <Text style={styles.categoryTitle}>{item.category}</Text>
        <View style={styles.categoryContent}>
          {item.positions.map((position) => (
            <TouchableOpacity
              key={position}
              style={styles.positionItem}
              onPress={() => handleSelectPosition(position)}
              activeOpacity={0.7}
            >
              <Text style={styles.positionText}>{position}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.TEXT_LIGHT}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [handleSelectPosition]
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY_BLUE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Job Position</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={isSearchFocused ? COLORS.PRIMARY_BLUE : COLORS.TEXT_LIGHT}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search job positions..."
            placeholderTextColor={COLORS.TEXT_LIGHT}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearSearchButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.TEXT_LIGHT}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Job Positions List */}
        {searchQuery.trim() ? (
          // Search results view
          <FlatList
            data={allPositions.filter((pos) =>
              pos.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            keyExtractor={(item) => item}
            renderItem={renderPositionItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={COLORS.TEXT_LIGHT}
                  style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyStateTitle}>No results found</Text>
                <Text style={styles.emptyStateText}>
                  Try a different search term
                </Text>
              </View>
            }
          />
        ) : (
          // Categorized view
          <FlatList
            data={filteredJobPositions}
            keyExtractor={(item) => item.category}
            renderItem={renderCategorySection}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    backgroundColor: COLORS.WHITE,
    ...SHADOWS.small,
  },
  backButton: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
  },
  headerRightPlaceholder: {
    width: 24 + SPACING.XS * 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    margin: SPACING.L,
    marginBottom: SPACING.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    ...SHADOWS.small,
  },
  searchContainerFocused: {
    borderColor: COLORS.PRIMARY_BLUE,
  },
  searchIcon: {
    marginRight: SPACING.S,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: SPACING.XS,
    marginLeft: SPACING.XS,
  },
  listContentContainer: {
    paddingBottom: SPACING.XL,
  },
  categoryContainer: {
    marginBottom: SPACING.L,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.BODY_SMALL,
    fontWeight: "600",
    color: COLORS.TEXT_GRAY,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginHorizontal: SPACING.L,
    marginBottom: SPACING.S,
  },
  categoryContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    marginHorizontal: SPACING.L,
    ...SHADOWS.small,
  },
  positionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  positionItemLast: {
    borderBottomWidth: 0,
  },
  positionText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.XL,
  },
  emptyStateIcon: {
    opacity: 0.5,
    marginBottom: SPACING.M,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.H3,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
  },
});

export default JobPositionPicker;
