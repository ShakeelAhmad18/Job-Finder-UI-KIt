import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from 'react'
import { COLORS, SPACING } from '../../constants/helpers';
import { Ionicons } from '@expo/vector-icons';

export const DetailScreenHeader = ({ onBackPress, onMorePress, insets }) => {
  return (
    <View
      style={[headerStyles.container, { paddingTop: insets.top + SPACING.S }]}
    >
      <TouchableOpacity onPress={onBackPress} style={headerStyles.iconButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_DARK} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onMorePress} style={headerStyles.iconButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={COLORS.TEXT_DARK} />
      </TouchableOpacity>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
    backgroundColor: COLORS.WHITE, 
  },
  iconButton: {
    padding: SPACING.XS,
  },
});