import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { generateAIResponse } from "../../lib/GeminiAPI"; // Import Gemini API function
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/helpers";


const InterviewPreparationScreen = () => {
  const router = useRouter();

  // State for user inputs
  const [subject, setSubject] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState(""); // Comma-separated skills

  // State for AI-generated preparation material
  const [preparationMaterial, setPreparationMaterial] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  /**
   * Handles the generation of interview preparation material using Gemini API.
   */
  const handleGeneratePreparation = async () => {
    if (!subject.trim() || !jobRole.trim()) {
      Alert.alert(
        "Input Required",
        "Please enter at least a Subject and Job Role."
      );
      return;
    }

    setIsLoadingAI(true);
    setPreparationMaterial(""); // Clear previous material

    const prompt = `Generate comprehensive interview preparation material for a job candidate.
    The interview is for a ${jobRole} role in ${subject}.
    Key skills to focus on include: ${
      skills.trim() ? skills : "general interview skills"
    }.

    Provide:
    1.  **Common Technical Questions:** (If applicable to the role)
    2.  **Behavioral Questions:** (e.g., "Tell me about a time...")
    3.  **Tips for Success:** (e.g., research, STAR method, follow-up)
    4.  **Key Concepts/Topics to Review:** (Specific to the subject/role)

    Format the response clearly with headings and bullet points. Keep it concise but informative.`;

    try {
      const aiResponse = await generateAIResponse(prompt);
      setPreparationMaterial(aiResponse);
    } catch (error) {
      console.error("Error generating interview material:", error);
      Alert.alert(
        "AI Error",
        "Failed to generate interview material. Please try again."
      );
      setPreparationMaterial(
        "Failed to load preparation material. Please check your internet connection or try again later."
      );
    } finally {
      setIsLoadingAI(false);
    }
  };

  /**
   * Renders the AI-generated preparation material.
   * Basic parsing for newlines and bolding (using **text**) for better readability.
   */
  const renderPreparationMaterial = (text) => {
    if (!text) return null;

    // Split by newlines to handle paragraphs/bullet points
    const lines = text.split("\n");

    return lines.map((line, index) => {
      // Basic bolding for **text**
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={partIndex} style={styles.boldText}>
              {part.substring(2, part.length - 2)}
            </Text>
          );
        }
        return part;
      });

      return (
        <Text key={index} style={styles.materialText}>
          {parts}
        </Text>
      );
    });
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
        <Text style={styles.headerTitle}>Interview Prep</Text>
        <View style={styles.headerIconContainer} />
        {/* Placeholder for spacing */}
      </View>
      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Input Form Section */}
        <View style={styles.inputFormSection}>
          <Text style={styles.sectionHeading}>
            Tell us about your interview:
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Subject Area (e.g., Software Engineering)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Computer Science, Marketing, Design"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={subject}
              onChangeText={setSubject}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Job Role (e.g., Frontend Developer)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Product Manager, Data Scientist"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={jobRole}
              onChangeText={setJobRole}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Key Skills (comma-separated, e.g., React, Cloud, SEO)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Python, SQL, Agile, Figma"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={skills}
              onChangeText={setSkills}
            />
          </View>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGeneratePreparation}
            disabled={isLoadingAI}
          >
            {isLoadingAI ? (
              <ActivityIndicator size="small" color={COLORS.WHITE} />
            ) : (
              <>
                <Ionicons
                  name="sparkles"
                  size={FONT_SIZES.BODY_LARGE}
                  color={COLORS.WHITE}
                  style={styles.generateButtonIcon}
                />
                <Text style={styles.generateButtonText}>
                  Generate Preparation
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        {preparationMaterial.length > 0 && (
          <View style={styles.materialDisplaySection}>
            <Text style={styles.sectionHeading}>
              Your Interview Preparation:
            </Text>
            {renderPreparationMaterial(preparationMaterial)}
          </View>
        )}
        <View style={{ height: SPACING.XXL * 2 }} />
      </ScrollView>
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
    paddingBottom: SPACING.XXL, // Ensure enough space at the bottom
  },
  inputFormSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    marginBottom: SPACING.XL,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  sectionHeading: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.L,
    textAlign: "center",
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
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.PRIMARY_BLUE, // Use primary blue for generate button
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    marginTop: SPACING.S,
    ...SHADOWS.medium,
  },
  generateButtonIcon: {
    marginRight: SPACING.S,
  },
  generateButtonText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  materialDisplaySection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    marginTop: SPACING.XL,
    marginBottom: SPACING.XL,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  materialText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
    lineHeight: FONT_SIZES.BODY * 1.5,
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default InterviewPreparationScreen;
