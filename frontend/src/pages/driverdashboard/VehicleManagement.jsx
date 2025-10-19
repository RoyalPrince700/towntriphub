import React from 'react';
import { Car, Settings, FileText, AlertTriangle, CheckCircle, Camera } from 'lucide-react';

const VehicleManagement = () => {
  return (
    <div className="space-y-6">
      {/* Vehicle Information */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Vehicle Information</h2>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Update Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <Car className="h-16 w-16 text-gray-400" />
            </div>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mx-auto block">
              <Camera className="h-4 w-4 mr-2" />
              Upload Photo
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Toyota</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">Corolla</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">2020</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">White</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">ABC 123 G</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">1HGBH41JXMN109186</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Status */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Registration</h3>
            <p className="text-sm text-gray-600">Valid until Dec 2026</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Insurance</h3>
            <p className="text-sm text-gray-600">Valid until Mar 2026</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Inspection</h3>
            <p className="text-sm text-gray-600">Due in 2 weeks</p>
          </div>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Oil Change</p>
                <p className="text-sm text-gray-600">Due at 50,000 km</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Upcoming
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Tire Rotation</p>
                <p className="text-sm text-gray-600">Completed 2 weeks ago</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Brake Inspection</p>
                <p className="text-sm text-gray-600">Due at 60,000 km</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Due Soon
            </span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Registration</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Valid
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Expires: December 2026</p>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View Document
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Insurance</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Valid
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Expires: March 2026</p>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View Document
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-yellow-600 mr-3" />
                <span className="font-medium text-gray-900">Inspection</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Expires Soon
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Expires: November 2025</p>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View Document
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium text-gray-900">Permit</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Valid
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Expires: June 2026</p>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
