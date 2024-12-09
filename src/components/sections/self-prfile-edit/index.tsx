import React, { ChangeEvent, FC, useState } from 'react';
import LeftArrowIcon from '../../../../public/assets/svg/left-arrow-icon';
import ProfileImageContainer from '@/components/ui/profile-image-container';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';
import FormInput from '@/components/form/form-input';
import SvgWrapper from '@/components/ui/svg-wrapper';
import SVG_PATH from '@/lib/svg-path';
import { useTheme } from '@/hooks/theme';
import PhoneNumberInput from '@/components/form/phone-number-input';
import DownArrowIcon from '../../../../public/assets/svg/down-arrow-icon';
import { FormDropdown } from '@/components/form/form-dropdown';
import { countries } from '@/helper/countries-list';
import Button from '@/components/ui/button';
import { SellerProfileType } from '@/store/types/seller-profile-type';
import Model from '@/components/model';
import { SUCCESS_UPDATE } from '../../../../public/images/placeholder';
import ImageContainer from '@/components/ui/image-container';
import EditPopup from './edit-popup';
import validatePhoneNumber from '@/helper/validation/phone-number-validation';
import IsEmailValid from '@/helper/validation/email-validation';
import authApi from '@/store/api-slices/auth';
import { Toaster } from 'sonner';
import showToast from '@/helper/show-toaster';
import UserPlaceholderIcon from '../../../../public/assets/svg/user-placeholder-icon';
import { STATIC_IMAGE_URL } from '@/config';
import { selfProfileApi } from '@/store/api-slices/profile/self-profile';
import OtpVerification from './otp-verification';

type SelfProfileEditSectionProps = {
  profileData?: SellerProfileType;
  leftArrowClickHandler: () => void;
  isMobile: boolean;
  // setProfilePicUrl: (_url: string) => void;
};

export type EditFormDataType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  country: string;
};
export type EditErrorStateType = {
  firstName: boolean;
  lastName: boolean;
  username: boolean;
  email: boolean;
  phoneNumber: boolean;
  countryCode: boolean;
};
export type ErrorMessages = {
  username: string;
  email: string;
  phoneNumber: string;
};
export type VerificationDataType = {
  expiryTime: number;
  verificationId :string;
};

