import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import Colors from '@/constants/colors';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface DriverRouteMapProps {
  customerLocation: LocationCoords;
  driverLocation?: LocationCoords | null;
  restaurantLocation?: LocationCoords;
}

export const DriverRouteMap: React.FC<DriverRouteMapProps> = ({
  customerLocation,
  driverLocation,
  restaurantLocation,
}) => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text style={styles.webFallbackText}>🗺 Map Preview (Driver Tracking)</Text>
        <Text style={styles.webFallbackSub}>
          Driver: {driverLocation ? `${driverLocation.latitude.toFixed(4)}, ${driverLocation.longitude.toFixed(4)}` : 'Waiting for GPS...'}
        </Text>
      </View>
    );
  }

  // Native map rendering
  const MapView = require('react-native-maps').default;
  const { Marker, Polyline } = require('react-native-maps');

  const initialRegion = {
    latitude: driverLocation?.latitude || customerLocation.latitude,
    longitude: driverLocation?.longitude || customerLocation.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const coordinates: LocationCoords[] = [];
  if (restaurantLocation) coordinates.push(restaurantLocation);
  if (driverLocation) coordinates.push(driverLocation);
  coordinates.push(customerLocation);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker
          coordinate={customerLocation}
          title="Delivery Address"
          pinColor={Colors.primary}
        />
        {restaurantLocation && (
          <Marker
            coordinate={restaurantLocation}
            title="Restaurant"
            pinColor="#FF9800"
          />
        )}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver (John Cooper)"
            pinColor={Colors.success}
          />
        )}
        {coordinates.length > 1 && (
          <Polyline
            coordinates={coordinates}
            strokeColor={Colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webFallback: {
    height: 200,
    backgroundColor: '#E8F7F9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  webFallbackText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  webFallbackSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
  },
});
