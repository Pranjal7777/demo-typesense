import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import React, { FC, useState } from 'react';

export type category = {
  itemName: string;
  categories: string[];
};

export type Props = {
  item: category;
};

const FooterCategoryCard: FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full cursor-pointer" onClick={() => setIsOpen(!isOpen)} tabIndex={0} role='button' onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); 
          setIsOpen(!isOpen);
        }
      }}>
        <div className="relative  mobile:flex text-xs md:text-base mobile:items-center mobile:justify-between font-bold mobile:py-5 cursor-pointer pb-2">
          {item.itemName}
          {isOpen ? (
            <>
             
              <Image
                width={12}
                height={7}
                className="sm:hidden mr-4 "
                src={IMAGES.UP_ARROW_ICON_WHITE}
                loader={gumletLoader}
                alt="up-arrow-icon"
              />
            </>
          ) : (
            <>
    
              <Image
                width={12}
                height={7}
                className="sm:hidden mr-4 "
                src={IMAGES.DOWN_ARROW_ICON_WHITE}
                loader={gumletLoader}
                alt="down-arrow-icon"
              />
            </>
          )}
          <div className="absolute mobile:hidden md:block bottom-0 left-0 rtl:right-0 w-[55px] border-b border-brand-color"></div>
        </div>
        {item?.categories?.map((sub, index) => (
          <div className={`${!isOpen && 'mobile:hidden'} mt-7 text-[10px] md:text-xs font-normal`} key={index}>
            {sub}
          </div>
        ))}
      </div>
    </>
  );
};

export default FooterCategoryCard;
