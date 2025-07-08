// components/MyConnectionTabContent.js
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import CompanyCard from "./CompanyCard"; // Adjusted import path
import { SPACING } from "../../constants/helpers";

// Dummy data for companies
const COMPANIES_DATA = [
  {
    id: "1",
    name: "Google Inc",
    logo: require("../../assets/images/google_logo.png"), // Add your image
    followers: "1M Followers",
    isFollowing: false,
  },
  {
    id: "2",
    name: "Dribbble Inc",
    logo: require("../../assets/images/dribble_logo.png"), // Add your image
    followers: "1M Followers",
    isFollowing: false,
  },
  {
    id: "3",
    name: "Twitter Inc",
    logo: require("../../assets/images/google_logo.png"), // Add your image
    followers: "1M Followers",
    isFollowing: false,
  },
  {
    id: "4",
    name: "Apple Inc",
    logo: require("../../assets/images/google_logo.png"), // Add your image
    followers: "1M Followers",
    isFollowing: false,
  },
  {
    id: "5",
    name: "Facebook Inc",
    logo: require("../../assets/images/dribble_logo.png"), // Add your image
    followers: "1M Followers",
    isFollowing: true,
  },
  {
    id: "6",
    name: "Microsoft Inc",
    logo: require("../../assets/images/dribble_logo.png"), // Add your image
    followers: "1M Followers",
    isFollowing: false,
  },
];

const MyConnectionTabContent = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={COMPANIES_DATA}
        renderItem={({ item }) => <CompanyCard company={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // No horizontal padding here, parent CommunityScreen will handle it
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: SPACING.XL, // Apply horizontal padding here for the grid
  },
  flatListContent: {
    paddingBottom: SPACING.L, // Add some padding so last item isn't at very bottom
  },
});

export default MyConnectionTabContent;
