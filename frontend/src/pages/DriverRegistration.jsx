import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Car,
  User,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Upload,
  Phone,
  Mail
} from 'lucide-react';

const DriverRegistration = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    dateOfBirth: '',
    phoneNumber: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    // Vehicle Information
    vehicle: {
      make: '',
      model: '',
      year: '',
      color: '',
      plateNumber: '',
      vehicleType: 'car',
      seatingCapacity: '',
      hasAC: false,
      registrationNumber: '',
      registrationExpiry: '',
      insuranceNumber: '',
      insuranceExpiry: '',
    },
    // Service Preferences
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
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));

    // Clear error
    if (errors[`${parent}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${parent}.${field}`]: null,
      }));
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));

    if (errors[`emergencyContact.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`emergencyContact.${field}`]: null,
      }));
    }
  };

  const handleVehicleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      vehicle: {
        ...prev.vehicle,
        [field]: value,
      },
    }));

    if (errors[`vehicle.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`vehicle.${field}`]: null,
      }));
    }
  };

  const handleServiceAreaChange = (area) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area],
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

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        else {
          const birthDate = new Date(formData.dateOfBirth);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) newErrors.dateOfBirth = 'You must be at least 18 years old';
        }

        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
          newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (!formData.licenseNumber.trim()) {
          newErrors.licenseNumber = 'License number is required';
        } else if (formData.licenseNumber.length < 5 || formData.licenseNumber.length > 20) {
          newErrors.licenseNumber = 'License number must be 5-20 characters';
        }

        if (!formData.licenseExpiryDate) {
          newErrors.licenseExpiryDate = 'License expiry date is required';
        } else {
          const expiryDate = new Date(formData.licenseExpiryDate);
          const today = new Date();
          if (expiryDate <= today) {
            newErrors.licenseExpiryDate = 'License expiry date must be in the future';
          }
        }

        if (!formData.emergencyContact.name.trim()) {
          newErrors['emergencyContact.name'] = 'Emergency contact name is required';
        }
        if (!formData.emergencyContact.phone) {
          newErrors['emergencyContact.phone'] = 'Emergency contact phone is required';
        }
        if (!formData.emergencyContact.relationship.trim()) {
          newErrors['emergencyContact.relationship'] = 'Relationship is required';
        }
        break;

      case 2: // Vehicle Information
        if (!formData.vehicle.make.trim()) newErrors['vehicle.make'] = 'Vehicle make is required';
        if (!formData.vehicle.model.trim()) newErrors['vehicle.model'] = 'Vehicle model is required';
        if (!formData.vehicle.year) newErrors['vehicle.year'] = 'Vehicle year is required';
        else if (formData.vehicle.year < 2000 || formData.vehicle.year > new Date().getFullYear() + 1) {
          newErrors['vehicle.year'] = 'Please enter a valid year';
        }

        if (!formData.vehicle.color.trim()) newErrors['vehicle.color'] = 'Vehicle color is required';
        if (!formData.vehicle.plateNumber.trim()) newErrors['vehicle.plateNumber'] = 'Plate number is required';
        if (!formData.vehicle.seatingCapacity || formData.vehicle.seatingCapacity < 1) {
          newErrors['vehicle.seatingCapacity'] = 'Valid seating capacity is required';
        }

        if (!formData.vehicle.registrationNumber.trim()) {
          newErrors['vehicle.registrationNumber'] = 'Registration number is required';
        }
        if (!formData.vehicle.registrationExpiry) {
          newErrors['vehicle.registrationExpiry'] = 'Registration expiry date is required';
        }
        if (!formData.vehicle.insuranceNumber.trim()) {
          newErrors['vehicle.insuranceNumber'] = 'Insurance number is required';
        }
        if (!formData.vehicle.insuranceExpiry) {
          newErrors['vehicle.insuranceExpiry'] = 'Insurance expiry date is required';
        }
        break;

      case 3: // Service Preferences
        if (formData.serviceAreas.length === 0) {
          newErrors.serviceAreas = 'Please select at least one service area';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError(null);

    console.log('=== DRIVER REGISTRATION SUBMIT ===');
    console.log('Form Data:', JSON.stringify(formData, null, 2));
    console.log('Token:', token);

    // Convert string numbers to actual numbers for backend validation
    const submissionData = {
      ...formData,
      vehicle: {
        ...formData.vehicle,
        year: parseInt(formData.vehicle.year, 10),
        seatingCapacity: parseInt(formData.vehicle.seatingCapacity, 10),
      },
    };

    console.log('Submission Data (after conversion):', JSON.stringify(submissionData, null, 2));

    try {
      const response = await fetch('/api/drivers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      console.log('Response Status:', response.status);
      console.log('Response Data:', data);

      if (!response.ok) {
        console.error('Registration failed:', data);
        if (data.errors && Array.isArray(data.errors)) {
          console.error('Validation Errors:', data.errors);
          const errorMessages = data.errors.map(err => `${err.path}: ${err.msg}`).join(', ');
          throw new Error(errorMessages || 'Validation failed');
        }
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your driver registration has been submitted successfully. Our admin team will review your application within 24-48 hours.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will receive an email notification once your application is approved.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Vehicle Info', icon: Car },
    { number: 3, title: 'Preferences', icon: MapPin },
    { number: 4, title: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Driver</h1>
          <p className="mt-2 text-gray-600">
            Join our network of professional drivers and start earning
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  step.number <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step.number < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {steps.map((step) => (
              <div key={step.number} className="text-center mx-8">
                <p className={`text-sm font-medium ${
                  step.number <= currentStep ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="+220 XXX XXXX"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver's License Number *
                    </label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value.toUpperCase())}
                      placeholder="DL123456789"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.licenseNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Expiry Date *
                    </label>
                    <input
                      type="date"
                      value={formData.licenseExpiryDate}
                      onChange={(e) => handleInputChange('licenseExpiryDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.licenseExpiryDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.licenseExpiryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.licenseExpiryDate}</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact.name}
                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors['emergencyContact.name'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors['emergencyContact.name'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.name']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors['emergencyContact.phone'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors['emergencyContact.phone'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.phone']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                        placeholder="e.g., Parent, Spouse, Sibling"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors['emergencyContact.relationship'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors['emergencyContact.relationship'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.relationship']}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Vehicle Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Make *
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle.make}
                      onChange={(e) => handleVehicleChange('make', e.target.value)}
                      placeholder="e.g., Toyota"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors['vehicle.make'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['vehicle.make'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['vehicle.make']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Model *
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle.model}
                      onChange={(e) => handleVehicleChange('model', e.target.value)}
                      placeholder="e.g., Corolla"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors['vehicle.model'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['vehicle.model'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['vehicle.model']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={formData.vehicle.year}
                      onChange={(e) => handleVehicleChange('year', e.target.value)}
                      placeholder="2020"
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors['vehicle.year'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['vehicle.year'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['vehicle.year']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color *
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle.color}
                      onChange={(e) => handleVehicleChange('color', e.target.value)}
                      placeholder="e.g., White"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors['vehicle.color'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['vehicle.color'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['vehicle.color']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plate Number *
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle.plateNumber}
                      onChange={(e) => handleVehicleChange('plateNumber', e.target.value.toUpperCase())}
                      placeholder="BJL 1234 A"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors['vehicle.plateNumber'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['vehicle.plateNumber'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['vehicle.plateNumber']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Type *
                    </label>
                    <select
                      value={formData.vehicle.vehicleType}
                      onChange={(e) => handleVehicleChange('vehicleType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="truck">Truck</option>
                      <option value="van">Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seating Capacity *
                    </label>
                    <input
                      type="number"
                      value={formData.vehicle.seatingCapacity}
                      onChange={(e) => handleVehicleChange('seatingCapacity', e.target.value)}
                      placeholder="4"
                      min="1"
                      max="50"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors['vehicle.seatingCapacity'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['vehicle.seatingCapacity'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['vehicle.seatingCapacity']}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasAC"
                      checked={formData.vehicle.hasAC}
                      onChange={(e) => handleVehicleChange('hasAC', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasAC" className="ml-2 text-sm text-gray-700">
                      Vehicle has Air Conditioning
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Registration & Insurance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        value={formData.vehicle.registrationNumber}
                        onChange={(e) => handleVehicleChange('registrationNumber', e.target.value.toUpperCase())}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors['vehicle.registrationNumber'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors['vehicle.registrationNumber'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['vehicle.registrationNumber']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Expiry *
                      </label>
                      <input
                        type="date"
                        value={formData.vehicle.registrationExpiry}
                        onChange={(e) => handleVehicleChange('registrationExpiry', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors['vehicle.registrationExpiry'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors['vehicle.registrationExpiry'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['vehicle.registrationExpiry']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Number *
                      </label>
                      <input
                        type="text"
                        value={formData.vehicle.insuranceNumber}
                        onChange={(e) => handleVehicleChange('insuranceNumber', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors['vehicle.insuranceNumber'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors['vehicle.insuranceNumber'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['vehicle.insuranceNumber']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Expiry *
                      </label>
                      <input
                        type="date"
                        value={formData.vehicle.insuranceExpiry}
                        onChange={(e) => handleVehicleChange('insuranceExpiry', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors['vehicle.insuranceExpiry'] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors['vehicle.insuranceExpiry'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['vehicle.insuranceExpiry']}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Service Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Service Preferences</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Service Areas * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Banjul', 'Serrekunda', 'Brikama', 'Bakau', 'Kanifing', 'Basse Santa Su'].map((area) => (
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
                  {errors.serviceAreas && (
                    <p className="mt-1 text-sm text-red-600">{errors.serviceAreas}</p>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Service Types</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.preferences.acceptsRides}
                        onChange={(e) => handlePreferenceChange('acceptsRides', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Accept ride bookings (passengers)</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.preferences.acceptsDeliveries}
                        onChange={(e) => handlePreferenceChange('acceptsDeliveries', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Accept delivery bookings (packages)</span>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Operating Hours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.preferences.operatingHours.start}
                        onChange={(e) => handleNestedInputChange('preferences', 'operatingHours', {
                          ...formData.preferences.operatingHours,
                          start: e.target.value,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.preferences.operatingHours.end}
                        onChange={(e) => handleNestedInputChange('preferences', 'operatingHours', {
                          ...formData.preferences.operatingHours,
                          end: e.target.value,
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Review Your Information</h3>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600">Date of Birth:</span> {formData.dateOfBirth}</div>
                      <div><span className="text-gray-600">Phone:</span> {formData.phoneNumber}</div>
                      <div><span className="text-gray-600">License Number:</span> {formData.licenseNumber}</div>
                      <div><span className="text-gray-600">License Expiry:</span> {formData.licenseExpiryDate}</div>
                      <div><span className="text-gray-600">Emergency Contact:</span> {formData.emergencyContact.name}</div>
                      <div><span className="text-gray-600">Relationship:</span> {formData.emergencyContact.relationship}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Vehicle Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600">Vehicle:</span> {formData.vehicle.make} {formData.vehicle.model} ({formData.vehicle.year})</div>
                      <div><span className="text-gray-600">Color:</span> {formData.vehicle.color}</div>
                      <div><span className="text-gray-600">Plate Number:</span> {formData.vehicle.plateNumber}</div>
                      <div><span className="text-gray-600">Type:</span> {formData.vehicle.vehicleType}</div>
                      <div><span className="text-gray-600">Capacity:</span> {formData.vehicle.seatingCapacity} seats</div>
                      <div><span className="text-gray-600">Air Conditioning:</span> {formData.vehicle.hasAC ? 'Yes' : 'No'}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Service Preferences</h4>
                    <div className="text-sm">
                      <div className="mb-2"><span className="text-gray-600">Service Areas:</span> {formData.serviceAreas.join(', ')}</div>
                      <div className="mb-2"><span className="text-gray-600">Accepts Rides:</span> {formData.preferences.acceptsRides ? 'Yes' : 'No'}</div>
                      <div className="mb-2"><span className="text-gray-600">Accepts Deliveries:</span> {formData.preferences.acceptsDeliveries ? 'Yes' : 'No'}</div>
                      <div><span className="text-gray-600">Operating Hours:</span> {formData.preferences.operatingHours.start} - {formData.preferences.operatingHours.end}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DriverRegistration;
