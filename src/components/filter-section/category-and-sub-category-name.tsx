import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';

export type Props = {
  category?: string;
  subCategory?: string;
  className?: string;
};

const CategoryAndSubCategoryName: FC<Props> = ({ category, subCategory, className }) => {
  return (
    <div
      className={appClsx(
        'border-2 flex w-full flex-wrap text-sm font-normal text-text-tertiary-light mt-5 ',
        className
      )}
    >
      <p>{category} </p> <span>&nbsp; &gt; &nbsp;</span> <p> {subCategory}</p>
      {/* <p>Construction </p> <span>&nbsp; &gt; &nbsp;</span> <p> Construction</p> */}
    </div>
  );
};

export default CategoryAndSubCategoryName;
