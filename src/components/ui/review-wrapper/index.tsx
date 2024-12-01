import { appClsx } from '@/lib/utils';
import React, { FC, ReactNode } from 'react';
type Props = {
    children: ReactNode;
    className?: string;
  };
const ReviewWrapper:FC<Props> = ({children,className=''}) => {
  return (
    <div 
      className={appClsx(' flex flex-col gap-3 w-full max-w-[427px] p-3 md:m-5 mr-0 border border-border-tertiary-light dark:border-border-tertiary-dark rounded-[8px]', className)}>
      {children}
    </div>
  );
};

export default ReviewWrapper;