const SelfProfileEditSection: FC<SelfProfileEditSectionProps> = ({ profileData, leftArrowClickHandler, isMobile }) => {
  const [editProfilePicUrl, setEditProfilePicUrl] = useState('');
  console.log(editProfilePicUrl, 'mir profile url ');
  const { theme } = useTheme();
  const initialErrorState: EditErrorStateType = {
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    phoneNumber: false,
    countryCode: false,
  };
  // const initialEditProfileFormData:EditFormDataType = {
  //   firstName: profileData?.firstName || '',
  //   lastName: profileData?.lastName || '',
  //   username: profileData?.username || '',
  //   email: profileData?.email || '',
  //   phoneNumber: profileData?.phoneNumber || '',
  //   countryCode: profileData?.countryCode || '+91',
  //   country: profileData?.country || 'India',
  // };

  // const [initialEditProfileFormData, setInitialEditProfileFormData] = useState<EditFormDataType>({
  //   firstName: profileData?.firstName || '',
  //   lastName: profileData?.lastName || '',
  //   username: profileData?.username || '',
  //   email: profileData?.email || '',
  //   phoneNumber: profileData?.phoneNumber || '',
  //   countryCode: profileData?.countryCode || '+91',
  //   country: profileData?.country || 'India',
  // });
  const initialEditProfileFormData = {
    firstName: profileData?.firstName || '',
    lastName: profileData?.lastName || '',
    username: profileData?.username || '',
    email: profileData?.email || '',
    phoneNumber: profileData?.phoneNumber || '',
    countryCode: profileData?.countryCode || '+91',
    country: profileData?.country || 'India',
  };

  const [errorState, setErrorState] = useState<EditErrorStateType>(initialErrorState);
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
    username: '',
    email: '',
    phoneNumber: '',
  });
  const [isValidating, setIsValidating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [otpError, setOtpError] = useState('');

  const [editProfileFormData, setEditProfileFormData] = useState<EditFormDataType>(initialEditProfileFormData);
  console.log(editProfileFormData, 'mir edit profile form data');
  const [verificationData, setVerificationData] = useState<VerificationDataType | null>(null);
  console.log(verificationData, ' mirchul verificationdata');
  

  const changeFormData = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in errorState) {
      setErrorState((prevState) => ({ ...prevState, [name]: value === '' }));
      if ((name == 'firstName' || name == 'lastName' || name == 'country') && !updatedFields.includes(name)) {
        setUpdatedFields((prevState) => [...prevState, name]);
      }
      if (name == 'email') {
        setErrorState((prevState) => ({ ...prevState, email: !IsEmailValid(value) }));
      }
      if (name == 'username') {
        // Only allow alphanumeric characters for username
        if (value === '') {
          setErrorMessages((prevState) => ({ ...prevState, username: 'Username is missing' }));
          setErrorState((prevState) => ({ ...prevState, username: true }));
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          setErrorMessages((prevState) => ({
            ...prevState,
            username: 'Username can only contain letters and numbers',
          }));
          setErrorState((prevState) => ({ ...prevState, username: true }));
          return; // Don't update form data if invalid characters
        }
      } else if (name == 'email' && !IsEmailValid(value)) {
        setErrorMessages((prevState) => ({ ...prevState, email: 'Email is not valid' }));
      }
    }
    setEditProfileFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  console.log(editProfileFormData, 'mir lol');

  const onPhoneChange = (value: string, data: { dialCode: string; name: string }) => {
    const countryCode = `+${data.dialCode}`;
    const phoneNumber = value.substring(countryCode.length - 1);
    setEditProfileFormData((prevState) => ({
      ...prevState,
      phoneNumber,
      countryCode,
    }));
    const isValidPhoneNumber = validatePhoneNumber(`${countryCode}${phoneNumber}`);
    setErrorState((prevState) => ({ ...prevState, phoneNumber: !isValidPhoneNumber }));
    if (!isValidPhoneNumber) {
      setErrorMessages((prevState) => ({ ...prevState, phoneNumber: 'Phone Number is not valid' }));
    }
  };
  const [updatedFields, setUpdatedFields] = useState<string[]>([]);
  const [congratulationMsg, setCongratulationMsg] = useState('');
  const [validateUserName] = authApi.useValidateUserNameMutation();
  const [validateEmail] = authApi.useValidateEmailMutation();
  const [phoneNumberValidation] = authApi.useValidatePhoneNumberMutation();
  const [updateProfile] = selfProfileApi.useUpdateProfileMutation();
  const [updateUserName] = selfProfileApi.useUpdateUserNameMutation();
  const [updateEmail] = selfProfileApi.useUpdateEmailMutation();
  const [updatePhoneNumber] = selfProfileApi.useUpdatePhoneNumberMutation();
  const [sendVerificationCodeForChangeNumber] = selfProfileApi.useSendVerificationCodeForChangeNumberMutation()
  const [verifyVerificationCode] = selfProfileApi.useVerifyVerificationCodeMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditField, setCurrentEditField] = useState<string | null>(null);
  const [showCongratulationModal, setShowCongratulationModal] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  console.log(congratulationMsg, 'mir congratulationMsg');

  const openModal = (field: string) => {
    setIsModalOpen(true);
    setCurrentEditField(field);
  };
  const closeModal = () => {
    console.log('mir close modal');
    setIsModalOpen(false);
    setShowCongratulationModal(false);
    setEditProfileFormData(initialEditProfileFormData);
    setErrorState(initialErrorState);
    setCongratulationMsg('');
    setShowOtpVerification(false);
    setVerificationData(null);
  };
  const updateButtonHandler = async () => {
    if (currentEditField == 'username') {
      if (errorState.username) return;
      try {
        setIsValidating(true);
        const data = await validateUserName(editProfileFormData.username).unwrap();
        const requestPayload = {
          username: editProfileFormData.username,
        };
        const updateUsernameMsg = await updateUserName(requestPayload);
        setCongratulationMsg(updateUsernameMsg?.data?.message || '');
        // setInitialEditProfileFormData((prevState) => ({ ...prevState, username: editProfileFormData.username }));
        // setUpdatedFields((prevState) => [...prevState, 'username']);
        console.log(data, 'mir user validate data');
      } catch (error) {
        const errorData = error as { data: { message: string } };
        setErrorState((prevState) => ({ ...prevState, username: true }));
        setErrorMessages((prevState) => ({ ...prevState, username: errorData?.data?.message }));
        console.log(errorData?.data?.message, 'mir user validate error');
        return;
      } finally {
        setIsValidating(false);
      }
    } else if (currentEditField == 'email') {
      if (errorState.email) return;
      try {
        const requestPayloadForValidEmail = {
          email: editProfileFormData.email,
        };
        setIsValidating(true);
        const data = await validateEmail(requestPayloadForValidEmail).unwrap();
        // setInitialEditProfileFormData((prevState) => ({ ...prevState, email: editProfileFormData.email }));
        // setUpdatedFields((prevState) => [...prevState, 'email']);
        const updateEmailMsg = await updateEmail({ newEmail: requestPayloadForValidEmail.email });
        setCongratulationMsg(updateEmailMsg?.data?.message || '');
        console.log(data, 'mir email validate data');
      } catch (error) {
        const errorData = error as { data: { message: string } };
        setErrorState((prevState) => ({ ...prevState, email: true }));
        setErrorMessages((prevState) => ({ ...prevState, email: errorData?.data?.message }));
        console.log(errorData?.data?.message, 'mir email validate error');
        return;
      } finally {
        setIsValidating(false);
      }
    } else if (currentEditField == 'phoneNumber') {
      if (errorState.phoneNumber) return;
      try {
        setIsValidating(true);
        const requesPayloadForValidPhoneNumber = {
          countryCode: editProfileFormData.countryCode,
          phoneNumber: editProfileFormData.phoneNumber,
        };
        await phoneNumberValidation(requesPayloadForValidPhoneNumber).unwrap();
        const requestPayloadForSendVerificationCode = {
          countryCode: editProfileFormData.countryCode,
          phoneNumber: editProfileFormData.phoneNumber,
          trigger: 3,
          userId: profileData?._id || '',
        };
          const verificationData = await sendVerificationCodeForChangeNumber(requestPayloadForSendVerificationCode);
          console.log(verificationData.error, 'mirchul verification1 data');
          if(verificationData.error){
            const errorData = verificationData.error as { data: { message: string } };
            setErrorState((prevState) => ({ ...prevState, phoneNumber: true }));
            setErrorMessages((prevState) => ({ ...prevState, phoneNumber: errorData?.data?.message }));
          }else{
            setVerificationData(verificationData.data.data);
            setShowOtpVerification(true);
          }
        
        // setInitialEditProfileFormData((prevState) => ({ ...prevState, phoneNumber: editProfileFormData.phoneNumber,countryCode:editProfileFormData.countryCode }));
        // setUpdatedFields((prevState) => [...prevState, 'phoneNumber']);
      } catch (error) {
        console.log(error, 'mirchul phone number error');
        const errorData = error as { data: { message: string } };
        setErrorState((prevState) => ({ ...prevState, phoneNumber: true }));
        setErrorMessages((prevState) => ({ ...prevState, phoneNumber: errorData?.data?.message }));
        console.log(errorData?.data?.message, 'mir phone number validate error');
        return;
      } finally {
        setIsValidating(false);
      }
    }
    if(currentEditField !== 'phoneNumber'){
      setShowCongratulationModal(true);
    }
  };

  const saveButtonHandler = async () => {
    console.log('mir save button handler');
    if (updatedFields.length == 0 && !editProfilePicUrl) {
      showToast({ message: 'Please select at least one field to update', messageType: 'info' });
      return;
    }
    if (updatedFields.includes('firstName') || updatedFields.includes('lastName')) {
      if (errorState.firstName || errorState.lastName) return;
    }
    const requestPayload: Partial<EditFormDataType> = {};
    updatedFields.forEach((field) => {
      requestPayload[field as keyof EditFormDataType] = editProfileFormData[field as keyof EditFormDataType];
    });
    try {
      setIsUpdating(true);
      const data = await updateProfile({
        ...requestPayload,
        ...(editProfilePicUrl && { profilePic: editProfilePicUrl }),
      }).unwrap();
      console.log(data, 'mir update profile data');
      showToast({ message: 'Profile updated successfully', messageType: 'success' });
    } catch (error) {
      const errorData = error as { data: { message: string } };
      showToast({
        message: errorData?.data?.message || 'Something went wrong please try after sometime',
        messageType: 'error',
      });
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
const onVerificationSuccess = () => {
  setShowOtpVerification(false);
  setShowCongratulationModal(true);
  setVerificationData(null);
}
  // const verifyOtpHandler = async () => {
  //   const data = await verifyVerificationCode({verificationId: verificationData?.verificationId || '', otp: otp}).unwrap();
  // }

  return (
    <div className="text-text-primary-light dark:text-text-primary-dark w-full">
      <Toaster />
      <div className="title relative flex justify-center md:justify-start  items-center gap-x-4 pt-0 pb-5 text-lg md:text-2xl font-semibold">
        <LeftArrowIcon
          onClick={leftArrowClickHandler}
          primaryColor={theme ? '#fff' : '#202020'}
          className="cursor-pointer absolute left-0 md:hidden"
        />
        <LeftArrowIcon
          onClick={leftArrowClickHandler}
          primaryColor={theme ? '#fff' : '#202020'}
          height="22"
          width="22"
          className="cursor-pointer absolute left-0 hidden md:block"
        />
        <p className="md:ml-10 ml-0">Edit Profile</p>
      </div>
      <div className="content flex flex-col    md:flex-row w-full gap-x-16">
        <div className="profile-image w-[120px] self-center md:self-start">
          <div className="profile-image-container w-[100px] h-[100px] relative">
            <>
              {editProfilePicUrl ? (
                <Image
                  width={100}
                  height={100}
                  className=" rounded-full h-full w-full object-cover"
                  // className="absolute  mobile:left-3 rtl:mobile:left-0 rtl:mobile:right-3 "
                  src={editProfilePicUrl}
                  alt="profile-image"
                />
              ) : profileData?.profilePic ? (
                <ProfileImageContainer
                  height={100}
                  width={100}
                  className="rounded-full"
                  src={
                    profileData.profilePic.includes('http')
                      ? profileData.profilePic
                      : `${STATIC_IMAGE_URL}/${profileData.profilePic}`
                  }
                  alt="profile-image"
                />
              ) : (
                <UserPlaceholderIcon height="100" width="100" className="rounded-full" />
              )}
            </>
            <Image
              onClick={() => openModal('profilePic')}
              src={IMAGES.EDIT_PENCIL_ICON}
              alt="profile-image"
              width={24}
              height={24}
              className="rounded-full cursor-pointer absolute bottom-1 right-0"
            />
          </div>
        </div>
        <div className="profile-details flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 ">
          <FormInput
            labelClassName="font-medium"
            error={errorState.firstName ? 'First Name is missing' : ''}
            onChange={(e) => changeFormData(e)}
            value={editProfileFormData.firstName}
            required
            label={'First Name'}
            type="text"
            name="firstName"
            className="h-[45px] px-[12px] mobile:!text-[14px]"
          />
          <FormInput
            labelClassName="font-medium"
            error={errorState.lastName ? 'Last Name is missing' : ''}
            onChange={(e) => changeFormData(e)}
            value={editProfileFormData.lastName}
            required
            label={'Last Name'}
            type="text"
            name="lastName"
            className="h-[45px] px-[12px] mobile:!text-[14px]"
          />
          <div className="relative">
            <FormInput
              labelClassName="font-medium"
              value={profileData?.username || ''}
              required
              disabled
              label={'Username'}
              type="text"
              name="username"
              className="h-[45px] px-[12px] mobile:!text-[14px]"
            />
            <SvgWrapper
              onClick={() => openModal('username')}
              primaryColor={theme ? '#fff' : '#202020'}
              path={SVG_PATH.EDIT_PENCIL_ICON}
              height="16"
              width="16"
              className="absolute right-3 bottom-[30%] sm:bottom-[20%] md:bottom-3"
            />
          </div>
          <div className="relative">
            <FormInput
              labelClassName="font-medium"
              value={profileData?.email || ''}
              required
              disabled
              label={'Email'}
              type="text"
              name="email"
              className="h-[45px] px-[12px] mobile:!text-[14px]"
            />
            <SvgWrapper
              onClick={() => openModal('email')}
              primaryColor={theme ? '#fff' : '#202020'}
              path={SVG_PATH.EDIT_PENCIL_ICON}
              height="16"
              width="16"
              className="absolute right-3 bottom-[30%] sm:bottom-[20%] md:bottom-3"
            />
          </div>

          <div className="relative">
            <PhoneNumberInput
              labelClassName="font-medium"
              buttonClass="bg-transparent"
              country={'in'}
              disabled
              required={true}
              value={`${profileData?.countryCode || '+91'}${profileData?.phoneNumber || ''}`}
              number={`${profileData?.countryCode || '+91'}${profileData?.phoneNumber || ''}`}
              label="Phone Number"
            />
            <DownArrowIcon
              onClick={() => openModal('phoneNumber')}
              primaryColor={theme ? '#fff' : '#202020'}
              height="10"
              width="10"
              className="absolute cursor-pointer right-3 bottom-[34%] sm:bottom-[23%] md:bottom-[17px] rotate-[-90deg]"
            />
          </div>
          <div>
            <FormDropdown
              required={true}
              label="Country"
              options={countries.data}
              selectedValue={editProfileFormData.country}
              onSelect={(e) => changeFormData(e)}
              id="country-selector"
              name="country"
              mainClassName="mb-0"
            />
          </div>
          <Button
            isLoading={isUpdating}
            disabled={isUpdating}
            onClick={saveButtonHandler}
            buttonType="primary"
            className="md:w-[198px] md:mt-4"
          >
            Save
          </Button>
        </div>
      </div>
      {isModalOpen && !isMobile && (
        <Model
          modelClassName=""
          closeIconClassName="absolute right-5 top-5 cursor-pointer "
          className=" text-text-primary-light dark:text-text-primary-dark dark:bg-bg-nonary-dark rounded-[10px] w-[95%] max-w-[456px] h-fit p-5"
          onClose={closeModal}
        >
          {showOtpVerification ? (
            <OtpVerification
              verificationData={verificationData}
              setVerificationData={setVerificationData}
              countryCode={editProfileFormData?.countryCode || ''}
              phoneNumber={editProfileFormData?.phoneNumber || ''}
              onVerificationSuccess={onVerificationSuccess}
              setShowOtpVerification={setShowOtpVerification}
              
            />
          ) : showCongratulationModal ? (
            <div className="flex flex-col dark:bg-bg-nonary-dark items-center gap-y-4 text-text-primary-light dark:text-text-primary-dark">
              <ImageContainer
                className="h-[168px] w-[168px] md:h-[200px] md:w-[200px]"
                height={200}
                width={200}
                alt="update success"
                src={SUCCESS_UPDATE}
              />
              <h3 className="text-2xl font-semibold">Congratulations</h3>
              <p className="text-center text-text-quaternary-dark dark:text-text-septenary-light">
                {congratulationMsg
                  ? congratulationMsg
                  : currentEditField == 'profilePic'
                  ? `you have successfully changed your Profile picture. Please save your changes to update your profile picture.`
                  : `you have successfully changed your ${currentEditField} please check your email address to get updated`}
              </p>
            </div>
          ) : (
            <EditPopup
              setShowCongratulationModal={setShowCongratulationModal}
              setEditProfilePicUrl={setEditProfilePicUrl}
              formInputClassName="dark:bg-bg-nonary-dark"
              isValidating={isValidating}
              errorMessages={errorMessages}
              onPhoneChange={onPhoneChange}
              changeFormData={changeFormData}
              errorState={errorState}
              editProfileFormData={editProfileFormData}
              currentEditField={currentEditField}
              updateButtonHandler={updateButtonHandler}
            />
          )}
        </Model>
      )}

      {isModalOpen && isMobile && (
        <Model
          modelClassName=""
          closeIconClassName="absolute hidden "
          className=" text-text-primary-light dark:text-text-primary-dark dark:bg-bg-primary-dark  rounded-[0px] flex flex-col min-w-screen min-h-screen p-5"
          onClose={closeModal}
        >
          {showOtpVerification ? (
          <OtpVerification
            setShowOtpVerification={setShowOtpVerification}
            verificationData={verificationData}
            setVerificationData={setVerificationData}
            countryCode={editProfileFormData?.countryCode || ''}
              phoneNumber={editProfileFormData?.phoneNumber || ''}
              onVerificationSuccess={onVerificationSuccess}
            />
          ) : (
            <EditPopup
              showLeftArrow={true}
            leftArrowClickHandler={closeModal}
            setEditProfilePicUrl={setEditProfilePicUrl}
            setShowCongratulationModal={setShowCongratulationModal}
            containerClassName="flex-1 flex flex-col"
            formInputClassName="dark:bg-bg-primary-dark"
            isValidating={isValidating}
            errorMessages={errorMessages}
            onPhoneChange={onPhoneChange}
            changeFormData={changeFormData}
            errorState={errorState}
            editProfileFormData={editProfileFormData}
            currentEditField={currentEditField}
            updateButtonHandler={updateButtonHandler}
            />
          )}
          {showCongratulationModal && (
            <Model
              modelClassName=""
              closeIconClassName="absolute right-5 top-5 cursor-pointer "
              className=" text-text-primary-light dark:bg-bg-nonary-dark dark:text-text-primary-dark rounded-[10px] w-[95%] max-w-[456px] h-fit p-5"
              onClose={closeModal}
            >
              <div className="flex dark:bg-bg-nonary-dark flex-col items-center gap-y-4">
                <ImageContainer
                  className="h-[168px] w-[168px] md:h-[200px] md:w-[200px]"
                  height={200}
                  width={200}
                  alt="update success"
                  src={SUCCESS_UPDATE}
                />
                <h3 className="text-2xl font-semibold">Congratulations</h3>
                <p className="text-center text-text-tertiary-light dark:text-text-septenary-light">
                  {congratulationMsg
                    ? congratulationMsg
                    : currentEditField == 'profilePic'
                    ? `you have successfully changed your Profile picture. Please save your changes to update your profile picture.`
                    : `you have successfully changed your ${currentEditField} please check your email address to get updated`}
                </p>
              </div>
            </Model>
          )}
        </Model>
      )}
    </div>
  );
};

export default SelfProfileEditSection;
