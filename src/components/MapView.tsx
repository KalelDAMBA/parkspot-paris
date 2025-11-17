import { useEffect, useRef, useState } from 'react';
import { ParkingSpot } from '../lib/supabase';
import { MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  parkingSpots: ParkingSpot[];
  userLocation: { lat: number; lng: number; accuracy: number } | null;
  onSpotSelect: (spot: ParkingSpot) => void;
  selectedSpot: ParkingSpot | null;
}

export function MapView({ parkingSpots, userLocation, onSpotSelect, selectedSpot }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = userLocation
      ? { lat: userLocation.lat, lng: userLocation.lng }
      : { lat: 48.8566, lng: 2.3522 };

    const map = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;
  }, [mapLoaded, userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    parkingSpots.forEach(spot => {
      const availabilityRate = spot.total_spaces > 0
        ? (spot.available_spaces / spot.total_spaces) * 100
        : 0;

      let markerColor = '#dc2626';
      if (availabilityRate > 50) markerColor = '#16a34a';
      else if (availabilityRate > 20) markerColor = '#ea580c';

      const marker = new google.maps.Marker({
        position: { lat: Number(spot.latitude), lng: Number(spot.longitude) },
        map: mapInstanceRef.current!,
        title: spot.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: markerColor,
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        onSpotSelect(spot);
      });

      markersRef.current.push(marker);
    });

    if (userLocation && mapInstanceRef.current) {
      const userMarker = new google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: mapInstanceRef.current,
        title: 'Votre position',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      });

      markersRef.current.push(userMarker);
    }
  }, [parkingSpots, userLocation, onSpotSelect]);

  useEffect(() => {
    if (selectedSpot && mapInstanceRef.current) {
      mapInstanceRef.current.panTo({
        lat: Number(selectedSpot.latitude),
        lng: Number(selectedSpot.longitude)
      });
      mapInstanceRef.current.setZoom(16);
    }
  }, [selectedSpot]);

  if (!mapLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}
