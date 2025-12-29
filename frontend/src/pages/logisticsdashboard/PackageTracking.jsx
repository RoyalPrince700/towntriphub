import React, { useState } from 'react';
import { Package, MapPin, Clock, Eye, AlertCircle, CheckCircle, Truck, ArrowRight } from 'lucide-react';

const PackageTracking = ({ assignments = [], loading, onUpdateStatus }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-cyan-100 text-cyan-800';
      case 'driver_en_route':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-indigo-100 text-indigo-800';
      case 'driver_assigned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Delivered';
      case 'in_transit':
        return 'In Transit';
      case 'driver_en_route':
        return 'En Route';
      case 'picked_up':
        return 'Picked Up';
      case 'driver_assigned':
        return 'Assigned';
      default:
        return status?.replace('_', ' ') || 'Pending';
    }
  };

  const getNextStatus = (currentStatus) => {
    const transitions = {
      'driver_assigned': 'driver_en_route',
      'driver_en_route': 'picked_up',
      'picked_up': 'in_transit',
      'in_transit': 'completed',
    };
    return transitions[currentStatus];
  };

  const getNextStatusButtonText = (nextStatus) => {
    switch (nextStatus) {
      case 'driver_en_route': return 'Start En Route';
      case 'picked_up': return 'Mark as Picked Up';
      case 'in_transit': return 'Start Transit';
      case 'completed': return 'Mark as Completed';
      default: return 'Update Status';
    }
  };

  const handleStatusUpdate = async (bookingId, nextStatus) => {
    setUpdatingId(bookingId);
    try {
      await onUpdateStatus(bookingId, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Active Deliveries</h2>
          {loading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
              Refreshing...
            </div>
          )}
        </div>

        {assignments.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">No active deliveries assigned yet.</p>
            <p className="text-gray-500 text-sm mt-1">Once the admin assigns you a delivery, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((pkg) => {
              const nextStatus = getNextStatus(pkg.status);
              const isUpdating = updatingId === pkg._id;

              return (
                <div key={pkg._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                              <Package className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                #{pkg._id.slice(-8).toUpperCase()}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Order placed on {new Date(pkg.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(pkg.status)}`}>
                            {getStatusText(pkg.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                          <div className="flex items-start">
                            <div className="mt-1 mr-3 flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <div className="w-0.5 h-10 bg-gray-200 my-1"></div>
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            </div>
                            <div className="flex-1 space-y-4">
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup From</p>
                                <p className="text-sm font-medium text-gray-800">{pkg.pickupLocation?.address}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deliver To</p>
                                <p className="text-sm font-medium text-gray-800">{pkg.destinationLocation?.address}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Package Details</p>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Items:</span> {pkg.packageDetails?.description || 'Not specified'}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Weight:</span> {pkg.packageDetails?.weight ? `${pkg.packageDetails.weight} kg` : 'N/A'}
                              </p>
                              {pkg.packageDetails?.isFragile && (
                                <p className="text-xs font-bold text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded mt-1">
                                  ⚠️ FRAGILE ITEM
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg mb-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                              {pkg.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-indigo-900">{pkg.user?.name}</p>
                              <p className="text-[10px] text-indigo-700">{pkg.user?.phoneNumber || 'No phone'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-indigo-900 uppercase">Payment</p>
                            <p className="text-xs font-bold text-indigo-700">D{pkg.price?.amount || 0} • {pkg.payment?.method?.toUpperCase() || 'CASH'}</p>
                          </div>
                        </div>

                        {/* Status Update Button */}
                        {nextStatus && (
                          <button
                            onClick={() => handleStatusUpdate(pkg._id, nextStatus)}
                            disabled={isUpdating}
                            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
                              isUpdating 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-95'
                            }`}
                          >
                            {isUpdating ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <span>{getNextStatusButtonText(nextStatus)}</span>
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </button>
                        )}

                        {pkg.status === 'completed' && (
                          <div className="flex items-center justify-center space-x-2 py-3 bg-green-50 text-green-700 rounded-xl font-bold">
                            <CheckCircle className="h-5 w-5" />
                            <span>Delivery Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageTracking;
