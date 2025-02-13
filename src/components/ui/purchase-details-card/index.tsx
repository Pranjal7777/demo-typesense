import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import PurchaseProductDetails from '../purchase-card/purchaseProductDetails';
import { appClsx } from '@/lib/utils';
import { getFormattedDate } from '@/helper/get-formatted-date';
import { myPurchaseApi } from '@/store/api-slices/my-purchase/my-purchase-api';
import { buildQueryString } from '@/helper/build-query-string';
import { useRouter } from 'next/router';
import PurchaseDetailsSkeleton from '../purchase-details-skeleton';
import DocumentIcon from '../../../../public/assets/svg/document-icon';
import CurrencyExchangeIcon from '../../../../public/assets/svg/currency-exchange';
import { useTheme } from '@/hooks/theme';
import ConfirmationPopup from '../confirmation-popup';
import { Toaster } from 'sonner';
import showToast from '@/helper/show-toaster';
import FullScreenSpinner from '../full-screen-spinner';
import ReasonFilter from '../reason-filter';
import Model from '@/components/model';
import { HIDE_SELLER_FLOW, STATIC_IMAGE_URL } from '@/config';
import { formatPriceWithoutCents } from '@/utils/price-formatter';
type PurchaseDetailsCardProps = {
  cardClass?: string;
  currenOrderId: string;
  refetchPurchaseData?: () => void;
  setShowPurchaseDetailsMobile?: React.Dispatch<React.SetStateAction<boolean>>;
};
const PurchaseDetailsCard: FC<PurchaseDetailsCardProps> = ({
  currenOrderId,
  cardClass,
  refetchPurchaseData,
  setShowPurchaseDetailsMobile
}) => {
  const [selectedCancelOption, setSelectedCancelOption] = useState<string[]>([]);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false)
  const [otherReason, setOtherReason] = useState<string>('')  
  const [error, setError] = useState<string>('')
  const handleCancelOptionChange = (selectedValues: string[]) => {
    setSelectedCancelOption(selectedValues);
  };
  
  
  const [postDealCancel, {isLoading: isPostDealCancelLoading}] = myPurchaseApi.usePostDealCancelMutation()
