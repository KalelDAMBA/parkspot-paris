import { ParkingSpot } from '../lib/supabase';
import { MapPin, Clock, Car, Euro, Navigation } from 'lucide-react';

interface ParkingListProps {
  parkingSpots: ParkingSpot[];
  onSpotSelect: (spot: ParkingSpot) => void;
  selectedSpot: ParkingSpot | null;
  userLocation: { lat: number; lng: number; accuracy: number } | null;
}

export function ParkingList({ parkingSpots, onSpotSelect, selectedSpot, userLocation }: ParkingListProps) {
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

  const getAvailabilityColor = (available: number, total: number): string => {
    const rate = total > 0 ? (available / total) * 100 : 0;
    if (rate > 50) return 'text-green-600 bg-green-50';
    if (rate > 20) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getAvailabilityText = (available: number, total: number): string => {
    const rate = total > 0 ? (available / total) * 100 : 0;
    if (rate > 50) return 'Disponible';
    if (rate > 20) return 'Peu de places';
    return 'Presque complet';
  };

  return (
    <div className="space-y-3">
      {parkingSpots.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune place de stationnement trouvée</p>
          <p className="text-sm mt-1">Essayez d'élargir votre recherche</p>
        </div>
      ) : (
        parkingSpots.map((spot) => {
          const distance = userLocation
            ? calculateDistance(userLocation.lat, userLocation.lng, Number(spot.latitude), Number(spot.longitude))
            : null;

          return (
            <div
              key={spot.id}
              onClick={() => onSpotSelect(spot)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedSpot?.id === spot.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{spot.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getAvailabilityColor(spot.available_spaces, spot.total_spaces)}`}>
                  {getAvailabilityText(spot.available_spaces, spot.total_spaces)}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate">{spot.address}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {spot.available_spaces}/{spot.total_spaces}
                    </span>
                  </div>

                  <div className={`flex items-center ${spot.is_paid ? 'text-orange-600' : 'text-green-600'}`}>
                    <Euro className="w-4 h-4 mr-1" />
                    <span className="font-medium">{spot.is_paid ? 'Payant' : 'Gratuit'}</span>
                  </div>
                </div>

                {distance !== null && (
                  <div className="flex items-center text-gray-600">
                    <Navigation className="w-4 h-4 mr-1" />
                    <span>{distance.toFixed(1)} km</span>
                  </div>
                )}
              </div>

              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Clock className="w-3 h-3 mr-1" />
                <span>Mis à jour: {new Date(spot.last_updated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
