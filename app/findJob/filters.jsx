import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers";

const { width: screenWidth } = Dimensions.get("window");

/**
 * FilterHeader Component
 */
const FilterHeader = ({ onBackPress, insets }) => {
  return (
    <View
      style={[headerStyles.container, { paddingTop: insets.top + SPACING.S }]}
    >
      <TouchableOpacity onPress={onBackPress} style={headerStyles.iconButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
      </TouchableOpacity>
      <Text style={headerStyles.title}>Filter</Text>
      <View style={headerStyles.placeholder} />{" "}
      {/* Placeholder for alignment */}
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
    paddingBottom: SPACING.L,
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
    color: COLORS.PRIMARY_DARK_BLUE,
  },
  placeholder: {
    width: 24 + SPACING.XS * 2, // Match icon button width for centering
  },
});

/**
 * FilterSection Component (Collapsible)
 */
const FilterSection = ({ title, children, isExpanded, onToggleExpand }) => {
  return (
    <View style={sectionStyles.sectionContainer}>
      <TouchableOpacity
        style={sectionStyles.sectionHeader}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <Text style={sectionStyles.sectionTitle}>{title}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color={COLORS.TEXT_GRAY}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={sectionStyles.sectionContent}>{children}</View>
      )}
    </View>
  );
};

const sectionStyles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.M,
    marginBottom: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  sectionContent: {
    padding: SPACING.L,
  },
});

/**
 * RadioButton Component
 */
const RadioButton = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity style={radioStyles.container} onPress={onPress}>
      <View
        style={[
          radioStyles.outerCircle,
          isSelected ? radioStyles.outerCircleSelected : {},
        ]}
      >
        {isSelected && <View style={radioStyles.innerCircle} />}
      </View>
      <Text style={radioStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const radioStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.S,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.BORDER_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.S,
  },
  outerCircleSelected: {
    borderColor: COLORS.ACCENT_ORANGE,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.ACCENT_ORANGE,
  },
  label: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
  },
});

/**
 * Checkbox Component
 */
const Checkbox = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity style={checkboxStyles.container} onPress={onPress}>
      <View
        style={[
          checkboxStyles.box,
          isSelected ? checkboxStyles.boxSelected : {},
        ]}
      >
        {isSelected && (
          <Ionicons name="checkmark" size={16} color={COLORS.WHITE} />
        )}
      </View>
      <Text style={checkboxStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const checkboxStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.S,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: SPACING.XS,
    borderWidth: 2,
    borderColor: COLORS.BORDER_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.S,
  },
  boxSelected: {
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderColor: COLORS.ACCENT_ORANGE,
  },
  label: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
  },
});

/**
 * FilterChip Component (Reused from SearchScreen, slightly adapted for filter context)
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
    marginBottom: SPACING.S, // Added for wrapping chips
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: COLORS.ACCENT_ORANGE, // Changed to orange for active state as per image
    borderColor: COLORS.ACCENT_ORANGE,
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
 * Salary Range Slider (Simplified for demonstration)
 * In a real app, you'd use a dedicated library like react-native-range-slider
 */
const SalaryRangeSlider = ({ min, max, onValuesChange }) => {
  // This is a simplified representation. A real slider would involve more complex logic
  // and potentially a third-party library.
  return (
    <View style={salarySliderStyles.container}>
      <View style={salarySliderStyles.track}>
        <View style={salarySliderStyles.progressBar} />
        <View style={salarySliderStyles.thumbLeft} />
        <View style={salarySliderStyles.thumbRight} />
      </View>
      <View style={salarySliderStyles.valuesContainer}>
        <Text style={salarySliderStyles.valueText}>${min}k</Text>
        <Text style={salarySliderStyles.valueText}>${max}k</Text>
      </View>
    </View>
  );
};

const salarySliderStyles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.S, // Inner padding for the slider visual
    paddingVertical: SPACING.M,
  },
  track: {
    height: 4,
    backgroundColor: COLORS.BACKGROUND, // Inactive track color
    borderRadius: 2,
    position: "relative",
    marginBottom: SPACING.S,
  },
  progressBar: {
    position: "absolute",
    height: 4,
    backgroundColor: COLORS.ACCENT_ORANGE, // Active track color
    borderRadius: 2,
    left: "20%", // Example: 20% from left
    width: "60%", // Example: 60% width
  },
  thumbLeft: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    left: "20%", // Example position
    top: -8, // Center vertically on track
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbRight: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    right: "20%", // Example position
    top: -8,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  valuesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.S,
  },
  valueText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
});

