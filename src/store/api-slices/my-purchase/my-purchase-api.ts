
import { FOLLOW, GET_ALL_PURCHASE, GET_PURCHASE_DETAILS } from '@/api/endpoints';
import { rootApi } from '../root-api';
import { PurchaseDetailsResponse, PurchaseResponse } from '@/store/types/my-purchase-types';

export const myPurchaseApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPurchases: builder.query<PurchaseResponse, { queryParams: string, }>({
      query: ({ queryParams }) => ({
        url: `${GET_ALL_PURCHASE}?${queryParams}`,
        method: 'GET',
      }),
    }),
    getPurchasesDetails: builder.query<PurchaseDetailsResponse, { queryParams: string, }>({
      query: ({ queryParams }) => ({
        url: `${GET_PURCHASE_DETAILS}?${queryParams}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),

    postFollow: builder.mutation({
      query: (id: string) => ({
        url: `${FOLLOW}`,
        method: 'POST',
        body: {
          followingId: id,
        },
      }),
    }),
  }),
});


