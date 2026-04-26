const { Client } = require('@googlemaps/google-maps-services-js');
const axios = require('axios');

class GoogleMapsService {
  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  isLegacyApiDenied(error) {
    const status = error?.response?.data?.status;
    const message = error?.response?.data?.error_message || '';
    return status === 'REQUEST_DENIED' && /legacy api/i.test(message);
  }

  async getPlaceAutocompleteNew(input, location, radius = 50000) {
    const body = {
      input,
      includedRegionCodes: ['gm'],
    };

    if (location?.lat && location?.lng) {
      body.locationBias = {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng,
          },
          radius: Math.min(radius, 50000),
        },
      };
    }

    const response = await axios.post(
      'https://places.googleapis.com/v1/places:autocomplete',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
        },
      }
    );

    const suggestions = response.data?.suggestions || [];
    return suggestions
      .map((item) => item.placePrediction)
      .filter(Boolean)
      .map((prediction) => {
        const description = prediction.text?.text || '';
        return {
          placeId: prediction.placeId,
          description,
          structuredFormatting: {
            main_text: prediction.structuredFormat?.mainText?.text || description,
            secondary_text: prediction.structuredFormat?.secondaryText?.text || '',
          },
        };
      })
      .filter((item) => item.placeId && item.description);
  }

  async getPlaceDetailsNew(placeId) {
    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'id,formattedAddress,location,displayName',
        },
      }
    );

    const place = response.data || {};
    return {
      placeId: place.id || placeId,
      address: place.formattedAddress || place.displayName?.text || '',
      coordinates: {
        latitude: place.location?.latitude ?? null,
        longitude: place.location?.longitude ?? null,
      },
      name: place.displayName?.text || '',
    };
  }

  async getPlaceAutocomplete(input, location, radius = 50000) {
    if (!this.apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured. Add it to your backend .env file.');
    }
    try {
      const params = {
        input,
        key: this.apiKey,
        radius,
        components: 'country:gm', // Restrict to Gambia
        types: 'geocode' // Single type: addresses and locations (not array)
      };
      if (location) {
        params.location = `${location.lat},${location.lng}`;
      }
      const response = await this.client.placeAutocomplete({
        params
      });

      return response.data.predictions.map(prediction => ({
        placeId: prediction.place_id,
        description: prediction.description,
        structuredFormatting: prediction.structured_formatting
      }));
    } catch (error) {
      if (this.isLegacyApiDenied(error)) {
        return this.getPlaceAutocompleteNew(input, location, radius);
      }
      const details = error?.response?.data?.error?.message || error?.response?.data?.error_message || error.message;
      console.error('Google Places Autocomplete Error:', {
        status: error?.response?.status,
        message: details,
      });
      throw new Error(`Failed to fetch place suggestions: ${details}`);
    }
  }

  async getPlaceDetails(placeId) {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: ['formatted_address', 'geometry', 'name', 'place_id']
        }
      });

      const place = response.data.result;
      return {
        placeId: place.place_id,
        address: place.formatted_address,
        coordinates: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        name: place.name
      };
    } catch (error) {
      if (this.isLegacyApiDenied(error)) {
        return this.getPlaceDetailsNew(placeId);
      }
      const details = error?.response?.data?.error?.message || error?.response?.data?.error_message || error.message;
      console.error('Google Place Details Error:', {
        status: error?.response?.status,
        message: details,
      });
      throw new Error(`Failed to fetch place details: ${details}`);
    }
  }

  async getDirections(origin, destination, mode = 'driving') {
    try {
      const response = await this.client.directions({
        params: {
          origin,
          destination,
          mode,
          key: this.apiKey,
          alternatives: false,
          units: 'metric'
        }
      });

      if (response.data.status !== 'OK') {
        throw new Error(`Directions request failed: ${response.data.status}`);
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        overviewPolyline: route.overview_polyline.points,
        bounds: route.bounds,
        totalDistance: leg.distance,
        totalDuration: leg.duration,
        steps: leg.steps.map(step => ({
          distance: step.distance,
          duration: step.duration,
          instructions: step.html_instructions ? step.html_instructions.replace(/<[^>]*>/g, '') : '',
          polyline: step.polyline.points,
          startLocation: step.start_location,
          endLocation: step.end_location
        })),
        startAddress: leg.start_address,
        endAddress: leg.end_address
      };
    } catch (error) {
      console.error('Directions API Error:', error);
      throw new Error('Failed to get directions');
    }
  }
}

module.exports = new GoogleMapsService();