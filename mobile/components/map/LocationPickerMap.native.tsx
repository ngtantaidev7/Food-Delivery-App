import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
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
  onLocationChange,
}) => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text style={styles.webFallbackText}>📍 Location Picker</Text>
        <Text style={styles.webFallbackSub}>
          {initialCoordinates.latitude.toFixed(4)}, {initialCoordinates.longitude.toFixed(4)}
        </Text>
      </View>
    );
  }

  const MapView = require('react-native-maps').default;
  const { Marker } = require('react-native-maps');

  const region = {
    ...initialCoordinates,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={(e: any) => {
          if (onLocationChange && e.nativeEvent.coordinate) {
            onLocationChange(e.nativeEvent.coordinate);
          }
        }}
      >
        <Marker
          coordinate={initialCoordinates}
          draggable
          onDragEnd={(e: any) => {
            if (onLocationChange && e.nativeEvent.coordinate) {
              onLocationChange(e.nativeEvent.coordinate);
            }
          }}
          pinColor={Colors.primary}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFill as any,
  },
  webFallback: {
    height: 180,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  webFallbackText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  webFallbackSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
