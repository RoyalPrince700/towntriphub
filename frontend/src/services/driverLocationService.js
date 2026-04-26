export class DriverLocationService {
  constructor(socket) {
    this.socket = socket;
    this.watchId = null;
    this.isTracking = false;
  }

  startLocationTracking(driverId) {
    if (!navigator.geolocation || this.isTracking) return;

    this.isTracking = true;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Send location update to server
        this.socket.emit('driver:location:update', {
          driverId,
          latitude,
          longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  stopLocationTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
    }
  }

  trackDriver(driverId, onLocationUpdate) {
    // Join driver's location updates
    this.socket.emit('rider:track:driver', { driverId });

    // Listen for location updates
    this.socket.on('driver:location:updated', onLocationUpdate);
    this.socket.on('driver:location:current', onLocationUpdate);

    // Return cleanup function
    return () => {
      this.socket.off('driver:location:updated', onLocationUpdate);
      this.socket.off('driver:location:current', onLocationUpdate);
    };
  }

  updateDriverStatus(driverId, status, bookingId = null) {
    this.socket.emit('driver:status:update', {
      driverId,
      status,
      bookingId
    });
  }
}
