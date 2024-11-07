import { appClsx } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';


type SubCategoryCardProps = {
  imageUrl: string;
  title?: string;
  subTitle?: string;
};
const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ imageUrl, title, subTitle }) => {

  return (
    <div
      className={appClsx(
        ' flex flex-col items-center justify-center border-error w-[140px] sm:w-60 max-h-[187px] sm:max-h-[315px] h-full'
      )}
    >
      <div
        className={appClsx(
          ' cursor-pointer hover:scale-105 transition-all duration-100 ease-in border-error w-[140px] h-[140px] sm:h-[240px] sm:w-[240px] flex items-center justify-center'
        )}
      >
        <div className="max-w-[109px] p-4 sm:max-w-[187px] border-error max-h-[109px] sm:max-h-[187px] w-full h-full rounded-full flex items-center justify-center bg-bg-tertiary-light dark:bg-bg-quaternary-dark">
          <Image
            src={imageUrl}
            alt="category_image"
            height={140}
            width={140}
            className={appClsx('w-fit h-fit max-h-[60px] max-w-[60px] sm:max-h-[130px] sm:max-w-[130px]  mix-blend-darken')}
            loading="lazy"
          />
        </div>
      </div>

      <div className={appClsx('flex flex-col items-center justify-center h-full w-full mt-3 sm:mt-5')}>
        <p
          className={appClsx(
            'font-semibold leading-[18px] text-xs md:leading-[30px] md:text-xl text-text-primary-light dark:text-text-primary-dark text-nowrap'
          )}
        >
          {title}
        </p>
        <p
          className={appClsx(
            'text-[10px] md:text-sm leading-[15px] md:leading-[21px] text-text-tertiary-light dark:text-text-tertiary-dark font-normal text-nowrap mt-[2px] sm:mt-1'
          )}
        >
          {subTitle}
        </p>
      </div>
    </div>
  );
};
export default SubCategoryCard;
