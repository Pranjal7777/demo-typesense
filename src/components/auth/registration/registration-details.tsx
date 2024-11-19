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
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import SignupLink from '@/components/ui/signup-link';
import Link from 'next/link';
import validatePhoneNumber from '@/helper/validation/phone-number-validation';
import { PHONE_NUMBER, PHONE_NUMBER_INVALID_MESSAGE, USER_NAME } from '@/constants/texts';

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
  const CompleteSignUp = t('page.completeSignUp', { returnObjects: true }) as CompleteSignUp;
  const router = useRouter();

  const [isIndividualOrCompany, setIsIndividualOrCompany] = useState(true);
  const [inviteReferralCode, setInViteReferralCode] = useState('');
  const { setOtpVerificationDetailsDispatch } = useActions();
  const [errorState, setErrorState] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    country: '',
    companyName: '',
    email: '',
    inviteReferralCode:''
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
  console.log(individualData, 'mir individualData');

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
  const [validateUserName] = authApi.useValidateUserNameMutation();
  const [validateReferralCode] = authApi.useLazyValidateReferralCodeQuery();
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setErrorState({
      firstName: '',
      lastName: '',
      username: '',
      phoneNumber: '',
      country: '',
      companyName: '',
      email: '',
      inviteReferralCode: '',
    });
  }, [isIndividualOrCompany]);

  useEffect(() => {
    if (individualData.firstName && individualData.lastName) {
      const firstAndLastNameStr = individualData.firstName.substring(0, 3) + individualData.lastName.substring(0, 3);
      const lastFourDigit = Math.floor(1000 + Math.random() * 9000);
      const newUsername = `${firstAndLastNameStr}${lastFourDigit}`;
      setIndividualData({ ...individualData, username: newUsername });
      setErrorState((prevState) => ({ ...prevState, username: '' }));
    }
  }, [individualData.firstName, individualData.lastName]);

  useEffect(() => {
    if (companyData.companyName) {
      const companyNameInLowerCase = companyData.companyName.replace(/\s+/g, '').toLowerCase();
      const lastFourDigit = Math.floor(1000 + Math.random() * 9000);
      const newUsername = `${companyNameInLowerCase}${lastFourDigit}`;
      setCompanyData({ ...companyData, username: newUsername });
      setErrorState((prevState) => ({ ...prevState, username: '' }));
    }
  }, [companyData.companyName]);

  const onIndividualChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'firstName' || name === 'lastName') {
      if (/[^a-zA-Z]/.test(value)) {
        return;
      }
    }
    if (name in errorState) {
      setErrorState((prevState) => ({
        ...prevState,
        [name]: value.trim() == '' ? `${name == 'phoneNumber' ? 'Phone Number' : name} is missing` : '',
      }));
    }
    setIndividualData({ ...individualData, [name]: value });
  };

  const onCompanyChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'firstName' || name === 'lastName') {
      if (/[^a-zA-Z]/.test(value)) {
        return;
      }
    }
    if (name in errorState) {
      setErrorState((prevState) => ({ ...prevState, [name]: value.trim() == '' ? `${name} is missing` : '' }));
    }
    setCompanyData({ ...companyData, [name]: value });
  };

  const onPhoneChange = (value: string, data: { dialCode: string; name: string }) => {
    const country = data.name;
    const countryCode = '+' + data.dialCode;
    const realPhone = value;
    const phoneNumber = realPhone.substring(countryCode.length - 1);
    const isPhoneValid = validatePhoneNumber(`${countryCode}${phoneNumber}`);
    if (!isPhoneValid) {
      setErrorState((prevState) => ({ ...prevState, phoneNumber: PHONE_NUMBER_INVALID_MESSAGE }));
    } else {
      setErrorState((prevState) => ({ ...prevState, phoneNumber: '' }));
    }
    if (isIndividualOrCompany) {
      setIndividualData({ ...individualData, countryCode, phoneNumber, country });
    } else {
      setCompanyData({ ...companyData, countryCode, phoneNumber });
    }
  };

  const onInviteReferralChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInViteReferralCode(e.target.value);
    setErrorState((prevState) => ({ ...prevState, inviteReferralCode: '' }));
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

  const handleSubmit = () => {
    if (isIndividualOrCompany) {
      //company
      const email = localStorage.getItem('email');
      const reqPayloadForLogin: RequestPayloadForSignUp = {
        ...individualData,
        email,
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
      const reqPayloadForLogin: RequestPayloadForSignUp = {
        ...companyData,
        email,
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
    if (isIndividualOrCompany) {
      // validation of individual form Data start
      const individualValues = Object.entries(individualData);
      let isMissing = false;
      let isError = false;
      for (const [key, value] of individualValues) {
        if (key in errorState && value.trim() == '') {
          setErrorState((prevState) => ({
            ...prevState,
            [key]:
              value.trim() === '' &&
              `${key == 'phoneNumber' ? PHONE_NUMBER : key == 'username' ? USER_NAME : key} is missing`,
          }));
          isMissing = true;
        }
      }
      if (isMissing) {
        return;
      }

      if (individualData.username) {
        try {
          setIsLoading(true);
          const data = await validateUserName(individualData.username).unwrap();
          setIsLoading(false);
          if (data) {
            setErrorState((prevState) => ({ ...prevState, username: '' }));
          }
        } catch (e) {
          setIsLoading(false);
          const error = e as { data: { message: string } };
          if (error.data && error.data.message) {
            setErrorState((prevState) => ({ ...prevState, username: `${error.data.message}` }));
          } else {
            setErrorState((prevState) => ({ ...prevState, username: `Unexpected error` }));
          }
          isError = true;
        }
      }

      if (individualData.phoneNumber) {
        const isPhoneValid = validatePhoneNumber(`${individualData.countryCode}${individualData.phoneNumber}`);
        if (isPhoneValid) {
          try {
            const requesPayloadForValidPhoneNumber = {
              countryCode: individualData.countryCode,
              phoneNumber: individualData.phoneNumber,
            };
            const data = await phoneNumberValidation(requesPayloadForValidPhoneNumber).unwrap();
            setIsLoading(false);
            if (data) {
              setErrorState((prevState) => ({ ...prevState, phoneNumber: '' }));
            }
          } catch (e) {
            setIsLoading(false);
            const error = e as { data: { message: string } };
            if (error.data && error.data.message) {
              setErrorState((prevState) => ({ ...prevState, phoneNumber: `${error.data.message}` }));
            } else {
              setErrorState((prevState) => ({ ...prevState, phoneNumber: `Unexpected error` }));
            }
            isError = true;
          }
        } else {
          setIsLoading(false);
          setErrorState((prevState) => ({ ...prevState, phoneNumber: PHONE_NUMBER_INVALID_MESSAGE }));
          isError = true;
        }
      }
      if (inviteReferralCode) {
        try {
          setIsLoading(true);
          const data = await validateReferralCode(inviteReferralCode).unwrap();
          console.log(data, 'mir inviteReferralCode success');
          
          setIsLoading(false);
          if (data) {
            setErrorState((prevState) => ({ ...prevState, inviteReferralCode: '' }));
          }
        } catch (e) {
          setIsLoading(false);
          console.log(e, 'mir inviteReferralCode error');
          const error = e as { data: { message: string } };
          if (error.data && error.data.message) {
            setErrorState((prevState) => ({ ...prevState, inviteReferralCode: `${error.data.message}` }));
          } else {
            setErrorState((prevState) => ({ ...prevState, inviteReferralCode: `Unexpected error` }));
          }
          isError = true;
        }
      }
      if (isError) {
        return;
      }
      // validation of individual form Data end
    } else {
      // validation of company form Data start
      const companyValues = Object.entries(companyData);
      let isError = false;
      let isMissing = false;
      for (const [key, value] of companyValues) {
        if (key in errorState && value.trim() == '') {
          setErrorState((prevState) => ({
            ...prevState,
            [key]:
              value.trim() === '' &&
              `${key == 'phoneNumber' ? PHONE_NUMBER : key == 'username' ? USER_NAME : key} is missing`,
          }));
          isMissing = true;
        }
      }
      if (isMissing) {
        return;
      }
      if (companyData.username) {
        try {
          setIsLoading(true);
          const data = await validateUserName(companyData.username).unwrap();
          setIsLoading(false);
          if (data) {
            setErrorState((prevState) => ({ ...prevState, username: '' }));
          }
        } catch (e) {
          setIsLoading(false);
          const error = e as { data: { message: string } };
          if (error.data && error.data.message) {
            setErrorState((prevState) => ({ ...prevState, username: `${error.data.message}` }));
          } else {
            setErrorState((prevState) => ({ ...prevState, username: `Unexpected error` }));
          }
          isError = true;
        }
      }

      if (companyData.phoneNumber) {
        const isPhoneValid = validatePhoneNumber(`${companyData.countryCode}${companyData.phoneNumber}`);
        if (isPhoneValid) {
          setIsLoading(true);
          try {
            const requesPayloadForValidPhoneNumber = {
              countryCode: companyData.countryCode,
              phoneNumber: companyData.phoneNumber,
            };
            const data = await phoneNumberValidation(requesPayloadForValidPhoneNumber).unwrap();
            setIsLoading(false);
            if (data) {
              setErrorState((prevState) => ({ ...prevState, phoneNumber: '' }));
            }
          } catch (e) {
            setIsLoading(false);
            isError = true;
            const error = e as { data: { message: string } };
            if (error.data && error.data.message) {
              setErrorState((prevState) => ({ ...prevState, phoneNumber: `${error.data.message}` }));
            } else {
              setErrorState((prevState) => ({ ...prevState, phoneNumber: `Unexpected error` }));
            }
            isError = true;
          }
        } else {
          setErrorState((prevState) => ({ ...prevState, phoneNumber: PHONE_NUMBER_INVALID_MESSAGE }));
          isError = true;
        }
      }

      if (inviteReferralCode) {
        try {
          setIsLoading(true);
          const data = await validateReferralCode(inviteReferralCode).unwrap();       
          setIsLoading(false);
          if (data) {
            setErrorState((prevState) => ({ ...prevState, inviteReferralCode: '' }));
          }
        } catch (e) {
          setIsLoading(false);
          const error = e as { data: { message: string } };
          if (error.data && error.data.message) {
            setErrorState((prevState) => ({ ...prevState, inviteReferralCode: `${error.data.message}` }));
          } else {
            setErrorState((prevState) => ({ ...prevState, inviteReferralCode: `Unexpected error` }));
          }
          isError = true;
        }
      }

      if(isError){
        return;
      }
      // validation of company form Data end
    }

    if (isIndividualOrCompany) {
      const individualValues = Object.values(individualData);
      if (individualValues.some((value) => value == '')) {
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

    const signUpData = localStorage.getItem('signUpData');
    if (signUpData) {
      const parsedData = JSON.parse(signUpData);
      console.log(parsedData, 'mir signUpData');
      setIndividualData({
        ...individualData,
        email: parsedData.email,
        phoneNumber: parsedData.phoneNumber,
        countryCode: parsedData.countryCode,
        country: parsedData.country,
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        username: parsedData.username,
      });
      setCompanyData({
        ...companyData,
        email: parsedData.email,
        phoneNumber: parsedData.phoneNumber,
        countryCode: parsedData.countryCode,
        country: parsedData.country,
      });
    }
  }, []);

  const handleSignInClick = useCallback(() => {
    router.push(`${SIGN_IN_PAGE}?step=1`);
  }, [router]);

  return (
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
                placeholder="Enter your First Name"
                required={true}
                label={CompleteSignUp.firstNamePlaceholder}
                error={errorState.firstName && 'First Name is missing'}
                type="text"
                name="firstName"
                value={individualData.firstName}
                onChange={(e) => onIndividualChange(e)}
              />

              <FormInput
                placeholder="Enter your Last Name"
                required={true}
                label={CompleteSignUp.lastNamePlaceholder}
                error={errorState.lastName && 'Last Name is missing'}
                type="text"
                name="lastName"
                value={individualData.lastName}
                onChange={(e) => onIndividualChange(e)}
              />

              <FormInput
                placeholder="Enter Account Name"
                required
                label={CompleteSignUp.accountNamePlaceholder}
                error={errorState.username}
                type="text"
                name="username"
                value={individualData.username}
                onChange={(e) => onIndividualChange(e)}
              />

              <FormInput
                placeholder="Enter your Email"
                required
                label={CompleteSignUp.emailPlaceholder}
                error={errorState.email && 'Email is missing'}
                type="email"
                name="email"
                disabled={true}
                value={individualData.email}
                onChange={(e) => onIndividualChange(e)}
              />
              <PhoneNumberInput
                country="in"
                required
                value={individualData.countryCode + individualData.phoneNumber}
                label={CompleteSignUp.phonePlaceholder}
                error={errorState.phoneNumber}
                onChange={onPhoneChange}
              />

              <FormDropdown
                required={true}
                label="Country"
                options={countries.data}
                selectedValue={individualData.country}
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
                onChange={onInviteReferralChange}
                error={errorState.inviteReferralCode}
              />
            </>
          ) : (
            <>
              <FormInput
                placeholder="Enter your First Name"
                required={true}
                label={CompleteSignUp.companyOptionFirstNamePlaceholder}
                error={errorState.firstName && 'First Name is missing'}
                type="text"
                name="firstName"
                value={companyData.firstName}
                onChange={(e) => onCompanyChange(e)}
              />

              <FormInput
                placeholder="Enter your Last Name"
                required={true}
                label={CompleteSignUp.companyOptionLastNamePlaceholder}
                error={errorState.lastName && 'Last Name is missing'}
                type="text"
                name="lastName"
                value={companyData.lastName}
                onChange={(e) => onCompanyChange(e)}
              />

              <FormInput
                placeholder="Enter Company Name"
                required={true}
                label={CompleteSignUp.companyOptionCompanyPlaceholder}
                error={errorState.companyName && 'Company Name is missing'}
                type="text"
                name="companyName"
                value={companyData.companyName}
                onChange={(e) => onCompanyChange(e)}
              />

              <FormInput
                placeholder="Enter Account Name"
                required={true}
                label={CompleteSignUp.companyOptionAccountNamePlaceholder}
                error={errorState.username}
                type="text"
                name="username"
                value={companyData.username}
                onChange={(e) => onCompanyChange(e)}
              />

              <FormInput
                placeholder="Enter your Email"
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
                error={errorState.phoneNumber}
                onChange={onPhoneChange}
              />

              <FormDropdown
                required={true}
                label="Country"
                options={countries.data}
                selectedValue={companyData.country}
                onSelect={onCompanyChange}
                id="country-selector"
                name="country"
              />

              <FormInput
                label={CompleteSignUp.referralCodePlaceholder}
                type="text"
                name="inviteReferralCode"
                value={inviteReferralCode}
                onChange={onInviteReferralChange}
                error={errorState.inviteReferralCode}
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
            className={`text-sm font-semibold !text-text-tertiary-color !bg-brand-color
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
