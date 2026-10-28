import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { MapPin, Navigation, Bike, Clock } from 'lucide-react-native';
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
        console.warn('[DriverRouteMap.web] Route optimization:', err);
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

  return (
    <View style={styles.webMapContainer}>
      {/* Visual Canvas background simulating map view */}
      <View style={styles.mapGrid}>
        <View style={[styles.roadLine, { top: '30%', left: 0, right: 0, transform: [{ rotate: '-10deg' }] }]} />
        <View style={[styles.roadLine, { top: '60%', left: 0, right: 0, transform: [{ rotate: '15deg' }] }]} />
        <View style={[styles.roadLine, { top: 0, bottom: 0, left: '40%', width: 22, transform: [{ rotate: '20deg' }] }]} />
        <View style={[styles.roadLine, { top: 0, bottom: 0, right: '30%', width: 18, transform: [{ rotate: '-15deg' }] }]} />

        {/* Route Polyline Graphic */}
        <View style={styles.routePolyline} />

        {/* Driver Marker */}
        <View style={[styles.markerBadge, { top: '35%', left: '25%' }]}>
          <View style={styles.driverCircle}>
            <Bike color="#FFFFFF" size={16} />
          </View>
          <Text style={styles.markerLabel}>John Cooper (Driver)</Text>
        </View>

        {/* Destination Marker (Page 10 PDF) */}
        <View style={[styles.markerBadge, { top: '50%', right: '28%' }]}>
          <View style={styles.destCircle}>
            <MapPin color="#FFFFFF" size={18} />
          </View>
          <Text style={styles.markerLabel}>201 Katlian No.21 St</Text>
        </View>

        {/* Route Info Badge */}
        <View style={styles.etaOverlay}>
          {loadingRoute ? (
            <ActivityIndicator size="small" color="#00BDD6" />
          ) : (
            <>
              <Clock color="#00BDD6" size={14} />
              <Text style={styles.etaText}>
                {routeData?.etaText || '15-20 mins'} · {routeData?.distanceKm || 2.4} km
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webMapContainer: {
    flex: 1,
    minHeight: 280,
    backgroundColor: '#F3F5F8',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: '#EEF2F6',
  },
  roadLine: {
    position: 'absolute',
    height: 18,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  routePolyline: {
    position: 'absolute',
    top: '38%',
    left: '30%',
    width: '40%',
    height: 6,
    backgroundColor: '#00BDD6',
    borderRadius: 3,
    transform: [{ rotate: '18deg' }],
  },
  markerBadge: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2,
  },
  driverCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  destCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BDD6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#00BDD6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  markerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  etaOverlay: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 3,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00BDD6',
  },
});
