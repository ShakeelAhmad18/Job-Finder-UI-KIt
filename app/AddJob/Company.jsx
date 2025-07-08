import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Keyboard,
  Dimensions,
  Animated,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Custom color palette (avoiding blue and orange)
const COLORS = {
  primary: '#6C5CE7', // Purple
  secondary: '#00B894', // Teal
  background: '#F5F6FA',
  card: '#FFFFFF',
  textDark: '#2D3436',
  textLight: '#636E72',
  border: '#DFE6E9',
  accent: '#FD79A8', // Pink
  shadow: 'rgba(0,0,0,0.1)'
};

const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48
};

const FONT_SIZES = {
  small: 12,
  body: 14,
  bodyLarge: 16,
  h3: 18,
  h2: 22,
  h1: 28
};

const BORDER_RADIUS = {
  s: 4,
  m: 8,
  l: 12,
  xl: 16
};

// Company data with placeholder images from Unsplash
const COMPANIES = [
  {
    id: '1',
    name: 'Google',
    industry: 'Internet',
    logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '2',
    name: 'Apple',
    industry: 'Electronics',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '3',
    name: 'Amazon',
    industry: 'E-commerce',
    logo: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '4',
    name: 'Dribbble',
    industry: 'Design',
    logo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '5',
    name: 'Twitter',
    industry: 'Social Media',
    logo: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '6',
    name: 'Facebook',
    industry: 'Social Media',
    logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '7',
    name: 'Microsoft',
    industry: 'Software',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '8',
    name: 'Allianz',
    industry: 'Finance',
    logo: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '9',
    name: 'Adobe',
    industry: 'Software',
    logo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '10',
    name: 'AXA',
    industry: 'Insurance',
    logo: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: '11',
    name: 'Airbnb',
    industry: 'Travel',
    logo: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }
];

const CompanyPickerScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) {
      return COMPANIES;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return COMPANIES.filter(
      company =>
        company.name.toLowerCase().includes(lowerCaseQuery) ||
        company.industry.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  const handleSelectCompany = useCallback(
    company => {
      router.setParams({ selectedCompany: company.name });
      router.back();
    },
    [router]
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    Keyboard.dismiss();
  }, []);

  const renderCompanyItem = useCallback(
    ({ item, index }) => {
      const inputRange = [-1, 0, 100 * index, 100 * (index + 2)];
      const opacityInputRange = [-1, 0, 100 * index, 100 * (index + 0.5)];
      
      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 0.9],
      });
      
      const opacity = scrollY.interpolate({
        inputRange: opacityInputRange,
        outputRange: [1, 1, 1, 0],
      });

      return (
        <Animated.View style={{ transform: [{ scale }], opacity }}>
          <TouchableOpacity
            style={styles.companyCard}
            onPress={() => handleSelectCompany(item)}
            activeOpacity={0.9}
          >
            <View style={styles.companyLogoContainer}>
              <Image
                source={{ uri: item.logo }}
                style={styles.companyLogo}
                resizeMode="cover"
              />
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{item.name}</Text>
              <Text style={styles.companyIndustry}>{item.industry}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [handleSelectCompany, scrollY]
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', COLORS.background]}
        style={styles.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Company</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          isSearchFocused && styles.searchContainerFocused,
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isSearchFocused ? COLORS.primary : COLORS.textLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search companies..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearSearchButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Popular Tags */}
      <View style={styles.tagsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.tag}
            onPress={() => setSearchQuery('Technology')}
          >
            <Text style={styles.tagText}>Technology</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tag}
            onPress={() => setSearchQuery('Finance')}
          >
            <Text style={styles.tagText}>Finance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tag}
            onPress={() => setSearchQuery('Design')}
          >
            <Text style={styles.tagText}>Design</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tag}
            onPress={() => setSearchQuery('Social Media')}
          >
            <Text style={styles.tagText}>Social Media</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tag}
            onPress={() => setSearchQuery('E-commerce')}
          >
            <Text style={styles.tagText}>E-commerce</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Companies List */}
      <Animated.FlatList
        data={filteredCompanies}
        keyExtractor={item => item.id}
        renderItem={renderCompanyItem}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } }}],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="business-outline"
              size={48}
              color={COLORS.textLight}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>No companies found</Text>
            <Text style={styles.emptyStateText}>
              Try a different search term
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES.h2,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  headerRightPlaceholder: {
    width: 24 + SPACING.xs * 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.l,
    margin: SPACING.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
  },
  searchIcon: {
    marginRight: SPACING.s,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: FONT_SIZES.bodyLarge,
    color: COLORS.textDark,
    paddingVertical: 0,
  },
  clearSearchButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  tagsContainer: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.s,
  },
  tag: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    marginRight: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.xl,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.m,
    padding: SPACING.m,
    marginBottom: SPACING.s,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  companyLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.s,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: SPACING.m,
  },
  companyLogo: {
    width: '100%',
    height: '100%',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: FONT_SIZES.bodyLarge,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  companyIndustry: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateIcon: {
    opacity: 0.5,
    marginBottom: SPACING.m,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
  },
});

export default CompanyPickerScreen;