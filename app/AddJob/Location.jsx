// app/AddJob/LocationPicker.js
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/helpers";

// Enhanced location data with countries and popular cities
const LOCATION_DATA = [
  {
    country: "United States",
    cities: [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
      "Austin",
      "Jacksonville",
      "Fort Worth",
      "Columbus",
      "Charlotte",
      "San Francisco",
      "Indianapolis",
      "Seattle",
      "Denver",
      "Washington",
      "Boston",
      "Nashville",
    ],
  },
  {
    country: "Canada",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  },
  {
    country: "United Kingdom",
    cities: ["London", "Manchester", "Birmingham", "Liverpool", "Edinburgh"],
  },
  {
    country: "Australia",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  },
  {
    country: "Germany",
    cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  },
  {
    country: "Pakistan",
    cities: ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad"],
  },
];

const LocationPickerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialLocation = params.initialValue || "";

  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation for screen entrance
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  // Flatten locations for search
  const allLocations = useMemo(
    () =>
      LOCATION_DATA.flatMap((countryData) =>
        countryData.cities.map((city) => `${city}, ${countryData.country}`)
      ),
    []
  );

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return LOCATION_DATA;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    return LOCATION_DATA.map((countryData) => ({
      ...countryData,
      cities: countryData.cities.filter(
        (city) =>
          city.toLowerCase().includes(lowerCaseQuery) ||
          countryData.country.toLowerCase().includes(lowerCaseQuery)
      ),
    })).filter((countryData) => countryData.cities.length > 0);
  }, [searchQuery]);

  // Handle selection of a location
  const handleSelectLocation = useCallback(
    (location) => {
      router.setParams({ selectedJobLocation: location });
      router.back();
    },
    [router]
  );

  // Handle clearing the search input
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    Keyboard.dismiss();
  }, []);

  // Render each location item
  const renderLocationItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.locationItem}
        onPress={() =>
          handleSelectLocation(
            `${item}, ${
              LOCATION_DATA.find((c) => c.cities.includes(item))?.country
            }`
          )
        }
        activeOpacity={0.7}
      >
        <Ionicons
          name="location-outline"
          size={20}
          color={COLORS.PRIMARY_BLUE}
          style={styles.locationIcon}
        />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationCity}>{item}</Text>
          <Text style={styles.locationCountry}>
            {LOCATION_DATA.find((c) => c.cities.includes(item))?.country}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.TEXT_LIGHT} />
      </TouchableOpacity>
    ),
    [handleSelectLocation]
  );

  // Render each country section
  const renderCountrySection = useCallback(
    ({ item }) => (
      <View style={styles.countryContainer} key={item.country}>
        <Text style={styles.countryTitle}>{item.country}</Text>
        <View style={styles.countryContent}>
          {item.cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={styles.locationItem}
              onPress={() => handleSelectLocation(`${city}, ${item.country}`)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color={COLORS.PRIMARY_BLUE}
                style={styles.locationIcon}
              />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationCity}>{city}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={COLORS.TEXT_LIGHT}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [handleSelectLocation]
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
          <Text style={styles.headerTitle}>Select Location</Text>
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
            placeholder="Search locations..."
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

        {/* Recent Searches Section (would be dynamic in a real app) */}
        {!searchQuery && (
          <View style={styles.recentSearchesContainer}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentSearchChips}>
              <TouchableOpacity
                style={styles.recentSearchChip}
                onPress={() => handleSelectLocation("New York, United States")}
              >
                <Text style={styles.recentSearchChipText}>New York</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.recentSearchChip}
                onPress={() => handleSelectLocation("London, United Kingdom")}
              >
                <Text style={styles.recentSearchChipText}>London</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Locations List */}
        {searchQuery.trim() ? (
          // Search results view
          <FlatList
            data={allLocations.filter((loc) =>
              loc.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationItem}
                onPress={() => handleSelectLocation(item)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={COLORS.PRIMARY_BLUE}
                  style={styles.locationIcon}
                />
                <Text style={styles.locationText}>{item}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={COLORS.TEXT_LIGHT}
                />
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="location-off-outline"
                  size={48}
                  color={COLORS.TEXT_LIGHT}
                  style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyStateTitle}>No locations found</Text>
                <Text style={styles.emptyStateText}>
                  Try a different search term
                </Text>
              </View>
            }
          />
        ) : (
          // Categorized view
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.country}
            renderItem={renderCountrySection}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          activeOpacity={0.7}
          onPress={() => handleSelectLocation("Current Location")}
        >
          <Ionicons
            name="navigate-circle"
            size={24}
            color={COLORS.PRIMARY_BLUE}
          />
          <Text style={styles.currentLocationText}>Use current location</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
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
  recentSearchesContainer: {
    paddingHorizontal: SPACING.L,
    marginBottom: SPACING.M,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BODY_SMALL,
    fontWeight: "600",
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.S,
  },
  recentSearchChips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recentSearchChip: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    marginRight: SPACING.S,
    marginBottom: SPACING.S,
    ...SHADOWS.small,
  },
  recentSearchChipText: {
    fontSize: FONT_SIZES.BODY_SMALL,
    color: COLORS.TEXT_DARK,
  },
  listContentContainer: {
    paddingBottom: SPACING.XL,
  },
  countryContainer: {
    marginBottom: SPACING.L,
  },
  countryTitle: {
    fontSize: FONT_SIZES.BODY_SMALL,
    fontWeight: "600",
    color: COLORS.TEXT_GRAY,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginHorizontal: SPACING.L,
    marginBottom: SPACING.S,
  },
  countryContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    marginHorizontal: SPACING.L,
    ...SHADOWS.small,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  locationIcon: {
    marginRight: SPACING.M,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationCity: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS,
  },
  locationCountry: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  locationText: {
    flex: 1,
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
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.M,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  currentLocationText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "600",
    marginLeft: SPACING.S,
  },
});

export default LocationPickerScreen;
