import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { addressApi } from '@/store/api-slices/profile/address-api';
import { AddressErrorType, AddressType, UserInfoType } from '@/store/types/profile-type';
import getAddressFromLatLng from '@/helper/get-address-by-lat-lng';
import { getUserLocation } from '@/helper/get-location';
import { toast, Toaster } from 'sonner';
import { ErrorStateType } from '../profile/address';
import validatePhoneNumber from '@/helper/validation/phone-number-validation';
import FullScreenSpinner from '@/components/ui/full-screen-spinner';
import ConfirmationPopup from '@/components/ui/confirmation-popup';
import SecureCheckout from '@/components/sections/secure-checkout';
import { AddressSection } from '@/components/sections/secure-checkout/address';
import Drawer from '@/components/ui/drawer';
import { DELETE_CONFIRM, UNABLE_TO_FIND_LOCATION } from '@/constants/texts';
import { initialFormData, initialErrorState} from '@/store/types/checkout-type';

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserInfoType>(initialFormData);
  const [errorState, setErrorState] = useState<ErrorStateType>(initialErrorState);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  // eslint-disable-next-line no-undef
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showEditSection, setShowEditSection] = useState(false);
  const { refetch, data } = addressApi.useGetAllSavedAddressQuery();
  const [updateAddress, { isLoading: isUpdating }] = addressApi.useUpdateAddressMutation();
  const [userLocation, setUserLocation] = useState({ lat: 21.146633, lng: 79.08886 });
  const [addAddress, { isLoading: isSaving }] = addressApi.useAddAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = addressApi.useDeleteAddressMutation();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [updateDefault, { isLoading: isDefaultUpdating }] = addressApi.useUpdateDefaultAddressMutation();
  const [showAddPaymentFormView, setShowAddPaymentFormView] = useState(false);
  const [isOpenAddressModel, setIsOpenAddressModel] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    data?.data?.filter((item) => item.isDefault)?.[0] || null
  );
  const [paymentIntentData, setPaymentIntentData] = useState(null);

  useEffect(() => {
    if (data?.data?.length! > 0) {
      const defaultAddress = data?.data?.find((item) => item.isDefault);
      setSelectedAddress(defaultAddress || data?.data?.[0] || null);
    }else{
      setSelectedAddress(null);
    }
  }, [data?.data]);

  const {
    showAddressDetailsWithMapInDessktop,
    showEnterAddress,
    confirmLocation,
  } = router.query;

  const addNewAddressButtonForDesktopHandler = () => {
    router.replace({
      pathname: '/checkout/select-address',
      query: {
        ...router.query,
        showAddressDetailsWithMapInDessktop: showAddressDetailsWithMapInDessktop === 'true' ? 'false' : 'true',
        showMapInDesktop: 'true',
      },
    });
  };

  const continueButtonHandler = () => {
    if (formData.addressLine1) {
      router.replace({
        pathname: '/checkout/select-address',
        query: {
          ...router.query,
          showAddressDetailsWithMapInDessktop: 'true',
          showAddressDetailsInDesktop: 'true',
          showDetailsInExistingAddressContainer: 'true',
        },
      });
    } else {
      toast.error('select location', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const closeIconHandler = () => {
    const { chatId, sellerId, assetId } = router.query;
    router.replace({
      pathname: '/checkout/select-address',
      query: {
        ...(chatId && { chatId }),
        ...(sellerId && { sellerId }),
        ...(assetId && { assetId }),
      },
    });
    setShowEditSection(false);
    setFormData(initialFormData);
    setErrorState(initialErrorState);
  };

  const editButtonHandler = (item: UserInfoType ) => {
    const center = {
      lat: item.lat,
      lng: item.long,
    };
    setUserLocation(center);
    setFormData(item);
    router.replace({
      pathname: '/checkout/select-address',
      query: {
        ...router.query,
        showAddressDetailsWithMapInDessktop: showAddressDetailsWithMapInDessktop === 'true' ? 'false' : 'true',
        showMapInDesktop: 'true',
      },
    });
    setShowEditSection(true);
  };

  // eslint-disable-next-line no-undef
  const onDragEnd = useCallback(
    (e: any) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      if (lat && lng) {
        setUserLocation({
          lat,
          lng,
        });
        getAddressFromLatLng(lat, lng).then((address) => {
          setFormData((prevState) => ({
            ...prevState,
            zipCode: address?.zipCode,
            addressLine1: address?.addressLine1,
            country: address?.country,
            countryShortForm: address?.countryCode,
            state: address?.state,
            city: address?.city,
            lat: lat,
            long: lng,
          }));
        });
      }
    },
    [setUserLocation, setFormData]
  );

  const onPlaceSelected = (place: any) => {
    const placeName = place.name;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setUserLocation({ lat, lng });

    getAddressFromLatLng(lat, lng).then((address) => {
      setFormData((prevState) => ({
        ...prevState,
        zipCode: address?.zipCode,
        addressLine1: `${placeName}, ${address?.addressLine1}`,
        country: address?.country,
        countryShortForm: address?.countryCode,
        state: address?.state,
        city: address?.city,
        lat: lat,
        long: lng,
      }));
    });
  };

  const locateMeHandler = () => {
    /// using getUserLocation start
    getUserLocation()
      .then((userCurrentLocation) => {
        const lat = userCurrentLocation.latitude;
        const lng = userCurrentLocation.longitude;
        map?.panTo({ lat, lng });
        setUserLocation({
          lat,
          lng,
        });

        getAddressFromLatLng(lat, lng).then((address) => {
          setFormData((prevState) => ({
            ...prevState,
            zipCode: address?.zipCode,
            addressLine1: `${address?.addressLine1}`,
            country: address?.country,
            countryShortForm: address?.countryCode,
            state: address?.state,
            city: address?.city,
            lat: lat,
            long: lng,
          }));
        });
      })
      .catch(() => {
        toast.error(UNABLE_TO_FIND_LOCATION, {
          duration: 4000,
          position: 'top-center',
        });
      });
  };

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
      countryCode,
    }));
    setErrorState((prevState) => ({ ...prevState, phoneNumber: !validatePhoneNumber(`${countryCode}${phoneNumber}`) }));
  };

  const updateButtonHandler = useCallback(async () => {
    const formDataValues = Object.entries(formData);
    let isError = false;
    formDataValues.forEach(([key, value]) => {
      if (key == 'addressNotesAttributes' && value.length == 0) {
        isError = true;
        setErrorState((prevState) => ({ ...prevState, [key]: true }));
      }
      if (key in errorState && !value) {
        setErrorState((prevState) => ({ ...prevState, [key]: true }));
        isError = true;
      }
    });
    const { chatId, sellerId, assetId } = router.query;

    if (!isError) {
      try {
        await updateAddress({
          addressId: formData._id,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode,
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          lat: formData.lat.toString(),
          long: formData.long.toString(),
          addressTypeAttribute: formData.addressTypeAttribute,
          addressNotesAttributes: formData.addressNotesAttributes,
          aptNo: formData.aptNo,
          note: formData.note,
        }).unwrap();

        toast.success('Updated Successfully', {
          duration: 4000,
          position: 'top-center',
        });

        router.replace({
          pathname: '/checkout/select-address',
          query: {
            ...(chatId && { chatId }),
            ...(sellerId && { sellerId }),
            ...(assetId && { assetId }),
          },
        });
        setFormData(initialFormData);
        setShowEditSection(false);
        refetch();
      } catch (error) {
        const Error = error as AddressErrorType;

        toast.error(`${Error?.data?.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  }, [formData, setErrorState, errorState, updateAddress, setFormData, setShowEditSection, refetch, router]);

  const saveAddressButtonHandler = async () => {
    const formDataValues = Object.entries(formData);
    let isError = false;
    formDataValues.forEach(([key, value]) => {
      if (key == 'addressNotesAttributes' && value.length == 0) {
        isError = true;
        setErrorState((prevState) => ({ ...prevState, [key]: true }));
      }

      if (key in errorState && !value) {
        setErrorState((prevState) => ({ ...prevState, [key]: true }));
        isError = true;
      }
    });

    if (!isError) {
      try {
        await addAddress({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode,
          addressLine1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          lat: formData.lat.toString(),
          long: formData.long.toString(),
          addressTypeAttribute: formData.addressTypeAttribute,
          addressNotesAttributes: formData.addressNotesAttributes,
          aptNo: formData.aptNo,
        }).unwrap();

        toast.success('Saved Successfully', {
          duration: 3000,
          position: 'top-center',
        });
        const { chatId, sellerId, assetId } = router.query;
        router.replace({
          pathname: '/checkout/select-address',
          query: {
            ...(chatId && { chatId }),
            ...(sellerId && { sellerId }),
            ...(assetId && { assetId }),
          },
        });
        setFormData(initialFormData);
        refetch();
      } catch (error) {
        const Error = error as AddressErrorType;

        toast.error(`${Error?.data?.message}`, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  };

  const defaultButtonHandler = async (id: string) => {
    try {
      await updateDefault({ addressId: id }).unwrap();
      refetch();
    } catch (error) {
      const Error = error as AddressErrorType;
      toast.error(`${Error?.data?.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const mobileEditBtn = (item: UserInfoType) => {
    setIsOpenAddressModel(false);
    const { chatId, sellerId, assetId } = router.query;
    const center = {
      lat: item.lat,
      lng: item.long,
    };
    setUserLocation(center);
    setFormData(item);
    router.replace({
      pathname: '/checkout/select-address',
      query: {
        ...(chatId && { chatId }),
        ...(sellerId && { sellerId }),
        ...(assetId && { assetId }),
        showEnterAddress: showEnterAddress === 'true' ? 'false' : 'true',
      },
    });
    setShowEditSection(true);
  };

  const deleteButtonHandler = (id: string) => {
    setIsOpenAddressModel(false);
    setIsConfirmationOpen(true);
    setDeleteId(id);
  };

  const toggleEnterAddress = () => {
    router.replace({
      pathname: '/checkout/select-address',
      query: {
        ...router.query,
        showEnterAddress: showEnterAddress === 'true' ? 'false' : 'true',
      },
    });
  };

  const onConfirm = async () => {
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
      toast.error(`${Error?.data?.message}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
  };

  const handleAddNewPaymentMethod = (view?: string, paymentIntentData?: any) => {
    setPaymentIntentData(paymentIntentData);
    if (view === 'mobile') {
      setShowAddPaymentFormView(true);
    }
    setShowPaymentForm(true);
  };

  const confirmLocationHandler = () => {
    router.replace({
      pathname: '/checkout/select-address',
      query: {
        ...router.query,
        showEnterAddress,
        confirmLocation: confirmLocation === 'true' ? 'false' : 'true',
      },
    });
  };

  return (
    <>
      <div
        className={`min-h-screen bg-white dark:mobile:bg-bg-primary-dark ${
          showPaymentForm ? 'dark:bg-bg-secondary-dark' : 'dark:bg-bg-primary-dark'
        }`}
      >
        {isDeleting || isDefaultUpdating ? <FullScreenSpinner /> : null}
        <ConfirmationPopup
          isOpen={isConfirmationOpen}
          message={DELETE_CONFIRM}
          onClose={closeConfirmation}
          onConfirm={onConfirm}
        />
        <Toaster />

        <SecureCheckout
          showAddPaymentFormView={showAddPaymentFormView}
          isOpenAddressModel={isOpenAddressModel}
          data={data?.data!}
          setErrorState={setErrorState}
          setFormData={setFormData }
          errorState={errorState}
          formData={formData}
          changeFormData={changeFormData}
          onPhoneChange={onPhoneChange}
          showEditSection={showEditSection}
          isUpdating={isUpdating}
          isSaving={isSaving}
          showPaymentForm={showPaymentForm}
          router={router}
          defaultButtonHandler={defaultButtonHandler}
          editButtonHandler={editButtonHandler}
          mobileEditBtn={mobileEditBtn}
          deleteButtonHandler={deleteButtonHandler}
          addNewAddressButtonForDesktopHandler={addNewAddressButtonForDesktopHandler}
          toggleEnterAddress={toggleEnterAddress}
          setIsOpenAddressModel={setIsOpenAddressModel}
          updateButtonHandler={updateButtonHandler}
          saveAddressButtonHandler={saveAddressButtonHandler}
          setShowAddPaymentFormView={setShowAddPaymentFormView}
          setShowPaymentForm={setShowPaymentForm}
          handleAddNewPaymentMethod={handleAddNewPaymentMethod}
          closeIconHandler={closeIconHandler}
          continueButtonHandler={continueButtonHandler}
          locateMeHandler={locateMeHandler}
          setIsMapLoaded={setIsMapLoaded}
          userLocation={userLocation}
          setMap={setMap}
          onDragEnd={onDragEnd}
          onPlaceSelected={onPlaceSelected}
          isMapLoaded={isMapLoaded}
          selectedAddressId={selectedAddress?._id ?? ''}
          confirmLocationHandler={confirmLocationHandler}
          paymentIntentData={paymentIntentData}
        />

        {isOpenAddressModel && (
          <Drawer
            minHeight="80vh"
            isOpen={isOpenAddressModel}
            onClose={() => {
              setIsOpenAddressModel(false);
            }}
            title="Add New Address"
          >
            <AddressSection
              mobileEditBtn={mobileEditBtn}
              isOpenAddressModel={isOpenAddressModel}
              data={data?.data || []}
              toggleEnterAddress={toggleEnterAddress}
              defaultButtonHandler={defaultButtonHandler}
              editButtonHandler={editButtonHandler}
              deleteButtonHandler={deleteButtonHandler}
              setIsOpenAddressModel={setIsOpenAddressModel}
            />
          </Drawer>
        )}
      </div>
    </>
  );
}
