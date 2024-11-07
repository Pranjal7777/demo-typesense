import React from 'react';

const ImgSliderSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 w-full h-full">
      <div className="rounded-2xl animate-pulse bg-slate-700 w-full mobile:h-[260px] h-[168px] lg:h-[260px]"></div>
    </div>
  );
};

export default ImgSliderSkeleton;
