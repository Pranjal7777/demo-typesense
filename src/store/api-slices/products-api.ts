import { rootApi } from './root-api';
import { AUTH_URL_V1, AUTH_URL_V2, AUTH_URL_V3, DEFAULT_LOCATION } from '../../config/index';

import {
  ResponseGetAllBannersAndProductsPayload,
  ResponseGetAllHighlightedProductsPayload,
  ResponseGetPrivacyPolicyDataPayload,
  ResponseGetRecentSearchDataPayload,
  ResponseSearchItemsPayload,
  ResponseSearchUsersPayload,
} from '@/store/types';
import {
  ADD_RECENT_SEARCH_DATA_URL,
  ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL,
  ADD_USER_TO_RECENT_SEARCH_URL,
  GET_ALL_BANNERS_AND_PRODUCTS_URL,
  GET_ALL_HIGHLIGHTED_PRODUCTS_URL,
  GET_PRIVACY_POLICY_DATA,
  GET_RECENT_SEARCH_DATA_URL,
  GET_REPORT_REASONS_URL,
  LIKE_AND_DISLIKE_PRODUCT_URL,
  SEARCH_PRODUCTS_AND_USERS_URL,
  SUBSCRIBE_TO_NEWS_LETTER_URL,
} from '@/api/endpoints';
import { FilterParameterResponse, PostReportPayloadType, PostReportResponse, ProductReportReasonType, ProductReportReasonTypeResponse } from '@/types/filter';

export const productsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBannersAndProducts: builder.query<
      ResponseGetAllBannersAndProductsPayload,
      { page: number; latitude: string; longitude: string; country: string }
    >({
      query: ({ page, latitude, longitude, country }) => ({
        url: `${AUTH_URL_V3}/${GET_ALL_BANNERS_AND_PRODUCTS_URL}/?page=${page}&lat=${
          latitude || DEFAULT_LOCATION.latitude
        }&long=${longitude || DEFAULT_LOCATION.longitude}&limit=10&country=${country || DEFAULT_LOCATION.countryName}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    getAllHighlightedProducts: builder.query<
      ResponseGetAllHighlightedProductsPayload,
      { page: number; latitude: string; longitude: string; country: string }
    >({
      query: ({ page, latitude, longitude, country }) => ({
        url: `${AUTH_URL_V3}/${GET_ALL_HIGHLIGHTED_PRODUCTS_URL}/?page=${page}&promoted=1&lat=${
          latitude || DEFAULT_LOCATION.latitude
        }&long=${longitude || DEFAULT_LOCATION.longitude}&limit=10&country=${country || DEFAULT_LOCATION.country}`,
        // url: `${AUTH_URL_V2}/${GET_ALL_HIGHLIGHTED_PRODUCTS_URL}/?page=${page}&promoted=1&lat=21.1959&long=72.8302`,
        method: 'GET',
      }),
    }),
    searchProductsAndUsers: builder.query<
      ResponseSearchItemsPayload | ResponseSearchUsersPayload,
      { serachQuery: string; IsUserOrItemFlag: string }
    >({
      query: ({ serachQuery, IsUserOrItemFlag }) => ({
        url: `${AUTH_URL_V2}/${SEARCH_PRODUCTS_AND_USERS_URL}/?searchItem=${serachQuery}${IsUserOrItemFlag}`,
        method: 'GET',
        // body:getGuestTokenConfig,
        keepUnusedDataFor: 0,
      }),
    }),
    getRecentSearchData: builder.query<ResponseGetRecentSearchDataPayload, void>({
      query: () => ({
        url: `${AUTH_URL_V1}/${GET_RECENT_SEARCH_DATA_URL}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    addRecentSearchData: builder.query<void, string>({
      query: (search) => ({
        url: `${AUTH_URL_V2}/${ADD_RECENT_SEARCH_DATA_URL}/?page=1&q=${search}&lat=21.1959&long=72.8302&cat_id=`,
        method: 'GET',
      }),
    }),
    addRecentSearchDataWithSingleProduct: builder.query<void, { assetId: string; search: string }>({
      query: ({ assetId, search }) => ({
        url: `${AUTH_URL_V2}/${ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL}/?assetId=${assetId}&q=${search}`,
        method: 'GET',
      }),
    }),
    addUserDataToRecentSearch: builder.mutation<void, { clickeduserId: string }>({
      query: ({ clickeduserId }) => ({
        url: `${AUTH_URL_V1}${ADD_USER_TO_RECENT_SEARCH_URL}`,
        method: 'POST',
        body: { clickeduserId: clickeduserId },
      }),
    }),
    subscribeToNewsLetter: builder.mutation<{ message: string }, string>({
      query: (email) => ({
        url: `${AUTH_URL_V1}/${SUBSCRIBE_TO_NEWS_LETTER_URL}`,
        method: 'POST',
        body: { email: email },
      }),
    }),
    likeAndDislikeProduct: builder.mutation<{ message: string }, { assetid: string; like: boolean; userId: string }>({
      query: (data) => ({
        url: `${AUTH_URL_V1}/${LIKE_AND_DISLIKE_PRODUCT_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    getPrivacyPolicyData: builder.query<ResponseGetPrivacyPolicyDataPayload, void>({
      query: (data) => ({
        url: `${AUTH_URL_V1}/${GET_PRIVACY_POLICY_DATA}/?userType=1&type=1&lan=en`,
        method: 'GET',
        body: data,
      }),
    }),
    getAllHighlightedProductsForFilter: builder.query<
      ResponseGetAllHighlightedProductsPayload,
      { page: number; latitude: string; longitude: string; country: string; catId: string }
    >({
      query: ({ page, latitude, longitude, country, catId }) => ({
        url: `${AUTH_URL_V2}/${GET_ALL_HIGHLIGHTED_PRODUCTS_URL}/?page=${page}&promoted=1&lat=${
          latitude || DEFAULT_LOCATION.latitude
        }&long=${longitude || DEFAULT_LOCATION.longitude}&limit=10&country=${
          country || DEFAULT_LOCATION.country
        }&cat_id=${catId}`,
        method: 'GET',
      }),
    }),
    getAllBannersAndProductsForFilter: builder.query<
      ResponseGetAllBannersAndProductsPayload,
      { page: number; latitude: string; longitude: string; country: string; catId: string }
    >({
      query: ({ page, latitude, longitude, country, catId }) => ({
        url: `${AUTH_URL_V2}/${GET_ALL_BANNERS_AND_PRODUCTS_URL}/?page=${page}&lat=${
          latitude || DEFAULT_LOCATION.latitude
        }&long=${longitude || DEFAULT_LOCATION.longitude}&limit=10&country=${
          country || DEFAULT_LOCATION.country
        }&cat_id=${catId}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    getFilterParameters: builder.query<FilterParameterResponse, void>({
      query: () => ({
        url: `${AUTH_URL_V1}/filterParameter`,
        method: 'GET',
      }),
    }),
    getReportReasons: builder.query<ProductReportReasonTypeResponse, void>({
      query: () => ({
        url: `${AUTH_URL_V1}/${GET_REPORT_REASONS_URL}`,
        method: 'GET',
      }),
    }),
    postReport: builder.mutation<PostReportResponse, PostReportPayloadType>({
      query: (body) => ({
        url: `${AUTH_URL_V1}/report`,
        method: 'POST',
        body: body,
      }),
    }),
  }),
});
