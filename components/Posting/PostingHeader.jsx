// components/CommunityHeader.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers"; // Ensure FONT_SIZES is imported

const PostingHeader = ({
  onBackPress,
  onRightIconPress,
  title = "Community",
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.S }]}>
      <TouchableOpacity onPress={onBackPress} style={styles.leftIconButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
      </TouchableOpacity>

      {/* Central Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right Icon - e.g., notifications or chat */}
      <TouchableOpacity
        onPress={onRightIconPress}
        style={styles.rightIconButton}
      >
        {/* You can choose an icon that fits your app's context */}
        <Ionicons
          name="notifications-outline"
          size={24}
          color={COLORS.TEXT_DARK}
        />
        {/* Or: <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.TEXT_DARK} /> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between", // Distributes items along the main axis
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    backgroundColor: COLORS.WHITE, // Keeping white background as per your previous headers for consistency
    paddingBottom: SPACING.L,
    borderBottomLeftRadius: SPACING.L,
    borderBottomRightRadius: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftIconButton: {
    padding: SPACING.XS,
    // No explicit marginRight needed due to justify-content: space-between
  },
  title: {
    flex: 1, // Allow title to take available space
    textAlign: "center", // Center the text within its flex container
    fontSize: FONT_SIZES.H1, // Make title more prominent
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  rightIconButton: {
    padding: SPACING.XS,
    // No explicit marginLeft needed due to justify-content: space-between
  },
});

export default PostingHeader;
