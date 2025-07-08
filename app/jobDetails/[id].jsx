import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking, 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers"; 
import { useLocalSearchParams, useRouter } from "expo-router"; 
import { DetailScreenHeader } from "../../components/JobDetailsComponents/DetailScreenHeader";

// Get screen width for responsive sizing
const { width: screenWidth } = Dimensions.get("window");



const JobDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const { jobId } = useLocalSearchParams();
  const router = useRouter(); 

  const [activeTab, setActiveTab] = useState("Description");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const jobDetails = {
    id: jobId,
    logoUri:
      "https://images.unsplash.com/photo-1678483789111-3a04c4628bd6?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Google logo placeholder
    title: "UI/UX Designer",
    company: "Google",
    location: "California",
    postedTime: "1 day ago",
    // Enhanced description with more content
    description: `
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

      At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas.

      Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain.
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
    `,
    salary: "$15K/Mo", // New: Salary for job overview
    jobType: "Full-Time", // New: Job Type for job overview
    position: "Senior", // New: Position for job overview
    requirements: [
      // New: Requirements list
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    ],
    detailedLocation: "Overlook Avenue, Belleville, NJ, USA", // New: Detailed location for map
    informations: {
      // New: Informations section
      position: "Senior Designer",
      qualification: "Bachelor's Degree",
      experience: "3 Years",
      jobType: "Full-Time",
      specialization: "Design",
    },
    facilities: [
      // New: Facilities list
      "Medical",
      "Dental",
      "Technical Certification",
      "Meal Allowance",
      "Transportation Allowance",
      "Regular Hours",
      "Mondays-Fridays",
    ],
    companyDetails: {
      website: "https://www.google.com",
      industry: "Internet product",
      employeeSize: "132,121 Employees",
      headOffice: "Mountain View, California, Amerika Serikat",
      type: "Multinational company",
      founded: "1998", // Renamed from 'founded' to 'since' in UI
      specialties:
        "Search technology, Web computing, Software and Online advertising",
      galleryImages: [
        {
          id: "1",
          uri: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: "2",
          uri: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: "3",
          uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8b2ZmaWNlJTIwY29sbGFib3JhdGlvbnxlbnwwfHx8fDE3MDA0Mjg4NDF8MA&ixlib=rb-4.0.3&q=80&w=400",
        },
        {
          id: "4",
          uri: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8b2ZmaWNlJTIwc3RhcnR1cHxlbnwwfHx8fDE3MDA0Mjg4NDF8MA&ixlib=rb-4.0.3&q=80&w=400",
        },
        {
          id: "5",
          uri: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8b2ZmaWNlJTIwbWVldGluZ3xlbnwwfHx8fDE3MDA0Mjg4NDF8MA&ixlib=rb-4.0.3&q=80&w=400",
        },
      ],
      additionalImagesCount: 3,
    },
  };

  // Truncate description for "Read More" functionality
  const truncatedDescription = jobDetails.description.substring(0, 250) + "...";

  // Function to handle opening URLs
  const handleOpenURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Don't know how to open this URL: ${url}`);
      }
    } catch (error) {
      console.error("An error occurred trying to open the URL:", error);
    }
  };

  const renderContent = () => {
    if (activeTab === "Description") {
      return (
        <View style={styles.tabContentContainer}>
          {/* Job Overview Section */}
          <View style={styles.jobOverviewContainer}>
            <View style={styles.jobOverviewItem}>
              <Text style={styles.jobOverviewLabel}>Salary</Text>
              <Text style={styles.jobOverviewValue}>{jobDetails.salary}</Text>
            </View>
            <View style={styles.jobOverviewSeparator} />
            <View style={styles.jobOverviewItem}>
              <Text style={styles.jobOverviewLabel}>Job Type</Text>
              <Text style={styles.jobOverviewValue}>{jobDetails.jobType}</Text>
            </View>
            <View style={styles.jobOverviewSeparator} />
            <View style={styles.jobOverviewItem}>
              <Text style={styles.jobOverviewLabel}>Postion</Text>
              <Text style={styles.jobOverviewValue}>{jobDetails.position}</Text>
            </View>
          </View>

          {/* Job Description Section */}
          <Text style={styles.sectionHeading}>Job Description</Text>
          <Text style={styles.descriptionText}>
            {showFullDescription
              ? jobDetails.description
              : truncatedDescription}
          </Text>
          {!showFullDescription && (
            <TouchableOpacity onPress={() => setShowFullDescription(true)}>
              <Text style={styles.readMoreButtonText}>Read More</Text>
            </TouchableOpacity>
          )}

          {/* Requirements Section */}
          <Text style={styles.sectionHeading}>Requirements</Text>
          {jobDetails.requirements.map((req, index) => (
            <Text key={index} style={styles.bulletPoint}>
              {"\u2022 "} {req}
            </Text>
          ))}

          {/* Location Section */}
          <Text style={styles.sectionHeading}>Location</Text>
          <Text style={styles.locationText}>{jobDetails.detailedLocation}</Text>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }} // Placeholder for map image
            style={styles.mapImage}
            resizeMode="cover"
            onError={(e) =>
              console.log("Map image loading error:", e.nativeEvent.error)
            }
          />

          {/* Informations Section */}
          <Text style={styles.sectionHeading}>Informations</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Position</Text>
              <Text style={styles.infoValue}>
                {jobDetails.informations.position}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Qualification</Text>
              <Text style={styles.infoValue}>
                {jobDetails.informations.qualification}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>
                {jobDetails.informations.experience}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Job Type</Text>
              <Text style={styles.infoValue}>
                {jobDetails.informations.jobType}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Specialization</Text>
              <Text style={styles.infoValue}>
                {jobDetails.informations.specialization}
              </Text>
            </View>
          </View>

          {/* Facilities and Others Section */}
          <Text style={styles.sectionHeading}>Facilities and Others</Text>
          {jobDetails.facilities.map((facility, index) => (
            <Text key={index} style={styles.bulletPoint}>
              {"\u2022 "} {facility}
            </Text>
          ))}
        </View>
      );
    } else {
      // Company Tab Content
      return (
        <View style={styles.tabContentContainer}>
          <Text style={styles.sectionHeading}>About Company</Text>
          <Text style={styles.descriptionText}>
            {jobDetails.description}
          </Text>
          <View style={styles.companyDetailGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Website</Text>
              <TouchableOpacity
                onPress={() => handleOpenURL(jobDetails.companyDetails.website)}
              >
                <Text style={styles.detailValueLink}>
                  {jobDetails.companyDetails.website.replace(
                    /(^\w+:|^)\/\//,
                    ""
                  )}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Industry</Text>
              <Text style={styles.detailValue}>
                {jobDetails.companyDetails.industry}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Employee size</Text>
              <Text style={styles.detailValue}>
                {jobDetails.companyDetails.employeeSize}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Head office</Text>
              <Text style={styles.detailValue}>
                {jobDetails.companyDetails.headOffice}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>
                {jobDetails.companyDetails.type}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Since</Text>
              <Text style={styles.detailValue}>
                {jobDetails.companyDetails.founded}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Specialization</Text>
              <Text style={styles.detailValue}>
                {jobDetails.companyDetails.specialties}
              </Text>
            </View>
          </View>
         
          <Text style={styles.sectionHeading}>Company Gallery</Text>
          <View style={styles.galleryContainer}>
           
            <Image
              source={{ uri: jobDetails.companyDetails.galleryImages[0]?.uri }}
              style={styles.galleryImage}
              onError={(e) =>
                console.log(
                  "Gallery image 1 loading error:",
                  e.nativeEvent.error
                )
              }
            />
           
            <TouchableOpacity style={styles.galleryImageOverlayContainer}>
              <Image
                source={{
                  uri: jobDetails.companyDetails.galleryImages[1]?.uri,
                }}
                style={styles.galleryImage}
                onError={(e) =>
                  console.log(
                    "Gallery image 2 loading error:",
                    e.nativeEvent.error
                  )
                }
              />
              <View style={styles.galleryOverlay}>
                <Text style={styles.galleryOverlayText}>
                  +{jobDetails.companyDetails.additionalImagesCount} pictures
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <DetailScreenHeader
        onBackPress={() => router.back()}
        onMorePress={() => console.log("More options pressed")} 
        insets={insets}
      />

      {/* Scrollable Content Area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Header Section */}
        <View style={styles.companyHeader}>
          <Image
            source={{ uri: jobDetails.logoUri }}
            style={styles.companyLogo}
            onError={(e) =>
              console.log("Company logo loading error:", e.nativeEvent.error)
            }
          />
          <Text style={styles.jobTitle}>{jobDetails.title}</Text>
          <View style={styles.companyInfoRow}>
            <Text style={styles.companyDetailText}>{jobDetails.company}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.companyDetailText}>{jobDetails.location}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.companyDetailText}>
              {jobDetails.postedTime}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Description" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Description")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "Description" && styles.activeTabButtonText,
              ]}
            >
              Description
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "Company" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("Company")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "Company" && styles.activeTabButtonText,
              ]}
            >
              Company
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render Active Tab Content */}
        {renderContent()}

        {/* Padding for bottom button */}
        <View style={{ height: SPACING.XXL * 3 }} />
      </ScrollView>

      {/* Fixed Bottom Apply Bar */}
      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom + SPACING.S }]}
      >
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons
            name="bookmark-outline"
            size={24}
            color={COLORS.TEXT_DARK}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyNowButton}
          onPress={() => router.push("apply/UploadCVScreen")}
        >
          <Text style={styles.applyNowButtonText}>APPLY NOW</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: SPACING.XL,
    paddingBottom: SPACING.L,
  },
  companyHeader: {
    alignItems: "center",
    paddingVertical: SPACING.XXL,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: -SPACING.XL, // Extend to screen edges
    borderBottomLeftRadius: SPACING.L,
    borderBottomRightRadius: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: SPACING.XL,
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: SPACING.S, // Slightly rounded square as per image
    marginBottom: SPACING.M,
  },
  jobTitle: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
    textAlign: "center",
  },
  companyInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  companyDetailText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
  },
  dotSeparator: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginHorizontal: SPACING.XS,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SPACING.S,
    overflow: "hidden",
    marginBottom: SPACING.L,
    justifyContent: "center",
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.S,
    alignItems: "center",
    borderRadius: SPACING.S,
    marginHorizontal: SPACING.XS / 2,
    backgroundColor: COLORS.LIGHT_PURPLE,
  },
  activeTabButton: {
    backgroundColor: COLORS.PRIMARY_DARK_BLUE,
  },
  tabButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  activeTabButtonText: {
    color: COLORS.WHITE,
  },
  tabContentContainer: {
    paddingVertical: SPACING.M,
  },
  sectionHeading: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginTop: SPACING.L, // Added marginTop for spacing between sections
    marginBottom: SPACING.S,
  },
  descriptionText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    lineHeight: FONT_SIZES.BODY * 1.5,
    marginBottom: SPACING.S, // Adjusted for "Read More" button
  },
  readMoreButtonText: {
    color: COLORS.PRIMARY_BLUE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
    marginBottom: SPACING.L, // Space after read more button
  },
  // --- New styles for Job Overview Section ---
  jobOverviewContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    paddingVertical: SPACING.M,
    marginBottom: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobOverviewItem: {
    alignItems: "center",
    flex: 1, // Distribute space evenly
  },
  jobOverviewLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.XXS,
  },
  jobOverviewValue: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  jobOverviewSeparator: {
    width: 1,
    height: "60%", // Adjust height as needed
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  // --- New styles for Requirements & Facilities (Bullet Points) ---
  bulletPoint: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.XS,
    lineHeight: FONT_SIZES.BODY * 1.4,
  },
  // --- New styles for Location Map ---
  locationText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
  },
  mapImage: {
    width: "100%",
    height: 150, // Fixed height for the map image
    borderRadius: SPACING.S,
    marginBottom: SPACING.L,
  },
  // --- New styles for Informations Grid ---
  infoGrid: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.XS,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  infoLabel: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    flex: 0.5,
  },
  infoValue: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    flex: 0.5,
    textAlign: "right",
  },
  // --- Company Tab Specific Styles ---
  companyDetailGrid: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Align items in the center vertically
    paddingVertical: SPACING.XS,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  detailLabel: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    flex: 0.4, // Give label some flexibility
  },
  detailValue: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    flex: 0.6, // Give value more space
    textAlign: "right",
    fontWeight: "500", // Slightly bolder for better readability
  },
  detailValueLink: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY_BLUE, // Standard link color
    flex: 0.6,
    textAlign: "right",
    fontWeight: "500",
    textDecorationLine: "underline", // Underline to indicate it's a link
  },
  // --- Existing styles (Company Gallery) ---
  galleryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.M,
    marginBottom: SPACING.L,
  },
  galleryImage: {
    width: (screenWidth - SPACING.XL * 2 - SPACING.M) / 2,
    height: 120,
    borderRadius: SPACING.S,
    resizeMode: "cover",
  },
  galleryImageOverlayContainer: {
    position: "relative",
    width: (screenWidth - SPACING.XL * 2 - SPACING.M) / 2,
    height: 120,
    borderRadius: SPACING.S,
    overflow: "hidden",
  },
  galleryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: SPACING.S,
    justifyContent: "center",
    alignItems: "center",
  },
  galleryOverlayText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.S,
    borderTopLeftRadius: SPACING.L,
    borderTopRightRadius: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bookmarkButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  applyNowButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_DARK_BLUE,
    borderRadius: SPACING.S,
    paddingVertical: SPACING.M,
    alignItems: "center",
  },
  applyNowButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
  },
});

export default JobDetailScreen;



