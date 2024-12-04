
import { ACCOUNT_ID, ALL, BUYER, FOLLOW, GET_ALL_SELLER_ASSETS, LINKED_WITH, OFFSET, SEARCH_QUERY, SELLER, SORT_BY, UNFOLLOW, USER_RATING, USER_REVIEWS } from '@/api/endpoints';
import { rootApi } from '../root-api';
import { AllRatingApiResponse, BuyerRatingApiResponse, ReviewApiResponse, SellerUserAssetResponse } from '@/store/types/seller-profile-type';

export const sellerProfileApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<SellerUserAssetResponse, { accountId?: string; page: number; search: string}>({
      query: ({ accountId, page,search }) => ({
        url: `${GET_ALL_SELLER_ASSETS}?${SEARCH_QUERY}=${search}&page=${page}${accountId ? `&${ACCOUNT_ID}=${accountId}`:''}`,
        method: 'GET',
      }),
    }),
    getAllReviews: builder.query<ReviewApiResponse, { accountId?: string;}>({
      query: ({accountId}) => ({
        url: `${USER_REVIEWS}?${SORT_BY}=1&${LINKED_WITH}=${ALL}${accountId ? `&${ACCOUNT_ID}=${accountId}`:''}&${OFFSET}=0`,
        method: 'GET',
      }),
    }),
    getBuyerReviews: builder.query<ReviewApiResponse, { accountId?: string;}>({
      query: ({accountId}) => ({
        url: `${USER_REVIEWS}?${SORT_BY}=1&${LINKED_WITH}=${BUYER}${accountId ? `&${ACCOUNT_ID}=${accountId}`:''}&${OFFSET}=0`,
        method: 'GET',
      }),
    }),
    getSellerReviews: builder.query<ReviewApiResponse, { accountId?: string;}>({
      query: ({accountId}) => ({
        url: `${USER_REVIEWS}?${SORT_BY}=1&${LINKED_WITH}=${SELLER}${accountId ? `&${ACCOUNT_ID}=${accountId}`:''}&${OFFSET}=0`,
        method: 'GET',
      }),
    }),
    getAllRatings: builder.query<AllRatingApiResponse, { accountId?: string;}>({
      query: ({accountId}) => ({
        url: `${USER_RATING}?${LINKED_WITH}=${ALL}${accountId ? `&${ACCOUNT_ID}=${accountId}`:''}`,
        method: 'GET',
      }),
    }),
    getBuyerRatings: builder.query<BuyerRatingApiResponse, { accountId?: string;}>({
      query: ({accountId}) => ({
        url: `${USER_RATING}?${LINKED_WITH}=${BUYER}${accountId ? `&${ACCOUNT_ID}=${accountId}`:''}`,
        method: 'GET',
      }),
    }),
    getSellerRatings: builder.query<BuyerRatingApiResponse, { accountId?: string;}>({
      query: ({accountId}) => ({
        url: `${USER_RATING}?${LINKED_WITH}=${SELLER}${accountId ? `&${ACCOUNT_ID}=${accountId}`:''}`,
        method: 'GET',
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
    postUnFollow: builder.mutation({
      query: (id: string) => ({
        url: `${UNFOLLOW}`,
        method: 'POST',
        body: {
          followingId: id,
        },
      }),
    }),
  }),
});


