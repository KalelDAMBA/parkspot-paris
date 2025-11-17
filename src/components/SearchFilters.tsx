import { Search, MapPin, DollarSign, Loader2, Navigation } from 'lucide-react';

interface SearchFiltersProps {
  searchRadius: number;
  onRadiusChange: (radius: number) => void;
  showPaid: boolean;
  onPaidChange: (show: boolean) => void;
  showFree: boolean;
  onFreeChange: (show: boolean) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  hasLocation: boolean;
  isTracking: boolean;
  onToggleTracking: () => void;
  accuracy?: number;
}

export function SearchFilters({
  searchRadius,
  onRadiusChange,
  showPaid,
  onPaidChange,
  showFree,
  onFreeChange,
  onLocateMe,
  isLocating,
  hasLocation,
  isTracking,
  onToggleTracking,
  accuracy,
}: SearchFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rayon de recherche: {searchRadius} km
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={searchRadius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 km</span>
          <span>20 km</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type de stationnement</label>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showPaid}
              onChange={(e) => onPaidChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Places payantes</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showFree}
              onChange={(e) => onFreeChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Places gratuites</span>
          </label>
        </div>
      </div>

      <button
        onClick={onLocateMe}
        disabled={isLocating}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors ${
          hasLocation
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLocating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Localisation...</span>
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5" />
            <span>{hasLocation ? 'Position activée' : 'Me localiser'}</span>
          </>
        )}
      </button>

      {hasLocation && (
        <>
          <button
            onClick={onToggleTracking}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors ${
              isTracking
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span>{isTracking ? 'Tracking actif' : 'Activer suivi en temps réel'}</span>
          </button>

          {accuracy !== undefined && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
              <div className="font-medium mb-1">Précision GPS</div>
              <div>{Math.round(accuracy)} mètres</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
