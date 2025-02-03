import Image from 'next/image';
import React from 'react';

type BrandCardProps = {
  imageUrl: string;
  title: string;
};

const BrandCard: React.FC<BrandCardProps> = ({ imageUrl, title }) => {
  return (
    <div className="min-w-[68px] min-h-[102px] sm:min-w-[96px] sm:min-h-[137px]  border-error flex flex-col items-center ">
      <div className=" border border-border m-1 sm:m-2 p-2 bg-bg-secondary-light shadow-lg w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] rounded-full flex items-center justify-center hover:cursor-pointer transition-all duration-100 ease-in">
        <Image src={imageUrl} alt="brand_image" width={80} height={80} className="w-[70px] h-[50px] object-contain" />
      </div>

      <p className=" m-1 sm:m-2 text-[#57585A] dark:text-[#929293] font-normal text-xs md:text-sm leading-[18px] md:leading-[21px] text-center w-full">
        {title}
      </p>
    </div>
  );
};

export default BrandCard;
