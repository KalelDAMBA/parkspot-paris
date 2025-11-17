import { useState } from 'react';
import { MapView } from './components/MapView';
import { ParkingList } from './components/ParkingList';
import { SearchFilters } from './components/SearchFilters';
import { NavigationModal } from './components/NavigationModal';
import { useParkingSpots } from './hooks/useParkingSpots';
import { useGeolocation } from './hooks/useGeolocation';
import { ParkingSpot } from './lib/supabase';
import { Car, Loader2, AlertCircle } from 'lucide-react';

function App() {
  const { location, isLocating, error: geoError, requestLocation, isTracking, startTracking, stopTracking } = useGeolocation();
  const [searchRadius, setSearchRadius] = useState(5);
  const [showPaid, setShowPaid] = useState(true);
  const [showFree, setShowFree] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [showList, setShowList] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);

  const { parkingSpots, loading, error } = useParkingSpots({
    userLocation: location,
    searchRadius,
    showPaid,
    showFree,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ParkSpot Paris</h1>
                <p className="text-sm text-gray-600">Trouvez votre place en temps réel</p>
              </div>
            </div>
            <button
              onClick={() => setShowList(!showList)}
              className="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showList ? 'Carte' : 'Liste'}
            </button>
          </div>
        </div>
      </header>

      {geoError && (
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{geoError}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Erreur: {error}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          <div className={`lg:col-span-1 space-y-4 overflow-y-auto ${showList ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters
              searchRadius={searchRadius}
              onRadiusChange={setSearchRadius}
              showPaid={showPaid}
              onPaidChange={setShowPaid}
              showFree={showFree}
              onFreeChange={setShowFree}
              onLocateMe={requestLocation}
              isLocating={isLocating}
              hasLocation={location !== null}
              isTracking={isTracking}
              onToggleTracking={() => isTracking ? stopTracking() : startTracking()}
              accuracy={location?.accuracy}
            />

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Places disponibles
                </h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {parkingSpots.length}
                </span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <ParkingList
                  parkingSpots={parkingSpots}
                  onSpotSelect={(spot) => {
                    setSelectedSpot(spot);
                    setShowNavigation(true);
                  }}
                  selectedSpot={selectedSpot}
                  userLocation={location}
                />
              )}
            </div>
          </div>

          <div className={`lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden ${!showList ? 'block' : 'hidden lg:block'}`}>
            <MapView
              parkingSpots={parkingSpots}
              userLocation={location}
              onSpotSelect={setSelectedSpot}
              selectedSpot={selectedSpot}
            />
          </div>
        </div>
      </main>

      {showNavigation && selectedSpot && location && (
        <NavigationModal
          spot={selectedSpot}
          userLocation={location}
          onClose={() => setShowNavigation(false)}
          onStartNavigation={() => {}}
        />
      )}
    </div>
  );
}

export default App;
