import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import Colors from '@/constants/colors';
import { getOptimizedRoute } from '@/services/api';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface DriverRouteMapProps {
  customerLocation: LocationCoords;
  driverLocation?: LocationCoords | null;
  restaurantLocation?: LocationCoords;
}

interface RouteData {
  polylineCoords: LocationCoords[];
  distanceKm: number;
  durationMin: number;
  etaText: string;
}

export const DriverRouteMap: React.FC<DriverRouteMapProps> = ({
  customerLocation,
  driverLocation,
  restaurantLocation,
}) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    if (!driverLocation || !restaurantLocation) return;

    const fetchRoute = async () => {
      setLoadingRoute(true);
      try {
        const data = await getOptimizedRoute({
          driverLocation,
          restaurantLocation,
          customerLocation,
        });
        setRouteData(data);
      } catch (err) {
        console.warn('[DriverRouteMap] Route optimization failed:', err);
      } finally {
        setLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [
    driverLocation?.latitude,
    driverLocation?.longitude,
    restaurantLocation?.latitude,
    restaurantLocation?.longitude,
  ]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text style={styles.webFallbackText}>🗺 Map Preview (Driver Tracking)</Text>
        <Text style={styles.webFallbackSub}>
          Driver: {driverLocation
            ? `${driverLocation.latitude.toFixed(4)}, ${driverLocation.longitude.toFixed(4)}`
            : 'Waiting for GPS...'}
        </Text>
        {routeData && (
          <Text style={styles.webFallbackSub}>
            📍 {routeData.distanceKm} km · ⏱ {routeData.etaText}
          </Text>
        )}
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

  // Fallback: straight-line coords if OSRM hasn't loaded yet
  const polyline: LocationCoords[] =
    routeData?.polylineCoords && routeData.polylineCoords.length > 0
      ? routeData.polylineCoords
      : [
          ...(restaurantLocation ? [restaurantLocation] : []),
          ...(driverLocation ? [driverLocation] : []),
          customerLocation,
        ];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker coordinate={customerLocation} title="Delivery Address" pinColor={Colors.primary} />
        {restaurantLocation && (
          <Marker coordinate={restaurantLocation} title="Restaurant" pinColor="#FF9800" />
        )}
        {driverLocation && (
          <Marker coordinate={driverLocation} title="Driver" pinColor={Colors.success} />
        )}
        {polyline.length > 1 && (
          <Polyline
            coordinates={polyline}
            strokeColor={Colors.primary}
            strokeWidth={4}
            lineDashPattern={routeData ? undefined : [8, 4]}
          />
        )}
      </MapView>

      {/* ETA overlay */}
      <View style={styles.etaOverlay}>
        {loadingRoute ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : routeData ? (
          <>
            <Text style={styles.etaMain}>⏱ {routeData.etaText}</Text>
            <Text style={styles.etaSub}>📍 {routeData.distanceKm} km · Lộ trình tối ưu</Text>
          </>
        ) : (
          <Text style={styles.etaSub}>Đang chờ vị trí tài xế...</Text>
        )}
      </View>
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
    ...StyleSheet.absoluteFill as any,
  },
  etaOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  etaMain: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  etaSub: {
    fontSize: 12,
    color: Colors.textSecondary,
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

