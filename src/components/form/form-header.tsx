import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

export type Props = {
  children: React.ReactNode;
  className?: string;
};

const FormHeader: FC<Props> = ({ className, children }) => {
  return (
    <h1
      className={appClsx(
        'mobile:text-2xl text-text-primary-light dark:text-text-primary-dark mobile:mb-1 text-[28px] font-bold mb-3',
        className
      )}
    >
      {children}
    </h1>
  );
};

export default FormHeader;
