import { categories } from '@/store/types';
import React, { FC, useState } from 'react';
import ImageContainer from '../ui/image-container';
import { STATIC_IMAGE_URL } from '@/config';
type CategoryCardProps = {
  data: categories;
  changMenu: () => void;
  handleSelectCategory: (data:categories) => void;
};

const SelectCategoryTile: FC<CategoryCardProps> = ({ data, changMenu,handleSelectCategory }) => {

  const handleClick = () => {
    handleSelectCategory(data);
    changMenu();
  };

  return (
    <div
      tabIndex={0}
      role="button"
      className={`!transition !duration-700 !ease-in flex flex-col h-20`}
    >
      <div className="flex items-center w-full justify-between h-20 cursor-pointer  " role="button" tabIndex={0}>
        <div className="w-[100%]">
          <div
            onClick={handleClick}
            className="flex  mobile:pl-4 items-center h-20 w-full dark:hover:bg-bg-denary-light hover:bg-bg-octonary-light"
          ><ImageContainer
              width={40}
              height={40}
              className="w-10 h-10 mr-4 rtl:mr-0 rtl:ml-4"
              src={`${STATIC_IMAGE_URL}/${data.images.website}`}
              alt="category-icon"
              loading="lazy"
            />
            <span className="text-sm truncate">{data?.title?.toString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCategoryTile;
