import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { placesService } from '../services/placesService';

const LocationAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  error: propError,
  required = false
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value?.address || '');
  const inputRef = useRef(null);

  // Determine validation state
  const hasAddress = !!value?.address?.trim();
  const hasValidCoords = !!(value?.coordinates?.latitude && value?.coordinates?.longitude);
  const isValid = hasAddress && hasValidCoords;
  const needsSelection = hasAddress && !hasValidCoords;
  const error = propError || (needsSelection ? 'Please select from the suggestions below to confirm location with coordinates' : '');

  useEffect(() => {
    setInputValue(value?.address || '');
  }, [value?.address]);

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setInputValue(input);

    // Sync typed address to parent immediately (coords remain null until selection)
    onChange({
      address: input,
      coordinates: value?.coordinates || { latitude: null, longitude: null }
    });

    if (input.length >= 2) {
      setLoading(true);
      try {
        const results = await placesService.getAutocomplete(input);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    try {
      setLoading(true);
      const placeDetails = await placesService.getPlaceDetails(suggestion.placeId);

      onChange({
        address: suggestion.description,
        coordinates: placeDetails.coordinates
      });

      setInputValue(suggestion.description);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Failed to get place details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
            error
              ? 'border-red-300 bg-red-50'
              : isValid
              ? 'border-emerald-300 bg-emerald-50'
              : needsSelection
              ? 'border-amber-300 bg-amber-50'
              : 'border-gray-300'
          }`}
        />

        {loading && (
          <Loader className="absolute right-3 top-3 h-5 w-5 text-gray-400 animate-spin" />
        )}

        {/* Status indicator */}
        {hasAddress && (
          <div className="absolute right-12 top-3 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            {isValid ? (
              <span className="text-emerald-600 bg-emerald-100 px-1.5 py-px rounded">Selected</span>
            ) : needsSelection ? (
              <span className="text-amber-600 bg-amber-100 px-1.5 py-px rounded">Needs selection</span>
            ) : null}
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.placeId}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mt-0.5 mr-3 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {suggestion.structuredFormatting?.main_text || suggestion.description}
                  </div>
                  {suggestion.structuredFormatting?.secondary_text && (
                    <div className="text-sm text-gray-500">
                      {suggestion.structuredFormatting.secondary_text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper text and error */}
      <div className="mt-1.5 flex items-start gap-2 text-[10px]">
        {required && (
          <span className="text-gray-400 font-medium">Type address and select from suggestions for coordinates</span>
        )}
        {error && (
          <p className={`font-medium ${needsSelection ? 'text-amber-600' : 'text-red-600'}`}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;