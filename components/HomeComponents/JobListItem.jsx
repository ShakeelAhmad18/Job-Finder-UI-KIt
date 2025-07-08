import { View, Text } from "react-native";
import React from "react";
import { COLORS, FONT_SIZES, SPACING } from "../../constants/helpers";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

export const JobListItem = ({
  logoUri,
  title,
  company,
  location,
  salary,
  type,
  employmentType,
  onApply,
}) => {
  return (
    <TouchableOpacity style={jobListItemStyles.card}>
      <View style={jobListItemStyles.header}>
        <Image
          source={{ uri: logoUri }}
          style={jobListItemStyles.logo}
          onError={(e) =>
            console.log("Logo loading error:", e.nativeEvent.error)
          }
        />
        <View style={jobListItemStyles.titleContainer}>
          <Text style={jobListItemStyles.jobTitle}>{title}</Text>
          <Text style={jobListItemStyles.companyLocation}>
            {company} · {location}
          </Text>
        </View>
        <Ionicons name="bookmark-outline" size={24} color={COLORS.TEXT_GRAY} />
      </View>
      <Text style={jobListItemStyles.salary}>{salary}</Text>
      <View style={jobListItemStyles.footer}>
        <View style={jobListItemStyles.tagContainer}>
          <Text style={jobListItemStyles.tag}>{type}</Text>
          <Text style={jobListItemStyles.tag}>{employmentType}</Text>
        </View>
        <TouchableOpacity
          style={jobListItemStyles.applyButton}
          onPress={onApply}
        >
          <Text style={jobListItemStyles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const jobListItemStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SPACING.L,
    padding: SPACING.L,
    marginBottom: SPACING.M,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.S,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: SPACING.S,
  },
  titleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  companyLocation: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  salary: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagContainer: {
    flexDirection: "row",
  },
  tag: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SPACING.XS,
    paddingVertical: SPACING.XXS,
    paddingHorizontal: SPACING.S,
    marginRight: SPACING.XS,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  applyButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.S,
  },
  applyButtonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: FONT_SIZES.BODY,
  },
});
