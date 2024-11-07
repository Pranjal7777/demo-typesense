import { rootApi } from './root-api';
import {AUTH_URL_V2 } from '@/config';
import { ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL, LIKE_AND_DISLIKE_PRODUCT_URL } from '@/api/endpoints';

type ProductDetail = {
  id?: string;
};
const pdpApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductsDetail: builder.query<ProductDetail, {id: string}>({
      query: () => ({
        url: `${LIKE_AND_DISLIKE_PRODUCT_URL}`,
        method: 'GET',
      }),

      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
    }),
    likeProduct: builder.mutation({
      query: ({id}) =>({
        url: `${AUTH_URL_V2}/${ADD_RECENT_SEARCH_DATA_WITH_SINGLE_PRODUCT_SEARCH_URL}/?assetId=${id}`,
        method:'POST',
        body: id
      })
    })
  }),

});


export default pdpApi;