import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator, // For loading indicator
  Linking, // Import Linking for opening URLs
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { generateAIResponse } from "../../lib/GeminiAPI"; // Import the Gemini API function
import { useRouter } from "expo-router"; // Import useRouter from expo-router
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/helpers";
 


const AIHomeScreen = () => {
  const insets = useSafeAreaInsets();
  // Use the actual useRouter hook from expo-router
  const router = useRouter();

  // State for AI-generated content
  const [aiJobMatchDescription, setAiJobMatchDescription] = useState(
    "Our AI found 5 new jobs that match your profile"
  );
  const [aiCareerTipContent, setAiCareerTipContent] = useState(
    "Our AI suggests adding 2 more skills to increase your match rate by 30%"
  );
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiGeneratedJobs, setAiGeneratedJobs] = useState([]); // State to hold AI-generated jobs

  // Define the JSON schema for job objects
  const jobSchema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        id: { type: "STRING" },
        logoUri: { type: "STRING" },
        title: { type: "STRING" },
        company: { type: "STRING" },
        location: { type: "STRING" },
        salary: { type: "STRING" },
        type: { type: "STRING" }, // e.g., Senior, Mid-level
        employmentType: { type: "STRING" }, // e.g., Full time, Part time
        description: { type: "STRING" },
        url: { type: "STRING" }, // Added 'url' to the schema
      },
      required: [
        "id",
        "title",
        "company",
        "location",
        "salary",
        "logoUri",
        "url",
      ], // Ensure URL is also required
    },
  };

  // Function to fetch AI content and jobs
  const fetchAIContentAndJobs = async () => {
    setIsLoadingAI(true);
    try {
      // Fetch AI Job Match Description (plain text)
      const jobMatchPrompt =
        "Write a very short, encouraging sentence about AI finding new job matches for a user. Keep it under 15 words.";
      const jobMatchResponse = await generateAIResponse(jobMatchPrompt);
      setAiJobMatchDescription(jobMatchResponse);

      // Fetch AI Career Tip Content (plain text)
      const careerTipPrompt =
        "Give a very short, actionable career tip related to profile improvement for job searching. Keep it under 20 words.";
      const careerTipResponse = await generateAIResponse(careerTipPrompt);
      setAiCareerTipContent(careerTipResponse);

      // Fetch AI Generated Jobs (structured JSON)
      const jobsPrompt = `Generate a JSON array of latest job listings for a "UI/UX Designer,web development,AI,Machine Learning and App Development" role.
      Include 'id' (unique string), 'logoUri' (use a real company logo URL or a placeholder like "https://logo.clearbit.com/google.com" or "https://placehold.co/40x40/000000/ffffff?text=GO"),
      'title', 'company', 'location', 'salary', 'type' (e.g., "Senior", "Mid-level"),
      'employmentType' (e.g., "Full time", "Part time"), 'description' (short summary), and 'url' (use a real job application URL like "https://careers.google.com/jobs/results/"). Ensure URLs are valid.`;

      const aiJobsResponse = await generateAIResponse(jobsPrompt, {
        responseSchema: jobSchema,
      });
      // Ensure the response is an array before setting state
      if (Array.isArray(aiJobsResponse)) {
        setAiGeneratedJobs(aiJobsResponse);
      } else {
        console.warn("AI job response was not an array:", aiJobsResponse);
        setAiGeneratedJobs([]); // Fallback to empty array
      }
    } catch (error) {
      console.error("Failed to fetch AI content or jobs:", error);
      Alert.alert(
        "AI Error",
        "Could not load AI suggestions or jobs. Please try again later."
      );
      setAiJobMatchDescription("Failed to load AI job matches.");
      setAiCareerTipContent("Failed to load AI career tips.");
      setAiGeneratedJobs([]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Fetch AI content and jobs on component mount
  useEffect(() => {
    fetchAIContentAndJobs();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Welcome back</Text>
            <Text style={styles.userNameText}>John Doe</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="home"
              size={FONT_SIZES.H2}
              color={COLORS.TEXT_DARK}
            />
          </TouchableOpacity>
        </View>
        {/* AI Job Match Card */}
        <TouchableOpacity
          style={styles.aiJobMatchCard}
          onPress={() => Alert.alert("AI Feature", "View AI Job Matches!")}
        >
          <Text style={styles.aiJobMatchTitle}>AI Job Matches</Text>
          {isLoadingAI ? (
            <ActivityIndicator
              size="small"
              color={COLORS.WHITE}
              style={styles.loadingIndicator}
            />
          ) : (
            <Text style={styles.aiJobMatchDescription}>
              {aiJobMatchDescription}
            </Text>
          )}
          <TouchableOpacity style={styles.viewMatchesButton}>
            <Text style={styles.viewMatchesButtonText}>View Matches</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <QuickAction
            icon="document-text-outline"
            label="Resume"
            color={COLORS.ACCENT_PURPLE}
            onPress={() => router.push("Profile/AddResume")}
          />
          <QuickAction
            icon="chatbubble-ellipses-outline"
            label="Interview"
            color={COLORS.PRIMARY_BLUE}
            onPress={() => router.push("ai/Interview")} // This will now navigate
          />
          <QuickAction
            icon="trending-up-outline"
            label="Career"
            color={COLORS.ACCENT_ORANGE}
            onPress={() => router.push("ai/Career")}
          />
          <QuickAction
            icon="chatbox-ellipses-outline"
            label="Chat"
            color={COLORS.TEXT_GRAY}
            onPress={() =>
              router.push("ai/Chat")
            }
          />
        </View>

        {/* AI Generated Job List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Recommended Jobs</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Action", "See all AI Recommended Jobs!")
            }
          >
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {isLoadingAI ? (
          <ActivityIndicator
            size="large"
            color={COLORS.PRIMARY_BLUE}
            style={styles.fullSectionLoading}
          />
        ) : aiGeneratedJobs.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScrollView}
          >
            {aiGeneratedJobs.map((job) => (
              <JobCard
                key={job.id}
                logoUri={job.logoUri} // Pass logoUri to JobCard
                title={job.title}
                company={job.company}
                location={job.location}
                salary={job.salary}
                url={job.url} // Pass the job URL
                isAIRecommended={true} // All these are AI recommended
                onPress={() => router.push(`JobDetails/${job.id}`)} // Example navigation to a JobDetails screen
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noJobsText}>
            No AI recommended jobs available.
          </Text>
        )}

        {/* AI Career Tips */}
        <Text style={styles.sectionTitle}>AI Career Tips</Text>
        <AITipCard
          title="Improve Your Profile"
          content={isLoadingAI ? "Loading AI tip..." : aiCareerTipContent}
          onPress={() => router.push("Profile/profile")} // Example navigation
        />
        {/* Spacer for bottom padding */}
        <View style={{ height: SPACING.XXL * 2 }} />
      </ScrollView>
    </View>
  );
};

const QuickAction = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={quickActionStyles.container} onPress={onPress}>
    <View style={quickActionStyles.iconContainer}>
      <Ionicons name={icon} size={FONT_SIZES.H2} color={color} />
    </View>
    <Text style={quickActionStyles.label}>{label}</Text>
  </TouchableOpacity>
);

const quickActionStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: SPACING.XS / 2,
  },
  iconContainer: {
    backgroundColor: COLORS.WHITE,
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.L,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.XS,
    ...SHADOWS.small,
  },
  label: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DARK,
    textAlign: "center",
  },
});

