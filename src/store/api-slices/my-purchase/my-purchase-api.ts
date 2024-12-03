
import { FOLLOW, GET_ALL_PURCHASE, GET_PURCHASE_DETAILS, GET_DEAL_CANCEL_REASONS, POST_DEAL_CANCEL } from '@/api/endpoints';
import { rootApi } from '../root-api';
import { DealCancelReasonsResponse, PurchaseDetailsResponse, PurchaseResponse } from '@/store/types/my-purchase-types';

export const myPurchaseApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPurchases: builder.query<PurchaseResponse, { queryParams: string }>({
      query: ({ queryParams }) => ({
        url: `${GET_ALL_PURCHASE}?${queryParams}`,
        method: 'GET',
      }),
    }),
    getPurchasesDetails: builder.query<PurchaseDetailsResponse, { queryParams: string }>({
      query: ({ queryParams }) => ({
        url: `${GET_PURCHASE_DETAILS}?${queryParams}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    getDealCancelReasons: builder.query<DealCancelReasonsResponse, void>({
      query: () => ({
        url: `${GET_DEAL_CANCEL_REASONS}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    postDealCancel: builder.mutation({
      query: (body: {reason:string, orderId:string}) => ({
        url: `${POST_DEAL_CANCEL}`,
        method: 'POST',
        body: {
          reason: body.reason,
          orderId: body.orderId,
        },
      }),
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


