import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import { useSocket } from '../context/SocketContext';

const RealtimeMap = ({ trips, className = "h-96 w-full rounded-lg" }) => {
  const { isLoaded, google } = useGoogleMaps();
  const { socket } = useSocket();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const markersRef = useRef(new Map());

  useEffect(() => {
    if (!isLoaded || !google || !mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 13.4549, lng: -16.5790 }, // Gambia center
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });

    setMap(mapInstance);

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current.clear();
    };
  }, [isLoaded, google]);

  const updateDriverMarker = React.useCallback((driverId, latitude, longitude) => {
    if (!map || !google) return;

    const markerKey = `driver-${driverId}`;
    const existingMarker = markersRef.current.get(markerKey);

    if (existingMarker) {
      existingMarker.setPosition({ lat: latitude, lng: longitude });
    } else {
      const driverMarker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map,
        title: `Driver ${driverId}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3B82F6"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      });
      markersRef.current.set(markerKey, driverMarker);
    }
  }, [map, google]);

  useEffect(() => {
    if (!map || !socket) return;

    const handleLocationUpdate = (data) => {
      updateDriverMarker(data.driverId, data.latitude, data.longitude);
    };

    socket.on('admin:driver:location:updated', handleLocationUpdate);

    // Get initial driver locations
    socket.emit('admin:monitor:drivers');

    socket.on('admin:drivers:locations', (allLocations) => {
      allLocations.forEach(loc => {
        if (loc.latitude && loc.longitude) {
          updateDriverMarker(loc.driverId, loc.latitude, loc.longitude);
        }
      });
    });

    return () => {
      socket.off('admin:driver:location:updated', handleLocationUpdate);
      socket.off('admin:drivers:locations');
    };
  }, [map, socket, updateDriverMarker]);

  useEffect(() => {
    if (!map || !trips || !google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();

    const newMarkers = markersRef.current;

    // Add markers for each active trip
    trips.forEach(trip => {
      // Pickup location marker
      if (trip.pickupLocation?.coordinates) {
        const pickupMarker = new google.maps.Marker({
          position: {
            lat: trip.pickupLocation.coordinates.latitude,
            lng: trip.pickupLocation.coordinates.longitude
          },
          map,
          title: `Pickup: ${trip.pickupLocation.address}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#10B981"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32)
          }
        });
        newMarkers.set(`pickup-${trip._id}`, pickupMarker);
      }

      // Destination location marker
      if (trip.destinationLocation?.coordinates) {
        const destinationMarker = new google.maps.Marker({
          position: {
            lat: trip.destinationLocation.coordinates.latitude,
            lng: trip.destinationLocation.coordinates.longitude
          },
          map,
          title: `Destination: ${trip.destinationLocation.address}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EF4444"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32)
          }
        });
        newMarkers.set(`destination-${trip._id}`, destinationMarker);
      }

      // Driver location marker (if available)
      if (trip.driverLocation && trip.driver?._id) {
        const driverId = trip.driver._id.toString();
        updateDriverMarker(
          driverId,
          trip.driverLocation.latitude,
          trip.driverLocation.longitude
        );
      }
    });

    // Fit map to show all markers
    if (newMarkers.size > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const pos = marker.getPosition();
        if (pos) bounds.extend(pos);
      });
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        const listener = google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 15) map.setZoom(15);
          google.maps.event.removeListener(listener);
        });
      }
    }
  }, [map, trips, google, updateDriverMarker]);

  if (!isLoaded) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center rounded-lg`}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
};

export default RealtimeMap;
