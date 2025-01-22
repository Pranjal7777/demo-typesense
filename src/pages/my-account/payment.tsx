import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';

const AddBankAccount = () => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Fetch publicKey and clientSecret from the backend
    const fetchSetupIntent = async () => {
      const response = await fetch('https://api.platform.kwibal.com/v1/setupIntentElement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            "Bearer eyJhbGciOiJSU0EtT0FFUCIsImN0eSI6IkpXVCIsImVuYyI6IkExMjhHQ00iLCJ0eXAiOiJKV1QifQ.NP8oi5ODy4Zch4sKD28uNlplvpxpp8yl0dX8R5TW0gAz52w6TOWt-ye5Xt-ii3b7U0rWFHvVui1dl-GwFuMeOe97QUSnncNQFURmiA37EjJXLNe-ynG3MvxOd6AiFL_18zu36SlGFbwPz0Vi8w6nj7LQJdYrvLhVC9K14N8NO9Y.KEW6mlOMiTyat_8e.1HjuA26MzqBxehP96rjFsBzboB-OPFU_6L4UUG-jrioG97XOqdl0YzZmOWPbB1fz_if7U3wAvClAwEXqhmg09W4TTBWLpK_xqYkXskEE1LhwVeAVDPr_7NLvqC-TNfN9S5mpl6ZsUZBtua0Y9l1lEGnEA3Qk46clv1hHFHpJOgO93HNqwP85v0kbH1nkZibevHmn--uF768vXkhtdkucUFShv6ZKhubedzTUQPJJH0a3knzJRBEMlryKzFHbSsCKiun6um_lXWHeb-GL-yk8zZ3Czbl0Sep8e4Jenbm3QU7V63_mZkJC9VMkLQr0EJI3iuZVwBNgeNQ-fhk1rRau_9hp-RjqfOEzhS06uKCBTMp5r7erMMJ0z2C74pr30hSLbMr8vOww_Im71tRWYLuVMTO2qiyAjPwC_ldxA-ikL7lCUoCtUrlfvMh_ABNqtFmqO-M-IenDhBNwKIRg3IZSxcchTUMyNpR2Yji6ZAO2ob0MvgkgyIik5K_hh_lZirug0Y9agL1QogSOUGNCopCIa6H41yumrTSImdSGYRf9geoPGhKcfgG_7b2RsZ19vwEf1VDnc3KAF7TIldmUnzWAR_L2Fnib8xLjmAVtOKkFVVWqnquMQiE-Rfe4YMs9WfGY4pHCqkBnuveYYekryTEP-ax2bz0LNxo5lUXDeMzPMl58LjbLjsbYrx4RyLwFTFCLIHWXYR2adTPdVXPn7ZpDhwiNEcTBN1V0iqKBS-m6V__sj1u6uRUVyJU_GWlXMMPa9MheqXEE-mGgTljhMWimg_efPN9TDc5aor8kWePeaUpq0TMQJJYqOeu_Pid8iDWzfAJrlqQMpIhtkiIjOsFr4GtwYHYuU4cJ5BcpIBHki1ybl2IjCrfgaPnjdbW0hlXCcpjZyRj0X1Ljsk7TPcIN-dtFOcHK3VshW44cq89YDepfOjoNHU2exvgVY3exjlpPg9EHMZLQlDK2izBw6rqKy_KbmDiBBbpXhWb_OXG3kDLd_Od2VwJUeeIXUXlFZ948zy5r6m5skQVKCyLo30doL_76PdkqpOl6akD9W97fSHjV45bjSRW16yVQmFKxUWt04h-a9u-5Vq6Z0EjBaWXkJ5-9O2dJKz9vlqBE6zarQvQ9oXKc_yeWd0ousna0stMFoVerYU0prGGPRekXspH5mu2MUTv_-XMk3QiiW2Ffb9iZL4OGkeGNvMZFcLnDSMMM2YMoUSR0nMt_yslCDlqjm4uS9n8qcO8M1GPA_sv0vy3NS1BXOqbJ-FprEK6mQjXiOFVq9MjMnS_M.HPMJW9u3u0YJi3jzzqWucg",
          lan: 'en',
        },
        body: JSON.stringify({
          userId: '6790c0f9617384659e64d033',
          accountType: 'individual',
          companyName: 'tesstr8761',
          email: 'teststripe@gmail.co',
          metadata: {},
          name: 'test stripe',
          phoneNumber: '7777777777',
        }),
      });

    //   {
    //       userId: '67499cb87ca704dd548109e9',
    //       accountType: 'individual',
    //       companyName: 'MirMos6668',
    //       email: 'mosarof@appscrip.co',
    //       metadata: {},
    //       name: 'Mir Mosarof',
    //       phoneNumber: '9382161078',
    //     }

      const data = await response.json();
      setStripePromise(loadStripe(data.data.publicKey)); // Dynamically load the publishable key
      setClientSecret(data.data.clientSecret); // Set the client secret for the SetupIntent
    };

    fetchSetupIntent();
  }, []);

  if (!stripePromise || !clientSecret) return <p>Loading...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <BankAccountForm />
    </Elements>
  );
};

const BankAccountForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: 'https://your-website.com/return',
      },
    });

    if (error) {
      console.error('Error:', error.message);
    } else {
      console.log('SetupIntent success:');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>
        Submit
      </button>
    </form>
  );
};

export default AddBankAccount;
