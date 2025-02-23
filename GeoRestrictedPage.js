import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './src/Components/General/Loader';

const GeoBlock = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const apiKey = 'AIzaSyAWrGaFeWRxxtjxUCZGG7naNmHtg0RK88o';

    // Send a POST request to Google's Geolocation API
    axios.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`)
      .then((response) => {
        // The API response should include location information
        console.log(response.data); // Check what is returned from the API

        // The response should have location data or error
        if (response.data.location) {
          const { location } = response.data; // location object containing lat/lng
          // You can use other methods to get country info based on lat/lng
          // The Google Geolocation API does not provide country directly
          // You will need reverse geocoding (using lat/lng) to get the country name

          // For now, assuming the API does not give country code directly
          setIsAllowed(true); // You need a proper method to get country info
        }
      })
      .catch((error) => {
        console.error('Error fetching location data:', error);
        setIsAllowed(false);
      });
  }, []);

  // if (isAllowed === null) {
  //   return <Loader />; // Show loading state while checking
  // }

  // if (!isAllowed) {
  //   return <div>Access is restricted to the USA only.</div>; // If not allowed, display restricted message
  // }

  return children; // Allow content to render if allowed
};

export default GeoBlock;
