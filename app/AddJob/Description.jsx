import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Linking,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/helpers";

const JobDescriptionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [applied, setApplied] = useState(false);

  // Mock job data - in a real app this would come from props or API
  const job = {
    id: "apple-uiux-001",
    title: "UI/UX Designer",
    company: "Apple Inc.",
    location: "California, USA",
    type: "On-site",
    salary: "$120,000 - $150,000 per year",
    postedBy: "Orlando Diggs",
    postedDate: "2 days ago",
    description: [
      "Design and deliver wireframes, user stories, user journeys, and mockups optimized for a wide range of devices and interfaces.",
      "Identify design problems and devise elegant solutions.",
      "Make strategic design and user-experience decisions related to core, and new, functions and features.",
      "Take a user-centered design approach and rapidly test and iterate your designs.",
      "Collaborate with other team members and stakeholders.",
      "Ask smart questions, take risks and champion new ideas.",
    ],
    requirements: [
      "3+ years of UX design experience. Preference will be given to candidates who have experience designing complex solutions.",
      "Expertise in standard UX software such as Sketch, Figma, Adobe XD, and the like is a must.",
      "Ability to work with stakeholders to understand detailed requirements and design complete user experiences.",
      "Passion for resolving user pain points through great design.",
      "Open to receiving feedback and constructive criticism.",
    ],
    benefits: [
      "Competitive salary and bonuses",
      "Comprehensive health coverage",
      "401(k) matching",
      "Employee stock purchase plan",
      "Professional development budget",
      "On-site wellness center",
    ],
  };

  // Animation for screen entrance
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${job.title} position at ${job.company}: ${job.location}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleApply = () => {
    setApplied(true);
    // In a real app, this would navigate to an application form or external link
    setTimeout(() => {
      setApplied(false);
    }, 3000);
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // In a real app, this would save to user's profile/database
  };

  const openCompanyWebsite = () => {
    // In a real app, this would open the actual company website
    Linking.openURL("https://www.apple.com/careers/");
  };

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
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="share-social"
                size={20}
                color={COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveJob}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? COLORS.PRIMARY_BLUE : COLORS.PRIMARY_BLUE}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Job Header */}
          <View style={styles.jobHeader}>
            <View style={styles.companyLogoContainer}>
              <Image
                source={{ uri: "https://logo.clearbit.com/apple.com" }}
                style={styles.companyLogo}
              />
            </View>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>

            <View style={styles.jobMeta}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={COLORS.TEXT_GRAY}
                />
                <Text style={styles.metaText}>{job.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons
                  name="business-outline"
                  size={16}
                  color={COLORS.TEXT_GRAY}
                />
                <Text style={styles.metaText}>{job.type}</Text>
              </View>
            </View>

            <View style={styles.salaryContainer}>
              <MaterialIcons
                name="attach-money"
                size={18}
                color={COLORS.SUCCESS}
              />
              <Text style={styles.salaryText}>{job.salary}</Text>
            </View>
          </View>

          {/* Posted By */}
          <View style={styles.postedByContainer}>
            <Text style={styles.sectionTitle}>Posted by</Text>
            <View style={styles.postedBy}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {job.postedBy
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <View style={styles.postedByInfo}>
                <Text style={styles.postedByName}>{job.postedBy}</Text>
                <Text style={styles.postedByMeta}>{job.postedDate}</Text>
              </View>
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            {job.description.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsContainer}>
              {job.benefits.map((item, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={COLORS.SUCCESS}
                  />
                  <Text style={styles.benefitText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Company Info */}
          <TouchableOpacity
            style={styles.companyInfo}
            onPress={openCompanyWebsite}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>About {job.company}</Text>
            <Text style={styles.companyDescription}>
              {job.company} is a leading technology company known for its
              innovative products and services. We're looking for talented
              individuals to join our design team and help shape the future of
              our user experiences.
            </Text>
            <View style={styles.visitWebsite}>
              <Text style={styles.websiteText}>Visit website</Text>
              <Ionicons
                name="open-outline"
                size={16}
                color={COLORS.PRIMARY_BLUE}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.applyContainer}>
          <TouchableOpacity
            style={[styles.applyButton, applied && styles.appliedButton]}
            onPress={handleApply}
            activeOpacity={0.7}
            disabled={applied}
          >
            <Text style={styles.applyButtonText}>
              {applied ? "Application Sent!" : "Apply Now"}
            </Text>
            {applied && (
              <Ionicons
                name="checkmark-done"
                size={20}
                color={COLORS.WHITE}
                style={styles.applyIcon}
              />
            )}
          </TouchableOpacity>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  backButton: {
    padding: SPACING.XS,
  },
  headerActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: SPACING.XS,
    marginLeft: SPACING.S,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 80, // Space for apply button
  },
  jobHeader: {
    alignItems: "center",
    padding: SPACING.L,
    backgroundColor: COLORS.WHITE,
    marginBottom: SPACING.M,
    ...SHADOWS.small,
  },
  companyLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.L,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.M,
    overflow: "hidden",
  },
  companyLogo: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  jobTitle: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
    textAlign: "center",
  },
  companyName: {
    fontSize: FONT_SIZES.H3,
    color: COLORS.PRIMARY_BLUE,
    marginBottom: SPACING.M,
    textAlign: "center",
  },
  jobMeta: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: SPACING.M,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.S,
    marginVertical: SPACING.XS,
  },
  metaText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginLeft: SPACING.XS,
  },
  salaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.M,
    marginTop: SPACING.XS,
  },
  salaryText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.SUCCESS,
    fontWeight: "600",
    marginLeft: SPACING.XS,
  },
  postedByContainer: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.L,
    marginBottom: SPACING.M,
    ...SHADOWS.small,
  },
  postedBy: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.M,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.PRIMARY_BLUE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.M,
  },
  avatarText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H3,
    fontWeight: "600",
  },
  postedByInfo: {
    flex: 1,
  },
  postedByName: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS,
  },
  postedByMeta: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.L,
    marginBottom: SPACING.M,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H3,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.M,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: SPACING.S,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.PRIMARY_BLUE,
    marginTop: 8,
    marginRight: SPACING.M,
  },
  listItemText: {
    flex: 1,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    lineHeight: 22,
  },
  benefitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: SPACING.M,
  },
  benefitText: {
    fontSize: FONT_SIZES.BODY_SMALL,
    color: COLORS.TEXT_DARK,
    marginLeft: SPACING.S,
  },
  companyInfo: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.L,
    marginBottom: SPACING.M,
    ...SHADOWS.small,
  },
  companyDescription: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    lineHeight: 22,
    marginBottom: SPACING.M,
  },
  visitWebsite: {
    flexDirection: "row",
    alignItems: "center",
  },
  websiteText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY_BLUE,
    marginRight: SPACING.XS,
  },
  applyContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.L,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
    ...SHADOWS.medium,
  },
  applyButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  appliedButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  applyButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  applyIcon: {
    marginLeft: SPACING.S,
  },
});

export default JobDescriptionScreen;
