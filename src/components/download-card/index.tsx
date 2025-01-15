import React, { useState, memo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import PhoneNumberInput from '../form/phone-number-input';
import Button, { BUTTON_TYPE_CLASSES } from '../ui/button';
import validatePhoneNumber from '@/helper/validation/phone-number-validation';
import { toast } from 'sonner';
import { PROJECT_NAME } from '@/config';

type AppDownloadSection = {
  heading: string;
  subHeading: string;
  phoneNumberTitle: string;
  phonePlaceHolder: string;
  downloadBtn: string;
  mobileImage: string;
};

const DownloadCard: React.FC = () => {
  const { t } = useTranslation('common');
  const appDownloadSection = t('page.appDownloadSection', { returnObjects: true, projectName: PROJECT_NAME }) as AppDownloadSection;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode]  = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const handlePhoneNumberChange = (value: string, data: { dialCode: string; name: string }) => {
    const countryCode = `+${data.dialCode}`;
    const phoneNumber = value.substring(countryCode.length - 1);
    setPhoneNumber(`${countryCode}${phoneNumber}`);
    setCountryCode(countryCode);
    setPhoneNumberError('');
  };

  const handleDownload = () => {
    if (phoneNumber.trim() === '') {
      setPhoneNumberError('Phone number cannot be blank.');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError('Please enter a valid phone number.');
      return;
    }
    
    setPhoneNumber(countryCode);
    toast.success('Thank you for downloading!');
  };

  return (
    <div className="relative w-full h-[618px] overflow-hidden lg:h-[388px] bg-gradient-color-from">
      <div className="flex-col lg:flex-row flex custom-container mx-auto sm:px-16 mobile:px-4">
        <div className="mt-4 border-error lg:w-[50%] lg:my-12 flex flex-col items-center text-center lg:text-left">
          <div className="md:ml-[8%] items-center flex  flex-col lg:items-start mt-5 lg:mt-0">
            <h2 className="font-semibold text-2xl md:text-[40px] leading-[36px] lg:leading-[60px]  mobile:px-20 ">{appDownloadSection.heading}</h2>
            <p className="max-w-[440px] mt-3 text-xs md:text-base font-normal w-[80%]  lg:w-auto text-text-quaternary-dark">
              {appDownloadSection.subHeading}
            </p>

            <strong className="mt-[70px] lg:mt-7 text-left sm:text-center lg:text-left font-bold text-base self-start">
              {appDownloadSection.phoneNumberTitle}
            </strong>
            <div className="relative mt-3 max-w-[355px] mobile:w-full w-full self-start">
              <PhoneNumberInput
                country="in" 
                placeholder={appDownloadSection.phonePlaceHolder}
                mainClassName=""
                inputClass="dark:!bg-bg-quaternary-dark dark:!text-text-secondary-dark"
                className="text-text-secondary-dark border-none rounded !h-[44px]"
                buttonClass="!border-none dark:!bg-bg-quaternary-dark !bg-transparent"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              >
                <Button
                  onClick={handleDownload}
                  className="absolute top-0 right-0 w-[35%] mobile:w-[107px] mobile:px-3 mobile:h-[45px] mobile:text-xs rounded-l-none"
                  buttonType={BUTTON_TYPE_CLASSES.primary}
                >
                  {appDownloadSection.downloadBtn}
                </Button>
              </PhoneNumberInput>
              {phoneNumberError && <div className="text-red-500 text-xs mt-1">{phoneNumberError}</div>}
            </div>
          </div>
        </div>

        <div className="md:relative lg:w-[50%] h-full w-full flex items-center justify-center place-items-center border-error">
          <Image
            width={400}
            height={640}
            className="mobile:absolute md:absolute lg:object-contain lg:top-0 lg:right-20 sm:object-cover top-[-20px] mobile:top-[280px] mobile:right-0 lg:mr-auto border-error mobile:min-w-[550px] mobile:h-[700px] w-[500px] h-[715px] lg:w-full lg:h-[715px]"
            src={appDownloadSection.mobileImage}
            alt="mobile_image"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(DownloadCard);
