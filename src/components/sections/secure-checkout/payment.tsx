'use client';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import React, { useImperativeHandle } from 'react';
import FullScreenSpinner from '@/components/ui/full-screen-spinner';
import { useRouter } from 'next/router';

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
      router.push('/buy/success');
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
