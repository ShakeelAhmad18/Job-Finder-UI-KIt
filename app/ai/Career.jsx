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

const CareerGrowthScreen = () => {
  const router = useRouter();

  // State for user inputs
  const [currentRole, setCurrentRole] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [industry, setIndustry] = useState("");

  // State for AI-generated content
  const [careerPaths, setCareerPaths] = useState("");
  const [skillDevelopment, setSkillDevelopment] = useState("");
  const [industryTrends, setIndustryTrends] = useState("");
  const [generalInterviewTips, setGeneralInterviewTips] = useState("");

  const [isLoadingAI, setIsLoadingAI] = useState(false);

  /**
   * Helper function to render AI-generated text with basic markdown for bolding and newlines.
   */
  const renderAIText = (text) => {
    if (!text)
      return <Text style={styles.noContentText}>No insights available.</Text>;
    const lines = text.split("\n");
    return lines.map((line, index) => {
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
        <Text key={index} style={styles.aiInsightText}>
          {parts}
        </Text>
      );
    });
  };

  /**
   * Handles the generation of all career insights using Gemini API.
   */
  const handleGenerateInsights = async () => {
    if (!currentRole.trim() || !desiredRole.trim() || !industry.trim()) {
      Alert.alert(
        "Input Required",
        "Please fill in your Current Role, Desired Role, and Industry to get personalized insights."
      );
      return;
    }

    setIsLoadingAI(true);
    // Clear previous insights
    setCareerPaths("");
    setSkillDevelopment("");
    setIndustryTrends("");
    setGeneralInterviewTips("");

    try {
      // 1. Personalized Career Paths
      const careerPathPrompt = `Given a current role of "${currentRole}" and a desired role of "${desiredRole}" in the "${industry}" industry, suggest a concise career path. Include 2-3 key steps or milestones. Keep it under 80 words.`;
      const careerPathResponse = await generateAIResponse(careerPathPrompt);
      setCareerPaths(careerPathResponse);

      // 2. Skill Development Plan
      const skillDevelopmentPrompt = `For someone transitioning from "${currentRole}" to "${desiredRole}" in "${industry}", identify 3-4 crucial skills to develop and suggest types of resources (e.g., online courses, certifications, projects). Use bullet points. Keep it under 100 words.`;
      const skillDevelopmentResponse = await generateAIResponse(
        skillDevelopmentPrompt
      );
      setSkillDevelopment(skillDevelopmentResponse);

      // 3. Industry Trends
      const industryTrendsPrompt = `Provide 2-3 key emerging trends or future outlooks for the "${industry}" industry that a professional should be aware of. Keep it concise.`;
      const industryTrendsResponse = await generateAIResponse(
        industryTrendsPrompt
      );
      setIndustryTrends(industryTrendsResponse);

      // 4. General Interview Tips
      const interviewTipsPrompt = `Give 3 general, actionable interview tips for a professional in the "${industry}" industry. Use bullet points. Keep it under 60 words.`;
      const interviewTipsResponse = await generateAIResponse(
        interviewTipsPrompt
      );
      setGeneralInterviewTips(interviewTipsResponse);
    } catch (error) {
      console.error("Error generating career insights:", error);
      Alert.alert(
        "AI Error",
        "Failed to generate career insights. Please try again."
      );
      setCareerPaths("Failed to load career paths.");
      setSkillDevelopment("Failed to load skill development plan.");
      setIndustryTrends("Failed to load industry trends.");
      setGeneralInterviewTips("Failed to load interview tips.");
    } finally {
      setIsLoadingAI(false);
    }
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
        <Text style={styles.headerTitle}>Career Growth</Text>
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
          <Text style={styles.sectionHeading}>Your Career Profile:</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Role</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Junior Developer, Marketing Assistant"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={currentRole}
              onChangeText={setCurrentRole}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Desired Next Role</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Senior Developer, Marketing Manager"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={desiredRole}
              onChangeText={setDesiredRole}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Industry</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Tech, Healthcare, Finance"
              placeholderTextColor={COLORS.TEXT_GRAY}
              value={industry}
              onChangeText={setIndustry}
            />
          </View>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateInsights}
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
                  Generate Career Insights
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        {/* AI-Generated Insights Display Section */}
        {(careerPaths.length > 0 ||
          skillDevelopment.length > 0 ||
          industryTrends.length > 0 ||
          generalInterviewTips.length > 0) && (
          <View style={styles.insightsDisplayContainer}>
            {/* Personalized Career Paths */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>
                Personalized Career Paths
              </Text>
              {isLoadingAI ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.PRIMARY_BLUE}
                  style={styles.loadingIndicator}
                />
              ) : (
                renderAIText(careerPaths)
              )}
            </View>
            {/* Skill Development Plan */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>Skill Development Plan</Text>
              {isLoadingAI ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.PRIMARY_BLUE}
                  style={styles.loadingIndicator}
                />
              ) : (
                renderAIText(skillDevelopment)
              )}
            </View>
            {/* Industry Trends */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>Industry Trends</Text>
              {isLoadingAI ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.PRIMARY_BLUE}
                  style={styles.loadingIndicator}
                />
              ) : (
                renderAIText(industryTrends)
              )}
            </View>
            {/* General Interview Tips */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>General Interview Tips</Text>
              {isLoadingAI ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.PRIMARY_BLUE}
                  style={styles.loadingIndicator}
                />
              ) : (
                renderAIText(generalInterviewTips)
              )}
            </View>
          </View>
        )}
        {/* Spacer for bottom padding */}
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
    paddingBottom: SPACING.XXL,
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
    backgroundColor: COLORS.PRIMARY_BLUE,
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
  insightsDisplayContainer: {
    // Container for all insight cards
  },
  sectionCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    marginBottom: SPACING.XL,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  aiInsightText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    lineHeight: FONT_SIZES.BODY * 1.6,
    marginBottom: SPACING.S,
  },
  boldText: {
    fontWeight: "bold",
  },
  noContentText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    paddingVertical: SPACING.S,
  },
  loadingIndicator: {
    marginVertical: SPACING.M,
  },
});

export default CareerGrowthScreen;
