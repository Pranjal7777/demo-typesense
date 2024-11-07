import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AddressCardSkeleton = () => {
  return (
    <div className="dark:bg-bg-primary-dark  border border-[#DBDBDB] p-[9px] max-h-[136px] lg:max-h-fit rounded-[8px] max-w-[427px]  min-w-[320px] md:min-w-[289px] lg:min-w-fit">
      <Skeleton count={3} />

      <div className="w-full flex justify-between">
        <Skeleton width={111} height={26} />
        <div className="flex gap-[16px]">
          <Skeleton height={24} width={24} circle={true} />
          <Skeleton height={24} width={24} circle={true} />
        </div>
      </div>
    </div>
  );
};

export default AddressCardSkeleton;
