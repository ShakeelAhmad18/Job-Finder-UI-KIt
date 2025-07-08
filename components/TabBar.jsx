import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../constants/helpers"; 

const { width } = Dimensions.get("window");

const TabBar = ({ state, descriptors, navigation, onPlusButtonPress }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        let iconName;
        switch (route.name) {
          case "index":
            iconName = "home-outline";
            break;
          case "Posting":
            iconName = "grid-outline"; 
            break;
          case "CreatePost": 
            iconName = "add-circle"; 
            break;
          case "Message":
            iconName = "chatbubbles-outline";
            break;
          case "SaveJob":
            iconName = "bookmark-outline";
            break;
          default:
            iconName = "help-circle-outline";
        }

        const onPress = () => {
          if (route.name === "CreatePost") {
            if (onPlusButtonPress) {
              onPlusButtonPress(); 
            }
          } else {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        if (route.name === "CreatePost") {
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={
                options.tabBarAccessibilityLabel || "Create Post"
              }
              testID={options.tabBarTestID || "create-post-tab-button"}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.plusButtonWrapper}
            >
              <View style={styles.plusButtonContainer}>
                <Ionicons
                  name={iconName}
                  size={48} 
                  color={COLORS.PRIMARY_BLUE} 
                />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel || label}
            testID={options.tabBarTestID || `${label}-tab-button`}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? COLORS.PRIMARY_BLUE : COLORS.TEXT_GRAY}
            />
            <Text
              style={[
                styles.tabBarLabel,
                { color: isFocused ? COLORS.PRIMARY_BLUE : COLORS.TEXT_GRAY },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 0,
    elevation: 10, // For Android shadow
    shadowColor: COLORS.SHADOW, // For iOS shadow
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    height: 70, // Adjust height as needed for proper spacing
    paddingBottom: SPACING.XXS, // Padding for bottom safe area
    alignItems: "center",
    justifyContent: "space-around",
    borderTopLeftRadius: BORDER_RADIUS.L, // Rounded top corners for the tab bar
    borderTopRightRadius: BORDER_RADIUS.L,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.XS,
  },
  tabBarLabel: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: "600",
    marginTop: SPACING.XXS,
  },
  plusButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1, 
  },
  plusButtonContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.XXL, 
    padding: SPACING.XXS, 
    shadowColor: COLORS.PRIMARY_BLUE, 
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default TabBar;
