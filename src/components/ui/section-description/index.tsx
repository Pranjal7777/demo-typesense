import { appClsx } from '@/lib/utils';
import React, { FC, ReactNode } from 'react';

export type Props = {
  children: ReactNode;
  className?: string;
};

const SectionDescription: FC<Props> = ({ children, className, ...otherProps }) => {
  return (
    <>
      <h3
        className={appClsx(
          ' text-base mobile:text-xs font-normal text-text-tertiary-light dark:text-text-tertiary-dark ',
          className
        )}
        {...otherProps}
      >
        {children}
      </h3>
    </>
  );
};

export default SectionDescription;
