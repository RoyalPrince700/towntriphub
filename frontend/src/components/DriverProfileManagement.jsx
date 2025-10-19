import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Car,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Shield,
  Camera,
  Save,
  Edit3,
  CheckCircle
} from 'lucide-react';

const DriverProfileManagement = ({ onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [driverProfile, setDriverProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    serviceAreas: [],
    preferences: {
      acceptsDeliveries: true,
      acceptsRides: true,
      operatingHours: {
        start: '06:00',
        end: '22:00',
      },
      languages: ['English'],
    },
    currentLocation: {
      address: '',
      coordinates: { latitude: null, longitude: null },
    },
  });

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/drivers/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch driver profile');
      }

      const data = await response.json();
      setDriverProfile(data.data);
      setFormData({
        phoneNumber: data.data.phoneNumber || '',
        emergencyContact: data.data.emergencyContact || {
          name: '',
          phone: '',
          relationship: '',
        },
        serviceAreas: data.data.serviceAreas || [],
        preferences: data.data.preferences || {
          acceptsDeliveries: true,
          acceptsRides: true,
          operatingHours: { start: '06:00', end: '22:00' },
          languages: ['English'],
        },
        currentLocation: data.data.currentLocation || {
          address: '',
          coordinates: { latitude: null, longitude: null },
        },
      });
    } catch (error) {
      console.error('Error fetching driver profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleOperatingHoursChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        operatingHours: {
          ...prev.preferences.operatingHours,
          [field]: value,
        },
      },
    }));
  };

  const handleServiceAreaChange = (area) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/drivers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setDriverProfile(data.data);
      setIsEditing(false);

      if (onUpdate) {
        onUpdate(data.data);
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (!driverProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Profile not found. Please register as a driver first.</p>
      </div>
    );
  }

  const gambianAreas = [
    'Banjul', 'Serrekunda', 'Brikama', 'Bakau', 'Kanifing',
    'Basse Santa Su', 'Farafenni', 'Lamin', 'Sukuta', 'Gunjur'
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Driver Profile</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+220 XXX XXXX"
                />
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Emergency Contact</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Service Areas
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gambianAreas.map((area) => (
                <label key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.serviceAreas.includes(area)}
                    onChange={() => handleServiceAreaChange(area)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Preferences
            </h4>

            <div className="space-y-4">
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.acceptsRides}
                    onChange={(e) => handlePreferenceChange('acceptsRides', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Accept ride bookings</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.acceptsDeliveries}
                    onChange={(e) => handlePreferenceChange('acceptsDeliveries', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Accept delivery bookings</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Hours Start
                  </label>
                  <input
                    type="time"
                    value={formData.preferences.operatingHours.start}
                    onChange={(e) => handleOperatingHoursChange('start', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Hours End
                  </label>
                  <input
                    type="time"
                    value={formData.preferences.operatingHours.end}
                    onChange={(e) => handleOperatingHoursChange('end', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium">{driverProfile.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="font-medium">{driverProfile.licenseNumber}</p>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Emergency Contact</h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{driverProfile.emergencyContact?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{driverProfile.emergencyContact?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Relationship</p>
                    <p className="font-medium">{driverProfile.emergencyContact?.relationship || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Vehicle Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium">
                  {driverProfile.vehicle.make} {driverProfile.vehicle.model} ({driverProfile.vehicle.year})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plate Number</p>
                <p className="font-medium">{driverProfile.vehicle.plateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className="font-medium">{driverProfile.vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-medium">{driverProfile.vehicle.seatingCapacity} seats</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Air Conditioning</p>
                <p className="font-medium">{driverProfile.vehicle.hasAC ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registration</p>
                <p className="font-medium">{driverProfile.vehicle.registrationNumber}</p>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Service Information
            </h4>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Service Areas</p>
                <div className="flex flex-wrap gap-2">
                  {driverProfile.serviceAreas.map((area, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Accepts Rides</p>
                  <p className="font-medium">{driverProfile.preferences?.acceptsRides ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Accepts Deliveries</p>
                  <p className="font-medium">{driverProfile.preferences?.acceptsDeliveries ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Operating Hours</p>
                  <p className="font-medium">
                    {driverProfile.preferences?.operatingHours?.start} - {driverProfile.preferences?.operatingHours?.end}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    driverProfile.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : driverProfile.status === 'pending_approval'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {driverProfile.status === 'pending_approval' ? 'Pending Approval' :
                     driverProfile.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfileManagement;
