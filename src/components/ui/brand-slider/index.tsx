import React, { useEffect } from 'react';
import SectionTitle from '../section-title';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';

interface PopularBrands{
    title:string,
    seeAllLink:string,
    items:{
        image:string,
        brand:string
    }[]
}

function BrandSlider() {

  const { t } = useTranslation('productList');
  const popularBrands = t('page.popularBrands',{returnObjects:true}) as PopularBrands;

  useEffect(() => {
    // Set interval to call btnPressNext every 1000 milliseconds (1 second)
    const intervalId = setInterval(btnPressNext, 3000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Run this effect only once after the component mounts


  const btnPressPrev = () => {
    const box = document.querySelector('.brand-container');
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
    const box = document.querySelector('.brand-container');
    if (box) {
      const width = box.clientWidth;
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
        <SectionTitle className=' !p-0 !pb-3'>{popularBrands.title}</SectionTitle>
        <Link className=" flex items-center justify-center sm:hidden mobile:inline" href="/">
          <div className='mt-1.5 flex items-center justify-center'>

            <div className="mr-2 rtl:mr-2 rtl:ml-0 mobile:text-xs text-base text-brand-color font-normal ">
              {popularBrands.seeAllLink}
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

      <div className=' relative flex items-center justify-center border-error w-full h-[137px] mobile:h-[102px]'>
                
        <div onClick={btnPressPrev} tabIndex={0} role='button' 
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault(); 
              btnPressPrev();
            }
          }}
          className='hover:cursor-pointer mobile:hidden absolute z-[1] left-0 text-2xl text-text-secondary-light rounded-full max-w-[52px] max-h-[52px] w-full h-full flex items-center justify-center bg-bg-quaternary-light dark:bg-bg-senary-dark'>&lt;</div>
        <div onClick={btnPressNext} tabIndex={0} role='button'
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault(); 
              btnPressNext();
            }
          }}
          className='hover:cursor-pointer mobile:hidden absolute z-[1] right-0 text-2xl text-text-secondary-light rounded-full max-w-[52px] max-h-[52px] w-full h-full flex items-center justify-center bg-bg-quaternary-light dark:bg-bg-senary-dark'>&gt;</div>


        <div className='brand-container border-blue-400 w-full h-full flex gap-x-7 overflow-x-scroll scroll-smooth'>
          {
            popularBrands.items?.map((item,key)=>(
              <div key={key} className='hover:cursor-pointer min-w-[96px] mobile:min-w-[68px] h-full flex flex-col items-center justify-between'>
                <div className='shadow dark:border dark:border-border-tertiary-dark dark:bg-bg-quaternary-dark rounded-full max-w-20 max-h-20 mobile:max-h-[60px] mobile:max-w-[60px] h-full w-full p-3 flex items-center justify-center'>
                  <Image width={100} height={100} className='w-full h-full' src={item.image} alt="brand_logo"/>
                </div>
                <div className=' text-text-tertiary-light dark:text-text-tertiary-dark text-sm mobile:text-xs font-normal'>
                  {item.brand}
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
}

export default BrandSlider;