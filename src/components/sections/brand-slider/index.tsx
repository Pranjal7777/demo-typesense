import BrandCard from '@/components/ui/brand-card';
import { appClsx } from '@/lib/utils';
import { CategoriesLogo } from '@/pages/categories/[id]';
import React, { FC } from 'react';

type BrandSliderPrps = {
  data: CategoriesLogo[]
  className?:string
};

const BrandSlider: FC<BrandSliderPrps> = ({className,data}) => {
  return (
    <div className={appClsx('flex gap-7', className)}>
      {data.map((item, index) => {
        return (
          <BrandCard
            imageUrl={item.brnadlogo.image.data.attributes.url}
            title={item.brnadlogo.title}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default BrandSlider;
