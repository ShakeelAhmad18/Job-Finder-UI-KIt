import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { COLORS, SPACING, FONT_SIZES } from "../../constants/helpers";

const CompanyCard = ({ company }) => {
  const [isFollowing, setIsFollowing] = useState(company.isFollowing);

  const handleFollowToggle = useCallback(() => {
    setIsFollowing((prev) => !prev);
  }, []);

  return (
    <View style={styles.card}>
      <Image source={company.logo} style={styles.logo} />
      <Text style={styles.companyName}>{company.name}</Text>
      <Text style={styles.followers}>{company.followers}</Text>
      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing ? styles.followingButton : styles.unfollowedButton,
        ]}
        onPress={handleFollowToggle}
      >
        <Text
          style={[
            styles.followButtonText,
            isFollowing
              ? styles.followingButtonText
              : styles.unfollowedButtonText,
          ]}
        >
          {isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    padding: SPACING.L,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    marginBottom: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: SPACING.S,
    marginBottom: SPACING.S,
    resizeMode: "contain",
  },
  companyName: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    textAlign: "center",
    marginBottom: SPACING.XS,
  },
  followers: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.M,
    textAlign: "center",
  },
  followButton: {
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    borderRadius: SPACING.L,
    borderWidth: 1,
  },
  followingButton: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.BORDER_LIGHT,
  },
  unfollowedButton: {
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderColor: COLORS.ACCENT_ORANGE,
  },
  followButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
  },
  followingButtonText: {
    color: COLORS.TEXT_DARK,
  },
  unfollowedButtonText: {
    color: COLORS.WHITE,
  },
});

export default CompanyCard;
