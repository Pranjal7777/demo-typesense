import React, { FC } from 'react';
import PurchaseProductDetails from './purchaseProductDetails';
import ProfileImageContainer from '../profile-image-container';
import { appClsx } from '@/lib/utils';
import keyDownHandler from '@/helper/key-down-handler';
import ImageContainer from '../image-container';
import { STATIC_IMAGE_URL } from '@/config';

type PurchaseCardProps = {
  cardData?: any;
  cardClickHandler: (id: string) => void;
  cardClass?: string;
  currenOrderId?: string;
  productName?: string;
  productImageSrc?: string;
  orderId?: string;
  amount?: string;
  buyerName?: string;
  orderType?: string;
  showPurchaseDetailsMobile?: boolean;
};

const PurchaseCard: FC<PurchaseCardProps> = ({
  cardData,
  cardClickHandler,
  cardClass,
  currenOrderId,
  productImageSrc,
  orderId,
  orderType,
  buyerName,
  productName,
  amount,
  showPurchaseDetailsMobile
}) => {
  
  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        keyDownHandler(e, () => cardClickHandler(orderId || ''));
      }}
      onClick={() => cardClickHandler(orderId || '')}
      className={appClsx(
        `p-3 border ${
          currenOrderId == orderId && !showPurchaseDetailsMobile
            ? 'border-brand-color'
            : 'dark:border-border-tertiary-dark border-border-tertiary-light'
        } rounded-lg`,
        cardClass
      )}
    >
      <div className="w-full p-2 flex justify-between text-text-secondary-dark dark:text-text-primary-dark bg-bg-quinquedenary-light rounded-lg">
        <div className="flex items-center gap-2">
          <ImageContainer
            height={48}
            width={58}
            src={`${STATIC_IMAGE_URL}/${productImageSrc}`}
            className={appClsx('object-cover h-12')}
            alt={productName || 'product'}
          />
          <div className="flex gap-1 flex-col justify-between">
            <span className="text-xs">{productName}</span>
            <span className="text-sm font-medium ">{amount}</span>
          </div>
        </div>
        <div className=" flex justify-end">
          <span className="text-xs">{`${orderId}`}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-[6px]">
          <ProfileImageContainer
            className="object-fill rounded-full"
            src={''}
            alt="Profile Image"
            height={24}
            width={24}
          />
          <span className="font-medium text-sm md:text-base">{buyerName}</span>
        </div>
        <span
          className={`tag h-fit ${
            orderType == 'PAYMENT ESCROWED'
              ? 'bg-brand-color'
              : orderType == 'PURCHASED'
              ? 'bg-[#00B533]'
              : orderType == 'EXCHANGE COMPLETED'
              ? 'bg-[#00B533]'
              : orderType == 'SUBSCRIPTION PURCHASED'
              ? 'bg-bg-undenary-dark'
              : orderType == 'DEAL CANCELLED'
              ? 'bg-[#FF3B30]'
              : orderType == 'SOLD'
              ? 'bg-[#00B533]'
              : 'bg-brand-color'
          }   py-[2px] px-[10px] text-center rounded-sm text-xs text-text-primary-dark`}
        >
          {orderType}
        </span>
      </div>
    </div>
  );
};

export default PurchaseCard;
