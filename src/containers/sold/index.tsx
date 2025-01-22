import PurchaseCard from '@/components/ui/purchase-card';
import PurchaseCardSkeleton from '@/components/ui/purchase-card-skeleton';
import PurchaseDetailsCard from '@/components/ui/purchase-details-card';
import { PurchaseResponse } from '@/store/types/my-purchase-types';
import React, { FC, useEffect, useState } from 'react';
import { NO_SALE } from '../../../public/images/placeholder';
import ImageContainer from '@/components/ui/image-container';
import { formatPriceWithoutCents } from '@/utils/price-formatter';

type SoldContainerProps = {
  showSoldDetailsMobile: boolean;
  setShowSoldDetailsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  data: PurchaseResponse | null | undefined;
  isPurchaseDetailsFetching: any;
  isMobile: boolean;
  setShowOrderId: React.Dispatch<React.SetStateAction<string>>;
};
const SoldContainer: FC<SoldContainerProps> = ({
  isMobile,
  showSoldDetailsMobile,
  setShowSoldDetailsMobile,
  data,
  isPurchaseDetailsFetching,
  setShowOrderId
}) => {
  const [currenOrderId, setCurrenOrderId] = useState('');
  useEffect(() => {
    const id = data?.data?.[0]?.orderId || '';
    setCurrenOrderId(id);
  }, [data]);
  const onCardClick = (id: string) => {
    if(isMobile){
      setShowSoldDetailsMobile(true);
    }
    setCurrenOrderId(id);
    setShowOrderId(id);
    };
  return (
    <>
      {(!data && !isPurchaseDetailsFetching) || !data?.data?.length ? (
        <div className="flex-1 flex gap-3 items-center justify-center flex-col mb-[20%]">
          <ImageContainer
            className="h-[168px] w-[168px] md:h-[200px] md:w-[200px]"
            height={200}
            width={200}
            alt="no data"
            src={NO_SALE}
          />
          <h3 className=" font-semibold text-center">No Sales to Show Yet!</h3>
          <p className=" text-xs md:text-sm text-text-tertiary-light dark:text-text-septenary-light text-center">
            List your items and watch them appear here once they’re sold!
          </p>
        </div>
      ) : (
        <>
          <div className="left hidden md:flex  flex-1 overflow-y-scroll md:flex-[0.94] lg:flex-[0.6] h-[86%]  flex-col gap-3  ">
            {data &&
              !isPurchaseDetailsFetching &&
              data?.data?.map((item) => (
                <PurchaseCard
                  cardClass={currenOrderId == item?.orderId ? 'border border-brand-color' : ''}
                  currenOrderId={currenOrderId}
                  orderId={`${item?.orderId}`}
                  productImageSrc={`${item.image}` || ' '}
                  productName={
                    item?.productName?.length > 22 ? `${item?.productName?.slice(0, 22)}...` : item?.productName || ''
                  }
                  amount={formatPriceWithoutCents(item?.amount || 0)}
                  buyerName={item.buyerFullName}
                  orderType={item.orderType}
                  cardClickHandler={onCardClick}
                />
              ))}

            {isPurchaseDetailsFetching && [...Array(5)].map((_, index) => <PurchaseCardSkeleton key={index} />)}
          </div>
          <PurchaseDetailsCard
            
            currenOrderId={currenOrderId}
            cardClass=" flex-1 h-[86%] overflow-y-scroll hidden md:block"
          />

          {showSoldDetailsMobile ? (
            <div className="right flex-1 overflow-y-scroll  md:hidden">
              <PurchaseDetailsCard
                currenOrderId={currenOrderId}
                cardClass=" flex-1 h-[86%] overflow-y-scroll  md:hidden p-0 border-0"
              />
            </div>
          ) : (
            <div className="left flex-1 overflow-y-scroll md:[40%] flex flex-col gap-3 mb-10 md:hidden">
              {data &&
                !isPurchaseDetailsFetching &&
                data?.data?.map((item) => (
                  <PurchaseCard
                    showPurchaseDetailsMobile={showSoldDetailsMobile}
                    cardClass={'dark:border-border-tertiary-dark border-border-tertiary-light'}
                    currenOrderId={currenOrderId}
                    orderId={`${item?.orderId}`}
                    productImageSrc={`${item.image}` || ' '}
                    productName={
                      item?.productName?.length > 22 ? `${item?.productName?.slice(0, 22)}...` : item?.productName || ''
                    }
                    amount={formatPriceWithoutCents(item?.amount || 0)}
                    buyerName={item.buyerFullName}
                    orderType={item.orderType}
                    cardClickHandler={onCardClick}
                  />
                ))}

              {isPurchaseDetailsFetching && [...Array(5)].map((_, index) => <PurchaseCardSkeleton key={index} />)}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SoldContainer;
