import React, { useEffect } from 'react';
import SectionTitle from '../section-title';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { IMAGES } from '@/lib/images';
import { gumletLoader } from '@/lib/gumlet';

interface ShopByCategory{
    title:string,
    seeAllLink:string,
    items:{
        image:string,
        title:string,
        description:string
    }[]
}

const CategorySlider = () => {
  const { t } = useTranslation('productList');
  const shopByCategory = t('page.shopByCategory',{returnObjects:true}) as ShopByCategory;
 
  useEffect(() => {
    // Set interval to call btnPressNext every 1000 milliseconds (1 second)
    const intervalId = setInterval(btnPressNext, 2500);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Run this effect only once after the component mounts


  const btnPressPrev = () => {
    const box = document.querySelector('.category-container');
    if (box) {
      const width = box.clientWidth;
      if(0===box.scrollLeft){
        box.scrollLeft=box.scrollWidth;
      }else{
        box.scrollLeft -= width; // Changed to += to scroll in the opposite direction
      }
    }
  };

  const btnPressNext = () => {
    const box = document.querySelector('.category-container');
    if (box) {
      const width = box.clientWidth ;
      if (box.scrollLeft + width === box.scrollWidth) { // Check if scrolled fully to the right
        box.scrollLeft = 0; // Reset scrollLeft to go back to the first item
      } else {
        box.scrollLeft += width; // Scroll to the next item
      }
    }
  };
  return (
    <>
      <div className='flex justify-between '>
        <SectionTitle className=' !p-0 !pb-3'>{shopByCategory.title}</SectionTitle>
        <Link className=" flex items-center justify-center sm:hidden mobile:inline" href="/">
          <div className='mt-1.5 flex items-center justify-center'>

            <div className="mr-2 rtl:mr-2 rtl:ml-0 mobile:text-xs text-base text-brand-color font-normal ">
              {shopByCategory.seeAllLink}
            </div>
            <Image
              className=" w-[4px] h-[7px] rtl:mr-2"
              width={4}
              height={7}
              src={`${IMAGES.RIGHT_ARROW_ICON_YELLOW}`}
              loader={gumletLoader}
              alt="grid_category_icon"
            />
          </div>
        </Link>
      </div>
                
      <div className=' relative border-error max-w-full w-full h-[313px] mobile:h-[187px] flex items-center justify-center'>

        <div onClick={btnPressPrev}
          tabIndex={0} role='button'
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault(); 
              btnPressPrev();
            }
          }}className='hover:cursor-pointer mobile:hidden absolute z-[1] left-0 text-2xl text-text-secondary-light rounded-full max-w-[52px] max-h-[52px] w-full h-full flex items-center justify-center bg-bg-quaternary-light dark:bg-bg-senary-dark'>&lt;</div>
        <div onClick={btnPressNext} role='button' tabIndex={0} onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); 
            btnPressNext();
          }
        }}
        className='hover:cursor-pointer mobile:hidden absolute z-[1] right-0 text-2xl text-text-secondary-light rounded-full max-w-[52px] max-h-[52px] w-full h-full flex items-center justify-center bg-bg-quaternary-light dark:bg-bg-senary-dark'>&gt;</div>

        <div className=' category-container border-blue-500 flex w-full h-full overflow-x-scroll scroll-smooth gap-x-7 mobile:gap-3'>
          {
            shopByCategory.items.map((item,key)=>(
              <div key={key} className='hover:cursor-pointer flex flex-col justify-between border-border-primary-light min-w-[240px] mobile:min-w-[140px] w-full h-full'>
                <div className='w-full max-h-[240px] mobile:max-h-[140px] mobile:max-w-[140px] h-full flex items-center justify-center '>
                            
                  <div className=' relative flex items-center justify-center rounded-full max-h-[187px] max-w-[187px] mobile:max-h-[109px] mobile:max-w-[109px] h-full w-full bg-bg-tertiary-light dark:bg-bg-quaternary-dark '>
                    <Image width={100} height={100} className='absolute left-0 right-0 min-w-full min-h-full' src={`${item.image}`} alt={`${item.title}`}/>
                  </div>
                    
                </div>
                <div className=' flex flex-col'>
                  <div className=' text-center text-xl mobile:text-xs font-semibold text-text-primary-light dark:text-text-primary-dark'>{item.title}</div>
                  <div className='text-center text-sm mobile:text-[10px] font-light text-text-tertiary-light dark:text-text-tertiary-dark'>{item.description}</div>
                </div>
              </div>
            ))
          }
        </div>

        <div className="absolute top-0 left-0 w-1/5 h-full bg-gradient-to-r from-white dark:from-bg-primary-dark to-transparent opacity-80"></div>
        <div className="absolute top-0 right-0 w-1/5 h-full bg-gradient-to-l from-white dark:from-bg-primary-dark to-transparent opacity-80"></div>

      </div>
    </>
  );
};

export default CategorySlider;