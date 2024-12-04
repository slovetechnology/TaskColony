// AutoLocationComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AutoLocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                  latlng: `${latitude},${longitude}`,
                  key: 'YOUR_API_KEY',
                },
              });

              if (response.data.status === 'OK') {
                const addressComponents = response.data.results[0].address_components;
                const city = addressComponents.find(comp => comp.types.includes('locality'))?.long_name;
                const state = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name;

                setLocation({ city, state });
              } else {
                setError('Unable to retrieve location');
              }
            } catch (err) {
              setError('Error fetching location data');
            }
          },
          () => setError('Geolocation permission denied')
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      <h2>Your Location</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {location && (
        <div>
          <p>City: {location.city}</p>
          <p>State: {location.state}</p>
        </div>
      )}
    </div>
  );
};

export default AutoLocationComponent;