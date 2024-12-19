const getAddressFromLatLng = async (lat:number, lng:number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.address) {
      const formattedAddress = {
        addressLine1: data.display_name,
        city: data.address.state_district || data.address.town || data.address.village || '',
        state: data.address.state || '',
        country: data.address.country || '',
        countryCode:data.address.country_code || '',
        zipCode: data.address.postcode || ''
      };

      return formattedAddress;
    } else {
      throw new Error('try again');
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getAddressFromLatLng;