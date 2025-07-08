import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../constants/helpers";

const { height } = Dimensions.get("window");

const AddContentModal = ({ visible, onClose, onPost, onMakeJob }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [isContentInteractive, setIsContentInteractive] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsContentInteractive(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, // Fade in content
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
     
      if (isContentInteractive) {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0, 
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsContentInteractive(false);
          onClose(); 
        });
      } else {
        onClose();
      }
    }
  }, [visible, slideAnim, opacityAnim, isContentInteractive, onClose]);

  const handleAction = useCallback(
    (actionCallback) => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsContentInteractive(false);
        onClose(); 
        if (actionCallback) {
          actionCallback(); 
        }
      });
    },
    [slideAnim, opacityAnim, onClose]
  );

  const handleModalContentPress = useCallback((e) => {
    e.stopPropagation(); 
  }, []);

  return (
    <Modal
      animationType="none" 
      transparent={true}
      
      visible={visible}
      
      onRequestClose={() => handleAction(null)}
    >
      
      <TouchableWithoutFeedback onPress={() => handleAction(null)}>
        <View style={styles.overlay}>
          
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: slideAnim }],
                opacity: opacityAnim, 
              },
            ]}
            pointerEvents={isContentInteractive ? "auto" : "none"}
          >

            <TouchableWithoutFeedback onPress={handleModalContentPress}>
              <View style={styles.modalContent}>
                <View style={styles.dragIndicator} />

                <Text style={styles.title}>What would you like to add?</Text>
                <Text style={styles.description}>
                  Would you like to post your tips and experiences or create a
                  job?
                </Text>

                <TouchableOpacity
                  style={styles.postButton}
                  onPress={() => handleAction(onPost)}
                >
                  <Text style={styles.postButtonText}>POST</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.makeJobButton}
                  onPress={() => handleAction(onMakeJob)}
                >
                  <Text style={styles.makeJobButtonText}>MAKE A JOB</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end", // Align modal to the bottom
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark semi-transparent background
  },
  modalContainer: {
    width: "100%",
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: BORDER_RADIUS.XL, // Large rounded top corners
    borderTopRightRadius: BORDER_RADIUS.XL,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.M, // Padding for the drag indicator
    paddingBottom: SPACING.XXL, // Ample bottom padding
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: -5 }, // Shadow above the modal
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10, // Android shadow
  },
  dragIndicator: {
    width: 60,
    height: 5,
    backgroundColor: COLORS.BORDER_LIGHT, // Light gray indicator
    borderRadius: BORDER_RADIUS.S,
    alignSelf: "center",
    marginBottom: SPACING.L,
  },
  modalContent: {

    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZES.H1, // Larger title
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.S,
    textAlign: "center",
  },
  description: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
    textAlign: "center",
    marginBottom: SPACING.XXL, // More space before buttons
    lineHeight: FONT_SIZES.BODY * 1.5,
  },
  postButton: {
    width: "100%",
    backgroundColor: COLORS.PRIMARY_DARK_BLUE, // Dark blue for primary action
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    marginBottom: SPACING.M, // Space between buttons
    shadowColor: COLORS.PRIMARY_DARK_BLUE, // Subtle shadow for button
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  postButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.H2, // Larger text for buttons
    fontWeight: "bold",
  },
  makeJobButton: {
    width: "100%",
    backgroundColor: COLORS.LIGHT_PURPLE, // Lighter purple for secondary action
    borderRadius: BORDER_RADIUS.M,
    paddingVertical: SPACING.M,
    alignItems: "center",
    borderWidth: 1, // Subtle border for secondary button
    borderColor: COLORS.ACCENT_PURPLE,
    shadowColor: COLORS.ACCENT_PURPLE, // Subtle shadow for button
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  makeJobButtonText: {
    color: COLORS.ACCENT_PURPLE, // Matching text color for secondary button
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
  },
});

export default AddContentModal;
