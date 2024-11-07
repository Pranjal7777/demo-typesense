import { GET_SUB_CATEGORIES_BY_ID_URL } from '@/api/endpoints';
import { AUTH_URL_V1, AUTH_URL_V2, BASE_API_URL } from '@/config';

export const CategoriesDataFromServer = (accessToken: string) => {
  console.log('accessTokenmine', accessToken);

  return fetch(`${BASE_API_URL + AUTH_URL_V2}/categories/?&limit=100&set=0&status=1`, {
    method: 'GET',
    headers: {
      Authorization: `${accessToken}`,
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
      console.log('newresponse', response);

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

export const CategoriesDataWithChildCategoriesFromServer = (accessToken: string) => {
  return fetch(`${BASE_API_URL + AUTH_URL_V1}/python/categories/`, {
    method: 'GET',
    headers: {
      Authorization: `${accessToken}`,
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

export const GetAllSubCategoriesByCategoryId = (accessToken: string, parentId: string) => {
  return fetch(
    `${BASE_API_URL + AUTH_URL_V2}${GET_SUB_CATEGORIES_BY_ID_URL}/?parentId=${parentId}&country=India&set=0&limit=20`,
    {
      method: 'GET',
      headers: {
        Authorization: `${accessToken}`,
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
    }
  )
    .then((response) => {
      console.log('newresponse', response);

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
