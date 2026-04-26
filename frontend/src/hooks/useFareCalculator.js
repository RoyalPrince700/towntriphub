import { useState, useEffect } from 'react';
import { placesService } from '../services/placesService';
import fareCalculator from '../utils/fareCalculator';

export const useFareCalculator = () => {
  const [fareData, setFareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate fare using client-side calculation first (instant), then sync with server
  const calculateFare = async (pickupCoords, destinationCoords, vehicleType = 'standard', surgeType = 'normal') => {
    if (!pickupCoords || !destinationCoords) {
      setFareData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, calculate instantly on client-side for immediate UI feedback
      const instantFare = fareCalculator.calculateFare(pickupCoords, destinationCoords, vehicleType, surgeType);
      setFareData(instantFare);

      // Then sync with server for accurate calculation
      const serverFare = await placesService.calculateFareEstimate(
        pickupCoords,
        destinationCoords,
        vehicleType,
        surgeType
      );

      // Update with server response (should be the same, but ensures consistency)
      setFareData(serverFare);

    } catch (err) {
      console.error('Fare calculation error:', err);

      // If server fails, keep the client-side calculation
      if (!fareData) {
        // Try client-side calculation as fallback
        try {
          const fallbackFare = fareCalculator.calculateFare(pickupCoords, destinationCoords, vehicleType, surgeType);
          setFareData(fallbackFare);
          setError('Using estimated fare (server unavailable)');
        } catch (fallbackErr) {
          setError(err.message || 'Failed to calculate fare');
          setFareData(null);
        }
      } else {
        setError('Fare calculation may be inaccurate (server unavailable)');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get fare ranges for different vehicle types
  const getFareRanges = async (pickupCoords, destinationCoords) => {
    if (!pickupCoords || !destinationCoords) {
      return null;
    }

    try {
      // Try server first
      const ranges = await placesService.getFareRanges(pickupCoords, destinationCoords);
      return ranges;
    } catch (err) {
      console.error('Fare ranges error:', err);

      // Fallback to client-side calculation
      try {
        return fareCalculator.getFareRanges(pickupCoords, destinationCoords);
      } catch (fallbackErr) {
        console.error('Client-side fare ranges calculation failed:', fallbackErr);
        return null;
      }
    }
  };

  return {
    fareData,
    loading,
    error,
    calculateFare,
    getFareRanges
  };
};