import { appClsx } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

type PageDescriptionProps = {
  className?: string;
} & HTMLAttributes<HTMLHeadingElement>;

const PageDescription: FC<PageDescriptionProps> = ({ children, className, ...otherProps }) => {
  return (
    <h2 className={appClsx('dark:text-[#FFFFFF] mobile:text-[10px]  mobile:font-medium sm:text-xs lg:text-base xl:text-xl font-normal', className)} {...otherProps}>
      {children}
    </h2>
  );
};

export default PageDescription;
