require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const passport = require('./middleware/passport');


// Import routes (to be created later)
const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const driverRoutes = require('./routes/drivers');
// const tripRoutes = require('./routes/trips');
// const paymentRoutes = require('./routes/payments');
// const adminRoutes = require('./routes/admin');

// Import error handling middleware
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// Trust proxy (important for rate limiting and getting real IP)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// FedCM requires explicit permission in some browsers
app.use((req, res, next) => {
  // Allow FedCM on localhost and configured frontend
  const fedcmAllowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ].filter(Boolean);
  const origin = req.headers.origin;
  if (origin && fedcmAllowedOrigins.includes(origin)) {
    res.setHeader('Permissions-Policy', 'identity-credentials-get=(self)');
  }
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      console.log('[CORS] no-origin -> allowed');
      return callback(null, true);
    }

    // In development, allow any http(s) origin on localhost/127.0.0.1:*
    const devWildcard = (process.env.NODE_ENV !== 'production') && origin && /^(http|https):\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000', // development
      'http://localhost:3001', // development alternative
      'http://localhost:5173', // Vite default
      'http://127.0.0.1:5173', // Vite default (loopback)
      // Common LAN IPs for local testing; adjust as needed
      'http://192.168.0.100:5173',
      'http://192.168.1.100:5173',
      'http://192.168.0.101:5173',
      'http://192.168.1.101:5173',
    ].filter(Boolean);

    if (devWildcard || allowedOrigins.indexOf(origin) !== -1) {
      console.log('[CORS]', origin, '-> allowed');
      callback(null, true);
    } else {
      console.warn('[CORS]', origin, '-> denied');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled for all routes (useful for debugging CORS)
app.options('*', cors(corsOptions));

// Initialize Passport (no sessions)
app.use(passport.initialize());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TownTripHub API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to TownTripHub API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Mount routes (to be uncommented as routes are created)
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/drivers', driverRoutes);
// app.use('/api/trips', tripRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Received SIGINT, closing MongoDB connection...');
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Start server function
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`🚗 TownTripHub Server Started!`);
      console.log(`✅ Connected to port: ${PORT}`);
      console.log(`✅ MongoDB connected`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Unhandled Rejection: ${err.message}`);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
