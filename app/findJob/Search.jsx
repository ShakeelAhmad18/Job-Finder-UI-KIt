import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  FlatList,
  Image, // For company logos
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router"; // For navigation and params
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers";
import NoResultsFoundScreen from "../../components/jobFindComponets/NotResult";

// Get screen width for responsive sizing for job cards
const { width: screenWidth } = Dimensions.get("window");
const JOB_CARD_HORIZONTAL_PADDING = SPACING.L; // Padding on sides of the screen
const JOB_CARD_MARGIN_BOTTOM = SPACING.M; // Margin between job cards
const JOB_CARD_WIDTH = screenWidth - SPACING.XL * 2; // Full width minus screen padding

/**
 * SearchHeader Component
 */
const SearchHeader = ({ onBackPress, onFilterPress, insets }) => {
  return (
    <View
      style={[headerStyles.container, { paddingTop: insets.top + SPACING.S }]}
    >
      <TouchableOpacity onPress={onBackPress} style={headerStyles.iconButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
      </TouchableOpacity>
      <Text style={headerStyles.title}>Search</Text>
      <TouchableOpacity onPress={onFilterPress} style={headerStyles.iconButton}>
        <Ionicons
          name="options-outline"
          size={24}
          color={COLORS.FILTER_ICON_COLOR}
        />
      </TouchableOpacity>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    backgroundColor: COLORS.BACKGROUND_BLUE, // Dark blue background for header
    paddingBottom: SPACING.L, // More padding for visual space
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
  title: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.PRIMARY_DARK_BLUE, // White text for header title
  },
});

/**
 * Filter Chip Component
 */
const FilterChip = ({ title, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        chipStyles.chip,
        isSelected ? chipStyles.chipActive : chipStyles.chipInactive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          chipStyles.chipText,
          isSelected ? chipStyles.chipTextActive : chipStyles.chipTextInactive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const chipStyles = StyleSheet.create({
  chip: {
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    borderRadius: SPACING.L,
    marginRight: SPACING.S,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: COLORS.CHIP_ACTIVE_BG,
    borderColor: COLORS.CHIP_ACTIVE_BG,
  },
  chipInactive: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
  },
  chipText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "500",
  },
  chipTextActive: {
    color: COLORS.WHITE,
  },
  chipTextInactive: {
    color: COLORS.TEXT_DARK,
  },
});

/**
 * Job Card Component
 */
const JobCard = ({ job }) => {
  return (
    <View style={jobCardStyles.card}>
      <View style={jobCardStyles.header}>
        <Image source={job.logo} style={jobCardStyles.logo} />
        <TouchableOpacity>
          <Ionicons
            name="bookmark-outline"
            size={24}
            color={COLORS.TEXT_GRAY}
          />
        </TouchableOpacity>
      </View>
      <Text style={jobCardStyles.jobTitle}>{job.title}</Text>
      <Text style={jobCardStyles.companyInfo}>
        {job.company} • {job.location}
      </Text>
      <View style={jobCardStyles.tagsContainer}>
        {job.tags.map((tag, index) => (
          <View key={index} style={jobCardStyles.tag}>
            <Text style={jobCardStyles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <View style={jobCardStyles.footer}>
        <Text style={jobCardStyles.postedTime}>{job.postedTime}</Text>
        <Text style={jobCardStyles.salary}>{job.salary}</Text>
      </View>
    </View>
  );
};

const jobCardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.M,
    padding: SPACING.L,
    marginBottom: JOB_CARD_MARGIN_BOTTOM,
    width: JOB_CARD_WIDTH,
    alignSelf: "center", // Center the cards in the FlatList
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.S,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: SPACING.XS,
    resizeMode: "contain", // Ensure logo fits well
  },
  jobTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
  },
  companyInfo: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.S,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SPACING.M,
  },
  tag: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SPACING.XS,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.S,
    marginRight: SPACING.S,
    marginBottom: SPACING.S,
  },
  tagText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DARK,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.S,
  },
  postedTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  salary: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.ACCENT_ORANGE,
  },
});

