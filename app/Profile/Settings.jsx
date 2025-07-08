import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Switch, // For toggles like Notifications and Dark Mode
  Modal, // For logout confirmation and password update modals
  TextInput, // For password fields
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useClerk } from "@clerk/clerk-expo"; // Import useClerk for logout

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

const SettingsScreen = () => {
  const router = useRouter();
  const { signOut } = useClerk(); 

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  
  const handleLogout = async () => {
    setShowLogoutConfirmModal(true); 
  };

  
  const confirmLogout = async () => {
    setShowLogoutConfirmModal(false); 
    try {
      await signOut();
      router.replace("/(auth)/sign-in"); 
    } catch (err) {
      Alert.alert("Logout Error", "Failed to logout. Please try again.");
      console.error("Logout error:", err);
    }
  };

 
  const handleSaveSettings = () => {
    console.log("Saving Settings:", {
      notificationsEnabled,
      darkModeEnabled,
    });
    Alert.alert("Success", "Settings saved successfully!");
  };

 
  const handleUpdatePassword = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Error", "All password fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }

    Alert.alert("Success", "Password updated successfully!");
    setShowUpdatePasswordModal(false); 
    setOldPassword(""); 
    setNewPassword("");
    setConfirmNewPassword("");
  };

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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerIconContainer} />
        {/* Placeholder for spacing */}
      </View>
      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Options */}
        <View style={styles.settingsGroup}>
          {/* Notifications Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconText}>
              <Ionicons
                name="notifications-outline"
                size={FONT_SIZES.H2}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{
                false: COLORS.TEXT_LIGHT,
                true: COLORS.PRIMARY_BLUE,
              }}
              thumbColor={COLORS.WHITE}
              ios_backgroundColor={COLORS.TEXT_LIGHT}
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>
          {/* Dark Mode Toggle */}
          <View style={styles.settingItem}>
            <View style={styles.settingIconText}>
              <Ionicons
                name="moon-outline"
                size={FONT_SIZES.H2}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.settingText}>Dark mode</Text>
            </View>
            <Switch
              trackColor={{
                false: COLORS.TEXT_LIGHT,
                true: COLORS.PRIMARY_BLUE,
              }}
              thumbColor={COLORS.WHITE}
              ios_backgroundColor={COLORS.TEXT_LIGHT}
              onValueChange={setDarkModeEnabled}
              value={darkModeEnabled}
            />
          </View>
          {/* Password Link */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowUpdatePasswordModal(true)}
          >
            <View style={styles.settingIconText}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={FONT_SIZES.H2}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.settingText}>Password</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={FONT_SIZES.H2}
              color={COLORS.TEXT_GRAY}
            />
          </TouchableOpacity>
          {/* Logout Link */}
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingIconText}>
              <MaterialCommunityIcons
                name="logout"
                size={FONT_SIZES.H2}
                color={COLORS.TEXT_DARK}
              />
              <Text style={styles.settingText}>Logout</Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={FONT_SIZES.H2}
              color={COLORS.TEXT_GRAY}
            />
          </TouchableOpacity>
        </View>
        {/* Spacer to push the button to the bottom */}
        <View style={{ flex: 1 }} />
      </ScrollView>
      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>SAVE</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutConfirmModal}
        onRequestClose={() => setShowLogoutConfirmModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowLogoutConfirmModal(false)}
        >
          <View style={styles.logoutModalContent}>
            <View style={styles.modalHandle} /> 
            <Text style={styles.logoutModalTitle}>Log out</Text>
            <Text style={styles.logoutModalMessage}>
              Are you sure you want to leave?
            </Text>
            <TouchableOpacity
              style={styles.logoutModalButtonYes}
              onPress={confirmLogout}
            >
              <Text style={styles.logoutModalButtonText}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutModalButtonCancel}
              onPress={() => setShowLogoutConfirmModal(false)}
            >
              <Text style={styles.logoutModalButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showUpdatePasswordModal}
        onRequestClose={() => setShowUpdatePasswordModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowUpdatePasswordModal(false)}
        >
          <View style={styles.updatePasswordModalContent}>
            <View style={styles.modalHandle} /> 
            <Text style={styles.updatePasswordModalTitle}>Update Password</Text>
            {/* Old Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Old Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••••••"
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  secureTextEntry={!showOldPassword}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowOldPassword(!showOldPassword)}
                  style={styles.passwordToggleIcon}
                >
                  <Ionicons
                    name={showOldPassword ? "eye-off-outline" : "eye-outline"}
                    size={FONT_SIZES.BODY_LARGE}
                    color={COLORS.TEXT_GRAY}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••••••"
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.passwordToggleIcon}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={FONT_SIZES.BODY_LARGE}
                    color={COLORS.TEXT_GRAY}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••••••"
                  placeholderTextColor={COLORS.TEXT_GRAY}
                  secureTextEntry={!showConfirmNewPassword}
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  style={styles.passwordToggleIcon}
                >
                  <Ionicons
                    name={
                      showConfirmNewPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={FONT_SIZES.BODY_LARGE}
                    color={COLORS.TEXT_GRAY}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.updatePasswordButton}
              onPress={handleUpdatePassword}
            >
              <Text style={styles.updatePasswordButtonText}>UPDATE</Text>
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
  contentScrollView: {
    flex: 1,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.L,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.XXL * 2, // Space for the fixed save button
  },
  settingsGroup: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR_LIGHT,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR_LIGHT,
  },
  
  settingIconText: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    marginLeft: SPACING.M,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    marginHorizontal: SPACING.XL,
    marginBottom: SPACING.XXL,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.medium,
    position: "absolute",
    bottom: 0,
    left: SPACING.XL,
    right: SPACING.XL,
    width: `auto`,
    zIndex: 100,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
  // --- Modals (Logout Confirmation & Update Password) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
  logoutModalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.XL,
    width: "80%", // Adjust width as needed
    alignItems: "center",
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
  logoutModalTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
  },
  logoutModalMessage: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    marginBottom: SPACING.L,
  },
  logoutModalButtonYes: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.S,
  },
  logoutModalButtonCancel: {
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  logoutModalButtonText: {
    fontSize: FONT_SIZES.BODY_LARGE,
    fontWeight: "bold",
    color: COLORS.WHITE, // Default to white for YES button
    textTransform: "uppercase",
  },
  // Specific style for CANCEL button text color
  logoutModalButtonCancelText: {
    color: COLORS.PRIMARY,
  },
  updatePasswordModalContent: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.XL,
    width: "90%", // Wider for password fields
    ...SHADOWS.large,
  },
  updatePasswordModalTitle: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.L,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: SPACING.L,
  },
  inputLabel: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    fontWeight: "600",
    marginBottom: SPACING.S,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR_LIGHT,
    ...SHADOWS.small,
  },
  passwordInput: {
    flex: 1,
    fontSize: FONT_SIZES.BODY_LARGE,
    color: COLORS.TEXT_DARK,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.M,
  },
  passwordToggleIcon: {
    padding: SPACING.S,
  },
  updatePasswordButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    marginTop: SPACING.L,
  },
  updatePasswordButtonText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    textTransform: "uppercase",
  },
});

export default SettingsScreen;
