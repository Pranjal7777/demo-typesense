import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
import FormInput from '@/components/form/form-input';
import FormHeader from '@/components/form/form-header';
import FormSubHeader from '@/components/form/form-sub-header';
import FormLabel from '@/components/form/form-label';
import { useTranslation } from 'next-i18next';
import PhoneNumberInput from '@/components/form/phone-number-input';
import { FormDropdown } from '@/components/form/form-dropdown';
import { countries } from '@/helper/countries-list';
import {
  OtpData,
  OtpDataWithVerificationForSignUp,
  RequestPayloadForSignUp,
  RequestSendVerificationCodePayload,
} from '@/store/types';
import authApi from '@/store/api-slices/auth';
import { generateDeviceId } from '@/helper/generate-device-id';
import platform from 'platform';
import { useActions } from '@/store/utils/hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import SignupLink from '@/components/ui/signup-link';
import Link from 'next/link';
import { parsePhoneNumber } from 'awesome-phonenumber';

export type CompleteSignUp = {
  completeRegistration: string;
  additionalDetailsMessage: string;
  accountTypeLabel: string;
  individualOption: string;
  firstNamePlaceholder: string;
  lastNamePlaceholder: string;
  accountNamePlaceholder: string;
  referralCodePlaceholder: string;
  phonePlaceholder: string;
  companyOption: string;
  companyOptionFirstNamePlaceholder: string;
  companyOptionLastNamePlaceholder: string;
  companyOptionCompanyPlaceholder: string;
  companyOptionAccountNamePlaceholder: string;
  termsAndConditionsMessage: string;
  continueBtn: string;
  alreadyHaveAccount: string;
  alreadyHaveAccountLink: string;
  emailPlaceholder: string;
};

