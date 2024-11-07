import { STATIC_IMAGE_URL } from '@/config';
import { timeSince } from '@/helper/time-since';
import { Product } from '@/store/types';
import React, { FC } from 'react';
import LocationSvg from '../../../../public/assets/svg/location';
import UserPlaceholderIcon from '../../../../public/assets/svg/user-placeholder-icon';
import { useTheme } from '@/hooks/theme';
import ImageContainer from '../image-container';
import { useRouter } from 'next/router';

interface ProductCardProps {
  product: Product;
}

const NewProductCard: FC<ProductCardProps> = ({ product }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const imageUrl = product?.images?.[0];
  const src =
    imageUrl?.type === 'VIDEO'
      ? imageUrl?.thumbnailUrl?.includes('https')
        ? imageUrl?.thumbnailUrl
        : `${STATIC_IMAGE_URL}/${imageUrl?.thumbnailUrl}`
      : imageUrl?.url?.includes('https')
        ? imageUrl?.url
        : `${STATIC_IMAGE_URL}/${imageUrl?.url}`;

  const handleProductClick = () => {
    router.push(`/product/${product._id}`);
  };
  return (
    <div
      onClick={handleProductClick}
      role="button"
      tabIndex={0}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleProductClick();
        }
      }}
      className="max-h-[233px] max-w-[166px] md:max-h-[330px] md:max-w-64 h-screen flex flex-col w-full hover:scale-102 hover:cursor-pointer rounded shadow-sm p-2 justify-between"
    >
      <div className="flex items-center border-error">
        <span className=" border-error flex items-center justify-center rounded-full max-h-8 max-w-8 md:max-h-9 md:max-w-9">
          {product.profilePic ? (
            <ImageContainer
              width={36}
              height={36}
              className="rounded-full f-full w-full "
              src={`${STATIC_IMAGE_URL}/${product.profilePic}`}
              alt="user_image"
            />
          ) : (
            <UserPlaceholderIcon className="rounded-full h-8 w-8 md:h-9 md:w-9" />
          )}
        </span>
        <span className="flex flex-col truncate ml-3">
          <h5 className="text-xs leading-[18px] truncate md:text-sm font-medium md:leading-5 text-text-primary-light dark:text-text-primary-dark">
            {product.firstName?.[0].toUpperCase() +
              product.firstName?.slice(1) +
              ' ' +
              product.lastName[0].toUpperCase() +
              product?.firstName?.slice(1)}
          </h5>
          <h6 className="text-[10px] font-normal leading-[15px] md:text-xs md:leading-[18px] text-text-tertiary-light dark:text-text-tertiary-dark">
            {timeSince(product.creationTs)}
          </h6>
        </span>
      </div>

      <div className=" max-h-[124px] overflow-hidden border-error flex items-center justify-center md:max-h-[180px] w-full h-full my-2 md:my-auto">
        <ImageContainer
          alt="product_image"
          src={
            imageUrl.type === 'IMAGE' ? src : 'https://leoffer-media.s3.ap-south-1.amazonaws.com/web_a65038706e.webp'
          }
          width={240}
          height={180}
          className="w-full h-full"
        />
      </div>

      <div className="max-h-[71px]  border-error w-full h-full flex flex-col justify-between">
        <h6 className="text-[10px] font-semibold leading-[15px] md:text-sm md:font-normal md:leading-5 text-text-primary-light dark:text-text-primary-dark">
          {product.assetTitle}
        </h6>
        <h5 className="text-sm leading-[21px] md:text-base md:font-semibold md:leading-6 text-text-primary-light  dark:text-text-primary-dark">
          USD ${product.price}
        </h5>
        <span className="flex items-center">
          <LocationSvg height="12" width="12" color={theme ? '#929293' : '#D9D9D9'} />

          <p className="ml-[2px] text-[10px] leading-[15px] md:text-xs font-normal md:ml-[6px] md:leading-[18px] dark:text-text-tertiary-dark">
            {product.city + ', ' + product.zip}
          </p>
        </span>
      </div>
    </div>
  );
};

export default NewProductCard;
