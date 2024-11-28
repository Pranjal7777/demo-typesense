import { Category } from '@/store/types';
import React, { FC } from 'react';
import { STATIC_IMAGE_URL } from '@/config';
import ImageContainer from '../ui/image-container';
type CategoryCardProps = {
  data: Category;
  changMenu:()=>void;
};

const CategoriesCard: FC<CategoryCardProps> = ({ data,changMenu }) => {
  return (
    <div 
      className={`!transition !duration-700 !ease-in flex flex-col h-20`}
      >
      <div
        className="flex items-center w-full justify-between h-20 cursor-pointer  "
        role="button"
        tabIndex={0}
       
      >
        <div  className='w-[100%]'>
          <div  className="flex items-center h-20 w-full dark:hover:bg-bg-denary-light hover:bg-bg-octonary-light">
            <ImageContainer
              width={40}
              height={40}
              className="w-10 h-10 mr-4 rtl:mr-0 rtl:ml-4"
              src={`${STATIC_IMAGE_URL}/${data.images.website}`}
              alt="category-icon"
              loading="lazy"
            />
            <span className="text-sm truncate">{ data.title || ''}</span>
          </div>
        </div>
       
        
      </div>
    </div>
  );
};

export default CategoriesCard;
