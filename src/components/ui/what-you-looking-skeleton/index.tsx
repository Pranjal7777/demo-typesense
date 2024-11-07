import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const WhatAreYouLookingForSkeleton = () => {
  return (
    <div className="dark:bg-bg-primary-dark  border border-[#DBDBDB] p-[9px] lg:p-[20px] max-h-[156px] lg:max-h-fit rounded-[8px] max-w-[507px]  min-w-[420px] md:min-w-[289px] lg:min-w-fit gap-2 flex flex-col">
      <div>
        <Skeleton width={100} height={100} circle={true} />
        <Skeleton height={24} width={100} />
      </div>

      <div>
        <Skeleton width={100} height={100} circle={true} />
        <Skeleton height={24} width={100} />
      </div>

      <div>
        <Skeleton width={100} height={100} circle={true} />
        <Skeleton height={24} width={100} />
      </div>
    </div>
  );
};

export default WhatAreYouLookingForSkeleton;
