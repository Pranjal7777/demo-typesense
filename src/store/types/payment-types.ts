export interface PaymentResponse {
    data: {
      paymentIntentData: {
        clientSecret: string;
        publicKey: string;
        customer: string;
        ephemeralKey: string;
        ephemeralSecret: string;
      };
    };
    message: string;
    status: number;
  }

  export interface ChatIdentifierParams {
    sellerId: string;
    assetId: string;
    buyerId: string;
    isExchange: boolean;
  }
  
  export interface StripePaymentParams {
    billingAddressId: string;
    chatId: string | string[];
    assetId: string | string[];
    paymentType: string;
  }
  
