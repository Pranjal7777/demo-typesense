import { Product } from '../types';
import { MyFavoritesResponseType } from '../types/my-favorites';
import { rootApi } from './root-api';
import {
  GET_ALL_FAVORITES,
} from '@/api/endpoints';

export const myFavoritesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFavorites: builder.query<MyFavoritesResponseType, { query: string }>({
      query: ({ query }) => ({
        url: `${GET_ALL_FAVORITES}/?${query}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});
