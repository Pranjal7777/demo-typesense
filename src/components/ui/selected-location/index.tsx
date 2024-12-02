import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { MAP_MARKER } from '../../../../public/images/address-page';
import { UserInfoType } from '@/store/types/profile-type';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_MAPS_KEY } from '@/config';

type Props={
  formData:UserInfoType,
  pageType?:string,
  setIsClickOnChange: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectedLocation:FC<Props> = ({formData, pageType, setIsClickOnChange})=> {
  
  
  const router = useRouter();
  const { showAddressDetailsWithMapInDessktop, showEnterAddress } = router.query;

  const getQuery = () => {
    if (showAddressDetailsWithMapInDessktop == 'true') {
      return {
        showAddressDetailsWithMapInDessktop: 'true',
        showMapInDesktop: true,
      };
    } else if (showEnterAddress == 'true') {
      return {
        showEnterAddress: 'true',
      };
    }
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${GOOGLE_MAPS_KEY}`,
    libraries: ['places'],
  });

  const onMapClick = ()=>{
    setIsClickOnChange(true)
    router.replace({
      pathname: '/profile/address',
      query: getQuery(),
    });
  };

  const changeBtnHandler = () => {
    const { chatId, sellerId, assetId } = router.query;
    if(router.pathname.includes('buy')){
      router.replace({
        pathname: '/buy/select-address',
        query: pageType === 'secure-checkout' ? {
          ...(chatId && { chatId }),
          ...(sellerId && { sellerId }),
          ...(assetId && { assetId }),
          ...getQuery(),
        } : getQuery(),
      });
    }
    else{
      setIsClickOnChange(true);
      router.replace({
        pathname: '/profile/address',
        query: getQuery(),
      });
    }
  };

  return (
    <div className="flex gap-[8px] dark:bg-bg-primary-dark text-text-primary-light  dark:text-text-primary-dark ">
      <div className="img relative w-[45%] max-w-[240px] min-w-[96px] h-[96px] lg:h-[129px] rounded-[4px]">

        { isLoaded ? <GoogleMap
          mapContainerStyle={{width: '100%', height: '100%'}}
          center={{lat:formData.lat, lng: formData.long}}
          zoom={15}
          options={
            {
              disableDefaultUI:true,
              keyboardShortcuts:false,
              zoomControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
            }
          }
          onClick={onMapClick}
        >
          <>
            <MarkerF  
              icon={{
                url: MAP_MARKER,
                // eslint-disable-next-line no-undef
                scaledSize: new google.maps.Size(22, 30), 
              }}
              position={{lat: formData.lat, lng: formData.long}} />
          </>
        </GoogleMap> : null}

      </div>

      <div className="details w-[100%] h-[96px] lg:h-[129px] p-[8px] lg:p-[12px] border dark:border-border-tertiary-dark border-border-tertiary-light rounded-[4px]">
        <p className="text-[12px] md:hidden leading-[18px] mobile:!text-[14px]">
          {formData.addressLine1?.length>64 ? `${formData.addressLine1.slice(0,80)}....` : `${formData.addressLine1}`}        
        </p>
        <p className=" hidden md:text-[14px] md:block lg:text-[16px] leading-[24px]">
          { `${formData.addressLine1?.length>64 ? `${formData.addressLine1.slice(0,120)}....` : `${formData.addressLine1}`}`}        
        </p>
        <button onClick={changeBtnHandler} className="text-[12px] md:text-[14px] font-[600] tracking-[1px] text-[#6D3EC1] mt-[8px]">
          Change
        </button>
      </div>
    </div>
  );
};

export default SelectedLocation;
