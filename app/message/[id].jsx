
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
} from "react-native";
import {
  Ionicons,
  Feather,
  MaterialIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/helpers";
import { useLocalSearchParams, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Mock database with enhanced data
const mockDatabase = {
  users: {
    1: {
      id: "1",
      name: "Andy Robertson",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      online: true,
      lastSeen: "Online",
      typing: false,
    },
    2: {
      id: "2",
      name: "Giorgio Chiellini",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      online: false,
      lastSeen: "Last seen today at 12:45 PM",
      typing: false,
    },
    3: {
      id: "3",
      name: "Alex Morgan",
      avatar: null, // Test case for missing avatar
      online: true,
      lastSeen: "Online",
      typing: false,
    },
  },
  chats: {
    1: [
      {
        id: "1",
        text: "Hello sir, Good Morning",
        time: "2023-06-15T09:30:00",
        sent: true,
        read: true,
        type: "text",
      },
      {
        id: "2",
        text: "Morning, Can i help you?",
        time: "2023-06-15T09:31:00",
        sent: false,
        read: true,
        type: "text",
      },
      {
        id: "3",
        text: "Check out these designs",
        time: "2023-06-15T09:33:00",
        sent: true,
        read: true,
        type: "image",
        uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
      },
      {
        id: "4",
        text: "Project_Requirements.pdf",
        time: "2023-06-15T09:35:00",
        sent: false,
        read: true,
        type: "file",
        fileSize: "2.4 MB",
        fileType: "PDF",
      },
    ],
    2: [], // Empty chat
    3: [
      {
        id: "1",
        text: "Hi there!",
        time: "2023-06-16T10:00:00",
        sent: true,
        read: true,
        type: "text",
      },
    ],
  },
};

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const typingTimeoutRef = useRef(null);

  // Request media and document permissions on mount
  useEffect(() => {
    (async () => {
      const [mediaStatus, documentStatus] = await Promise.all([
        ImagePicker.requestMediaLibraryPermissionsAsync(),
        ImagePicker.requestCameraPermissionsAsync(),
      ]);

      if (
        mediaStatus.status !== "granted" ||
        documentStatus.status !== "granted"
      ) {
        alert("Permission to access media library and camera is required!");
      }
    })();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Load chat data
  useEffect(() => {
    if (!id) return;

    const fetchData = () => {
      setIsLoading(true);

      // Simulate network request
      setTimeout(() => {
        const user = mockDatabase.users[id];
        const chatMessages = mockDatabase.chats[id] || [];

        setCurrentUser(user);
        setMessages(chatMessages);
        setIsLoading(false);
        animateHeader();

        // Auto-scroll to bottom when messages load
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 800);
    };

    fetchData();

    // Simulate real-time typing indicator
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7 && messages.length > 0) {
        simulateTyping();
      }
    }, 15000);

    return () => {
      clearInterval(typingInterval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      // Mark messages as read when screen is focused
      if (messages.length > 0) {
        const unreadMessages = messages.filter((msg) => !msg.read && !msg.sent);
        if (unreadMessages.length > 0) {
          const updatedMessages = messages.map((msg) =>
            !msg.read && !msg.sent ? { ...msg, read: true } : msg
          );
          setMessages(updatedMessages);
        }
      }
    }, [messages])
  );

  const animateHeader = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const simulateTyping = () => {
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000 + Math.random() * 3000);
  };

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      time: new Date().toISOString(),
      sent: true,
      read: false,
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate typing indicator before reply
    setTimeout(() => {
      setIsTyping(true);

      // Then send reply after random delay
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage = {
          id: Date.now().toString(),
          text: getRandomReply(),
          time: new Date().toISOString(),
          sent: false,
          read: true,
          type: "text",
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 1000 + Math.random() * 2000);
    }, 500 + Math.random() * 1000);
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newMessage = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          time: new Date().toISOString(),
          sent: true,
          read: false,
          type: "image",
          fileName: result.assets[0].fileName || `image_${Date.now()}.jpg`,
          fileSize: `${(result.assets[0].fileSize / (1024 * 1024)).toFixed(
            1
          )} MB`,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Simulate reply
        setTimeout(() => {
          const replyMessage = {
            id: Date.now().toString(),
            text: "Nice photo!",
            time: new Date().toISOString(),
            sent: false,
            read: true,
            type: "text",
          };
          setMessages((prev) => [...prev, replyMessage]);
        }, 2000);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        const fileSize = result.size
          ? `${(result.size / (1024 * 1024)).toFixed(1)} MB`
          : "Unknown size";
        const fileType = result.name.split(".").pop().toUpperCase() || "FILE";

        const newMessage = {
          id: Date.now().toString(),
          text: result.name,
          time: new Date().toISOString(),
          sent: true,
          read: false,
          type: "file",
          fileSize,
          fileType,
          uri: result.uri,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Simulate reply
        setTimeout(() => {
          const replyMessage = {
            id: Date.now().toString(),
            text: "Thanks for the document!",
            time: new Date().toISOString(),
            sent: false,
            read: true,
            type: "text",
          };
          setMessages((prev) => [...prev, replyMessage]);
        }, 2000);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      alert("Failed to pick document. Please try again.");
    }
  };

  const getRandomReply = () => {
    const replies = [
      "Thanks for your message!",
      "I'll get back to you soon.",
      "That's interesting, tell me more.",
      "Let me check and revert.",
      "Got it!",
      "👍",
      "I appreciate your message.",
      "Can we discuss this tomorrow?",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate fetching new messages
      if (messages.length > 0) {
        const newMessage = {
          id: Date.now().toString(),
          text: "This is a new message from refresh",
          time: new Date().toISOString(),
          sent: false,
          read: false,
          type: "text",
        };
        setMessages((prev) => [newMessage, ...prev]);
      }
      setRefreshing(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Just now";
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatHeaderDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Today";
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  const renderMessage = ({ item, index }) => {
    const isSent = item.sent;
    const prevMessage = messages[index - 1];
    const showHeader =
      index === 0 ||
      (prevMessage &&
        formatHeaderDate(prevMessage.time) !== formatHeaderDate(item.time));

    return (
      <View style={styles.messageWrapper}>
        {showHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{formatHeaderDate(item.time)}</Text>
          </View>
        )}

        <View
          style={[
            styles.messageContainer,
            isSent ? styles.sentMessage : styles.receivedMessage,
          ]}
        >
          {item.type === "file" ? (
            <TouchableOpacity
              style={styles.fileContainer}
              activeOpacity={0.8}
              onPress={() => alert(`File URI: ${item.uri}`)}
            >
              <View style={styles.fileIcon}>
                <FontAwesome
                  name={
                    item.fileType === "PDF"
                      ? "file-pdf-o"
                      : item.fileType === "DOC"
                      ? "file-word-o"
                      : item.fileType === "XLS"
                      ? "file-excel-o"
                      : "file-o"
                  }
                  size={24}
                  color={COLORS.ACCENT_ORANGE}
                />
                <Text style={styles.fileType}>{item.fileType}</Text>
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {item.text}
                </Text>
                <Text style={styles.fileSize}>{item.fileSize}</Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Feather
                  name="download"
                  size={18}
                  color={COLORS.PRIMARY_BLUE}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : item.type === "image" ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => alert(`Image URI: ${item.uri}`)}
            >
              <Image
                source={{ uri: item.uri }}
                style={styles.imageMessage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
            </TouchableOpacity>
          ) : (
            <Text
              style={[styles.messageText, isSent && styles.sentMessageText]}
            >
              {item.text}
            </Text>
          )}

          <View style={styles.messageFooter}>
            <Text
              style={[styles.messageTime, isSent && styles.sentMessageTime]}
            >
              {formatDate(item.time)}
            </Text>
            {isSent && (
              <View style={styles.statusContainer}>
                {item.read ? (
                  <Ionicons
                    name="checkmark-done"
                    size={16}
                    color={COLORS.PRIMARY_BLUE}
                  />
                ) : (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={COLORS.TEXT_LIGHT}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderUserAvatar = () => {
    if (currentUser?.avatar) {
      return (
        <Image source={{ uri: currentUser.avatar }} style={styles.userAvatar} />
      );
    }
    return (
      <View style={[styles.userAvatar, styles.avatarFallback]}>
        <Text style={styles.avatarFallbackText}>
          {currentUser?.name?.charAt(0) || "?"}
        </Text>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustrationContainer}>
        <Image
          source={require("../../assets/images/message.png")}
          style={styles.emptyIllustration}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptyText}>
        Start the conversation by sending your first message
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => inputRef.current?.focus()}
      >
        <Text style={styles.emptyButtonText}>SEND MESSAGE</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY_BLUE} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.WHITE}
        translucent={Platform.OS === "android"}
      />

      {/* Chat Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(tabs)/Message")}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => router.push(`/profile/${id}`)}
          >
            {renderUserAvatar()}
            <View style={styles.userDetails}>
              <Text style={styles.userName} numberOfLines={1}>
                {currentUser?.name}
              </Text>
              <View style={styles.statusContainer}>
                {currentUser?.online ? (
                  <>
                    <View style={styles.onlineDot} />
                    <Text style={styles.statusText}>Online</Text>
                  </>
                ) : (
                  <Text style={styles.statusText}>
                    {currentUser?.lastSeen || "Offline"}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Feather name="phone" size={20} color={COLORS.TEXT_DARK} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Feather name="video" size={20} color={COLORS.TEXT_DARK} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={COLORS.TEXT_DARK}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Message List */}
      {messages.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          inverted={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.PRIMARY_BLUE}
            />
          }
          ListFooterComponent={() => (
            <View style={styles.listFooter}>
              {isTyping && (
                <View style={styles.typingBubble}>
                  <View style={styles.typingDot} />
                  <View style={[styles.typingDot, { marginHorizontal: 4 }]} />
                  <View style={styles.typingDot} />
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <EmptyState />
      )}
      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 0}
        style={styles.inputWrapper}
      >
        <View
          style={[
            styles.inputContainer,
            {
              marginBottom:
                keyboardHeight > 0
                  ? keyboardHeight - (Platform.OS === "ios" ? 40 : 0)
                  : 0,
            },
          ]}
        >
          <View style={styles.attachmentButtonsContainer}>
            <TouchableOpacity
              style={styles.attachmentButton}
              activeOpacity={0.7}
              onPress={pickImage}
            >
              <Feather name="image" size={24} color={COLORS.TEXT_LIGHT} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.attachmentButton}
              activeOpacity={0.7}
              onPress={pickDocument}
            >
              <Feather name="paperclip" size={24} color={COLORS.TEXT_LIGHT} />
            </TouchableOpacity>
          </View>

          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="Type a message"
            placeholderTextColor={COLORS.TEXT_LIGHT}
            value={inputText}
            onChangeText={setInputText}
            multiline
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />

          {inputText.trim() === "" ? (
            <TouchableOpacity style={styles.audioButton} activeOpacity={0.7}>
              <Feather name="mic" size={24} color={COLORS.TEXT_LIGHT} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.7}
            >
              <Ionicons name="send" size={20} color={COLORS.WHITE} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
    backgroundColor: COLORS.WHITE,
    elevation: 2,
    shadowColor: COLORS.TEXT_DARK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: SPACING.XS,
    marginRight: SPACING.XS,
  },
  headerButton: {
    padding: SPACING.S,
    marginLeft: SPACING.XS,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.XXL,
    marginRight: SPACING.S,
  },
  avatarFallback: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H4,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.H4,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    maxWidth: SCREEN_WIDTH * 0.5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: BORDER_RADIUS.XXL,
    backgroundColor: COLORS.ACCENT_GREEN,
    marginRight: SPACING.XS,
  },
  statusText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_LIGHT,
  },
  listContent: {
    paddingHorizontal: SPACING.M,
    paddingTop: SPACING.M,
    paddingBottom: SPACING.XL,
  },
  listFooter: {
    height: SPACING.XL,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: SPACING.S,
  },
  messageWrapper: {
    marginBottom: SPACING.S,
  },
  dateHeader: {
    alignSelf: "center",
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.M,
    marginVertical: SPACING.M,
  },
  dateText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_LIGHT,
    fontWeight: "500",
  },
  messageContainer: {
    maxWidth: SCREEN_WIDTH * 0.8,
    borderRadius: BORDER_RADIUS.L,
    marginBottom: SPACING.XS,
    overflow: "hidden",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderTopRightRadius: 0,
    padding: SPACING.M,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 0,
    ...SHADOWS.small,
    padding: SPACING.M,
  },
  messageText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    lineHeight: 20,
  },
  sentMessageText: {
    color: COLORS.WHITE,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: SPACING.XS,
  },
  messageTime: {
    fontSize: FONT_SIZES.TINY - 1,
    color: COLORS.TEXT_LIGHT,
    marginRight: SPACING.XS,
  },
  sentMessageTime: {
    color: "rgba(255,255,255,0.7)",
  },
  statusContainer: {
    marginLeft: SPACING.XS,
  },
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.S,
    width: "100%",
  },
  fileIcon: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.S,
    alignItems: "center",
    marginRight: SPACING.S,
  },
  fileType: {
    fontSize: FONT_SIZES.TINY,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XS,
  },
  fileInfo: {
    flex: 1,
    marginRight: SPACING.S,
  },
  fileName: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    fontWeight: "500",
  },
  fileSize: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XS,
  },
  downloadButton: {
    padding: SPACING.S,
  },
  imageMessage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: BORDER_RADIUS.M,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  inputWrapper: {
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
  },
  attachmentButtonsContainer: {
    flexDirection: "row",
    marginRight: SPACING.XS,
  },
  attachmentButton: {
    padding: SPACING.S,
    marginRight: SPACING.S,
  },
  audioButton: {
    padding: SPACING.S,
    marginLeft: SPACING.XS,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: BORDER_RADIUS.XL,
    paddingHorizontal: SPACING.M,
    paddingVertical: Platform.OS === "ios" ? SPACING.S : SPACING.XS,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    maxHeight: 120,
    lineHeight: 20,
    marginHorizontal: SPACING.XS,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.XXL,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.XS,
  },
  typingBubble: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.small,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.XXL,
    backgroundColor: COLORS.TEXT_LIGHT,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
  },
  emptyIllustrationContainer: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    marginBottom: SPACING.XL,
  },
  emptyIllustration: {
    width: "100%",
    height: "100%",
  },
  emptyTitle: {
    fontSize: FONT_SIZES.H3,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
    textAlign: "center",
  },
  emptyText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT,
    textAlign: "center",
    marginBottom: SPACING.XL,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.M,
    ...SHADOWS.small,
  },
  emptyButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
  },
});

export default ChatScreen;
