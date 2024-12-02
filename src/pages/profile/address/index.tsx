import React, { ChangeEvent, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddressHeader from '@/components/sections/address-header';
import dynamic from 'next/dynamic';
import GoogleMapComponent from '@/components/ui/google-map';
import {
  ADD_NEW_ADDRESS,
  CONFIRM_LOCATION,
  CONTINUE,
  ENTER_ADDRESS,
  SAVE_ADDRESS,
  UPDATE_ADDRESS,
} from '@/constants/texts';
import MyLocationIcon from '../../../../public/assets/svg/my-location-icon';
import { getLocalStorageItem } from '@/helper/browser-storage/local-storage/get-item';
import AddressDetails from '@/components/sections/address-details';
import AutoCompleteSearchBox from '@/components/ui/auto-complete';
import { toast, Toaster } from 'sonner';
import ConfirmationPopup from '@/components/ui/confirmation-popup';
import { addressApi } from '@/store/api-slices/profile/address-api';
import { AddressErrorType, UserInfoType } from '@/store/types/profile-type';
import getAddressFromLatLng from '@/helper/get-address-by-lat-lng';
import Button from '@/components/ui/button';
import FullScreenSpinner from '@/components/ui/full-screen-spinner';
import { getUserLocation } from '@/helper/get-location';
import { useAppSelector } from '@/store/utils/hooks';
import { RootState } from '@/store/store';
import { SIGN_IN_PAGE } from '@/routes';
import validatePhoneNumber from '@/helper/validation/phone-number-validation';


const AddressContainer = dynamic(() => import('@/containers/address'), {
  ssr: false,
});

const EnterAddressHeader = dynamic(() => import('@/components/sections/enter-address-header'), {
  ssr: false,
});

const Header = dynamic(() => import('@/components/sections/header'), {
  ssr: false,
});

const AddressCards = dynamic(() => import('@/components/sections/address-cards'), {
  ssr: false,
});



export type ErrorStateType = {
  name: boolean;
  city: boolean;
  state: boolean;
  phoneNumber: boolean;
  addressLine1: boolean;
  country: boolean;
  aptNo: boolean;
  addressTypeAttribute:boolean;
  addressNotesAttributes:boolean;
  // note?: boolean;
};

export type UserLocationType = {
  lat:number;
  lng: number;
}

function Address() {
  // const [addressData, setAddressData] = useState(initialAddressData);
  const { userInfo } = useAppSelector((state: RootState) => state.auth);
  useLayoutEffect(()=>{
    if(!userInfo?.accountId){
      router.push(SIGN_IN_PAGE);
    }
  },[userInfo]);
  const initialErrorState: ErrorStateType = {
    name: false,
    city: false,
    state: false,
    phoneNumber: false,
    addressLine1: false,
    country: false,
    aptNo: false,
    addressTypeAttribute:false,
    addressNotesAttributes:false,
    // note:false,
  };
  const initialFormData: UserInfoType = { 
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    addressNotesAttributes: [],
    addressTaggedAs: '',
    addressTypeAttribute: '',
    aptNo: '',
    city: '',
    country: '',
    countryCode: '',
    countryShortForm:'',
    isDefault: false,
    lat: 1,
    long: 1,
    name: '',
    note: '',
    phoneNumber: '',
    state: '',
    streetNo: '',
    zipCode: '',
    _id: '',
  };
  
  const [errorState, setErrorState] = useState(initialErrorState);
  const [formData, setFormData] = useState<UserInfoType>(initialFormData);
  
  const [userLocation, setUserLocation] = useState<UserLocationType>({ lat: 21.146633,lng: 79.08886,});

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  // eslint-disable-next-line no-undef
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const [showEditSection, setShowEditSection] = useState(false);
  const {refetch} = addressApi.useGetAllSavedAddressQuery();
  const [updateAddress, {isLoading: isUpdating}] = addressApi.useUpdateAddressMutation();

  const [isClickOnChange, setIsClickOnChange]  = useState<boolean>(false)

  // const [fetchUserLocationError, setFetchUserLocationError] = useState(false);

  const router = useRouter();
  const {
    showAddressDetailsWithMapInDessktop,
    showMapInDesktop,
    showAddressDetailsInDesktop,
    showEnterAddress,
    confirmLocation,
  } = router.query;

  const changeFormData = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in errorState) {
      setErrorState((prevState) => ({ ...prevState, [name]: value === '' }));
    }
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onPhoneChange = (value: string, data: { dialCode: string; name: string }) => {
    const countryCode = `+${data.dialCode}`;
    const phoneNumber = value.substring(countryCode.length - 1);
    setFormData((prevState) => ({
      ...prevState,
      phoneNumber,
      countryCode
    }));
    setErrorState((prevState) => ({ ...prevState, phoneNumber: !validatePhoneNumber(`${countryCode}${phoneNumber}`) }));
  };

  const toggleEnterAddress = () => {
    router.replace({
      pathname: '/profile/address',
      query: { showEnterAddress: showEnterAddress === 'true' ? 'false' : 'true' },
    });
  };

  const addNewAddressButtonForDesktopHandler = () => {
    router.replace({
      pathname: '/profile/address',
      query: {
        showAddressDetailsWithMapInDessktop: showAddressDetailsWithMapInDessktop === 'true' ? 'false' : 'true',
        showMapInDesktop: 'true',
      },
    });
  };

  const continueButtonHandler = () => {
    setIsClickOnChange(false)
    router.replace({
      pathname: '/profile/address',
      query: { showAddressDetailsWithMapInDessktop: 'true', showAddressDetailsInDesktop: 'true' },
    });

  };

  const closeIconHandler = () => {
    setIsClickOnChange(false)
    router.replace({ pathname: '/profile/address' });
    setShowEditSection(false);
    setFormData(initialFormData);
    setErrorState(initialErrorState);
  };

  const [addAddress,{ isLoading: isSaving }] = addressApi.useAddAddressMutation();
  
  const [deleteAddress, {isLoading : isDeleting}] = addressApi.useDeleteAddressMutation();

  const saveAddressButtonHandler = async() => {
    const formDataValues = Object.entries(formData);
    let isError = false;
    formDataValues.forEach(([key, value]) => {
      if(key == 'addressNotesAttributes' && (value.length == 0)){
        isError = true;
        setErrorState((prevState) => ({ ...prevState, [key]: true }));
      }

      if(key in errorState && !value){
        setErrorState((prevState) => ({ ...prevState, [key]: true }));
        isError = true;
      }
    });

    if (!isError) {

      try {
        await addAddress( {
          name: formData.name,
          phoneNumber:formData.phoneNumber,
          countryCode: formData.countryCode,
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          lat: formData.lat.toString(),
          long: formData.long.toString(),
          addressTypeAttribute:formData.addressTypeAttribute,
          addressNotesAttributes:formData.addressNotesAttributes,
          aptNo: formData.aptNo,
          ...(formData.note && { note: formData.note }),
        }).unwrap();

        toast.success('Saved Successfully', {
          duration: 3000,
          position: 'top-center',
        });
        router.replace({ pathname: '/profile/address' });
        setFormData(initialFormData);
        refetch();
      } catch (error) {
        const Error = error as AddressErrorType;
        
        toast.error( `${Error?.data?.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      }

    }
  };


  const onConfirm = async() => {
    setIsConfirmationOpen(false);

    try {
      await deleteAddress(deleteId).unwrap();
      toast.success('Deleted Successfully', {
        duration: 3000,
        position: 'top-center',   
      });
      refetch();
    } catch (error) {
      const Error = error as AddressErrorType;     
      toast.error( `${Error?.data?.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    }

  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const confirmLocationHandler = () => {
    router.replace({
      pathname: '/profile/address',
      query: { showEnterAddress, confirmLocation: confirmLocation === 'true' ? 'false' : 'true' },
    });
  };

  const deleteButtonHandler = (id: string) => {
    setIsConfirmationOpen(true);
    setDeleteId(id);
  };

  const editButtonHandler = (item:UserInfoType) => {
    const center = {
      lat: item.lat,
      lng: item.long,
    };
    setUserLocation(center);  
    setFormData(item);
    router.replace({
      pathname: '/profile/address',
      query: {
        showAddressDetailsWithMapInDessktop: showAddressDetailsWithMapInDessktop === 'true' ? 'false' : 'true',
        showMapInDesktop: 'true',
      },
    });
    setShowEditSection(true);
  };

  const mobileEditBtn =  (item:UserInfoType) => {
    const center = {
      lat: item.lat,
      lng: item.long,
    };
    setUserLocation(center);
    setFormData(item);
    router.replace({
      pathname: '/profile/address',
      query: { showEnterAddress: showEnterAddress === 'true' ? 'false' : 'true' },
    });
    setShowEditSection(true);
  };

  const updateButtonHandler = useCallback( async() => {
    const formDataValues = Object.entries(formData);
    let isError = false;
    formDataValues.forEach(([key, value]) => {
      if(key == 'addressNotesAttributes' && (value.length == 0)){
        isError = true;
        setErrorState((prevState) => ({ ...prevState, [key]: true }));
      }
      if(key in errorState && !value){
        setErrorState((prevState) => ({ ...prevState, [key]: true }));
        isError = true;
      }
    });

    if (!isError) {

      try {
        await updateAddress( {
          addressId:formData._id,
          name: formData.name,
          phoneNumber:formData.phoneNumber,
          countryCode: formData.countryCode,
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          lat: formData.lat.toString(),
          long: formData.long.toString(),
          addressTypeAttribute:formData.addressTypeAttribute,
          addressNotesAttributes:formData.addressNotesAttributes,
          aptNo: formData.aptNo,
          ...(formData.note && { note: formData.note }),
        }).unwrap();

        toast.success('Updated Successfully', {
          duration: 4000,
          position: 'top-center',
        });
        router.replace({ pathname: '/profile/address' });
        setFormData(initialFormData);
        setShowEditSection(false);
        refetch();
      } catch (error) {
        const Error = error as AddressErrorType;
        
        toast.error( `${Error?.data?.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  },[formData, setErrorState, errorState, updateAddress, setFormData, setShowEditSection, refetch, router]);


  // eslint-disable-next-line no-undef
  const onDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (lat && lng) {
      setUserLocation({
        lat,
        lng,
      });

      getAddressFromLatLng(lat, lng)
        .then(address => {
          setFormData((prevState) => ({ ...prevState, zipCode: address?.zipCode , addressLine1: address?.addressLine1, country: address?.country, countryShortForm: address?.countryCode, state: address?.state, city: address?.city,lat:lat, long:lng}));
        });

    }
  },[setUserLocation,setFormData]);

  // useEffect(() => {
  //   const location = getLocalStorageItem('myLocation');
  //   if (location) {
  //     const lat= Number(location.latitude);
  //     const lng= Number(location.longitude);
      
  //     getAddressFromLatLng(lat, lng)
  //       .then(address => {
  //         setFormData((prevState) => ({ ...prevState, zipCode: address?.zipCode , addressLine1: `${address?.addressLine1}`, country: address?.country, countryShortForm: address?.countryCode, state: address?.state, city: address?.city,lat:lat, long:lng}));
  //       });

  //     setUserLocation({
  //       lat,
  //       lng
  //     });
  //   }
  // }, []);


  const locateMeHandler = () => {
    /// using getUserLocation start
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
      .catch(()=>{
        toast.error( 'Unable to fetch your location please try another way', {
          duration: 4000,
          position: 'top-center',
        });
      });
    
  };

  const onPlaceSelected = (place: any) => {
    const placeName = place.name;    
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setUserLocation({ lat, lng });

    getAddressFromLatLng(lat, lng)
      .then(address => {
        setFormData((prevState) => ({ ...prevState, zipCode: address?.zipCode , addressLine1: `${placeName}, ${address?.addressLine1}`, country: address?.country, countryShortForm: address?.countryCode, state: address?.state, city: address?.city,lat:lat, long:lng}));
      });
  };

  const [updateDefault, {isLoading: isDefaultUpdating}] = addressApi.useUpdateDefaultAddressMutation(); 

  const defaultButtonHandler = async(id:string)=>{
    try {
      await updateDefault({addressId:id}).unwrap();
      refetch();
    } catch (error) {
      const Error = error as AddressErrorType;     
      toast.error( `${Error?.data?.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };
 
  return (
    <div className="w-full h-[100vh] overflow-y-scroll dark:bg-bg-primary-dark">
      {
        (isDeleting || isDefaultUpdating) ? <FullScreenSpinner/> : null
      }

      <ConfirmationPopup
        isOpen={isConfirmationOpen}
        message="Are you sure you want to delete this address?"
        onClose={closeConfirmation}
        onConfirm={onConfirm}
      />
      <Toaster />
      <div className="w-full">
        <div className="w-full hidden sm:block">
          <Header stickyHeaderWithSearchBox />
        </div>
        
        <div className="w-full bg-[#FFF] flex flex-col  sm:px-[64px] max-w-[1440px] mx-auto dark:bg-bg-primary-dark">
          {/* show enter address section for add new address (address details form with map) for mobile start   */}
          {showEnterAddress === 'true' ? (
            <>
              <EnterAddressHeader clickEvent={closeIconHandler} confirmLocation={confirmLocation === 'true'}>
                {showEditSection ? 'Edit Address' : ENTER_ADDRESS}
              </EnterAddressHeader>
              {!confirmLocation ? (
                <>
                  <div className="w-[100vw] relative pt-[16px] h-[79vh] flex justify-center md:block sm:h-[77vh] overflow-y-scroll  bg-[#FFFFFF] dark:bg-bg-primary-dark">
                    <GoogleMapComponent
                    isClickOnChange = {isClickOnChange}
                    showEditSection = {showEditSection}
                      setUserLocation={setUserLocation}
                      setFormData={setFormData}
                      setIsMapLoaded={setIsMapLoaded}
                      userLocation={userLocation}
                      setMap={setMap}
                      onDragEnd={onDragEnd}
                      mapTypeControl={false}
                      fullscreenControl={false}
                      streetViewControl={false}
                      // onMapClick={onMapClick}
                    />
                    <AutoCompleteSearchBox
                      isMapLoaded={isMapLoaded}
                      onPlaceSelected={onPlaceSelected}
                      className="top-[32px]"
                      formData={formData}
                      setFormData={setFormData}
                    />

                    <button
                      onClick={locateMeHandler}
                      className="w-[48px] h-[48px] bg-brand-color rounded-[50%] absolute bottom-[16px] left-[16px] flex justify-center items-center"
                    >
                      <MyLocationIcon primaryColor="#FFFFFF" />
                    </button>
                  </div>
                  <Button onClick={confirmLocationHandler} className='w-[90%] h-[48px] text-[16px] font-[600] min-w-[343px]  leading-[24px] rounded-[4px] my-[10px] mx-auto'>{showEditSection ? 'Update Location' : CONFIRM_LOCATION}</Button>
                </>
              ) : (
                <>
                  <AddressContainer>
                    <AddressDetails
                    setIsClickOnChange={setIsClickOnChange}
                      setErrorState={setErrorState}
                      setFormData = {setFormData}
                      errorState={errorState}
                      formData={formData}
                      changeFormData={changeFormData}
                      onPhoneChange={onPhoneChange}
                    />
                  </AddressContainer>
                  {showEditSection ? (
                    <Button className='w-[90%] h-[48px] text-[16px] font-[600] min-w-[343px]  leading-[24px] rounded-[4px] my-[10px] mx-auto ' onClick={updateButtonHandler} isLoading={isUpdating} isDisabled={isUpdating} buttonType={'primary'}>
                      {UPDATE_ADDRESS}
                    </Button>
                  ) : (
                    <Button className='w-[90%] h-[48px] text-[16px] font-[600] min-w-[343px] leading-[24px] rounded-[4px] my-[10px] mx-auto ' onClick={saveAddressButtonHandler} isLoading={isSaving} isDisabled={isSaving} buttonType={'primary'}>
                      {SAVE_ADDRESS}
                    </Button>
                  )}
                </>
              )}
            </>
          ) : (
          //  {/* show enter address section for add new address (address details form with map) for mobile end   */}
            
            //  user saved address cards section for mobile and desktop start
            <>
              <AddressHeader iconClickEvent={()=>{router.push('/');}} iconClassName="left-[4%]" className="sm:mt-[69px]">
                {'My Addresses'}
              </AddressHeader>
              <AddressCards
                defaultButtonHandler={defaultButtonHandler}
                editButtonHandler={editButtonHandler}
                mobileEditBtn={mobileEditBtn}
                deleteButtonHandler={deleteButtonHandler}
                clickEvent={addNewAddressButtonForDesktopHandler}
              />
              <Button className='sm:hidden w-[90%] h-[48px] text-[16px] font-[600] max-w-[427px] min-w-[343px] leading-[24px] rounded-[4px] my-[10px] mx-auto ' onClick={toggleEnterAddress} buttonType={'primary'}>
                {`+ ${ADD_NEW_ADDRESS}`}
              </Button>
            </>
            //  user saved address cards section for mobile and desktop end
          )}
        </div>
      </div>

      {showAddressDetailsWithMapInDessktop === 'true' ? (
        // {/* add address section (address details form with map) for desktop start   */}
        <div className="hidden sm:block w-full h-[100vh] overflow-y-scroll absolute dark:bg-slate-700 dark:bg-opacity-[0.2] bg-[#00000080] bg-opacity-[0.5] top-0 z-[10]">
          {showMapInDesktop == 'true' ? (
            <div className="w-[70%] max-w-[580px] flex flex-col items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[12px]  bg-[#FFF] dark:bg-bg-primary-dark">
              <EnterAddressHeader className="rounded-t-[12px]" clickEvent={closeIconHandler}>
                {showEditSection ? 'Edit Address' : 'Enter Address'}
              </EnterAddressHeader>
              <div className="map-for-desktop h-[466px] w-full min-h-[456px] relative">
                <GoogleMapComponent
                isClickOnChange = {isClickOnChange}
                showEditSection = {showEditSection}
                 setUserLocation={setUserLocation}
                 setFormData={setFormData}
                  setIsMapLoaded={setIsMapLoaded}
                  userLocation={userLocation}
                  setMap={setMap}
                  fullscreenControl={false}
                  streetViewControl={false}
                  onDragEnd={onDragEnd}
                  mapStyle={{
                    width: '100%',
                    height: '100%',
                    borderBottomLeftRadius: '12px',
                    borderBottomRightRadius: '12px',
                  }}
                />
                <AutoCompleteSearchBox
                  isMapLoaded={isMapLoaded}
                  onPlaceSelected={onPlaceSelected}
                  className="top-[59px]"
                  formData={formData}
                  setFormData={setFormData}
                />
  
                <button
                  className="absolute bottom-[16px] rounded-md text-[14px] font-semibold right-[60px] w-[130px] h-[48px] bg-[#E1BBB4]"
                  onClick={continueButtonHandler}
                >
                  {showEditSection ? 'Update Location' : CONTINUE}
                </button>
                <button
                  onClick={locateMeHandler}
                  className=" absolute bottom-[16px] left-[15px] flex justify-around items-center w-[121px] px-[5px] h-[41px] bg-[#FFFFFF]  border border-[#517EE5] rounded-[5px]"
                >
                  <MyLocationIcon primaryColor="#517EE5" />
                  <span className="text-[#517EE5] font-semibold">Locate Me</span>
                </button>
              </div>
            </div>
          ) : showAddressDetailsInDesktop ? (
            <div className="max-w-[804px] w-[80%] mb-[10px] flex flex-col items-center mx-auto mt-[10vh] px-[24px]  rounded-[10px] bg-[#FFF] dark:bg-bg-primary-dark">
              <EnterAddressHeader iconClass='right-[5px]' className=" dark:bg-bg-primary-dark" clickEvent={closeIconHandler}>
                {showEditSection ? UPDATE_ADDRESS : ADD_NEW_ADDRESS}
              </EnterAddressHeader>
              <AddressDetails
              setIsClickOnChange={setIsClickOnChange}
                setErrorState={setErrorState}
                setFormData = {setFormData}
                errorState={errorState}
                formData={formData}
                changeFormData={changeFormData}
                onPhoneChange={onPhoneChange}
              />

              {showEditSection ? (
                <Button className='w-[520px] h-[44px] mt-[20px] mb-[24px]' onClick={updateButtonHandler} isLoading={isUpdating} isDisabled={isUpdating} buttonType={'primary'}>
                  {UPDATE_ADDRESS}
                </Button>
              ) : (
                <Button className='w-[520px] h-[44px] mt-[20px] mb-[24px]' onClick={saveAddressButtonHandler} isLoading={isSaving} isDisabled={isSaving} buttonType={'primary'}>
                  {SAVE_ADDRESS}
                </Button>
              )}
            </div>
          ) : null}
        </div>
      ) : // {/* add address section (address details form with map) for desktop end   */}

        null}
    </div>
  );
}

export default Address;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
