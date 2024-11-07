import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ReviewWrapper from '../review-wrapper';

const RatingCardSkeleton = () => {
  return (
    <ReviewWrapper>
      <Skeleton height={20} width={250}/>
      <Skeleton height={30} width={150}/>
      <Skeleton count={4}/>
    </ReviewWrapper>
  );
};

export default RatingCardSkeleton;