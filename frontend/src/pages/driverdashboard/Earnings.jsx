import React from 'react';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';

const Earnings = () => {
  return (
    <div className="space-y-6">
      {/* Earnings Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Earnings Summary</h2>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">This Week</h3>
            <p className="text-2xl font-bold text-green-600">GMD 450</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">This Month</h3>
            <p className="text-2xl font-bold text-blue-600">GMD 1,850</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Average/Day</h3>
            <p className="text-2xl font-bold text-yellow-600">GMD 65</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Total Earned</h3>
            <p className="text-2xl font-bold text-purple-600">GMD 12,450</p>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Breakdown</h2>
        <div className="space-y-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
            <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{day}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{8 + index} rides</span>
                <span className="font-medium text-green-600">GMD {(60 + index * 10)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Weekly Payment - Week 45</p>
              <p className="text-sm text-gray-600">October 7-13, 2025</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">GMD 380</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Paid
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Weekly Payment - Week 44</p>
              <p className="text-sm text-gray-600">September 30-October 6, 2025</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">GMD 420</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Paid
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
