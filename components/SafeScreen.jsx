import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {COLORS} from '../constants/helpers'

const SafeScreen = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
