import { appClsx } from '@/lib/utils';
import React, { FC, useState } from 'react';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import FormLabel from './form-label';

export type Props = {
  number?:string;
  country?: string;
  required?: boolean;
  label?: string;
  error?: string;
  mainClassName?: string;
  labelClassName?: string;
  className?: string;
  inputClass?: string;
  searchClass?: string;
  buttonClass?: string;
  dropdownClass?: string;
  errorClassName?: string;
  children?: React.ReactNode; 
} & PhoneInputProps;

const PhoneNumberInput: FC<Props> = ({
  country,
  required,
  children,
  label,
  error,
  mainClassName,
  labelClassName,
  errorClassName,
  buttonClass,
  searchClass,
  dropdownClass,
  className,
  inputClass,
  number,
  ...otherProps
}) => {
  const phNo = number || '';
  const [phone, setPhone] = useState(phNo);
  const [isFocused, setIsFocused] = useState(false)
  const onFocus = ()=>{
    setIsFocused(true)
  }
 const onBlur = ()=>{
  setIsFocused(false)
 }

  return (
    <>
      <style>
        {/* {`
      .form-control:focus {
        outline: 2px solid var(--brand-color) !important;
      }
      `} */}
      </style>
      <div className={appClsx('mobile:mb-3 mb-0 w-full ', mainClassName)}>
        {label && (
          <FormLabel className={appClsx('', labelClassName)}>
            {label}
            {required && '*'}
          </FormLabel>
        )}
        <div className="mt-1 w-full h-fit relative">
          <PhoneInput
            onBlur={onBlur}
            onFocus={onFocus}
            country={country || 'us'}
            countryCodeEditable={false}
            value={phone}
            onChange={() => setPhone(phone)}
            containerStyle={{}}
            inputStyle={{ border: '', width: '100%', height: '44px' }}
            dropdownStyle={{
              background: 'white',
              color: 'black',
              height: '120px',
            }}
            inputClass={appClsx('!border-none  dark:!bg-bg-primary-dark dark:!text-text-primary-dark', inputClass)}
            searchClass={appClsx(' !border-1 !border-error', searchClass)}
            buttonClass={appClsx(
              ' !border-none dark:!bg-bg-primary-dark dark:hover:!bg-bg-primary-dark !focus:bg-transparent !hover:bg-transparent dark:!text-text-primary-dark',
              buttonClass
            )}
            dropdownClass={appClsx(
              'my-custom-dropdown my-custom-dropdown-active dark:!bg-bg-primary-dark dark:!text-text-primary-dark ',
              dropdownClass
            )}
            containerClass={appClsx(
              '!border-2 w-full outline-none h-fit border dark:bg-bg-primary-dark dark:border-border-tertiary-dark border-border-tertiary-light rounded',
              className,
              `${isFocused ? ' dark:border-brand-color border-brand-color ' : ''}`,
              { 'border-error': error }
            )}
            {...otherProps}
          />
          {/* <input />      */}
          {children}
        </div>
        {error && (
          <span className={appClsx('text-xs font-normal', errorClassName)} style={{ color: 'red' }}>
            {error}
          </span>
        )}
      </div>
    </>
  );
};

export default PhoneNumberInput;