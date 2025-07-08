import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  FlatList, // For efficient message rendering
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // For image selection
import * as FileSystem from "expo-file-system"; // For base64 conversion

import { generateAIResponse } from "../../lib/GeminiAPI"; // Import Gemini API function

// --- Constants (re-using from previous responses for consistency) ---
export const COLORS = {
  BACKGROUND: "#F8F8F8",
  WHITE: "#FFFFFF",
  TEXT_DARK: "#0D0140",
  TEXT_GRAY: "#8E8E93",
  PRIMARY_BLUE: "#4A80F0",
  PRIMARY_DARK_BLUE: "#130160",
  ACCENT_PURPLE: "#8A2BE2",
  ACCENT_ORANGE: "#FF7A00",
  LIGHT_BLUE: "#E0F2F7",
  LIGHT_PURPLE: "#E6E6FA",
  LIGHT_ORANGE: "#FFF0E0",
  SHADOW: "rgba(0, 0, 0, 0.08)",
  BORDER_LIGHT: "#E0E0E0",

  FILTER_ICON_BG: "#E6E6FA",
  FILTER_ICON_COLOR: "#0D0140",
  CHIP_ACTIVE_BG: "#FF7A00",
  BACKGROUND_LIGHT: "#F5F7FA",
  TEXT_LIGHT: "#A0A4A8",
  PRIMARY: "#130160",
  BORDER_COLOR_LIGHT: "#E0E4E8",

  CHIP_ACTIVE_TEXT: "#FFFFFF",
  CHIP_INACTIVE_BG: "#FFFFFF",
  CHIP_INACTIVE_TEXT: "#0D0140",
};

export const FONT_SIZES = {
  H1: 24,
  H2: 18,
  BODY_LARGE: 16,
  BODY: 14,
  SMALL: 12,
  TINY: 10,
};

export const BORDER_RADIUS = {
  S: 4,
  M: 8,
  L: 16,
  XL: 24,
  XXL: 30,
};

export const SPACING = {
  XXS: 4,
  XS: 8,
  S: 12,
  M: 16,
  L: 20,
  XL: 24,
  XXL: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};
// --- End of Constants ---

const ChatScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // URI of the selected image
  const [isSending, setIsSending] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);

  // Using a static user ID since Firebase is not used for authentication
  const userId = "local_user_123";

  const flatListRef = useRef(null); // Ref for FlatList to scroll to bottom

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  /**
   * Handles sending a message (text and/or image) and triggering AI response.
   */
  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isSending) {
      return; // Prevent sending empty messages or multiple sends
    }

    setIsSending(true);
    const messageToSend = inputText.trim();
    setInputText(""); // Clear input immediately

    let imageUriForDisplay = selectedImage; // Store URI for local display
    let base64Image = null;

    // Add user message to local state immediately for real-time feel
    const newUserMessage = {
      _id: Date.now().toString() + Math.random().toString(), // Unique ID
      text: messageToSend,
      createdAt: new Date(),
      user: { _id: userId, name: "You" },
      type: "user",
      image: imageUriForDisplay, // Include image URI for display
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setSelectedImage(null); // Clear selected image after adding to messages

    try {
      // Convert image to base64 for Gemini Vision API if selected
      if (imageUriForDisplay) {
        base64Image = await FileSystem.readAsStringAsync(imageUriForDisplay, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // 1. Trigger AI Response
      setIsAITyping(true);
      let aiPrompt = messageToSend;
      let aiImage = imageUriForDisplay
        ? { mimeType: "image/jpeg", data: base64Image }
        : null; // Prepare image for Gemini

      if (!aiPrompt && aiImage) {
        aiPrompt = "Describe this image."; // Default prompt if only image is sent
      }

      // Simulate network delay for AI response
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 second delay

      const aiResponseText = await generateAIResponse(aiPrompt, aiImage); // Pass image data to Gemini API

      const aiMessage = {
        _id: Date.now().toString() + Math.random().toString(), // Unique ID
        text: aiResponseText,
        createdAt: new Date(),
        user: { _id: "gemini_ai", name: "JobSport AI" },
        type: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message or getting AI response:", error);
      Alert.alert("Error", "Failed to get AI response. Please try again.");
      // Optionally add an error message bubble
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: Date.now().toString() + Math.random().toString(),
          text: "Sorry, I couldn't process that. Please try again.",
          createdAt: new Date(),
          user: { _id: "gemini_ai", name: "JobSport AI" },
          type: "ai",
        },
      ]);
    } finally {
      setIsSending(false);
      setIsAITyping(false);
    }
  };

  /**
   * Handles image selection from device gallery.
   */
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant media library permissions to upload images."
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7, // Reduce quality for faster processing
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Image Error", "Failed to pick image.");
    }
  };

  /**
   * Renders a single message bubble.
   */
  const renderMessage = ({ item }) => {
    const isMyMessage = item.user._id === userId;
    const isAIMessage = item.user._id === "gemini_ai";

    return (
      <View
        style={[
          styles.messageBubbleContainer,
          isMyMessage
            ? styles.myMessageContainer
            : styles.otherMessageContainer,
          isAIMessage && styles.aiMessageContainer, // Apply AI specific styles
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
            isAIMessage && styles.aiMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageSenderName,
              isMyMessage
                ? styles.myMessageSenderName
                : styles.otherMessageSenderName,
              isAIMessage && styles.aiMessageSenderName,
            ]}
          >
            {item.user.name}
          </Text>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.messageImage} />
          )}
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
              isAIMessage && styles.aiMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
              isAIMessage && styles.aiMessageTime,
            ]}
          >
            {item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={
        Platform.OS === "ios" ? insets.top + SPACING.XXL : 0
      }
    >
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconContainer}
        >
          <Ionicons
            name="arrow-back"
            size={FONT_SIZES.H2}
            color={COLORS.TEXT_DARK}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>JobSpot AI Chat</Text>
        <View style={styles.headerIconContainer} />
        {/* Placeholder for spacing */}
      </View>
      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      {/* AI Typing Indicator */}
      {isAITyping && (
        <View style={styles.aiTypingIndicator}>
          <ActivityIndicator size="small" color={COLORS.TEXT_GRAY} />
          <Text style={styles.aiTypingText}>JobSpot AI is typing...</Text>
        </View>
      )}
      {/* Image Preview */}
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={styles.removeImageButton}
          >
            <Ionicons
              name="close-circle"
              size={FONT_SIZES.H2}
              color={COLORS.TEXT_DARK}
            />
          </TouchableOpacity>
        </View>
      )}
      {/* Message Input Area */}
      <View style={styles.inputAreaContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
          <MaterialIcons
            name="image"
            size={FONT_SIZES.H2}
            color={COLORS.TEXT_GRAY}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.TEXT_GRAY}
          value={inputText}
          onChangeText={setInputText}
          multiline={true}
          maxHeight={100} 
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={isSending || (!inputText.trim() && !selectedImage)}
        >
          {isSending ? (
            <ActivityIndicator size="small" color={COLORS.WHITE} />
          ) : (
            <Ionicons name="send" size={FONT_SIZES.H2} color={COLORS.WHITE} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.M,
    backgroundColor: COLORS.WHITE,
    ...SHADOWS.small,
    zIndex: 10,
    borderBottomLeftRadius: BORDER_RADIUS.M,
    borderBottomRightRadius: BORDER_RADIUS.M,
  },
  headerIconContainer: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  loadingChatContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingChatText: {
    marginTop: SPACING.M,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_GRAY,
  },
  messageListContent: {
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.S,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    marginBottom: SPACING.S,
  },
  myMessageContainer: {
    justifyContent: "flex-end",
  },
  otherMessageContainer: {
    justifyContent: "flex-start",
  },
  aiMessageContainer: {
    justifyContent: "flex-start", // AI messages also on the left
  },
  messageBubble: {
    maxWidth: "80%",
    padding: SPACING.S,
    borderRadius: BORDER_RADIUS.L,
    ...SHADOWS.small,
  },
  myMessageBubble: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderBottomRightRadius: BORDER_RADIUS.S, // Pointed corner for sender
  },
  otherMessageBubble: {
    backgroundColor: COLORS.WHITE,
    borderBottomLeftRadius: BORDER_RADIUS.S, // Pointed corner for receiver
  },
  aiMessageBubble: {
    backgroundColor: COLORS.LIGHT_PURPLE, // Distinct color for AI
    borderBottomLeftRadius: BORDER_RADIUS.S,
  },
  messageSenderName: {
    fontSize: FONT_SIZES.TINY,
    fontWeight: "bold",
    marginBottom: SPACING.XXS,
  },
  myMessageSenderName: {
    color: COLORS.WHITE,
    textAlign: "right",
  },
  otherMessageSenderName: {
    color: COLORS.TEXT_DARK,
    textAlign: "left",
  },
  aiMessageSenderName: {
    color: COLORS.PRIMARY_DARK_BLUE,
    textAlign: "left",
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.M,
    marginBottom: SPACING.XS,
    resizeMode: "cover",
  },
  messageText: {
    fontSize: FONT_SIZES.BODY,
    lineHeight: FONT_SIZES.BODY * 1.4,
  },
  myMessageText: {
    color: COLORS.WHITE,
  },
  otherMessageText: {
    color: COLORS.TEXT_DARK,
  },
  aiMessageText: {
    color: COLORS.TEXT_DARK,
  },
  messageTime: {
    fontSize: FONT_SIZES.TINY,
    color: "rgba(255,255,255,0.7)",
    marginTop: SPACING.XXS,
    textAlign: "right",
  },
  myMessageTime: {
    color: "rgba(255,255,255,0.7)",
  },
  otherMessageTime: {
    color: COLORS.TEXT_GRAY,
    textAlign: "left",
  },
  aiMessageTime: {
    color: COLORS.TEXT_GRAY,
    textAlign: "left",
  },
  aiTypingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    marginHorizontal: SPACING.M,
    marginBottom: SPACING.S,
    alignSelf: "flex-start",
    ...SHADOWS.small,
  },
  aiTypingText: {
    marginLeft: SPACING.XS,
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  imagePreviewContainer: {
    marginHorizontal: SPACING.M,
    marginBottom: SPACING.S,
    alignSelf: "flex-start", // Align left like other messages
    position: "relative",
  },
  imagePreview: {
    width: 150,
    height: 100,
    borderRadius: BORDER_RADIUS.M,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  removeImageButton: {
    position: "absolute",
    top: -SPACING.XS,
    right: -SPACING.XS,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.XXS,
  },
  inputAreaContainer: {
    flexDirection: "row",
    alignItems: "flex-end", // Align items to the bottom
    paddingHorizontal: SPACING.S,
    paddingVertical: SPACING.S,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
    ...SHADOWS.small, // Subtle shadow for input area
  },
  attachButton: {
    padding: SPACING.S,
    marginBottom: SPACING.XXS, // Align with text input baseline
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: BORDER_RADIUS.L,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    marginHorizontal: SPACING.XS,
    minHeight: 40, // Minimum height for input
    maxHeight: 120, // Max height before becoming scrollable
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.XXL, // Circular button
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.XS,
    marginBottom: SPACING.XXS, // Align with text input baseline
    ...SHADOWS.medium,
  },
});

export default ChatScreen;
