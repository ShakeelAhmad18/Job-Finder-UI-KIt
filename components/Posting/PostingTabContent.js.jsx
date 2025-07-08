// components/PostingTabContent.js
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import PostCard from "./PostCard"; // Adjusted import path
import { SPACING } from "../../constants/helpers"; // Ensure SPACING is imported

const POSTS_DATA = [
  {
    id: "1",
    userProfilePic: require("../../assets/images/profile.png"), // Assuming you have a default profile.png
    userName: "Arnold Leonardo",
    timeAgo: "21 minutes ago",
    question: "What are the characteristics of a fake job call form?",
    content:
      "Because I always find fake job calls so I'm confused which job to take can you share your knowledge here? thank you",
    initialLikes: 12,
    comments: 10,
    shares: 2,
    hasReadMore: false,
  },
  {
    id: "2",
    userProfilePic: require("../../assets/images/profile.png"), // Assuming you have a default profile.png
    userName: "Monica",
    timeAgo: "45 minutes ago",
    question: "Experience when moving to a new job",
    content:
      "Culture shock when moving to a new job is normal. This is not something wrong and I personally experienced it, when I experienced this when I changed jobs in 2 days...",
    initialLikes: 12,
    comments: 10,
    shares: 2,
    hasReadMore: true,
  },
  {
    id: "3",
    userProfilePic: require("../../assets/images/profile.png"), // Assuming you have a default profile.png
    userName: "Arnold Leonardo",
    timeAgo: "1 hour ago",
    question: "Tips for interviewing remotely",
    content:
      "Remote interviews are becoming common. What are your best tips for acing one? From setting up your background to answering tough questions...",
    initialLikes: 25,
    comments: 5,
    shares: 1,
    hasReadMore: true,
  },
];

const PostingTabContent = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={POSTS_DATA}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: SPACING.XL, // Apply horizontal padding to the list items' container
    paddingTop: SPACING.L, // Add a little space at the top of the list
    paddingBottom: SPACING.XXL, // Ensure generous padding at the bottom for the fixed tab bar
  },
});

export default PostingTabContent;
