import Image from 'next/image';
import React, {  ReactNode, useEffect, useRef, useState } from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { categories } from '@/store/types';
import CrossIcon from '../../../public/images/cross-icon.svg';
import CrossIconWhite from '../../../public/images/cross_icon_white.svg';
import { useRouter } from 'next/router';
import SelectCategoryTile from './select-category-tile';
import { toggleScrollLock } from '@/utils/scroll-lock';
type CategoriesDrawerProps = {
  changMenu: () => void;
  isSearchCategoriesDrower: boolean;
  onCategorySelect?: (categoryId: string) => void;
  filterParameters: any;
  handleSelectCategory: (data: categories) => void;
};

const SelectCategoryDrawer: React.FC<CategoriesDrawerProps> = ({
  filterParameters,
  isSearchCategoriesDrower,
  changMenu,
  onCategorySelect,
  handleSelectCategory,
}) => {
  const [searchField, setSearchField] = useState('');
  const [filteredData, setFilteredData] = useState<categories[]>([]);
  const { categoriesWithChildren } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

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

  const renderCategories = (data: any): ReactNode => {
    return data.map((item: any, index: any) => (
      <div key={index} tabIndex={0} role="button">
        <SelectCategoryTile data={item} changMenu={changMenu} handleSelectCategory={handleSelectCategory} />
        {searchField.length > 0 && !onCategorySelect && Array.isArray(item.child) && (
          <div className="ml-4">{renderCategories(item.child)}</div>
        )}
      </div>
    ));
  };

  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    toggleScrollLock(isSearchCategoriesDrower);

    return () => {
      toggleScrollLock(false);
    };
  }, [isSearchCategoriesDrower]);

  return (
    <div className={`${isSearchCategoriesDrower ? '' : 'hidden'}`}>
      {/* Overlay */}
      <div
        ref={modelRef}
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
        <div className="md:pb-5 pt-2 h-fit w-full dark:bg-bg-nonary-dark bg-bg-secondary-light">
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
        </div>

        {/* Categories List */}
        <div className="w-full  border mobile:h-[calc(100vh-200px)]  overflow-y-scroll divide-y divide-border-tertiary-light dark:border-border-tertiary-dark dark:divide-border-tertiary-dark px-2 md:px-[24px] md:h-[calc(100vh-100px)]">
          {/* Conditional Rendering based on filteredData */}
          {filteredData?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">NO RESULTS FOUND</div>
          ) : (
            renderCategories(filteredData)
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectCategoryDrawer;
