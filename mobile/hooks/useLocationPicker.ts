import { useState, useCallback } from 'react';
import { UserAddress } from '@/types/user';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const useLocationPicker = (initialAddress?: UserAddress | null) => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<Coordinates>({
    latitude: initialAddress?.location.coordinates[1] ?? 10.7769,
    longitude: initialAddress?.location.coordinates[0] ?? 106.682,
  });

  const [addressLine, setAddressLine] = useState<string>(
    initialAddress?.addressLine ?? '123 Nguyen Hue, Ben Nghe, District 1, HCMC'
  );

  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>(
    initialAddress?.label ?? 'Home'
  );

  const handleSelectLocation = useCallback((coords: Coordinates, newAddress?: string) => {
    setSelectedCoordinates(coords);
    if (newAddress) {
      setAddressLine(newAddress);
    }
  }, []);

  return {
    selectedCoordinates,
    addressLine,
    label,
    setLabel,
    setAddressLine,
    handleSelectLocation,
  };
};
