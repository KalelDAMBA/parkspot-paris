import { ParkingSpot } from '../lib/supabase';
import { LocationData } from '../hooks/useGeolocation';
import { X, MapPin, Navigation2, Phone, Clock } from 'lucide-react';

interface NavigationModalProps {
  spot: ParkingSpot;
  userLocation: LocationData | null;
  onClose: () => void;
  onStartNavigation: () => void;
}

export function NavigationModal({
  spot,
  userLocation,
  onClose,
  onStartNavigation,
}: NavigationModalProps) {
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

  const estimateTravelTime = (distance: number): string => {
    const carSpeedKmH = 40;
    const minutes = Math.round((distance / carSpeedKmH) * 60);
    return `${minutes} min`;
  };

  const distance = userLocation
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        Number(spot.latitude),
        Number(spot.longitude)
      )
    : 0;

  const travelTime = estimateTravelTime(distance);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}&destination_place_id=&travelmode=driving`;
    window.open(url, '_blank');
  };

  const openAppleMaps = () => {
    const url = `maps://maps.apple.com/?daddr=${spot.latitude},${spot.longitude}&dirflg=d`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="w-full bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{spot.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{spot.address}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{spot.available_spaces}</div>
                  <div className="text-xs text-gray-600">Places libres</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{distance.toFixed(1)} km</div>
                  <div className="text-xs text-gray-600">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{travelTime}</div>
                  <div className="text-xs text-gray-600">Trajet estimé</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Coordonnées GPS</span>
              </div>
              <code className="text-xs bg-white p-2 rounded border border-gray-200 block text-gray-900">
                {spot.latitude}, {spot.longitude}
              </code>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Avant de vous déplacer, vérifiez que cette place est toujours disponible. Les données sont mises à jour en temps réel mais peuvent avoir quelques secondes de décalage.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={openGoogleMaps}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Navigation2 className="w-5 h-5" />
                <span>Google Maps</span>
              </button>

              <button
                onClick={openAppleMaps}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              >
                <Navigation2 className="w-5 h-5" />
                <span>Apple Maps</span>
              </button>

              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
              >
                <span>Fermer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
