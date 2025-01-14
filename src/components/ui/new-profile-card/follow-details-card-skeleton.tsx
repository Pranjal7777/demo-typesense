import React from 'react'
import Skeleton from 'react-loading-skeleton'

const FollowDetailsCardSkeleton = () => {
  return (
    <div className='flex items-center justify-between py-3'>
        <div className='flex items-center gap-3'>

            <Skeleton circle height={40} width={40}/>
            <div className='flex flex-col gap-1'>
                <Skeleton count={2} height={15} width={150}/>
            </div>
        </div>
            <Skeleton height={30} width={74}/>
    </div>
  )
}

export default FollowDetailsCardSkeleton