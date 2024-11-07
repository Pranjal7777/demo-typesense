import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ReviewWrapper from '../review-wrapper';

const AllRatingSkeleton = () => {
  return (
    <ReviewWrapper >
      <Skeleton height={20} width={250}/>
      <Skeleton height={20} width={150}/>
      <Skeleton height={20} width={250}/>
      <Skeleton height={20} width={150}/>
    </ReviewWrapper>
  );
};

export default AllRatingSkeleton;