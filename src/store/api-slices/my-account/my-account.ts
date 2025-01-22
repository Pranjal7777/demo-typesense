import {
  GET_ALL_PURCHASE,
  GET_ALL_SAVED_ACCOUNT,
  POST_DEAL_CANCEL,
} from '@/api/endpoints';
import { rootApi } from '../root-api';
import { PurchaseResponse } from '@/store/types/my-purchase-types';
import { SavedAccountResponse } from '@/store/types/my-account';

export const myAccountApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAccounts: builder.query<SavedAccountResponse, { userId: string }>({
      query: ({ userId }) => ({
        url: `${GET_ALL_SAVED_ACCOUNT}?userId=${userId}`,
        method: 'GET',
      }),
    }),
    postDealCancel: builder.mutation({
      query: (body: { reason: string; orderId: string }) => ({
        url: `${POST_DEAL_CANCEL}`,
        method: 'POST',
        body: {
          reason: body.reason,
          orderId: body.orderId,
        },
      }),
    }),
  }),
});
