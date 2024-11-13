import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PurchaseDetailsSkeleton = () => {
  return (
    <div className="flex-1 h-[86%] overflow-y-scroll hidden md:block  sm:p-5 rounded-t-xl md:border  flex-col border-tertiary-light">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <Skeleton width={100} height={20} />
        <Skeleton width={150} height={20} />
      </div>

      {/* Product Image and Description */}
      <div className="flex items-center mb-6">
        <Skeleton width={80} height={80} className="mr-4" />
        <div>
          <Skeleton width={100} height={20} />
          <Skeleton width={80} height={20} className="mt-2" />
        </div>
      </div>

      {/* Seller Information */}
      <div className="mb-6">
        <Skeleton width={150} height={20} className="mb-2" />
        <div className="flex items-center">
          <Skeleton circle={true} width={50} height={50} className="mr-4" />
          <div>
            <Skeleton width={100} height={20} />
            <Skeleton width={80} height={20} className="mt-1" />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="mb-6">
        <Skeleton width={150} height={20} className="mb-2" />
        <Skeleton width={100} height={20} />
        <Skeleton width={250} height={20} className="mt-2" />
      </div>

      {/* Payment Section */}
      <div className="flex justify-between mt-4">
        <Skeleton width={150} height={20} />
        <Skeleton width={80} height={20} />
      </div>
    </div>
  );
};

export default PurchaseDetailsSkeleton;
