import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput, // Import TextInput for comment input
  KeyboardAvoidingView, // For keyboard handling in modal
  Platform, // To check platform for KeyboardAvoidingView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../../constants/helpers";

// Custom Modal Component for general alerts
const CustomModal = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>{title}</Text>
            <Text style={modalStyles.modalMessage}>{message}</Text>
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
              <Text style={modalStyles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// New Comment Modal Component
const CommentModal = ({ visible, onClose, onSendComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleSend = useCallback(() => {
    if (commentText.trim()) {
      onSendComment(commentText.trim());
      setCommentText(""); // Clear input after sending
      onClose(); // Close modal
    }
  }, [commentText, onSendComment, onClose]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={commentModalStyles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={commentModalStyles.centeredView}>
            {/* Added onPress={() => {}} to prevent warnings and potential issues */}
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={commentModalStyles.modalView}>
                <Text style={commentModalStyles.modalTitle}>Add a Comment</Text>
                <TextInput
                  style={commentModalStyles.commentInput}
                  placeholder="Write your comment here..."
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  multiline
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <View style={commentModalStyles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      commentModalStyles.button,
                      commentModalStyles.cancelButton,
                    ]}
                    onPress={onClose}
                  >
                    <Text style={commentModalStyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      commentModalStyles.button,
                      commentModalStyles.sendButton,
                    ]}
                    onPress={handleSend}
                    disabled={!commentText.trim()} // Disable send if text is empty
                  >
                    <Text style={commentModalStyles.buttonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  modalView: {
    margin: SPACING.L,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.XXL,
    alignItems: "center",
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    marginBottom: SPACING.S,
    color: COLORS.TEXT_DARK,
  },
  modalMessage: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    marginBottom: SPACING.L,
  },
  closeButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.L,
    elevation: 2,
  },
  closeButtonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: FONT_SIZES.BODY,
  },
});

const commentModalStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end", // Align to bottom for keyboard
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%", // Take full width
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.L,
    borderTopRightRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    paddingBottom: SPACING.XXL, // Extra padding for bottom
    alignItems: "center",
    shadowColor: COLORS.SHADOW,
    shadowOffset: {
      width: 0,
      height: -2, // Shadow upwards
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    marginBottom: SPACING.L,
    color: COLORS.TEXT_DARK,
  },
  commentInput: {
    width: "100%",
    minHeight: 80,
    maxHeight: 150, // Limit height to prevent excessive scrolling
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.S,
    paddingTop: SPACING.S, // Ensure text starts from top
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.L,
    textAlignVertical: "top", // For Android to start text from top
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.S,
    borderRadius: BORDER_RADIUS.M,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SPACING.XS,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
  },
  cancelButton: {
    backgroundColor: COLORS.TEXT_GRAY,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: FONT_SIZES.BODY,
  },
});

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // For general alerts
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [commentModalVisible, setCommentModalVisible] = useState(false); // For comment input
  const [showFullContent, setShowFullContent] = useState(false); // For "Read more"

  // Function to show the custom general alert modal
  const showModal = useCallback((title, message) => {
    setModalContent({ title, message });
    setModalVisible(true);
  }, []);

  // Function to hide the custom general alert modal
  const hideModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleLikePress = useCallback(() => {
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
  }, [isLiked]);

  const handleCommentPress = useCallback(() => {
    setCommentModalVisible(true); // Open the comment input modal
  }, []);

  const handleSendComment = useCallback(
    (comment) => {
      // Here you would typically send the comment to a backend or update state
      console.log("Comment sent:", comment);
      // For demonstration, show a success modal
      showModal("Comment Sent!", "Your comment has been successfully posted.");
      // You might also want to update the post.comments count here if it's dynamic
    },
    [showModal]
  );

  const handleSharePress = useCallback(async () => {
   
  });

  // Determine content to display based on showFullContent state
  const displayedContent =
    post.hasReadMore && !showFullContent
      ? `${post.content.substring(0, 150)}...` // Truncate content
      : post.content;

  return (
    <View style={styles.card}>
      {/* User Info Section */}
      <View style={styles.userInfo}>
        <Image source={post.userProfilePic} style={styles.profilePic} />
        <View style={styles.textInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <View style={styles.timeAgoContainer}>
            <Ionicons
              name="time-outline"
              size={FONT_SIZES.SMALL}
              color={COLORS.TEXT_GRAY}
            />
            <Text style={styles.timeAgo}>{post.timeAgo}</Text>
          </View>
        </View>
      </View>
      {/* Post Content Section */}
      <View style={styles.postContent}>
        {post.question && <Text style={styles.question}>{post.question}</Text>}
        <Text style={styles.content}>
          {displayedContent}
          {post.hasReadMore && (
            <Text
              style={styles.readMoreText}
              onPress={() => setShowFullContent((prev) => !prev)} // Toggle full content
            >
              {" "}
              {showFullContent ? "Read less" : "Read more"}
            </Text>
          )}
        </Text>
      </View>

      {/* Actions Container (Like, Comment, Share) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLikePress}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? COLORS.LIKE_COLOR : COLORS.ICON_COLOR_LIGHT}
          />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCommentPress}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={COLORS.ICON_COLOR_LIGHT}
          />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSharePress}
        >
          <Ionicons
            name="share-social-outline"
            size={20}
            color={COLORS.ICON_COLOR_LIGHT}
          />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>

      {/* Custom General Alert Modal */}
      <CustomModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onClose={hideModal}
      />

      {/* Comment Input Modal */}
      <CommentModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        onSendComment={handleSendComment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginHorizontal: SPACING.M,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.M,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  textInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS,
  },
  timeAgoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeAgo: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    marginLeft: SPACING.XS / 2,
  },
  postContent: {
    marginBottom: SPACING.L,
  },
  question: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
    lineHeight: FONT_SIZES.MEDIUM * 1.3,
  },
  content: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    lineHeight: FONT_SIZES.BODY * 1.6,
  },
  readMoreText: {
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.LIGHT_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.XS,
    marginTop: SPACING.S,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.S,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.S,
  },
  actionText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_DARK,
    marginLeft: SPACING.XS,
    fontWeight: "600",
  },
});

export default PostCard;
