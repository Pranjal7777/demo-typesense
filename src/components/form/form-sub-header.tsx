import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

export type Props = {
  children: React.ReactNode;
  className?: string;
};

const FormSubHeader: FC<Props> = ({ className, children }) => {
  return (
    <h2
      className={appClsx(
        'mobile:text-sm mobile:mb-7 text-base font-normal text-text-quaternary-light dark:text-text-senary-dark mb-7 text-center',
        className
      )}
    >
      {children}
    </h2>
  );
};

export default FormSubHeader;
