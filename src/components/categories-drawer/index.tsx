import { gumletLoader } from '@/lib/gumlet';
import { IMAGES } from '@/lib/images';
import Image from 'next/image';
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import CategoriesCard from './categories-card'; // Assuming the correct import path
import { categories } from '@/store/types';
import CrossIcon from '../../../public/images/cross-icon.svg';
import CrossIconWhite from '../../../public/images/cross_icon_white.svg';
import { useRouter } from 'next/router';
import { routeToCategories } from '@/store/utils/route-helper';
import keyDownHandler from '@/helper/key-down-handler';
import SearchIcon from '../../../public/assets/svg/search-icon';
import { useTheme } from '@/hooks/theme';
type CategoriesDrawerProps = {
  changMenu: () => void;
  isSearchCategoriesDrower: boolean;
  onCategorySelect?: (categoryId: string) => void;
};

const CategoriesDrawer: React.FC<CategoriesDrawerProps> = ({ isSearchCategoriesDrower, changMenu, onCategorySelect }) => {
  const [searchField, setSearchField] = useState('');
  const [filteredData, setFilteredData] = useState<categories[]>([]);
  const { categoriesWithChildren } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const {theme} = useTheme();

  const categoryRoute = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
      changMenu();
    } else {
      router.push(routeToCategories({ category: { id: categoryId } }));
    }
  };

  useEffect(() => {
    const filterCategories = (data: any | undefined, search: string): categories[] => {
      if (!data) return [];

      return data.reduce((filtered: any, item: categories) => {
        const matchesTitle = typeof item.title === 'string' && item.title.toLowerCase().includes(search);
        const childMatches = filterCategories(item.child, search);

        if (matchesTitle || childMatches.length > 0) {
          const newItem = {
            ...item,
            child: childMatches,
          };
          filtered.push(newItem);
        }

        return filtered;
      }, [] as categories[]);
    };

    const newFilteredData = filterCategories(categoriesWithChildren?.data, searchField.toLowerCase());
    setFilteredData(newFilteredData);
  }, [searchField, categoriesWithChildren]);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchField(event.target.value.toLowerCase());
  };

  const renderCategories = (data: any): ReactNode => {
    return data.map((item: any, index: any) => (
      <div
        key={index}
        tabIndex={0}
        role="button"
        onClick={() => categoryRoute(item._id)}
        onKeyDown={(e) => keyDownHandler(e, () => categoryRoute(item._id))}
      >
        <CategoriesCard data={item} changMenu={changMenu}/>
        {(searchField.length > 0 && !onCategorySelect && Array.isArray(item.child)) && (
          <div className="ml-4">{renderCategories(item.child)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className={`${isSearchCategoriesDrower ? '' : 'hidden'}`}>
      {/* Overlay */}
      <div
        className={`z-50 mobile:hidden transition-opacity ease-in duration-200 ${
          isSearchCategoriesDrower ? 'opacity-100 inline-block' : 'opacity-0 pointer-events-none hidden'
        } fixed w-full h-full inset-0`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        onClick={changMenu}
        role="button"
        tabIndex={0}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            changMenu();
          }
        }}
      ></div>

      {/* Categories Drawer */}
      <div
        className={`z-[999] fixed h-full right-0 top-0 bottom-0 dark:bg-bg-nonary-dark bg-bg-secondary-light text-text-primary-light dark:text-text-secondary-light max-w-[100%] md:w-[40%] lg:w-[30%] transition-all ease-in duration-200  ${
          isSearchCategoriesDrower ? 'w-full opacity-100 inline-block' : 'w-0 opacity-0 hidden'
        } `}
      >
        <div className="pb-5 pt-2 h-fit w-full dark:bg-bg-nonary-dark bg-bg-secondary-light">
          {/* Header */}
          <div className="w-full flex items-center justify-between my-6 font-semibold text-xl px-[28px] ">
            <span className="flex">All Categories</span>
            <Image
              width={14}
              height={14}
              className="cursor-pointer hover:scale-110 dark:hidden"
              onClick={() => changMenu()}
              src={CrossIcon}
              alt="cross_icon"
            />
            <Image
              width={14}
              height={14}
              className="cursor-pointer hover:scale-110 hidden dark:inline-block"
              onClick={() => changMenu()}
              src={CrossIconWhite}
              alt="cross_icon"
            />
          </div>

          {/* Search Input */}
          <div className="w-full relative flex items-center px-[24px]">
            {/* <Image
              width={17}
              height={17}
              className="absolute left-9 rtl:right-9 dark:hidden inline"
              src={IMAGES.SEARCH_ICON_BLACK}
              loader={gumletLoader}
              alt="location-icon"
            />
            <Image
              width={17}
              height={17}
              className="absolute left-9 rtl:right-9 dark:inline hidden"
              src={IMAGES.SEARCH_ICON_WHITE}
              loader={gumletLoader}
              alt="location-icon"
            /> */}
            <SearchIcon primaryColor={theme ? '#FFF' : '#57585A'} width={17} height={17} className="absolute left-9 rtl:right-9 " />
            <input
              onChange={onSearchChange}
              className="w-full pl-9 rtl:pr-9 pr-2 h-11 outline-none dark:text-text-primary-dark dark:bg-bg-quinary-dark dark:border-border-tertiary-dark border-border-tertiary-light bg-bg-tertiary-light focus:border-2 focus:border-brand-color rounded"
              type="search"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="w-full  h-[80%] overflow-y-scroll divide-y divide-border-tertiary-light dark:divide-border-tertiary-dark px-2 md:px-[24px]">
          {/* Conditional Rendering based on filteredData */}
          {filteredData.length === 0 ? (
            <div className="text-center py-4 text-gray-500">NO RESULTS FOUND</div>
          ) : (
            renderCategories(filteredData)
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesDrawer;
