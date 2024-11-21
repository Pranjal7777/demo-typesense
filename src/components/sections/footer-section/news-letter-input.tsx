import React, { useEffect, useState } from 'react';
import Button from '../../ui/button';
import { productsApi } from '@/store/api-slices/products-api';
import { useTranslation } from 'next-i18next';
import { toast } from 'sonner';
import { PROJECT_NAME } from '@/config';

type ConnectSection = {
  title: string;
  tollFree: string;
  newsLetterTitle: string;
  newsLetterInputPlaceholder: string;
  newsLetterSubmitBtnText: string;
};

const NewsLetterInput = () => {
  const { t } = useTranslation('common');
  const connectSection = t('page.connectSection', { returnObjects: true, projectName: PROJECT_NAME.toLowerCase() }) as ConnectSection;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscribeToNewsLetter, { error, isError, isSuccess, data: newData }] =
    productsApi.useSubscribeToNewsLetterMutation();

  const handleNewsLetterSubmit = async () => {
    if (email.trim() === '') {
      toast.error('Input cannot be blank.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setEmailError('');
    setIsLoading(true);

    try {
      await subscribeToNewsLetter(email);
      setEmail('');
    } catch (error) {
      console.error('Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (value: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(value);
  };
  useEffect(() => {
    setEmail('');
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error) {
      toast.error(`* ${(error as { data: { message: string } }).data.message}`);
    }
    if (isSuccess && newData) {
      toast.success(`${newData.message}`);
    }
  }, [isError, isSuccess, error, newData]);

  return (
    <>
      <div className=" w-full mobile:mt-0  h-[44px] relative">
        <input
          className={'w-[80%] text-sm h-full p-4 rtl:mr-14 rtl:pr-24 outline-none text-text-primary-light dark:text-text-secondary-dark rounded-l-md'}
          type="text"
          placeholder={connectSection.newsLetterInputPlaceholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
        />
        {emailError && <div className="text-red-500 text-xs">{emailError}</div>}
        <Button
          onClick={() => handleNewsLetterSubmit()}
          className={` absolute top-0 right-0 w-[92px] mobile:w-[25%] !h-full bg-btn-primary-light rounded-l-none rounded-r-md  text-text-secondary-light dark:text-text-primary-dark text-xs font-semibold ${
            email.trim() === '' ? '!cursor-not-allowed' : ''
          }`}
          disabled={email.trim() === ''}
        >
          {isLoading ? 'Loading...' : connectSection.newsLetterSubmitBtnText}
        </Button>
      </div>
    </>
  );
};

export default NewsLetterInput;