const {data: dealCancelReasons} = myPurchaseApi.useGetDealCancelReasonsQuery()
  const cancelOptions = useMemo(() => {
    return (
      [
        ...(dealCancelReasons?.data?.map((reason) => ({
          label: reason.reason,
          value: reason.reason,
        })) || []),
      ]
    );
  }, [dealCancelReasons]);

  const router = useRouter();
  const {theme} = useTheme()
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const cancelPopupCloseHandler = () => {
    setShowCancelPopup(false);
    setSelectedCancelOption([]);
    setOtherReason('')
    setError('')
  };
  const cancelButtonHandler = () => {
    setShowCancelPopup(true);
  };

  const {
    data: orderDetails,
    refetch,
    isFetching,
  } = myPurchaseApi.useGetPurchasesDetailsQuery({
    queryParams: buildQueryString({
      orderId: currenOrderId,
    }),
  });

  const date = useMemo(() => {
    if (orderDetails?.data?.orderDate) {
      return getFormattedDate(orderDetails?.data?.orderDate);
    }
    return '';
  }, [orderDetails]);

  const applyCancelHandler = () => {
    if(selectedCancelOption?.[0] == 'Other' && otherReason == ''){
        setError('Please specify the reason')
        return;
    }
    if(selectedCancelOption?.length == 0){
      setError('Please select the reason')
      return;
    }
    setError('')
    setShowConfirmationPopup(true)
    setShowCancelPopup(false)
  };
  const confirmationPopupCloseHandler = () => {
    setShowConfirmationPopup(false)
    setShowCancelPopup(true)
  }
  const confirmationPopupConfirmHandler = async () => {
    const reason = selectedCancelOption?.[0] == 'Other' ? otherReason : selectedCancelOption?.[0]
    try{
      await postDealCancel({reason:reason, orderId:currenOrderId}).unwrap();
      showToast({message:'Deal cancelled successfully', messageType:'success'})
      setSelectedCancelOption([])
      setOtherReason('')  
      setError('')
      setShowConfirmationPopup(false);
      setShowCancelPopup(false);
      refetch()
      refetchPurchaseData?.()
      setShowPurchaseDetailsMobile?.(false)
    }catch(error){
      showToast({message:'Something went wrong', messageType:'error'})
    }
  }

  const handleOtherReasonChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherReason(e.target.value)
    if(e.target.value != ''){   
      setError('')
    } 
  }

  useEffect(() => {
    if(selectedCancelOption?.length > 0 && error && selectedCancelOption?.[0] != 'Other'){
      setError('')
    }
  }, [selectedCancelOption])

  return (
    <>
      {isPostDealCancelLoading && <FullScreenSpinner />}
      <Toaster />
      {!isFetching && orderDetails && (
        <div
          className={appClsx(
            'sm:p-5 md:rounded-t-xl  md:border h-full flex flex-col dark:border-border-tertiary-dark border-border-tertiary-light',
            cardClass
          )}
        >
          <div className="flex flex-col-reverse gap-3 md:gap-0 md:flex-col">
            <div className={appClsx('flex justify-between items-center')}>
              <PurchaseProductDetails
                detailsClass="text-base font-semibold"
                details={orderDetails?.data?.orderType}
                description={date}
              />
              <span className=" hidden md:block self-start text-xs">OID:{orderDetails?.data?.orderId}</span>
            </div>

            <div className="flex py-3 md:py-0 md:mt-5 h-fit flex-col gap-2 md:gap-3 xl:flex-row  justify-between border-b border-t md:border-0">
              <PurchaseProductDetails
                descriptionClass="text-sm md:text-base font-semibold"
                imageClass="h-[44px] w-[53px]  md:w-[75px] md:h-[61px] "
                detailsClass="text-xs md:text-sm"
                containerClass="md:p-3 w-full  md:border dark:border-border-tertiary-dark border-border-tertiary-light rounded-lg gap-3"
                imageSrc={`${orderDetails?.data?.image || ' '}`}
                details={orderDetails?.data?.productName || ''}
                description={formatPriceWithoutCents(orderDetails?.data?.amount || 0)}
              />
              {orderDetails.data.orderType == 'EXCHANGED' && (
                <>
                  <CurrencyExchangeIcon className="self-center xl:min-w-8" height="22" width="22" />
                  <PurchaseProductDetails
                    descriptionClass="text-base font-semibold"
                    imageClass="h-[44px] w-[53px]  md:w-[75px] md:h-[61px] "
                    detailsClass="text-sm"
                    containerClass=" md:p-3  w-full md:border dark:border-border-tertiary-dark border-border-tertiary-light rounded-lg gap-3"
                    imageSrc={`${orderDetails?.data?.image || ' '}`}
                    details={orderDetails?.data?.productName || ''}
                    description={formatPriceWithoutCents(orderDetails?.data?.amount || 0)}
                  />
                </>
              )}
            </div>
          </div>
          <div className="seller-info flex-1 mt-5 md:p-3 md:border dark:border-border-tertiary-dark border-border-tertiary-light rounded-lg">
            {!HIDE_SELLER_FLOW && orderDetails?.data?.sellerAccountId && (
              <div className=" md:border-b dark:border-border-tertiary-dark border-border-tertiary-light pb-4">
                <h3 className="text-base font-semibold">Seller information</h3>
                <PurchaseProductDetails
                  containerClass="mt-3"
                  imageClass="h-[40px] w-[40px] md:h-[52px] md:w-[52px]"
                  detailsClass="text-sm font-medium"
                  details={orderDetails?.data?.sellerFullName}
                  descriptionClass="text-xs text-brand-color cursor-pointer"
                  description={orderDetails?.data?.sellerId && 'View Profile'}
                  onDescriptionClick={() =>
                    router.push(
                      `/profile/seller/${orderDetails?.data?.sellerFullName?.replace(/\s+/g, '')}/${
                        orderDetails?.data?.sellerAccountId
                      }`
                    )
                  }
                  imageSrc={
                    orderDetails?.data?.sellerProfilePic?.includes('http')
                      ? `${orderDetails?.data?.sellerProfilePic}`
                      : `${STATIC_IMAGE_URL}/${orderDetails?.data?.sellerProfilePic || ' '}`
                  }
                  isProfile={true}
                />
              </div>
            )}
            {orderDetails?.data?.billingAddress && (
              <div className=" md:border-b dark:border-border-tertiary-dark border-border-tertiary-light pb-4 mt-4">
                <h3 className="text-base font-semibold">Billing Address</h3>
                <PurchaseProductDetails
                  containerClass="mt-3"
                  imageClass="h-[52px] w-[52px]"
                  detailsClass="text-sm font-medium"
                  details={orderDetails?.data?.billingAddress?.name}
                  description={
                    orderDetails?.data?.billingAddress?.addressLine1 ||
                    orderDetails?.data?.billingAddress?.addressLine2 ||
                    orderDetails?.data?.billingAddress?.addressLine3 ||
                    ''
                  }
                  descriptionClass="text-xs text-text-quaternary-dark dark:text-text-septenary-light"
                />
                <span className="text-xs text-text-quaternary-dark dark:text-text-septenary-light">{`${orderDetails?.data?.billingAddress?.city} ${orderDetails?.data?.billingAddress?.state} ${orderDetails?.data?.billingAddress?.country} ${orderDetails?.data?.billingAddress?.zipCode}`}</span>
              </div>
            )}
            <div className="mt-4">
              {orderDetails?.data?.paymentType && <h3 className="text-base font-semibold">Payment Through</h3>}
              {orderDetails?.data?.orderType == 'SOLD' ? (
                <>
                  <div className="flex justify-between items-center text-sm mt-3">
                    <span className="font-medium">Deal Value</span>
                    <span className="font-semibold">{formatPriceWithoutCents(orderDetails?.data?.amount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-3">
                    <span className="font-medium">App Commission</span>
                    <span className="font-semibold">{orderDetails?.data?.appCommission || ''}</span>
                  </div>
                  <div className="flex text-base font-semibold  border-t pt-2 justify-between items-center mt-3">
                    <span className="">Earned amount</span>
                    <span className="">
                      {formatPriceWithoutCents((orderDetails?.data?.amount || 0) - (orderDetails?.data?.appCommission || 0))}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center text-sm mt-3">
                  <span className="font-medium">{orderDetails?.data?.paymentTypeText}</span>
                  <span className="font-semibold">{formatPriceWithoutCents(orderDetails?.data?.amount || 0)}</span>
                </div>
              )}

              {orderDetails?.data?.invoiceUrl && (
                <a
                  className=" flex gap-[6px] text-sm text-brand-color items-center mt-10"
                  target="_blank"
                  href={orderDetails?.data?.invoiceUrl}
                >
                  <DocumentIcon height="20" />
                  invoice
                </a>
              )}
              {orderDetails?.data?.sellerInvoiceUrl && (
                <a
                  className=" flex gap-[6px] text-sm text-brand-color items-center mt-10"
                  target="_blank"
                  href={orderDetails?.data?.sellerInvoiceUrl}
                >
                  <DocumentIcon height="20" />
                  Seller invoice
                </a>
              )}
              {orderDetails?.data?.buyerInvoiceUrl && (
                <a
                  className={`flex gap-[6px] text-sm text-brand-color items-center mt-5 ${
                    orderDetails?.data?.buyerInvoiceUrl ? 'mt-4' : 'mt-10'
                  }`}
                  target="_blank"
                  href={orderDetails?.data?.buyerInvoiceUrl}
                >
                  <DocumentIcon height="20" />
                  Buyer invoice
                </a>
              )}
            </div>
            {orderDetails?.data?.orderType == 'PAYMENT ESCROWED' && (
              <button
                onClick={cancelButtonHandler}
                className=" hidden md:block py-1 px-2 mt-10 text-sm font-normal rounded-[4px] bg-black dark:bg-bg-secondary-light text-bg-secondary-light dark:text-text-undenary-light"
              >
                Cancel Deal
              </button>
            )}
          </div>
          {orderDetails?.data?.orderType == 'PAYMENT ESCROWED' && (
            <button
              onClick={cancelButtonHandler}
              className="py-1 self-center md:hidden h-[48px] w-[343px] px-2 mb-5 font-normal rounded-[4px] bg-black dark:bg-bg-secondary-light text-bg-secondary-light dark:text-text-undenary-light"
            >
              Cancel Deal
            </button>
          )}
          {showCancelPopup && (
            <Model
              onClose={() => cancelPopupCloseHandler()}
              className="w-[90%] max-w-[420px] h-fit py-6 px-5 rounded-[15px]  bg-white dark:bg-bg-nonary-dark"
            >
              <ReasonFilter
                filterHeaderText="Cancel Deal"
                filterDescription="Please select an option"
                containerClass="static p-0 bg-bg-septenary-light w-full bg-white"
                selectedValues={selectedCancelOption}
                options={cancelOptions}
                onSelectionChange={handleCancelOptionChange}
                handleSubmit={applyCancelHandler}
                buttonText="Apply"
                isButtonLoading={isPostDealCancelLoading}
                error={error}
                setError={setError}
                showOtherOption={true}
                otherReason={otherReason}
                setOtherReason={setOtherReason}
                otherReasonPlaceholder="Please specify the reason"
              />
            </Model>
          )}
          {showConfirmationPopup && (
            <ConfirmationPopup
              containerClassName="inset-0"
              isOpen={showConfirmationPopup}
              onClose={confirmationPopupCloseHandler}
              onConfirm={confirmationPopupConfirmHandler}
              message="Are you sure you want to cancel the deal?"
            />
          )}
        </div>
      )}
      {isFetching && <PurchaseDetailsSkeleton />}
    </>
  );
};

export default PurchaseDetailsCard;
