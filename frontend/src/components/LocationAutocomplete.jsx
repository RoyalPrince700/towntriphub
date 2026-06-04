import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
// Google Places API disabled until Maps subscription is active
// import { placesService } from '../services/placesService';

const LocationAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  error: propError,
  required = false
}) => {
  const [inputValue, setInputValue] = useState(value?.address || '');
  const inputRef = useRef(null);

  const hasAddress = !!value?.address?.trim();
  const isValid = hasAddress;
  const error = propError || '';

  useEffect(() => {
    setInputValue(value?.address || '');
  }, [value?.address]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);

    onChange({
      address: input,
      coordinates: { latitude: null, longitude: null }
    });
  };

  /* Google Places autocomplete — re-enable when Maps API is subscribed
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChangeWithAutocomplete = async (e) => {
    const input = e.target.value;
    setInputValue(input);

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
  */

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
              : 'border-gray-300'
          }`}
        />
      </div>

      <div className="mt-1.5 flex items-start gap-2 text-[10px]">
        {required && !error && (
          <span className="text-gray-400 font-medium">Enter the full address manually</span>
        )}
        {error && (
          <p className="font-medium text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;
