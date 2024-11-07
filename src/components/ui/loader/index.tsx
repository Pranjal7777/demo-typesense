import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';
type SpinnerProps = {
  className?: string;
  primaryColor?: string;
};
const Spinner: FC<SpinnerProps> = ({ className }) => {
  return (
    <div
      className={appClsx(
        'spin-fast h-10 w-10 animate-spin rounded-full border-[5px] border-t-brand-color',
        className
      )}
    ></div>
  );
};

export default Spinner;
