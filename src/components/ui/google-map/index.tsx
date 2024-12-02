import React, { FC } from 'react';
import { useJsApiLoader, GoogleMap, MarkerF } from '@react-google-maps/api';
import { GOOGLE_MAPS_KEY } from '@/config';
import { MAP_MARKER } from '../../../../public/images/address-page';
import { UserInfoType } from '@/store/types/profile-type';
import { UserLocationType } from '@/pages/profile/address';
import getAddressFromLatLng from '@/helper/get-address-by-lat-lng';
import { getUserLocation } from '@/helper/get-location';
import FullScreenSpinner from '../full-screen-spinner';
type Props = {
  // eslint-disable-next-line no-undef
  setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
  userLocation: {
    lat: number;
    lng: number;
  };
  mapStyle?: {};
  setIsMapLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line no-undef
  onMapClick?: (_e: google.maps.MapMouseEvent) => void;
  // eslint-disable-next-line no-undef
  onDragEnd?: (_e: google.maps.MapMouseEvent) => void;
  mapTypeControl?:boolean,
  fullscreenControl?:boolean,
  streetViewControl?:boolean,
  setFormData: React.Dispatch<React.SetStateAction<UserInfoType>>;
  setUserLocation: React.Dispatch<React.SetStateAction<UserLocationType>>;
  showEditSection: boolean;
};

const GoogleMapComponent: FC<Props> = ({
  setMap,
  userLocation,
  mapStyle = { width: '100%', height: '100%' },
  // onMapClick,
  onDragEnd,
  setIsMapLoaded,
  mapTypeControl=true,
  fullscreenControl= true,
  streetViewControl = true,
  setFormData,
  setUserLocation,
  showEditSection
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${GOOGLE_MAPS_KEY}`,
    libraries: ['places'],
  });

  const onLoad = (map: any) => {
    setMap(map);
if(!showEditSection){
  getUserLocation()
  .then(userCurrentLocation => {
    const lat = userCurrentLocation.latitude;
    const lng = userCurrentLocation.longitude;
    map?.panTo({lat,lng});
    setUserLocation({
      lat,
      lng
    });
   
    getAddressFromLatLng(lat,lng)
      .then(address => {
        setFormData((prevState) => ({ ...prevState, zipCode: address?.zipCode , addressLine1: `${address?.addressLine1}`, country: address?.country, countryShortForm: address?.countryCode, state: address?.state, city: address?.city,lat:lat, long:lng}));
      });     
  })
}
    setIsMapLoaded(true);
  };

  if (!isLoaded) {
    return  <FullScreenSpinner/>
  }

  return (
    <GoogleMap
      mapContainerStyle={mapStyle}
      center={userLocation}
      zoom={15}
      options={
        {
          // zoomControl: false,
          mapTypeControl: mapTypeControl,
          fullscreenControl: fullscreenControl,
          streetViewControl: streetViewControl,
        }
      }
      onLoad={onLoad}
      // onClick={onMapClick}
    >
      <>
        <MarkerF icon={{
          url: MAP_MARKER, 
          // eslint-disable-next-line no-undef
          scaledSize: new google.maps.Size(31, 42), // Adjust the size of the icon
        }} 
        position={userLocation} 
        draggable={true} 
        onDragEnd={onDragEnd} />
      </>
    </GoogleMap>
  );
};

export default GoogleMapComponent;
