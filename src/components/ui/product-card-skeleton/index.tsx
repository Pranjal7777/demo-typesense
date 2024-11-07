import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <>
      <div className=" card-skeleton max-h-[355px] p-2 md:max-h-[330px] md:max-w-64 h-screen flex flex-col w-full rounded shadow-sm  justify-between animate-pulse border border-1 border-gray-300">
        <div className='flex items-center'>
          <span className='flex items-center justify-center rounded-full max-h-8 max-w-8 md:max-h-9 md:max-w-9 bg-[#e4e4e4]'></span>
          <span className='flex flex-col truncate ml-3'>
            <div className='h-2 bg-[#e4e4e4] rounded w-20 md:w-32'></div>
            <div className='mt-1 h-2 bg-[#e4e4e4] rounded w-16 md:w-24'></div>
          </span>
        </div>

        <div className="image-skeleton max-h-[185px] overflow-hidden flex items-center justify-center md:max-h-[180px] w-full h-full my-2 md:my-auto bg-[#e4e4e4] rounded"></div>

        <div className=' max-h-[51px] w-full h-full flex flex-col justify-between'>
          <div className='h-2 bg-[#e4e4e4] rounded w-24 md:w-40'></div>
          <div className='mt-1 h-2 bg-[#e4e4e4] rounded w-20 md:w-32'></div>
          <span className='flex items-center'>
            <div className='h-2 bg-[#e4e4e4] rounded w-12'></div>
            <div className='ml-2 h-2 bg-[#e4e4e4] rounded w-16 md:w-24'></div>
          </span>
        </div>
      </div>
      <style>
        {
          `
    @media screen and (min-width:320px) and (max-width:445px){
      .image-skeleton{
        height:147px;
      }
        .card-skeleton{
        height: 100%;
        padding:10px 5px;
        }
    `
        }

      </style>
    </>
  );
};

export default ProductCardSkeleton;



