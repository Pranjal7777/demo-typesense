import { AUTH_URL_V1, BASE_API_URL } from "@/config";
import { ACCESS_TOKEN } from "@/constants/cookies";
import Cookies from 'js-cookie';
const authToken = Cookies.get(ACCESS_TOKEN)?.replace(/"/g, '');

export const getConfigData = async() => {
  return fetch(`${BASE_API_URL + AUTH_URL_V1}/config`, {
    method: 'GET',
    headers: {
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
      lan: 'en',
      platform: '3',
      City: 'surat',
      Country: 'India',
      Ipaddress: '2405:201:2009:ae:2c95:2cc9:aa66:3788',
      Latitude: '21.1959',
      Longitude: '72.8302',
    },
    // body: JSON.stringify(getGuestTokenConfig), // Pass the request body as JSON
  })
    .then((response) => {
      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error('Network response was not ok.');
      }

      // Return the response
      return response.json();
    })
    .catch((error) => {
      // Catch any errors that occur during the request
      console.error('Error:', error);
      throw error; // Rethrow the error so it can be caught by the caller
    });
};


