import Link from 'next/link';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { IMAGES } from '@/lib/images';
// import Image from 'next/image';
import Button from '@/components/ui/button';
import FormInput from '@/components/form/form-input';
// import { gumletLoader } from '@/lib/gumlet';
import FormHeading from '@/components/form/form-header';
import FormSubHeading from '@/components/form/form-sub-header';
import { useTranslation } from 'next-i18next';
// import { useDebounce } from '@/hooks/useDebounce';
import authApi from '@/store/api-slices/auth';
import { SIGN_IN_PAGE, SIGN_UP_PAGE } from '@/routes';
import { toast } from 'sonner';
import SignUpLink from '@/components/ui/signup-link';
import IsEmailValid from '@/helper/validation/email-validation';

export type SignUpWithEmailAndPassword = {
  signupPrompt: string;
  registerMessage: string;
  emailPlaceholder: string;
  emailError: string;
  passwordPlaceholder: string;
  continueBtn: string;
  alreadyHaveAccount: string;
  alreadyHaveAccountLink: string;
  otherSignUpOptions: string;
};

const RegisterWithEmailAndPassword: React.FC = () => {
  const { t } = useTranslation('auth');
  const SignUpWithEmailAndPassword: SignUpWithEmailAndPassword = t('page.signUpWithEmailAndPassword', {
    returnObjects: true,
  });

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    // password: '',
  });
  // const [showAndHidePassword, setShowAndHidePassword] = useState(false);
  const [signUpEmailError, setSignupEmailError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  // const [passwordError, setPasswordError] = useState<string>('');

  // const debouncedEmail = useDebounce(formData.email, 500);

  const [validateEmail] = authApi.useValidateEmailMutation();

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name == 'email') {
      setSignupEmailError('');
    }
    // else {
    //   setPasswordError('');
    // }
    // if (name === 'password' && value.length > 12) {
    //   return;
    // }
    setFormData({ ...formData, [name]: value });
  }, []);

  // useEffect(() => {
  //   const checkEmailValidity = async (email: string) => {
  //     try {
  //       const requesPayloadForValidEmail = {
  //         email: email,
  //       };
  //       // Make your API call here to check email validity
  //       await validateEmail(requesPayloadForValidEmail).unwrap();
  //     } catch (e) {
  //       const error = e as { data: { message: string } };
  //       if (error.data && error.data.message) {
  //         setSignupEmailError(error.data.message);
  //       } else {
  //         console.error('Unexpected error:', error);
  //       }
  //     }
  //   };

  //   const fetchEmailValidity = async () => {
  //     if (debouncedEmail) {
  //       await checkEmailValidity(debouncedEmail);
  //     }
  //   };

  //   fetchEmailValidity();
  // }, [debouncedEmail, validateEmail]);

  // const validatePassword = (password: string) => {
  //   const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //   return passwordRegex.test(password);
  // };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        signupWithEmailAndPassword();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [formData.email]);

  const signupWithEmailAndPassword = async () => {
    setIsLoading(true);
    // if (!validatePassword(formData.password)) {
    //   setPasswordError(
    //     'Password must be 8 characters long and contain at least one uppercase letter, one digit, and one special character.'
    //   );
    //   return;
    // }

    const requesPayloadForValidEmail = {
      email: formData.email,
    };

    try {
      if(requesPayloadForValidEmail.email == ''){
        setSignupEmailError('Email field is missing');
        setIsLoading(false);
        return;
      }
      
      if(!IsEmailValid(requesPayloadForValidEmail.email)){
        setSignupEmailError('Email is not Valid!');
        setIsLoading(false);
        return;
      }

      const data = await validateEmail(requesPayloadForValidEmail).unwrap();

      if (data) {
        if (
          signUpEmailError
          // || passwordError
        ) {
          return;
        }

        localStorage.setItem('email', formData.email);
        // localStorage.setItem('password', formData.password);
        setIsLoading(false);
        router.push(`${SIGN_UP_PAGE}?step=3`);
      }
    } catch (e) {
      setIsLoading(false);
      const error = e as { data: { message: string }; status: number };
      setSignupEmailError(error?.data?.message);
      if (error.status == 409) {
        localStorage.setItem('auth_email', formData.email);
        // const countdownDuration = 3;

        // ShowToastWithCountdown("Redirecting to SignIn page", countdownDuration, `${SIGN_IN_PAGE}?step=4`);

        toast.info('Redirecting to SignIn page', {
          duration: 5000,
          onAutoClose: () => {
            router.push(`${SIGN_IN_PAGE}?step=4`);
          },
        });
      }
    }
  };

  useEffect(() => {
    const email = localStorage.getItem('auth_email');
    if (email) {
      setFormData({ ...formData, email: email });
      localStorage.removeItem('auth_email');
    }
  }, []);

  const handleSignInClick = useCallback(() => {
    router.push(SIGN_IN_PAGE);
  }, [router]);

  return (
    <>
      {/* // <div className=' mobile:w-full lg:w-[40%] sm:w-full !pt-[59px] w-[40%] flex flex-col items-center justify-between'> */}
      <div className=" mobile:px-4 sm:max-w-[408px] w-full h-full mobile:w-full flex flex-col items-center justify-start">
        <FormHeading className="">{SignUpWithEmailAndPassword.signupPrompt}</FormHeading>
        <FormSubHeading className="">{SignUpWithEmailAndPassword.registerMessage}</FormSubHeading>

        <FormInput
          label={SignUpWithEmailAndPassword.emailPlaceholder}
          labelClassName=' font-medium'
          error={signUpEmailError}
          className="h-[45px]"
          type="text"
          name="email"
          value={formData.email}
          onChange={(e) => onChange(e)}
          required
        />

        {/* <FormInput
          label={SignUpWithEmailAndPassword.passwordPlaceholder}
          error={passwordError}
          className=""
          type={`${showAndHidePassword ? 'text' : 'password'}`}
          name="password"
          value={formData.password}
          onChange={(e) => onChange(e)}
          required
        >
          {showAndHidePassword ? (
            <>
              <Image
                className="absolute right-4 dark:hidden inline"
                width={20}
                height={16}
                src={`${IMAGES.PASSWORD_SHOW_ICON_BLACK}`}
                loader={gumletLoader}
                onClick={() => setShowAndHidePassword(!showAndHidePassword)}
                alt="password_show_icon"
              />
              <Image
                className="absolute right-4 dark:inline hidden"
                width={20}
                height={16}
                src={`${IMAGES.PASSWORD_SHOW_ICON_WHITE}`}
                loader={gumletLoader}
                onClick={() => setShowAndHidePassword(!showAndHidePassword)}
                alt="password_show_icon"
              />
            </>
          ) : (
            <>
              <Image
                className="absolute right-4 dark:hidden inline"
                width={20}
                height={16}
                src={`${IMAGES.PASSWORD_HIDE_ICON_BLACK}`}
                loader={gumletLoader}
                onClick={() => setShowAndHidePassword(!showAndHidePassword)}
                alt="password_hide_icon"
              />
              <Image
                className="absolute right-4 dark:inline hidden"
                width={20}
                height={16}
                src={`${IMAGES.PASSWORD_HIDE_ICON_WHITE}`}
                loader={gumletLoader}
                onClick={() => setShowAndHidePassword(!showAndHidePassword)}
                alt="password_hide_icon"
              />
            </>
          )}
        </FormInput> */}

        <Button className='mt-[111px]' isLoading={isLoading} onClick={() => signupWithEmailAndPassword()}>
          {SignUpWithEmailAndPassword.continueBtn}
        </Button>

        <Link className="font-semibold leading-6 text-brand-color mt-1" href={`${SIGN_UP_PAGE}?step=1`}>
          {' '}
          {SignUpWithEmailAndPassword.otherSignUpOptions}
        </Link>
      </div>

      <SignUpLink
        linkText={SignUpWithEmailAndPassword.alreadyHaveAccountLink}
        onClick={handleSignInClick}
        text={SignUpWithEmailAndPassword.alreadyHaveAccount}
      />
      {/* // </div> */}
    </>
  );
};

export default React.memo(RegisterWithEmailAndPassword);
