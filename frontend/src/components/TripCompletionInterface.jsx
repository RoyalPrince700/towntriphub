import React, { useState } from 'react';
import { CheckCircle, DollarSign, CreditCard, MessageSquare } from 'lucide-react';

const TripCompletionInterface = ({ booking, onComplete, onRate }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [confirming, setConfirming] = useState(false);

  const handlePaymentConfirmation = async () => {
    setConfirming(true);
    try {
      // TODO: Implement payment confirmation API call
      console.log('Confirming payment for booking:', booking._id, paymentMethod);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onComplete(booking._id, paymentMethod);
    } catch (error) {
      console.error('Payment confirmation failed:', error);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Trip Completed!</h3>
        <p className="text-gray-600 mt-2">
          Your {booking.type} to {booking.destinationLocation.address} has been completed successfully.
        </p>
      </div>

      {/* Trip Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Trip Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Distance:</span>
            <span className="font-medium">{booking.distance || 'N/A'} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{booking.actualDuration || booking.estimatedDuration || 'N/A'} min</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-green-600 border-t pt-2 mt-2">
            <span>Total Fare:</span>
            <span>GMD {booking.price?.amount || 'TBD'}</span>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Payment Confirmation
        </h4>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="radio"
              id="cash"
              name="payment"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="cash" className="ml-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">Cash Payment</div>
                <div className="text-sm text-gray-600">Pay directly to driver</div>
              </div>
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="radio"
              id="transfer"
              name="payment"
              value="transfer"
              checked={paymentMethod === 'transfer'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="transfer" className="ml-3 flex items-center">
              <div className="w-5 h-5 mr-2 flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">₵</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Bank Transfer</div>
                <div className="text-sm text-gray-600">Transfer to driver account</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handlePaymentConfirmation}
          disabled={confirming}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {confirming ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirm Payment
            </>
          )}
        </button>

        <button
          onClick={() => onRate(booking)}
          className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Rate & Review
        </button>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        By confirming payment, you acknowledge that the service has been completed to your satisfaction.
      </p>
    </div>
  );
};

export default TripCompletionInterface;
