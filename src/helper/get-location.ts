import { GOOGLE_MAPS_KEY } from '@/config';

type UserLocation = {
  latitude: number;
  longitude: number;
};
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export const getUserLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        //   localStorage.setItem("latitude",latitude.toString())
        //   localStorage.setItem("longitude",longitude.toString())

        resolve({ latitude, longitude });
      },
      (error) => {
        // alert(error.message)
        reject(error);
      }
    );
  });
};

export const getLocationName = async (latitude: number, longitude: number) => {
  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    let country: string = '';
    let city: string = '';

    data.results[0]?.address_components.forEach((item: AddressComponent) => {
      if (item.types.includes('country')) {
        country = item.long_name;
      }
      if (item.types.includes('administrative_area_level_3')) {
        city = item.long_name;
      }
    });

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      // Extract the location name from the first result
      const locationName = {
        address: data.results[0].formatted_address,
        city: city,
        country: country,
      };
      return locationName;
    } else {
      throw new Error('Unable to retrieve location name');
    }
  } catch (error) {
    console.error('Error retrieving location name:', error);
    throw error;
  }
};


