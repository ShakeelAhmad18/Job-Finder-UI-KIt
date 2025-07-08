// app/AddJob/CreateJob.js
import React, { useState, useCallback, useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,
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

import SelectionModal from "../../components/AddJob/SelectionModal";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// --- Custom Alert Modal Component ---
const AlertModal = memo(({ visible, title, message, onClose }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={alertModalStyles.backdrop} onPress={onClose}>
        <Animated.View
          style={[
            alertModalStyles.container,
            { opacity, transform: [{ translateY }] },
          ]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={alertModalStyles.content}>
              <Text style={alertModalStyles.title}>{title}</Text>
              <Text style={alertModalStyles.message}>{message}</Text>
              <View style={alertModalStyles.buttonRow}>
                <TouchableOpacity
                  style={alertModalStyles.confirmButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={alertModalStyles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

const alertModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XL,
  },
  container: {
    width: "100%",
    maxWidth: 400,
  },
  content: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.XL,
    ...SHADOWS.large,
  },
  title: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
    textAlign: "center",
  },
  message: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    lineHeight: 24,
    marginBottom: SPACING.XL,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.XL,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
  },
});

// --- Enhanced TextInput Modal ---
const TextInputModal = memo(
  ({
    visible,
    onClose,
    onSave,
    title,
    placeholder,
    initialValue = "",
    multiline = false,
    maxLength,
    keyboardType = "default",
    validation,
  }) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const [error, setError] = useState(null);
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
      if (visible) {
        setInputValue(initialValue);
        setError(null);
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(animation, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }, [visible]);

    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [SCREEN_HEIGHT * 0.3, 0],
    });

    const opacity = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const handleSave = () => {
      const trimmedValue = inputValue.trim();
      if (validation) {
        const validationError = validation(trimmedValue);
        if (validationError) {
          setError(validationError);
          return;
        }
      }
      onSave(trimmedValue);
      onClose();
    };

    return (
      <Modal
        transparent
        visible={visible}
        onRequestClose={onClose}
        statusBarTranslucent
        animationType="none"
      >
        <Pressable style={textInputModalStyles.backdrop} onPress={onClose}>
          <Animated.View
            style={[
              textInputModalStyles.container,
              { opacity, transform: [{ translateY }] },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={textInputModalStyles.content}>
                <Text style={textInputModalStyles.title}>{title}</Text>

                <View style={textInputModalStyles.inputContainer}>
                  <TextInput
                    style={[
                      textInputModalStyles.input,
                      multiline && textInputModalStyles.multilineInput,
                      error && textInputModalStyles.inputError,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.TEXT_LIGHT}
                    value={inputValue}
                    onChangeText={setInputValue}
                    multiline={multiline}
                    maxLength={maxLength}
                    keyboardType={keyboardType}
                    autoFocus
                    textAlignVertical={multiline ? "top" : "center"}
                  />
                  {error && (
                    <Text style={textInputModalStyles.errorText}>{error}</Text>
                  )}
                </View>

                <View style={textInputModalStyles.footer}>
                  <TouchableOpacity
                    style={textInputModalStyles.cancelButton}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Text style={textInputModalStyles.cancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      textInputModalStyles.saveButton,
                      !inputValue.trim() &&
                        textInputModalStyles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={!inputValue.trim()}
                    activeOpacity={0.7}
                  >
                    <Text style={textInputModalStyles.saveButtonText}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    );
  }
);

const textInputModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  container: {
    width: "100%",
  },
  content: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    padding: SPACING.XL,
    paddingBottom: SPACING.XL + SPACING.M,
  },
  title: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XL,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: SPACING.XL,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  multilineInput: {
    minHeight: 150,
    maxHeight: 200,
  },
  inputError: {
    borderColor: COLORS.ACCENT_ORANGE,
  },
  errorText: {
    color: COLORS.ACCENT_ORANGE,
    fontSize: FONT_SIZES.SMALL,
    marginTop: SPACING.XS,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.M,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: COLORS.TEXT_DARK,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
  },
  saveButtonDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.TEXT_LIGHT,
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
  },
});