const JobCard = ({
  title,
  company,
  location,
  salary,
  isAIRecommended,
  logoUri,
  url, // Receive the URL prop
  onPress,
}) => {
  const handleApplyNow = async () => {
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    } else {
      Alert.alert("Error", "No application URL provided for this job.");
    }
  };

  return (
    <TouchableOpacity style={jobCardStyles.container} onPress={onPress}>
      <View style={jobCardStyles.header}>
        <View style={jobCardStyles.companyLogoWrapper}>
          <Image
            source={{ uri: logoUri }}
            style={jobCardStyles.companyLogo}
            onError={(e) =>
              console.log("JobCard logo loading error:", e.nativeEvent.error)
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={jobCardStyles.title}>{title}</Text>
          <Text style={jobCardStyles.company}>{company}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="bookmark-outline"
            size={FONT_SIZES.H2}
            color={COLORS.TEXT_GRAY}
          />
        </TouchableOpacity>
      </View>
      <View style={jobCardStyles.infoRow}>
        <Ionicons
          name="location-outline"
          size={FONT_SIZES.BODY}
          color={COLORS.TEXT_GRAY}
          style={{ marginRight: SPACING.XXS }}
        />
        <Text style={jobCardStyles.infoText}>{location}</Text>
      </View>

      <View style={jobCardStyles.infoRow}>
        <Ionicons
          name="cash-outline"
          size={FONT_SIZES.BODY}
          color={COLORS.TEXT_GRAY}
          style={{ marginRight: SPACING.XXS }}
        />
        <Text style={jobCardStyles.infoText}>{salary}</Text>
      </View>

      {isAIRecommended && (
        <View style={jobCardStyles.aiRecommendedTag}>
          <Text style={jobCardStyles.aiRecommendedText}>AI RECOMMENDED</Text>
        </View>
      )}

      {/* Modified Apply Now button */}
      <TouchableOpacity
        style={jobCardStyles.applyButton}
        onPress={handleApplyNow}
      >
        <Text style={jobCardStyles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const jobCardStyles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    marginRight: SPACING.M,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.S,
    alignItems: "center", // Align items vertically in the header
  },
  companyLogoWrapper: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.M,
    backgroundColor: COLORS.LIGHT_BLUE, // Placeholder background
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.S,
    overflow: "hidden", // Ensure image stays within bounds
  },
  companyLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // Or 'cover' depending on desired effect
  },
  title: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  company: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY_BLUE,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.S,
  },
  infoText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  aiRecommendedTag: {
    backgroundColor: COLORS.LIGHT_BLUE,
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.S,
    paddingVertical: SPACING.XXS,
    borderRadius: BORDER_RADIUS.S,
    marginBottom: SPACING.M,
  },
  aiRecommendedText: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "bold",
  },
  applyButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.M,
    alignItems: "center",
  },
  applyButtonText: {
    color: COLORS.WHITE,
    fontWeight: "600",
  },
});

