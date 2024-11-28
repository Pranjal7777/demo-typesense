import { appClsx } from '@/lib/utils';
import React, { FC, HTMLAttributes } from 'react';

type PageMainHeadingProps={
    className?:string
} & HTMLAttributes<HTMLHeadingElement>;

const PageMainHeading:FC<PageMainHeadingProps> = ({children,className}) => {
  return (
    <h1 className={appClsx('dark:text-text-primary-dark text-[28px] md:text-[44px] leading-10 md:leading-[66px] ',className)}>{children}</h1>
  );
};

export default PageMainHeading;