// --- Job Input Field Component ---
const JobInputField = memo(
  ({ label, value, onPress, required = false, isDescription = false }) => {
    return (
      <TouchableOpacity
        style={styles.inputFieldContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.inputFieldContent}>
          <View style={styles.inputFieldHeader}>
            <Text style={styles.inputFieldLabel}>
              {label}
              {required && <Text style={styles.requiredIndicator}> *</Text>}
            </Text>
            <Ionicons
              name={value ? "pencil" : "add"}
              size={20}
              color={COLORS.PRIMARY_BLUE}
            />
          </View>

          {value ? (
            <Text
              style={[
                styles.inputFieldValue,
                isDescription && styles.descriptionValue,
              ]}
              numberOfLines={isDescription ? 3 : 1}
              ellipsizeMode="tail"
            >
              {value}
            </Text>
          ) : (
            <Text style={styles.inputFieldPlaceholder}>
              Tap to add {label.toLowerCase()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

// --- Main CreateJob Component ---
const CreateJob = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Form state
  const [formData, setFormData] = useState({
    jobPosition: "",
    workplaceType: "",
    jobLocation: "",
    company: "",
    employmentType: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertModal, setAlertModal] = useState({
    visible: false,
    title: "",
    message: "",
  });

  // Modal states
  const [textInputModal, setTextInputModal] = useState({
    visible: false,
    field: null,
    title: "",
    placeholder: "",
    initialValue: "",
    multiline: false,
    maxLength: 200,
    keyboardType: "default",
    validation: null,
  });

  const [selectionModal, setSelectionModal] = useState({
    visible: false,
    field: null,
    title: "",
    description: "",
    options: [],
    initialValue: "",
  });

  // Options
  const workplaceTypeOptions = [
    { label: "On-site", value: "On-site", icon: "business" },
    { label: "Hybrid", value: "Hybrid", icon: "partly-sunny" },
    { label: "Remote", value: "Remote", icon: "globe" },
  ];

  const employmentTypeOptions = [
    { label: "Full-time", value: "Full-time", icon: "time" },
    { label: "Part-time", value: "Part-time", icon: "time-outline" },
    { label: "Contract", value: "Contract", icon: "document-text" },
    { label: "Temporary", value: "Temporary", icon: "calendar" },
    { label: "Internship", value: "Internship", icon: "school" },
    { label: "Volunteer", value: "Volunteer", icon: "heart" },
  ];

  // Handle navigation params
  useEffect(() => {
    if (params.selectedJobPosition) {
      setFormData((prev) => ({
        ...prev,
        jobPosition: params.selectedJobPosition,
      }));
      router.setParams({ selectedJobPosition: undefined });
    }
  }, [params.selectedJobPosition]);

  // Show alert modal
  const showAlert = useCallback((title, message) => {
    setAlertModal({
      visible: true,
      title,
      message,
    });
  }, []);

  // Hide alert modal
  const hideAlert = useCallback(() => {
    setAlertModal((prev) => ({ ...prev, visible: false }));
  }, []);

  // Open text input modal
  const openTextInputModal = useCallback(
    (field, config = {}) => {
      const fieldTitles = {
        description: "Job Description",
        company: "Company Name",
        jobLocation: "Job Location",
      };

      const fieldPlaceholders = {
        description: "Describe the job responsibilities and requirements...",
        company: "Enter company name...",
        jobLocation: "Enter job location...",
      };

      const validations = {
        description: (value) => {
          if (value.length < 30) {
            return "Description should be at least 30 characters";
          }
          return null;
        },
        company: (value) => {
          if (value.length < 2) {
            return "Company name is too short";
          }
          return null;
        },
      };

      setTextInputModal({
        visible: true,
        field,
        title: fieldTitles[field] || `Enter ${field}`,
        placeholder: fieldPlaceholders[field] || `Enter ${field}...`,
        initialValue: formData[field],
        multiline: field === "description",
        maxLength: field === "description" ? 2000 : 100,
        keyboardType: "default",
        validation: validations[field] || null,
        ...config,
      });
    },
    [formData]
  );

  // Save text input
  const saveTextInput = useCallback(
    (value) => {
      if (textInputModal.field) {
        setFormData((prev) => ({
          ...prev,
          [textInputModal.field]: value,
        }));
      }
      setTextInputModal((prev) => ({ ...prev, visible: false }));
    },
    [textInputModal.field]
  );

  // Open selection modal
  const openSelectionModal = useCallback(
    (field, options, title, description) => {
      setSelectionModal({
        visible: true,
        field,
        options,
        title,
        description,
        initialValue: formData[field],
      });
    },
    [formData]
  );

  // Save selection
  const saveSelection = useCallback(
    (value) => {
      if (selectionModal.field) {
        setFormData((prev) => ({
          ...prev,
          [selectionModal.field]: value,
        }));
      }
      setSelectionModal((prev) => ({ ...prev, visible: false }));
    },
    [selectionModal.field]
  );

  // Submit job
  const submitJob = useCallback(async () => {
    if (!formData.jobPosition.trim()) {
      showAlert("Required Field", "Job position is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showAlert("Success", "Job posted successfully!");
      // Reset form
      setFormData({
        jobPosition: "",
        workplaceType: "",
        jobLocation: "",
        company: "",
        employmentType: "",
        description: "",
      });

      // Navigate back after delay
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      showAlert("Error", "Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, router]);

  // Check if form can be submitted
  const canSubmit = formData.jobPosition.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="close" size={24} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Job Posting</Text>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
          ]}
          onPress={submitJob}
          disabled={!canSubmit || isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          ) : (
            <Text style={styles.submitButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 25 })}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Job Information</Text>

          <JobInputField
            label="Job Position"
            value={formData.jobPosition}
            onPress={() =>
              router.push({
                pathname: "AddJob/JobPosition",
                params: { initialValue: formData.jobPosition },
              })
            }
            required
          />

          <JobInputField
            label="Employment Type"
            value={formData.employmentType}
            onPress={() =>
              openSelectionModal(
                "employmentType",
                employmentTypeOptions,
                "Select Employment Type",
                "Choose the type of employment for this position"
              )
            }
          />

          <JobInputField
            label="Workplace Type"
            value={formData.workplaceType}
            onPress={() =>
              openSelectionModal(
                "workplaceType",
                workplaceTypeOptions,
                "Select Workplace Type",
                "Choose where this job will be performed"
              )
            }
          />

          <JobInputField
            label="Company"
            value={formData.company}
            onPress={() => router.push("AddJob/Company")}
          />

          <JobInputField
            label="Location"
            value={formData.jobLocation}
            onPress={() => router.push("AddJob/Location")}
          />

          <Text style={styles.sectionTitle}>Job Details</Text>

          <JobInputField
            label="Description"
            value={formData.description}
            onPress={() => openTextInputModal("description")}
            isDescription
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <TextInputModal
        visible={textInputModal.visible}
        onClose={() =>
          setTextInputModal((prev) => ({ ...prev, visible: false }))
        }
        onSave={saveTextInput}
        title={textInputModal.title}
        placeholder={textInputModal.placeholder}
        initialValue={textInputModal.initialValue}
        multiline={textInputModal.multiline}
        maxLength={textInputModal.maxLength}
        keyboardType={textInputModal.keyboardType}
        validation={textInputModal.validation}
      />

      <SelectionModal
        visible={selectionModal.visible}
        onClose={() =>
          setSelectionModal((prev) => ({ ...prev, visible: false }))
        }
        onSave={saveSelection}
        title={selectionModal.title}
        description={selectionModal.description}
        options={selectionModal.options}
        initialValue={selectionModal.initialValue}
      />

      <AlertModal
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
    backgroundColor: COLORS.WHITE,
    ...SHADOWS.small,
  },
  headerButton: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.S,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    ...SHADOWS.small,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.TEXT_LIGHT,
  },
  submitButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.M,
    paddingBottom: SPACING.XL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H3,
    fontWeight: "600",
    color: COLORS.PRIMARY_BLUE,
    marginVertical: SPACING.M,
    marginLeft: SPACING.XS,
  },
  inputFieldContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    marginBottom: SPACING.S,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  inputFieldContent: {
    flex: 1,
  },
  inputFieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.XS,
  },
  inputFieldLabel: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  requiredIndicator: {
    color: COLORS.ACCENT_ORANGE,
  },
  inputFieldValue: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    lineHeight: 22,
  },
  descriptionValue: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  inputFieldPlaceholder: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT,
    fontStyle: "italic",
  },
});

export default CreateJob;
