import React, { useState } from 'react';
import { Phone, X, Check } from 'lucide-react';

const PhoneNumberModal = ({ isOpen, onClose, onSave, currentPhone = '' }) => {
  const [phoneNumber, setPhoneNumber] = useState(currentPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phone) => {
    // Basic phone validation - adjust regex as needed for Gambia phone numbers
    const phoneRegex = /^(\+220|220)?[2-9]\d{6}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const formatPhone = (phone) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format as +220 XXX XXXX
    if (cleaned.length >= 7) {
      return `+220 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)}`;
    }

    return phone;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setError('');
  };

  const handleSave = async () => {
    const cleanedPhone = phoneNumber.replace(/\s+/g, '');

    if (!cleanedPhone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    if (!validatePhone(cleanedPhone)) {
      setError('Please enter a valid Gambian phone number (+220 XXX XXXX or 220XXXXXXX)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSave(cleanedPhone);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save phone number');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 py-6">
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Add Phone Number</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                <Phone size={32} />
              </div>
              <p className="text-sm font-bold text-gray-600 leading-relaxed">
                We need your phone number to contact you about your bookings and provide updates.
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center text-rose-600 animate-in fade-in">
                <X size={20} className="mr-3 shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  placeholder="+220 XXX XXXX"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-200 transition-all text-sm font-bold"
                />
              </div>
              <p className="text-[10px] font-medium text-gray-400 ml-1">
                Format: +220 XXX XXXX (e.g., +220 123 4567)
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!phoneNumber.trim() || loading}
                className="flex-1 bg-purple-600 text-white py-4 rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-purple-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberModal;