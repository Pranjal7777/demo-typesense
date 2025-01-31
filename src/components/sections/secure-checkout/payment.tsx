'use client';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import React, { useImperativeHandle } from 'react';
import FullScreenSpinner from '@/components/ui/full-screen-spinner';
import { useRouter } from 'next/router';
import showToast from '@/helper/show-toaster';

export const PaymentSection = React.forwardRef<HTMLFormElement>((props, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  useImperativeHandle<any, { handleSubmit: () => Promise<void> }>(ref, () => ({
    handleSubmit
  }));

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }
    const data= await stripe.confirmPayment({
      elements,
      redirect:'if_required'
    });

    if(data.paymentIntent?.status === 'succeeded'){
              showToast(
                { message: 'Payment successful. Please wait we will redirect you to chat', messageType: 'success' },
                () => router.push('/chat')
              );

      // router.push('/chat');
      // router.push('/checkout/success');
    }
  };

  if (!stripe || !elements) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="">
      <div className="mt-2">
        <form ref={ref} onSubmit={handleSubmit}>
          <PaymentElement />
        </form>
      </div>
    </div>
  );
});

PaymentSection.displayName = 'PaymentSection';
