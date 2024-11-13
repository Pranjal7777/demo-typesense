
import React, { FC, useEffect } from 'react';
import Spinner from '../loader';
import { appClsx } from '@/lib/utils';

type FullScreenSpinnerProps = {
  className?: string;
};

const FullScreenSpinner: FC<FullScreenSpinnerProps> = ({ className }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className={appClsx('fixed z-[500] flex h-[100vh] w-[100vw] items-center justify-center bg-bg-sexdenary-light opacity-80 inset-0', className)}>
      <Spinner  />
    </div>
  );
};

export default FullScreenSpinner;