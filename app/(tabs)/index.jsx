import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal, // Import Modal for the popup
  Alert, // Import Alert for button actions
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Import Ionicons for AI icon
// Assuming these components exist and are styled according to CodeCanyons standards
import { PromotionCard } from "../../components/HomeComponents/PromotionCard";
import { JobCategoryCard } from "../../components/HomeComponents/JobCategoryCard";
import { JobListItem } from "../../components/HomeComponents/JobListItem";
import { useRouter } from "expo-router";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/helpers";


const JOB_CARD_HEIGHT = 150;
const REMOTE_JOB_CARD_HEIGHT = JOB_CARD_HEIGHT * 2 + SPACING.M;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();


  const recentJobs = [
    {
      id: "1",
      logoUri: "https://placehold.co/40x40/000000/ffffff?text=AP",
      title: "Product Designer",
      company: "Google Inc.",
      location: "California, USA",
      salary: "$15K/Mo",
      type: "Senior designer",
      employmentType: "Full time",
    },
    {
      id: "2",
      logoUri: "https://placehold.co/40x40/0000FF/ffffff?text=MT",
      title: "Frontend Developer",
      company: "Meta Platforms",
      location: "New York, USA",
      salary: "$12K/Mo",
      type: "Mid-level",
      employmentType: "Full time",
    },
    {
      id: "3",
      logoUri: "https://placehold.co/40x40/FF0000/ffffff?text=NF",
      title: "UI/UX Researcher",
      company: "Netflix",
      location: "Los Angeles, USA",
      salary: "$14K/Mo",
      type: "Experienced",
      employmentType: "Part time",
    },
  ];

  const handleApply = (id) => {
    router.push(`/jobDetails/${id}`);
  };

 

  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Hello</Text>
            <Text style={styles.userNameText}>Orlando Diggs.</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("Profile/profile")}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww",
              }}
              style={styles.userAvatar}
              onError={(e) =>
                console.log("User avatar loading error:", e.nativeEvent.error)
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.promotionCardWrapper}>
          <PromotionCard />
        </View>

        <Text style={styles.sectionTitle}>Find Your Job</Text>
        <View style={styles.jobCategoriesMainContainer}>
          <JobCategoryCard
            iconName="document-text-outline"
            count="44.5k"
            title="Remote Job"
            backgroundColor={COLORS.LIGHT_BLUE}
            style={styles.remoteJobCard}
          />
          <View style={styles.jobCategoriesRightColumn}>
            <JobCategoryCard
              iconName="briefcase-outline"
              count="66.8k"
              title="Full Time"
              backgroundColor={COLORS.LIGHT_PURPLE}
              style={styles.stackedJobCard}
            />
            <View style={{ height: SPACING.M }} />
            <JobCategoryCard
              iconName="time-outline"
              count="38.9k"
              title="Part Time"
              backgroundColor={COLORS.LIGHT_ORANGE}
              style={styles.stackedJobCard}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Job List</Text>
        {recentJobs.map((job) => (
          <JobListItem
            key={job.id}
            logoUri={job.logoUri}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            type={job.type}
            employmentType={job.employmentType}
            onApply={() => handleApply(job.id)}
          />
        ))}

        <View style={{ height: SPACING.XXL * 2 }} />
      </ScrollView>

      {/* AI Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.aiFab}
        onPress={() => router.push("ai/Home")} // Open the modal on press
      >
        {/* Using a custom icon for uniqueness, like a stylized brain or a spark */}
        <Ionicons name="sparkles" size={FONT_SIZES.H1} color={COLORS.WHITE} />
        {/* Or a more abstract AI icon from MaterialCommunityIcons */}
        {/* <MaterialCommunityIcons name="robot-outline" size={FONT_SIZES.H1} color={COLORS.WHITE} /> */}
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: SPACING.XL,
    paddingBottom: SPACING.L,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: SPACING.L,
  },
  greetingText: {
    fontSize: FONT_SIZES.H2,
    color: COLORS.TEXT_DARK,
    fontWeight: "500",
  },
  userNameText: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_BLUE,
  },
  promotionCardWrapper: {
    marginBottom: SPACING.XXL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.XXL,
    marginBottom: SPACING.L,
  },
  jobCategoriesMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.M,
    marginHorizontal: -SPACING.XS / 2,
  },
  remoteJobCard: {
    width: "49%",
    height: REMOTE_JOB_CARD_HEIGHT,
    marginRight: SPACING.XS / 2,
  },
  jobCategoriesRightColumn: {
    flexDirection: "column",
    width: "49%",
    justifyContent: "space-between",
    marginLeft: SPACING.XS / 2,
  },
  stackedJobCard: {
    height: JOB_CARD_HEIGHT,
  },
  // --- AI Button (FAB) Styles ---
  aiFab: {
    position: "absolute",
    bottom: SPACING.XXL, // Adjust as needed
    right: SPACING.XL, // Adjust as needed
    backgroundColor: COLORS.ACCENT_ORANGE, // A vibrant color for uniqueness
    width: 60,
    height: 60,
    borderRadius: 30, // Make it perfectly circular
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.large, // Stronger shadow for floating effect
    zIndex: 100, // Ensure it's above other content
  },
  // --- AI Modal Styles (Bottom Sheet) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dark semi-transparent overlay
    justifyContent: "flex-end", // Align modal to the bottom
  },
  aiModalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.L,
    borderTopRightRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    width: "100%",
    maxHeight: "50%", // Limit height of the modal
    ...SHADOWS.large, // Stronger shadow for the modal
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.TEXT_GRAY,
    borderRadius: BORDER_RADIUS.S,
    alignSelf: "center",
    marginBottom: SPACING.L,
  },
  aiModalTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.L,
    textAlign: "center",
  },
  aiModalOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND_LIGHT, // Light background for options
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    marginBottom: SPACING.S,
    ...SHADOWS.small,
  },
  aiModalOptionText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    marginLeft: SPACING.M,
    fontWeight: "500",
  },
  aiModalCloseButton: {
    backgroundColor: COLORS.PRIMARY_DARK_BLUE, // Use primary dark blue for close button
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    marginTop: SPACING.L,
  },
  aiModalCloseButtonText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default HomeScreen;
