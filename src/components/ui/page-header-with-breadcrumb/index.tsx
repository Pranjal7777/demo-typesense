import React, { FC } from 'react';
import Breadcrumb from '../breadcrumb';
import { appClsx } from '@/lib/utils';

type PageHeaderWithBreadcrumbProps = {
  steps: {
    name: string,
    link: string
  }[]
  className?: string,
  slugDetail?: {
    name: string,
    link: string
  }
}

const PageHeaderWithBreadcrumb: FC<PageHeaderWithBreadcrumbProps> = ({ steps, className, slugDetail }) => {

  if (slugDetail) {

    steps = [...steps, slugDetail];
  }

  return (
    <div className={appClsx('z-[1] max-h-[69px] mobile:max-h-[50px] h-full max-w-full w-full bg-bg-secondary-light dark:bg-bg-primary-dark !fixed top-[69px] px-16 mobile:px-4', className)}>
      <div className='flex items-center sm:max-w-[1312px] mobile:max-w-full w-full h-full mx-auto '>
        <Breadcrumb steps={steps} className=' border-error'></Breadcrumb>
      </div>
    </div>
  );
};

export default PageHeaderWithBreadcrumb;