const AITipCard = ({ title, content, onPress }) => (
  <TouchableOpacity style={aiTipCardStyles.container} onPress={onPress}>
    <View style={aiTipCardStyles.iconContainer}>
      <Ionicons
        name="sparkles"
        size={FONT_SIZES.H2}
        color={COLORS.PRIMARY_BLUE}
      />
    </View>
    <View style={aiTipCardStyles.contentContainer}>
      <Text style={aiTipCardStyles.title}>{title}</Text>
      <Text style={aiTipCardStyles.content}>{content}</Text>
    </View>
    <Ionicons
      name="chevron-forward"
      size={FONT_SIZES.H2}
      color={COLORS.TEXT_GRAY}
    />
  </TouchableOpacity>
);

const aiTipCardStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    ...SHADOWS.small,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.L,
  },
  iconContainer: {
    backgroundColor: COLORS.LIGHT_BLUE,
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.M,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.M,
  },
  title: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS,
  },
  contentContainer: {
    flex: 1,
    marginRight: SPACING.S,
  },
  content: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    lineHeight: FONT_SIZES.SMALL * 1.4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollViewContent: {
    paddingHorizontal: SPACING.XL,
    paddingBottom: SPACING.XXL * 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: SPACING.XL,
  },
  greetingText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    fontWeight: "500",
  },
  userNameText: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  notificationButton: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.S,
    borderRadius: BORDER_RADIUS.M,
    ...SHADOWS.small,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  aiJobMatchCard: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    marginBottom: SPACING.XXL,
    ...SHADOWS.medium,
  },
  aiJobMatchTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    marginBottom: SPACING.S,
  },
  aiJobMatchDescription: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    marginBottom: SPACING.M,
    lineHeight: FONT_SIZES.BODY * 1.4,
  },
  viewMatchesButton: {
    backgroundColor: COLORS.WHITE,
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: BORDER_RADIUS.M,
    ...SHADOWS.small,
  },
  viewMatchesButtonText: {
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "600",
    fontSize: FONT_SIZES.BODY,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.XL,
    marginBottom: SPACING.L,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.XXL,
    marginHorizontal: -SPACING.XS / 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.L,
  },
  seeAllText: {
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "600",
    fontSize: FONT_SIZES.BODY,
  },
  horizontalScrollView: {
    marginBottom: SPACING.XXL,
  },
  // New styles for loading and empty states
  loadingIndicator: {
    marginVertical: SPACING.M,
  },
  fullSectionLoading: {
    marginVertical: SPACING.XXL,
  },
  noJobsText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    paddingVertical: SPACING.L,
  },
});

export default AIHomeScreen;
