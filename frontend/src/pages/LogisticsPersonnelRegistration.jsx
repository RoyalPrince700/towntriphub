import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Truck,
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

const LogisticsPersonnelRegistration = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    dispatchName: '',
    dateOfBirth: '',
    phoneNumber: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    // Business Information
    businessName: '',
    businessAddress: {
      address: '',
    },
    serviceAreas: [],
    // Documents
    documents: {
      passportPhoto: null,
      idCard: null,
      driverLicense: null,
      vehicleFrontPhoto: null,
      vehicleSidePhoto: null,
      vehicleBackPhoto: null,
    },
  });

  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  const handleServiceAreaChange = (area) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area],
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));

    if (errors[`documents.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`documents.${field}`]: null,
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.dispatchName.trim()) newErrors.dispatchName = 'Dispatch name is required';
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

      case 2: // Business Information
        if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
        if (!formData.businessAddress.address.trim()) {
          newErrors['businessAddress.address'] = 'Business address is required';
        }
        if (formData.serviceAreas.length === 0) {
          newErrors.serviceAreas = 'Please select at least one service area';
        }
        break;

      case 3: // Documents
        if (!formData.documents.passportPhoto) {
          newErrors['documents.passportPhoto'] = 'Passport photo is required';
        }
        if (!formData.documents.idCard) {
          newErrors['documents.idCard'] = 'ID card is required';
        }
        if (!formData.documents.driverLicense) {
          newErrors['documents.driverLicense'] = 'Driver license is required';
        }
        if (!formData.documents.vehicleFrontPhoto) {
          newErrors['documents.vehicleFrontPhoto'] = 'Front view photo is required';
        }
        if (!formData.documents.vehicleSidePhoto) {
          newErrors['documents.vehicleSidePhoto'] = 'Side view photo is required';
        }
        if (!formData.documents.vehicleBackPhoto) {
          newErrors['documents.vehicleBackPhoto'] = 'Back view photo is required';
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

    try {
      const submitData = new FormData();

      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          // Handle files separately
          Object.keys(formData.documents).forEach(docKey => {
            if (formData.documents[docKey]) {
              submitData.append(docKey, formData.documents[docKey]);
            }
          });
        } else if (typeof formData[key] === 'object') {
          // Stringify objects and arrays for FormData
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch(`${API_URL}/logistics/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();
      console.log('[LogisticsRegistration] Response:', { status: response.status, data });

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => `${err.path || err.param}: ${err.msg}`).join(', ');
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
              Your delivery personnel registration has been submitted successfully. Our admin team will review your application within 24-48 hours.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You will receive an email notification once your application is approved.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
    { number: 2, title: 'Business Info', icon: MapPin },
    { number: 3, title: 'Documents', icon: Upload },
    { number: 4, title: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Delivery Personnel</h1>
          <p className="mt-2 text-gray-600">
            Join our network of professional delivery personnel and start earning
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  step.number <= currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {steps.map((step) => (
              <div key={step.number} className="text-center mx-8">
                <p className={`text-sm font-medium ${
                  step.number <= currentStep ? 'text-green-600' : 'text-gray-500'
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
                      Dispatch Name *
                    </label>
                    <input
                      type="text"
                      value={formData.dispatchName}
                      onChange={(e) => handleInputChange('dispatchName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.dispatchName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your dispatch name"
                    />
                    {errors.dispatchName && (
                      <p className="mt-1 text-sm text-red-600">{errors.dispatchName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
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

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Enter your business or dispatch name"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.businessName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.businessName && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address *
                    </label>
                    <input
                      type="text"
                      value={formData.businessAddress.address}
                      onChange={(e) => handleNestedInputChange('businessAddress', 'address', e.target.value)}
                      placeholder="Enter your business address"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors['businessAddress.address'] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors['businessAddress.address'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['businessAddress.address']}</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-6">
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
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                  {errors.serviceAreas && (
                    <p className="mt-1 text-sm text-red-600">{errors.serviceAreas}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Required Documents</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passport Photo *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('passportPhoto', e.target.files[0])}
                        className="hidden"
                        id="passportPhoto"
                      />
                      <label htmlFor="passportPhoto" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.documents.passportPhoto ? formData.documents.passportPhoto.name : 'Click to upload passport photo'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </label>
                    </div>
                    {errors['documents.passportPhoto'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['documents.passportPhoto']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Card *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('idCard', e.target.files[0])}
                        className="hidden"
                        id="idCard"
                      />
                      <label htmlFor="idCard" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.documents.idCard ? formData.documents.idCard.name : 'Click to upload ID card'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </label>
                    </div>
                    {errors['documents.idCard'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['documents.idCard']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver License *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('driverLicense', e.target.files[0])}
                        className="hidden"
                        id="driverLicense"
                      />
                      <label htmlFor="driverLicense" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.documents.driverLicense ? formData.documents.driverLicense.name : 'Click to upload driver license'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                      </label>
                    </div>
                    {errors['documents.driverLicense'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['documents.driverLicense']}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Front View *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('vehicleFrontPhoto', e.target.files[0])}
                          className="hidden"
                          id="vehicleFrontPhoto"
                        />
                        <label htmlFor="vehicleFrontPhoto" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 truncate">
                            {formData.documents.vehicleFrontPhoto ? formData.documents.vehicleFrontPhoto.name : 'Upload Front'}
                          </p>
                        </label>
                      </div>
                      {errors['documents.vehicleFrontPhoto'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['documents.vehicleFrontPhoto']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Side View *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('vehicleSidePhoto', e.target.files[0])}
                          className="hidden"
                          id="vehicleSidePhoto"
                        />
                        <label htmlFor="vehicleSidePhoto" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 truncate">
                            {formData.documents.vehicleSidePhoto ? formData.documents.vehicleSidePhoto.name : 'Upload Side'}
                          </p>
                        </label>
                      </div>
                      {errors['documents.vehicleSidePhoto'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['documents.vehicleSidePhoto']}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Back View *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('vehicleBackPhoto', e.target.files[0])}
                          className="hidden"
                          id="vehicleBackPhoto"
                        />
                        <label htmlFor="vehicleBackPhoto" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600 truncate">
                            {formData.documents.vehicleBackPhoto ? formData.documents.vehicleBackPhoto.name : 'Upload Back'}
                          </p>
                        </label>
                      </div>
                      {errors['documents.vehicleBackPhoto'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['documents.vehicleBackPhoto']}</p>
                      )}
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
                      <div><span className="text-gray-600">Dispatch Name:</span> {formData.dispatchName}</div>
                      <div><span className="text-gray-600">Date of Birth:</span> {formData.dateOfBirth}</div>
                      <div><span className="text-gray-600">Phone:</span> {formData.phoneNumber}</div>
                      <div><span className="text-gray-600">Emergency Contact:</span> {formData.emergencyContact.name}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Business Information</h4>
                    <div className="text-sm">
                      <div className="mb-2"><span className="text-gray-600">Business Name:</span> {formData.businessName}</div>
                      <div className="mb-2"><span className="text-gray-600">Business Address:</span> {formData.businessAddress.address}</div>
                      <div><span className="text-gray-600">Service Areas:</span> {formData.serviceAreas.join(', ')}</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                    <div className="text-sm">
                      <div className="mb-2"><span className="text-gray-600">Passport Photo:</span> {formData.documents.passportPhoto?.name || 'Uploaded'}</div>
                      <div className="mb-2"><span className="text-gray-600">ID Card:</span> {formData.documents.idCard?.name || 'Uploaded'}</div>
                      <div className="mb-2"><span className="text-gray-600">Driver License:</span> {formData.documents.driverLicense?.name || 'Uploaded'}</div>
                      <div className="mb-2"><span className="text-gray-600">Vehicle Front:</span> {formData.documents.vehicleFrontPhoto?.name || 'Uploaded'}</div>
                      <div className="mb-2"><span className="text-gray-600">Vehicle Side:</span> {formData.documents.vehicleSidePhoto?.name || 'Uploaded'}</div>
                      <div><span className="text-gray-600">Vehicle Back:</span> {formData.documents.vehicleBackPhoto?.name || 'Uploaded'}</div>
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
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto flex items-center"
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

export default LogisticsPersonnelRegistration;
