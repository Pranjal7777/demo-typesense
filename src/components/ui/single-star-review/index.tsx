import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';
import StarIcon from '../../../../public/assets/svg/star-icon';
type Props = {
    className?:string;
    ratingHeading?: string;
    ratingHeadingClass?: string;
    ratingClass?: string;
    ratingText?: string;
    ratingTextClass?: string;
    starColor?: string;
}
const SingleStarReviewCard:FC<Props> = ({className,ratingHeading,ratingHeadingClass,ratingClass,ratingText,ratingTextClass,starColor='var(--brand-color)'}) => {
  return (
    <div className={appClsx('flex flex-col gap-1 ', className)}>
      <strong className={appClsx('', ratingHeadingClass)}>{ratingHeading}</strong>
      <div className={appClsx('flex gap-[6px] text-sm', ratingClass)}>
        <StarIcon color={ratingText == '0' ? '#DBDBDB' : starColor}/> 
        <span className={appClsx('text-text-tertiary-light dark:text-text-septenary-light', ratingTextClass)}>{ratingText}</span>
      </div>
    </div>
  );
};

export default SingleStarReviewCard;