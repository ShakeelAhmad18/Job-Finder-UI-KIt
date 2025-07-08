import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router"; // Assuming expo-router for navigation
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers";
import PostingHeader from "../../components/Posting/PostingHeader";
import PostingTabContent from "../../components/Posting/PostingTabContent.js";
import MyConnectionTabContent from "../../components/Posting/MyConnectionTabContent.jsx";

const Posting = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // State to manage which tab (Posting or My connection) is active
  const [activeCommunityTab, setActiveCommunityTab] = useState("posting");

  const handleCommunityTabPress = useCallback((tab) => {
    setActiveCommunityTab(tab);
  }, []);

  const bottomBarHeight = 1 + SPACING.L + insets.bottom + SPACING.XS;

  return (
    <View style={styles.container}>
      {/* Header */}
      <PostingHeader onBackPress={() => router.back()} />

      {/* Tab Switcher (Posting / My connection) */}
      <View style={styles.tabSwitcherContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            // Add margin to the right of the first button to create space
            { marginRight: SPACING.XXS },
            activeCommunityTab === "posting"
              ? styles.tabButtonActive
              : styles.tabButtonInactive,
          ]}
          onPress={() => handleCommunityTabPress("posting")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeCommunityTab === "posting"
                ? styles.tabButtonTextActive
                : styles.tabButtonTextInactive,
            ]}
          >
            Posting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            // Add margin to the left of the second button to create space
            { marginLeft: SPACING.XXS },
            activeCommunityTab === "myConnection"
              ? styles.tabButtonActive
              : styles.tabButtonInactive,
          ]}
          onPress={() => handleCommunityTabPress("myConnection")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeCommunityTab === "myConnection"
                ? styles.tabButtonTextActive
                : styles.tabButtonTextInactive,
            ]}
          >
            My connection
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.contentContainer, { paddingBottom: bottomBarHeight }]}
      >
        {activeCommunityTab === "posting" && <PostingTabContent />}
        {activeCommunityTab === "myConnection" && <MyConnectionTabContent />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  tabSwitcherContainer: {
    flexDirection: "row",
    marginHorizontal: SPACING.S,
    backgroundColor: COLORS.COMMUNITY_TAB_INACTIVE_BG, // Assuming this color exists or is defined
    borderRadius: SPACING.M,
    padding: SPACING.XS,
    marginBottom: SPACING.S,
    marginTop: SPACING.L,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.S,
    borderRadius: SPACING.S,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: COLORS.PRIMARY_DARK_BLUE,
  },
  tabButtonInactive: {
    backgroundColor: COLORS.WHITE, // Changed to TEXT_GRAY as per provided constants
  },
  tabButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
  },
  tabButtonTextActive: {
    color: COLORS.WHITE,
  },
  tabButtonTextInactive: {
    color: COLORS.COMMUNITY_TAB_INACTIVE_TEXT, // Assuming this color exists or is defined
  },
  contentContainer: {
    flex: 1,
  },
});

export default Posting;
