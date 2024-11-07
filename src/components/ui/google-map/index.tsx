import React, { FC } from 'react';
import { useJsApiLoader, GoogleMap, MarkerF } from '@react-google-maps/api';
import { GOOGLE_MAPS_KEY } from '@/config';
import { MAP_MARKER } from '../../../../public/images/address-page';
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
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${GOOGLE_MAPS_KEY}`,
    libraries: ['places'],
  });

  const onLoad = (map: any) => {
    setMap(map);
    setIsMapLoaded(true);
  };

  if (!isLoaded) {
    return <h1 className=' absolute text-text-primary-light top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[24px] dark:text-text-secondary-light font-semibold'>Lading...</h1>;
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
