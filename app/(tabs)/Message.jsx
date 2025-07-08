import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/helpers";
import { useRouter } from "expo-router";

const MessagesScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const router=useRouter();

  const [messages, setMessages] = useState([
    {
      id: "1",
      name: "Andy Robertson",
      lastMessage: "Oh yes, please send your CV/Res...",
      time: "5m ago",
      unread: 2,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      online: true,
    },
    {
      id: "2",
      name: "Giorgio Chiellini",
      lastMessage: "Hello sir, Good Morning",
      time: "30m ago",
      unread: 0,
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      online: false,
    },
    {
      id: "3",
      name: "Alex Morgan",
      lastMessage: "I saw the UI/UX Designer vacancy...",
      time: "09:30 am",
      unread: 0,
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      online: true,
    },
    {
      id: "4",
      name: "Megan Rapinoe",
      lastMessage: "I saw the UI/UX Designer vacancy...",
      time: "01:00 pm",
      unread: 0,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      online: false,
    },
    {
      id: "5",
      name: "Alessandro Bastoni",
      lastMessage: "I saw the UI/UX Designer vacancy...",
      time: "06:00 pm",
      unread: 0,
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      online: true,
    },
    {
      id: "6",
      name: "Ilkay Gundogan",
      lastMessage: "I saw the UI/UX Designer vacancy...",
      time: "Yesterday",
      unread: 0,
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      online: false,
    },
  ]);

  const filteredMessages = messages.filter((message) => {
    if (activeTab === "unread") {
      return message.unread > 0;
    }
    return (
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} activeOpacity={0.8} onPress={()=>router.push(`message/${item.id}`)}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <View style={styles.messagePreview}>
          <Text
            style={[
              styles.messageText,
              item.unread > 0 && styles.unreadMessageText,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={COLORS.TEXT_DARK}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={COLORS.TEXT_LIGHT} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages"
          placeholderTextColor={COLORS.TEXT_LIGHT}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="cancel" size={20} color={COLORS.TEXT_LIGHT} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "all" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "unread" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("unread")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "unread" && styles.activeTabText,
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <FlatList
        data={filteredMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="create-outline" size={24} color={COLORS.WHITE} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  headerTitle: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    marginHorizontal: SPACING.M,
    marginTop: SPACING.M,
    marginBottom: SPACING.S,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.S,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: SPACING.M,
    marginBottom: SPACING.S,
  },
  tabButton: {
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.M,
    marginRight: SPACING.S,
  },
  activeTabButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
  },
  tabText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    fontWeight: "600",
  },
  activeTabText: {
    color: COLORS.WHITE,
  },
  listContent: {
    paddingHorizontal: SPACING.M,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.M,
  },
  avatarContainer: {
    position: "relative",
    marginRight: SPACING.M,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.XXL,
  },
  onlineIndicator: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.XXL,
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    bottom: 0,
    right: 0,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.XS,
  },
  messageName: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
  },
  messageTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_LIGHT,
  },
  messagePreview: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageText: {
    flex: 1,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_LIGHT,
  },
  unreadMessageText: {
    color: COLORS.TEXT_DARK,
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.XXL,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.S,
  },
  unreadCount: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.TINY,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT,
  },
  fab: {
    position: "absolute",
    bottom: SPACING.XL,
    right: SPACING.XL,
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.XXL,
    backgroundColor: COLORS.PRIMARY_BLUE,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.medium,
  },
});

export default MessagesScreen;
