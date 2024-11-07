import {  AUTH_URL_V2, BASE_API_URL, DEFAULT_LOCATION } from '@/config';
import { myLocationFieldWithIp } from '@/store/types';

export const ProductsApiForHighlightFromServer = async (accessToken: string, myLocationFromServer: myLocationFieldWithIp) => {
  const headers = {
    'Authorization': `${accessToken}`,
    'Content-Type': 'application/json',
    'lan': 'en',
    'platform': '3',
    'City': myLocationFromServer.city || DEFAULT_LOCATION.city,
    'Country': myLocationFromServer.country || DEFAULT_LOCATION.country,
    'Ipaddress': myLocationFromServer.ip || '43.247.156.26',
    'Latitude': myLocationFromServer.latitude || DEFAULT_LOCATION.latitude,
    'Longitude': myLocationFromServer.longitude || DEFAULT_LOCATION.longitude,
  };

  const url = `${BASE_API_URL + AUTH_URL_V2}/python/highlightedAssets/?page=1&promoted=1&lat=${myLocationFromServer.latitude}&long=${myLocationFromServer.longitude}`;
  const request = new Request(url, {
    method: 'GET',
    headers: headers,
  });

  return fetch(request)
    .then(response => {
      if (!response.ok) {
        // throw new Error('Network response was not ok.');
        const noHighlightAds = {
          result: []
        };
        return noHighlightAds;
      }

      if (response.status === 204) {
        const noHighlightAds = {
          result: []
        };
        return noHighlightAds;
      }

      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};


 
export const ProductsApiForBannerFromServer = async(accessToken:string,myLocationFromServer:myLocationFieldWithIp) => {
  return fetch(`${BASE_API_URL + AUTH_URL_V2}/python/assets/?page=1&lat=${myLocationFromServer.latitude}&long=${myLocationFromServer.longitude}`, {
    method: 'GET',
    headers: {
      'Authorization': `${accessToken}`,
      'Content-Type': 'application/json',
      'lan': 'en',
      'platform': '3',
      'City': myLocationFromServer.city || DEFAULT_LOCATION.city,
      'Country': myLocationFromServer.country || DEFAULT_LOCATION.country,
      'Ipaddress': myLocationFromServer.ip || '43.247.156.26',
      'Latitude': myLocationFromServer.latitude || DEFAULT_LOCATION.latitude,
      'Longitude': myLocationFromServer.longitude || DEFAULT_LOCATION.longitude,
    },
    // body: JSON.stringify(getGuestTokenConfig), // Pass the request body as JSON
  })
    .then(response => {
      if (!response.ok) {
      // If the response is not OK, throw an error
        const noHighlightAds = {
          result: []
        };
        return noHighlightAds;
      // throw new Error('Netwoenrk response was not ok.');
      }
      // Check if response is empty
      if (response.status === 204) {
      // No content, return null or an appropriate value
        return null;
      }
      
      // Return the response
      return response.json();
    })
    .catch(error => {
    // Catch any errors that occur during the request
      console.error('Error:', error);
      throw error; // Rethrow the error so it can be caught by the caller
    });
};
