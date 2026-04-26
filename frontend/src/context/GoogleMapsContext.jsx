import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const GoogleMapsContext = createContext();

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

export const GoogleMapsProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [google, setGoogle] = useState(null);
  const [error, setError] = useState(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError(new Error('VITE_GOOGLE_MAPS_API_KEY is not set in frontend .env'));
      return;
    }
    setOptions({
      apiKey,
      version: 'weekly',
    });

    Promise.all([
      importLibrary('maps'),
      importLibrary('places'),
      importLibrary('geometry'),
    ])
      .then(() => {
        setGoogle(window.google);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Google Maps failed to load:', err);
        setError(err);
      });
  }, []);

  const value = {
    isLoaded,
    google,
    error
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};