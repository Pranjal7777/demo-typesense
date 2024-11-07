const getAddressFromLatLng = async (lat:number, lng:number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data,'data000000000000000000');
    // {"name":"Shreeseller Tandel","phoneNumber":"9979551237","countryCode":"+91","addressLine1":"9WRJ+547 Balitha","city":"Vapi","state":"GJ","country":"India","zipCode":"396145","lat":"20.390296224180904","long":"72.93030247092247","addressTypeAttribute":"6617b87aa86bb50e82fda3cf","addressNotesAttributes":["6617b83aa86bb50e82fda3ca"]}

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