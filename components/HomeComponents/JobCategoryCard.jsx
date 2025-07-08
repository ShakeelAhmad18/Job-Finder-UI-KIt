import { View, Text } from 'react-native'
import React from 'react'
import { COLORS, FONT_SIZES, SPACING } from "../../constants/helpers";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const JobCategoryCard = ({
  iconName,
  count,
  title,
  backgroundColor,
  style,
}) => {

  const router=useRouter();

  const handleOnPress=()=>{
     router.push("findJob/Specialization");
  }


  return (
    <TouchableOpacity
      style={[jobCategoryStyles.card, { backgroundColor }, style]}
      onPress={() => router.push("findJob/Specialization")}
    >
      <View style={jobCategoryStyles.iconCircle}>
        <Ionicons name={iconName} size={30} color={COLORS.TEXT_DARK} />
      </View>
      <Text style={jobCategoryStyles.countText}>{count}</Text>
      <Text style={jobCategoryStyles.titleText}>{title}</Text>
    </TouchableOpacity>
  );
};

const jobCategoryStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: SPACING.L,
    padding: SPACING.L,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.S,
  },
  countText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginBottom: SPACING.XXS,
  },
  titleText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_GRAY,
  },
});