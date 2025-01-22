import React, { useState,  useEffect } from 'react';
import { useAppSelector } from '@/store/utils/hooks';
import { RootState } from '@/store/store';
import { useRouter } from 'next/router';
import { getStripePaymentKeys } from '@/helper/payment';
import StripeDesktopPaymentForm from './payment-desktop-wrapper';

interface PaymentOptionFormProps {
  selectedAddressId: string;
}

export default function PaymentOptionForm({
  selectedAddressId,
}: PaymentOptionFormProps) {
  const router = useRouter();
  const { myLocation } = useAppSelector((state: RootState) => state.auth);
  const { assetId, chatId } = router.query;
  const [paymentIntentData, setPaymentIntentData] = useState(null);
  const paymentMethod='card';

  const handleStripePaymentKeys = async () => {
    try {
      const payload = {
        billingAddressId: selectedAddressId,
        // chatId: chatId,
        assetId: assetId,
        paymentType: 'PAYMENT_ELEMENT',
      };
      const response = await getStripePaymentKeys(payload, myLocation);
      setPaymentIntentData(response.data.paymentIntentData);
    } catch (error) {
      console.log(error, 'error');
    } 
  };

  useEffect(() => {
    if (paymentMethod === 'card' && selectedAddressId) {
      handleStripePaymentKeys();
    }
  }, [paymentMethod,selectedAddressId]);
  
  return (
    <form>
      <div className="border border-tertiary-light dark:border-border-tertiary-dark rounded-lg p-4 my-4 dark:text-white lg:mb-0">
        <div
          className={`flex space-x-2  flex-col items-start ${paymentMethod === 'card' ? 'mb-2' : 'mb-0 '} mobile:!mb-0`}
        >
          {!!paymentIntentData && <StripeDesktopPaymentForm  paymentIntentData={paymentIntentData} selectedAddressId={selectedAddressId} />}

        </div>
      </div>
    </form>
  );
}
