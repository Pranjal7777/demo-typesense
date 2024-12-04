import { rootApi } from './root-api';
import {
  GET_ALL_FAVORITES,
} from '@/api/endpoints';

export const myFavoritesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFavorites: builder.query<any, {query:string}>({
      query: ({query}) => ({
        url: `${GET_ALL_FAVORITES}/?${query}`,
        method: 'GET',
      }),
    }),
  }),
});
