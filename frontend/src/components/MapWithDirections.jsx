import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import { placesService } from '../services/placesService';
import { MapPin, AlertCircle } from 'lucide-react';

const MapWithDirections = ({
  pickupCoords,
  destinationCoords,
  driverLocation = null, // Optional: driver's current position for live tracking
  className = "h-96 w-full rounded-lg",
  showDriverMarker = true
}) => {
  const { isLoaded, google } = useGoogleMaps();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const driverMarkerRef = useRef(null);
  const [error, setError] = useState(null);
  const [hasLoadedSuccessfully, setHasLoadedSuccessfully] = useState(false);

  useEffect(() => {
    if (!isLoaded || !google || !mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: 13.45, lng: -16.68 }, // Centered on Serrekunda, Gambia
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    const renderer = new google.maps.DirectionsRenderer({
      map: mapInstance,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4F46E5',
        strokeWeight: 6,
        strokeOpacity: 0.85
      },
      markerOptions: {
        visible: true
      }
    });

    setMap(mapInstance);
    setDirectionsRenderer(renderer);

    return () => {
      if (renderer) renderer.setMap(null);
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null);
        driverMarkerRef.current = null;
      }
    };
  }, [isLoaded, google]);

  useEffect(() => {
    const loadDirections = () => {
      if (!map || !directionsRenderer || !pickupCoords || !destinationCoords || !google) return;

      try {
        const directionsService = new google.maps.DirectionsService();
        const request = {
          origin: new google.maps.LatLng(pickupCoords.latitude, pickupCoords.longitude),
          destination: new google.maps.LatLng(destinationCoords.latitude, destinationCoords.longitude),
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: false
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            setHasLoadedSuccessfully(true);
            setError(null);

            const bounds = new google.maps.LatLngBounds();
            bounds.extend(new google.maps.LatLng(pickupCoords.latitude, pickupCoords.longitude));
            bounds.extend(new google.maps.LatLng(destinationCoords.latitude, destinationCoords.longitude));

            if (driverLocation?.latitude && driverLocation?.longitude) {
              bounds.extend(new google.maps.LatLng(driverLocation.latitude, driverLocation.longitude));
            }

            map.fitBounds(bounds, { padding: 80 });
          } else {
            console.warn('Directions request failed with status:', status);
            setError(`Directions API Error: ${status}`);
          }
        });
      } catch (err) {
        console.error('Directions error:', err);
        setError(err.message || 'Failed to calculate route');
      }
    };

    // Small delay to ensure map is fully initialized
    const timer = setTimeout(loadDirections, 800);
    return () => clearTimeout(timer);
  }, [map, directionsRenderer, pickupCoords, destinationCoords, driverLocation, google]);

  // Update driver live marker
  useEffect(() => {
    if (!map || !google || !showDriverMarker || !driverLocation?.latitude || !driverLocation?.longitude) {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null);
        driverMarkerRef.current = null;
      }
      return;
    }

    const position = { lat: driverLocation.latitude, lng: driverLocation.longitude };

    if (driverMarkerRef.current) {
      driverMarkerRef.current.setPosition(position);
    } else {
      driverMarkerRef.current = new google.maps.Marker({
        position,
        map,
        title: 'Driver Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(36, 36)
        },
        zIndex: 1000
      });
    }
  }, [map, google, driverLocation, showDriverMarker]);

  // Show error state with fallback image
  if (error || (!isLoaded && !hasLoadedSuccessfully)) {
    return (
      <div className={`${className} bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 flex flex-col items-center justify-center relative`}>
        {/* Fallback Map Image */}
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=Serrekunda,Gambia&zoom=13&size=800x500&scale=2&maptype=roadmap&markers=color:red%7Clabel:S%7CSerrekunda&markers=color:blue%7Clabel:K%7CKololi&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo'}`}
          alt="Serrekunda to Kololi Map - The Gambia"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          onError={(e) => {
            e.target.src = 'https://picsum.photos/id/1015/800/500';
          }}
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center px-6 max-w-xs">
            <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
              {error ? (
                <AlertCircle className="w-8 h-8 text-amber-400" />
              ) : (
                <MapPin className="w-8 h-8 text-white" />
              )}
            </div>

            <h4 className="text-white font-semibold text-lg mb-2">
              {error ? 'Map Temporarily Unavailable' : 'Loading Live Map'}
            </h4>

            <p className="text-gray-300 text-sm leading-relaxed">
              {error
                ? 'We encountered an issue loading the live map. Showing static view of Serrekunda to Kololi route instead.'
                : 'Loading interactive map with live driver location...'}
            </p>

            {error && (
              <div className="mt-4 text-[10px] text-gray-400 bg-black/30 p-3 rounded-xl">
                Error: {error}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Label */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          SERREKUNDA → KOLOLI
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
};

export default MapWithDirections;
