import React, { ButtonHTMLAttributes, FC } from 'react';
import Spinner from '../spinner';
import { appClsx } from '@/lib/utils';

//Note:- follow bellow two steps to create new style for button
// button has also

// step-1 button type
export const BUTTON_TYPE_CLASSES = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  quaternary: 'quaternary',
  quinary: 'quinary',
  senary: 'senary',
  disabledBtn: 'disabledBtn',
  septenary: 'septenary',
};

// step-2 default style for new button
const getButton = (buttonType = BUTTON_TYPE_CLASSES.primary) => {
  return {
    [BUTTON_TYPE_CLASSES.primary]:
      ' mobile:h-12 mobile:mb-3 mb-5 text-sm font flex items-center justify-center   text-sm bg-btn-primary-light text-text-secondary-light dark:text-text-primary-dark border-none hover:scale-102 transition-all duration-300 ease-in hover:cursor-pointer w-full outline-none h-11 border rounded text-sm font-semibold ',
    [BUTTON_TYPE_CLASSES.secondary]:
      '  mobile:h-12 mobile:mb-3 mb-5 text-sm font flex items-center justify-center   bg-btn-secondary-light text-text-secondary-light dark:text-text-secondary-dark dark:bg-bg-quaternary-dark border-none hover:scale-102 transition-all duration-300 ease-in hover:cursor-pointer hover:cursor-pointer w-full outline-none h-11 border rounded text-sm font-semibold ',
    [BUTTON_TYPE_CLASSES.tertiary]:
      ' mobile:h-12 mobile:mb-3 mb-5 text-sm font flex items-center justify-center  relative w-full font-semibold text-sm hover:scale-102 transition-all duration-300 ease-in hover:cursor-pointer flex items-center justify-center outline-none h-11 border border-border-tertiary-light dark:border-border-tertiary-dark rounded text-sm font-semibold text-text-primary-light dark:text-text-primary-dark',
    [BUTTON_TYPE_CLASSES.quaternary]:
      ' bg-btn-quaternary-light text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:text-text-primary-dark h-[36px] focus:outline-none hover:bg-bg-tertiary-light font-medium rounded text-sm px-5 mr-1',
    [BUTTON_TYPE_CLASSES.quinary]:
      ' rounded text-base border-brand-color py-2 px-7 text-brand-color border border-brand-color rounded xl:px-7 xl:py-2 2lg:px-6 2lg:py-2 md:px-4 md:py-1 sm:px-3 sm:py-1 xl:text-base 2lg:text-sm sm:text-xs ',
    [BUTTON_TYPE_CLASSES.senary]:
      '  h-[34px] rounded-full px-3 text-sm font flex items-center justify-center   font-semibold text-sm hover:scale-102 transition-all duration-300 ease-in hover:cursor-pointer flex items-center justify-center w-full  outline-none h-11 border-border-tertiary-light border text-sm font-semibold text-text-primary-light dark:text-text-primary-dark',
    [BUTTON_TYPE_CLASSES.septenary]:
       'text-base md:text-lg xl:text-xl font-medium px-4 py-[11px] text-text-tertiary-light dark:text-text-tertiary-dark !border-btn',
    [BUTTON_TYPE_CLASSES.disabledBtn]:
    'text-base md:text-lg bg-[#dc0c0e] font-medium px-4 text-white font-semibold py-[11px] border border-red-400',
  }[buttonType];
};

export type ButtonProps = {
  buttonType?: string;
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, className, buttonType, isDisabled, isLoading, ...otherProps }) => {
  const CustomButton = getButton(buttonType);
  return (
    <button className={appClsx('', CustomButton, className)} {...otherProps} disabled={isDisabled}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
