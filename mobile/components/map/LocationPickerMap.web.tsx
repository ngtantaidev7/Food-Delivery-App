import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface LocationPickerMapProps {
  initialCoordinates: LocationCoords;
  onLocationChange?: (coords: LocationCoords) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialCoordinates,
}) => {
  return (
    <View style={styles.webContainer}>
      <View style={styles.roadLine1} />
      <View style={styles.roadLine2} />
      <View style={styles.pinWrapper}>
        <View style={styles.pinCircle}>
          <MapPin color="#FFFFFF" size={24} />
        </View>
        <Text style={styles.coordText}>
          {initialCoordinates.latitude.toFixed(4)}, {initialCoordinates.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    minHeight: 250,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  roadLine1: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-12deg' }],
    borderColor: '#E8ECF0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  roadLine2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '45%',
    width: 24,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '20deg' }],
    borderColor: '#E8ECF0',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  pinWrapper: {
    alignItems: 'center',
    zIndex: 2,
  },
  pinCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#00BDD6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  coordText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
