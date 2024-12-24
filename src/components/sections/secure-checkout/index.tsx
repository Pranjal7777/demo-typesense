import Image from 'next/image';
import PrimaryLogo from '../../../../public/assets/svg/primary-logo';
import { NextRouter } from 'next/router';
import BuyFlowAddressCards from '../address-cards/buy-flow-address-card';
import AddressDetails from '../address-details';
import Button from '@/components/ui/button';
import { ADD_ADDRESS_LABEL, ADD_NEW_ADDRESS, ADD_NEW_ADDRESS_CHECKOUT_LABEL, ADDRESS, ADDRESS_LABEL_1, CONFIRM_LOCATION, CONTINUE, DETAILS_OF_PAYMENT, EDIT_ADDRESS, ENTER_ADDRESS, PAYMENT_OPTION, SAVE_ADDRESS, SECURE_CHECKOUT, UPDATE_ADDRESS, UPDATE_LOCATION } from '@/constants/texts';
import PaymentOptionForm from '@/components/form/payment-option-form';
import MyLocationIcon from '../../../../public/assets/svg/my-location-icon';
import EnterAddressHeader from '../enter-address-header';
import GoogleMapComponent from '@/components/ui/google-map';
import AutoCompleteSearchBox from '@/components/ui/auto-complete';
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { getStripePaymentKeys } from '@/helper/payment';
import { useAppSelector } from '@/store/utils/hooks';
import { RootState } from '@/store/store';
import { Toaster } from 'sonner';
import { addressApi } from '@/store/api-slices/profile/address-api';
import { STATIC_IMAGE_URL } from '@/config';
import { MobilePaymentForm } from '@/components/ui/drawer/mobile-payment-form';
import arrowBackWhite from '../../../../public/images/back_arrow_icon_white.svg';
import arrowBack from '../../../../public/images/back-arrow-icon.svg';
import { ErrorStateType } from '@/pages/profile/address';
import { AddressType, UserInfoType } from '@/store/types/profile-type';
import { paymentIntentT } from '@/store/types/checkout-type';
import BuyFlowAddressContainer from '@/containers/address/buy-flow-address-container';

