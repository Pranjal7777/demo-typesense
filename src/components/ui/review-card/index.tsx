import { appClsx } from '@/lib/utils';
import React, { FC, useMemo } from 'react';
import ImageContainer from '../image-container';
import UserPlaceholderIcon from '../../../../public/assets/svg/user-placeholder-icon';
import Rating from '../rating';
import { UserReviewType } from '@/store/types/seller-profile-type';
import { DATE_AND_TIME_FORMAT } from '@/constants/config-strings';
import { getFormattedDate } from '@/helper/get-formatted-date';

type Props = {
  userReview: UserReviewType;
  cardClass?: string;
  profileImageClass?: string;
  height?: number;
  width?: number;
  mobileHeight?: number;
  mobileWidth?: number;
  userNameClass?: string;
  ratingColor?: string;
  ratingTextClass?: string;
  starClass?: string;
  starContainerClass?: string;
  ratingWrapperClass?: string;
  commentClass?: string;
  imageContainerClass?: string;
  dateClass?: string;
};

const ReviewCard: FC<Props> = ({
  userReview,
  cardClass,
  profileImageClass,
  height = 48,
  width = 48,
  mobileHeight = 28,
  mobileWidth = 28,
  userNameClass,
  ratingColor,
  ratingTextClass = 'text-text-quaternary-dark text-xs',
  starClass,
  starContainerClass,
  ratingWrapperClass,
  commentClass,
  imageContainerClass,
  dateClass,
}) => {
  const reviewedDate = useMemo(() => {
    return getFormattedDate(userReview?.ratedDate, DATE_AND_TIME_FORMAT);
  }, [userReview?.ratedDate]);
  return (
    <div className={appClsx('flex gap-2', cardClass)}>
      {userReview?.images?.length > 0 ? (
        <>
          <ImageContainer
            height={height}
            width={width}
            className={appClsx('hidden md:block', profileImageClass)}
            alt={'profile-pic'}
            src={''}
          />
          <ImageContainer
            height={mobileHeight}
            width={mobileWidth}
            className={appClsx('md:hidden', profileImageClass)}
            alt={'profile-pic'}
            src={''}
          />
        </>
      ) : (
        <>
          <UserPlaceholderIcon
            className={appClsx('hidden md:block', profileImageClass)}
            height={height.toString()}
            width={width.toString()}
          />
          <UserPlaceholderIcon
            className={appClsx('md:hidden', profileImageClass)}
            height={mobileHeight.toString()}
            width={mobileWidth.toString()}
          />
        </>
      )}
      <div className="flex flex-col gap-2">
        <strong className={appClsx(' text-xs md:text-sm font-semibold', userNameClass)}>{userReview.firstName}</strong>
        <Rating
          value={userReview.rating}
          color={ratingColor}
          className={starClass}
          starContainerClass={starContainerClass}
          wrapperClass={ratingWrapperClass}
          itemClassName={ratingTextClass}
          text={`${userReview.rating}`}
        />
        {userReview.review ? (
          <p className={appClsx('text-text-quaternary-dark text-sm md:text-[16px]', commentClass)}>
            {' '}
            {userReview.review}
          </p>
        ) : null}

        {userReview.images.length > 0 ? (
          <div className={appClsx('image-container flex gap-1 md:gap-[6px]', imageContainerClass)}>
            <ImageContainer src="" alt="product-image" />
          </div>
        ) : null}

        <span className={appClsx('text-text-quaternary-dark text-xs', dateClass)}>{reviewedDate}</span>
      </div>
    </div>
  );
};
export default ReviewCard;
