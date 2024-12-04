import React, { FC } from 'react';
import ImageContainer from '../image-container';
import { STATIC_IMAGE_URL } from '@/config';
import { appClsx } from '@/lib/utils';
import ProfileImageContainer from '../profile-image-container';

type PurchaseProductDetailsProps = {
  imageSrc?: string;
  isProfile?: boolean;
  height?: number;
  width?: number;
  altText?: string;
  details?: string;
  description?: string;
  strongText?: string;
  containerClass?: string;
  imageClass?: string;
  detailsClass?: string;
  descriptionClass?: string;
  strongTextClass?: string;
  onDescriptionClick?: ()=>void
};

const PurchaseProductDetails: FC<PurchaseProductDetailsProps> = ({
  imageSrc,
  isProfile = false,
  height = 48,
  width = 58,
  altText,
  details,
  description,
  strongText,
  containerClass,
  imageClass,
  descriptionClass,
  detailsClass,
  strongTextClass,
  onDescriptionClick
}) => {
  const descriptionClickHandler = ()=>{
    if(onDescriptionClick){
      onDescriptionClick()
    }
  }  

  return (
    <div className={appClsx('flex items-center gap-1', containerClass)}>
      {imageSrc &&
        (isProfile ? (
          <ProfileImageContainer
            className={appClsx('object-fill rounded-full', imageClass)}
            src={`${STATIC_IMAGE_URL}/${imageSrc}`}
            alt="Profile Image"
            height={24}
            width={24}
          />
        ) : (
          <ImageContainer
            height={height}
            width={width}
            src={`${STATIC_IMAGE_URL}/${imageSrc}`}
            className={appClsx('object-cover h-12', imageClass)}
            alt={altText || 'product'}
          />
        ))}
      <div className="text-xs text-primary-light flex flex-col gap-1">
        {details && <span className={appClsx('', detailsClass)}>{details}</span>}
        {description && (
          <p onClick={descriptionClickHandler} className={appClsx('', descriptionClass)}>
            {description} {strongText ? <strong className={appClsx('text-sm', strongTextClass)}>{strongText}</strong> : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default PurchaseProductDetails;
