import { useState, useEffect } from 'react';
import { supabase, ParkingSpot } from '../lib/supabase';

interface UseParkirgSpotsOptions {
  userLocation: { lat: number; lng: number; accuracy: number } | null;
  searchRadius: number;
  showPaid: boolean;
  showFree: boolean;
}

export function useParkingSpots({ userLocation, searchRadius, showPaid, showFree }: UseParkirgSpotsOptions) {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchParkingSpots();

    const subscription = supabase
      .channel('parking_spots_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_spots',
        },
        () => {
          fetchParkingSpots();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userLocation, searchRadius, showPaid, showFree]);

  const fetchParkingSpots = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('parking_spots').select('*');

      if (!showPaid && !showFree) {
        setParkingSpots([]);
        setLoading(false);
        return;
      }

      if (showPaid && !showFree) {
        query = query.eq('is_paid', true);
      } else if (showFree && !showPaid) {
        query = query.eq('is_paid', false);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (!data) {
        setParkingSpots([]);
        setLoading(false);
        return;
      }

      const filteredByAvailability = data.filter((spot) => spot.available_spaces > 0);

      if (userLocation) {
        const filtered = filteredByAvailability.filter((spot) => {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number(spot.latitude),
            Number(spot.longitude)
          );
          return distance <= searchRadius;
        });

        filtered.sort((a, b) => {
          const distA = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number(a.latitude),
            Number(a.longitude)
          );
          const distB = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number(b.latitude),
            Number(b.longitude)
          );
          return distA - distB;
        });

        setParkingSpots(filtered);
      } else {
        setParkingSpots(filteredByAvailability);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Error fetching parking spots:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return { parkingSpots, loading, error, refetch: fetchParkingSpots };
}
