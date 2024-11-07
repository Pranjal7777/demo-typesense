import { FC } from 'react';
import { appClsx } from '@/lib/utils';
import SubCategoryCard from '@/components/ui/sub-category-card';
import { Category } from '@/store/types';
import { STATIC_IMAGE_URL } from '@/config';
import { IMAGES } from '@/lib/images';

type CategorySliderProps = {
  data: Category[];
  className?:string
};

const CategorySlider: FC<CategorySliderProps> = ({
  className,
  data=[],
}) => {

  return (
    <div className={appClsx('flex gap-7 border-error', className)}>
      {data.map((item, index) => {
        return <SubCategoryCard imageUrl={item.images.website!=='' ? `${STATIC_IMAGE_URL}/${item.images.website}` : IMAGES.FALLBACK_IMAGE_LIGHT} title={item.title} subTitle={item.categoryPath[0]?.title} key={index} />;
      })}
    </div>
  );
};

export default CategorySlider;