// Main Search Screen Component
const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams(); // To get specialization from previous screen

  const [searchText, setSearchText] = useState(params.specialization || ""); // Pre-fill from specialization
  const [locationText, setLocationText] = useState("California, USA");
  const [selectedChip, setSelectedChip] = useState("Senior designer"); // Default selected based on image

  // Dummy Data for Filter Chips
  const filterChips = useMemo(
    () => ["Senior designer", "Designer", "Full-time", "Part-time", "Remote"],
    []
  );

  // Dummy Data for Job Listings
  const allJobListings = useMemo(
    () => [
      {
        id: "1",
        logo: require("../../assets/images/google_logo.png"), // Assuming you have these logos
        title: "UI/UX Designer",
        company: "Google inc",
        location: "California, USA",
        tags: ["Design", "Full time", "Senior designer"],
        postedTime: "25 minute ago",
        salary: "$15K/Mo",
      },
      {
        id: "2",
        logo: require("../../assets/images/dribble_logo.png"), // Assuming you have these logos
        title: "Lead Designer",
        company: "Dribbble inc",
        location: "California, USA",
        tags: ["Design", "Full time", "Senior designer"],
        postedTime: "25 minute ago",
        salary: "$20K/Mo",
      },
      {
        id: "3",
        logo: require("../../assets/images/google_logo.png"),
        title: "Product Designer",
        company: "Google inc",
        location: "New York, USA",
        tags: ["Design", "Full time", "Mid-level"],
        postedTime: "1 hour ago",
        salary: "$18K/Mo",
      },
      {
        id: "4",
        logo: require("../../assets/images/dribble_logo.png"),
        title: "Junior UX Researcher",
        company: "Dribbble inc",
        location: "Remote",
        tags: ["Research", "Part-time", "Junior"],
        postedTime: "3 hours ago",
        salary: "$8K/Mo",
      },
      {
        id: "5",
        logo: require("../../assets/images/google_logo.png"),
        title: "Senior Software Engineer",
        company: "Google inc",
        location: "California, USA",
        tags: ["Engineering", "Full time", "Senior"],
        postedTime: "1 day ago",
        salary: "$25K/Mo",
      },
      {
        id: "6",
        logo: require("../../assets/images/dribble_logo.png"),
        title: "Marketing Specialist",
        company: "Dribbble inc",
        location: "London, UK",
        tags: ["Marketing", "Full time"],
        postedTime: "2 days ago",
        salary: "$10K/Mo",
      },
    ],
    []
  );

  const filteredJobListings = useMemo(() => {
    return allJobListings.filter((job) => {
      const matchesSearchText = searchText
        ? job.title.toLowerCase().includes(searchText.toLowerCase()) ||
          job.company.toLowerCase().includes(searchText.toLowerCase())
        : true;

      const matchesLocation = locationText
        ? job.location.toLowerCase().includes(locationText.toLowerCase())
        : true;

      const matchesChip = selectedChip
        ? job.tags.some(
            (tag) => tag.toLowerCase() === selectedChip.toLowerCase()
          )
        : true;

      return matchesSearchText && matchesLocation && matchesChip;
    });
  }, [searchText, locationText, selectedChip, allJobListings]);

  const handleChipPress = useCallback((chip) => {
    setSelectedChip(chip);
  }, []);

  if (filteredJobListings?.length === 0) return <NoResultsFoundScreen/>
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <SearchHeader
          onBackPress={() => router.back()}
          onFilterPress={() => router.push("findJob/filters")} // Example navigation
          insets={insets}
        />

        <ScrollView
          contentContainerStyle={styles.scrollViewContent} // Removed paddingBottom here
          showsVerticalScrollIndicator={false}
        >
          {/* Search and Location Inputs */}
          <View style={styles.inputSection}>
            <View style={styles.searchBarContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color={COLORS.TEXT_GRAY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Design" // Placeholder matches image
                placeholderTextColor={COLORS.TEXT_GRAY}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <View style={styles.searchBarContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color={COLORS.TEXT_GRAY}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="California, USA"
                placeholderTextColor={COLORS.TEXT_GRAY}
                value={locationText}
                onChangeText={setLocationText}
              />
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsContainer}
          >
            {filterChips.map((chip) => (
              <FilterChip
                key={chip}
                title={chip}
                isSelected={selectedChip === chip}
                onPress={() => handleChipPress(chip)}
              />
            ))}
          </ScrollView>

          {/* Job Listings */}
          <FlatList
            data={filteredJobListings}
            renderItem={({ item }) => <JobCard job={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Disable FlatList's own scroll as it's inside a ScrollView
            contentContainerStyle={styles.jobListingsContainer}
          />
        </ScrollView>
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
    paddingTop: SPACING.M, // Padding below the header
    // paddingBottom removed as there's no fixed bottom bar
  },
  inputSection: {
    marginBottom: SPACING.XXL,
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
    marginBottom: SPACING.M, // Space between search and location inputs
  },
  inputIcon: {
    marginRight: SPACING.S,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
  },
  filterChipsContainer: {
    marginBottom: SPACING.XXL,
  },
  jobListingsContainer: {
    // No specific styles needed here, jobCardStyles handle spacing
  },
});

export default SearchScreen;
