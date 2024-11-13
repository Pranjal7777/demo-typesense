import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PurchaseCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
      <div className="flex items-center">
        <Skeleton circle width={40} height={40} />
        <div className="ml-3">
          <Skeleton width={120} height={10} />
          <Skeleton width={100} height={10} className="mt-1" />
        </div>
      </div>
      <Skeleton width={80} height={24} className="rounded-full" />
    </div>
  );
};

export default PurchaseCardSkeleton;
