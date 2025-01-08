import { rootApi } from './root-api';
import { GET_ALL_SELLER_ASSETS } from '@/api/endpoints';

type SimilarProduct = {
  result: any;
  Totalcount: number;
};


const UserProductListing = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProductsListing: builder.query<SimilarProduct, { accoundId: string, page: number}>({
      query: ({accoundId, page}) => ({  
        url: `${GET_ALL_SELLER_ASSETS}/?accountId=${accoundId}&page=${page}`,
        method: 'GET'
      }),
    }),
  }),
});

export default UserProductListing;
