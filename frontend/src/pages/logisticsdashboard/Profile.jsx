import React from 'react';
import { Settings, Truck, Package, FileText, Phone, Mail, AlertCircle } from 'lucide-react';

const Profile = ({ user, profile, loading }) => {
  const phone = profile?.phoneNumber || profile?.user?.phoneNumber || '—';
  const serviceAreas = profile?.serviceAreas || [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Logistics Profile</h2>
        <button className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      {loading && (
        <div className="flex items-center text-sm text-gray-500 mb-4">
          Loading profile...
        </div>
      )}

      {!loading && !profile && (
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
          No logistics profile found.
        </div>
      )}

      <div className="space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{user?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{phone}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <p className="text-gray-900 p-2 bg-gray-50 rounded-lg capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Logistics Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile?.businessName || '—'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">
                {profile?.businessAddress?.address || '—'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                {profile?.status || 'pending'}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            <Truck className="h-5 w-5 mr-2 text-green-600" />
            Service Areas
          </h3>
          {serviceAreas.length === 0 ? (
            <p className="text-sm text-gray-600">No service areas added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <span key={area} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>

        {profile?.emergencyContact && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-purple-600" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile.emergencyContact.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">{profile.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-6 mt-6">
          <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-indigo-600" />
            Contact
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {user?.email}
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              {phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