const RegistrationDetails: React.FC = () => {
  const { t } = useTranslation('auth');
  const CompleteSignUp: CompleteSignUp = t('page.completeSignUp', { returnObjects: true });
  const router = useRouter();

  const [isIndividualOrCompany, setIsIndividualOrCompany] = useState(true);
  const [inviteReferralCode, setInViteReferralCode] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const [isFilled, setIsFilled] = useState(false);

  const { setOtpVerificationDetailsDispatch } = useActions();
  const [errorState, setErrorState] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    country: '',
    companyName: '',
    email: '',
  });

  const [individualData, setIndividualData] = useState({
    accountType: 'individual',
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    countryCode: '',
    country: 'India',
    email: '',
  });

  const [companyData, setCompanyData] = useState({
    accountType: 'company',
    firstName: '',
    lastName: '',
    companyName: '',
    username: '',
    phoneNumber: '',
    countryCode: '',
    country: 'India',
    email: '',
  });

  const [sendVerificationCode] = authApi.useSendVerificationCodeMutation();
  const [phoneNumberValidation] = authApi.useValidatePhoneNumberMutation();
  const [isLoading, setIsLoading] = useState(false);
  const debouncedPhoneNumber = useDebounce(
    {
      countryCode: individualData.countryCode || companyData.countryCode,
      phoneNumber: individualData.phoneNumber || companyData.phoneNumber,
    },
    500
  );

  useEffect(() => {
    //to remove timer from localstorage if the user backs from the screen
    localStorage.removeItem('timer');
    const checkPhoneNumberValidity = async (value: OtpData) => {
      if (value.countryCode || value.phoneNumber) {
        try {
          const requesPayloadForValidPhoneNumber = {
            countryCode: value.countryCode,
            phoneNumber: value.phoneNumber,
          };
          // Make your API call here to check email validity
          const data = await phoneNumberValidation(requesPayloadForValidPhoneNumber).unwrap();

          if (data) {
            setPhoneNumberError('');
          }
        } catch (e) {
          const error = e as { data: { message: string } };
          if (error.data && error.data.message) {
            setPhoneNumberError(error.data.message);
          } else {
            console.error('Unexpected error:', error);
          }
        }
      }
    };

    const fetchPhoneValidity = async () => {
      if (debouncedPhoneNumber) {
        await checkPhoneNumberValidity(debouncedPhoneNumber);
      }
    };

    fetchPhoneValidity();
  }, [debouncedPhoneNumber, phoneNumberValidation]);

  // const [isError,setIsError]=useState(false)

  const onIndividualChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in errorState) {
      // If it matches, update the errorState with an empty string
      setErrorState((prevState) => ({ ...prevState, [name]: '' }));
    }
    // Check if the value contains any special characters, numbers, or spaces
    if (name === 'firstName' || name === 'lastName') {
      // Check if the value contains any special characters, numbers, or spaces
      if (/[^a-zA-Z]/.test(value)) {
        // If it does, don't update the state
        return;
      }
    }
    setIndividualData({ ...individualData, [name]: value });
  };

  const onCompanyChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in errorState) {
      // If it matches, update the errorState with an empty string
      setErrorState((prevState) => ({ ...prevState, [name]: '' }));
    }
    // Check if the value contains any special characters, numbers, or spaces
    if (name === 'firstName' || name === 'lastName') {
      // Check if the value contains any special characters, numbers, or spaces
      if (/[^a-zA-Z]/.test(value)) {
        // If it does, don't update the state
        return;
      }
    }
    setCompanyData({ ...companyData, [name]: value });
  };

  const onPhoneChange = (value: string, data: { dialCode: string; name: string }) => {
    setErrorState({ ...errorState, ['phoneNumber']: '' });

    const country = data.name;
    const countryCode = '+' + data.dialCode;
    const realPhone = value;
    const phoneNumber = realPhone.substring(countryCode.length - 1);
    if (isIndividualOrCompany) {
      setIndividualData({ ...individualData, countryCode, phoneNumber, country });
    } else {
      setCompanyData({ ...companyData, countryCode, phoneNumber });
    }
  };
  useEffect(() => {
    if (individualData.country || companyData.country) {
      if (isIndividualOrCompany) {
        onIndividualChange({
          target: {
            name: 'country',
            value: individualData.country,
          },
        } as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
      } else {
        onCompanyChange({
          target: {
            name: 'country',
            value: companyData.country,
          },
        } as ChangeEvent<HTMLInputElement | HTMLSelectElement>);
      }
    }
  }, [individualData.country, companyData.country]);

  useEffect(() => {
    if (individualData.phoneNumber.length === 10 || companyData.phoneNumber.length === 10) {
      const dataToCheck = isIndividualOrCompany ? individualData : companyData;
      const isDataFilled = Object.values(dataToCheck).every((value) => value);
      setIsFilled(isDataFilled);
    } else {
      setIsFilled(false);
    }
  }, [individualData, companyData]);

  const handleSubmit = () => {
    if (isIndividualOrCompany) {
      //company
      const email = localStorage.getItem('email');
      // const password = localStorage.getItem("password")

      const reqPayloadForLogin: RequestPayloadForSignUp = {
        ...individualData,
        email,
        // password,
        ...(inviteReferralCode && { inviteReferralCode }),
        deviceId: generateDeviceId(),
        deviceMake: platform.name,
        deviceModel: platform.version,
        deviceOs: platform?.os?.family + '-' + platform?.os?.version,
        deviceTypeCode: 3,
        appVersion: '1',
        isAdmin: 0,
        loginType: 1,
        termsAndCond: 1,
      };

      localStorage.setItem('signUpData', JSON.stringify(reqPayloadForLogin));
    } else {
      //individual
      const email = localStorage.getItem('email');
      // const password = localStorage.getItem("password")
      const reqPayloadForLogin: RequestPayloadForSignUp = {
        ...companyData,
        email,
        // password,
        ...(inviteReferralCode && { inviteReferralCode }),
        deviceId: generateDeviceId(),
        deviceMake: platform.name,
        deviceModel: platform.version,
        deviceOs: platform?.os?.family + '-' + platform?.os?.version,
        deviceTypeCode: 3,
        appVersion: '1',
        isAdmin: 0,
        loginType: 1,
        termsAndCond: 1,
      };

      localStorage.setItem('signUpData', JSON.stringify(reqPayloadForLogin));
    }
  };

  const handleSubmitForVerification = async () => {
    //code to show the empty box errors
    if (isIndividualOrCompany) {
      const individualValues = Object.entries(individualData);
      let isError = false;
      for (const [key, value] of individualValues) {
        setErrorState((prevState) => ({ ...prevState, [key]: value.trim() === '' }));
        if(key in errorState && value.trim()==''){
          isError = true;
        }
      }
      const pn = parsePhoneNumber(`${individualData.countryCode}${individualData.phoneNumber}`);
      if(isError){
        return;
      }    
      if (!pn.valid ) {
        setPhoneNumberError('Phone number is not valid!');
        return;
      }
    } else {
      const companyValues = Object.entries(companyData);
      for (const [key, value] of companyValues) {
        setErrorState((prevState) => ({ ...prevState, [key]: value === '' }));
      }
    }

    if (phoneNumberError) {
      setErrorState((prevState) => ({ ...prevState, [phoneNumberError]: phoneNumberError }));
      return;
    }

    if (isIndividualOrCompany) {
      const individualValues = Object.values(individualData);
      if (individualValues.some((value) => value == ' ')) {
        return;
      }

      const reqPayload: RequestSendVerificationCodePayload = {
        countryCode: `${individualData.countryCode}`,
        phoneNumber: individualData.phoneNumber,
        trigger: 1,
      };
      try {
        setIsLoading(true);
        const { data } = await sendVerificationCode(reqPayload).unwrap();
        if (data) {
          const otpVerificationPayload: OtpDataWithVerificationForSignUp = {
            countryCode: `${individualData.countryCode}`,
            phoneNumber: individualData.phoneNumber,
            verificationId: data.verificationId,
            expiryTime: data.expiryTime,
          };
          setOtpVerificationDetailsDispatch(otpVerificationPayload);
          setIsLoading(false);
          localStorage.setItem('verificationId', otpVerificationPayload.verificationId);
          handleSubmit();
          router.push(`${SIGN_UP_PAGE}?step=4`);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    } else {
      const pn = parsePhoneNumber(`${companyData.countryCode}${companyData.phoneNumber}`);
      if (!pn.valid) {
        setPhoneNumberError('Phone number is not Valid!');
        return;
      }

      if (phoneNumberError) {
        setErrorState((prevState) => ({ ...prevState, [phoneNumberError]: phoneNumberError }));
        return;
      }

      const companyValues = Object.values(companyData);
      if (companyValues.some((value) => value === '')) {
        return;
      }
      const reqPayload: RequestSendVerificationCodePayload = {
        countryCode: `${companyData.countryCode}`,
        phoneNumber: companyData.phoneNumber,
        trigger: 1,
      };
      try {
        setIsLoading(true);
        const { data } = await sendVerificationCode(reqPayload).unwrap();
        if (data) {
          const otpVerificationPayload: OtpDataWithVerificationForSignUp = {
            countryCode: `${companyData.countryCode}`,
            phoneNumber: companyData.phoneNumber,
            verificationId: data.verificationId,
            expiryTime: data.expiryTime,
          };
          setOtpVerificationDetailsDispatch(otpVerificationPayload);
          setIsLoading(false);
          handleSubmit();
          router.push(`${SIGN_UP_PAGE}?step=4`);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // const storeData = JSON.parse(localStorage.getItem("googleUser"));

    const storeData = localStorage.getItem('googleUser');

    if (storeData) {
      setIndividualData({
        ...individualData,
        firstName: JSON.parse(storeData)?.displayName,
        email: JSON.parse(storeData)?.email,
        username: JSON.parse(storeData)?.displayName,
      });
      setCompanyData({
        ...companyData,
        firstName: JSON.parse(storeData)?.displayName,
        email: JSON.parse(storeData)?.email,
        username: JSON.parse(storeData)?.displayName,
        companyName: JSON.parse(storeData)?.displayName,
      });
      localStorage.setItem('email', JSON.parse(storeData)?.email);
    }

    const email = localStorage.getItem('email');

    if (email) {
      setIndividualData({ ...individualData, email: email });
      setCompanyData({ ...companyData, email: email });
    }
  }, []);

  const handleSignInClick = useCallback(() => {
    router.push(`${SIGN_IN_PAGE}?step=1`);
  }, [router]);

  return (
    // <div className=' mobile:w-full overflow-y-scroll lg:w-[40%] sm:w-full px-10 py-7 !pt-[60px] w-[40%] flex flex-col items-center justify-between'>
    <>
      <div className=" mobile:px-4 sm:max-w-[408px] w-full mobile:w-full flex flex-col items-center justify-start">
        <div className="w-full h-[13vh] flex flex-col gap-y-2 items-center">
          <FormHeader>{CompleteSignUp.completeRegistration}</FormHeader>
          <FormSubHeader>{CompleteSignUp.additionalDetailsMessage}</FormSubHeader>
        </div>

        <div className="w-full max-h-[61vh] sm:mt-8  overflow-x-visible overflow-y-scroll px-1">
          <div className="w-full flex flex-col">
            <FormLabel className="text-sm mb-2">{CompleteSignUp.accountTypeLabel}</FormLabel>
            <div className="flex items-center justify-between">
              <Button
                buttonType="tertiary"
                className={`${
                  isIndividualOrCompany && ' bg-brand-color text-[#FFF] dark:bg-bg-secondary-dark'
                }dark:!border-border-tertiary-dark border border-border-tertiary-light w-[48%] h-11 rounded`}
                onClick={() => setIsIndividualOrCompany(true)}
              >
                {CompleteSignUp.individualOption}
              </Button>
              <Button
                buttonType="tertiary"
                className={`${
                  !isIndividualOrCompany && ' bg-brand-color text-[#FFF] dark:bg-bg-secondary-dark'
                }dark:!border-border-tertiary-dark border border-border-tertiary-light w-[48%] h-11 rounded`}
                onClick={() => setIsIndividualOrCompany(false)}
              >
                {CompleteSignUp.companyOption}
              </Button>
            </div>
          </div>

          {isIndividualOrCompany ? (
            <>
              <FormInput
                placeholder='Enter your First Name'
                required={true}
                label={CompleteSignUp.firstNamePlaceholder}
                error={errorState.firstName && 'First Name is missing'}
                type="text"
                name="firstName"
                value={individualData.firstName}
                onChange={(e) => onIndividualChange(e)}
              />

              <FormInput
                placeholder='Enter your Last Name'
                required={true}
                label={CompleteSignUp.lastNamePlaceholder}
                error={errorState.lastName && 'Last Name is missing'}
                type="text"
                name="lastName"
                value={individualData.lastName}
                onChange={(e) => onIndividualChange(e)}
              />

              <FormInput
                placeholder='Enter Account Name' 
                required
                label={CompleteSignUp.accountNamePlaceholder}
                error={errorState.username && 'Account Name is missing'}
                type="text"
                name="username"
                value={individualData.username}
                onChange={(e) => onIndividualChange(e)}
              />

              <FormInput
                placeholder='Enter your Email'
                required
                label={CompleteSignUp.emailPlaceholder}
                error={errorState.email && 'Email is missing'}
                type="email"
                name="email"
                value={individualData.email}
                onChange={(e) => onIndividualChange(e)}
              />

              {/* <FormInput label={CompleteSignUp.phonePlaceholder} type="number" name="phoneNumber" value={individualData.phoneNumber} onChange={(e)=>onIndividualChange(e)}/> */}
              <PhoneNumberInput
                country="in"
                required
                label={CompleteSignUp.phonePlaceholder}
                error={phoneNumberError ? phoneNumberError : errorState.phoneNumber && 'Phone Number is missing'}
                onChange={onPhoneChange}
              />

              <FormDropdown
                required={true}
                label="Country"
                options={countries.data}
                selectedValue={individualData.country}
                // onSelect={setSelectedCountry}
                onSelect={onIndividualChange}
                id="country-selector"
                name="country"
              />

              <FormInput
                required={false}
                label={CompleteSignUp.referralCodePlaceholder}
                type="text"
                name="inviteReferralCode"
                value={inviteReferralCode}
                onChange={(e) => setInViteReferralCode(e.target.value)}
              />
            </>
          ) : (
            <>
              <FormInput
                placeholder='Enter your First Name'
                required={true}
                label={CompleteSignUp.companyOptionFirstNamePlaceholder}
                error={errorState.firstName && 'First Name is missing'}
                type="text"
                name="firstName"
                value={companyData.firstName}
                onChange={(e) => onCompanyChange(e)}
              />

              <FormInput
                placeholder='Enter your Last Name'
                required={true}
                label={CompleteSignUp.companyOptionLastNamePlaceholder}
                error={errorState.lastName && 'Last Name is missing'}
                type="text"
                name="lastName"
                value={companyData.lastName}
                onChange={(e) => onCompanyChange(e)}
              />

              <FormInput
                placeholder='Enter Company Name'
                required={true}
                label={CompleteSignUp.companyOptionCompanyPlaceholder}
                error={errorState.companyName && 'Company Name is missing'}
                type="text"
                name="companyName"
                value={companyData.companyName}
                onChange={(e) => onCompanyChange(e)}
              />

              <FormInput
                placeholder='Enter Account Name'
                required={true}
                label={CompleteSignUp.companyOptionAccountNamePlaceholder}
                error={errorState.username && 'Account Name is missing'}
                type="text"
                name="username"
                value={companyData.username}
                onChange={(e) => onCompanyChange(e)}
              />

              <FormInput
                placeholder='Enter your Email'
                required={true}
                label={CompleteSignUp.emailPlaceholder}
                error={errorState.email && 'Email is missing'}
                type="email"
                name="email"
                value={companyData.email}
                onChange={(e) => onCompanyChange(e)}
              />

              <PhoneNumberInput
                country="in"
                required={true}
                label={CompleteSignUp.phonePlaceholder}
                error={phoneNumberError ? phoneNumberError : errorState.phoneNumber && 'Phone Number is missing'}
                onChange={onPhoneChange}
              />

              <FormDropdown
                required={true}
                label="Country"
                options={countries.data}
                selectedValue={companyData.country}
                // onSelect={setSelectedCountry}
                onSelect={onCompanyChange}
                id="country-selector"
                name="country"
              />

              <FormInput
                label={CompleteSignUp.referralCodePlaceholder}
                type="text"
                name="inviteReferralCode"
                value={inviteReferralCode}
                onChange={(e) => setInViteReferralCode(e.target.value)}
              />
            </>
          )}

          <span className="text-xs font-normal text-center text-text-quinary-light w-[70%] mb-4">
            By signing up you are accepting our{' '}
            <Link className="text-brand-color " href={'/terms-of-service'}>
              TERMS & CONDITIONS
            </Link>{' '}
            and{' '}
            <Link className="text-brand-color " href={'/privacy-policy'}>
              PRIVACY POLICY
            </Link>
          </span>
          <Button
            isLoading={isLoading}
            className={`bg-bg-tertiary-light mt-4 dark:bg-bg-undenary-dark text-sm font-semibold !text-[#888888] ${
              isFilled && '!text-text-tertiary-color !bg-brand-color'
            }`}
            buttonType="primary"
            onClick={() => handleSubmitForVerification()}
          >
            {CompleteSignUp.continueBtn}
          </Button>
        </div>
      </div>

      <div className="w-full h-[11vh] flex justify-center items-start">
        <SignupLink
          className="mb-0 mt-3"
          linkText={CompleteSignUp.alreadyHaveAccountLink}
          onClick={handleSignInClick}
          text={CompleteSignUp.alreadyHaveAccount}
        />
      </div>
    </>
  );
};

export default React.memo(RegistrationDetails);
