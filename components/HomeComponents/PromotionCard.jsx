import { Image } from "expo-image";
import { COLORS, FONT_SIZES, SPACING } from "../../constants/helpers";
import {View,Text,StyleSheet, Dimensions, TouchableOpacity} from 'react-native'

const { width: screenWidth } = Dimensions.get("window");

export const PromotionCard = () => {
  return (
    <View style={promotionStyles.card}>
      <View style={promotionStyles.contentContainer}>
        <Text style={promotionStyles.discountText}>50% off</Text>
        <Text style={promotionStyles.offerText}>take any courses</Text>
        <TouchableOpacity style={promotionStyles.button}>
          <Text style={promotionStyles.buttonText}>Join Now</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require("../../assets/images/banner.png")} 
        style={promotionStyles.image}
        onError={(e) =>
          console.log("Image loading error:", e.nativeEvent.error)
        }
      />
    </View>
  );
};

const promotionStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.PRIMARY_DARK_BLUE, 
    borderRadius: SPACING.L,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden", 
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    height: 150, 
  },
  contentContainer: {
    flex: 1, 
    paddingLeft: SPACING.XL,
    paddingVertical: SPACING.L,
    justifyContent: "center",
  },
  discountText: {
    fontSize: FONT_SIZES.H2,
    fontWeight: "bold",
    color: COLORS.WHITE,
    marginBottom: SPACING.XXS,
  },
  offerText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.WHITE,
    marginBottom: SPACING.S,
  },
  button: {
    backgroundColor: COLORS.ACCENT_ORANGE,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.S,
    alignSelf: "flex-start", 
  },
  buttonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: FONT_SIZES.BODY,
  },
  image: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: screenWidth * 0.45,
    height: "100%",
    borderTopRightRadius: SPACING.L, 
    borderBottomRightRadius: SPACING.L,
  },
});



