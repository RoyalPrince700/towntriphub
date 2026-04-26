import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Career from './pages/Career.jsx';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import VerifyEmailInstructions from './pages/VerifyEmailInstructions.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import DriverDashboard from './pages/DriverDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LogisticsDashboard from './pages/LogisticsDashboard.jsx';
import DriverRegistration from './pages/DriverRegistration.jsx';
import LogisticsPersonnelRegistration from './pages/LogisticsPersonnelRegistration.jsx';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { GoogleMapsProvider } from './context/GoogleMapsContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BookingDetails from './pages/BookingDetails.jsx';

// Component to route users to appropriate dashboard based on role
function RoleBasedDashboard() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'driver') {
    return <DriverDashboard />;
  }

  if (user?.role === 'logistics') {
    return <LogisticsDashboard />;
  }

  // Default to user dashboard for user role
  return <UserDashboard />;
}

function App() {
  return (
    <SocketProvider>
      <GoogleMapsProvider>
        <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/careers" element={<Career />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email-instructions" element={<VerifyEmailInstructions />} />
          <Route path="/driver/register" element={<DriverRegistration />} />
          <Route path="/logistics/register" element={<LogisticsPersonnelRegistration />} />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute roles={["user", "admin", "driver", "logistics"]}>
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          {/* Dashboard routes - role-based routing */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["user", "admin", "driver", "logistics"]}>
                <RoleBasedDashboard />
              </ProtectedRoute>
            }
          />

        <Route
          path="/logistics/dashboard"
          element={
            <ProtectedRoute roles={["logistics"]}>
              <LogisticsDashboard />
            </ProtectedRoute>
          }
        />

          {/* Direct admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Legacy route redirects */}
          <Route
            path="/driver"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </BrowserRouter>
        </AuthProvider>
      </GoogleMapsProvider>
    </SocketProvider>
  );
}

export default App;
