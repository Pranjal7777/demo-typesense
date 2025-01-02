import { rootApi } from './root-api';
import { AUTH_URL_V1 } from '@/config';
import { GUEST_REFRESH_TOKEN_URL } from '@/api/endpoints';
import { StripePaymentParams, PaymentResponse, ChatIdentifierParams } from '../types/payment-types';

export const paymentApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatIdentifier: builder.query<any, ChatIdentifierParams>({
      query: ({ sellerId, assetId, buyerId, isExchange }) => {
        const identifier = `${assetId}_${sellerId}_${buyerId}`;
        return {
          url: `${AUTH_URL_V1}/groupChat`,
          method: 'GET',
          params: {
            identifier: encodeURIComponent(identifier),
            isExchange,
          },
        };
      },
    }),

    createStripePayment: builder.mutation<PaymentResponse, StripePaymentParams>({
      query: (payload) => ({
        url: `${AUTH_URL_V1}/payment/buyDirect/v2`,
        method: 'POST',
        body: payload,
      }),
      transformErrorResponse: (response: { status: number; data: any }) => {
        if (response.status === 401) {
          return { message: 'Session expired. Please login again.' };
        }
        return response.data;
      },
    }),

    refreshGuestToken: builder.mutation<any, any>({
      query: (config) => ({
        url: `${AUTH_URL_V1}/${GUEST_REFRESH_TOKEN_URL}`,
        method: 'POST',
        body: config,
      }),
    }),
  }),
});

export const { useGetChatIdentifierQuery, useCreateStripePaymentMutation, useRefreshGuestTokenMutation } = paymentApi;
