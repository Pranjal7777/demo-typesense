import { appClsx } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

type PageMainHeadingProps={
    className?:string
} & HTMLAttributes<HTMLHeadingElement>;

const PageMainHeading:FC<PageMainHeadingProps> = ({children,className}) => {
  return (
    <h1 className={appClsx('dark:text-text-primary-dark  mobile:text-[28px]  sm:text-lg lg:text-2xl xl:text-[44px] font-bold mobile:font-semibold ',className)}>{children}</h1>
  );
};

export default PageMainHeading;