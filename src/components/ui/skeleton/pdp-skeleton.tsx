import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PDPskeleton = () => {
  return (
    <div className="dark:bg-bg-primary-dark h-[100vh] flex flex-col lg:flex-row gap-10 items-center lg:items-start p-[9px] lg:custom-container">
      <div className='flex gap-5'>
        <div className='hidden lg:flex'>
          <Skeleton count={5} height={80} width={80} />
          <Skeleton height={416} width={550} />
        </div>
        <div className='block lg:hidden mt-5'>
          <Skeleton height={306} width={350} />
          <div className='flex gap-2'>
            <Skeleton count={1} height={55} width={55} />
            <Skeleton count={1} height={55} width={55} />
            <Skeleton count={1} height={55} width={55} />
            <Skeleton count={1} height={55} width={55} />
            <Skeleton count={1} height={55} width={55} />

          </div>
        </div>
      </div>
      <div className='flex flex-col'>
        <Skeleton count={1} height={10}  width={100}/>
        <Skeleton count={1} height={15} width={250} />
        <Skeleton count={1} height={10} width={250} />

        <div className='flex gap-1 mt-3'>
          <Skeleton count={1} height={30} width={150}/>
          <Skeleton count={1} height={30} width={150}/>
          <Skeleton count={1} height={30} width={30}/>
        </div>
        <div className='flex gap-1 mt-3'>
          <Skeleton count={1} height={60} width={338}/>
        </div>
        <Skeleton height={40} />
        <Skeleton height={100} />
        <Skeleton height={60} />
      </div>
    </div>
  );
};

export default PDPskeleton;
