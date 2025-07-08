import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  FlatList, // For efficient list rendering
  Modal, // For the options menu
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

const NotificationsScreen = () => {
  const router = useRouter();

  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "application_status",
      icon: "logo-google",
      iconColor: "#4285F4", // Google Blue
      iconBg: "#E8F0FE", // Light Google Blue
      title: "Application sent",
      description:
        "Applications for Google inc have entered for company review",
      actionText: "Application details",
      time: "25 minutes",
    },
    {
      id: "2",
      type: "job_alert",
      icon: "globe-outline", // Generic globe icon for job alerts
      iconColor: "#FF7A00", // Orange
      iconBg: "#FFF0E0", // Light Orange
      title: "Your job notification",
      description:
        "Brandon, there are 10+ new jobs for UI/UX Designer in California,USA",
      actionText: "See new job",
      time: "1 Hour",
    },
    {
      id: "3",
      type: "job_recommendation",
      icon: "logo-twitter",
      iconColor: "#1DA1F2", // Twitter Blue
      iconBg: "#E0F2F7", // Light Twitter Blue
      title: "Twitter inc is looking for a UI/UX Designer.",
      description: "Check out this and 9 other job recommendations",
      actionText: "See job",
      time: "6 Hours",
    },
    {
      id: "4",
      type: "application_status",
      icon: "logo-facebook",
      iconColor: "#1877F2", // Facebook Blue
      iconBg: "#E6F2FF", // Light Facebook Blue
      title: "Application reviewed",
      description:
        "Your application for Facebook has been reviewed and moved to the next stage.",
      actionText: "Application details",
      time: "1 Day",
    },
    {
      id: "5",
      type: "job_alert",
      icon: "globe-outline",
      iconColor: COLORS.ACCENT_PURPLE,
      iconBg: COLORS.LIGHT_PURPLE,
      title: "New opportunities for you!",
      description: "Explore 5+ new openings matching your profile in New York.",
      actionText: "View all jobs",
      time: "2 Days",
    },
  ]);

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  const handleReadAll = () => {
    Alert.alert("Read All", "All notifications marked as read. (Simulated)");
    setNotifications([]);
  };

  const openOptionsModal = (id) => {
    setSelectedNotificationId(id);
    setShowOptionsModal(true);
  };

  
  const handleDeleteNotification = () => {
    if (selectedNotificationId) {
      Alert.alert(
        "Delete Notification",
        "Are you sure you want to delete this notification?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: () => {
              setNotifications((prev) =>
                prev.filter((notif) => notif.id !== selectedNotificationId)
              );
              Alert.alert("Deleted", "Notification deleted.");
            },
            style: "destructive",
          },
        ]
      );
    }
    setShowOptionsModal(false);
  };

  
  const handleTurnOffNotifications = () => {
    if (selectedNotificationId) {
      const notificationType = notifications.find(
        (n) => n.id === selectedNotificationId
      )?.type;
      Alert.alert(
        "Turn Off",
        `Notifications for "${notificationType}" turned off. (Simulated)`
      );
    }
    setShowOptionsModal(false);
  };

 
  const handleGoToSettings = () => {
    setShowOptionsModal(false);
    router.push("Profile/Settings");
  };

  
  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.cardIconContainer(item.iconBg)}>
        <Ionicons
          name={item.icon}
          size={FONT_SIZES.H2}
          color={item.iconColor}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => openOptionsModal(item.id)}>
            <Ionicons
              name="ellipsis-vertical"
              size={FONT_SIZES.H2}
              color={COLORS.TEXT_GRAY}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.cardActionButton} onPress={()=>router.push("apply/Application")}>
          <Text style={styles.cardActionButtonText}>{item.actionText}</Text>
        </TouchableOpacity>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleReadAll}>
          <Text style={styles.readAllText}>Read all</Text>
        </TouchableOpacity>
      </View>
      {/* Notification List or Empty State */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.notificationListContent}
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIllustration}>
            
            <Ionicons
              name="notifications-off-outline"
              size={FONT_SIZES.H1 * 3}
              color={COLORS.TEXT_GRAY}
            />
            <View
              style={[
                styles.abstractShape,
                {
                  backgroundColor: "#FFD700",
                  top: 20,
                  left: -10,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                },
              ]}
            />
            <View
              style={[
                styles.abstractShape,
                {
                  backgroundColor: "#8A2BE2",
                  bottom: 10,
                  right: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                },
              ]}
            />
            <View
              style={[
                styles.abstractShape,
                {
                  backgroundColor: "#4A80F0",
                  top: 50,
                  right: -20,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                },
              ]}
            />
          </View>
          <Text style={styles.emptyStateTitle}>No notifications</Text>
          <Text style={styles.emptyStateMessage}>
            You have no notifications at this time{"\n"}thank you
          </Text>
        </View>
      )}
      {/* Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptionsModal}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowOptionsModal(false)}
        >
          <View style={styles.optionsModalContent}>
            <View style={styles.modalHandle} /> 
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleDeleteNotification}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleTurnOffNotifications}
            >
              <Ionicons
                name="notifications-off-outline"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.optionText}>Turn off notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionItem, styles.optionItemLast]}
              onPress={handleGoToSettings}
            >
              <Ionicons
                name="settings-outline"
                size={FONT_SIZES.BODY_LARGE}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.optionText}>Setting</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  readAllText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY_BLUE,
    fontWeight: "600",
  },
  notificationListContent: {
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.L,
    paddingBottom: SPACING.XXL,
  },
  notificationCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    marginBottom: SPACING.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
    flexDirection: "row",
    alignItems: "flex-start", // Align icon and content at the top
  },
  cardIconContainer: (bgColor) => ({
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.M,
    backgroundColor: bgColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.M,
    marginTop: SPACING.XS, // Align with text baseline
  }),
  cardContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.XXS,
  },
  cardTitle: {
    flex: 1, // Allow title to wrap
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
  },
  cardDescription: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    marginBottom: SPACING.S,
  },
  cardActionButton: {
    backgroundColor: COLORS.PRIMARY_BLUE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    alignSelf: "flex-start", // Button only takes necessary width
    marginBottom: SPACING.S,
  },
  cardActionButtonText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontWeight: "600",
  },
  cardTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_LIGHT,
    textAlign: "right",
  },
  // --- Empty State Styles ---
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    paddingVertical: SPACING.XXL * 2,
  },
  emptyStateIllustration: {
    position: "relative",
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.L,
  },
  abstractShape: {
    position: "absolute",
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    lineHeight: FONT_SIZES.BODY * 1.5,
  },
  // --- Options Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // Modal slides up from bottom
  },
  optionsModalContent: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.L,
    borderTopRightRadius: BORDER_RADIUS.L,
    padding: SPACING.L,
    width: "100%",
    ...SHADOWS.large,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.TEXT_GRAY,
    borderRadius: BORDER_RADIUS.S,
    alignSelf: "center",
    marginBottom: SPACING.L,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR_LIGHT,
  },
  optionItemLast: {
    borderBottomWidth: 0, // No border for the last item
  },
  optionText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    marginLeft: SPACING.M,
  },
});

export default NotificationsScreen;
