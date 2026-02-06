import React, { useState, useEffect } from 'react';
import { MapPin, XCircle, Bookmark, Trash2, Edit3, Plus } from 'lucide-react';
import { getUserSavedPlaces, deleteSavedPlace, updateSavedPlace } from '../services/savedPlacesService';

const SavedPlacesModal = ({ isOpen, onClose, onSelectPlace, type = null }) => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingPlace, setEditingPlace] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSavedPlaces();
    }
  }, [isOpen, type]);

  const fetchSavedPlaces = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getUserSavedPlaces(type);
      if (response.success) {
        setSavedPlaces(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load saved places');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (!confirm('Are you sure you want to delete this saved place?')) {
      return;
    }

    try {
      await deleteSavedPlace(placeId);
      setSavedPlaces(savedPlaces.filter(place => place._id !== placeId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete saved place');
    }
  };

  const handleEditPlace = (place) => {
    setEditingPlace(place._id);
    setEditName(place.name);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      setError('Place name cannot be empty');
      return;
    }

    try {
      await updateSavedPlace(editingPlace, { name: editName.trim() });
      setSavedPlaces(savedPlaces.map(place =>
        place._id === editingPlace
          ? { ...place, name: editName.trim() }
          : place
      ));
      setEditingPlace(null);
      setEditName('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update saved place');
    }
  };

  const handleCancelEdit = () => {
    setEditingPlace(null);
    setEditName('');
    setError('');
  };

  const handleSelectPlace = (place) => {
    onSelectPlace(place);
    onClose();
  };

  if (!isOpen) return null;

  const pickupPlaces = savedPlaces.filter(place => place.type === 'pickup');
  const destinationPlaces = savedPlaces.filter(place => place.type === 'destination');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md px-4 py-6">
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 pb-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Bookmark size={20} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Saved Places</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6 flex items-center text-rose-600">
              <XCircle size={20} className="mr-3 shrink-0" />
              <p className="text-sm font-bold tracking-tight">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-bold">Loading saved places...</p>
            </div>
          ) : savedPlaces.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold tracking-tight mb-2">No saved places yet</p>
              <p className="text-gray-500 text-sm">Save frequently used locations while booking rides</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Pickup Locations */}
              {pickupPlaces.length > 0 && (
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4 flex items-center">
                    <div className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></div>
                    Pickup Locations
                  </h3>
                  <div className="space-y-3">
                    {pickupPlaces.map((place) => (
                      <div
                        key={place._id}
                        className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-emerald-50 hover:border-emerald-100 transition-all cursor-pointer group"
                      >
                        {editingPlace === place._id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div
                              className="flex-1 flex items-center space-x-3"
                              onClick={() => handleSelectPlace(place)}
                            >
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <MapPin size={16} className="text-emerald-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm truncate">{place.name}</h4>
                                <p className="text-xs text-gray-500 font-medium truncate">{place.address}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPlace(place);
                                }}
                                className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors"
                                title="Edit name"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePlace(place._id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                                title="Delete place"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Destination Locations */}
              {destinationPlaces.length > 0 && (
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4 flex items-center">
                    <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                    Destination Locations
                  </h3>
                  <div className="space-y-3">
                    {destinationPlaces.map((place) => (
                      <div
                        key={place._id}
                        className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:bg-purple-50 hover:border-purple-100 transition-all cursor-pointer group"
                      >
                        {editingPlace === place._id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div
                              className="flex-1 flex items-center space-x-3"
                              onClick={() => handleSelectPlace(place)}
                            >
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <MapPin size={16} className="text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm truncate">{place.name}</h4>
                                <p className="text-xs text-gray-500 font-medium truncate">{place.address}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPlace(place);
                                }}
                                className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors"
                                title="Edit name"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePlace(place._id);
                                }}
                                className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                                title="Delete place"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPlacesModal;