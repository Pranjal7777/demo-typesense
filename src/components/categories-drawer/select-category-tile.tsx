import { categories } from '@/store/types';
import React, { FC, useState } from 'react';
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
          >
            <span className="text-sm truncate">{data?.title?.toString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCategoryTile;
