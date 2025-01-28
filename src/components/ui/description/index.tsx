import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

export type Props = {
  desc: string[];
  className?:string
};

const Description: FC<Props> = ({ desc , className}) => {
  return (
    <>
      {
        desc.map((item, index) => (
          <p
            className={appClsx('text-base mb-5 lg:mb-12  mobile:!text-sm text-text-primary-light dark:text-text-tertiary-dark',className)}
            key={index}
          >
            {item.toString()}
          </p>
        ))
      }
    </>
  );
};

export default Description;
