// components/SelectionModal.js
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../../constants/helpers";

const SelectionModal = ({
  visible,
  onClose,
  onSave,
  title,
  description,
  options = [],
  initialValue,
  searchable = false,
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [animation] = useState(new Animated.Value(0));

  // Animation for modal entrance
  useEffect(() => {
    if (visible) {
      setSelectedValue(initialValue || null);
      setSearchQuery("");
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      animation.setValue(0);
    }
  }, [visible, initialValue]);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (option.subLabel &&
        option.subLabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSave = useCallback(() => {
    onSave(selectedValue);
    onClose();
  }, [selectedValue, onSave, onClose]);

  const renderOption = useCallback(
    (option) => (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.optionItem,
          selectedValue === option.value && styles.optionItemSelected,
        ]}
        onPress={() => setSelectedValue(option.value)}
        activeOpacity={0.7}
      >
        <View style={styles.optionContent}>
          <View style={styles.optionIndicator}>
            <View
              style={[
                styles.optionIndicatorInner,
                selectedValue === option.value &&
                  styles.optionIndicatorSelected,
              ]}
            />
          </View>
          <View style={styles.optionTextContainer}>
            <Text
              style={[
                styles.optionLabel,
                selectedValue === option.value && styles.optionLabelSelected,
              ]}
            >
              {option.label}
            </Text>
            {option.subLabel && (
              <Text
                style={[
                  styles.optionSubLabel,
                  selectedValue === option.value &&
                    styles.optionSubLabelSelected,
                ]}
              >
                {option.subLabel}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [selectedValue]
  );

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>{title}</Text>
            {description && (
              <Text style={styles.modalDescription}>{description}</Text>
            )}
          </View>

          {searchable && (
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={COLORS.TEXT_GRAY}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search options..."
                placeholderTextColor={COLORS.TEXT_LIGHT}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.searchClear}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={COLORS.TEXT_LIGHT}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          <ScrollView
            style={styles.optionsContainer}
            contentContainerStyle={styles.optionsContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map(renderOption)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={COLORS.TEXT_LIGHT}
                  style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyStateText}>No options found</Text>
                <Text style={styles.emptyStateSubText}>
                  Try a different search term
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                selectedValue === null && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={selectedValue === null}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.BLACK,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.XL,
    borderTopRightRadius: BORDER_RADIUS.XL,
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? SPACING.XXL : SPACING.XL,
  },
  modalHeader: {
    paddingHorizontal: SPACING.L,
    paddingTop: SPACING.M,
    paddingBottom: SPACING.S,
    alignItems: "center",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.BORDER_LIGHT,
    borderRadius: 2,
    marginBottom: SPACING.M,
  },
  modalTitle: {
    fontSize: FONT_SIZES.H1,
    fontWeight: "700",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XS,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    lineHeight: FONT_SIZES.BODY * 1.5,
    marginBottom: SPACING.M,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: BORDER_RADIUS.M,
    marginHorizontal: SPACING.L,
    marginBottom: SPACING.M,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
  },
  searchIcon: {
    marginRight: SPACING.S,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_DARK,
    paddingVertical: 0,
  },
  searchClear: {
    padding: SPACING.XS,
    marginLeft: SPACING.XS,
  },
  optionsContainer: {
    maxHeight: 300,
  },
  optionsContentContainer: {
    paddingHorizontal: SPACING.L,
  },
  optionItem: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.M,
    padding: SPACING.M,
    marginBottom: SPACING.XS,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  optionItemSelected: {
    borderColor: COLORS.PRIMARY_BLUE,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.TEXT_LIGHT,
    marginRight: SPACING.M,
    justifyContent: "center",
    alignItems: "center",
  },
  optionIndicatorInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionIndicatorSelected: {
    backgroundColor: COLORS.ACCENT_ORANGE,
    borderColor: COLORS.PRIMARY_BLUE,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS,
  },
  optionLabelSelected: {
    color: COLORS.PRIMARY_BLUE,
  },
  optionSubLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
    lineHeight: FONT_SIZES.SMALL * 1.4,
  },
  optionSubLabelSelected: {
    color: COLORS.PRIMARY_BLUE,
  },
  optionCheckmark: {
    marginLeft: SPACING.S,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.XL,
  },
  emptyStateIcon: {
    opacity: 0.5,
    marginBottom: SPACING.M,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS,
  },
  emptyStateSubText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_GRAY,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.L,
    paddingTop: SPACING.M,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  button: {
    flex: 1,
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SPACING.XS,
  },
  cancelButton: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  saveButton: {
    backgroundColor: COLORS.ACCENT_ORANGE,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.TEXT_LIGHT,
  },
  buttonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: "600",
  },
});

export default SelectionModal;
