import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import DesktopPaymentAddCardBtn from './desktop-payment-addcardbtn';
import { useTheme } from '@/hooks/theme';
import { CARDS } from '@/constants/texts';
import { paymentIntentT } from '@/store/types/checkout-type';

export default function StripeDesktopPaymentForm({
  paymentIntentData
}: {
  paymentIntentData: paymentIntentT;
  selectedAddressId: string;
}) {
  const stripePromise = loadStripe(paymentIntentData.publicKey);
  const {theme}=useTheme();
  const [brandColor, setBrandColor] = useState(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim() || '#6d3ec1';
  });

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim();
    setBrandColor(color || '#6d3ec1');
  }, [theme]);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: paymentIntentData.clientSecret,
        customerSessionClientSecret: paymentIntentData.customer,
        loader: 'auto',
        appearance: {
          theme: theme ? 'night' : 'stripe',
          variables:{
            colorPrimary:brandColor,
            
          }
        },
      }}
    > <div className='font-semibold'>{CARDS} </div>
      <PaymentElement  className='w-full mt-4 !ml-0'/>
      <DesktopPaymentAddCardBtn />
    
    </Elements>
  );
}
