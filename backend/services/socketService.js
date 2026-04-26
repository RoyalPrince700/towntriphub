const socketIo = require('socket.io');

class SocketService {
  constructor() {
    this.io = null;
    this.activeConnections = new Map(); // driverId -> socket
    this.driverLocations = new Map(); // driverId -> {lat, lng, timestamp}
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Driver location updates
      socket.on('driver:location:update', (data) => {
        this.handleDriverLocationUpdate(socket, data);
      });

      // Rider tracking driver
      socket.on('rider:track:driver', (data) => {
        this.handleRiderTrackDriver(socket, data);
      });

      // Admin monitoring
      socket.on('admin:monitor:drivers', () => {
        this.handleAdminMonitorDrivers(socket);
      });

      // Driver status updates
      socket.on('driver:status:update', (data) => {
        this.handleDriverStatusUpdate(socket, data);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  handleDriverLocationUpdate(socket, data) {
    const { driverId, latitude, longitude } = data;

    if (!driverId || !latitude || !longitude) return;

    // Update driver's current location
    this.driverLocations.set(driverId, {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp: new Date(),
      socketId: socket.id
    });

    // Store socket connection for this driver
    this.activeConnections.set(driverId, socket);

    // Broadcast location to riders tracking this driver
    this.io.to(`driver:${driverId}`).emit('driver:location:updated', {
      driverId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp: new Date()
    });

    // Broadcast to admin dashboard
    this.io.to('admin:drivers').emit('admin:driver:location:updated', {
      driverId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp: new Date()
    });
  }

  handleRiderTrackDriver(socket, data) {
    const { driverId } = data;

    if (!driverId) return;

    // Join room for this driver's updates
    socket.join(`driver:${driverId}`);

    // Send current location if available
    const currentLocation = this.driverLocations.get(driverId);
    if (currentLocation) {
      socket.emit('driver:location:current', {
        driverId,
        ...currentLocation
      });
    }
  }

  handleAdminMonitorDrivers(socket) {
    socket.join('admin:drivers');

    // Send current locations of all drivers
    const allLocations = Array.from(this.driverLocations.entries()).map(([driverId, location]) => ({
      driverId,
      ...location
    }));

    socket.emit('admin:drivers:locations', allLocations);
  }

  handleDriverStatusUpdate(socket, data) {
    const { driverId, status, bookingId } = data;

    // Broadcast status change to relevant parties
    this.io.to(`driver:${driverId}`).emit('driver:status:changed', {
      driverId,
      status,
      bookingId,
      timestamp: new Date()
    });

    this.io.to('admin:drivers').emit('admin:driver:status:changed', {
      driverId,
      status,
      bookingId,
      timestamp: new Date()
    });
  }

  handleDisconnect(socket) {
    // Find and remove disconnected driver
    for (const [driverId, socketRef] of this.activeConnections.entries()) {
      if (socketRef === socket) {
        this.activeConnections.delete(driverId);
        this.driverLocations.delete(driverId);
        break;
      }
    }
  }

  // Method to get all active drivers (for admin dashboard)
  getActiveDrivers() {
    return Array.from(this.driverLocations.entries()).map(([driverId, location]) => ({
      driverId,
      ...location
    }));
  }

  // Method to get specific driver location
  getDriverLocation(driverId) {
    return this.driverLocations.get(driverId);
  }
}

module.exports = new SocketService();
