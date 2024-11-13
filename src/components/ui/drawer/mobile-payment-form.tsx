import { Elements } from '@stripe/react-stripe-js';
import { PaymentSection } from '@/components/sections/secure-checkout/payment';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useTheme } from '@/hooks/theme';

interface MobilePaymentFormProps {
  showAddPaymentFormView: boolean;
  paymentIntentData: {
    ephemeralSecret: string;
    clientSecret: string;
    publicKey: string;
  };
  setShowAddPaymentFormView: (_show: boolean) => void;
  setShowPaymentForm: (_show: boolean) => void;
  ref?: React.RefObject<any>;
}

export const MobilePaymentForm = React.forwardRef<any, MobilePaymentFormProps>(({ paymentIntentData }, ref) => {
  const stripePromise = loadStripe(paymentIntentData?.publicKey);
  const { theme } = useTheme();
  const [brandColor, setBrandColor] = useState(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim() || '#6d3ec1';
  });

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim();
    setBrandColor(color || '#6d3ec1');
  }, [theme]);
  return (
    <>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: paymentIntentData.clientSecret,
          appearance: {
            theme: theme ? 'night' : 'stripe',
            variables: {
              colorPrimary: brandColor,
            },
          },
        }}
      >
        <PaymentSection ref={ref} />
      </Elements>
    </>
  );
});

MobilePaymentForm.displayName = 'MobilePaymentForm';
