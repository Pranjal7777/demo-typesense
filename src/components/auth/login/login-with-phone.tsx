import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { useRouter } from 'next/router';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import { useTranslation } from 'next-i18next';
// import PhoneNumberInput from '@/components/form/phone-number-input';
import authApi from '@/store/api-slices/auth';
import { OtpDataWithVerificationId, RequestSendVerificationCodeForLoginWithPhone } from '@/store/types';
import { useActions } from '@/store/utils/hooks';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import dynamic from 'next/dynamic';
import DownArrowRoundedEdge from '../../../../public/assets/svg/down-arrow-rounded-edge';

const PhoneNumberInput = dynamic(() => import('@/components/form/phone-number-input'));
// import PhoneNumberInput from '@/components/Form/PhoneNumberInput';
export type loginWithPhone = {
  title: string;
  message: string;
  phonePlaceholder: string;
  continueBtn: string;
  or: string;
  loginWithEmail: string;
  connectWith: string;
  google: string;
  facebook: string;
  signUpPrompt: string;
  signUpPromptLink: string;
  otherLoginOptions: string;
};

const LoginWithPhone: React.FC = () => {
  const { t } = useTranslation('auth');
  const loginWithPhoneData: loginWithPhone = t('page.loginWithPhone', { returnObjects: true });

  const router = useRouter();
  // const { page } = router.query;

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [realPhoneNumber, setRealPhoneNumber] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [countryCode, setCountryCode] = useState<string>('');
  const { setOtpVerificationDetailsDispatch } = useActions();

  const handlePhoneInputChange = (
    value: string,
    data: { dialCode: string },
    event: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) => {
    setLoginError('');

    const countryCodes = data?.dialCode;
    const phoneNumbers = value;
    const realPhone = phoneNumbers?.substring(countryCodes?.length);
    setCountryCode(countryCodes);
    setRealPhoneNumber(realPhone);
    setPhoneNumber(formattedValue);
  };

  const [sendVerificationCode] = authApi.useSendVerificationCodeMutation();

  const validatePhoneNumber = (phone: string): boolean => {
    // Validate phone number length (10 digits)
    if (phone.replace(/[^0-9]/g, '').length !== 10) {
      setLoginError('Phone number must be 10 digits');
      return false;
    }
    return true;
  };

  const loginWithPhone = useCallback(async () => {
    if (!validatePhoneNumber(realPhoneNumber)) {
      return;
    }

    setIsLoading(true);
    try {
      const reqPayload: RequestSendVerificationCodeForLoginWithPhone = {
        countryCode: `+${countryCode}`,
        phoneNumber: realPhoneNumber,
        trigger: 2,
        loginType: 1,
      };

      const { data } = await sendVerificationCode(reqPayload).unwrap();

      if (data) {
        const otpVerificationPayload: OtpDataWithVerificationId = {
          countryCode: `+${countryCode}`,
          phoneNumberOrEmail: realPhoneNumber,
          verificationId: data.verificationId,
          expiryTime: data.expiryTime,
          loginType: 1,
        };

        setOtpVerificationDetailsDispatch(otpVerificationPayload);

        setIsLoading(false);

        router.push(`${SIGN_IN_PAGE}?step=3`);
      }
    } catch (e) {
      setIsLoading(false);
      const error = e as { data: { message: string } };
      setLoginError(error.data ? error.data.message : 'Unexpected error occurred');
      console.log('Login Error', e);
    }
  }, [countryCode, realPhoneNumber, sendVerificationCode, setOtpVerificationDetailsDispatch, router]);

  useEffect(() => {
    //to remove timer from localstorage if the user backs from the screen
    localStorage.removeItem('timer');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        loginWithPhone();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loginWithPhone]);

  const backIconHandler =()=>{
    router.push('/login');
  };
  
  return (
    <>
      <div className="mobile:px-4 sm:max-w-[408px] w-full h-full flex flex-col items-center justify-start">
        <div className='md:hidden'>
          <DownArrowRoundedEdge onClick={backIconHandler}  height='16px' width='14px' className='hidden cursor-pointer dark:inline-block rotate-90 absolute left-4 top-4 md:hidden' primaryColor='#FFF'/>
          <DownArrowRoundedEdge onClick={backIconHandler}  height='16px' width='14px' className=' dark:hidden cursor-pointer rotate-90 absolute left-4 top-4 md:hidden' primaryColor='#202020'/>        
        </div>
        <FormHeader>{loginWithPhoneData.title}</FormHeader>
        <FormSubHeader>{loginWithPhoneData.message}</FormSubHeader>

        {/* <FormInput label={loginWithPhoneData.phonePlaceholder} error=''  type="number" name="phoneNumber"/> */}
        <PhoneNumberInput
          label={loginWithPhoneData.phonePlaceholder}
          error={loginError}
          value={phoneNumber}
          onChange={handlePhoneInputChange}
          required={true}
          // country={myLocation.country.toLocaleLowerCase()}
          country="in"
        />

        <Button className='mt-[134px]' buttonType="primary" isLoading={isLoading} isDisabled={isLoading} onClick={() => loginWithPhone()}>
          {loginWithPhoneData.continueBtn}
        </Button>

        <Link className="font-bold text-brand-color" href={`${SIGN_IN_PAGE}?step=1`}>
          {' '}
          {loginWithPhoneData.otherLoginOptions}
        </Link>
      </div>

      <div className="mb-7 text-sm font-semibold">
        <span className="text-text-primary-light dark:text-text-primary-dark">{loginWithPhoneData.signUpPrompt} </span>
        <Link className="font-bold text-brand-color" href={SIGN_UP_PAGE}>
          {loginWithPhoneData.signUpPromptLink}
        </Link>
      </div>
    </>
  );
};

export default React.memo(LoginWithPhone);
