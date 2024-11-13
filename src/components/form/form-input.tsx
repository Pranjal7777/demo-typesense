import { appClsx } from '@/lib/utils';
import { FC, InputHTMLAttributes } from 'react';
import FormLabel from './form-label';

export type Props = {
  label?: string;
  name: string;
  error?: string | null;
  mainClassName?: string;
  labelClassName?: string;
  className?: string;
  errorClassName?: string;
  placeholderClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput: FC<Props> = ({
  children,
  required,
  label,
  error,
  name,
  mainClassName,
  labelClassName,
  errorClassName,
  className,
  placeholderClassName,
  ...otherProps
}) => {
  return (
    <div className={appClsx('mobile:mb-3 mb-0 w-full', mainClassName)}>
      {label && (
        <FormLabel className={appClsx('', labelClassName)} htmlFor={name}>
          {label}{required && '*'}
        </FormLabel>
      )}
      <div className=" flex items-center mobile:mt-1 mt-1 w-full relative">
        <input
          className={appClsx(
            'w-full px-4  focus:border-brand-color  focus:outline-[#6D3EC1] md:text-sm h-11 border dark:bg-bg-primary-dark dark:border-border-tertiary-dark text-text-secondary-dark dark:text-text-primary-dark border-border-tertiary-light rounded ',
            className,
            placeholderClassName,
            { 'border-error dark:border-error': error }
          )}
          id={name}
          name={name}
          {...otherProps}
          autoComplete="off"
        />
        {children}
      </div>
      {error && (
        <span className={appClsx('text-xs font-normal', errorClassName)} style={{ color: 'red' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default FormInput;
