import React, { FC } from 'react';
import PurchaseProductDetails from './purchaseProductDetails';
import ProfileImageContainer from '../profile-image-container';
import { appClsx } from '@/lib/utils';
import keyDownHandler from '@/helper/key-down-handler';

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
      <PurchaseProductDetails
        containerClass="gap-2 dark:bg-[#242424] p-2 rounded-lg"
        imageSrc={productImageSrc}
        details={`OID: ${orderId}`}
        description={productName}
        strongText={amount}
      />
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