// Main Filters Screen Component
const FiltersScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State for each filter section's expansion
  const [expandedSections, setExpandedSections] = useState({
    lastUpdate: true,
    workplaceType: true,
    jobType: true,
    positionLevel: true,
    city: true,
    salary: true,
    experience: true,
    specialization: true,
  });

  // State for filter selections
  const [selectedLastUpdate, setSelectedLastUpdate] = useState("Any time");
  const [selectedWorkplaceType, setSelectedWorkplaceType] = useState("On-site");
  const [selectedJobTypes, setSelectedJobTypes] = useState(["Full-time"]); // Multi-select
  const [selectedPositionLevels, setSelectedPositionLevels] = useState([
    "Senior",
  ]); // Multi-select
  const [selectedCities, setSelectedCities] = useState(["California, USA"]); // Multi-select
  const [salaryRange, setSalaryRange] = useState({ min: 15, max: 25 }); // In thousands
  const [selectedExperience, setSelectedExperience] = useState("3-5 years");
  const [selectedSpecializations, setSelectedSpecializations] = useState([
    "Design",
  ]); // Multi-select

  // Toggle section expansion
  const toggleSection = useCallback((sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  }, []);

  // Handlers for filter options
  const handleRadioSelect = useCallback((setter, value) => {
    setter(value);
  }, []);

  const handleChipSelect = useCallback((setter, prevSelected, value) => {
    if (prevSelected.includes(value)) {
      setter(prevSelected.filter((item) => item !== value));
    } else {
      setter([...prevSelected, value]);
    }
  }, []);

  const handleCheckboxSelect = useCallback((setter, prevSelected, value) => {
    if (prevSelected.includes(value)) {
      setter(prevSelected.filter((item) => item !== value));
    } else {
      setter([...prevSelected, value]);
    }
  }, []);

  const handleSalaryChange = useCallback((newMin, newMax) => {
    setSalaryRange({ min: newMin, max: newMax });
  }, []);

  const handleResetFilters = useCallback(() => {
    // Reset all states to their initial values or empty
    setSelectedLastUpdate("Any time");
    setSelectedWorkplaceType("On-site");
    setSelectedJobTypes([]);
    setSelectedPositionLevels([]);
    setSelectedCities([]);
    setSalaryRange({ min: 0, max: 50 }); // Example reset range
    setSelectedExperience("");
    setSelectedSpecializations([]);
    // Optionally, expand all sections again
    setExpandedSections({
      lastUpdate: true,
      workplaceType: true,
      jobType: true,
      positionLevel: true,
      city: true,
      salary: true,
      experience: true,
      specialization: true,
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    // In a real app, you would pass these filters back to the SearchScreen
    // or a global state management system.
    console.log("Applying Filters:", {
      selectedLastUpdate,
      selectedWorkplaceType,
      selectedJobTypes,
      selectedPositionLevels,
      selectedCities,
      salaryRange,
      selectedExperience,
      selectedSpecializations,
    });
    router.back(); // Go back to the previous screen (SearchScreen)
  }, [
    selectedLastUpdate,
    selectedWorkplaceType,
    selectedJobTypes,
    selectedPositionLevels,
    selectedCities,
    salaryRange,
    selectedExperience,
    selectedSpecializations,
    router,
  ]);

  // Dummy Data for Filter Options
  const lastUpdateOptions = ["Recent", "Last week", "Last month", "Any time"];
  const workplaceTypeOptions = ["On-site", "Hybrid", "Remote"];
  const jobTypeOptions = [
    "Apprenticeship",
    "Part-time",
    "Full-time",
    "Contract",
    "Project-based",
  ];
  const positionLevelOptions = ["Junior", "Senior", "Leader", "Manager"];
  const cityOptions = [
    "California, USA",
    "Texas, USA",
    "New York, USA",
    "Florida, USA",
  ];
  const experienceOptions = [
    "No experience",
    "Less than a year",
    "1-2 years",
    "3-5 years",
    "More than 5 years",
  ];
  const specializationOptions = [
    "Design",
    "Finance",
    "Education",
    "Health",
    "Restaurant",
    "Programmer",
  ];

  const bottomButtonsHeight = SPACING.XXL + SPACING.L + insets.bottom; // Estimate height for fixed buttons

  return (
    <View style={styles.container}>
      {/* Header */}
      <FilterHeader onBackPress={() => router.back()} insets={insets} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: bottomButtonsHeight + SPACING.L }, // Ensure space for fixed buttons
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Update Section */}
        <FilterSection
          title="Last update"
          isExpanded={expandedSections.lastUpdate}
          onToggleExpand={() => toggleSection("lastUpdate")}
        >
          {lastUpdateOptions.map((option) => (
            <RadioButton
              key={option}
              label={option}
              isSelected={selectedLastUpdate === option}
              onPress={() => handleRadioSelect(setSelectedLastUpdate, option)}
            />
          ))}
        </FilterSection>

        {/* Type of workplace Section */}
        <FilterSection
          title="Type of workplace"
          isExpanded={expandedSections.workplaceType}
          onToggleExpand={() => toggleSection("workplaceType")}
        >
          {workplaceTypeOptions.map((option) => (
            <RadioButton
              key={option}
              label={option}
              isSelected={selectedWorkplaceType === option}
              onPress={() =>
                handleRadioSelect(setSelectedWorkplaceType, option)
              }
            />
          ))}
        </FilterSection>

        {/* Job type Section */}
        <FilterSection
          title="Job type"
          isExpanded={expandedSections.jobType}
          onToggleExpand={() => toggleSection("jobType")}
        >
          <View style={styles.chipsContainer}>
            {jobTypeOptions.map((option) => (
              <FilterChip
                key={option}
                title={option}
                isSelected={selectedJobTypes.includes(option)}
                onPress={() =>
                  handleChipSelect(
                    setSelectedJobTypes,
                    selectedJobTypes,
                    option
                  )
                }
              />
            ))}
          </View>
        </FilterSection>

        {/* Position level Section */}
        <FilterSection
          title="Position level"
          isExpanded={expandedSections.positionLevel}
          onToggleExpand={() => toggleSection("positionLevel")}
        >
          <View style={styles.chipsContainer}>
            {positionLevelOptions.map((option) => (
              <FilterChip
                key={option}
                title={option}
                isSelected={selectedPositionLevels.includes(option)}
                onPress={() =>
                  handleChipSelect(
                    setSelectedPositionLevels,
                    selectedPositionLevels,
                    option
                  )
                }
              />
            ))}
          </View>
        </FilterSection>

        {/* City Section */}
        <FilterSection
          title="City"
          isExpanded={expandedSections.city}
          onToggleExpand={() => toggleSection("city")}
        >
          {cityOptions.map((option) => (
            <Checkbox
              key={option}
              label={option}
              isSelected={selectedCities.includes(option)}
              onPress={() =>
                handleCheckboxSelect(setSelectedCities, selectedCities, option)
              }
            />
          ))}
        </FilterSection>

        {/* Salary Section */}
        <FilterSection
          title="Salary"
          isExpanded={expandedSections.salary}
          onToggleExpand={() => toggleSection("salary")}
        >
          <SalaryRangeSlider
            min={salaryRange.min}
            max={salaryRange.max}
            onValuesChange={handleSalaryChange}
          />
        </FilterSection>

        {/* Experience Section */}
        <FilterSection
          title="Experience"
          isExpanded={expandedSections.experience}
          onToggleExpand={() => toggleSection("experience")}
        >
          {experienceOptions.map((option) => (
            <RadioButton
              key={option}
              label={option}
              isSelected={selectedExperience === option}
              onPress={() => handleRadioSelect(setSelectedExperience, option)}
            />
          ))}
        </FilterSection>

        {/* Specialization Section */}
        <FilterSection
          title="Specialization"
          isExpanded={expandedSections.specialization}
          onToggleExpand={() => toggleSection("specialization")}
        >
          {specializationOptions.map((option) => (
            <Checkbox
              key={option}
              label={option}
              isSelected={selectedSpecializations.includes(option)}
              onPress={() =>
                handleCheckboxSelect(
                  setSelectedSpecializations,
                  selectedSpecializations,
                  option
                )
              }
            />
          ))}
        </FilterSection>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View
        style={[
          styles.bottomButtonsContainer,
          { paddingBottom: insets.bottom + SPACING.S },
        ]}
      >
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetFilters}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilters}
        >
          <Text style={styles.applyButtonText}>APPLY NOW</Text>
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
    paddingTop: SPACING.M,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // No specific marginBottom here, handled by individual chip's marginBottom
  },
  bottomButtonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.L,
    borderTopLeftRadius: SPACING.L,
    borderTopRightRadius: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  resetButton: {
    flex: 1,
    paddingVertical: SPACING.M,
    alignItems: "center",
  },
  resetButtonText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
  },
  applyButton: {
    flex: 2, // Take more space
    backgroundColor: COLORS.PRIMARY_DARK_BLUE,
    borderRadius: SPACING.S,
    paddingVertical: SPACING.M,
    alignItems: "center",
    marginLeft: SPACING.M, // Space between buttons
  },
  applyButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
  },
});

export default FiltersScreen;
