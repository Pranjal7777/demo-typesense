import React, { FC } from 'react';
import { Product } from '@/store/types';
import { STATIC_IMAGE_URL } from '@/config';
import LocationSvg from '../../../../public/assets/svg/location';
// import { PROFILE_IMAGE } from '../../../../public/images/productcard';
import ImageContainer from '../image-container';
import { useTheme } from '@/hooks/theme';
import { timeSince } from '@/helper/time-since';
import { useRouter } from 'next/router';
import UserPlaceholderIcon from '../../../../public/assets/svg/user-placeholder-icon';
import Link from 'next/link';
import keyDownHandler from '@/helper/key-down-handler';
interface ProductCardProps {
  product: Product;
  showProfilePic?: boolean;
  isTypeSenseData?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({ product, showProfilePic = true, isTypeSenseData = false  }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const userAccountId = product.accountId;
  const handleProductClick = () => {
    router.push(`/product/${isTypeSenseData ? product.id : product._id}`);
  };
  const imageUrl = product?.images?.[0];
  const src =
    imageUrl.type === 'VIDEO'
      ? imageUrl?.thumbnailUrl?.includes('https')
        ? imageUrl?.thumbnailUrl
        : `${STATIC_IMAGE_URL}/${imageUrl?.thumbnailUrl}`
      : imageUrl.url?.includes('https')
        ? imageUrl?.url
        : `${STATIC_IMAGE_URL}/${imageUrl?.url}`;
        
  return (
    <>
      <div
        role="button"
        className=" card flex flex-col gap-2 sm:gap-3 hover:scale-102 transition-all duration-300 ease-in hover:cursor-pointer mobile:max-w-[100%]  w-full h-full pb-[10px] max-w-[313px]"
      >
        <Link href={`/seller-profile/${userAccountId}`}>
          {showProfilePic && (
            <div className="flex gap-1 md:gap-4 items-center">
              {/* for profile image, in the src of next/image component we can add url from api  */}
              {product?.profilePic && product?.profilePic.trim() !== '' ? (
                <div className="relative h-[32px] w-[32px] sm:h-[36px] sm:w-[36px] overflow-hidden">
                  <ImageContainer
                    src={`${STATIC_IMAGE_URL}/${product?.profilePic}`}
                    className="rounded-full object-cover"
                    alt="profileimage"
                  />
                </div>
              ) : (
                <UserPlaceholderIcon
                  secondaryColor={theme ? 'var(--icon-secondary-dark)' : 'var(--icon-secondary-light)'}
                />
              )}

              <div>
                {/* here we can add name coming form api as product?.name */}
                <h5 className="text-xs leading-[18px] truncate md:text-sm font-medium md:leading-5 text-text-primary-light dark:text-text-primary-dark">
                  {product.firstName?.[0].toUpperCase() +
                    product.firstName?.slice(1) +
                    ' ' +
                    product.lastName[0].toUpperCase() +
                    product?.firstName?.slice(1)}
                </h5>
                {/* here we can write time coming from api or we can calculate later */}
                <p className="text-[#57585A] dark:text-[#929293] text-[10px] md:text-xs font-normal">
                  {timeSince(product.creationTs)}
                </p>
              </div>
            </div>
          )}
        </Link>

        <div
          className="image  relative  w-full aspect-w-1 aspect-h-1   border-brand-color rounded-t-xl"
          onClick={handleProductClick}
          role="button"
          onKeyDown={(e) => {
            keyDownHandler(e, handleProductClick);
          }}
          tabIndex={0}
        >
          <ImageContainer
            // className="object-cover !aspect-square"
            className="absolute inset-0"
            // className=" border-error object-fill aspect-square w-full h-[170px] md:h-[190px]"
            src={src ? src : 'https://leoffer-media.s3.ap-south-1.amazonaws.com/web_a65038706e.webp'}
            alt="eq.svg"
          />
        </div>
        <div className="flex flex-col gap-[4px]">
          {/* <div> */}
          {/* this span will take image name from the api, product?.imageName  */}
          <span className="text-[10px] leading-[15px] md:text-sm font-normal text-[#202022] dark:text-white">
            {product.assetTitle}
          </span>
          {/* </div> */}
          <div className="text-sm sm:text-[16px] sm:leading-6 font-semibold text-text-primary-light dark:text-text-primary-dark leading-5">
            USD ${product?.price}
          </div>
          <div className=" flex justify-between ">
            <div className="flex items-center">
              <LocationSvg height="12" width="12" color={theme ? '#929293' : '#D9D9D9'} />
              {/* <LocationSvg height="13" width="11" color="var(--brand-color)" /> */}
              <div className="ml-[2px] text-[10px] leading-[15px] md:text-xs font-normal md:ml-[6px] md:leading-[18px] dark:text-text-tertiary-dark">
                {product.city + ', ' + product.zip}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
    @media screen and (min-width:320px) and (max-width:407px){
      .image{
        height:147px;
      }
        .card{
        height:100%;
        }
    `}
      </style>
    </>
  );
};

export default ProductCard;