export interface SecureCheckoutProps {
  showAddPaymentFormView: boolean;
  isOpenAddressModel: boolean;
  data: AddressType[] | null;
  setErrorState: Dispatch<SetStateAction<ErrorStateType>>;
  setFormData: React.Dispatch<React.SetStateAction<UserInfoType>>;
  errorState: ErrorStateType;
  formData: UserInfoType;
  changeFormData: (_e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPhoneChange: (_value: string, _data: { dialCode: string; name: string }) => void;
  showEditSection: boolean;
  isUpdating: boolean;
  isSaving: boolean;
  showPaymentForm: boolean;
  router: NextRouter;
  updateButtonHandler: () => void;
  saveAddressButtonHandler: () => void;
  defaultButtonHandler: (_id: string) => void;
  editButtonHandler: (_item: UserInfoType) => void;
  mobileEditBtn: (_item: UserInfoType) => void;
  deleteButtonHandler: (_id: string) => void;
  addNewAddressButtonForDesktopHandler: () => void;
  toggleEnterAddress: () => void;
  setIsOpenAddressModel: Dispatch<SetStateAction<boolean>>;
  setShowAddPaymentFormView: Dispatch<SetStateAction<boolean>>;
  setShowPaymentForm: Dispatch<SetStateAction<boolean>>;
  handleAddNewPaymentMethod: (_type: string, _paymentIntentData: paymentIntentT) => void;
  closeIconHandler: () => void;
  continueButtonHandler: () => void;
  locateMeHandler: () => void;
  setIsMapLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  userLocation:  {
    lat: number;
    lng: number;
  };
  // eslint-disable-next-line no-undef
  setMap: React.Dispatch<React.SetStateAction<google.maps.Map | null>>;
  onDragEnd: (_value: any) => void;
  onPlaceSelected: (_value: any) => void;
  isMapLoaded: boolean;
  selectedAddressId: string;
  confirmLocationHandler: () => void;
  paymentIntentData: paymentIntentT | null;
}

export default function SecureCheckout({
  showAddPaymentFormView,
  isOpenAddressModel,
  data,
  setErrorState,
  setFormData,
  errorState,
  formData,
  changeFormData,
  onPhoneChange,
  showEditSection,
  isUpdating,
  isSaving,
  router,
  defaultButtonHandler,
  editButtonHandler,
  mobileEditBtn,
  deleteButtonHandler,
  addNewAddressButtonForDesktopHandler,
  toggleEnterAddress,
  setIsOpenAddressModel,
  updateButtonHandler,
  saveAddressButtonHandler,
  setShowAddPaymentFormView,
  setShowPaymentForm,
  closeIconHandler,
  continueButtonHandler,
  locateMeHandler,
  setIsMapLoaded,
  userLocation,
  setMap,
  onDragEnd,
  onPlaceSelected,
  isMapLoaded,
  selectedAddressId,
  handleAddNewPaymentMethod,
  confirmLocationHandler,
  paymentIntentData,
}: SecureCheckoutProps) {
  const { myLocation } = useAppSelector((state: RootState) => state.auth);
  const [showDesktopPaymentForm, setShowDesktopPaymentForm] = useState(false);
  const { data: addressData } = addressApi.useGetAllSavedAddressQuery();
  const { assetId, chatId } = router.query;
  const [selectedAddress, setSelectedAddress] = useState(addressData?.data?.filter((item) => item.isDefault)?.[0]);
  const { checkoutProduct } = useAppSelector((state: RootState) => state.checkout);
  const [isLoadingConfirmPayment, setIsLoadingConfirmPayment] = useState(false);
  const stripeInstanceRef= useRef<any>(null);
  const isFormValid = selectedAddressId && paymentIntentData?.clientSecret;
  const sellerUserName = checkoutProduct?.users.username;
  const sealerAccountId = checkoutProduct?.users.accountId;
  const {
    showAddressDetailsWithMapInDessktop,
    showMapInDesktop,
    showEnterAddress,
    confirmLocation,
    showDetailsInExistingAddressContainer
  } = router.query;

  useEffect(() => {
    if (addressData?.data?.length! > 0) {
      const defaultAddress = addressData?.data?.find((item: any) => item.isDefault);
      setSelectedAddress(defaultAddress || addressData?.data?.[0]);
    }
  }, [addressData?.data]);


  const handleStripePaymentKeys = async (view: string) => {
    try {
      const payload = {
        billingAddressId: selectedAddressId,
        chatId: chatId,
        assetId: assetId,
        paymentType: 'PAYMENT_ELEMENT',
      };
      const response = await getStripePaymentKeys(payload, myLocation);
      if (view === 'mobile') {
        return handleAddNewPaymentMethod(view, response?.data?.paymentIntentData);
      }
      setShowDesktopPaymentForm(true);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    if (assetId && selectedAddress?._id && window.innerWidth > 500) {
      handleStripePaymentKeys('desktop');
    }
    if (assetId && selectedAddress?._id && window.innerWidth <= 500) {
      handleStripePaymentKeys('mobile');
    }
  }, [assetId, selectedAddress]);


  const handleConfirmPayment = async() => {
    try {
      setIsLoadingConfirmPayment(true);
      await stripeInstanceRef?.current?.handleSubmit();
      setIsLoadingConfirmPayment(false);
    } catch (error) {
      setIsLoadingConfirmPayment(false);
    }
  };

  return (
    <>
      <header className="hidden lg:block bg-white  border-b dark:border-border-tertiary-dark p-2 dark:bg-bg-secondary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{SECURE_CHECKOUT}</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>{checkoutProduct?.mainCategory}</span>
              <span className="mx-2">&gt;</span>
              <span>Checkout</span>
            </div>
          </div>
          <div
            className="lg:flex items-center absolute left-1/2 transform -translate-x-1/2  hidden cursor-pointer"
            onClick={() => router.push('/')}
          >
            <PrimaryLogo height={150} width={160} className="text-b mr-2" primaryColor="var(--brand-color)" />
          </div>
        </div>
      </header>

      {/* secure checkout  header back button for mobile */}
      <header
        className={`sticky top-0 block lg:hidden bg-white dark:bg-bg-secondary-dark border-b dark:border-border-tertiary-dark p-4 z-50 ${
          showEnterAddress === 'true' ? 'mobile:!hidden' : 'block'
        }`}
      >
        <div className="flex items-center justify-center relative h-8 ">
          <Image
            className="cursor-pointer hover:scale-110 dark:hidden absolute left-0"
            width={18}
            height={18}
            src={arrowBack}
            alt="back-arrow-icon"
            onClick={() => {
              router.back();
            }}
          />
          <button
            onClick={() => {
              router.back();
            }}
          >
            <Image
              className="cursor-pointer hover:scale-110 dark:inline-block hidden fixed left-5 top-5"
              width={18}
              height={18}
              src={arrowBackWhite}
              alt="back-arrow-icon"
              onClick={() => {
                router.back();
              }}
            />
          </button>
          <p className="text-xl font-semibold dark:text-white">{SECURE_CHECKOUT}</p>
        </div>
      </header>

      <div>
        <div className="dark:lg:bg-bg-primary-dark">
          {' '}
          <main
            className={`max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mobile:pt-0  dark:bg-bg-primary-dark mobile:!py-4 ${
              showEnterAddress === 'true' ? 'mobile:!hidden' : 'block'
            }`}
          >
            <div
              className={`lg:hidden lg:p-4 mobile:!pb-1 ${showEnterAddress === 'true' ? 'mobile:!hidden' : 'block'}`}
            >
              <div className="flex items-center mb-4">
                <Image
                  src={STATIC_IMAGE_URL + '/' + checkoutProduct?.images[0].url}
                  alt="Product"
                  width={140}
                  height={140}
                  className="rounded-md mr-4 h-[74px] w-[74px] object-cover object-center"
                />
                <div className="flex flex-col py-1 gap-1">
                  <h3 className="dark:text-white">{checkoutProduct?.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mobile:!text-[12px]">
                    Sold by{' '}
                    <button
                      onClick={() => router.push(`/seller-profile/${sealerAccountId}`)}
                      className="text-brand-color border-b border-brand-color"
                    >
                      {sellerUserName}
                    </button>
                  </p>
                  <p className="text-sm font-semibold mt-auto dark:text-white">{'USD $' + checkoutProduct?.price}</p>
                </div>
              </div>

              <div className="border-t border-border-tertiary-light dark:border-border-tertiary-dark my-5 mobile:!my-3 " />
            </div>
            <div className="lg:flex lg:space-x-8">
              <div className="lg:w-2/3 space-y-8">
                {Array.isArray(data) && data?.length && !showDetailsInExistingAddressContainer ? (
                  <div>
                    <BuyFlowAddressCards
                      defaultButtonHandler={defaultButtonHandler}
                      editButtonHandler={editButtonHandler}
                      mobileEditBtn={mobileEditBtn}
                      deleteButtonHandler={deleteButtonHandler}
                      clickEvent={addNewAddressButtonForDesktopHandler}
                      toggleEnterAddress={toggleEnterAddress}
                      setIsOpenAddressModel={setIsOpenAddressModel}
                    />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-bg-primary-dark border border-border-tertiary-light dark:border-border-tertiary-dark rounded-lg p-6 mobile:!p-4">
                    <h2 className="text-xl font-semibold mb-1 dark:text-white mobile:!text-lg  ">
                      {showDetailsInExistingAddressContainer ? ADDRESS : ADD_ADDRESS_LABEL}
                    </h2>
                    <h4 className="text-sm mb-6 dark:text-gray-300">{ADD_NEW_ADDRESS_CHECKOUT_LABEL}</h4>

                    {showDetailsInExistingAddressContainer ? (
                      <>
                        <AddressDetails
                          setErrorState={setErrorState}
                          setFormData={setFormData}
                          errorState={errorState}
                          formData={formData}
                          changeFormData={changeFormData}
                          onPhoneChange={onPhoneChange}
                          pageType="secure-checkout"
                        />
                        {showEditSection ? (
                          <Button
                            className="w-fit px-12 h-[44px] mt-[20px] mb-[24px]"
                            onClick={updateButtonHandler}
                            isLoading={isUpdating}
                            isDisabled={isUpdating}
                            buttonType={'primary'}
                          >
                            {UPDATE_ADDRESS}
                          </Button>
                        ) : (
                          <Button
                            className="w-fit px-12 h-[44px] mt-[25px] mb-0"
                            onClick={saveAddressButtonHandler}
                            isLoading={isSaving}
                            isDisabled={isSaving}
                            buttonType={'primary'}
                          >
                            {SAVE_ADDRESS}
                          </Button>
                        )}
                      </>
                    ) : null}

                    {!showDetailsInExistingAddressContainer && (
                      <button
                        onClick={addNewAddressButtonForDesktopHandler}
                        className="hidden lg:block text-brand-color dark:text-brand-color border border-brand-color dark:border-brand-color text-[14px] py-[7px] px-[27px] rounded transition duration-200 w-fit font-semibold"
                      >
                        {ADD_NEW_ADDRESS}
                      </button>
                    )}

                    {!showDetailsInExistingAddressContainer && (
                      <button
                        onClick={toggleEnterAddress}
                        className="mobile:!block lg:hidden text-brand-color dark:text-brand-color border border-brand-color dark:border-brand-color text-[14px] py-[7px] px-[27px] rounded transition duration-200 w-fit font-semibold"
                      >
                        {ADD_NEW_ADDRESS}
                      </button>
                    )}
                  </div>
                )}
                {/* mobile payment option */}
                <div className="bg-white dark:bg-bg-primary-dark mobile:!p-4 border border-border-tertiary-light dark:border-border-tertiary-dark rounded-lg p-6 mobile:!mt-4">
                  {
                    <div className="flex justify-between">
                      <h2 className="text-lg font-semibold mb-1 dark:text-white ">{PAYMENT_OPTION}</h2>
                    </div>
                  }
                  {!selectedAddressId && <h4 className="text-sm dark:text-gray-300 mb-6 ">{ADDRESS_LABEL_1}</h4>}

                  {/* add payment method button for mobile */}
                  {!!(showAddPaymentFormView && paymentIntentData) && (
                    <MobilePaymentForm
                      paymentIntentData={paymentIntentData}
                      showAddPaymentFormView={showAddPaymentFormView}
                      setShowPaymentForm={setShowPaymentForm}
                      setShowAddPaymentFormView={setShowAddPaymentFormView}
                      ref={stripeInstanceRef}
                    />
                  )}

                  {/* payment options for desktop */}
                  {showDesktopPaymentForm && (
                    <div className="hidden lg:block">
                      <PaymentOptionForm selectedAddressId={selectedAddressId} />
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0 border border-border-tertiary-light dark:border-border-tertiary-dark rounded-lg h-fit mobile:!mt-2 mobile:!border-none mobile:!mt:2">
                <h3 className="hidden lg:block text-xl font-semibold px-6 pt-6 dark:text-white ">
                  {DETAILS_OF_PAYMENT}
                </h3>
                <div className=" bg-white dark:bg-bg-primary-dark rounded-lg p-6 mobile:!px-0 mobile:!py-2 ">
                  <div className=" hidden lg:flex items-center mb-4" style={{ alignItems: 'unset' }}>
                    <Image
                      src={STATIC_IMAGE_URL + '/' + checkoutProduct?.images[0].url}
                      alt="Product"
                      width={140}
                      height={140}
                      className="rounded-md mr-4 h-[74px] w-[74px] object-cover object-center"
                    />
                    <div className="flex flex-col justify-around ">
                      <h3 className="dark:text-white">{checkoutProduct?.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Sold by{' '}
                        <button
                          onClick={() => router.push(`/seller-profile/${sealerAccountId}`)}
                          className="text-brand-color border-b border-brand-color cursor-pointer"
                        >
                          {sellerUserName}
                        </button>
                      </p>
                      <p className="text-sm font-semibold mt-auto dark:text-white">
                        {'USD $' + checkoutProduct?.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t dark:border-border-tertiary-dark pt-4 dark:text-white mobile:!pb-[80px]">
                    <div>
                      <div>Grand Total</div>
                      <div className="mobile:hidden text-[12px] font-semibold leading-normal border-b-1 border-b-slate-300 mt-2 border-b w-fit ">
                        View Details
                      </div>
                    </div>
                    <div>{'USD $' + checkoutProduct?.price}</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <div className="mobile:fixed  mobile:bg-bg-tertiary-light hidden mobile:bottom-0 mobile:left-0 mobile:right-0 mobile:flex mobile:justify-center  mobile:dark:bg-bg-secondary-dark py-3">
            <Button
              onClick={handleConfirmPayment}
              type="submit"
              isLoading={isLoadingConfirmPayment}
              isDisabled={!isFormValid}
              className={`lg:w-[50%] lg:mt-6 ${
                isFormValid
                  ? 'bg-btn-bg-primary-light hover:bg-btn-bg-primary-light text-white'
                  : ' opacity-[75%] !text-white cursor-not-allowed dark:opacity-50 '
              } !mb-0 mobile:w-[90%] mx-auto`}
            >
              Continue
            </Button>
          </div>
        </div>

        {/* add address google map popup for mobile */}
        {showEnterAddress === 'true' ? (
          <div className="w-full  bg-white flex flex-col  relative z-50 min-h-screen sm:px-[64px] max-w-[1440px] mx-auto dark:bg-bg-primary-dark ">
            <EnterAddressHeader clickEvent={closeIconHandler} confirmLocation={confirmLocation === 'true'}>
              {showEditSection ? EDIT_ADDRESS : ENTER_ADDRESS}
            </EnterAddressHeader>
            {!confirmLocation ? (
              <>
                <div className="w-[100vw] relative pt-[16px] h-[79vh] flex justify-center md:block sm:h-[77vh] overflow-y-scroll  bg-white dark:bg-bg-primary-dark">
                  <GoogleMapComponent
                    setIsMapLoaded={setIsMapLoaded}
                    userLocation={userLocation}
                    setMap={setMap}
                    onDragEnd={onDragEnd}
                    mapTypeControl={false}
                    fullscreenControl={false}
                    streetViewControl={false}
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
                <Button
                  onClick={confirmLocationHandler}
                  className="w-[90%] h-[48px] text-[16px] font-[600] min-w-[343px]  leading-[24px] rounded-[4px] my-[10px] mx-auto"
                >
                  {showEditSection ? UPDATE_LOCATION : CONFIRM_LOCATION}
                </Button>
              </>
            ) : (
              <div className="px-4 mobile:!px-0">
                <BuyFlowAddressContainer>
                  <AddressDetails
                    setErrorState={setErrorState}
                    setFormData={setFormData}
                    errorState={errorState}
                    formData={formData}
                    changeFormData={changeFormData}
                    onPhoneChange={onPhoneChange}
                    pageType="secure-checkout"
                  />
                </BuyFlowAddressContainer>
                {showEditSection ? (
                  <Button
                    className="w-[90%] h-[48px] text-[16px] font-[600] min-w-[343px]  leading-[24px] rounded-[4px] my-[10px] mx-auto "
                    onClick={updateButtonHandler}
                    isLoading={isUpdating}
                    isDisabled={isUpdating}
                    buttonType={'primary'}
                  >
                    {UPDATE_ADDRESS}
                  </Button>
                ) : (
                  <Button
                    className="w-[90%] h-[48px] text-[16px] font-[600] min-w-[343px] leading-[24px] rounded-[4px] my-[10px] mx-auto "
                    onClick={saveAddressButtonHandler}
                    isLoading={isSaving}
                    isDisabled={isSaving}
                    buttonType={'primary'}
                  >
                    {SAVE_ADDRESS}
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : null}

        {!showAddPaymentFormView &&
        !isOpenAddressModel &&
        showAddressDetailsWithMapInDessktop === 'true' &&
        showDetailsInExistingAddressContainer !== 'true' ? (
          // {/* add address section (address details form with map) for desktop start   */}
          <div className="hidden sm:block w-full h-[100vh] overflow-y-scroll absolute dark:bg-slate-700 dark:bg-opacity-[0.2] bg-[#00000080] bg-opacity-[0.5] top-0 z-[10]">
            {showMapInDesktop == 'true' ? (
              <div className="w-[70%] max-w-[580px] flex flex-col items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[12px]  bg-white dark:bg-bg-primary-dark">
                <EnterAddressHeader className="rounded-t-[12px]" clickEvent={closeIconHandler}>
                  {showEditSection ? EDIT_ADDRESS : ENTER_ADDRESS}
                </EnterAddressHeader>
                <div className="map-for-desktop h-[466px] w-full min-h-[456px] relative">
                  <GoogleMapComponent
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
                    {showEditSection ? UPDATE_LOCATION : CONTINUE}
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
            ) : null}
          </div>
        ) : null}
      </div>
      <Toaster />
    </>
  );
}
