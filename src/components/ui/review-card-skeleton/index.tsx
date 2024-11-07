import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type Props = {
  cardClass?: string;
  height?: number;
  width?: number;
  value?: number;

};

const ReviewCardSkeleton: FC<Props> = ({
  cardClass,
  height = 48,
  width = 48,
  value = 1,
}) => {
  return (
    <>
      {
        [...Array(value)].map((_, index) => (
          <div key={index} className={appClsx('flex gap-2', cardClass)}>
            <div className='hidden md:block'>
              <Skeleton height={height} width={width} circle={true}/>
            </div>
            <div className='md:hidden'>
              <Skeleton height={28} width={28} circle={true}/>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <Skeleton  height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
            </div>
          </div>
        ))
      }
    </>
  );
};
export default ReviewCardSkeleton;
