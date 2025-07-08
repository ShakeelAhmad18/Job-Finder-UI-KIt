// app/AddPost/CreatePost.js
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../../constants/helpers";

const { width } = Dimensions.get("window");

// Dummy user data for display
const currentUser = {
  profilePic: require("../../assets/images/profile.png"),
  name: "Orlando Diggs",
  location: "California, USA",
};

// --- Custom Modal Component ---
const CustomModal = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={modalStyles.centeredView} onPress={onClose}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>{title}</Text>
          <Text style={modalStyles.modalMessage}>{message}</Text>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: SPACING.L,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.XXL,
    alignItems: "center",
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
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

// --- Hashtag Input Modal Component ---
const HashtagInputModal = ({ visible, onClose, onSave, initialHashtags }) => {
  const [tempHashtags, setTempHashtags] = useState(initialHashtags || []);
  const [currentHashtagInput, setCurrentHashtagInput] = useState("");

  useEffect(() => {
    if (visible) {
      setTempHashtags(initialHashtags || []);
      setCurrentHashtagInput("");
    }
  }, [visible, initialHashtags]);

  const addHashtag = useCallback(() => {
    const trimmedTag = currentHashtagInput.trim();
    if (trimmedTag && !tempHashtags.includes(trimmedTag)) {
      setTempHashtags((prev) => [...prev, trimmedTag]);
      setCurrentHashtagInput("");
    }
  }, [currentHashtagInput, tempHashtags]);

  const removeHashtag = useCallback((tagToRemove) => {
    setTempHashtags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleSave = useCallback(() => {
    onSave(tempHashtags);
    onClose();
  }, [tempHashtags, onSave, onClose]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={hashtagModalStyles.keyboardAvoidingView}
      >
        <Pressable style={hashtagModalStyles.centeredView} onPress={onClose}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={hashtagModalStyles.modalView}>
              <Text style={hashtagModalStyles.modalTitle}>Add Hashtags</Text>

              <View style={hashtagModalStyles.inputContainer}>
                <TextInput
                  style={hashtagModalStyles.hashtagInput}
                  placeholder="Enter hashtag (e.g., #jobs)"
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  value={currentHashtagInput}
                  onChangeText={setCurrentHashtagInput}
                  onSubmitEditing={addHashtag}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={hashtagModalStyles.addButton}
                  onPress={addHashtag}
                  disabled={!currentHashtagInput.trim()}
                >
                  <Ionicons name="add" size={24} color={COLORS.WHITE} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={hashtagModalStyles.hashtagsScrollView}
                contentContainerStyle={
                  hashtagModalStyles.hashtagsContentContainer
                }
              >
                {tempHashtags.length === 0 ? (
                  <Text style={hashtagModalStyles.noHashtagsText}>
                    No hashtags added yet.
                  </Text>
                ) : (
                  tempHashtags.map((tag, index) => (
                    <View key={index} style={hashtagModalStyles.hashtagChip}>
                      <Text style={hashtagModalStyles.hashtagText}>#{tag}</Text>
                      <TouchableOpacity
                        onPress={() => removeHashtag(tag)}
                        style={hashtagModalStyles.removeHashtagButton}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={COLORS.TEXT_DARK}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>

              <View style={hashtagModalStyles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    hashtagModalStyles.button,
                    hashtagModalStyles.cancelButton,
                  ]}
                  onPress={onClose}
                >
                  <Text style={hashtagModalStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    hashtagModalStyles.button,
                    hashtagModalStyles.saveButton,
                  ]}
                  onPress={handleSave}
                >
                  <Text style={hashtagModalStyles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const hashtagModalStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.L,
    borderTopRightRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    paddingBottom: SPACING.XXL,
    alignItems: "center",
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: -2 },
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: SPACING.M,
  },
  hashtagInput: {
    flex: 1,
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.S,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    marginRight: SPACING.S,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.XS,
    justifyContent: "center",
    alignItems: "center",
  },
  hashtagsScrollView: {
    maxHeight: 150,
    width: "100%",
    marginBottom: SPACING.L,
  },
  hashtagsContentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  hashtagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.LIGHT_PURPLE,
    borderRadius: BORDER_RADIUS.S,
    paddingVertical: SPACING.XXS,
    paddingHorizontal: SPACING.XS,
    margin: SPACING.XXS,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  hashtagText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.ACCENT_PURPLE,
    fontWeight: "600",
    marginRight: SPACING.XXS,
  },
  removeHashtagButton: {
    padding: SPACING.XXS,
  },
  noHashtagsText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    width: "100%",
    marginTop: SPACING.M,
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
  saveButton: {
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

// --- Main CreatePost Component ---
const CreatePost = () => {
  const router = useRouter();
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [hashtagModalVisible, setHashtagModalVisible] = useState(false);

  const showModal = useCallback((title, message) => {
    setModalContent({ title, message });
    setModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Fixed media picking functions
  const pickMedia = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showModal(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Fixed: Use MediaTypeOptions
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedMedia((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      console.error("Error picking media:", error);
      showModal("Error", `Failed to pick media: ${error.message}`);
    }
  }, [showModal]);

  const takePhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        showModal(
          "Permission Denied",
          "Sorry, we need camera permissions to make this work!"
        );
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Fixed: Use MediaTypeOptions
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedMedia((prev) => [...prev, result.assets[0]]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      showModal("Error", `Failed to take photo: ${error.message}`);
    }
  }, [showModal]);

  const removeMedia = useCallback((uriToRemove) => {
    setSelectedMedia((prev) =>
      prev.filter((media) => media.uri !== uriToRemove)
    );
  }, []);

  const handleSubmitPost = useCallback(async () => {
    if (
      !postTitle.trim() &&
      !postDescription.trim() &&
      selectedMedia.length === 0
    ) {
      showModal(
        "Empty Post",
        "Please add a title, description, or media to your post."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      showModal("Success", "Your post has been published!");
      setPostTitle("");
      setPostDescription("");
      setSelectedMedia([]);
      setHashtags([]);
      router.back();
    } catch (error) {
      console.error("Post submission failed:", error);
      showModal("Error", "Failed to publish post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [postTitle, postDescription, selectedMedia, hashtags, showModal, router]);

  const isPostButtonEnabled =
    postTitle.trim().length > 0 ||
    postDescription.trim().length > 0 ||
    selectedMedia.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Post</Text>
        <TouchableOpacity
          style={[
            styles.postButtonHeader,
            !isPostButtonEnabled && styles.postButtonDisabled,
          ]}
          onPress={handleSubmitPost}
          disabled={!isPostButtonEnabled || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.WHITE} size="small" />
          ) : (
            <Text style={styles.postButtonHeaderText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
      >
        <ScrollView contentContainerStyle={styles.formScrollViewContent}>
          {/* User Info Section */}
          <View style={styles.userInfoContainer}>
            <Image source={currentUser.profilePic} style={styles.profilePic} />
            <View>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userLocation}>{currentUser.location}</Text>
            </View>
          </View>

          {/* Post Title Input */}
          <Text style={styles.inputLabel}>Post title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Write the title of your post here"
            placeholderTextColor={COLORS.TEXT_GRAY}
            value={postTitle}
            onChangeText={setPostTitle}
            maxLength={100}
          />

          {/* Description Input */}
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="What do you want to talk about?"
            placeholderTextColor={COLORS.TEXT_GRAY}
            multiline
            value={postDescription}
            onChangeText={setPostDescription}
            textAlignVertical="top"
            maxLength={1000}
          />

          {/* Selected Media Preview */}
          {selectedMedia.length > 0 && (
            <View style={styles.mediaPreviewSection}>
              <Text style={styles.inputLabel}>Attached Media</Text>
              <FlatList
                data={selectedMedia}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.uri}
                renderItem={({ item }) => (
                  <View style={styles.mediaItemContainer}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.mediaPreviewItem}
                    />
                    <TouchableOpacity
                      onPress={() => removeMedia(item.uri)}
                      style={styles.removeMediaButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={24}
                        color={COLORS.TEXT_DARK}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                ListFooterComponent={() => (
                  <TouchableOpacity
                    onPress={pickMedia}
                    style={styles.addMoreMediaButton}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={40}
                      color={COLORS.PRIMARY_BLUE}
                    />
                    <Text style={styles.addMoreMediaText}>Add More</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Hashtags Display */}
          {hashtags.length > 0 && (
            <View style={styles.hashtagsDisplayContainer}>
              <Text style={styles.inputLabel}>Current Hashtags</Text>
              <View style={styles.hashtagsList}>
                {hashtags.map((tag, index) => (
                  <View key={index} style={styles.hashtagChipDisplay}>
                    <Text style={styles.hashtagTextDisplay}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <View style={styles.mediaButtons}>
          <TouchableOpacity onPress={takePhoto} style={styles.mediaButton}>
            <Ionicons
              name="camera-outline"
              size={28}
              color={COLORS.TEXT_DARK}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickMedia} style={styles.mediaButton}>
            <Ionicons name="image-outline" size={28} color={COLORS.TEXT_DARK} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setHashtagModalVisible(true)}>
          <Text style={styles.addHashtagText}>Add hashtag</Text>
        </TouchableOpacity>
      </View>

      {/* Custom Modal for general alerts */}
      <CustomModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onClose={hideModal}
      />

      {/* Hashtag Input Modal */}
      <HashtagInputModal
        visible={hashtagModalVisible}
        onClose={() => setHashtagModalVisible(false)}
        onSave={setHashtags}
        initialHashtags={hashtags}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  postButtonHeader: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  postButtonDisabled: {
    backgroundColor: COLORS.TEXT_GRAY,
  },
  postButtonHeaderText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formScrollViewContent: {
    flexGrow: 1,
    padding: SPACING.L,
    paddingBottom: SPACING.XXL,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.L,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.M,
  },
  userName: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  userLocation: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  inputLabel: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
    marginTop: SPACING.M,
  },
  titleInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  descriptionInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    minHeight: 150,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mediaPreviewSection: {
    marginTop: SPACING.L,
    marginBottom: SPACING.M,
  },
  mediaItemContainer: {
    width: width * 0.3,
    height: width * 0.3,
    marginRight: SPACING.S,
    borderRadius: BORDER_RADIUS.M,
    overflow: "hidden",
    position: "relative",
    backgroundColor: COLORS.LIGHT_BLUE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  mediaPreviewItem: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeMediaButton: {
    position: "absolute",
    top: SPACING.XXS,
    right: SPACING.XXS,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.XXS / 2,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addMoreMediaButton: {
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    borderWidth: 2,
    borderColor: COLORS.BORDER_LIGHT,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.S,
  },
  addMoreMediaText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY_BLUE,
    marginTop: SPACING.XXS,
  },
  bottomActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  mediaButtons: {
    flexDirection: "row",
  },
  mediaButton: {
    padding: SPACING.S,
    marginRight: SPACING.S,
    backgroundColor: COLORS.LIGHT_PURPLE,
    borderRadius: BORDER_RADIUS.M,
    shadowColor: COLORS.SHADOW,
    marginBottom:2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  addHashtagText: {
    color: COLORS.PRIMARY_BLUE,
    fontSize: FONT_SIZES.BODY,
    marginBottom:14,
    fontWeight: "600",
  },
  hashtagsDisplayContainer: {
    marginTop: SPACING.L,
    marginBottom: SPACING.M,
  },
  hashtagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.S,
  },
  hashtagChipDisplay: {
    backgroundColor: COLORS.LIGHT_BLUE,
    borderRadius: BORDER_RADIUS.S,
    paddingVertical: SPACING.XXS,
    paddingHorizontal: SPACING.XS,
    marginRight: SPACING.XS,
    marginBottom: SPACING.XS,
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  hashtagTextDisplay: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "600",
  },
});

export default CreatePost;
