import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

export type Props = {
  children: React.ReactNode;
  className?: string;
};

const DividerWithText: FC<Props> = ({ className, children }) => {
  return (
    <div
      className={appClsx(
        'flex w-full items-center justify-center mobile:mb-3 font-normal text-text-primary-light dark:text-text-primary-dark text-xs mb-5',
        className
      )}
    >
      <div className="flex-1 w-full max-w-[133px] border-t border-border-septenary-light dark:border-text-tertiary-dark" />
      &nbsp;&nbsp;{children}&nbsp;&nbsp;
      <div className="flex-1 w-full max-w-[133px] border-t border-border-septenary-light dark:border-text-tertiary-dark" />
    </div>
  );
};

export default DividerWithText;
