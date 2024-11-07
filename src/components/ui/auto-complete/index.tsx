import { GOOGLE_MAPS_KEY } from '@/config';
import { appClsx } from '@/lib/utils';
import { UserInfoType } from '@/store/types/profile-type';
import React, { FC } from 'react';
import Autocomplete from 'react-google-autocomplete';
type Props ={
    isMapLoaded: boolean,
    formData:UserInfoType,
    onPlaceSelected:(_place: any)=>void,
    className?:string,
    setFormData: React.Dispatch<React.SetStateAction<UserInfoType>>
}

const AutoCompleteSearchBox:FC<Props> = ({isMapLoaded, onPlaceSelected,setFormData,className,formData}) => {
  
  return (
    <div className= {appClsx(' w-[96%] absolute left-[50%] translate-x-[-50%]', className)}>
      {isMapLoaded && (
        <>
          <Autocomplete
            apiKey={`${GOOGLE_MAPS_KEY}`}
            style={{
              width: '100%',
              height: '42px',
              boxShadow: '0px 0px 5px #00000014',
              padding: '5px',
              borderRadius: '6px',
              outline: 'none',
              overflow:'hidden',
              textOverflow:'ellipsis',
              whiteSpace:'nowrap',
            }}
            onPlaceSelected={onPlaceSelected}
            options={{
              // componentRestrictions: { country: 'in' },
              fields: ['address_components', 'geometry', 'icon', 'name'],
              types: ['establishment'],
            }}
            value = {formData.addressLine1}
            onChange={(e:any) => setFormData((prevState) => ({ ...prevState, addressLine1: e.target.value}))}
          />
        </>
      )}
    </div>
  );
};

export default AutoCompleteSearchBox;
