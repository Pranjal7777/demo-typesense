import React, { FC, useEffect, useState } from 'react';
import CategoryCard from '../../ui/category-card';
import { useTranslation } from 'next-i18next';
// import CategoriesIcon from '../../../../public/assets/svg/categories_icon';
import SectionTitle from '@/components/ui/section-title';
import { ResponseGetAllGrandParentCategoriesPayload } from '@/store/types';
import RightArrowRoundedEdge from '../../../../public/assets/svg/right-arrow-rounded-edge';
import CategoriesIcon from '../../../../public/assets/svg/categories-icon';
import CategoriesDrawer from '@/components/categories-drawer';
import { routeToCategories } from '@/store/utils/route-helper';
import { useRouter } from 'next/router';
import keyDownHandler from '@/helper/key-down-handler';

export type Props = {
  allCategoriesIcon: string;
  categories: ResponseGetAllGrandParentCategoriesPayload;
};

export type category = {
  categoryName: string;
  categoriesIcon: string;
};
export type categoriesSection = {
  title: string;
  seeAllCategories: string;
};

const WhatAreYouLookingFor: FC<Props> = ({ categories }) => {
  const { t } = useTranslation('common');
  const categoriesSection: categoriesSection = t('page.categoriesSection', { returnObjects: true });
  const [isSearchCategoriesDrower, setIsSearchCategoriesDrower] = useState(false);
  const changMenu = () => {
    setIsSearchCategoriesDrower(!isSearchCategoriesDrower);
  };

  const router=useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const categoryRoute=(categoryId:string)=>{
    router.push(routeToCategories({category:{id:categoryId}}));
  };

  return (
    <>
      <CategoriesDrawer
        isSearchCategoriesDrower={isSearchCategoriesDrower}
        changMenu={changMenu}
        // data={categoriesWithChildren}
      />
      <div className="w-full">
        <div className="my-12 mobile:my-9 m-auto h-full">
          <div className="flex items-center justify-between">
            <SectionTitle className="py-0">{categoriesSection.title}</SectionTitle>
            <div className="flex items-center justify-between mobile:hidden cursor-pointer" onClick={changMenu} role='button'tabIndex={0} onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                changMenu();
              }
            }}>
              <CategoriesIcon color="var(--brand-color)" />
              <span className="ml-2 rtl:mr-2 rtl:ml-0 text-base text-brand-color font-medium">
                {categoriesSection.seeAllCategories}
              </span>
            </div>
          </div>

          <div className="mt-8 mobile:mt-4 text-text-primary-light dark:text-text-primary-dark border-primary-color h-full grid xl:grid-cols-6 2lg:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 mobile:grid-cols-4 gap-5 sm:gap-16 md:gap-6">
            {categories?.data?.slice(0, isMobile ? 7 : 6).map((item, index) => (
              <div
                onClick={()=>categoryRoute(item.id)}
                role="button"
                tabIndex={0}
                onKeyUp={(e) => keyDownHandler(e,()=>categoryRoute(item.id))}
                className="cursor-pointer mobile:h-full max-h-[224] md:h-[224px] flex items-center justify-center"
                key={index}
              >
                <CategoryCard category={item} />
              </div>
            ))}

            <div
              className="mt-2 mobile:h-full max-h-[224] h-[224px] w-full flex flex-col items-center sm:justify-center sm:hidden cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-150"
              onClick={changMenu}
              role="button"
              tabIndex={0}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  changMenu();
                }
              }}
            >
              <div className=" bg-bg-quattuordenary-light h-[60px] w-[60px] md:h-[203px] md:w-[203px] flex-wrap rounded-full md:rounded-lg flex justify-center items-center p-2 ">
                <RightArrowRoundedEdge />
              </div>
              <h6 className="mt-6 sm:mt-5 text-xs text-primary md:text-base  font-primary font-normal text-center max-w-[154.6px]">
                See All
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatAreYouLookingFor;
