import FormInput from '@/components/form/form-input';
import PhoneNumberInput from '@/components/form/phone-number-input';
import Button from '@/components/ui/button';
import { appClsx } from '@/lib/utils';
import React, { ChangeEvent, FC, useState } from 'react';
import ImageUploader from '@/components/ui/image-upload';
import { EditErrorStateType, EditFormDataType, ErrorMessages } from '.';
import LeftArrowIcon from '../../../../public/assets/svg/left-arrow-icon';
import { useTheme } from '@/hooks/theme';

type EditPopupProps = {
  currentEditField: string | null;
  updateButtonHandler: () => void;
  showLeftArrow?: boolean;
  leftArrowClickHandler?: () => void;
  containerClassName?: string;
  changeFormData: (_e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPhoneChange: (_value: string, _data: { dialCode: string; name: string }) => void;
  errorState: EditErrorStateType;
  editProfileFormData: EditFormDataType;
  errorMessages: ErrorMessages;
  isValidating: boolean;
  formInputClassName?: string;
  setEditProfilePicUrl: (_url: string) => void;
  setShowCongratulationModal: (_value: boolean) => void;

};

const EditPopup: FC<EditPopupProps> = ({
  isValidating,
  errorMessages,
  currentEditField,
  updateButtonHandler,
  containerClassName,
  changeFormData,
  onPhoneChange,
  editProfileFormData,
  errorState,
  formInputClassName,
  setEditProfilePicUrl,
  setShowCongratulationModal,
  showLeftArrow,
  leftArrowClickHandler
}) => {
  const {theme} = useTheme();
  const [isProfilePicUploadSuccess, setIsProfilePicUploadSuccess] = useState(false);
  console.log(isProfilePicUploadSuccess, 'mir error messages in edit popup');

  const onProfilePicUploadSuccess = (data:any) => {
    setIsProfilePicUploadSuccess(true);
    setEditProfilePicUrl(data.url1);
    console.log('Upload successful:', data);
    setShowCongratulationModal(true);
  };
  const onProfilePicUploadFailed = (error: any) => {
    setIsProfilePicUploadSuccess(true);
    console.error('Upload failed:', error);
  };
  const onProfilePicUploadCancel = () => {
    setIsProfilePicUploadSuccess(false);
  };
  const onLeftArrowClick = ()=>{
    leftArrowClickHandler?.();
  }

  return (
    <div className={appClsx('text-text-primary-light dark:text-text-primary-dark ', containerClassName)}>
      <h3 className="text-xl mb-8 font-semibold text-center flex items-center justify-center">{`Change ${
        currentEditField == 'username'
          ? 'User Name'
          : currentEditField == 'email'
            ? 'Email'
            : currentEditField == 'profilePic'
              ? 'Profile Picture'
              : 'Phone Number'
      }`}
      {
        showLeftArrow &&  <LeftArrowIcon
        primaryColor={theme ? '#FFF' : '#202020'}
        onClick={onLeftArrowClick}
        className="absolute left-5 cursor-pointer"
      />
      }
  
      </h3>
      <div className="w-full flex-1 flex md:block flex-col">
        {currentEditField === 'username' ? (
          <FormInput
            labelClassName="font-medium"
            error={errorState.username ? errorMessages.username : ''}
            onChange={(e) => changeFormData(e)}
            value={editProfileFormData.username}
            required
            label={'Username'}
            type="text"
            name="username"
            className={appClsx('h-[45px] px-[12px] mobile:!text-[14px]', formInputClassName)}
          />
        ) : currentEditField === 'email' ? (
          <FormInput
            labelClassName="font-medium"
            error={errorState.email ? errorMessages.email : ''}
            onChange={(e) => changeFormData(e)}
            value={editProfileFormData.email}
            required
            label={'Email'}
            type="text"
            name="email"
            className={appClsx('h-[45px] px-[12px] mobile:!text-[14px]', formInputClassName)}
          />
        ) : currentEditField === 'phoneNumber' ? (
          <PhoneNumberInput
            labelClassName="font-medium"
            buttonClass="bg-transparent dark:!bg-transparent focus:!bg-bg-nonary-dark hover:!bg-bg-nonary-dark"
            country={'in'}
            required={true}
            number={editProfileFormData.countryCode + editProfileFormData.phoneNumber}
            error={errorState.phoneNumber ? errorMessages.phoneNumber : ''}
            label="Phone Number"  
            onChange={onPhoneChange}
            className={appClsx('!bg-transparent ', formInputClassName)}
            inputClass="dark:!bg-transparent"
            
            
          />
        ) : currentEditField == 'profilePic' ? (
          <div className=" flex-1 md:h-[300px]">
            {' '}
            {/* or any height you want */}
            <ImageUploader
              endpoint="/api/upload"
              onUploadSuccess={onProfilePicUploadSuccess}
              onUploadError={onProfilePicUploadFailed}
              onCancelAll={onProfilePicUploadCancel}
            />
          </div>
        ) : null}
      </div>
      {currentEditField != 'profilePic' && (
        <Button isLoading={isValidating} isDisabled={isValidating} onClick={updateButtonHandler} buttonType="primary" className="md:mt-24 mb-0">
          Update
        </Button>
      )}
    </div>
  );
};

export default EditPopup;
