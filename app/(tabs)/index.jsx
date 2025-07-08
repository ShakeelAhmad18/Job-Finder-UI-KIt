import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers";
import { PromotionCard } from "../../components/HomeComponents/PromotionCard";
import { JobCategoryCard } from "../../components/HomeComponents/JobCategoryCard";
import { JobListItem } from "../../components/HomeComponents/JobListItem";
import { useRouter } from "expo-router";


const JOB_CARD_HEIGHT = 150;
const REMOTE_JOB_CARD_HEIGHT = JOB_CARD_HEIGHT * 2 + SPACING.M;


const HomeScreen = () => {
  const insets = useSafeAreaInsets(); 
  const router=useRouter();
 
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
          <TouchableOpacity onPress={()=>router.push("Profile/profile")}>
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
    </View>
  );
}


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
});

export default HomeScreen
