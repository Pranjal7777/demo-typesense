import { useStripe } from '@stripe/react-stripe-js';
import { useElements } from '@stripe/react-stripe-js';
import Button from '../ui/button';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { addressApi } from '@/store/api-slices/profile/address-api';
import { toast } from 'sonner';
import { CONFIRMANDPAY } from '@/constants/texts';

export default function DesktopPaymentAddCardBtn() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { data: addressData } = addressApi.useGetAllSavedAddressQuery();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      if (!stripe || !elements) {
        return;
      }

      if (!addressData) {
        toast.error('Please select an address');
        setIsLoading(false);
        return;
      }

      const data = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (data.paymentIntent?.status === 'succeeded') {
        router.push('/buy/success');
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div>
      {' '}
      <Button
        type="submit"
        isLoading={isLoading}
        isDisabled={!addressData}
        className={`lg:w-[50%]  lg:mt-6 min-w-[250px] cursor-pointer bg-[#1FD18E]  text-white !mb-0 mobile:fixed mobile:bottom-4 mobile:w-[90%] mobile:left-[50%] mobile:translate-x-[-50%] ${!addressData ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleSubmit}
      >
        {CONFIRMANDPAY}
      </Button>
    </div>
  );
}
