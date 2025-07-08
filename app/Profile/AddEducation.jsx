import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker'; 

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
  BACKGROUND_LIGHT: '#F5F7FA',
  TEXT_LIGHT: '#A0A4A8',
  PRIMARY: '#130160',
  BORDER_COLOR_LIGHT: '#E0E4E8',

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};


const AddEducationScreen = () => {
  const router = useRouter();

  const [levelOfEducation, setLevelOfEducation] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [description, setDescription] = useState("");

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  
  const onDateChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || (type === 'start' ? startDate : endDate);
    if (type === 'start') {
      setShowStartDatePicker(Platform.OS === 'ios'); 
      setStartDate(currentDate);
    } else {
      setShowEndDatePicker(Platform.OS === 'ios');
      setEndDate(currentDate);
    }
  };

  
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  
  const handleSave = () => {
    if (!levelOfEducation.trim() || !institutionName.trim() || !fieldOfStudy.trim()) {
      Alert.alert("Error", "Level of Education, Institution Name, and Field of Study are required.");
      return;
    }

    if (!isCurrentlyStudying && startDate >= endDate) {
      Alert.alert("Error", "End Date must be after Start Date for completed education.");
      return;
    }

    const educationData = {
      levelOfEducation,
      institutionName,
      fieldOfStudy,
      startDate: formatDate(startDate),
      endDate: isCurrentlyStudying ? "Present" : formatDate(endDate),
      isCurrentlyStudying,
      description: description.trim(),
    };

    console.log("Saving Education:", educationData);
    Alert.alert("Success", "Education entry saved successfully!");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconContainer}>
          <Ionicons name="arrow-back" size={FONT_SIZES.H2} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Education</Text>
        <View style={styles.headerIconContainer} />
      </View>
      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Level of education</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Master's Degree"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={levelOfEducation}
            onChangeText={setLevelOfEducation}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Institution name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., University of Oxford"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={institutionName}
            onChangeText={setInstitutionName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Field of study</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Computer Science"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={fieldOfStudy}
            onChangeText={setFieldOfStudy}
          />
        </View>
        <View style={styles.dateInputsContainer}>
          <View style={styles.dateInputGroup}>
            <Text style={styles.inputLabel}>Start date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={styles.dateInputText}>
                {formatDate(startDate) || "Select Date"}
              </Text>
              <Ionicons name="calendar-outline" size={FONT_SIZES.BODY_LARGE} color={COLORS.TEXT_GRAY} />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, date) => onDateChange(event, date, 'start')}
              />
            )}
          </View>
          <View style={styles.dateInputGroup}>
            <Text style={styles.inputLabel}>End date</Text>
            <TouchableOpacity
              style={[styles.dateInput, isCurrentlyStudying && styles.dateInputDisabled]}
              onPress={() => setShowEndDatePicker(true)}
              disabled={isCurrentlyStudying}
            >
              <Text style={[styles.dateInputText, isCurrentlyStudying && styles.dateInputTextDisabled]}>
                {isCurrentlyStudying ? "Present" : (formatDate(endDate) || "Select Date")}
              </Text>
              {!isCurrentlyStudying && (
                <Ionicons name="calendar-outline" size={FONT_SIZES.BODY_LARGE} color={COLORS.TEXT_GRAY} />
              )}
            </TouchableOpacity>
            {showEndDatePicker && !isCurrentlyStudying && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, date) => onDateChange(event, date, 'end')}
              />
            )}
          </View>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>I am currently studying here</Text>
          <Switch
            trackColor={{ false: COLORS.TEXT_LIGHT, true: COLORS.PRIMARY_BLUE }}
            thumbColor={COLORS.WHITE}
            ios_backgroundColor={COLORS.TEXT_LIGHT}
            onValueChange={setIsCurrentlyStudying}
            value={isCurrentlyStudying}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Write additional information here"
            placeholderTextColor={COLORS.TEXT_GRAY}
            multiline={true}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
            maxLength={1000} 
          />
        </View>
        <View style={{ flex: 1 }} />
      </ScrollView>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
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
    paddingBottom: SPACING.XXL,
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
  textInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  dateInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.L,
  },
  dateInputGroup: {
    flex: 1,
    marginRight: SPACING.S,
  },
  dateInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  dateInputText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
  },
  dateInputDisabled: {
    backgroundColor: COLORS.BACKGROUND,
  },
  dateInputTextDisabled: {
    color: COLORS.TEXT_GRAY,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  switchLabel: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    fontWeight: "500",
  },
  textAreaInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
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
  },
  saveButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: 'uppercase',
  },
});

export default AddEducationScreen;
