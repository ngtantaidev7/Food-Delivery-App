import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/colors';

interface TagBadgeProps {
  label: string;
  type?: 'freeship' | 'deal' | 'popular' | 'default';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const TagBadge: React.FC<TagBadgeProps> = ({
  label,
  type = 'default',
  style,
  textStyle,
}) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'freeship':
        return {
          bg: Colors.tagBgFreeship,
          text: Colors.tagTextFreeship,
        };
      case 'deal':
        return {
          bg: Colors.tagBgDeal,
          text: Colors.tagTextDeal,
        };
      case 'popular':
        return {
          bg: Colors.tagBgPopular,
          text: Colors.tagTextPopular,
        };
      default:
        return {
          bg: '#F0F0F0',
          text: Colors.textSecondary,
        };
    }
  };

  const badgeTheme = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: badgeTheme.bg }, style]}>
      <Text style={[styles.text, { color: badgeTheme.text }, textStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
