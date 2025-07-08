export const COLORS = {
  BACKGROUND: "#F8F8F8",
  WHITE: "#FFFFFF",
  TEXT_DARK: "#0D0140",
  TEXT_GRAY: "#8E8E93",
  PRIMARY_BLUE: "#4A80F0",
  PRIMARY_DARK_BLUE: "#130160",
  ACCENT_PURPLE: "#8A2BE2",
  ACCENT_ORANGE: "#FF7A00", // This will be the active card color
  LIGHT_BLUE: "#E0F2F7",
  LIGHT_PURPLE: "#E6E6FA", // This will be the filter icon background
  LIGHT_ORANGE: "#FFF0E0",
  SHADOW: "rgba(0, 0, 0, 0.08)", // Updated to match user's provided value
  BORDER_LIGHT: "#E0E0E0",
  // Derived colors for clarity and consistency with the image
  FILTER_ICON_BG: "#E6E6FA", // From LIGHT_PURPLE
  FILTER_ICON_COLOR: "#0D0140", // From TEXT_DARK
  CHIP_ACTIVE_BG: "#FF7A00", // From ACCENT_ORANGE
  BACKGROUND_LIGHT: '#F5F7FA',
TEXT_LIGHT: '#A0A4A8',
PRIMARY_BLUE: '#130160',
BORDER_LIGHT: '#E0E4E8',
  CHIP_ACTIVE_TEXT: "#FFFFFF", // White text for active chips
  CHIP_INACTIVE_BG: "#FFFFFF", // White background for inactive chips
  CHIP_INACTIVE_TEXT: "#0D0140", // From TEXT_DARK for inactive chips
};

export const FONT_SIZES = {
  H1: 24,
  H2: 18,
  BODY: 14,
  SMALL: 12,
  TINY: 10,
};


export const BORDER_RADIUS = {
  S: 4,   // Smallest (e.g., chip corners)
  M: 8,   // Medium (e.g., logo container)
  L: 16,  // Large (e.g., card corners)
  XL: 24, // Extra Large (e.g., large background curves)
  XXL: 30, // Even larger (e.g., add button)
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};