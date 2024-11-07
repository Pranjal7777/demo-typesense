import { appClsx } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

export type Props = {
  htmlFor?: string;
  className?: string;
} & HTMLAttributes<HTMLLabelElement>;

const FormLabel: FC<Props> = ({ children, className, htmlFor, ...otherProps }) => {
  return (
    <label
      className={appClsx(
        'mobile:font-medium text-text-primary-light dark:text-text-primary-dark mobile:text-xs font-normal text-sm',
        className
      )}
      htmlFor={htmlFor}
      {...otherProps}
    >
      {children}
    </label>
  );
};

export default FormLabel;
