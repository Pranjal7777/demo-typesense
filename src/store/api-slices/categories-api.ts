import { rootApi } from './root-api';
import { AUTH_URL_V1, AUTH_URL_V2} from '../../config/index';
import {  ResponseGetAllGrandParentCategoriesPayload,ResponseGetAllCategoriesPayload, ResponseGetSubCategoriesByParentIdPayload } from '@/store/types/categories-types';
import { GET_ALL_CATEGORIES_URL, GET_ALL_FILTERS_URL, GET_ALL_GRAND_PARENT_CATEGORIES_URL, GET_SUB_CATEGORIES_BY_ID_URL } from '@/api/endpoints';

export const categoriesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGrandParentCategories: builder.query<ResponseGetAllGrandParentCategoriesPayload,void>({
      query: () => ({
        url:`${AUTH_URL_V2}${GET_ALL_GRAND_PARENT_CATEGORIES_URL}/?&limit=100&set=0&status=1`,
        method:'GET',
        // body:getGuestTokenConfig,
      }),
    }),
    getAllCategories: builder.query<ResponseGetAllCategoriesPayload,void>({
      query: () => ({
        url:`${AUTH_URL_V1}${GET_ALL_CATEGORIES_URL}`,
        method:'GET',
        // body:getGuestTokenConfig,
      }),
    }),
    getSubCategoriesByParentId: builder.query<ResponseGetSubCategoriesByParentIdPayload,{parentId:string}>({
      query: ({parentId}) => ({
        url:`${AUTH_URL_V2}${GET_SUB_CATEGORIES_BY_ID_URL}/?parentId=${parentId}&trigger=1&country=India&set=0&limit=100`,
        method:'GET',
      }),
    }),
    getAllFilters: builder.query<ResponseGetSubCategoriesByParentIdPayload,void>({
      query: () => ({
        url:`${AUTH_URL_V1}${GET_ALL_FILTERS_URL}`,
        method:'GET',
      }),
    }),
  }),
});
